---
layout: archive
title: "EM Design Suite"
permalink: /em-design-suite/
lede: "A browser-based design workstation for electrical machines: D²L sizing, slot geometry, multi-layer windings, harmonics and performance."
author_profile: true
---

{% include base_path %}

<p style="margin-bottom: 1.5em;">
  <a class="btn" href="https://sajadali78.github.io/Electrical-Machines/" target="_blank" rel="noopener">Open the app</a>
  <a class="btn btn--inverse" href="https://github.com/sajadali78/Electrical-Machines" target="_blank" rel="noopener">Source code</a>
</p>

EM Design Suite takes a machine rating, sizes the machine with the classical **D²L output equation**, and lets you check its geometry, winding, losses and performance before moving to finite-element analysis. It covers four topologies: **induction machines** (squirrel cage or wound rotor), **surface PMSM**, **interior PMSM** (V-shaped or bar magnets) and **wound-field synchronous machines** (salient or cylindrical rotor).

Everything runs in the browser in TypeScript. Results update as you type, and nothing is sent to a server.

## Live app

<div style="position: relative; width: 100%; height: 820px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-bottom: 0.5em;">
  <iframe src="https://sajadali78.github.io/Electrical-Machines/" title="EM Design Suite" style="position: absolute; inset: 0; width: 100%; height: 100%; border: 0;" loading="lazy"></iframe>
</div>
<p style="font-size: 0.8em; color: #6b7280;">The embedded app is easiest to use on a wide screen. <a href="https://sajadali78.github.io/Electrical-Machines/" target="_blank" rel="noopener">Open it full screen</a> for the complete workspace.</p>

## What it calculates

**Sizing and geometry**
* Main dimensions from the output coefficient C₀ = 11·k<sub>w1</sub>·B<sub>av</sub>·ac·10⁻³: bore diameter, stack length, air gap and outer diameter, with checks on aspect ratio and peripheral speed
* Turns, conductors per slot, strand sizing, tooth width at the flux-density limit, yoke depth, Carter coefficient, end-winding length and phase resistance
* Nine parametric slot shapes for stator and rotor (open, semi-closed parallel, trapezoidal, pear, drop, round, closed rectangular, closed teardrop, double cage), each auto-sized to the required copper area and drawn with full dimension annotations

**Windings and harmonics**
* Single-, double- and **multi-layer (4/6/8) windings** generated from the star of slots, plus a fully editable winding matrix with any number of layers
* Winding functions, the rotating MMF with a time slider, and the winding factor (k<sub>d</sub>, k<sub>p</sub>, k<sub>so</sub>, k<sub>sk</sub>) of every harmonic
* MMF THD, differential leakage σ<sub>δ</sub>, periodicity, cogging and radial-force orders, and the maximum number of parallel paths
* A multi-layer optimiser that shifts sub-windings to cancel harmonics. For example, a four-layer 12-slot/10-pole winding cuts the sub-harmonic by about 73 %
* A slot/pole winding-factor chart

**Rotors, circuit parameters and performance**
* Cage design with automatic rotor-slot selection and slot-combination rules, magnet sizing for surface and interior PM rotors, and salient-pole field winding design from the two-reaction phasor diagram
* Magnetic circuit with saturation from the B–H curve, magnetizing and leakage inductances, and d/q inductances
* Copper, iron, friction and stray losses; efficiency; torque–speed and field-weakening capability; efficiency map; torque versus load angle
* Design-rule checks and a Pareto optimiser trading total loss against active mass

**Exports**: a vector PDF specification report, a Google Sheets workbook, CSV tables, and saving or loading designs as JSON.

## Screenshots

<figure>
  <img src="{{ base_path }}/images/em-design-suite/em-cross-section.jpg" alt="Radial cross-section of an 80 kW interior PM traction motor with dimension callouts" loading="lazy">
  <figcaption>Interactive radial cross-section of an 80 kW, 8-pole, 48-slot IPM traction motor with V-shaped magnets. Hover any part for its dimensions and flux density.</figcaption>
</figure>

<figure>
  <img src="{{ base_path }}/images/em-design-suite/em-winding.jpg" alt="Four-layer winding matrix and developed winding diagram for a 12-slot, 10-pole machine" loading="lazy">
  <figcaption>Four-layer 12-slot/10-pole winding: layout matrix, sub-winding shifts and developed winding diagram.</figcaption>
</figure>

<figure>
  <img src="{{ base_path }}/images/em-design-suite/em-performance.jpg" alt="Torque-speed, power, efficiency map and loss breakdown charts" loading="lazy">
  <figcaption>Field-weakening capability, efficiency map and loss breakdown at the rated point.</figcaption>
</figure>

<figure>
  <img src="{{ base_path }}/images/em-design-suite/em-slots.jpg" alt="Annotated stator slot drawing with dimensions" loading="lazy">
  <figcaption>Auto-sized stator slot with dimensions, slot data and tooth-width profile.</figcaption>
</figure>

**Tools & methods:** TypeScript, React, Vite, SVG drawing, jsPDF; D²L sizing, star-of-slots winding theory, winding-function and MMF harmonic analysis, equivalent-circuit and dq modelling. Formulas follow Pyrhönen, *Design of Rotating Electrical Machines*, and Sawhney, *A Course in Electrical Machine Design*. The full method is documented in the [theory notes](https://github.com/sajadali78/Electrical-Machines/blob/main/docs/THEORY.md).
