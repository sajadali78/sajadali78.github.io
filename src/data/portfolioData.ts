/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Portfolio content for Sajad Ali. Every fact here comes from his own
 * records: his CV, his LinkedIn profile as verified in chat, his Google
 * Scholar record, and his previous portfolio site. Items that were
 * unverified or that he excluded (NETS, SEPCO, MUET, the Graduate
 * Research Assistant role, Ansys badges, performance percentages) are
 * deliberately left out; see the pull request description for the flags.
 */

export const AUTHOR_PROFILE = {
  name: 'Sajad Ali',
  role: 'Electrical Machine Design Researcher',
  institution: 'Sukkur IBA University',
  location: 'Sukkur, Pakistan',
  email: 'Sajadali.meees24@iba-suk.edu.pk',
  secondaryEmail: 'sajad.siba@gmail.com',
  orcid: '0009-0003-7832-9279',
  orcidUrl: 'https://orcid.org/0009-0003-7832-9279',
  scholarUrl: 'https://scholar.google.com/citations?user=6XbeJKIAAAAJ&hl=en',
  researchGateUrl: 'https://www.researchgate.net/profile/Sajad-Ali-9',
  linkedinUrl: 'https://www.linkedin.com/in/sajadali7/',
  githubUrl: 'https://github.com/sajadali78',
  tagline:
    'Bridging physics-based finite element analysis (FEA) with machine-learning surrogate models to accelerate the design of next-generation synchronous and vernier machines.',
  phdObjective:
    'Seeking a PhD position in electrical machine design and multi-objective optimization where electromagnetic FEA and machine learning work together inside the design loop.',
};

export interface MachineProject {
  title: string;
  kind: string;
  description: string;
  specs: string[];
}

export const MACHINES: MachineProject[] = [
  {
    title: 'DMDS-HRSVM',
    kind: 'Thesis machine · Dual-mode dual-stator hybrid-rotor',
    description:
      'The machine of the ME thesis. It operates in synchronous mode and in vernier mode, so one machine covers high-speed and low-speed variable-speed operation.',
    specs: [
      '24 stator slots',
      'Stator winding poles 02 / 04',
      'Stack length 100 mm',
      'Airgap 0.5 mm, inner and outer',
    ],
  },
  {
    title: 'DMDS-WRSVM',
    kind: 'Thesis machine · Dual-mode dual-stator wound-rotor',
    description:
      'The second model of the ME thesis, studied alongside the hybrid-rotor machine for synchronous and vernier operation.',
    specs: ['Dual stator', 'Synchronous and vernier operation'],
  },
  {
    title: 'Dual stator IPM vernier motor',
    kind: 'Direct-drive variable-speed application',
    description:
      'Design and analysis of a dual stator interior permanent magnet vernier motor for direct drive variable speed applications, presented at iCoMET in Sukkur.',
    specs: ['iCoMET, Sukkur', '22–23 May 2026'],
  },
  {
    title: 'IPM spoke-type motor',
    kind: 'Torque ripple minimisation',
    description:
      'Torque ripple minimisation of an interior permanent magnet spoke-type motor, presented at IEEE ELMA in Sofia.',
    specs: ['IEEE ELMA 2025', 'Sofia, Bulgaria'],
  },
  {
    title: 'Dual-stator sandwiched-rotor vernier machine',
    kind: 'Parametric Maxwell 2D modelling workflow',
    description:
      'A parametric Ansys Maxwell 2D model built with an IronPython automation suite: slot geometry, double-layer winding, and dq-axis outputs, with Optimetrics sweeps and optimisation.',
    specs: ['Vernier relation Zr = Zs + p, 44 = 24 + 20', 'Magnetic gear ratio 2.2'],
  },
  {
    title: 'Dual-rotor yokeless-stator SPM machine',
    kind: 'Automated 2D modelling · Work in progress',
    description:
      'Automated 2D electromagnetic modelling in Ansys Maxwell using AEDT IronPython. Modelling only; no solved results are claimed here.',
    specs: ['Ansys Maxwell', 'AEDT IronPython'],
  },
];

export interface Publication {
  title: string;
  venue: string;
  year: string;
  doi?: string;
  doiUrl?: string;
}

export const PUBLICATIONS: Publication[] = [
  {
    title:
      'A dual-mode dual-stator hybrid-rotor synchronous and vernier machine for variable-speed applications',
    venue: 'Scientific Reports (Nature), vol. 16',
    year: '2026',
    doi: '10.1038/s41598-026-40821-y',
    doiUrl: 'https://doi.org/10.1038/s41598-026-40821-y',
  },
  {
    title: 'Torque ripple minimization of IPM spoke-type motor',
    venue: 'Proc. IEEE 19th Conf. on Electrical Machines, Drives and Power Systems (ELMA 2025), Sofia, Bulgaria',
    year: '2025',
    doi: '10.1109/ELMA.2025.11083385',
    doiUrl: 'https://doi.org/10.1109/ELMA.2025.11083385',
  },
  {
    title: 'Mitigating fault currents and overloads via coordinated DG and reactor placement',
    venue: 'Proc. IEEE 3rd Int. Conf. on Power Electronics and Energy (ICPEE 2025)',
    year: '2025',
    doi: '10.1109/ICPEE67608.2025.11422110',
    doiUrl: 'https://doi.org/10.1109/ICPEE67608.2025.11422110',
  },
  {
    title: 'Design and Analysis of Dual Stator IPM Vernier Motor for Direct Drive Variable Speed Applications',
    venue: 'iCoMET, Sukkur',
    year: '2026',
  },
];

export interface WebProject {
  title: string;
  description: string;
  liveUrl: string;
}

export const WEB_PROJECTS: WebProject[] = [
  {
    title: 'EM Design Suite',
    description:
      'A browser-based electromagnetic machine design workstation: D²L sizing, slot geometry, multi-layer windings, harmonics and performance.',
    liveUrl: 'https://em-design-suite.vercel.app/',
  },
  {
    title: 'FluxLab — Motor Geometry Quest',
    description:
      'An interactive machine sizing and parametric CAD curriculum: 35 electromagnetic geometry benches across 6 machine zones, with a build studio that exports Ansys Maxwell Python scripts.',
    liveUrl: 'https://flux-lab-two.vercel.app/',
  },
  {
    title: 'PubPlot',
    description:
      'A publication-ready academic graphing platform: journal presets, multi-panel figures, curve fitting, error bars, real PDF, EPS, PGF, PNG, TIFF and JPG exports, and a reproducible Matplotlib script for every figure.',
    liveUrl: 'https://pubplot.vercel.app/',
  },
];

export const EXPERIENCE = [
  {
    title: 'Visiting Faculty',
    place: 'Sukkur IBA University · Applied Physics Laboratory',
    period: 'Jan 2025 – Present',
    detail: 'Teaching in the Applied Physics Laboratory.',
  },
];

export const EDUCATION = [
  {
    title: 'ME Electrical Engineering',
    place: 'Sukkur IBA University · Power Systems',
    period: 'Jan 2024 – Aug 2026',
    detail:
      'Thesis: Design of Dual Stator Brushless Hybrid Rotor Machine With Synchronous And Vernier Motor Operation.',
  },
  {
    title: 'BE Electrical Engineering',
    place: 'Sukkur IBA University',
    period: 'Aug 2018 – Dec 2022',
    detail: 'Final-year project: Optimization of Parameters for Biogas Production from Food Waste.',
  },
];

export const SKILLS = [
  'Ansys Maxwell',
  'PyAEDT',
  'Motor-CAD',
  'MATLAB/Simulink',
  'PSS/E',
  'Physics-Informed Neural Networks (PINNs)',
  'Surrogate modelling',
  'Multi-physics simulation',
  'Brushless wound rotor vernier machines',
  'PM-free synchronous motors',
  'Dual stator topologies',
];

export const LANGUAGES = ['Sindhi', 'Balochi', 'Urdu', 'English'];

export const HONOURS = [
  {
    title: 'IEEE SCONEST 2022 Best Abstract Award',
    detail: 'Abstract on biogas production optimisation.',
  },
  {
    title: 'PCB design competition winner',
    detail: 'Mehran University of Engineering and Technology, 2021.',
  },
  {
    title: 'Sindh Talent Hunt Scholarship',
    detail: '2017.',
  },
];

export const REFERENCES = [
  {
    name: 'Dr. Qasim Ali',
    title: 'Assistant Professor, Department of Electrical Engineering',
    institution: 'Sukkur IBA University',
    email: 'Qasim.ali@iba-suk.edu.pk',
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
    email: 'Ghulam.akbar@iba-suk.edu.pk',
  },
];

export const CURRENT_RESEARCH =
  'Current research: a dual-stator brushless hybrid-rotor vernier machine (DS-BL-HRVM), 24 slots and 44 rotor teeth, with an inner sectored stator for brushless excitation and an outer full stator for torque. The geometry was optimised first and then frozen for winding studies, and a paper on the machine is being drafted for MDPI Energies.';
