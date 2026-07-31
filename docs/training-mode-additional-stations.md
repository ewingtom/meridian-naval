# MERIDIAN Training Mode — Additional Stations Research

**Status:** Research / design document only. No game systems were changed for this work.  
**Companion to:** [`training-mode-pqs-plans.md`](./training-mode-pqs-plans.md)  
**Date:** 2026-07-30

---

## 1. Purpose

The first training-plan document covered MERIDIAN’s six existing seats:

`LOOKOUT · HELM · RADAR · SONAR · WEAPONS · TAO`

This follow-on asks: **which additional stations ought to exist** for a more realistic Training Mode (and eventually campaign play), and **what public PQS / standards documents define them**.

Findings are ranked by:

1. Whether MERIDIAN already has partial mechanics for the role  
2. How central the watch is on a real surface combatant  
3. How distinct the skill set is from an existing seat  
4. Playability / training value without classified console fidelity  

---

## 2. Gap Analysis vs Real Watch Organization

A U.S. Navy destroyer/cruiser underway watch is not six people. Public watchstanding doctrine (SORM / Basic Military Requirements / SURFOR proficiency instruction) typically includes at least:

| Domain | Typical watchstations | In MERIDIAN today? |
| --- | --- | --- |
| Bridge command | OOD, JOOD/CONN, QMOW, BMOW, Helmsman, Lee Helm, Lookouts, Messenger | Partial: HELM + LOOKOUT only |
| CIC command | TAO (higher readiness), CICWO, CIC Watch Supervisor, warfare coordinators | Partial: TAO only |
| Sensors | Surface/air radar, ID, EW, Sonar | Partial: RADAR + SONAR; **EW is keybind-only** |
| Weapons | AAWC / SSWC, gun/missile/CIWS operators, ASW weapons | Partial: single WEAPONS seat |
| Combat systems readiness | CSOOW / CSOSS watches | Absent |
| Engineering | EOOW + plant watches | Absent |
| Survivability | DC Central, Repair Lockers, scene leaders | **DC is keybind-only** (`X`) |
| Communications | Radio / Communications Watch Officer, visual signaling | Absent (comms log is UI only) |

**Already-in-game but not seats:** Electronic Warfare soft-kill (`Z` / chaff) and Damage Control firefighting (`X`) are called out in `main.js` as player-owned when seated anywhere — the same pattern used for AI coop fallback. Those are the strongest candidates to promote into full Training Mode stations.

---

## 3. Recommendation Tiers

### Tier A — Strongly recommend as new Training Mode seats

These fill real skill gaps, match existing MERIDIAN mechanics, and have clear PQS spines.

| Proposed seat | Why include | Primary PQS / standards |
| --- | --- | --- |
| **EW** (Electronic Warfare Operator / Supervisor) | Soft-kill already exists; missile-defense training incomplete without dedicated ES/EA timing | **NAVEDTRA 43357-C** Surface Electronic Warfare (EW) Operations; **NAVEDTRA 43357-1** EW Officer / C2W Watch Officer; CTT + SLQ-32 school pipeline |
| **DC** (Damage Control Central / Repair Locker) | Firefighting already exists; all-hands PQS is mandatory in the fleet | **NAVEDTRA 43119** series (Damage Control); watches **43119-4**; DCPO **43119-5** |
| **OOD** (Officer of the Deck Underway) | Distinct from Helmsman: owns bridge safety, Rules of the Road, integration with CIC | **NAVEDTRA 43101-4** (OOD U/W watchstation ≈303); bridge team **NAVEDTRA 43492**; proficiency via COMNAVSURFOR watchstander instruction |
| **EOOW** (Engineering Officer of the Watch) | Mobility/power casualties are a missing warfare domain; SWO milestone | **NAVEDTRA 43101-3** SWO Engineering; class EOOW volumes (e.g. **43514** DDG-51 Main Propulsion/EOOW; **43409** CG-47) |

### Tier B — Recommend as seats *or* advanced tracks under existing seats

High training value; can start as curriculum branches before full UI seats.

| Proposed role | Could live under | Primary PQS / standards |
| --- | --- | --- |
| **CICWO** | TAO (prerequisite track) | **NAVEDTRA 43101-4** CICWO |
| **ASW Evaluator (ASWE)** | SONAR + TAO team track | **NAVEDTRA 43368-A** ASW Evaluator; CIC USW doctrine (SWOS STU sheets / OS RTM) |
| **AAWC / SSWC** (Warfare Coordinator) | WEAPONS + TAO | **NAVEDTRA 43388-1** SSWC/AAWC; CG/DDG Warfare Coordinator PQS family (**43398** / class CIC Ops) |
| **QMOW** (Quartermaster of the Watch) | HELM / OOD | **NAVEDTRA 43492** Ship’s Control & Navigation (QMOW watchstation); **NAVEDTRA 14338** Quartermaster RTM; Visual Comms **43354-C** |
| **CIWS / Point Defense** | WEAPONS | **NAVEDTRA 43373-D** Mk 15 CIWS; related self-defense / decoy **43341** Decoy Launching Systems |
| **CSOOW** | Separate late-game seat | Class/combat-systems PQS + **NAVEDTRA 43511-C** CSOSS Operation and Watches; SURFOR proficiency list includes CSOOW |

### Tier C — Optional / lower priority for MERIDIAN scope

Worth documenting; usually thinner gameplay or inport-focused.

| Role | Notes | Primary references |
| --- | --- | --- |
| **BMOW** | Supervises deck watch reliefs; less direct “minigame” | Watchstanding doctrine; BM RTM; ties to **43492** / deck PQS |
| **Communications Watch Officer / Radio** | Message routing, nets, EMCON of emitters | **NAVEDTRA 43355-E** Information Systems & Telecommunications (Common); class radio PQS; NTP / telecom procedures |
| **ATTWO / Force Protection** | Mostly inport / FP posture | **NAVEDTRA 43387** Force Protection Afloat; **43385** Antiterrorism Tactical Watch Officer |
| **Inport OOD / POOW / MOOW** | Harbor routine, not open-ocean fight | **NAVEDTRA 43397** Deck Watches Inport |
| **ASTAC** (ASW air controller) | Needs helo/MPA gameplay | Mentioned in OS/ASW doctrine; platform-specific |
| **3M / Division Officer afloat** | Admin/readiness, weak action loop | **NAVEDTRA 43241** (3M); **43463-1** Division Officer Afloat |

---

## 4. Detailed Station Cards (Tier A + key Tier B)

### 4.1 EW — Electronic Warfare

**Real-world roles:** EW Console Operator → EW Supervisor → Electronic Warfare Officer / C2W Watch Officer. Rating backbone: **Cryptologic Technician Technical (CTT)** operating **AN/SLQ-32** family (and related soft-kill / ES systems).

**Why MERIDIAN needs it:** Inbound missile soft-kill is already a timed player action (`Z`). Promoting EW to a seat lets Training Mode teach:

- Detect / classify emitter or inbound RF cue  
- Report to TAO/CICWO (“ES report”)  
- Soft-kill timing (too early / too late fails)  
- EMCON conflict (going active vs staying quiet)  
- Coordination with CIWS / hard-kill Weapons  

**Associated standards / PQS (public catalog & community pages):**

| Document | Scope |
| --- | --- |
| **NAVEDTRA 43357-C** | Surface Electronic Warfare (EW) Operations |
| **NAVEDTRA 43357-1** (series) | Surface EW Officer / C2W Watch Officer |
| **NAVEDTRA 43341** (series) | Decoy Launching Systems (chaff/flare soft-kill hardware) |
| CTT A/C school pipeline (IWTC Corry Station) | SLQ-32 operator/maintainer courses (e.g. (V)3/(V)4/(V)6 shipboard ops) |
| CICWO PQS (**43101-4**) fundamentals | Requires knowledge of EW supervisor / ES operator duties in the CIC watch team |

**Suggested Training Mode ladder:** T-100 ES vs EA concepts → T-200 console modes → T-300 timed soft-kill → Board with multi-inbound + EMCON inject.

---

### 4.2 DC — Damage Control Central / Repair Party

**Real-world roles:** All-hands Basic DC → Repair Locker / IET billets → Scene Leader → DC Central plotters → DCA organization; DCTT for trainers.

**Why MERIDIAN needs it:** Firefighting (`X`) already exists as a hold-to-suppress loop. A DC seat turns that into procedure: investigate, report, isolate, attack, boundary, reflash watch — matching how real DC parties work even when the “CO” isn’t standing the hose.

**Associated standards / PQS:**

| Document | Scope |
| --- | --- |
| **NAVEDTRA 43119** (series; e.g. 43119-J / -G revisions) | Damage Control PQS — fundamentals, systems, watchstations |
| Watchstations **301–306** (typical) | Basic / Qual 1 all-hands (SURFOR: complete within ~6 months aboard) |
| Watchstations **307–319** (typical) | Repair party / IET billets |
| Watchstation **320** (typical) | DCTT Member |
| **NAVEDTRA 43119-4** series | Damage Control Watches (incl. Gas Free / Fire Marshal pathways) |
| **NAVEDTRA 43119-5** series | Damage Control Petty Officer (DCPO) |
| **NAVEDTRA 43119-2** (legacy numbering in older pubs) | General / communications-oriented DC quals historically cited |
| NTTP / NSTM refs cited inside DC PQS | Surface ship survivability, firefighting, CBR-D (doctrine pointers, not game manuals) |

**SWO requirement:** COMNAVSURFOR career manual lists DC PQS **43119** watchstations **301–309, 318** among required SWO package items.

**Suggested Training Mode ladder:** T-100 fire tetrahedron / DC organization → T-200 ship systems schematic (game fidelity) → T-300 fire/flood/smoke scenarios with report format → Board with simultaneous casualties.

---

### 4.3 OOD — Officer of the Deck (Underway)

**Real-world role:** CO’s representative on the bridge for safe navigation and routine/special evolutions; works with JOOD/CONN, QMOW, BMOW, CICWO/TAO.

**Why distinct from HELM:** MERIDIAN HELM currently trains *execution* (telegraph/rudder). OOD trains *decision authority*: traffic rules, when to maneuver, when to call the CO, how to integrate Lookout/Radar/CIC recommendations, navigation risk.

**Associated standards / PQS:**

| Document | Scope |
| --- | --- |
| **NAVEDTRA 43101-4** | SWO CICWO / OOD Underway / Platform Endorsement (OOD watchstation historically **303**) |
| **NAVEDTRA 43492** | Ship’s Control and Navigation (helmsman team the OOD supervises) |
| **NAVEDTRA 43397** | Deck Watches Inport (separate inport OOD path) |
| COMNAVSURFOR watchstander proficiency instruction | OOD currency (~1 watch / 45 days model in public summaries); NSST high-traffic refresh |
| COLREGS / Nav Rules training | Rules of the Road judgment (public maritime law training, not a NAVEDTRA PQS number) |

**Design note:** Training Mode can expose OOD as a seat that *issues* helm orders to an AI Helmsman (closed-loop), flipping the current HELM drill.

---

### 4.4 EOOW — Engineering Officer of the Watch

**Real-world role:** Safe operation of the engineering plant; answers to CHENG/CO; provides propulsion, electrical, and casualty control so the fight can continue.

**Why MERIDIAN needs it:** Without engineering, Training Mode never teaches “fight hurt” plant management (loss of lube oil, generator trip, restricted maneuvering, casualty power concepts at game fidelity).

**Associated standards / PQS:**

| Document | Scope |
| --- | --- |
| **NAVEDTRA 43101-3** | SWO Engineering (EOOW qual on any surface ship satisfies this for SWO package) |
| Class EOOW / Main Propulsion volumes (examples from public catalog) | **43514** DDG-51 Main Propulsion/EOOW; **43409** CG-47 Main Propulsion/EOOW; older FFG/DD volumes **43151**, **43452**, etc. |
| EOSS (Engineering Operational Sequencing System) | Procedure source of truth for plant ops (cited by PQS policy; not a player-facing NAVEDTRA story bible) |
| SURFOR proficiency model | EOOW ~1 watch / 30 days; refresh U/I rules |

**Suggested Training Mode ladder:** Monitor plant → execute standard evolutions → single-casualty drills → multi-casualty under tactical demand from TAO/OOD.

---

### 4.5 CICWO — Combat Information Center Watch Officer

**Real-world role:** Supervises CIC during Condition IV / peacetime steaming; advises OOD on contacts and maneuvering recommendations; reports to TAO when TAO is assigned (higher readiness).

**Relationship to MERIDIAN TAO:** TAO is the combat employment authority. CICWO is the *watch supervisor / picture manager* that SWOs usually qualify earlier. Ideal Training Mode order: CICWO track → TAO board.

**Associated standards / PQS:**

| Document | Scope |
| --- | --- |
| **NAVEDTRA 43101-4** | CICWO qualification (same volume as OOD U/W) |
| **NAVEDTRA 14308** | Operations Specialist RTM — CIC organization CICWO oversees |
| SURFOR proficiency | CICWO ~1 watch / 45 days; TAO watch resets CICWO proficiency in that model |

**Enlisted team the CICWO must understand** (from public CICWO PQS outlines): surface/air trackers, ID operator, EW supervisor/ES operator, sonar supervisor, CIC watch supervisor, DRT/plotters, R/T talkers, warfare coordinators, etc.

---

### 4.6 ASW Evaluator (ASWE)

**Real-world role:** Owns USW prosecution geometry; may pass rudder/speed recommendations to the bridge; supervises the ASW plot; works under TAO in multi-threat fights.

**Why consider it:** MERIDIAN already splits SONAR from TAO and has escort ping / screen orders. ASWE is the missing “brain” between acoustic contact and ship maneuver.

**Associated standards / PQS:**

| Document | Scope |
| --- | --- |
| **NAVEDTRA 43368-A** | Antisubmarine Warfare (ASW) Evaluator |
| OS RTM / SWOS USW information sheets | CIC control functions during USW; 1JS / sonar control nets concepts |
| STG operator PQS / SQQ-89 courses | Sensor inputs ASWE evaluates |

---

### 4.7 AAWC / SSWC — Warfare Coordinators

**Real-world role:** Under TAO, coordinate air or surface/subsurface weapons employment, track priority, and engagement sequence.

**Why consider it:** MERIDIAN’s single WEAPONS seat mixes shooter and coordinator. Splitting coordinator drills teaches doctrine without requiring more gun minigames.

**Associated standards / PQS:**

| Document | Scope |
| --- | --- |
| **NAVEDTRA 43388-1** | Surface/Subsurface Warfare Coordinator (SSWC) / Antiair Warfare Coordinator (AAWC) |
| CG-47/DDG-51 Warfare Coordinator / CIC Operations (**43398** family in catalog) | Platform combat-system watch quals |
| FC/FCA career path notes | AAWC / CSC / CSOOW as advancement watchstations |

---

### 4.8 QMOW — Quartermaster of the Watch

**Real-world role:** Navigation assistant to OOD; deck log; DR track; nav lights; visual signaling; often supervises helmsman if senior to BMOW.

**Associated standards / PQS:**

| Document | Scope |
| --- | --- |
| **NAVEDTRA 43492** | Ship’s Control & Navigation (includes QMOW pathway) |
| **NAVEDTRA 14338** | Quartermaster rate training |
| **NAVEDTRA 43354-C** | Visual Communications |
| **NAVEDTRA 43397** | Inport deck watches (related QM duties) |

---

### 4.9 CIWS / Point-Defense Operator

**Real-world role:** Inner-layer hard kill against missiles/aircraft/asymmetric craft (Mk 15 Phalanx); often paired with soft-kill EW and SSDS/self-defense doctrine.

**Associated standards / PQS:**

| Document | Scope |
| --- | --- |
| **NAVEDTRA 43373-D** | Mk 15 Close-In Weapon System (CIWS) |
| **NAVEDTRA 43341** | Decoy Launching Systems (soft-kill pairing) |
| Self-defense / RAIDS / SSDS catalog entries | Broader ship self-defense watch quals (platform-dependent) |

**MERIDIAN note:** CIWS already appears in weapons/defense code paths. Training Mode can treat CIWS as a WEAPONS sub-track before a dedicated seat.

---

### 4.10 CSOOW — Combat Systems Officer of the Watch

**Real-world role:** Owns combat-systems equipment readiness and casualty control so sensors/weapons stay up; SURFOR lists CSOOW alongside TAO/OOD/EOOW for proficiency tracking.

**Associated standards / PQS:**

| Document | Scope |
| --- | --- |
| Platform combat-systems PQS + JQRs | Often command-tailored; Aegis ORTS / display / network PQS in **43398** family |
| **NAVEDTRA 43511-C** | Combat Systems Operational Sequencing System (CSOSS) Operation and Watches |
| SURFOR proficiency instruction | CSOOW ~1 watch / 30 days model in public summaries |

**Gameplay fit:** Strong for “systems casualty” training (radar down, mount casualty, restore via procedure), weaker as a continuous open-ocean action seat.

---

## 5. Suggested MERIDIAN Station Set (Future)

If Training Mode expands seats without exploding scope:

### Near-term (promote existing mechanics)

1. **EW**  
2. **DC**  

### Mid-term (command realism)

3. **OOD** (decision seat; AI helmsman executes)  
4. **CICWO** track under / beside TAO  
5. **EOOW** (plant / mobility)

### Later (doctrine depth)

6. **ASWE**  
7. **AAWC** (or Warfare Coordinator)  
8. **QMOW**  
9. **CIWS** sub-seat or WEAPONS endorsement  
10. **CSOOW** (casualty/readiness scenarios)

Keep **BMOW**, **Radio/CWO**, and **ATTWO** as briefing modules or inport campaigns unless those loops become core to the product fantasy.

---

## 6. Crosswalk: Existing MERIDIAN Seats ↔ Missing Complements

| Existing seat | Natural complement to add | Training value |
| --- | --- | --- |
| HELM | OOD + QMOW | Separates steer vs decide vs navigate |
| LOOKOUT | (complete enough early) | Pair with OOD traffic drills |
| RADAR | CICWO + ID operator drills | Picture quality under supervision |
| SONAR | ASWE | Localization → prosecution geometry |
| WEAPONS | AAWC + CIWS + EW timing | Doctrine and layered defense |
| TAO | CICWO prerequisite + ASWE/AAWC subordinates | Real composite warfare stack |
| (none) | EOOW + DC | Survivability & mobility under fire |
| (keybind only) | EW seat | Dedicated soft-kill profession |

---

## 7. Master PQS / Standards Index (Additional Stations)

Quick index of publicly cited NAVEDTRA / related standards for *candidate* stations (revision letters change; treat as family numbers):

| NAVEDTRA / family | Title / topic |
| --- | --- |
| **43101-3** | SWO Engineering / EOOW pathway |
| **43101-4** | CICWO / OOD Underway / Platform Endorsement |
| **43119** (+ **-4**, **-5**, watches 301–320) | Damage Control / DC watches / DCPO / DCTT |
| **43241** | 3M (Maintenance & Material Management) |
| **43304** | Tactical Action Officer *(already covered)* |
| **43341** | Decoy Launching Systems |
| **43354-C** | Visual Communications |
| **43355-E** | Information Systems & Telecommunications (Common) |
| **43357-C / 43357-1** | Surface EW Operations / EW Officer–C2W |
| **43368-A** | ASW Evaluator |
| **43373-D** | Mk 15 CIWS |
| **43385 / 43387** | ATTWO / Force Protection Afloat |
| **43388-1** | SSWC / AAWC |
| **43397** | Deck Watches Inport |
| **43398** family | Aegis ORTS / radars / displays / CG-DDG CIC & Warfare Coordinator related |
| **43463-1** | Division Officer Afloat |
| **43492** | Ship’s Control & Navigation (Lookout/Helm/QMOW family) |
| **43511-C** | CSOSS Operation and Watches |
| **43514 / 43409 / (class vols)** | DDG-51 / CG-47 (etc.) EOOW / Main Propulsion |
| OPNAVINST **3500.34** | Navy PQS program policy |
| COMNAVSURFOR **1412.7** / watchstander proficiency instr. | OOD, JOOD/CONN, CICWO, TAO, EOOW, CSOOW currency |

---

## 8. Fidelity Reminder

Same boundary as the first document:

- Emulate **skills, doctrine, report discipline, timing, and team coordination**  
- Do **not** reproduce classified SLQ-32 / Aegis / EOSS checklists  
- Label in-game quals as **MERIDIAN Station Qualifications**, not official USN PQS  

---

## 9. Bottom Line

**Yes — additional stations ought to be included** for a serious Training Mode. The highest-value additions are:

1. **EW** and **DC** (mechanics already exist; PQS spines are clear)  
2. **OOD** and **EOOW** (complete the SURFOR “controlling station” set alongside TAO)  
3. **CICWO / ASWE / AAWC** as doctrine-depth tracks that make TAO, SONAR, and WEAPONS feel like a real CIC  

This document stops at research and prioritization. No implementation work is included here.
