import * as THREE from 'three';

/**
 * Hostile surface-group coordinator.
 *
 * Enemy ships no longer hunt Meridian in isolation — each frame we cluster hostiles
 * into surface action groups, pick a primary target among the player's task force,
 * and stagger ASM salvos so the player sees coordinated pressure (not random gun spam).
 */

function distFlat(a, b) {
  return Math.hypot(a.x - b.x, a.z - b.z);
}

export class HostileFleetDirector {
  constructor() {
    this.groups = []; // [{ leader, members, targetShip, salvoT }]
    this._scratch = new THREE.Vector3();
  }

  /**
   * @param {object} ctx
   *   hostiles: Entity[]
   *   taskForce: CrewedShip[]  (Meridian + escorts that are alive)
   *   dt
   */
  update(ctx) {
    const surfaces = (ctx.hostiles || []).filter(
      (h) => h.alive && !h.destroyed && String(h.domain).toUpperCase() === 'SURFACE' && h.iff !== 'FRIENDLY'
    );
    const tf = (ctx.taskForce || []).filter((s) => s.alive !== false && !s.destroyed);
    if (!surfaces.length || !tf.length) {
      this.groups = [];
      return;
    }

    // Greedy clustering by proximity (~2.2 km).
    const unassigned = new Set(surfaces);
    const groups = [];
    while (unassigned.size) {
      const seed = unassigned.values().next().value;
      unassigned.delete(seed);
      const members = [seed];
      for (const other of [...unassigned]) {
        if (distFlat(seed.physics.position, other.physics.position) < 2200) {
          members.push(other);
          unassigned.delete(other);
        }
      }
      // Leader = healthiest / largest (prefer DDG names).
      members.sort((a, b) => {
        const sa = (/DDG/i.test(a.name) ? 2 : 0) + (a.damage?.structurePct ?? 1);
        const sb = (/DDG/i.test(b.name) ? 2 : 0) + (b.damage?.structurePct ?? 1);
        return sb - sa;
      });
      const leader = members[0];
      // Target: closest task-force hull to the leader, with a bias toward the damaged lead.
      let best = null;
      let bestScore = -Infinity;
      for (const ship of tf) {
        const d = distFlat(leader.physics.position, ship.group.position);
        let score = 8000 - d;
        if (ship.damage?.fire > 0.1) score += 600;
        if (ship.damage?.structurePct < 0.7) score += 400;
        if (ship === ctx.playerShip) score += 250; // prefer Meridian slightly
        if (score > bestScore) { bestScore = score; best = ship; }
      }
      groups.push({
        leader,
        members,
        targetShip: best,
        salvoPhase: (groups.length * 1.7) % 8,
      });
    }
    this.groups = groups;

    // Stamp doctrine onto each hostile for EnemyShip.update to consume.
    for (const g of groups) {
      const targetPos = g.targetShip?.group?.position || null;
      const n = g.members.length;
      g.members.forEach((ship, i) => {
        ship._fleet = {
          leaderId: g.leader.id,
          isLeader: ship === g.leader,
          targetShip: g.targetShip,
          targetPos,
          memberIndex: i,
          memberCount: n,
          // Stagger ASM: leader shoots first, wingmen delay 3–7 s.
          missileDelay: i * (3.2 + (ship.id % 5) * 0.4),
          preferMissile: true,
          gunOnlyInsideM: 1600,
        };
      });
    }
    // Clear fleet stamp on hostiles that weren't grouped (shouldn't happen).
    for (const h of surfaces) {
      if (!h._fleet) h._fleet = null;
    }
  }
}
