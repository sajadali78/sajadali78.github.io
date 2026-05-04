---
layout: archive
title: "Scripts and Workflows"
permalink: /scripts/
author_profile: true
---

This section will contain various scripts, automation tools, and workflows for FEA design, surrogate modelling, and data processing.

## Dual-Stator Sandwiched-Rotor Vernier Machine — Electromagnetic Design & Optimization

<div style="max-width: 600px; margin: 0 auto 2em auto;">
  <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/YEq4j4VT8O8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
  </div>
</div>

Designed and modeled a high-torque dual-stator vernier machine in ANSYS Maxwell 2D, implementing a fully parametric geometry workflow for rapid design iteration and automated optimization.

The machine topology features a sandwiched rotor between an inner and outer stator, exploiting the vernier magnetic gearing principle (Zr = Zs + p → 44 = 24 + 20) to achieve a magnetic gear ratio of 2.2, delivering high torque at low speed without a mechanical gearbox.

**Key technical contributions:**
* Developed a fully parametric Maxwell 2D model driven by 46 design variables covering all slot dimensions, winding parameters, airgap geometry, and operating conditions — enabling full geometry updates from a single variable change
* Implemented double-layer winding configuration across all three iron components (inner stator, rotor inner and outer faces, outer stator), with a slot fill factor of 90% enforced through a parametric insulation clearance variable
* Built a complete IronPython automation suite (850+ lines) covering geometry creation, winding assignment, motion band setup, mesh refinement, transient analysis, and 50+ output variable definitions
* Configured dq-axis Park transform outputs, torque decomposition (excitation vs reluctance components), core and copper loss tracking, and efficiency calculation for comprehensive post-processing
* Set up Optimetrics parametric sweeps and multi-objective optimization targeting maximum average torque and minimum torque ripple simultaneously across 20 slot geometry variables

**Tools & methods:** ANSYS Maxwell 2D, IronPython scripting, Transient FEM, Park transform, Vernier magnetic gearing theory, Optimetrics (Quasi-Newton, NSGA-II)
