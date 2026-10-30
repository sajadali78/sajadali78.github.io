import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  BookOpen,
  Cpu,
  FileText,
  GraduationCap,
  Mail,
} from 'lucide-react';
import {
  AUTHOR_PROFILE,
  PUBLICATIONS,
  MACHINE_DIMENSIONS,
  THESIS_SUMMARY,
  CV_DATA,
} from '../data/portfolioData';
import { TorqueSkewChart, ParetoScatterChart } from './InteractiveCharts';

export type DossierTab = 'publications' | 'thesis' | 'software' | 'cv' | 'contact' | null;

interface DossierModalProps {
  activeTab: DossierTab;
  onClose: () => void;
  onSelectTab: (tab: DossierTab) => void;
  skewEnabled: boolean;
  operatingMode: 'synchronous' | 'vernier';
  onToggleSkew: (skew: boolean) => void;
  onToggleMode: (mode: 'synchronous' | 'vernier') => void;
}

export const DossierModal: React.FC<DossierModalProps> = ({
  activeTab,
  onClose,
  onSelectTab,
  skewEnabled,
  operatingMode,
  onToggleSkew,
  onToggleMode,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  // Built-in interactive D²L Sizing Calculator state (from Sajad's EM Design Suite)
  const [powerKw, setPowerKw] = useState<number>(80);
  const [speedRpm, setSpeedRpm] = useState<number>(3000);
  const [bAv, setBAv] = useState<number>(0.62); // Specific magnetic loading (T)
  const [ac, setAc] = useState<number>(38000); // Specific electric loading (A/m)
  const [windingLayers, setWindingLayers] = useState<1 | 2 | 4 | 6>(4);
  const [showLiveEmIframe, setShowLiveEmIframe] = useState<boolean>(false);

  if (!activeTab) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Classical D²L calculation following Pyrhönen & Sawhney (from EM Design Suite)
  const kw1 = windingLayers >= 4 ? 0.933 : 0.955;
  const c0 = 11 * kw1 * bAv * (ac / 1000) * 1e-3; // Output coefficient C0
  const nRps = speedRpm / 60;
  const d2l = powerKw / (c0 * Math.max(0.1, nRps)); // m^3
  const aspectRatio = 1.25; // L / D
  const boreDiameterM = Math.cbrt(d2l / aspectRatio);
  const stackLengthM = boreDiameterM * aspectRatio;
  const boreMm = Math.round(boreDiameterM * 1000);
  const stackMm = Math.round(stackLengthM * 1000);
  const subHarmonicReduction = windingLayers === 4 ? 73.2 : windingLayers === 6 ? 78.5 : windingLayers === 2 ? 28.0 : 0;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-end bg-[#090d10]/80"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-full bg-[#12181c] border-l border-[#36424a] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Tab Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-[#36424a] bg-[#161e24]">
          <div className="flex items-center gap-2 overflow-x-auto">
            {(
              [
                { id: 'publications', label: 'Publications', icon: BookOpen },
                { id: 'thesis', label: 'Master’s Thesis', icon: Cpu },
                { id: 'software', label: 'EM Design Suite & Scripts', icon: FileText },
                { id: 'cv', label: 'Curriculum Vitae', icon: GraduationCap },
                { id: 'contact', label: 'Contact & PhD Inquiry', icon: Mail },
              ] as const
            ).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#d0864a] text-[#12181c] font-semibold'
                      : 'text-[#9aa5a8] hover:text-[#e9e4da] hover:bg-[#1b2328]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#36424a] text-xs font-mono text-[#e9e4da] hover:border-[#d0864a] transition-colors cursor-pointer shrink-0"
            aria-label="Close dossier drawer"
          >
            <span>ESC</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {/* TAB 1: PUBLICATIONS */}
          {activeTab === 'publications' && (
            <div className="space-y-6">
              <div>
                <div className="font-mono text-xs text-[#d0864a] mb-1">
                  PEER-REVIEWED RESEARCH · NATURE PORTFOLIO &amp; IEEE XPLORE
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-[#e9e4da]">
                  Journal &amp; Conference Publications
                </h2>
                <p className="text-sm text-[#9aa5a8] mt-1">
                  All publications verified via DOI, Google Scholar, and ORCID ({AUTHOR_PROFILE.orcid}).
                </p>
              </div>

              <div className="space-y-5">
                {PUBLICATIONS.map((pub, idx) => (
                  <article
                    key={pub.id}
                    className="border border-[#36424a] bg-[#1b2328] rounded-xl p-6 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#9aa5a8]">
                      <span>
                        0{idx + 1}. {pub.category} · {pub.year}
                        {pub.impactNote ? ` · ${pub.impactNote}` : ''}
                      </span>
                      <span>DOI: {pub.doi}</span>
                    </div>

                    <h3 className="text-xl font-semibold text-[#e9e4da] leading-snug">
                      {pub.title}
                    </h3>

                    <p className="text-xs font-mono text-[#d0864a]">{pub.authors}</p>
                    <p className="text-xs text-[#9aa5a8] italic">{pub.venue}</p>

                    <p className="text-sm text-[#e9e4da]/90 leading-relaxed">{pub.excerpt}</p>

                    <ul className="space-y-1.5 text-xs text-[#9aa5a8] list-disc pl-4">
                      {pub.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#36424a]">
                      <a
                        href={pub.doiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#d0864a] text-[#12181c] text-xs font-semibold hover:bg-[#e0965a] transition-colors"
                      >
                        <span>Read Paper (DOI)</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(pub.bibtex, pub.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#36424a] text-xs font-mono text-[#e9e4da] hover:border-[#d0864a] transition-colors cursor-pointer"
                      >
                        {copiedId === pub.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#8fb27a]" />
                            <span>BibTeX Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy BibTeX</span>
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MASTER'S THESIS */}
          {activeTab === 'thesis' && (
            <div className="space-y-8">
              <div>
                <div className="font-mono text-xs text-[#d0864a] mb-1">
                  MASTER&apos;S THESIS · SUKKUR IBA UNIVERSITY · APRIL 2026
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-[#e9e4da]">
                  {THESIS_SUMMARY.title}
                </h2>
                <p className="text-sm text-[#9aa5a8] mt-2 leading-relaxed">
                  {THESIS_SUMMARY.problemStatement}
                </p>
              </div>

              {/* Proposed Topologies Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {THESIS_SUMMARY.modelsCompared.map((m) => (
                  <div
                    key={m.code}
                    className="border border-[#36424a] bg-[#1b2328] rounded-xl p-5 space-y-2.5"
                  >
                    <div className="font-mono text-xs text-[#d0864a]">{m.code}</div>
                    <h3 className="text-base font-semibold text-[#e9e4da]">{m.name}</h3>
                    <p className="text-xs text-[#9aa5a8]">{m.rotorType}</p>
                    <div className="pt-2 border-t border-[#36424a]/70 space-y-1 font-mono text-xs tabular-nums">
                      <div className="flex justify-between">
                        <span className="text-[#9aa5a8]">Low-Speed Vernier Torque:</span>
                        <span className="text-[#e9e4da]">{m.avgTorqueLowSpeed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#9aa5a8]">High-Speed Sync Torque:</span>
                        <span className="text-[#e9e4da]">{m.avgTorqueHighSpeed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#9aa5a8]">Ripple (0° → 4° Skew):</span>
                        <span className="text-[#d0864a]">
                          {m.rippleBeforeSkew} → {m.rippleAfterSkew}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#9aa5a8]">Permanent Magnet Usage:</span>
                        <span className="text-[#8fb27a]">{m.pmUsage}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Thesis Waveforms & GA Pareto Front */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TorqueSkewChart
                  skewEnabled={skewEnabled}
                  operatingMode={operatingMode}
                  onToggleSkew={onToggleSkew}
                  onToggleMode={onToggleMode}
                />
                <ParetoScatterChart />
              </div>

              {/* Exact Machine Dimensions Table */}
              <div className="border border-[#36424a] bg-[#1b2328] rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-[#36424a] font-mono text-xs text-[#d0864a]">
                  DMDS-HRSVM PARAMETRIC DESIGN SPECIFICATIONS (ANSYS MAXWELL)
                </div>
                <div className="divide-y divide-[#36424a]/60">
                  {MACHINE_DIMENSIONS.map((row) => (
                    <div
                      key={row.parameter}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-2 px-5 py-3 text-xs"
                    >
                      <span className="font-medium text-[#e9e4da]">{row.parameter}</span>
                      <span className="font-mono text-[#d0864a] tabular-nums">{row.value}</span>
                      <span className="text-[#9aa5a8]">{row.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EM DESIGN SUITE & IRONPYTHON WORKFLOWS */}
          {activeTab === 'software' && (
            <div className="space-y-8">
              {/* EM Design Suite Section */}
              <div className="border border-[#36424a] bg-[#1b2328] rounded-xl p-6 space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-xs text-[#d0864a] mb-1">
                      OPEN-SOURCE BROWSER WORKSTATION · TYPESCRIPT &amp; REACT
                    </div>
                    <h2 className="text-2xl font-semibold text-[#e9e4da]">
                      EM Design Suite — Classical D²L &amp; Multi-Layer Winding Workstation
                    </h2>
                    <p className="text-sm text-[#9aa5a8] mt-1 max-w-2xl">
                      Sizes Induction, Surface PMSM, Interior PMSM (V-shaped/bar), and Wound-Field Synchronous machines using the classical D²L output equation, 9 auto-sized parametric slot geometries, and star-of-slots multi-layer (1/2/4/6/8) harmonic optimization.
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <a
                      href={AUTHOR_PROFILE.emSuiteLiveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#d0864a] text-[#12181c] text-xs font-semibold hover:bg-[#e0965a] transition-colors whitespace-nowrap"
                    >
                      <span>Open Live App</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={AUTHOR_PROFILE.emSuiteRepoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#36424a] text-xs font-mono text-[#e9e4da] hover:border-[#d0864a] transition-colors whitespace-nowrap"
                    >
                      <span>GitHub Source</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Interactive D²L Quick Sizer inside the drawer */}
                <div className="border border-[#36424a] bg-[#12181c] rounded-xl p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs text-[#d0864a]">
                      INTERACTIVE D²L SIZING &amp; STAR-OF-SLOTS HARMONIC PREVIEW
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowLiveEmIframe((v) => !v)}
                      className="text-xs font-mono text-[#e9e4da] underline hover:text-[#d0864a] cursor-pointer"
                    >
                      {showLiveEmIframe ? 'Hide Full Embedded Workstation' : 'Embed Full Live EM Design Suite'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <label className="block space-y-1">
                      <span className="text-xs text-[#9aa5a8] font-mono">Rated Power: {powerKw} kW</span>
                      <input
                        type="range"
                        min={5}
                        max={250}
                        step={5}
                        value={powerKw}
                        onChange={(e) => setPowerKw(Number(e.target.value))}
                        className="w-full accent-[#d0864a]"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-xs text-[#9aa5a8] font-mono">Rated Speed: {speedRpm} rpm</span>
                      <input
                        type="range"
                        min={300}
                        max={6000}
                        step={100}
                        value={speedRpm}
                        onChange={(e) => setSpeedRpm(Number(e.target.value))}
                        className="w-full accent-[#d0864a]"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-xs text-[#9aa5a8] font-mono">Specific B_av: {bAv.toFixed(2)} T</span>
                      <input
                        type="range"
                        min={0.45}
                        max={0.95}
                        step={0.01}
                        value={bAv}
                        onChange={(e) => setBAv(Number(e.target.value))}
                        className="w-full accent-[#d0864a]"
                      />
                    </label>
                    <div className="space-y-1">
                      <span className="text-xs text-[#9aa5a8] font-mono block">Winding Layers</span>
                      <div className="flex gap-1">
                        {([1, 2, 4, 6] as const).map((layer) => (
                          <button
                            key={layer}
                            type="button"
                            onClick={() => setWindingLayers(layer)}
                            className={`flex-1 py-1 rounded text-xs font-mono cursor-pointer ${
                              windingLayers === layer
                                ? 'bg-[#d0864a] text-[#12181c] font-semibold'
                                : 'bg-[#1b2328] text-[#9aa5a8]'
                            }`}
                          >
                            {layer}L
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#36424a]/60 font-mono text-xs tabular-nums">
                    <div>
                      <span className="text-[#9aa5a8] block">Output Coeff C₀</span>
                      <strong className="text-[#e9e4da]">{c0.toFixed(1)} kW·s/m³</strong>
                    </div>
                    <div>
                      <span className="text-[#9aa5a8] block">Stator Bore D</span>
                      <strong className="text-[#d0864a]">{boreMm} mm</strong>
                    </div>
                    <div>
                      <span className="text-[#9aa5a8] block">Stack Length L</span>
                      <strong className="text-[#e9e4da]">{stackMm} mm</strong>
                    </div>
                    <div>
                      <span className="text-[#9aa5a8] block">12s/10p Sub-Harmonic Cut</span>
                      <strong className="text-[#8fb27a]">-{subHarmonicReduction.toFixed(1)}%</strong>
                    </div>
                  </div>

                  {showLiveEmIframe && (
                    <div className="mt-4 h-[520px] w-full rounded-lg overflow-hidden border border-[#36424a]">
                      <iframe
                        src={AUTHOR_PROFILE.emSuiteLiveUrl}
                        title="EM Design Suite Live Workstation"
                        className="w-full h-full border-0"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* IronPython / PyAEDT Vernier Automation Section */}
              <div className="border border-[#36424a] bg-[#1b2328] rounded-xl p-6 space-y-5">
                <div className="font-mono text-xs text-[#d0864a]">
                  ANSYS MAXWELL 2D · 850+ LINE IRONPYTHON AUTOMATION PIPELINE
                </div>
                <h3 className="text-xl font-semibold text-[#e9e4da]">
                  Dual-Stator Sandwiched-Rotor Vernier Machine — Parametric FEA Workflow
                </h3>
                <p className="text-sm text-[#9aa5a8] leading-relaxed">
                  Exploits the vernier magnetic gearing principle (Zr = Zs + p → 44 = 24 + 20, gear ratio 2.2) across 46 parametric design variables with 90% slot fill enforcement, automated moving-band transient mesh setup, Park transform dq-axis outputs, and NSGA-II optimization.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                  <div className="aspect-video w-full rounded-lg overflow-hidden border border-[#36424a] bg-[#12181c]">
                    <iframe
                      src="https://www.youtube.com/embed/YEq4j4VT8O8"
                      title="Dual-Stator Sandwiched-Rotor Vernier Machine ANSYS Maxwell Automation"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div className="border border-[#36424a] bg-[#12181c] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-[#9aa5a8]">
                        maxwell_vernier_parametric.py
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(THESIS_SUMMARY.ironPythonSnippet, 'ironpython')}
                        className="inline-flex items-center gap-1 text-xs font-mono text-[#d0864a] hover:underline cursor-pointer"
                      >
                        {copiedId === 'ironpython' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#8fb27a]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Script</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-[11px] font-mono text-[#e9e4da]/90 overflow-x-auto leading-relaxed">
                      {THESIS_SUMMARY.ironPythonSnippet}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CURRICULUM VITAE */}
          {activeTab === 'cv' && (
            <div className="space-y-8">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#36424a] pb-5">
                <div>
                  <div className="font-mono text-xs text-[#d0864a] mb-1">
                    ACADEMIC CURRICULUM VITAE
                  </div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#e9e4da]">
                    {AUTHOR_PROFILE.name}
                  </h2>
                  <p className="text-sm text-[#9aa5a8] mt-1">
                    {AUTHOR_PROFILE.role} · {AUTHOR_PROFILE.institution}
                  </p>
                </div>
                <div className="font-mono text-xs text-[#9aa5a8] space-y-1">
                  <div>Email: {AUTHOR_PROFILE.email}</div>
                  <div>ORCID: {AUTHOR_PROFILE.orcid}</div>
                  <div>Location: {AUTHOR_PROFILE.location}</div>
                </div>
              </div>

              {/* Education & Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#e9e4da]">01. Education</h3>
                  {CV_DATA.education.map((edu) => (
                    <div
                      key={edu.degree}
                      className="border border-[#36424a] bg-[#1b2328] rounded-xl p-4 space-y-2"
                    >
                      <div className="font-mono text-xs text-[#d0864a]">{edu.period}</div>
                      <div className="text-sm font-semibold text-[#e9e4da]">{edu.degree}</div>
                      <div className="text-xs text-[#9aa5a8]">{edu.institution}</div>
                      <ul className="space-y-1 text-xs text-[#e9e4da]/85 list-disc pl-4 pt-1">
                        {edu.details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#e9e4da]">
                    02. Research &amp; Field Experience
                  </h3>
                  {CV_DATA.experience.map((exp) => (
                    <div
                      key={exp.role}
                      className="border border-[#36424a] bg-[#1b2328] rounded-xl p-4 space-y-2"
                    >
                      <div className="font-mono text-xs text-[#d0864a]">{exp.period}</div>
                      <div className="text-sm font-semibold text-[#e9e4da]">{exp.role}</div>
                      <div className="text-xs text-[#9aa5a8]">{exp.organization}</div>
                      <ul className="space-y-1 text-xs text-[#e9e4da]/85 list-disc pl-4 pt-1">
                        {exp.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Skills (Unboxed typography per zero-pill discipline) */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#e9e4da]">03. Technical Arsenal</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {CV_DATA.skillGroups.map((group) => (
                    <div
                      key={group.category}
                      className="border border-[#36424a] bg-[#1b2328] rounded-xl p-4 space-y-2"
                    >
                      <div className="font-mono text-xs text-[#d0864a]">{group.category}</div>
                      <p className="text-xs text-[#e9e4da] leading-relaxed">
                        {group.items.join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications, Honours & Academic References */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[#e9e4da]">
                    04. Certifications &amp; Honours
                  </h3>
                  <div className="border border-[#36424a] bg-[#1b2328] rounded-xl divide-y divide-[#36424a]/60">
                    {CV_DATA.certificationsAndAwards.map((cert) => (
                      <div key={cert.title} className="p-4 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-semibold text-[#e9e4da]">{cert.title}</div>
                          <div className="text-xs text-[#9aa5a8] font-mono">
                            {cert.issuer} · {cert.date}
                          </div>
                        </div>
                        {cert.url && (
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-[#d0864a] hover:underline shrink-0"
                          >
                            Verify →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[#e9e4da]">05. Academic References</h3>
                  <div className="border border-[#36424a] bg-[#1b2328] rounded-xl divide-y divide-[#36424a]/60">
                    {CV_DATA.references.map((ref) => (
                      <div key={ref.email} className="p-3.5 space-y-0.5">
                        <div className="text-xs font-semibold text-[#e9e4da]">{ref.name}</div>
                        <div className="text-xs text-[#9aa5a8]">
                          {ref.title} · {ref.institution}
                        </div>
                        <a
                          href={`mailto:${ref.email}`}
                          className="text-xs font-mono text-[#d0864a] hover:underline block"
                        >
                          {ref.email}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT & PHD INQUIRY */}
          {activeTab === 'contact' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <div className="font-mono text-xs text-[#d0864a] mb-1">
                  PHD ADMISSIONS &amp; RESEARCH COLLABORATION
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-[#e9e4da]">
                  Connect with Sajad Ali
                </h2>
                <p className="text-sm text-[#9aa5a8] mt-2 leading-relaxed">
                  {AUTHOR_PROFILE.phdObjective}
                </p>
              </div>

              <div className="border border-[#36424a] bg-[#1b2328] rounded-xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-mono text-[#9aa5a8]">Institutional Email</div>
                    <div className="text-base font-mono text-[#e9e4da]">{AUTHOR_PROFILE.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(AUTHOR_PROFILE.email, 'email-inst')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#36424a] text-xs font-mono text-[#e9e4da] hover:border-[#d0864a] cursor-pointer"
                    >
                      {copiedId === 'email-inst' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#8fb27a]" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Email</span>
                        </>
                      )}
                    </button>
                    <a
                      href={`mailto:${AUTHOR_PROFILE.email}?subject=PhD%20Research%20Inquiry%20%E2%80%94%20Electrical%20Machine%20Design`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#d0864a] text-[#12181c] text-xs font-semibold hover:bg-[#e0965a]"
                    >
                      <span>Compose Email</span>
                    </a>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#36424a]/60 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <a
                    href={AUTHOR_PROFILE.scholarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-[#12181c] border border-[#36424a] hover:border-[#d0864a] text-[#e9e4da] flex items-center justify-between"
                  >
                    <span>Google Scholar</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#d0864a]" />
                  </a>
                  <a
                    href={AUTHOR_PROFILE.orcidUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-[#12181c] border border-[#36424a] hover:border-[#d0864a] text-[#e9e4da] flex items-center justify-between"
                  >
                    <span>ORCID Profile</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#d0864a]" />
                  </a>
                  <a
                    href={AUTHOR_PROFILE.researchGateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-[#12181c] border border-[#36424a] hover:border-[#d0864a] text-[#e9e4da] flex items-center justify-between"
                  >
                    <span>ResearchGate</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#d0864a]" />
                  </a>
                  <a
                    href={AUTHOR_PROFILE.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-[#12181c] border border-[#36424a] hover:border-[#d0864a] text-[#e9e4da] flex items-center justify-between"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#d0864a]" />
                  </a>
                  <a
                    href={AUTHOR_PROFILE.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-[#12181c] border border-[#36424a] hover:border-[#d0864a] text-[#e9e4da] flex items-center justify-between"
                  >
                    <span>GitHub (@sajadali78)</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#d0864a]" />
                  </a>
                  <a
                    href={AUTHOR_PROFILE.emSuiteLiveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-[#12181c] border border-[#36424a] hover:border-[#d0864a] text-[#e9e4da] flex items-center justify-between"
                  >
                    <span>EM Design Suite</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#d0864a]" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
