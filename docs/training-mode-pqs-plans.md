# MERIDIAN Training Mode — Station PQS Research & Training Plans

**Status:** Research / design document only. No game systems were changed for this work.  
**Purpose:** Ground a future **Training Mode** in real U.S. Navy Personnel Qualification Standard (PQS) pipelines and watchstanding skill ladders for each manned station in MERIDIAN.  
**Date:** 2026-07-30

---

## 1. How MERIDIAN Maps to Real Watch Teams

MERIDIAN collapses a destroyer/cruiser bridge–CIC team into six playable seats. Training Mode should teach the *skills* those seats demand, not literal classified console procedures.

| MERIDIAN station | Primary real-world analogues | Typical rates / officers |
| --- | --- | --- |
| **LOOKOUT** | Bridge-wing / sky lookout | BM, SN, OS (some ships); all hands basics |
| **HELM** | Helmsman / Lee Helmsman; Conning Officer (officer path) | BM, QM; JOOD/CONN/OOD for conn authority |
| **RADAR** | Surface/air radar / track supervisor / CIC plot | Operations Specialist (OS) |
| **SONAR** | Sonar control / ASW sensor operator | Sonar Technician Surface (STG) |
| **WEAPONS** | Gun / missile / torpedo fire-control & release | Gunner’s Mate (GM), Fire Controlman (FC/FCA); warfare coordinators |
| **TAO** | Tactical Action Officer (combat authority in CIC) | Surface Warfare Officer (SWO), typically department-head path |

Cross-cutting (present in MERIDIAN but not a dedicated seat today): **Damage Control** (DC / DCTT), **Task Force Net** doctrine (share / weapons free / hold / screen / ping), and **higher-command orders**. Training Mode should still exercise those as shared competencies.

---

## 2. How Navy PQS Actually Works (Design Primer)

Public Navy doctrine (OPNAV / NETC PQS program; COMNAVSURFOR career manuals) treats PQS as the minimum knowledge and demonstrated skill before unsupervised watchstanding.

### 2.1 Standard PQS anatomy

Most PQS volumes use three sections:

1. **100 — Fundamentals**  
   Theory, doctrine, safety, terminology, Rules of the Road / ROE concepts, publications awareness.
2. **200 — Systems**  
   Equipment, panels, modes, casualty indications, interfaces to other stations.
3. **300 — Watchstations**  
   Graded practical tasks: stand the watch under instruction (U/I), complete evolutions, pass oral boards / final checks.

Qualification is **command-owned**: designated qualifiers sign line items; COs set final authority. Simulators (NSST, CSTT scenarios, SWOS trainers) count toward proficiency refresh for many officer watches.

### 2.2 Core references used in this research

| Document / system | Relevance |
| --- | --- |
| **OPNAVINST 3500.34** (PQS program) | Defines PQS as competency gate before duties |
| **NAVEDTRA 43492** (*Ship’s Control and Navigation*) | Lookout, Helm, Lee Helm, After Steering, Master Helmsman, QMOW |
| **NAVEDTRA 12968A** (*Lookout Training Handbook*) | Scanning, bearings, contact reports |
| **NAVEDTRA 43101-4** | SWO CICWO / OOD Underway / platform endorsement |
| **NAVEDTRA 43304** | Tactical Action Officer PQS (cited in SURFOR career manual) |
| **COMNAVSURFORINST 1412.7** (*SWO Career Manual*) | OOD / JOOD/CONN / CICWO / TAO proficiency periodicity |
| **NAVEDTRA 14308** (*Operations Specialist*) | CIC missions, radar, plots, nets, watch organization |
| **STG LaDR / MyNavy HR STG** | Sonar A-school → SQQ-89 operator / technician pipeline |
| **GM / FC LaDRs; NEOCS occupational standards** | Gun mounts, VLS, SVTT, Aegis weapons control |
| **NAVEDTRA 43168 / 43424 / 43342** (examples) | Mk 45 gun, Mk 41 VLS, Mk 32 SVTT PQS families |
| Coast Guard / Navy helm command standards | Closed-loop helm orders (repeat-back discipline) |

> **Caveat:** Exact current line-item PQS text is often FOUO / command-distributed and revises frequently. Training Mode should emulate the *skill ladder and evaluation style*, not reproduce classified console checklists.

### 2.3 Recommended Training Mode meta-structure (all seats)

Mirror PQS without claiming official certification:

| Phase | Name | Intent |
| --- | --- | --- |
| **T-100** | Fundamentals brief + quiz | Vocabulary, safety, doctrine, station purpose |
| **T-200** | Systems familiarization | UI / controls / modes in a quiet sea state |
| **T-300A** | Under Instruction (U/I) | Guided scenario with coach prompts / AI instructor |
| **T-300B** | Graded watch | Timed, scored, fewer hints |
| **Board** | Oral / practical board | Random injects + debrief; unlock “Qualified [Station]” ribbon |

Scoring should emphasize **correct procedure under pressure**, not high score kill counts.

---

## 3. LOOKOUT — Training Plan

### 3.1 Real pipeline

**Primary PQS:** *Ship’s Control and Navigation* — **NAVEDTRA 43492**, watchstation historically listed as **Lookout (≈302)**.  
**Primary study aid:** **NAVEDTRA 12968A**, *Lookout Training Handbook*.  
**Who qualifies:** Junior deck sailors (BM/SN) first; many rates still need lookout competency early in the career.

**Real skill core (public doctrine):**

- Systematic sector scan (naked eye → binoculars), never “stare and wait.”
- Report **everything** in sector unless specifically told not to; do not wait for certainty.
- Contact report content:
  - **What** (ship / aircraft / smoke / light / flotsam — class if known)
  - **Relative bearing** (three digits, spoken digit-by-digit; special language for bow/beam/quarter)
  - **Range** (yards / miles or horizon-relative language)
  - **Target angle** (surface) / **position angle** (air)
  - **Movement** (closing / opening / crossing L→R or R→L)
- Restricted visibility procedures; night vision discipline; binocular care.
- Understanding that electronics fail or EMCON may silence sensors — lookouts remain primary.

### 3.2 MERIDIAN skill mapping

Current game: wing lookout with zoom, contact call (`R`), visual sweep.

Training Mode should force:

| Skill | Practice drill |
| --- | --- |
| Sector ownership | Assigned port/stbd/aft sector; miss = fail |
| Bearing accuracy | Report within ±10° of truth |
| Classification | Surface vs air vs subsurface splash / periscope cue |
| Timeliness | First report before radar designates (inject radar delay) |
| Phrase discipline | Structured report string, not free-text spam |

### 3.3 Progressive syllabus

1. **T-100 Lookout Fundamentals**  
   Relative bearings diagram; contact report template; when to use binoculars; horizon estimation.
2. **T-200 Optics & Station**  
   Zoom discipline; night/fog filters; bridge–CIC report path (“Bridge, Lookout…”).
3. **T-300A Quiet Day**  
   Merchant + fishing contacts; no threats; graded on completeness and bearing quality.
4. **T-300B Threat Emergence**  
   Small boat / low flyer / periscope feather; must report before weapons or radar lock.
5. **Board**  
   Fog inject; multiple simultaneous contacts; identify which is CPA risk.

### 3.4 Pass criteria (example)

- ≥90% contacts reported before leaving sector  
- Mean bearing error ≤10°  
- Correct domain tag ≥80%  
- Zero “silent fail” on high-threat injects  

---

## 4. HELM — Training Plan

### 4.1 Real pipeline

**Enlisted path (steering the ship):** **NAVEDTRA 43492** watchstations historically:

| Watchstation (approx.) | Role |
| --- | --- |
| Lee Helmsman | Engine order telegraph / bells |
| Helmsman | Steer ordered courses / rudder |
| After Steering Helmsman | Casualty / aft steering |
| Master Helmsman | Advanced / special evolutions |

**Officer path (owning the conn):** JOOD / Conning Officer → OOD Underway via **NAVEDTRA 43101-4**, with bridge hours logged and proficiency refresh per **COMNAVSURFORINST 1412.7** (periodicity, U/I, NSST high-traffic scenarios).

**Standard helm order discipline (public seamanship practice):**

- Conning officer gives order → helmsman **repeats verbatim** → executes → reports when on course / rudder as ordered → conn acknowledges (“Very well”).
- Orders include rudder angle, “steady as she goes,” “shift your rudder,” “mark your head,” course to steer, etc.
- Helmsman challenges unclear or improper orders (“Command?”).

### 4.2 MERIDIAN skill mapping

Current game: telegraph notches, rudder, chase camera, waypoint course.

Training Mode should separate **Helmsman** (execute) from **Conn** (decide):

| Track | Focus |
| --- | --- |
| **Helmsman** | Closed-loop orders, telegraph matching, heading hold, casualty to aft-steering simulation |
| **Conn (advanced)** | Collision avoidance, formation station, wind/current bias, “new course / new speed” for ASW or RAS geometry |

### 4.3 Progressive syllabus

1. **T-100 Bridge Team Fundamentals**  
   Who has the conn; helm vs lee helm; Rules of the Road basics (stand-on / give-way concepts at game fidelity).
2. **T-200 Controls**  
   Telegraph ladder; rudder authority vs speed; turning diameter feel; waypoint instrument use.
3. **T-300A Order Drill**  
   AI Conn issues standard orders; player must repeat-back UI confirm + execute within timing windows.
4. **T-300B Restricted Waters / Traffic**  
   Multi-contact CPA; maintain ordered course while AI Lookout/Radar call threats.
5. **T-300C Special Evolution**  
   Station-keeping on a guide (escort formation); man-overboard / Williamson turn analogue if implemented.
6. **Board**  
   Steering casualty; transfer to aft steering; resume ordered course without loss of mission track.

### 4.4 Pass criteria (example)

- Correct repeat-back on ≥95% orders  
- Steady on ordered course within ±2–3° within time limit  
- No collision / grounding in graded traffic scenario  
- Correct telegraph matching for ordered speed band  

---

## 5. RADAR — Training Plan

### 5.1 Real pipeline

**Primary rating:** **Operations Specialist (OS)**.  
**Core RTM:** **NAVEDTRA 14308** (*Operations Specialist*) — CIC missions/functions, displays, internal nets, radar fundamentals, IFF concepts, dead-reckoning / plots, SAR, watch organization.

**Typical early watch ladder (conceptual):**

1. Sound-powered / R/T talker  
2. Status board / plot assistant  
3. Radar repeater operator  
4. Track supervisor / air or surface module operator  
5. CIC Watch Supervisor / support to **CICWO**

**Officer overlay:** **CICWO** qualification under **NAVEDTRA 43101-4**; proficiency refresh tied to SURFOR watchstanding rules; TAO watch resets CICWO proficiency.

**Skill core:**

- Build and maintain the **recognized maritime picture**
- Filter clutter vs real tracks; manage range scales / modes
- Correlate radar with lookout / IFF / intel
- Pass accurate track data to TAO / weapons / bridge
- Log and status discipline; EMCON awareness (active emissions)

### 5.2 MERIDIAN skill mapping

Current game: filters, range rings, designate, sonar handoff cues, Task Force share dependency on RADAR/SONAR for some coop marks.

Training Mode should emphasize **picture quality** and **designation discipline**:

| Skill | Drill |
| --- | --- |
| Detection | Find contacts at edge of range before AI labels them |
| Classification | Friendly / hostile / unknown / merchant |
| Track hygiene | No dual tracks; drop stale; promote priority track |
| Handoff | Designate for Lookout confirm / Weapons solution / TAO share |
| Scope management | Choose correct range scale for threat class |

### 5.3 Progressive syllabus

1. **T-100 CIC & Radar Fundamentals**  
   Relative vs true motion concepts (game-level); bearing/range readout; IFF friend/unknown idea; who owns designation.
2. **T-200 Console Modes**  
   Range ladder; filters (surface/air); north-up vs heading-up; clutter injects.
3. **T-300A Build the Plot**  
   Dense merchant field; score accuracy of track list vs ground truth.
4. **T-300B Threat Sorting**  
   Hostile mixes with neutrals; prioritize CPA / inbound missile / aircraft.
5. **T-300C Force Picture**  
   Share correct track to Task Force Net; wrong share fails the beat.
6. **Board**  
   Radar casualty / reduced range; recover picture using Lookout + Sonar feeds.

### 5.4 Pass criteria (example)

- Track completeness ≥85% of truth set in time box  
- Zero friendly fire designations  
- Correct priority track for graded inbound threat  
- Successful TAO-quality share package (ID + domain + bearing/range)  

---

## 6. SONAR — Training Plan

### 6.1 Real pipeline

**Primary rating:** **Sonar Technician (Surface) — STG**.  
**Pipeline (public MyNavy HR / LaDR pattern):**

1. Recruit training  
2. **STG “A” School** (historically San Diego / FASW pipeline)  
3. Platform **“C” School / NEC** on specific sonar suites (commonly **AN/SQQ-89** family Level I operator → Level II technician tracks; variants by ship baseline)  
4. Shipboard **PQS / OJT** as sensor operator → supervisor → underwater fire-control interface roles  

**Public duty statement highlights:**

- Detect, classify, localize underwater contacts  
- Distinguish ships, subs, torpedoes, biologics, bottom bounce, own-ship noise  
- Active vs passive employment; understand counter-detection risk of going loud  
- Bathythermograph / environmental effects on sonar performance  
- Report acoustic data to CIC / ASW evaluator / TAO  

**CIC integration:** ASW evaluator / TAO owns prosecution geometry; sonar recommends search arcs and holds contact; bridge maneuvers the ship into the sonar’s best geometry (see classic CIC USW doctrine briefs).

### 6.2 MERIDIAN skill mapping

Current game: ASW console, active ping (`Q`), localize/prosecute, escort ping via Task Force Net (`N`).

Training Mode should punish reckless active search and reward **localization quality**:

| Skill | Drill |
| --- | --- |
| Passive search | Detect without ping when environment allows |
| Active employment | Ping only when doctrine / TAO / scenario authorizes |
| Classification | Sub vs biologics vs wreck vs own-ship wake confusion |
| Localization | Bearing drift → range estimate → handoff to weapons (ASROC/torpedo) |
| Team ASW | Request escort ping; coordinate screen geometry |

### 6.3 Progressive syllabus

1. **T-100 Undersea Warfare Fundamentals**  
   Domains; convergence zones (simplified); active vs passive tradeoffs; weapons hold until localization quality met.
2. **T-200 Sonar Console**  
   Passive waterfall metaphor (or game equivalent); ping cooldown/risk meter; contact symbology.
3. **T-300A Passive Contact**  
   Quiet sub; classify and report without going loud.
4. **T-300B Lost Contact**  
   Regain with search plan (leg patterns / escort assist).
5. **T-300C Torpedo / Urgent Attack**  
   Time-critical localization; correct weapon domain selection advice to Weapons/TAO.
6. **Board**  
   Biologic false alarm + real sub; EMCON constraints; brief ASW evaluator-style recommendation.

### 6.4 Pass criteria (example)

- Correct domain classification on graded contacts  
- No unauthorized active ping in EMCON scenarios  
- Localization error within training tolerance before weapons free  
- Successful force ping / screen coordination when required  

---

## 7. WEAPONS — Training Plan

### 7.1 Real pipeline

MERIDIAN’s weapons seat blends several real watch worlds:

| Layer | Real analogue | Pipeline notes |
| --- | --- | --- |
| Ordnance / mount | **Gunner’s Mate (GM)** | A-school → mount-specific C-schools; PQS e.g. **Mk 45** (**NAVEDTRA 43168** family), **Mk 41 VLS** (**43424**), **Mk 32 SVTT** (**43342**) |
| Fire control / combat system | **Fire Controlman (FC / FCA)** | Electronics A-school → Aegis/system C-schools (e.g. Dahlgren tracks); watchstations toward **CSOOW**, **CSC**, warfare coordinator paths (**AAWC**, etc.) |
| Doctrine / release authority | Warfare coordinators + **TAO** | Weapons free / hold; engagement criteria; ID matrix |

**Skill core for operators:**

- Weapon-to-target matching (gun vs missile vs ASW rocket/torpedo)  
- Doctrine gates: **weapons tight / hold / free**; no fire without track quality  
- Magazine / inventory awareness; reload / misfire / casualty basics  
- Lead / fire-control solution quality; cease fire / check fire discipline  
- Coordination with CIC picture (never shoot the shared wrong track)

### 7.2 MERIDIAN skill mapping

Current game: weapon rack, track lock, fire solution, inbound panel, domain-aware munitions, Task Force doctrine (`C/V/B`).

Training Mode should grade **doctrine compliance** harder than raw DPS:

| Skill | Drill |
| --- | --- |
| Selector discipline | Correct mount for domain (ASW vs air vs surface) |
| Solution quality | Hold fire until solution “good” |
| Doctrine | Obey hold; fire only after share + free when required |
| Inbound defense | Prioritize self-defense threats vs mission kill |
| Ammo economy | Don’t empty VLS on merchants |

### 7.3 Progressive syllabus

1. **T-100 Weapons Doctrine Fundamentals**  
   ID criteria; hold vs free; self-defense vs deliberate engagement; collateral risk.
2. **T-200 Mount Familiarization**  
   Gun / missile / ASW selectors; reload timing; solution HUD literacy.
3. **T-300A Surface Gun Shoot**  
   Slow surface target; solution gates; cease fire on kill.
4. **T-300B Air Defense**  
   Inbound aircraft/missile; prioritization; magazine management.
5. **T-300C ASW Weapon Employment**  
   Only after Sonar localization quality; wrong weapon = fail.
6. **T-300D Force Weapons**  
   Wait for TAO share + weapons free; escorts prosecute with player.
7. **Board**  
   Mixed picture (neutral + hostile); check-fire inject mid-engagement; magazine casualty.

### 7.4 Pass criteria (example)

- Zero doctrine violations (fire under hold / wrong track)  
- ≥1 correct domain-matched engagement per graded threat class  
- Solution gate respected (no “spray and pray” pass)  
- Cease fire within time after kill / check-fire order  

---

## 8. TAO — Training Plan

### 8.1 Real pipeline

**Primary PQS:** **NAVEDTRA 43304** (*Tactical Action Officer*), cited as a required/related PQS in Surface Force career guidance.  
**Career context:** TAO is a **department-head milestone** for SWOs (after division-officer sea time, SWOS Department Head Course tactical training, shipboard qualification boards). Division officers typically qualify **CICWO** and **OOD** first (**NAVEDTRA 43101-4**).

**Proficiency model (COMNAVSURFOR watchstanding guidance, public summary):**

- Maintain currency with periodic TAO watches or **CSTT** scenarios  
- Lapse windows drive U/I watches and observed simulator refresh  
- A TAO watch also satisfies **CICWO** proficiency in that model  

**Historical training aids:** SWOS TAO curricula and simulator/intelligent tutoring systems emphasize high-tempo decision density (threat prioritization, weapons doctrine, multi-warfare coordination).

**TAO responsibilities (unclassified summary):**

- Fight the ship in CIC under CO’s combat doctrine  
- Integrate air / surface / subsurface pictures  
- Issue weapons posture and engagement orders  
- Coordinate with OOD/conn for maneuver warfare  
- Manage emissions, alerts, and force coordination  
- Escalate to CO when required by standing orders  

### 8.2 MERIDIAN skill mapping

Current game: TAO overview camera; Task Force Net home (`C` share, `V` free, `B` hold, `N` ping, `M` screen, `Y` wilco/affirm); DynamicOps beats that *require* coop actions.

Training Mode should make TAO a **decision game**, not a shooter:

| Skill | Drill |
| --- | --- |
| Threat priority | Rank simultaneous air/surface/sub injects |
| Doctrine timing | Hold until ID; free when prosecution needed |
| Force employment | Share correct track; screen vs chase |
| Sensor management | Order ping only when worth counter-detection cost |
| Command loop | Affirm higher-command order; brief CO-style debrief |

### 8.3 Progressive syllabus

1. **T-100 Battle Doctrine Fundamentals**  
   Warfare areas (AAW/ASUW/ASW); weapons postures; when TAO vs CO decides.
2. **T-200 CIC Leadership**  
   Read Radar/Sonar/Weapons/Lookout feeds; Task Force Net grammar; status board habits.
3. **T-300A Single-Warfare Fight**  
   One domain only; clean kill chain (detect → ID → share → free → assess).
4. **T-300B Multi-Threat**  
   Concurrent air + surface; prioritize ship survival vs mission.
5. **T-300C Undersea Crisis**  
   Lost sonar contact; choose screen / ping / maneuver recommendation.
6. **T-300D Force Command**  
   Escorts misbehave if orders wrong; graded on net clarity and timing.
7. **Board**  
   Fog of war + false ID; CO inject changing ROE; after-action brief scored on reasoning.

### 8.4 Pass criteria (example)

- Correct posture transitions (hold→free→hold) with no fratricide  
- All required DynamicOps-style coop beats satisfied in time  
- Priority order matches graded answer key on multi-threat sets  
- Debrief articulates *why* (not only *what* was clicked)  

---

## 9. Cross-Station / Team Training Tracks

Real ships qualify individuals, then stress **watch teams** (Bridge Resource Management, CSTT, integrated drills). Training Mode should include combined quals after single-seat ribbons.

### 9.1 Suggested team scenarios

| Scenario | Stations stressed | Real analogue |
| --- | --- | --- |
| **Fog Transit** | Lookout + Helm + Radar | Restricted visibility bridge/CIC |
| **Vampire Inbound** | Radar + Weapons + TAO | AAW CSTT |
| **Submarine Prosecution** | Sonar + Helm + Weapons + TAO | ASW coordinated search/attack |
| **Neutral Shipping Deconfliction** | Lookout + Radar + TAO + Weapons | ID matrix / weapons tight |
| **Task Force Screen** | TAO + all | Composite warfare lite |

### 9.2 Recommended unlock order (pedagogy)

1. Lookout  
2. Helm (Helmsman track)  
3. Radar  
4. Weapons (doctrine basics with AI TAO)  
5. Sonar  
6. TAO  
7. Team scenarios / “Battle E” style campaign exam  

Rationale: mirrors real pipelines (eyes & helm early; CIC/weapons deepen; TAO last).

---

## 10. Evaluation, Logging, and “PQS Book” UX (Design Notes)

To feel like a PQS pipeline without claiming Navy certification:

- **Digital qual book** per station: T-100 / T-200 / T-300 line items with timestamps  
- **U/I flag** until board passed  
- **Proficiency decay** (optional): after N days, require a short refresh scenario (mirrors SURFOR currency ideas)  
- **After-action review**: timeline of detections, orders, doctrine events, misses  
- **Instructor mode**: second player or AI coach can freeze and quiz (“What is the CPA contact?”)

Language in-game should say **“MERIDIAN Station Qualification”**, never “USN PQS Qualified.”

---

## 11. Fidelity Boundaries (Important for Implementation Later)

Training Mode should be **realistic in cognition and procedure**, not a classified emulator.

**Do emulate:** report formats, closed-loop orders, doctrine gates, sensor employment tradeoffs, team kill-chain timing, prioritization under load.  
**Do not require:** exact Aegis console buttonology, real crypto/net plans, real publication extracts, classified tactics.  
**Tone:** serious professional training; failure teaches; success is calm competence.

---

## 12. Per-Station One-Page Summary Cards

### LOOKOUT — “See early, report clean”
PQS spine: NAVEDTRA 43492 Lookout + 12968A handbook  
Train: scan → bearing/range/angle → timely report → restricted visibility  

### HELM — “Repeat, execute, report”
PQS spine: NAVEDTRA 43492 Helm/Lee Helm (+ officer Conn/OOD path)  
Train: closed-loop orders → course/speed control → traffic/casualty  

### RADAR — “Own the picture”
PQS spine: OS / CIC watchstander → supports CICWO (43101-4)  
Train: detect → classify → track hygiene → designate/share  

### SONAR — “Find without being found (until you must)”
PQS spine: STG A/C school → SQQ-89 operator PQS/OJT  
Train: passive/active tradeoff → classify → localize → ASW handoff  

### WEAPONS — “Right weapon, right track, right posture”
PQS spine: GM mount PQS + FC fire-control path + TAO doctrine  
Train: domain match → solution quality → hold/free → check fire  

### TAO — “Fight the ship”
PQS spine: NAVEDTRA 43304 + SWOS DH tactical pipeline; CICWO first  
Train: prioritize → posture → force orders → multi-warfare integration  

---

## 13. Source List (Public)

1. COMNAVSURFOR *Surface Warfare Officer Career Manual* (1412.7 series) — OOD/JOOD/CONN/CICWO/TAO proficiency & PQS list including NAVEDTRA 43101-4, 43304, 43492.  
2. OPNAVINST 3500.34 — Navy PQS program policy.  
3. NAVEDTRA 43492 — Ship’s Control and Navigation (Lookout/Helm family).  
4. NAVEDTRA 12968A — Lookout Training Handbook.  
5. NAVEDTRA 14308 — Operations Specialist rate training (CIC/radar).  
6. MyNavy HR / STG community pages & STG LaDR — sonar training continuum / SQQ-89 courses.  
7. GM / FC (FCA) LaDRs & NEOCS occupational standards — weapons/mount and Aegis technician pipelines; example PQS families 43168, 43424, 43342.  
8. FAS / GlobalSecurity OS & CIC USW information sheets — CIC ASW watch organization concepts.  
9. SWOS / TAO ITS public papers — TAO decision-density training rationale.  
10. Public helm command / lookout bearing standards (Navy & USCG navigation standards summaries).  
11. MERIDIAN codebase station map: `src/player/PlayerController.js` (`LOOKOUT`, `HELM`, `RADAR`, `SONAR`, `WEAPONS`, `TAO`); Task Force Net: `src/systems/TaskForceCoop.js`.

---

## 14. Deliverable Boundary

This document completes the requested research task: **comprehensive training plans for each sailor station**, grounded in public PQS / pipeline structure, ready to inform a future Training Mode design.

**No implementation, no gameplay changes, and no follow-on tasks are included here.**
