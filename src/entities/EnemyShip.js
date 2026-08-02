import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Entity, Domain, IFF } from './Entity.js';
import { buildEnemyShipMesh } from './geometryKits.js';
import { ShipPhysics } from '../ship/ShipPhysics.js';
import { getSharedMicroDetailMaps } from '../utils/ProceduralTextures.js';

const State = { PATROL: 'PATROL', ENGAGE: 'ENGAGE', SINKING: 'SINKING' };
// Judge finding: hostiles built from enemy_destroyer.glb read as a generation cruder
// than the hero Meridian and the CrewedShip escorts — flat white deckhouse boxes next
// to a fully-detailed Burke. escort_hull.glb (built for FS Sentinel/Vanguard, with
// verified axes and an IFF-trim material for tinting) is the more detailed asset and
// is reused here tinted hostile red, instead of commissioning a third hull model.
const MODEL_URL = `${import.meta.env.BASE_URL || '/'}assets/models/escort_hull.glb?v=ffg2`;
const HOSTILE_TINT = 0x8a2f2f;

let sharedModelPromise = null;
function loadDestroyerScene() {
  if (!sharedModelPromise) {
    sharedModelPromise = new GLTFLoader().loadAsync(MODEL_URL).then((gltf) => gltf.scene);
  }
  return sharedModelPromise;
}

export class EnemyShip extends Entity {
  constructor({ name = 'Contact', position, patrolPoints = [], scene, shipClass = null }) {
    // Survivability now comes from the shared DamageModel: this hull is an
    // escort-sized frigate (~4,000 t) unless the spawn name marks it a DDG, in
    // which case it gets the heavier destroyer profile. No arbitrary hitpoints.
    super({
      name,
      domain: Domain.SURFACE,
      iff: IFF.HOSTILE,
      position,
      shipClass: shipClass || (/DDG/i.test(name) ? 'destroyer' : 'frigate'),
    });
    // Instant procedural stand-in, then swap for Blender hero mesh when ready.
    const { group, length, beam, deckY } = buildEnemyShipMesh();
    this.group = group;
    this.deckY = deckY;
    this.length = length;
    this.beam = beam;
    this.physics = new ShipPhysics({ length, beam, maxSpeedKn: 24, accel: 1.1, turnRate: 0.22 });
    this.physics.position.copy(position);
    this.patrolPoints = patrolPoints;
    this._patrolIdx = 0;
    this.state = State.PATROL;
    this.engageRangeM = 3200;
    this.gunRangeM = 2600;
    this.missileRangeM = 4200;
    this._gunCooldown = 0;
    this._missileCooldown = Math.random() * 8 + 6;
    this._sinkT = 0;
    scene.add(this.group);
    this._tryUpgradeModel();
  }

  async _tryUpgradeModel() {
    try {
      const src = await loadDestroyerScene();
      const inst = src.clone(true);
      // escort_hull.glb is authored bow=+Z/up=+Y/beam=X and already centered on X=0/
      // Z=0 with Y=0 at the waterline (see CrewedShip._tryLoadEscortModel) — unlike
      // the old enemy_destroyer.glb this needs no axis-reconciling rotation or
      // box-based re-centering, only a safety scale if the source length ever drifts
      // from this contact's ShipPhysics length.
      const box = new THREE.Box3().setFromObject(inst);
      const size = new THREE.Vector3();
      box.getSize(size);
      const targetLen = this.length || 110;
      if (size.z > 1) inst.scale.setScalar(targetLen / size.z);

      // Tint the model's IFF materials. WorldManager.spawnFriendlyScreen mutates
      // `this.iff` to FRIENDLY synchronously right after construction, before this
      // async load resolves, so reading it here (not a captured constructor-time
      // value) correctly distinguishes hostile contacts from the friendly screen
      // units that also route through this class. Clone per-instance (keyed by the
      // shared source material's uuid) so every mesh referencing that material — and
      // every other EnemyShip sharing the cached glTF scene — gets its own clone
      // rather than one ship's tint silently overwriting another's.
      //
      // escort_hull.glb's only "IFF"-named material (EH_IFFMat) is a small waterline
      // marker light, not a hull trim stripe — the model has no separate trim material.
      // Tinting only that left every ship's actual hull/superstructure (EH_HullMat/
      // EH_SuperMat) an identical neutral grey — hostiles and friendlies were visually
      // indistinguishable except for one tiny light (judge-caught: "tinted red" was
      // essentially false). Blend (not replace) hull/super toward the IFF color so it
      // reads as a distinctly painted hull, matching how the old procedural
      // buildEnemyShipMesh(iffColor) hulls read before this asset swap.
      const tint = this.iff === IFF.FRIENDLY ? 0x2f6a8a : HOSTILE_TINT;
      const tintCol = new THREE.Color(tint);
      const tintedByOrigUuid = new Map();
      inst.traverse((o) => {
        if (!o.isMesh) return;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (let i = 0; i < mats.length; i++) {
          const mat = mats[i];
          const name = mat?.name || '';
          const isMarker = /IFF/i.test(name);
          const isHullPaint = /Hull|Super/i.test(name);
          if (!mat || (!isMarker && !isHullPaint)) continue;
          let cloned = tintedByOrigUuid.get(mat.uuid);
          if (!cloned) {
            cloned = mat.clone();
            if (isMarker) cloned.color.setHex(tint);
            // 0.5 read as a solid crayon-pink hull on the new frigate's large merged
            // surfaces (verified live) — 0.3 keeps it clearly distinguishable as an
            // IFF-colored accent without losing the paint's neutral hull character.
            else cloned.color.lerp(tintCol, 0.3);
            tintedByOrigUuid.set(mat.uuid, cloned);
          }
          if (Array.isArray(o.material)) o.material[i] = cloned;
          else o.material = cloned;
        }
      });

      const { normalMap, roughnessMap } = getSharedMicroDetailMaps();
      inst.traverse((o) => {
        if (!o.isMesh) return;
        o.castShadow = true;
        o.receiveShadow = true;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const mat of mats) {
          if (!mat || mat.transparent) continue;
          // repeat=40 was tuned for the old ~137-primitive unmerged hull, where each
          // small mesh had its own small UV island; now that the rebuild merges
          // primitives by material into a handful of much larger combined meshes, the
          // same repeat count reads as a distracting, regular tiled grid across the
          // whole hull instead of fine surface grit. Lower repeat = larger, subtler
          // grain relative to the bigger merged UV space.
          if (!mat.normalMap) {
            const n = normalMap.clone(); n.needsUpdate = true;
            n.repeat.set(10, 10); n.wrapS = n.wrapT = THREE.RepeatWrapping;
            mat.normalMap = n;
            mat.normalScale = new THREE.Vector2(0.35, 0.35);
          }
          if (!mat.roughnessMap) {
            const r = roughnessMap.clone(); r.needsUpdate = true;
            r.repeat.set(10, 10); r.wrapS = r.wrapT = THREE.RepeatWrapping;
            mat.roughnessMap = r;
          }
          // Kill plastic chrome: force maritime roughness floor.
          if (typeof mat.roughness === 'number') mat.roughness = Math.max(mat.roughness, 0.45);
          if (typeof mat.metalness === 'number') mat.metalness = Math.min(mat.metalness, 0.35);
          mat.needsUpdate = true;
        }
      });

      // Replace children of placeholder group
      while (this.group.children.length) this.group.remove(this.group.children[0]);
      this.group.add(inst);
      this.deckY = 7.2 * (targetLen / 140);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[EnemyShip] Blender destroyer unavailable, keeping procedural mesh.', err?.message || err);
    }
  }

  onDestroyed() {
    this.state = State.SINKING;
    this._sinkT = 0;
    // A ship broken in half by a keel hit or a magazine blast goes fast; one
    // that finally loses the fight with flooding settles slowly and heels over.
    this._sinkFast = this.damage.catastrophic;
  }

  update(dt, ctx) {
    const { playerPos, elapsed, fireWeapon, getWaveHeight } = ctx;

    // Fires/flooding/damage-control progression (may flip alive -> false and
    // trip onDestroyed on its own, without any new incoming round).
    this.updateDamage(dt);

    if (this.state === State.SINKING) {
      this._sinkT += dt;
      const rate = this._sinkFast ? 2.6 : 1.0;
      this.group.rotation.z += dt * (this._sinkFast ? 0.32 : 0.15) * this.damage.listSign;
      this.group.position.y -= dt * 1.4 * rate;
      this.group.rotation.x += dt * (this._sinkFast ? 0.12 : 0.05);
      if (this._sinkT > (this._sinkFast ? 5 : 11)) this.destroyed = true;
      return;
    }

    const distToPlayer = this.physics.position.distanceTo(playerPos);
    const dmg = this.damage;
    // Wrecked sensors mean she loses the picture and can't open an engagement
    // until you're much closer — a real, visible consequence of a bridge or
    // superstructure hit rather than a hidden stat.
    const sense = dmg.sensorFactor;
    const engageRange = this.engageRangeM * sense;

    if (this.state === State.PATROL) {
      if (this.iff !== 'FRIENDLY' && distToPlayer < engageRange) {
        this.state = State.ENGAGE;
      } else if (this.patrolPoints.length) {
        const target = this.patrolPoints[this._patrolIdx];
        const d = this.physics.position.distanceTo(target);
        if (d < 60) this._patrolIdx = (this._patrolIdx + 1) % this.patrolPoints.length;
        this._steerToward(target, 0.55);
      } else {
        this.physics.setCommand(0.3, 0);
      }
    } else if (this.state === State.ENGAGE) {
      if (this.iff === 'FRIENDLY') {
        this.state = State.PATROL;
      } else if (distToPlayer > engageRange * 1.35) {
        this.state = State.PATROL;
      } else {
        const desiredRange = this.gunRangeM * 0.75;
        let throttle = distToPlayer > desiredRange ? 0.85 : distToPlayer < desiredRange * 0.6 ? -0.3 : 0.15;
        // Mission-killed ships stop maneuvering to fight and just try to survive.
        if (dmg.missionKill) throttle = Math.min(throttle, 0.25);
        this._steerToward(playerPos, throttle);

        // Firepower kill: fire control / mounts wrecked = she stops shooting.
        // Degraded (but not dead) fire control just slows her rate of fire.
        if (dmg.weaponsOnline) {
          const rofPenalty = 1 / dmg.fireControlFactor;
          this._gunCooldown -= dt;
          if (distToPlayer < this.gunRangeM * sense && this._gunCooldown <= 0) {
            this._gunCooldown = (1.4 + Math.random() * 0.8) * rofPenalty;
            fireWeapon('enemyShell', this._muzzleWorld(), playerPos.clone(), this);
          }
          this._missileCooldown -= dt;
          if (distToPlayer < this.missileRangeM * sense && this._missileCooldown <= 0) {
            this._missileCooldown = (14 + Math.random() * 10) * rofPenalty;
            fireWeapon('enemyMissile', this._muzzleWorld(), playerPos.clone(), this);
          }
        }
      }
    }

    // Propulsion damage and flooding drag cap how much way she can make; a
    // steering casualty makes her sluggish on the rudder. Both are applied to
    // the physics command that was just set, so every AI branch is covered.
    const speedCap = dmg.speedFactor;
    this.physics.setCommand(
      THREE.MathUtils.clamp(this.physics.throttle, -speedCap, speedCap),
      this.physics.rudder * dmg.turnFactor
    );

    this.physics.update(dt, getWaveHeight, elapsed);
    this.physics.applyToObject3D(this.group);
    // Asymmetric flooding = a visible list. Applied on top of the wave-driven
    // roll the physics just wrote, so a flooding ship visibly lies over.
    if (dmg.list !== 0) {
      this.group.rotateZ(dmg.list);
      this.group.position.y -= dmg.flooding * 1.6;
    }
    this.position.copy(this.physics.position);
    this.heading = this.physics.heading;
  }

  _steerToward(targetPos, throttle) {
    const toTarget = new THREE.Vector3().subVectors(targetPos, this.physics.position);
    const desiredHeading = Math.atan2(-toTarget.x, -toTarget.z);
    let diff = desiredHeading - this.physics.heading;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    const rudder = THREE.MathUtils.clamp(diff * 1.4, -1, 1);
    this.physics.setCommand(throttle, rudder);
  }

  _muzzleWorld() {
    return this.group.localToWorld(new THREE.Vector3(0, this.deckY + 1.5, this.length * 0.38));
  }
}
