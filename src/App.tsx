/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Layers,
  Sliders,
  Copy,
  Check,
  Maximize2,
  BookOpen,
  Cpu,
  FileText,
  GraduationCap,
  Mail,
} from 'lucide-react';
import {
  AUTHOR_PROFILE,
  CHAPTERS,
  PUBLICATIONS,
  THESIS_SUMMARY,
  CV_DATA,
  MACHINE_DIMENSIONS,
  ParetoCandidate,
} from './data/portfolioData';
import { MachineCanvas3D } from './components/MachineCanvas3D';
import {
  TorqueSkewChart,
  ParetoScatterChart,
  EmQuickSizer,
} from './components/InteractiveCharts';
import { DossierModal, DossierTab } from './components/DossierModal';
import { DockTooltip } from './components/DockTooltip';

export default function App() {
  const [chapterIndex, setChapterIndex] = useState<number>(0);
  const [activeModal, setActiveModal] = useState<DossierTab>(null);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [narrativeCollapsed, setNarrativeCollapsed] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Interactive 3D Engineering Workstation State (synchronized with chapters, overridable by user)
  const currentChapter = CHAPTERS[chapterIndex];
  const [explodeAmount, setExplodeAmount] = useState<number>(currentChapter.explodeTarget);
  const [fluxIntensity, setFluxIntensity] = useState<number>(currentChapter.fluxIntensity);
  const [showMeshWireframe, setShowMeshWireframe] = useState<boolean>(
    currentChapter.showMeshWireframe
  );
  const [showFluxLines, setShowFluxLines] = useState<boolean>(currentChapter.showFluxLines);
  const [skewEnabled, setSkewEnabled] = useState<boolean>(currentChapter.skewEnabled);
  const [operatingMode, setOperatingMode] = useState<'synchronous' | 'vernier'>(
    currentChapter.operatingMode
  );
  const [cutawayEnabled, setCutawayEnabled] = useState<boolean>(true);
  const [rotorSpeedMultiplier, setRotorSpeedMultiplier] = useState<number>(1.0);
  const [selectedPart, setSelectedPart] = useState<{
    name: string;
    spec: string;
    detail: string;
    selectionId: number;
  } | null>(null);

  // Sync 3D machine state when user steps to a new chapter/page
  const goToChapter = (idx: number) => {
    const clamped = Math.max(0, Math.min(CHAPTERS.length - 1, idx));
    const target = CHAPTERS[clamped];
    setChapterIndex(clamped);
    setExplodeAmount(target.explodeTarget);
    setFluxIntensity(target.fluxIntensity);
    setShowMeshWireframe(target.showMeshWireframe);
    setShowFluxLines(target.showFluxLines);
    setSkewEnabled(target.skewEnabled);
    setOperatingMode(target.operatingMode);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Keyboard navigation & engineering shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeModal) setActiveModal(null);
        else if (selectedPart) setSelectedPart(null);
        return;
      }
      if (activeModal) return;

      // Skip shortcuts if active element is an editable form element
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      const key = e.key.toLowerCase();

      // Engineering Dock Hotkeys
      if (key === 'h') {
        setDockCollapsed((prev) => !prev);
      } else if (key === 'm') {
        setOperatingMode((m) => (m === 'synchronous' ? 'vernier' : 'synchronous'));
      } else if (key === 's') {
        setSkewEnabled((s) => !s);
      } else if (key === 'b') {
        setFluxIntensity((f) => (f > 0.5 ? 0.0 : 0.95));
      } else if (key === 'f') {
        setShowMeshWireframe((w) => !w);
      } else if (key === 'c') {
        setCutawayEnabled((c) => !c);
      } else if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        setRotorSpeedMultiplier((s) => (s > 0 ? 0 : 1));
      } else if (key === '[') {
        setExplodeAmount((x) => Math.max(0, +(x - 0.1).toFixed(2)));
      } else if (key === ']') {
        setExplodeAmount((x) => Math.min(1, +(x + 0.1).toFixed(2)));
      } else if (key === 'x') {
        setExplodeAmount((x) => (x < 0.25 ? 0.35 : x < 0.6 ? 0.75 : 0.0));
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        goToChapter(chapterIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        goToChapter(chapterIndex - 1);
      } else if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        const num = parseInt(e.key, 10) - 1;
        goToChapter(num);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chapterIndex, activeModal, selectedPart]);

  // Throttled wheel navigation on the narrative overlay
  const wheelCooldownRef = useRef<number>(0);
  const handleNarrativeWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - wheelCooldownRef.current < 650) return;
    if (Math.abs(e.deltaY) > 28) {
      wheelCooldownRef.current = now;
      if (e.deltaY > 0 && chapterIndex < CHAPTERS.length - 1) {
        goToChapter(chapterIndex + 1);
      } else if (e.deltaY < 0 && chapterIndex > 0) {
        goToChapter(chapterIndex - 1);
      }
    }
  };

  const handleParetoSelect = (cand: ParetoCandidate) => {
    setSkewEnabled(cand.skewDeg >= 2.0);
    setFluxIntensity(Math.min(1, cand.avgTorque / 11));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#12181c] text-[#e9e4da]">
      {/* 1. FULL-BLEED 3D ELECTROMAGNETIC MACHINE VIEWPORT (Stable Ref Container) */}
      <MachineCanvas3D
        cameraPos={currentChapter.cameraPos}
        cameraTarget={currentChapter.cameraTarget}
        explodeAmount={explodeAmount}
        fluxIntensity={fluxIntensity}
        showMeshWireframe={showMeshWireframe}
        showFluxLines={showFluxLines}
        skewEnabled={skewEnabled}
        operatingMode={operatingMode}
        cutawayEnabled={cutawayEnabled}
        rotorSpeedMultiplier={rotorSpeedMultiplier}
        onPartSelect={(part) => {
          if (!part) {
            setSelectedPart(null);
          } else {
            setSelectedPart({ ...part, selectionId: Date.now() });
          }
        }}
      />

      {/* 2. TOP BAR CONTRACT: Brand — 6 Pages (1..6) — Primary Action */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between gap-6 px-6 py-3.5 bg-[#12181c]/95 border-b border-[#36424a]">
        {/* Zone 1: Brand wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveModal(null);
            goToChapter(0);
          }}
          className="font-display text-lg font-semibold tracking-tight text-[#e9e4da] whitespace-nowrap shrink-0 hover:text-[#d0864a] transition-colors"
        >
          Sajad Ali
        </a>

        {/* Zone 2: 6 concise single-line text links for pages 1..6 (desktop) + dropdown (mobile) */}
        <nav
          aria-label="Portfolio Pages Navigation"
          className="hidden md:flex items-center gap-4 lg:gap-7 text-xs lg:text-sm font-medium text-[#9aa5a8]"
        >
          {CHAPTERS.map((chap) => {
            const active = chap.id === chapterIndex && activeModal === null;
            return (
              <button
                key={chap.id}
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  goToChapter(chap.id);
                }}
                className={`hover:text-[#e9e4da] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active ? 'text-[#e9e4da] underline decoration-[#d0864a] font-semibold' : ''
                }`}
              >
                {chap.id + 1}. {chap.shortTitle}
              </button>
            );
          })}
        </nav>

        {/* Mobile Page Selector (visible on small screens) */}
        <div className="flex md:hidden items-center">
          <select
            value={chapterIndex}
            onChange={(e) => {
              setActiveModal(null);
              goToChapter(parseInt(e.target.value, 10));
            }}
            aria-label="Select portfolio page"
            className="bg-[#1b2328] border border-[#36424a] text-xs font-mono text-[#e9e4da] rounded-lg px-2.5 py-1.5 focus:border-[#d0864a] focus:outline-none"
          >
            {CHAPTERS.map((chap) => (
              <option key={chap.id} value={chap.id}>
                {chap.id + 1}. {chap.shortTitle}
              </option>
            ))}
          </select>
        </div>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveModal(null);
              goToChapter(5); // Go to Contact (Page 6)
            }}
            className="px-3.5 py-1.5 md:px-4 md:py-2 text-xs font-semibold text-[#12181c] bg-[#d0864a] rounded-lg hover:bg-[#e0965a] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Contact for PhD
          </button>
        </div>
      </header>

      {/* Discreet Selected 3D Component Spec Badge (with polished entrance slide-in animation & dynamic collision avoidance) */}
      {selectedPart && (
        <div
          key={`${selectedPart.name}-${selectedPart.selectionId}`}
          className={`fixed top-16 z-25 max-w-xs bg-[#161e24]/95 border border-[#d0864a] rounded-xl p-3.5 shadow-2xl backdrop-blur-none ${
            !narrativeCollapsed && currentChapter.alignment !== 'right'
              ? 'right-6 animate-badge-slide-in-right'
              : 'left-6 animate-badge-slide-in-left'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="font-mono text-[11px] text-[#d0864a] tracking-wider">3D PART TELEMETRY</div>
            <button
              type="button"
              onClick={() => setSelectedPart(null)}
              className="text-xs font-mono text-[#9aa5a8] hover:text-[#e9e4da] cursor-pointer p-0.5 rounded transition-colors"
              aria-label="Close component telemetry badge"
            >
              ✕
            </button>
          </div>
          <div className="text-sm font-semibold text-[#e9e4da] mt-1">{selectedPart.name}</div>
          <div className="font-mono text-xs text-[#d0864a]/90 mt-0.5">{selectedPart.spec}</div>
          <p className="text-xs text-[#e9e4da]/85 mt-2 leading-relaxed">{selectedPart.detail}</p>
        </div>
      )}

      {/* 3. CHAPTER NARRATIVE / PAGE CONTENT CARD */}
      {!narrativeCollapsed && (
        <aside
          onWheel={handleNarrativeWheel}
          className={`fixed z-20 transition-all duration-300 ${
            currentChapter.alignment === 'right'
              ? 'top-16 right-6 w-[min(480px,94vw)] max-h-[calc(100vh-170px)]'
              : currentChapter.alignment === 'bottom'
              ? 'top-16 left-6 w-[min(490px,94vw)] max-h-[calc(100vh-170px)]'
              : 'top-16 left-6 w-[min(480px,94vw)] max-h-[calc(100vh-170px)]'
          } overflow-y-auto bg-[#161e24]/95 border border-[#36424a] rounded-2xl p-5 md:p-6 shadow-2xl`}
        >
          {/* Page Eyebrow & Stepper */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-mono text-xs text-[#d0864a] tracking-wider">
              {currentChapter.eyebrow}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => goToChapter(chapterIndex - 1)}
                disabled={chapterIndex === 0}
                className="p-1 rounded border border-[#36424a] text-[#9aa5a8] hover:text-[#e9e4da] hover:border-[#d0864a] disabled:opacity-30 cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs text-[#9aa5a8] tabular-nums">
                {chapterIndex + 1} / {CHAPTERS.length}
              </span>
              <button
                type="button"
                onClick={() => goToChapter(chapterIndex + 1)}
                disabled={chapterIndex === CHAPTERS.length - 1}
                className="p-1 rounded border border-[#36424a] text-[#9aa5a8] hover:text-[#e9e4da] hover:border-[#d0864a] disabled:opacity-30 cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setNarrativeCollapsed(true)}
                className="ml-1 px-2 py-0.5 rounded border border-[#36424a] font-mono text-[10px] text-[#9aa5a8] hover:text-[#e9e4da] cursor-pointer"
                title="Minimize page card for full 3D view"
              >
                Minimize
              </button>
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-display text-2xl md:text-3xl font-normal text-[#e9e4da] leading-tight mb-3">
            {currentChapter.headline}{' '}
            <em className="italic text-[#d0864a] font-normal">{currentChapter.headlineAccent}</em>
          </h1>

          {/* Body Prose */}
          <div className="space-y-2.5 text-sm text-[#e9e4da]/90 leading-relaxed">
            {currentChapter.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* PAGE 1: MACHINE SPECIFICATIONS SUMMARY */}
          {currentChapter.pageType === 'machine' && (
            <div className="mt-4 pt-3 border-t border-[#36424a] space-y-3">
              <div className="font-mono text-xs text-[#d0864a]">
                DMDS-HRSVM BENCHMARK PARAMETERS
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {MACHINE_DIMENSIONS.slice(0, 6).map((dim) => (
                  <div key={dim.parameter} className="bg-[#12181c] p-2 rounded border border-[#36424a]/60">
                    <span className="text-[#9aa5a8] block text-[10px]">{dim.parameter}</span>
                    <strong className="text-[#e9e4da]">{dim.value}</strong>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => goToChapter(1)}
                  className="inline-flex items-center gap-1 text-xs font-mono text-[#d0864a] hover:underline cursor-pointer"
                >
                  <span>Explore Publications (Page 2) →</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal('thesis')}
                  className="inline-flex items-center gap-1 text-xs font-mono text-[#9aa5a8] hover:text-[#e9e4da] cursor-pointer"
                >
                  <span>View Thesis Dossier</span>
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* PAGE 2: PUBLICATIONS SHOWCASE */}
          {currentChapter.pageType === 'publications' && (
            <div className="mt-4 pt-3 border-t border-[#36424a] space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#d0864a]">PEER-REVIEWED ARTICLES</span>
                <button
                  type="button"
                  onClick={() => setActiveModal('publications')}
                  className="inline-flex items-center gap-1 text-xs font-mono text-[#9aa5a8] hover:text-[#d0864a] cursor-pointer"
                >
                  <span>Expand Full View</span>
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {PUBLICATIONS.map((pub, idx) => (
                  <div
                    key={pub.id}
                    className="border border-[#36424a] bg-[#12181c] rounded-xl p-3.5 space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#9aa5a8]">
                      <span>
                        0{idx + 1}. {pub.category} · {pub.year}
                      </span>
                      {pub.impactNote && (
                        <span className="text-[#8fb27a]">{pub.impactNote}</span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-[#e9e4da] leading-snug">
                      {pub.title}
                    </div>
                    <p className="text-[11px] text-[#9aa5a8] italic">{pub.venue}</p>
                    <div className="flex items-center gap-2 pt-1 border-t border-[#36424a]/50">
                      <a
                        href={pub.doiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-[#d0864a] hover:underline"
                      >
                        <span>DOI Paper</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(pub.bibtex, pub.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-[#9aa5a8] hover:text-[#e9e4da] cursor-pointer"
                      >
                        {copiedId === pub.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#8fb27a]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy BibTeX</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAGE 3: THESIS & TORQUE-RIPPLE ANALYSIS */}
          {currentChapter.pageType === 'thesis' && (
            <div className="mt-4 pt-3 border-t border-[#36424a] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#d0864a]">
                  4.0° SKEW &amp; TORQUE RIPPLE SUPPRESSION
                </span>
                <button
                  type="button"
                  onClick={() => setActiveModal('thesis')}
                  className="inline-flex items-center gap-1 text-xs font-mono text-[#9aa5a8] hover:text-[#d0864a] cursor-pointer"
                >
                  <span>Expand Thesis</span>
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>

              <TorqueSkewChart
                skewEnabled={skewEnabled}
                operatingMode={operatingMode}
                onToggleSkew={setSkewEnabled}
                onToggleMode={setOperatingMode}
              />

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className="bg-[#12181c] p-2 rounded border border-[#36424a]/60">
                  <span className="text-[#9aa5a8] block text-[10px]">DMDS-WRSVM Model</span>
                  <span className="text-[#e9e4da]">Wound rotor excitation</span>
                  <span className="text-[#d0864a] block mt-0.5">Ripple: 68% → 29%</span>
                </div>
                <div className="bg-[#12181c] p-2 rounded border border-[#36424a]/60">
                  <span className="text-[#9aa5a8] block text-[10px]">DMDS-HRSVM (Chosen)</span>
                  <span className="text-[#e9e4da]">Hybrid PM + DC slots</span>
                  <span className="text-[#8fb27a] block mt-0.5">Ripple: 73% → 27%</span>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 4: EM DESIGN SUITE & SCRIPTS */}
          {currentChapter.pageType === 'software' && (
            <div className="mt-4 pt-3 border-t border-[#36424a] space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#d0864a]">
                  OPEN-SOURCE SOFTWARE &amp; FEA AUTOMATION
                </span>
                <button
                  type="button"
                  onClick={() => setActiveModal('software')}
                  className="inline-flex items-center gap-1 text-xs font-mono text-[#9aa5a8] hover:text-[#d0864a] cursor-pointer"
                >
                  <span>Full Workstation</span>
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>

              <EmQuickSizer />

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={AUTHOR_PROFILE.emSuiteLiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d0864a] text-[#12181c] text-xs font-semibold hover:bg-[#e0965a] transition-colors"
                >
                  <span>Launch Live EM Suite</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={AUTHOR_PROFILE.emSuiteRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#36424a] text-xs font-mono text-[#e9e4da] hover:border-[#d0864a] transition-colors"
                >
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* PAGE 5: CV & ACADEMIC REFERENCES */}
          {currentChapter.pageType === 'cv' && (
            <div className="mt-4 pt-3 border-t border-[#36424a] space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#d0864a]">
                  NSGA-II PARETO FRONT &amp; REFERENCES
                </span>
                <button
                  type="button"
                  onClick={() => setActiveModal('cv')}
                  className="inline-flex items-center gap-1 text-xs font-mono text-[#9aa5a8] hover:text-[#d0864a] cursor-pointer"
                >
                  <span>Complete CV</span>
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>

              <ParetoScatterChart onSelectCandidate={handleParetoSelect} />

              <div className="border border-[#36424a] bg-[#12181c] rounded-xl p-3 space-y-2">
                <div className="font-mono text-[11px] text-[#9aa5a8]">
                  4 ACADEMIC FACULTY REFERENCES (SUKKUR IBA UNIVERSITY)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {CV_DATA.references.map((ref) => (
                    <div key={ref.email} className="p-1.5 rounded bg-[#161e24] border border-[#36424a]/50">
                      <div className="font-medium text-[#e9e4da]">{ref.name}</div>
                      <a
                        href={`mailto:${ref.email}`}
                        className="font-mono text-[11px] text-[#d0864a] hover:underline block truncate"
                      >
                        {ref.email}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PAGE 6: CONTACT & INQUIRIES */}
          {currentChapter.pageType === 'contact' && (
            <div className="mt-4 pt-3 border-t border-[#36424a] space-y-3.5">
              <div className="border border-[#36424a] bg-[#12181c] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#9aa5a8]">Institutional Email</span>
                  <span className="text-[11px] font-mono text-[#8fb27a]">Open for PhD Fall/Spring</span>
                </div>
                <div className="font-mono text-sm text-[#e9e4da]">{AUTHOR_PROFILE.email}</div>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${AUTHOR_PROFILE.email}?subject=PhD%20Research%20Inquiry`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d0864a] text-[#12181c] text-xs font-semibold hover:bg-[#e0965a] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Compose Email</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(AUTHOR_PROFILE.email, 'email-contact')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#36424a] text-xs font-mono text-[#e9e4da] hover:border-[#d0864a] cursor-pointer"
                  >
                    {copiedId === 'email-contact' ? (
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
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <a
                  href={AUTHOR_PROFILE.scholarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-[#12181c] border border-[#36424a] hover:border-[#d0864a] flex items-center justify-between text-[#e9e4da]"
                >
                  <span>Google Scholar</span>
                  <ExternalLink className="w-3 h-3 text-[#d0864a]" />
                </a>
                <a
                  href={AUTHOR_PROFILE.orcidUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-[#12181c] border border-[#36424a] hover:border-[#d0864a] flex items-center justify-between text-[#e9e4da]"
                >
                  <span>ORCID Profile</span>
                  <ExternalLink className="w-3 h-3 text-[#d0864a]" />
                </a>
                <a
                  href={AUTHOR_PROFILE.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-[#12181c] border border-[#36424a] hover:border-[#d0864a] flex items-center justify-between text-[#e9e4da]"
                >
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 text-[#d0864a]" />
                </a>
                <a
                  href={AUTHOR_PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-[#12181c] border border-[#36424a] hover:border-[#d0864a] flex items-center justify-between text-[#e9e4da]"
                >
                  <span>GitHub (@sajadali78)</span>
                  <ExternalLink className="w-3 h-3 text-[#d0864a]" />
                </a>
              </div>
            </div>
          )}

          {/* 4-Metric Quantitative KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3.5 border-t border-[#36424a]">
            {currentChapter.kpiStrip.map((kpi) => (
              <div key={kpi.label}>
                <div className="text-[11px] text-[#9aa5a8] truncate">{kpi.label}</div>
                <div className="font-mono text-xs font-semibold text-[#e9e4da] tabular-nums">
                  {kpi.value}{' '}
                  {kpi.unit && <span className="text-[#d0864a] font-normal">{kpi.unit}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Unboxed Metadata Footer Line (Zero-Pill Discipline) */}
          <div className="mt-3 pt-2.5 border-t border-[#36424a]/60 font-mono text-[11px] text-[#9aa5a8] leading-relaxed">
            {currentChapter.metaLine}
          </div>

          {/* Next Page Action */}
          <div className="mt-3 flex items-center justify-between text-xs font-mono">
            <span className="text-[#9aa5a8]">Drag 3D motor to orbit · Click parts to inspect</span>
            {chapterIndex < CHAPTERS.length - 1 ? (
              <button
                type="button"
                onClick={() => goToChapter(chapterIndex + 1)}
                className="text-[#d0864a] hover:underline font-medium cursor-pointer whitespace-nowrap"
              >
                Next: {chapterIndex + 2}. {CHAPTERS[chapterIndex + 1].shortTitle} →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => goToChapter(0)}
                className="text-[#d0864a] hover:underline font-medium cursor-pointer whitespace-nowrap"
              >
                ↺ Back to 1. Machine
              </button>
            )}
          </div>
        </aside>
      )}

      {/* Restore Narrative Button when minimized */}
      {narrativeCollapsed && (
        <button
          type="button"
          onClick={() => setNarrativeCollapsed(false)}
          className="fixed top-16 left-6 z-20 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#161e24]/95 border border-[#36424a] hover:border-[#d0864a] text-xs font-mono text-[#e9e4da] cursor-pointer shadow-lg"
        >
          <Layers className="w-3.5 h-3.5 text-[#d0864a]" />
          <span>
            Show Page {currentChapter.id + 1}: {currentChapter.shortTitle}
          </span>
        </button>
      )}

      {/* 4. UNIFIED COLLAPSIBLE BOTTOM ENGINEERING CONTROL DOCK (<= 15% Viewport Footprint) */}
      <div
        style={{
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: 'min(940px, 95vw)',
        }}
        className="fixed z-30 w-full flex flex-col items-center pointer-events-none"
      >
        {/* Collapse / Expand Toggle Pill */}
        <DockTooltip
          label={dockCollapsed ? 'Show 3D Engineering Controls' : 'Hide Engineering Controls'}
          hotkey="H"
          description="Toggle the 3D electromagnetic machine engineering dock"
        >
          <button
            type="button"
            onClick={() => setDockCollapsed((prev) => !prev)}
            className="pointer-events-auto flex items-center gap-1.5 px-3.5 py-1 rounded-t-lg bg-[#161e24] border border-b-0 border-[#36424a] text-[11px] font-mono text-[#9aa5a8] hover:text-[#e9e4da] cursor-pointer transition-colors"
          >
            <Sliders className="w-3 h-3 text-[#d0864a]" />
            <span>{dockCollapsed ? '▴ Show 3D Engineering Controls (H)' : '▾ Hide Controls (H)'}</span>
            {dockCollapsed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </DockTooltip>

        {/* Main Dock Body */}
        {!dockCollapsed && (
          <div className="pointer-events-auto w-full bg-[#161e24]/95 border border-[#36424a] rounded-xl px-4 py-3 shadow-2xl flex flex-wrap items-center justify-between gap-4">
            {/* Group A: 6 Pages Stepper (1 to 6) */}
            <div className="flex items-center gap-1">
              <span className="font-mono text-[11px] text-[#9aa5a8] mr-1 hidden sm:inline">
                Pages:
              </span>
              {CHAPTERS.map((chap, idx) => {
                const active = chap.id === chapterIndex;
                return (
                  <DockTooltip
                    key={chap.id}
                    label={`Page ${chap.id + 1}: ${chap.shortTitle}`}
                    hotkey={`${chap.id + 1}`}
                    description={`Jump directly to Page ${chap.id + 1} (${chap.eyebrow})`}
                    align={idx === 0 ? 'left' : 'center'}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal(null);
                        goToChapter(chap.id);
                      }}
                      className={`px-2.5 py-1 rounded text-xs font-mono transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                        active
                          ? 'bg-[#d0864a] text-[#12181c] font-semibold'
                          : 'bg-[#12181c] text-[#9aa5a8] hover:text-[#e9e4da] border border-[#36424a]/60'
                      }`}
                    >
                      <span>{chap.id + 1}</span>
                      <span className="hidden lg:inline text-[11px]">{chap.shortTitle}</span>
                    </button>
                  </DockTooltip>
                );
              })}
            </div>

            {/* Group B: Axial Exploded View Slider */}
            <DockTooltip
              label="Axial Exploded View"
              hotkey={['[', ']', 'X']}
              description="Displace stator and rotor along axis. [ / ] step by 10%, X cycles presets (0%, 35%, 75%)"
              className="min-w-[170px] flex-1 max-w-[230px]"
            >
              <div className="flex items-center gap-2.5 w-full">
                <label
                  htmlFor="explode-slider"
                  className="font-mono text-[11px] text-[#9aa5a8] whitespace-nowrap shrink-0"
                >
                  Explode:{' '}
                  <span className="text-[#e9e4da] tabular-nums">
                    {Math.round(explodeAmount * 100)}%
                  </span>
                </label>
                <input
                  id="explode-slider"
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={explodeAmount}
                  onChange={(e) => setExplodeAmount(parseFloat(e.target.value))}
                  className="w-full accent-[#d0864a] cursor-pointer"
                />
              </div>
            </DockTooltip>

            {/* Group C: Synchronous vs Vernier Mode & Electromagnetic Toggles */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Mode Toggle */}
              <DockTooltip
                label="Operating Mode"
                hotkey="M"
                description="Toggle High-Speed Synchronous (P=2) or Low-Speed Vernier Magnetic Gearing (Zr = Zs + p)"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOperatingMode((m) => (m === 'synchronous' ? 'vernier' : 'synchronous'))
                  }
                  className="px-2.5 py-1 rounded text-xs font-mono bg-[#12181c] border border-[#36424a] hover:border-[#d0864a] text-[#e9e4da] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Mode:{' '}
                  <span className="text-[#d0864a]">
                    {operatingMode === 'vernier' ? 'Vernier' : 'Sync'}
                  </span>
                </button>
              </DockTooltip>

              {/* 4° Skew Toggle */}
              <DockTooltip
                label="4.0° Helical Skew"
                hotkey="S"
                description="Toggle 4° stator slot & PM skew (suppresses Vernier low-speed ripple from 73% down to 27%)"
              >
                <button
                  type="button"
                  onClick={() => setSkewEnabled((s) => !s)}
                  className={`px-2.5 py-1 rounded text-xs font-mono border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    skewEnabled
                      ? 'bg-[#d0864a]/20 border-[#d0864a] text-[#e9e4da]'
                      : 'bg-[#12181c] border-[#36424a] text-[#9aa5a8]'
                  }`}
                >
                  4° Skew: {skewEnabled ? 'ON' : 'OFF'}
                </button>
              </DockTooltip>

              {/* B-Field Heatmap Toggle */}
              <DockTooltip
                label="B-Field Saturation Heatmap"
                hotkey="B"
                description="Toggle Ansys Maxwell 2D electromagnetic flux density color map (0.0 T – 2.0 T saturation)"
              >
                <button
                  type="button"
                  onClick={() => setFluxIntensity((f) => (f > 0.5 ? 0.0 : 0.95))}
                  className={`px-2.5 py-1 rounded text-xs font-mono border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    fluxIntensity > 0.5
                      ? 'bg-[#d0864a]/20 border-[#d0864a] text-[#e9e4da]'
                      : 'bg-[#12181c] border-[#36424a] text-[#9aa5a8]'
                  }`}
                >
                  B-Flux
                </button>
              </DockTooltip>

              {/* FEA Mesh Wireframe Toggle */}
              <DockTooltip
                label="Finite Element Mesh Wireframe"
                hotkey="F"
                description="Overlay 3D finite element discretization mesh lines onto laminations, PMs, and copper windings"
              >
                <button
                  type="button"
                  onClick={() => setShowMeshWireframe((w) => !w)}
                  className={`px-2.5 py-1 rounded text-xs font-mono border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    showMeshWireframe
                      ? 'bg-[#d0864a]/20 border-[#d0864a] text-[#e9e4da]'
                      : 'bg-[#12181c] border-[#36424a] text-[#9aa5a8]'
                  }`}
                >
                  FEA Mesh
                </button>
              </DockTooltip>

              {/* Housing Shell Toggle */}
              <DockTooltip
                label="Outer Stator Housing"
                hotkey="C"
                description="Toggle the finned aluminum outer housing shell to view internal rotor/stator concentric core"
              >
                <button
                  type="button"
                  onClick={() => setCutawayEnabled((c) => !c)}
                  className={`px-2.5 py-1 rounded text-xs font-mono border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    cutawayEnabled
                      ? 'bg-[#12181c] border-[#36424a] text-[#e9e4da]'
                      : 'bg-[#d0864a]/20 border-[#d0864a] text-[#e9e4da]'
                  }`}
                >
                  Housing
                </button>
              </DockTooltip>

              {/* Rotor Pause/Play */}
              <DockTooltip
                label="Rotor Mechanical Rotation"
                hotkey="Space"
                description="Pause or resume dynamic mechanical rotation of the hybrid rotor shaft assembly"
                align="right"
              >
                <button
                  type="button"
                  onClick={() => setRotorSpeedMultiplier((s) => (s > 0 ? 0 : 1))}
                  className="px-2.5 py-1 rounded text-xs font-mono bg-[#12181c] border border-[#36424a] hover:border-[#d0864a] text-[#9aa5a8] hover:text-[#e9e4da] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {rotorSpeedMultiplier > 0 ? 'Pause' : 'Rotate'}
                </button>
              </DockTooltip>
            </div>
          </div>
        )}
      </div>

      {/* 5. ACADEMIC DOSSIER DRAWER MODAL (Full Wide Reader for Publications, Thesis, EM Design Suite, CV, Contact) */}
      <DossierModal
        activeTab={activeModal}
        onClose={() => setActiveModal(null)}
        onSelectTab={(tab) => setActiveModal(tab)}
        skewEnabled={skewEnabled}
        operatingMode={operatingMode}
        onToggleSkew={setSkewEnabled}
        onToggleMode={setOperatingMode}
      />
    </div>
  );
}
