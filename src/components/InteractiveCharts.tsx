import React, { useState } from 'react';
import { PARETO_CANDIDATES, ParetoCandidate } from '../data/portfolioData';

interface TorqueSkewChartProps {
  skewEnabled: boolean;
  operatingMode: 'synchronous' | 'vernier';
  onToggleSkew: (skew: boolean) => void;
  onToggleMode: (mode: 'synchronous' | 'vernier') => void;
}

export const TorqueSkewChart: React.FC<TorqueSkewChartProps> = ({
  skewEnabled,
  operatingMode,
  onToggleSkew,
  onToggleMode,
}) => {
  // Generate 72-point electrical cycle waveform matching Sajad's Ansys Maxwell thesis results
  const pointsCount = 72;
  const isVernier = operatingMode === 'vernier';
  const avgTorque = isVernier ? 6.42 : 4.95;

  const buildPath = (skewed: boolean) => {
    const pts: string[] = [];
    for (let i = 0; i <= pointsCount; i++) {
      const u = i / pointsCount;
      const elecRad = u * Math.PI * 2;
      let rippleAmp = 0;
      if (isVernier) {
        // Low-speed Vernier: 73% ripple before skew, 27% after 4° skew
        rippleAmp = skewed
          ? 0.135 * Math.sin(6 * elecRad + 0.4) + 0.04 * Math.cos(12 * elecRad)
          : 0.365 * Math.sin(6 * elecRad) + 0.14 * Math.sin(12 * elecRad - 0.3) + 0.06 * Math.cos(18 * elecRad);
      } else {
        // High-speed Synchronous: 7.0% ripple before skew, 6.5% after 4° skew
        rippleAmp = skewed
          ? 0.0325 * Math.sin(6 * elecRad + 0.3)
          : 0.035 * Math.sin(6 * elecRad) + 0.015 * Math.cos(12 * elecRad);
      }
      const tVal = avgTorque * (1 + rippleAmp);
      const x = 36 + u * 290;
      // Map torque [2.5 .. 9.5] Nm to y [118 .. 16]
      const y = 118 - ((tVal - 2.5) / 7.0) * 102;
      pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  };

  const unskewedPath = buildPath(false);
  const skewedPath = buildPath(true);

  return (
    <div className="border border-[#36424a] bg-[#161e24]/95 rounded-xl p-4 mt-3">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <div className="font-mono text-[11px] text-[#9aa5a8]">
            ANSYS MAXWELL TRANSIENT FEA · 18-SLOT / 4-POLE HARMONIC ANALYSIS
          </div>
          <div className="text-sm font-semibold text-[#e9e4da]">
            Output Torque &amp; 4.0° Skew Ripple Suppression
          </div>
        </div>
        <div className="flex items-center gap-1 bg-[#12181c] p-1 rounded-lg border border-[#36424a]">
          <button
            type="button"
            onClick={() => onToggleSkew(false)}
            className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              !skewEnabled
                ? 'bg-[#e2583a] text-[#12181c] font-semibold'
                : 'text-[#9aa5a8] hover:text-[#e9e4da]'
            }`}
          >
            0° Un-skewed ({isVernier ? '73%' : '7.0%'})
          </button>
          <button
            type="button"
            onClick={() => onToggleSkew(true)}
            className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              skewEnabled
                ? 'bg-[#d0864a] text-[#12181c] font-semibold'
                : 'text-[#9aa5a8] hover:text-[#e9e4da]'
            }`}
          >
            4° Skewed ({isVernier ? '27%' : '6.5%'})
          </button>
        </div>
      </div>

      <svg
        viewBox="0 0 340 140"
        className="w-full h-32 overflow-visible"
        role="img"
        aria-label="Torque waveform comparison before and after 4 degree skew"
      >
        {/* Grid lines */}
        {[3.5, 5.5, 7.5, 9.0].map((val) => {
          const y = 118 - ((val - 2.5) / 7.0) * 102;
          return (
            <g key={val}>
              <line x1="36" y1={y} x2="326" y2={y} stroke="#36424a" strokeDasharray="2 3" strokeWidth="1" />
              <text x="30" y={y + 3} textAnchor="end" className="fill-[#9aa5a8] font-mono text-[9px]">
                {val.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* Unskewed reference curve */}
        <path
          d={unskewedPath}
          fill="none"
          stroke="#e2583a"
          strokeWidth={skewEnabled ? 1.25 : 2.2}
          strokeDasharray={skewEnabled ? '3 3' : undefined}
          opacity={skewEnabled ? 0.55 : 1}
        />

        {/* 4-degree skewed curve */}
        <path
          d={skewedPath}
          fill="none"
          stroke="#d0864a"
          strokeWidth={skewEnabled ? 2.4 : 1.25}
          opacity={skewEnabled ? 1 : 0.45}
        />

        <text x="180" y="135" textAnchor="middle" className="fill-[#9aa5a8] font-mono text-[9px]">
          Electrical Cycle Angle (0° → 360°) · Avg Torque: {avgTorque.toFixed(2)} Nm
        </text>
      </svg>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#36424a]/60 text-xs text-[#9aa5a8] font-mono">
        <span>
          Mode:{' '}
          <button
            type="button"
            onClick={() => onToggleMode(isVernier ? 'synchronous' : 'vernier')}
            className="text-[#d0864a] underline cursor-pointer"
          >
            {isVernier ? 'Low-Speed Vernier (Geared)' : 'High-Speed Synchronous'}
          </button>
        </span>
        <span className="tabular-nums">
          Ripple: <strong className="text-[#e9e4da]">{skewEnabled ? (isVernier ? '27.0%' : '6.5%') : isVernier ? '73.0%' : '7.0%'}</strong>
        </span>
      </div>
    </div>
  );
};

interface ParetoScatterChartProps {
  onSelectCandidate?: (candidate: ParetoCandidate) => void;
}

export const ParetoScatterChart: React.FC<ParetoScatterChartProps> = ({ onSelectCandidate }) => {
  const optimalDefault =
    PARETO_CANDIDATES.find((c) => c.isChosenOptimal) || PARETO_CANDIDATES[PARETO_CANDIDATES.length - 1];
  const [selected, setSelected] = useState<ParetoCandidate>(optimalDefault);

  const frontSorted = PARETO_CANDIDATES.filter((c) => c.isParetoFront).sort(
    (a, b) => a.avgTorque - b.avgTorque
  );

  const mapX = (t: number) => 38 + ((t - 4.8) / 10.0) * 284;
  const mapY = (r: number) => 126 - (r / 78) * 106;

  const frontLine = frontSorted
    .map((c, idx) => `${idx === 0 ? 'M' : 'L'}${mapX(c.avgTorque).toFixed(1)},${mapY(c.torqueRipple).toFixed(1)}`)
    .join(' ');

  const handlePick = (c: ParetoCandidate) => {
    setSelected(c);
    onSelectCandidate?.(c);
  };

  return (
    <div className="border border-[#36424a] bg-[#161e24]/95 rounded-xl p-4 mt-3">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div>
          <div className="font-mono text-[11px] text-[#9aa5a8]">
            NSGA-II &amp; GENETIC ALGORITHM · 46-VARIABLE SURROGATE SWEEP
          </div>
          <div className="text-sm font-semibold text-[#e9e4da]">
            Pareto Front Explorer (Click any FEA design point)
          </div>
        </div>
        <span className="font-mono text-xs text-[#d0864a] tabular-nums">
          Design #{selected.id} {selected.isChosenOptimal ? '· Thesis Optimal' : ''}
        </span>
      </div>

      <svg
        viewBox="0 0 340 148"
        className="w-full h-36 overflow-visible"
        role="img"
        aria-label="Pareto front scatter plot of Average Torque versus Torque Ripple"
      >
        {/* Target constraint lines: T >= 5.5 Nm, Ripple <= 30% */}
        <line
          x1={mapX(5.5)}
          y1="16"
          x2={mapX(5.5)}
          y2="126"
          stroke="#2f7f86"
          strokeDasharray="3 3"
          strokeWidth="1"
        />
        <line
          x1="38"
          y1={mapY(30)}
          x2="322"
          y2={mapY(30)}
          stroke="#2f7f86"
          strokeDasharray="3 3"
          strokeWidth="1"
        />

        {/* Y-axis ticks (Ripple %) */}
        {[15, 30, 50, 70].map((r) => {
          const y = mapY(r);
          return (
            <g key={r}>
              <text x="32" y={y + 3} textAnchor="end" className="fill-[#9aa5a8] font-mono text-[9px]">
                {r}%
              </text>
            </g>
          );
        })}

        {/* Pareto front line */}
        <path d={frontLine} fill="none" stroke="#d0864a" strokeWidth="1.5" opacity="0.85" />

        {/* Candidate scatter points */}
        {PARETO_CANDIDATES.map((c) => {
          const cx = mapX(c.avgTorque);
          const cy = mapY(c.torqueRipple);
          const isSel = c.id === selected.id;
          return (
            <circle
              key={c.id}
              cx={cx}
              cy={cy}
              r={isSel ? 5.2 : c.isChosenOptimal ? 4.2 : c.isParetoFront ? 3.0 : 2.1}
              fill={
                isSel
                  ? '#e9e4da'
                  : c.isChosenOptimal
                  ? '#8fb27a'
                  : c.isParetoFront
                  ? '#d0864a'
                  : '#5d6b73'
              }
              stroke={isSel ? '#d0864a' : 'none'}
              strokeWidth={isSel ? 2 : 0}
              className="cursor-pointer transition-transform hover:scale-125"
              onClick={() => handlePick(c)}
            />
          );
        })}

        <text x="180" y="143" textAnchor="middle" className="fill-[#9aa5a8] font-mono text-[9px]">
          Average Electromagnetic Torque T_avg (Nm) →
        </text>
      </svg>

      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#36424a]/60 font-mono text-[11px] tabular-nums">
        <div>
          <span className="text-[#9aa5a8] block">Avg Torque</span>
          <strong className="text-[#e9e4da]">{selected.avgTorque.toFixed(2)} Nm</strong>
        </div>
        <div>
          <span className="text-[#9aa5a8] block">Ripple</span>
          <strong className="text-[#d0864a]">{selected.torqueRipple.toFixed(1)}%</strong>
        </div>
        <div>
          <span className="text-[#9aa5a8] block">PM Saved</span>
          <strong className="text-[#8fb27a]">-{selected.pmAreaReduction.toFixed(1)}%</strong>
        </div>
        <div>
          <span className="text-[#9aa5a8] block">Efficiency</span>
          <strong className="text-[#e9e4da]">{selected.efficiency.toFixed(1)}%</strong>
        </div>
      </div>
    </div>
  );
};

export const EmQuickSizer: React.FC = () => {
  const [powerKw, setPowerKw] = useState<number>(80);
  const [speedRpm, setSpeedRpm] = useState<number>(3000);
  const [windingLayers, setWindingLayers] = useState<1 | 2 | 4 | 6>(4);

  const kw1 = windingLayers >= 4 ? 0.933 : 0.955;
  const bAv = 0.62;
  const c0 = 11 * kw1 * bAv * (38000 / 1000) * 1e-3;
  const nRps = speedRpm / 60;
  const d2l = powerKw / (c0 * Math.max(0.1, nRps));
  const aspectRatio = 1.25;
  const boreDiameterM = Math.cbrt(d2l / aspectRatio);
  const stackLengthM = boreDiameterM * aspectRatio;
  const boreMm = Math.round(boreDiameterM * 1000);
  const stackMm = Math.round(stackLengthM * 1000);
  const subHarmonicReduction =
    windingLayers === 4 ? 73.2 : windingLayers === 6 ? 78.5 : windingLayers === 2 ? 28.0 : 0;

  return (
    <div className="border border-[#36424a] bg-[#161e24]/95 rounded-xl p-4 mt-3 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="font-mono text-[11px] text-[#9aa5a8]">
            CLASSICAL D²L SIZING &amp; STAR-OF-SLOTS HARMONICS
          </div>
          <div className="text-sm font-semibold text-[#e9e4da]">
            Interactive Machine Sizing Calculator
          </div>
        </div>
        <span className="font-mono text-xs text-[#d0864a] tabular-nums">
          D²L = {(d2l * 1e3).toFixed(2)} dm³
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
        <label className="block space-y-1">
          <span className="text-[#9aa5a8]">
            Rated Power: <strong className="text-[#e9e4da]">{powerKw} kW</strong>
          </span>
          <input
            type="range"
            min={10}
            max={200}
            step={5}
            value={powerKw}
            onChange={(e) => setPowerKw(Number(e.target.value))}
            className="w-full accent-[#d0864a]"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-[#9aa5a8]">
            Rated Speed: <strong className="text-[#e9e4da]">{speedRpm} rpm</strong>
          </span>
          <input
            type="range"
            min={500}
            max={6000}
            step={100}
            value={speedRpm}
            onChange={(e) => setSpeedRpm(Number(e.target.value))}
            className="w-full accent-[#d0864a]"
          />
        </label>
      </div>

      <div className="flex items-center justify-between gap-2 text-xs font-mono pt-1">
        <span className="text-[#9aa5a8]">Winding Layers:</span>
        <div className="flex gap-1">
          {([1, 2, 4, 6] as const).map((layer) => (
            <button
              key={layer}
              type="button"
              onClick={() => setWindingLayers(layer)}
              className={`px-2 py-0.5 rounded text-xs font-mono cursor-pointer ${
                windingLayers === layer
                  ? 'bg-[#d0864a] text-[#12181c] font-semibold'
                  : 'bg-[#12181c] border border-[#36424a] text-[#9aa5a8]'
              }`}
            >
              {layer}L
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#36424a]/60 font-mono text-[11px] tabular-nums">
        <div>
          <span className="text-[#9aa5a8] block">Bore (D)</span>
          <strong className="text-[#d0864a]">{boreMm} mm</strong>
        </div>
        <div>
          <span className="text-[#9aa5a8] block">Stack (L)</span>
          <strong className="text-[#e9e4da]">{stackMm} mm</strong>
        </div>
        <div>
          <span className="text-[#9aa5a8] block">Coeff C₀</span>
          <strong className="text-[#e9e4da]">{c0.toFixed(1)}</strong>
        </div>
        <div>
          <span className="text-[#9aa5a8] block">Sub-Harmonic</span>
          <strong className="text-[#8fb27a]">-{subHarmonicReduction.toFixed(1)}%</strong>
        </div>
      </div>
    </div>
  );
};

