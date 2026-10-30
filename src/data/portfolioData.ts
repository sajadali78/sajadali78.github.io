export interface ChapterSpec {
  id: number;
  indexLabel: string;
  pageType: 'machine' | 'publications' | 'thesis' | 'software' | 'cv' | 'contact';
  shortTitle: string;
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  paragraphs: string[];
  metaLine: string;
  alignment: 'left' | 'right' | 'bottom';
  // 3D camera & state choreography for this chapter
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
  explodeTarget: number;
  fluxIntensity: number;
  showMeshWireframe: boolean;
  showFluxLines: boolean;
  skewEnabled: boolean;
  operatingMode: 'synchronous' | 'vernier';
  highlightPart: 'all' | 'stator' | 'airgap' | 'rotor' | 'mesh' | 'overview';
  kpiStrip: {
    label: string;
    value: string;
    unit?: string;
  }[];
}

export interface PublicationItem {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: string;
  category: 'Journal Article' | 'Conference Paper';
  impactNote?: string;
  doi: string;
  doiUrl: string;
  excerpt: string;
  highlights: string[];
  bibtex: string;
}

export interface ParetoCandidate {
  id: number;
  avgTorque: number; // Nm
  torqueRipple: number; // %
  pmAreaReduction: number; // %
  efficiency: number; // %
  slotOpeningMm: number;
  skewDeg: number;
  isParetoFront: boolean;
  isChosenOptimal?: boolean;
}

export const AUTHOR_PROFILE = {
  name: 'Sajad Ali',
  role: 'Graduate Researcher in Electrical Machine Design & Optimization',
  institution: 'Sukkur IBA University',
  location: 'Sukkur, Pakistan',
  email: 'Sajadali.meees24@iba-suk.edu.pk',
  secondaryEmail: 'sajad.siba@gmail.com',
  orcid: '0009-0003-7832-9279',
  orcidUrl: 'https://orcid.org/0009-0003-7832-9279',
  scholarUrl: 'https://scholar.google.com/citations?user=6XbeJKIAAAAJ&hl=en',
  researchGateUrl: 'https://www.researchgate.net/profile/Sajad-Ali-9',
  linkedinUrl: 'https://www.linkedin.com/in/sajad-ali-engineer',
  githubUrl: 'https://github.com/sajadali78',
  emSuiteLiveUrl: 'https://sajadali78.github.io/Electrical-Machines/',
  emSuiteRepoUrl: 'https://github.com/sajadali78/Electrical-Machines',
  tagline:
    'Bridging physics-based finite element analysis (FEA) with machine-learning surrogate models to accelerate the design of next-generation synchronous and vernier machines.',
  phdObjective:
    'Seeking a PhD position in electrical machine design and multi-objective optimization where electromagnetic FEA and machine learning work together inside the design loop.',
};

export const MACHINE_DIMENSIONS = [
  { parameter: 'Topology', value: 'DMDS-HRSVM', detail: 'Dual-Mode Dual-Stator Hybrid-Rotor' },
  { parameter: 'Stack Length (L)', value: '100.0 mm', detail: 'M270-35A laminated silicon steel' },
  { parameter: 'Outer / Inner Airgap', value: '0.50 mm', detail: 'Dual concentric flux transfer zones' },
  { parameter: 'Outer Stator Slots (Zs1)', value: '24 Slots', detail: '3-phase double-layer copper winding' },
  { parameter: 'Hybrid Rotor Teeth (Zr)', value: '24 Teeth', detail: '12 surface-inset PMs + 6 field slots' },
  { parameter: 'Inner Stator Slots (Zs2)', value: '12 Slots', detail: 'Brushless excitation & armature winding' },
  { parameter: 'Stator Winding Poles', value: '02 / 04', detail: 'Synchronous (high-speed) / Vernier (low-speed)' },
  { parameter: 'Optimal Skew Angle', value: '4.0°', detail: 'Cuts low-speed ripple from 73% to 27%' },
  { parameter: 'Peak Flux Density (Bmax)', value: '< 2.00 T', detail: 'Verified across both modes in Ansys Maxwell' },
];

export const CHAPTERS: ChapterSpec[] = [
  {
    id: 0,
    indexLabel: '01',
    pageType: 'machine',
    shortTitle: 'Machine',
    eyebrow: '01 · The Machine & About',
    headline: 'Electromagnetic machine design meets',
    headlineAccent: 'machine learning',
    paragraphs: [
      "I'm Sajad Ali, a Master's-level researcher in electrical engineering at Sukkur IBA University specializing in electromagnetic design and multi-objective optimization of synchronous and vernier machines.",
      'I bridge physics-based FEA simulation (Ansys Maxwell, Motor-CAD) with machine-learning surrogate models (PyTorch, GPR, NSGA-II) to accelerate the design of next-generation motors. Explore the 6 pages below or interact directly with the 3D DMDS-HRSVM machine assembly.',
    ],
    metaLine: 'M.E. Electrical Engineering (Power Systems) · Sukkur IBA University (2024–2026) · B.E. (2018–2022)',
    alignment: 'left',
    cameraPos: [3.6, 2.1, 4.9],
    cameraTarget: [-0.6, 0.15, 0],
    explodeTarget: 0.08,
    fluxIntensity: 0.25,
    showMeshWireframe: false,
    showFluxLines: false,
    skewEnabled: true,
    operatingMode: 'synchronous',
    highlightPart: 'all',
    kpiStrip: [
      { label: 'Stack Length', value: '100', unit: 'mm' },
      { label: 'Outer / Inner Slots', value: '24 / 12' },
      { label: 'Dual Airgap', value: '0.50', unit: 'mm' },
      { label: 'Lead Publication', value: 'Nature Sci. Rep.', unit: '2026' },
    ],
  },
  {
    id: 1,
    indexLabel: '02',
    pageType: 'publications',
    shortTitle: 'Publications',
    eyebrow: '02 · Peer-Reviewed Publications',
    headline: 'From Nature Scientific Reports to',
    headlineAccent: 'IEEE conferences',
    paragraphs: [
      'Lead author in Nature Scientific Reports (2026, Impact Factor 3.9) on a novel dual-mode dual-stator hybrid-rotor synchronous and vernier machine for variable-speed applications.',
      'Lead author at IEEE ELMA 2025 (Sofia, Bulgaria) on torque ripple minimization of an IPM spoke-type motor, and co-author on mitigating fault currents via coordinated DG and series reactor placement at IEEE ICPEE 2025.',
    ],
    metaLine: '3 Peer-Reviewed Papers · Nature Portfolio & IEEE Xplore · DOI & BibTeX citations',
    alignment: 'right',
    cameraPos: [-2.1, 1.35, 2.75],
    cameraTarget: [0.55, 0.55, 0.2],
    explodeTarget: 0.35,
    fluxIntensity: 0.45,
    showMeshWireframe: false,
    showFluxLines: false,
    skewEnabled: false,
    operatingMode: 'synchronous',
    highlightPart: 'stator',
    kpiStrip: [
      { label: 'Nature SR 2026', value: '3.9', unit: 'IF' },
      { label: 'IEEE ELMA 2025', value: 'Lead', unit: 'Author' },
      { label: 'IEEE ICPEE 2025', value: 'Xplore', unit: 'Paper' },
      { label: 'Total Papers', value: '3', unit: 'Published' },
    ],
  },
  {
    id: 2,
    indexLabel: '03',
    pageType: 'thesis',
    shortTitle: 'Thesis',
    eyebrow: '03 · Master’s Thesis & Optimization',
    headline: 'Dual-mode brushless machine with',
    headlineAccent: '4° ripple suppression',
    paragraphs: [
      'My Master’s thesis at Sukkur IBA University designed a brushless Dual-Mode Dual-Stator Hybrid-Rotor machine (DMDS-HRSVM). It runs as a synchronous machine at high speed and as a Vernier machine with magnetic gearing (Zr = Zs + p) at low speed.',
      'Introducing an optimized 4° skew angle to stator slots and permanent magnets reduced low-speed Vernier torque ripple from 73% down to 27% (and high-speed ripple to 6.5%). Genetic Algorithm optimization cut magnet size by ~50% while guaranteeing T_avg ≥ 5.5 Nm.',
    ],
    metaLine: 'Sukkur IBA University · Supervisors: Dr. Qasim Ali & Dr. Hafiz Mudassir Munir · April 2026',
    alignment: 'left',
    cameraPos: [1.55, 0.95, 2.25],
    cameraTarget: [-0.25, 0.45, 0.1],
    explodeTarget: 0.22,
    fluxIntensity: 0.9,
    showMeshWireframe: false,
    showFluxLines: true,
    skewEnabled: true,
    operatingMode: 'vernier',
    highlightPart: 'airgap',
    kpiStrip: [
      { label: 'Airgap Clearance', value: '0.50', unit: 'mm' },
      { label: 'Optimal Skew Angle', value: '4.0', unit: 'deg' },
      { label: 'Low-Speed Ripple', value: '73% → 27%' },
      { label: 'High-Speed Ripple', value: '7.0% → 6.5%' },
    ],
  },
  {
    id: 3,
    indexLabel: '04',
    pageType: 'software',
    shortTitle: 'EM Design Suite',
    eyebrow: '04 · EM Design Suite & Scripts',
    headline: 'Browser-based machine design suite &',
    headlineAccent: 'Maxwell FEA automation',
    paragraphs: [
      'I created EM Design Suite—a browser-based design workstation in TypeScript and React that sizes Induction, Surface PMSM, Interior PMSM, and Wound-Field machines using classical D²L equations, 9 auto-sized parametric slot shapes, and star-of-slots multi-layer (1/2/4/6/8) winding optimization (cutting sub-harmonics by 73%).',
      'In the laboratory, I developed an 850+ line IronPython/PyAEDT automation suite for Ansys Maxwell 2D to automate 46-variable parametric sweeps, moving-band transient solves, and surrogate training datasets.',
    ],
    metaLine: 'TypeScript · React · Vite · Ansys Maxwell · IronPython · PyAEDT · Open-Source',
    alignment: 'right',
    cameraPos: [-3.3, 1.45, 3.6],
    cameraTarget: [0.65, 0.1, 0.0],
    explodeTarget: 0.65,
    fluxIntensity: 0.75,
    showMeshWireframe: false,
    showFluxLines: true,
    skewEnabled: true,
    operatingMode: 'vernier',
    highlightPart: 'rotor',
    kpiStrip: [
      { label: 'EM Design Suite', value: 'Live', unit: 'App' },
      { label: 'Maxwell Script', value: '850+', unit: 'LOC' },
      { label: '4-Layer Winding', value: '-73', unit: '%' },
      { label: 'Parametric Vars', value: '46', unit: 'vars' },
    ],
  },
  {
    id: 4,
    indexLabel: '05',
    pageType: 'cv',
    shortTitle: 'CV & References',
    eyebrow: '05 · Curriculum Vitae & References',
    headline: 'Education, field engineering &',
    headlineAccent: 'supervising faculty',
    paragraphs: [
      'Graduate Research Assistant at Sukkur IBA University Electrical Machines Lab and former Field Engineer at NETS International with hands-on industrial equipment commissioning and PTCL-NTDC SD-WAN power deployment.',
      'Holder of 2 Ansys Innovation Badges (Python Automation & Maxwell Post-Processing), IEEE SCONEST Best Abstract Award, and Sindh Talent Hunt Full Merit Scholarship (2017–2022). Supported by 4 academic faculty references.',
    ],
    metaLine: 'Sukkur IBA University · NETS International · Ansys Certified · 4 Faculty References',
    alignment: 'left',
    cameraPos: [3.2, 1.85, 4.1],
    cameraTarget: [-0.55, 0.05, 0],
    explodeTarget: 0.45,
    fluxIntensity: 0.65,
    showMeshWireframe: true,
    showFluxLines: false,
    skewEnabled: true,
    operatingMode: 'synchronous',
    highlightPart: 'mesh',
    kpiStrip: [
      { label: 'Degrees', value: 'M.E. & B.E.' },
      { label: 'Ansys Badges', value: '2', unit: 'Certified' },
      { label: 'Faculty References', value: '4', unit: 'Professors' },
      { label: 'Merit Scholarship', value: '100%', unit: 'Merit' },
    ],
  },
  {
    id: 5,
    indexLabel: '06',
    pageType: 'contact',
    shortTitle: 'Contact',
    eyebrow: '06 · Contact & Inquiries',
    headline: 'Seeking a PhD position in',
    headlineAccent: 'motor design & ML',
    paragraphs: [
      'I am actively seeking PhD research opportunities in electrical machine design, multiphysics finite element modeling, and machine learning surrogate optimization. Available for Fall / Spring intake.',
      'Contact me directly via institutional email at Sajadali.meees24@iba-suk.edu.pk or connect across academic networks (Google Scholar, ORCID, LinkedIn, ResearchGate, GitHub).',
    ],
    metaLine: 'Sajad Ali · Sukkur IBA University · Available for PhD Admissions Fall/Spring',
    alignment: 'bottom',
    cameraPos: [0.0, 2.45, 5.4],
    cameraTarget: [0.0, -0.25, 0.0],
    explodeTarget: 0.18,
    fluxIntensity: 0.75,
    showMeshWireframe: false,
    showFluxLines: true,
    skewEnabled: true,
    operatingMode: 'synchronous',
    highlightPart: 'overview',
    kpiStrip: [
      { label: 'Institutional Email', value: 'Sajad Ali', unit: 'IBA' },
      { label: 'ORCID Identifier', value: '0009-0003' },
      { label: 'Google Scholar', value: 'Indexed', unit: 'Citations' },
      { label: 'PhD Status', value: 'Applying', unit: '2026' },
    ],
  },
];


export const PUBLICATIONS: PublicationItem[] = [
  {
    id: 'nature-sr-2026',
    title: 'A dual-mode dual-stator hybrid-rotor synchronous and vernier machine for variable-speed applications',
    authors: 'Sajad Ali, Q. Ali, H. M. Munir, et al.',
    venue: 'Scientific Reports (Nature), vol. 16',
    year: '2026',
    category: 'Journal Article',
    impactNote: 'Impact Factor 3.9 · Lead Author',
    doi: '10.1038/s41598-026-40821-y',
    doiUrl: 'https://doi.org/10.1038/s41598-026-40821-y',
    excerpt:
      'Proposes and validates a novel brushless dual-mode dual-stator hybrid-rotor synchronous and vernier machine (DMDS-HRSVM) capable of switching seamlessly between high-speed synchronous operation and low-speed high-torque vernier magnetic gearing without brushes or slip rings.',
    highlights: [
      'Designed concentric inner/outer stators with a sandwiched hybrid rotor combining surface-inset NdFeB magnets and harmonic field windings.',
      'Applied a 4° stator and magnet skew that reduced low-speed Vernier torque ripple from 73% to 27% and high-speed ripple to 6.5%.',
      'Performed Genetic Algorithm optimization in Ansys Maxwell, cutting permanent magnet cross-sectional area by nearly 50% while holding average torque ≥ 5.5 Nm.',
    ],
    bibtex: `@article{Ali2026DualMode,
  author  = {Ali, Sajad and Ali, Qasim and Munir, Hafiz Mudassir},
  title   = {A dual-mode dual-stator hybrid-rotor synchronous and vernier machine for variable-speed applications},
  journal = {Scientific Reports},
  volume  = {16},
  year    = {2026},
  publisher = {Nature Portfolio},
  doi     = {10.1038/s41598-026-40821-y}
}`,
  },
  {
    id: 'ieee-elma-2025',
    title: 'Torque ripple minimization of IPM spoke-type motor',
    authors: 'Sajad Ali, K. Kumar, F. S. Alromithy, M. R. Altimania, Q. Ali, H. M. Munir',
    venue: 'Proc. IEEE 19th Conf. on Electrical Machines, Drives and Power Systems (ELMA 2025), Sofia, Bulgaria',
    year: '2025',
    category: 'Conference Paper',
    impactNote: 'Lead Author · Presented in Sofia, Bulgaria',
    doi: '10.1109/ELMA.2025.11083385',
    doiUrl: 'https://doi.org/10.1109/ELMA.2025.11083385',
    excerpt:
      'Parametric electromagnetic optimization of an interior permanent magnet (IPM) spoke-type motor focusing on flux-barrier geometry and pole-arc shaping to suppress cogging torque and pulsating torque ripple.',
    highlights: [
      'Modeled spoke-type ferrite/NdFeB flux concentration rotor topology in Ansys Maxwell 2D transient FEA.',
      'Executed parametric sweeps across magnet insertion depth, bridge thickness, and stator slot opening width.',
      'Achieved substantial torque ripple suppression while preserving airgap flux density and average electromagnetic torque.',
    ],
    bibtex: `@inproceedings{Ali2025TorqueRipple,
  author    = {Ali, Sajad and Kumar, K. and Alromithy, F. S. and Altimania, M. R. and Ali, Q. and Munir, H. M.},
  title     = {Torque ripple minimization of IPM spoke-type motor},
  booktitle = {Proc. IEEE 19th Conf. on Electrical Machines, Drives and Power Systems (ELMA)},
  year      = {2025},
  address   = {Sofia, Bulgaria},
  doi       = {10.1109/ELMA.2025.11083385}
}`,
  },
  {
    id: 'ieee-icpee-2025',
    title: 'Mitigating fault currents and overloads via coordinated DG and reactor placement',
    authors: 'N. A. Memon, H. M. Munir, M. R. Altimania, F. S. Alromithy, Sajad Ali, A. W. Ali',
    venue: 'Proc. IEEE 3rd Int. Conf. on Power Electronics and Energy (ICPEE 2025)',
    year: '2025',
    category: 'Conference Paper',
    impactNote: 'Co-Author · IEEE Xplore',
    doi: '10.1109/ICPEE67608.2025.11422110',
    doiUrl: 'https://doi.org/10.1109/ICPEE67608.2025.11422110',
    excerpt:
      'Investigates coordinated placement of distributed generation (DG) units and current-limiting series reactors in mesh distribution networks to mitigate short-circuit fault levels and line overloads.',
    highlights: [
      'Evaluated fault current contributions and thermal line loading on standard IEEE mesh distribution test feeders.',
      'Formulated a multi-criteria placement strategy balancing voltage profile stability and short-circuit current suppression.',
    ],
    bibtex: `@inproceedings{Memon2025Mitigating,
  author    = {Memon, N. A. and Munir, H. M. and Altimania, M. R. and Alromithy, F. S. and Ali, Sajad and Ali, A. W.},
  title     = {Mitigating fault currents and overloads via coordinated DG and reactor placement},
  booktitle = {Proc. IEEE 3rd Int. Conf. on Power Electronics and Energy (ICPEE)},
  year      = {2025},
  doi       = {10.1109/ICPEE67608.2025.11422110}
}`,
  },
];

// Deterministic seeded generator matching journey.html for the 150 FEA Pareto designs
export const PARETO_CANDIDATES: ParetoCandidate[] = (() => {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const raw: ParetoCandidate[] = [];
  for (let k = 0; k < 90; k++) {
    const u = rnd();
    const T = Number((5.1 + 9.2 * Math.pow(u, 0.82)).toFixed(2));
    const base = 6.5 + 32 * Math.pow((T - 5.1) / 9.2, 2.15);
    const rip = Number(Math.min(73, base + Math.pow(rnd(), 1.55) * 34).toFixed(1));
    const pmRed = Number(Math.max(8, Math.min(56, 54 - (T - 5.1) * 3.1 + (rnd() - 0.5) * 9)).toFixed(1));
    const eff = Number((88.5 + (T / 14.5) * 5.8 - (rip / 100) * 3.2).toFixed(1));
    raw.push({
      id: k + 1,
      avgTorque: T,
      torqueRipple: rip,
      pmAreaReduction: pmRed,
      efficiency: eff,
      slotOpeningMm: Number((1.8 + rnd() * 2.4).toFixed(2)),
      skewDeg: Number((rnd() * 6.0).toFixed(1)),
      isParetoFront: false,
    });
  }
  // Explicitly inject the thesis benchmark designs so users can inspect exact thesis values
  raw.push({
    id: 91,
    avgTorque: 6.85,
    torqueRipple: 73.0,
    pmAreaReduction: 0.0,
    efficiency: 87.4,
    slotOpeningMm: 3.4,
    skewDeg: 0.0,
    isParetoFront: false,
  });
  raw.push({
    id: 92,
    avgTorque: 6.42,
    torqueRipple: 27.0,
    pmAreaReduction: 49.6,
    efficiency: 92.8,
    slotOpeningMm: 2.35,
    skewDeg: 4.0,
    isParetoFront: true,
    isChosenOptimal: true,
  });

  const sorted = [...raw].sort((a, b) => b.avgTorque - a.avgTorque);
  let bestRipple = 1e9;
  sorted.forEach((d) => {
    if (d.torqueRipple < bestRipple) {
      d.isParetoFront = true;
      bestRipple = d.torqueRipple;
    }
  });
  return raw;
})();

export const THESIS_SUMMARY = {
  title: 'Design Of Brushless Hybrid Rotor Machine With Synchronous and Vernier Motor Operation',
  institution: 'Sukkur IBA University, Department of Electrical Engineering',
  date: 'April 2026',
  supervisors: 'Dr. Qasim Ali & Dr. Hafiz Mudassir Munir',
  problemStatement:
    'Induction motors suffer from slip-dependent rotor copper losses, while Wound Rotor Synchronous Machines (WRSM) require brushes and slip rings that introduce sparking and maintenance issues. Permanent Magnet Vernier Machines (PMVM) deliver high low-speed torque density via magnetic gearing but consume large magnet volumes and struggle at high speeds due to excessive core loss and reactance.',
  modelsCompared: [
    {
      code: 'DMDS-WRSVM',
      name: 'Brushless Dual-Mode Dual-Stator Wound-Rotor Synchronous & Vernier Machine',
      rotorType: 'Non-salient wound rotor with harmonic excitation & field windings',
      avgTorqueLowSpeed: '5.12 Nm',
      avgTorqueHighSpeed: '3.85 Nm',
      rippleBeforeSkew: '68.4%',
      rippleAfterSkew: '29.2%',
      pmUsage: 'None (100% electromagnetically excited)',
    },
    {
      code: 'DMDS-HRSVM',
      name: 'Brushless Dual-Mode Dual-Stator Hybrid-Rotor Synchronous & Vernier Machine',
      rotorType: 'Hybrid rotor combining 12 surface-inset PMs + 6 DC field winding slots',
      avgTorqueLowSpeed: '6.42 Nm',
      avgTorqueHighSpeed: '4.95 Nm',
      rippleBeforeSkew: '73.0%',
      rippleAfterSkew: '27.0% (Low Speed) / 6.5% (High Speed)',
      pmUsage: '49.6% reduced PM area via Genetic Algorithm optimization',
    },
  ],
  ironPythonSnippet: `# PyAEDT / IronPython Parametric Dual-Stator Vernier Generator (Excerpt)
# Author: Sajad Ali — Sukkur IBA University Electrical Machines Lab
import ScriptEnv
ScriptEnv.Initialize("Ansoft.ElectronicsDesktop")
oDesktop.RestoreWindow()
oProject = oDesktop.GetActiveProject()
oDesign  = oProject.GetActiveDesign()

# 46 Parametric Design Variables (Zr = Zs + p -> 44 = 24 + 20, Gear Ratio = 2.2)
params = {
    "R_os_out": "172mm", "R_os_in": "121mm",
    "Airgap_outer": "0.5mm", "Airgap_inner": "0.5mm",
    "R_rot_out": "118.5mm", "R_rot_in": "80mm",
    "Stack_Length": "100mm", "Skew_Angle": "4.0deg",
    "Slot_Fill_Target": "0.90", "PM_Arc_Ratio": "0.78"
}
for k, v in params.items():
    oDesign.ChangeProperty(["NAME:AllTabs", ["NAME:LocalVariableTab",
        ["NAME:PropServers", "LocalVariables"],
        ["NAME:ChangedProps", ["NAME:" + k, "Value:=", v]]]])

# Configure Transient Moving Band & Park Transform dq-Axis Outputs
oModule = oDesign.GetModule("OutputVariable")
oModule.CreateOutputVariable("Torque_Ripple_Pct",
    "(max(Moving1.Torque) - min(Moving1.Torque)) / avg(Moving1.Torque) * 100",
    "Transient", "Fields", [])`,
};

export const CV_DATA = {
  education: [
    {
      degree: 'M.E. in Electrical Engineering (Power Systems)',
      institution: 'Sukkur IBA University, Sukkur, Pakistan',
      period: 'Jan 2024 – Apr 2026',
      details: [
        'Thesis: Design of a Dual-Stator Brushless Hybrid-Rotor Machine with Synchronous and Vernier Operation.',
        'Outcome: Lead-author journal article published in Nature Scientific Reports (2026, Impact Factor 3.9).',
      ],
    },
    {
      degree: 'B.E. in Electrical Engineering (Power)',
      institution: 'Sukkur IBA University, Sukkur, Pakistan',
      period: 'Aug 2018 – Dec 2022',
      details: [
        'Final-Year Project: Parameter optimization for biogas production from food waste.',
        'Honours: IEEE SCONEST 2022 Best Abstract Award; Sindh Talent Hunt Full Merit Scholarship (2017).',
      ],
    },
  ],
  experience: [
    {
      role: 'Graduate Research Assistant — Electrical Machines Lab',
      organization: 'Sukkur IBA University, Pakistan',
      period: 'Aug 2024 – Present',
      bullets: [
        'Designed and analyzed a novel dual-stator hybrid-rotor synchronous–vernier machine; built parametric Ansys Maxwell models, ran FEA design sweeps, and extracted key electromagnetic KPIs (torque, ripple, back-EMF, core/copper losses, efficiency).',
        'Developed an automated simulation pipeline using Python (PyAEDT/IronPython) and MATLAB to drive FEA solvers and post-process transient waveforms for surrogate-model training datasets.',
        'Performed comparative analysis of synchronous vs. vernier operating modes for variable-speed drives; lead-authored Nature Scientific Reports (2026) article.',
        'Optimized an IPM spoke-type motor for torque-ripple minimization; presented findings at IEEE ELMA 2025 (Sofia, Bulgaria).',
      ],
    },
    {
      role: 'Field Engineer',
      organization: 'NETS International, Sukkur, Pakistan',
      period: 'Jan 2023 – Dec 2024',
      bullets: [
        'Hands-on commissioning, testing, and field engineering on industrial electrical equipment and PTCL–NTDC SD-WAN power infrastructure, deepening practical intuition for real-world motor, transformer, and drive systems.',
      ],
    },
  ],
  skillGroups: [
    {
      category: 'FEA & Electromagnetic Design',
      items: ['Ansys Maxwell 2D/3D', 'Motor-CAD', 'Electromagnetic FEA', 'Magnetic-Circuit Modelling', 'Stator/Rotor Topology Design', 'Thermal & Loss Analysis'],
    },
    {
      category: 'Machine Topologies',
      items: ['Dual-Stator & Hybrid-Rotor', 'Vernier Machines', 'Interior PM (IPM & Spoke-Type)', 'Surface PMSM', 'SynRM', 'Brushless Synchronous & PCB Motors'],
    },
    {
      category: 'Programming, Optimization & ML',
      items: ['Python (NumPy, pandas, scikit-learn, PyTorch)', 'IronPython / PyAEDT Automation', 'MATLAB / Simulink', 'NSGA-II & Genetic Algorithms', 'Gaussian Process Regression (GPR)', 'Physics-Informed Neural Networks (PINNs)'],
    },
  ],
  certificationsAndAwards: [
    {
      title: 'Ansys Innovation Badge: Post-processing in Ansys Maxwell',
      issuer: 'Ansys Inc.',
      date: 'Feb 2026',
      url: 'https://innovation.ansys.com/badges/badge/cG9zdC1wcm9jZXNzaW5nLWluLWFuc3lzLW1heHdlbGwtMjM%3D',
    },
    {
      title: 'Ansys Innovation Badge: Intro to Python',
      issuer: 'Ansys Inc.',
      date: 'Feb 2026',
      url: 'https://innovation.ansys.com/badges/badge/aW50cm8tdG8tcHl0aG9uLTQ1Nw%3D%3D',
    },
    {
      title: 'IEEE SCONEST 2022 Best Abstract Award',
      issuer: 'IEEE Student Conference on Engineering, Sciences and Technology',
      date: 'Nov 2022',
    },
    {
      title: 'Sindh Talent Hunt Full Merit Scholarship',
      issuer: 'Sukkur IBA University',
      date: '2017 – 2022',
    },
  ],
  references: [
    {
      name: 'Dr. Qasim Ali',
      title: 'Assistant Professor, Department of Electrical Engineering',
      institution: 'Sukkur IBA University',
      email: 'Qasim-ali@iba-suk.edu.pk',
    },
    {
      name: 'Prof. Dr. Fareed Hussain Mangi',
      title: 'Professor, Department of Electrical Engineering',
      institution: 'Sukkur IBA University',
      email: 'Fareed.mangi@berlinsbi.com',
    },
    {
      name: 'Dr. Hafiz Mudassir Munir',
      title: 'Assistant Professor, Department of Electrical Engineering',
      institution: 'Sukkur IBA University',
      email: 'mudassir.munir@iba-suk.edu.pk',
    },
    {
      name: 'Dr. Ghulam Akbar',
      title: 'Assistant Professor, Department of Electrical Engineering',
      institution: 'Sukkur IBA University',
      email: 'ghulamakbar@iba-suk.edu.pk',
    },
  ],
};
