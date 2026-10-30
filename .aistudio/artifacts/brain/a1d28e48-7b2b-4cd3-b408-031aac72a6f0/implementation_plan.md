# Sajad Ali — Interactive 3D Electrical Machine Portfolio ("Inside the Machine 3D")

Transform **sajadali78.github.io** from a 2D canvas scroll page into a physically based **Three.js 3D Electromagnetic Machine Workstation & Academic Portfolio** showcasing Sajad Ali's research in synchronous/vernier machine design, finite element analysis (FEA), and machine-learning surrogate optimization.

## User Review & Critical Decisions

> [!IMPORTANT]
> Grounded directly in your GitHub repository (`sajadali78/sajadali78.github.io` and `sajadali78/Electrical-Machines`), this plan upgrades your existing 6-chapter *"Inside the Machine"* narrative and Jekyll academic pages (`Publications`, `Thesis`, `EM Design Suite`, `Scripts & Workflows`, and `CV`) into a unified 3D WebGL experience with full academic depth.

- **Confirmed Source Profile**: **Sajad Ali** — Graduate Researcher in Electrical Machine Design & Optimization at Sukkur IBA University (`Sajadali.meees24@iba-suk.edu.pk`), Lead Author in *Nature Scientific Reports* (2026).
- **3D Hero Subject**: A multi-part procedural **Dual-Mode Dual-Stator Hybrid-Rotor Synchronous and Vernier Machine (DMDS-HRSVM)** built to your thesis specifications (100 mm stack length, 24 outer stator slots, 0.5 mm dual airgaps, 12-PM + 6-field-slot hybrid rotor with interactive 4° skew, and 12-slot inner stator).
- **Interactive Navigation Mode**: Seamless 6-chapter 3D camera choreography synchronized with scroll/chapter selection, paired with a collapsible bottom engineering control dock (exploded axial view, synchronous vs. vernier mode, 4° rotor skew toggle, live flux density $B$-field shader/colormap, and interactive NSGA-II Pareto front inspector) plus modal drawers for full **Publications**, **Thesis Data**, **EM Design Suite & Scripts**, and **CV**.

---

## 1. Overview & Core Concept

- **What It Does**: Places visitors inside a studio-lit, real-time 3D cutaway and exploded assembly of Sajad Ali's published **Dual-Stator Hybrid-Rotor Synchronous–Vernier Machine**. As visitors scroll or step through the 6 chapters—or manipulate the machine directly using orbit controls and the bottom engineering dock—the 3D camera glides from the finned housing into a double-layer copper stator slot, across the 0.5 mm airgap, through the 4°-skewed hybrid rotor, and into an interactive 3D/2D FEA surrogate & NSGA-II Pareto optimization inspector.
- **Target Audience / Persona**: PhD admissions committees, principal investigators in electrical machines and power electronics, R&D motor design engineers, and fellow researchers evaluating Sajad's combination of electromagnetic FEA mastery (Ansys Maxwell, Motor-CAD, PyAEDT) and ML surrogate modeling (PyTorch, GPR, PINNs, NSGA-II).
- **Key Value**: Bridges deep physical engineering credibility with interactive 3D clarity—allowing reviewers to visually inspect how the dual-stator hybrid-rotor topology operates in both high-speed Synchronous ($P = 2$) and low-speed Vernier ($Z_r = Z_s + p$) modes, verify how the 4° skew reduces torque ripple from 73% to 27%, and access all peer-reviewed papers, thesis waveforms, and the *EM Design Suite* without leaving the viewport.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **6-Chapter Scroll & Guided 3D Camera Tour**:
   - **01 · The Machine**: Full 3D perspective of the assembled DMDS-HRSVM motor on a precision testbed pedestal. Introduces Sajad Ali, education at Sukkur IBA University (M.E. 2026, B.E. 2022), and core research bridging FEA and ML.
   - **02 · Outer Stator**: Camera dives into the 24-slot outer stator core, highlighting the 3-phase double-layer copper coils, slot liners, wedges, and end-windings, connected to field engineering experience at NETS International.
   - **03 · Airgap & 4° Skew**: Macro camera view along the 0.5 mm outer and inner airgaps. Visitors can toggle the **4° Stator/PM Skew** live in 3D and inspect the resulting torque waveform comparison (low-speed ripple dropping from 73% to 27%, high-speed to 6.5%).
   - **04 · Hybrid Rotor (Synchronous vs. Vernier)**: Axial cutaway isolating the sandwiched hybrid rotor (24 teeth, 12 alternating N/S permanent magnets, and 6 DC/field winding slots). Visitors can switch between **Synchronous Mode** (high speed, 1500 rpm) and **Vernier Mode** (low speed, magnetic gearing effect) and watch the 3D rotor speed and magnetic flux wave harmonics respond in real time.
   - **05 · FEA & ML Surrogate Models**: Overlays the 3D machine with a procedural FEA triangulation wireframe and opens an interactive **NSGA-II & GA Pareto Front Explorer** (150 sampled FEA designs + Pareto-optimal curve trading Average Torque vs. Torque Ripple and 50% PM area reduction), referencing the *IEEE ELMA 2025* IPM spoke-type motor optimization and 850-line IronPython Maxwell automation workflow.
   - **06 · Next & Academic Dossier**: Full-view synthesis with direct actions to inspect the complete **CV**, **Publications** (*Nature Scientific Reports 2026*, *IEEE ELMA 2025*, *IEEE ICPEE 2025*), **Master's Thesis**, **EM Design Suite**, Google Scholar, LinkedIn, ORCID, and email contact.
2. **Collapsible Bottom Engineering Dock (`<= 15%` Viewport Footprint)**:
   - Pinned at bottom-center with a `▾ Hide Controls / ▴ Show Controls` toggle (and `H` shortcut) for unobstructed 3D inspection.
   - **Axial Exploded View Slider (`0% – 100%`)**: Smoothly separates the Finned Housing, Outer Stator, Hybrid Rotor, Inner Stator, and Shaft/Bearings along the Z-axis using exponential damping so visitors can inspect internal concentric assemblies.
   - **Operating Mode Selector**: `Synchronous (High Speed)` vs. `Vernier (Low Speed Gear)` vs. `Cutaway Inspect`.
   - **Electromagnetic Overlays**: Toggle `B-Field Flux Heatmap` ($0.0\text{ T} – 2.0\text{ T}$ Ansys Maxwell palette), `4° Skew Geometry`, and `FEA Mesh Wireframe`.
3. **Academic Dossier Modal Drawers (Top Bar Navigation)**:
   - Clicking **Publications**, **Thesis & Research**, **Software & Scripts**, or **Curriculum Vitae** in the top navigation bar opens a structured editorial overlay drawer containing the complete content from `sajadali78.github.io` (including DOI links, citations, thesis optimization tables, the *EM Design Suite* overview & launch link, and the YouTube demo of the IronPython Vernier workflow).

### Visual Identity & Theme
- **Aesthetic Direction**: *Electrical Steel & Winding Copper Monograph*—preserving the signature industrial-editorial material palette of `sajadali78.github.io` while elevating it with studio PBR lighting and tactile precision.
- **Color Palette & Mood (60-30-10 Discipline)**:
  - **60% Dominant Neutral Canvas**: Deep Blued Lamination Steel (`#12181C` background canvas) paired with subtle structural slate surfaces (`#1B2328`).
  - **30% Structural Surfaces & Typography**: Warm Paper White (`#E9E4DA`) for primary prose, Muted Steel (`#9AA5A8`) for metadata, and hairline borders (`#36424A`).
  - **10% High-Intent Accent**: Enameled Winding Copper (`#D0864A`) for active interactive controls, primary links, and phase-A coils, complemented by Maxwell Flux Telemetry stops (`#1D3A52` → `#2F7F86` → `#8FB27A` → `#E3A64B` → `#E2583A`) strictly on electromagnetic plots and flux shaders.
- **Typography & Hierarchy (2+1 Font Rule)**:
  - *Display / Chapter Headings*: `Fraunces` (expressive editorial serif for chapter titles and monograph headers, with `text-wrap: balance`).
  - *Body Prose & UI Controls*: `Plus Jakarta Sans` (clean, high-legibility geometric sans at 15px–16px).
  - *Engineering Telemetry & Citations*: `IBM Plex Mono` with `tabular-nums` for dimensions (`100 mm` stack, `0.5 mm` airgap, `24` slots), DOIs, and FEA KPI readouts.
- **Top Bar Contract**:
  - Strict 1-row, 3-zone header:
    - **Zone 1 (Brand)**: `Sajad Ali` (single-line wordmark).
    - **Zone 2 (Nav Links)**: `Machine 3D` · `Publications` · `Thesis` · `Software` · `CV` (concise single-line links).
    - **Zone 3 (Primary Action)**: `Contact for PhD` (opens direct academic contact & links modal).
  - All metadata (dates, venues, DOIs, machine specs) uses clean unboxed typography separated by `·` (zero static pill badges).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: 9-Part Procedural Three.js DMDS-HRSVM Assembly vs. Static External GLTF**
  - *Chosen Approach*: Construct the Dual-Stator Hybrid-Rotor machine procedurally in Three.js using extruded 2D lamination profiles (`THREE.Shape` + `THREE.ExtrudeGeometry` with bevels), `TubeGeometry` end-windings, and `InstancedMesh` for stator/rotor teeth, coils, permanent magnets, and cooling fins.
  - *Why*: Guarantees zero external `.glb`/`.hdr` 404 errors, allows exact parametric representation of Sajad's 24-slot outer stator / 24-tooth rotor / 12-PM / 12-slot inner stator geometry, and enables live interactive **4° skew deformation**, **axial exploded-view separation**, and **real-time $B$-field flux vertex/fragment coloring** that a static model cannot do.
- **Decision 2: Unified Single-Viewport Experience with Rich Academic Drawers**
  - *Chosen Approach*: Keep the full-bleed (`100vw × 100vh`) 3D electromagnetic stage active in the background while providing both the 6-chapter scroll narrative and instant slide-over dossier views for *Publications*, *Thesis*, *EM Design Suite / Scripts*, and *CV*.
  - *Why*: Lets busy faculty reviewers either enjoy the guided 3D tour of Sajad's machine or jump straight to his *Nature Scientific Reports* citation, Ansys Maxwell scripts, or full CV in one click.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        App Shell (100vw × 100vh)                            │
├──────────────────────┬───────────────────────────┬──────────────────────────┤
│   Top Bar Contract   │   3D WebGL Stage (Ref)    │  UI Overlay & Drawers    │
│  ┌────────────────┐  │  ┌─────────────────────┐  │  ┌────────────────────┐  │
│  │ Zone 1: Brand  │  │  │ RoomEnvironment PBR │  │  │ 6-Chapter Scroll   │  │
│  │ Zone 2: 5 Navs │  │  │ Warm Key + Cool Fill│  │  │ Narrative Cards    │  │
│  │ Zone 3: CTA    │  │  │ Horizon FogExp2     │  │  └─────────┬──────────┘  │
│  └────────────────┘  │  └──────────┬──────────┘  │            │             │
│                      │             ▼             │  ┌─────────▼──────────┐  │
│                      │  ┌─────────────────────┐  │  │ Interactive Charts │  │
│                      │  │ Procedural 9-Part   │  │  │ • Torque & 4° Skew │  │
│                      │  │ DMDS-HRSVM Group    │  │  │ • NSGA-II Pareto   │  │
│                      │  │ 1. Finned Housing   │  │  └─────────┬──────────┘  │
│                      │  │ 2. Outer Stator Iron│  │            │             │
│                      │  │ 3. 24x Outer Coils  │  │  ┌─────────▼──────────┐  │
│                      │  │ 4. Hybrid Rotor Core│  │  │ Collapsible Bottom │  │
│                      │  │ 5. 12x N/S PMs      │  │  │ Engineering Dock   │  │
│                      │  │ 6. 6x Rotor Windings│  │  └─────────┬──────────┘  │
│                      │  │ 7. Inner Stator Core│  │            │             │
│                      │  │ 8. 12x Inner Coils  │  │  ┌─────────▼──────────┐  │
│                      │  │ 9. Shaft & Pedestal │  │  │ Dossier Modals:    │  │
│                      │  └─────────────────────┘  │  │ Pubs|Thesis|SW|CV  │  │
│                      │                           │  └────────────────────┘  │
└──────────────────────┴───────────────────────────┴──────────────────────────┘
```

### Data Model & Portfolio Content Store
- **Structured Portfolio Repository Data**:
  - Complete metadata and abstracts for all 3 peer-reviewed publications (*Nature Scientific Reports 2026*, *IEEE ELMA 2025*, *IEEE ICPEE 2025*) with one-click BibTeX copy and DOI links.
  - Complete Master's Thesis dataset: machine dimensions table (`100 mm` stack, `0.5 mm` dual airgaps, `24` slots, `02/04` poles), high-speed vs. low-speed torque waveforms (before and after 4° skew: `73% → 27%` ripple), and GA optimization results (`~50%` PM area reduction, $T_{avg} \ge 5.5\text{ Nm}$).
  - Engineering Software showcase: *EM Design Suite* interactive feature breakdown ($D^2L$ sizing, 9 slot shapes, multi-layer star of slots, dq modeling) with live launch/embed toggle, plus the *Dual-Stator Sandwiched-Rotor Vernier Machine* 850-line IronPython automation pipeline and YouTube walkthrough.
  - Full CV data: Education, Research & Field Experience, Technical Skills, Ansys Badges, Awards, and 4 Academic References.

### Interactive Component & State Mapping
- **Three.js Scene Controller (`useRef` Isolated Canvas)**:
  - Uses hardware vs. software WebGL detection (`isSoftwareGl` probe), `ACESFilmicToneMapping`, `RoomEnvironment` via `PMREMGenerator`, warm directional key light + cool `HemisphereLight` + `FogExp2`, and soft radial contact shadow grounding under the machine pedestal.
  - Smoothly interpolates camera position, lookAt target, axial explosion offsets (`explodeFactor`), rotor angular velocity (`synchronous` vs. `vernier` pole-pair ratio), 4° helical twist/skew offset, and flux density shader intensity using `THREE.MathUtils.damp(..., delta)` with zero per-frame allocations.
- **Interactive Waveform & Pareto Inspector**:
  - In Chapter 3 (Airgap & Skew), users can toggle between *Un-skewed (73% ripple)* and *4° Skewed (27% ripple)* to see both the 3D stator/magnet skew angle and the comparative electrical-cycle torque waveform plot update.
  - In Chapter 5 (Surrogate Models), users can hover or click any candidate design on the 150-point NSGA-II Pareto scatter plot to inspect its predicted Average Torque (Nm), Torque Ripple (%), PM Volume ($mm^3$), and see the corresponding flux state reflected on the 3D machine.
