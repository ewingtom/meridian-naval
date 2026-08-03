import * as THREE from 'three';
import { ShipBrain, Role } from './ShipBrain.js';

/**
 * Drives a CrewedShip's helm and/or weapons when no human is manning that station.
 * Perception + doctrine live in ShipBrain; this class actuates throttle/rudder and
 * magazines so escorts visibly screen, prosecute, and cover the lead.
 */
export class ShipAutopilot {
  constructor(ship, { role = 'escort', stationOffset = null } = {}) {
    this.ship = ship;
    this.role = role; // 'escort' | 'lead' — maps into ShipBrain base role
    this.stationOffset = stationOffset;
    this.helmEnabled = true;
    this.weaponsEnabled = true;
    this.breakFormation = false;
    this._engageTargetId = null;
    this._fireCooldown = Math.random() * 3;
    this._engaged = false;
    this.brain = new ShipBrain(ship, {
      role: role === 'lead' ? Role.LEAD : Role.SCREEN,
    });
  }

  setEngageTarget(id) {
    this._engageTargetId = id || null;
  }

  /**
   * Full tick: perceive → decide → helm + weapons.
   * Prefer this over calling updateHelm/updateWeapons separately.
   */
  update(dt, ctx) {
    const brainCtx = {
      hostiles: ctx.hostiles,
      ships: ctx.ships,
      playerShip: ctx.playerShip || ctx.anchorShip,
      sharedTargetId: this._engageTargetId || ctx.sharedTargetId,
      weaponsPolicy: ctx.weaponsPolicy ?? 'free',
      waypoint: ctx.waypoint,
      inboundBearing: ctx.inboundBearing,
      allies: ctx.allies,
    };
    this.brain.perceive(brainCtx);
    const decision = this.brain.decide(dt, brainCtx);

    if (decision.chatter && ctx.onBrainChatter) {
      ctx.onBrainChatter(this.ship, decision.chatter);
    }

    if (this.helmEnabled) {
      this._applyHelm(dt, decision, ctx);
    }
    if (this.weaponsEnabled) {
      this._applyWeapons(dt, decision, ctx);
    }
  }

  updateHelm(dt, ctx) {
    // Legacy entry — run brain with whatever context we have, helm only.
    this.brain.perceive({
      hostiles: ctx.hostiles || [],
      playerShip: ctx.anchorShip,
      sharedTargetId: this._engageTargetId,
      weaponsPolicy: ctx.weaponsPolicy ?? 'free',
      waypoint: ctx.waypoint,
    });
    const decision = this.brain.decide(dt, {
      weaponsPolicy: ctx.weaponsPolicy ?? 'free',
      sharedTargetId: this._engageTargetId,
    });
    if (this.breakFormation && ctx.engageWorldPos) {
      decision.helmMode = 'close';
      decision.aim = { position: ctx.engageWorldPos, getAimPoint: (o) => o.copy(ctx.engageWorldPos) };
    }
    this._applyHelm(dt, decision, ctx);
  }

  updateWeapons(dt, ctx) {
    this.brain.perceive({
      hostiles: ctx.hostiles || [],
      sharedTargetId: this._engageTargetId || ctx.sharedTargetId,
      weaponsPolicy: ctx.weaponsPolicy ?? 'free',
      playerShip: ctx.playerShip,
    });
    const decision = this.brain.decide(dt, {
      weaponsPolicy: ctx.weaponsPolicy ?? 'free',
      sharedTargetId: this._engageTargetId || ctx.sharedTargetId,
    });
    this._applyWeapons(dt, decision, ctx);
  }

  _applyHelm(dt, decision, ctx) {
    const phys = this.ship.physics;
    let throttle = 0;
    let rudder = 0;
    const mode = decision.helmMode;
    const anchorShip = ctx.anchorShip;
    const waypoint = ctx.waypoint;

    if (mode === 'hold') {
      throttle = 0.15;
      rudder = 0;
      this.ship.setCommand(throttle, rudder);
      return;
    }

    if (mode === 'cover' && decision.aim === null && anchorShip) {
      // Shoulder up on the threatened quarter of the lead.
      const offset = (this.stationOffset || new THREE.Vector3(-280, 0, -40)).clone();
      offset.x *= 0.55;
      offset.z *= 0.55;
      const desired = offset.applyQuaternion(anchorShip.group.quaternion).add(anchorShip.group.position);
      ({ throttle, rudder } = this._steerTo(desired, phys, {
        cruise: 0.85,
        arrive: 50,
      }));
      this.ship.setCommand(throttle, rudder);
      return;
    }

    if ((mode === 'close' || this.breakFormation) && (decision.aim || ctx.engageWorldPos)) {
      const targetPos = decision.aim?.getAimPoint
        ? decision.aim.getAimPoint(new THREE.Vector3())
        : (decision.aim?.position || ctx.engageWorldPos);
      if (targetPos) {
        const desiredRange = decision.desiredRange || 2200;
        const to = new THREE.Vector3().subVectors(targetPos, phys.position);
        const dist = Math.hypot(to.x, to.z);
        // Stand off at missile envelope — don't charge into gun range like a WWII scrap.
        if (dist > desiredRange * 1.15) {
          ({ throttle, rudder } = this._steerTo(targetPos, phys, { cruise: 0.9, arrive: desiredRange }));
        } else if (dist < desiredRange * 0.7) {
          // Open the range — reverse / yaw away.
          const away = phys.position.clone().addScaledVector(to.set(-to.x, 0, -to.z).normalize(), 400);
          ({ throttle, rudder } = this._steerTo(away, phys, { cruise: 0.55, arrive: 80 }));
        } else {
          // Beam the contact for a clean VLS shot.
          const side = new THREE.Vector3(-to.z, 0, to.x).normalize().multiplyScalar(this.brain._salvoSide * 350);
          const beam = targetPos.clone().add(side);
          ({ throttle, rudder } = this._steerTo(beam, phys, { cruise: 0.45, arrive: 120 }));
        }
        this.ship.setCommand(throttle, rudder);
        return;
      }
    }

    if (mode === 'transit' || this.role === 'lead') {
      const target = waypoint || phys.position.clone().addScaledVector(phys.forward, 100);
      ({ throttle, rudder } = this._steerTo(target, phys, { cruise: 0.7, arrive: 200, leadConvention: true }));
      this.ship.setCommand(throttle, rudder);
      return;
    }

    // Default: formation screen
    if (this.role === 'escort' && anchorShip) {
      const offset = this.brain.screenOffset(this.stationOffset) || this.stationOffset;
      const desired = offset.clone()
        .applyQuaternion(anchorShip.group.quaternion)
        .add(anchorShip.group.position);
      const toDesired = new THREE.Vector3().subVectors(desired, phys.position);
      const dist = toDesired.length();
      if (dist > 8) {
        const desiredHeading = Math.atan2(-toDesired.x, -toDesired.z);
        let diff = desiredHeading - phys.heading;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        rudder = THREE.MathUtils.clamp(diff * 1.3, -1, 1);
        const anchorSpeedFrac = anchorShip.physics.speed / anchorShip.physics.maxSpeedMs;
        throttle = THREE.MathUtils.clamp(anchorSpeedFrac + THREE.MathUtils.clamp((dist - 40) / 200, 0, 0.5), -1, 1);
      } else {
        rudder = 0;
        throttle = anchorShip.physics.speed / anchorShip.physics.maxSpeedMs;
      }
    }
    this.ship.setCommand(throttle, rudder);
  }

  _steerTo(targetPos, phys, { cruise = 0.7, arrive = 100, leadConvention = false } = {}) {
    const toTarget = new THREE.Vector3().subVectors(targetPos, phys.position);
    const dist = Math.hypot(toTarget.x, toTarget.z);
    if (dist < arrive * 0.35) return { throttle: 0.2, rudder: 0 };
    const desiredHeading = leadConvention
      ? Math.atan2(toTarget.x, toTarget.z)
      : Math.atan2(-toTarget.x, -toTarget.z);
    let diff = desiredHeading - phys.heading;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    const rudder = THREE.MathUtils.clamp(diff * 1.25, -1, 1);
    const throttle = dist > arrive ? cruise : cruise * 0.45;
    return { throttle, rudder };
  }

  _applyWeapons(dt, decision, ctx) {
    if (!this.weaponsEnabled) return;
    this._fireCooldown -= dt;
    const mp = this.ship.mountPoints;
    const fireWeapon = ctx.fireWeapon;
    const onEngage = ctx.onEngage;
    const onDisengage = ctx.onDisengage;

    const aim = decision.aim;
    if (aim && !this._engaged) {
      this._engaged = true;
      onEngage?.(this.ship, aim);
    } else if (!aim && this._engaged) {
      this._engaged = false;
      onDisengage?.(this.ship);
    }

    if (this._fireCooldown > 0 || !decision.fire || !aim || !decision.munition) return;
    if (!mp) return;

    // Respect damage — mission-killed / firepower-killed ships stay quiet.
    if (this.ship.damage && !this.ship.damage.weaponsOnline) return;

    let fromLocal = mp.gunBarrelTip;
    if (decision.munition === 'playerMissile' || decision.munition === 'playerSam' || decision.munition === 'playerLacm') {
      fromLocal = mp.missileTubes?.[0] || mp.gunBarrelTip;
    } else if (decision.munition === 'playerTorpedo') {
      fromLocal = mp.missileTubes?.[2] || mp.missileTubes?.[0] || mp.gunBarrelTip;
    }
    if (!fromLocal) return;

    const from = this.ship.getMountWorld(fromLocal, new THREE.Vector3());
    const targetPos = aim.getAimPoint
      ? aim.getAimPoint(new THREE.Vector3())
      : (aim.position?.clone?.() || aim.position);
    if (!targetPos) return;

    fireWeapon?.(decision.munition, from, targetPos.clone(), this.ship, aim);

    // Cadence by munition — missiles are deliberate; guns chatter.
    if (decision.munition === 'playerSam') this._fireCooldown = 4.5 + Math.random() * 2.5;
    else if (decision.munition === 'playerMissile') this._fireCooldown = 9 + Math.random() * 5;
    else if (decision.munition === 'playerTorpedo') this._fireCooldown = 12 + Math.random() * 4;
    else this._fireCooldown = 2.0 + Math.random() * 1.2;
  }
}
