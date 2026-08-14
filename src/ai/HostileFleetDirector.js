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

  /** Closest task-force hull to `originPos`, biased toward Meridian and toward hulls
   * already hurting. Shared scoring so air/sub target picks (below) stay consistent
   * with the surface action groups' doctrine instead of drifting from a second,
   * independently-tuned copy of the same bias. */
  _pickTarget(originPos, tf, ctx) {
    let best = null;
    let bestScore = -Infinity;
    // The player's emissions posture gates how far the enemy can localize Meridian:
    // radiating a big radar array, they hold you out to ~65 km; run EMCON-silent and
    // that collapses toward your passive signature (~27 km), so a quiet ship at range
    // simply drops off their targeting solution and they prosecute a radiating escort
    // instead. This is what gives the EMCON decision real defensive teeth.
    const playerAcqRange = 65000 * (ctx.playerDetectability ?? 1);
    for (const ship of tf) {
      const d = distFlat(originPos, ship.group.position);
      const isPlayer = ship === ctx.playerShip;
      const acqRange = isPlayer ? playerAcqRange : 60000;
      if (d > acqRange) continue; // can't build a firing solution on this hull from here
      // Base scaled for over-the-horizon ranges so the nearest holdable hull still
      // wins cleanly at tens of km.
      let score = 90000 - d;
      if (ship.damage?.fire > 0.1) score += 6000;
      if (ship.damage?.structurePct < 0.7) score += 4000;
      if (isPlayer) score += 2500; // prefer Meridian slightly, when they can hold her
      if (score > bestScore) { bestScore = score; best = ship; }
    }
    return best;
  }

  /**
   * @param {object} ctx
   *   hostiles: Entity[]
   *   taskForce: CrewedShip[]  (Meridian + escorts that are alive)
   *   dt
   */
  update(ctx) {
    const allHostiles = (ctx.hostiles || []).filter((h) => h.alive && !h.destroyed && h.iff !== 'FRIENDLY');
    const surfaces = allHostiles.filter((h) => String(h.domain).toUpperCase() === 'SURFACE');
    const airSub = allHostiles.filter((h) => String(h.domain).toUpperCase() !== 'SURFACE');
    const tf = (ctx.taskForce || []).filter((s) => s.alive !== false && !s.destroyed);

    if (!tf.length) {
      this.groups = [];
      for (const h of allHostiles) h._fleet = null;
      return;
    }

    // --- Air / subsurface hostiles: aircraft and submarines don't stage coordinated
    // salvos the way a surface action group does, so each contact just gets its own
    // "who am I actually going after" pick — same target-selection doctrine as the
    // surface groups below (reused via _pickTarget), so an inbound bandit or a
    // stalking submarine sometimes goes after an escort instead of fixating on
    // Meridian, matching what EnemyShip.js already does for surface threats.
    for (const h of airSub) {
      const originPos = h.physics?.position || h.position;
      const targetShip = this._pickTarget(originPos, tf, ctx);
      h._fleet = targetShip ? { targetShip, targetPos: targetShip.group.position } : null;
    }

    if (!surfaces.length) {
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
      const best = this._pickTarget(leader.physics.position, tf, ctx);
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
