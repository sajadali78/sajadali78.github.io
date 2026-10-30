import React, { useState } from 'react';

interface DockTooltipProps {
  label: string;
  hotkey?: string | string[];
  description?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  children: React.ReactNode;
}

export function DockTooltip({
  label,
  hotkey,
  description,
  align = 'center',
  className = '',
  children,
}: DockTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Position alignment styling for the floating tooltip card
  const alignClass =
    align === 'left'
      ? 'left-0'
      : align === 'right'
      ? 'right-0'
      : 'left-1/2 -translate-x-1/2';

  // Triangle pointer styling
  const caretClass =
    align === 'left'
      ? 'left-4'
      : align === 'right'
      ? 'right-4'
      : 'left-1/2 -translate-x-1/2';

  const hotkeysList = Array.isArray(hotkey) ? hotkey : hotkey ? [hotkey] : [];

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      {children}

      {isOpen && (
        <div
          role="tooltip"
          className={`absolute bottom-full mb-2 z-50 pointer-events-none select-none ${alignClass} w-max max-w-[260px] bg-[#12181c]/98 border border-[#5d6b73]/60 rounded-xl p-2.5 shadow-2xl backdrop-blur-md animate-badge-slide-in`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-[#e9e4da] tracking-wide">
              {label}
            </span>
            {hotkeysList.length > 0 && (
              <div className="flex items-center gap-1 shrink-0">
                {hotkeysList.map((hk, i) => (
                  <kbd
                    key={i}
                    className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#1b2328] border border-[#d0864a]/50 text-[#d0864a] rounded shadow-inner"
                  >
                    {hk}
                  </kbd>
                ))}
              </div>
            )}
          </div>

          {description && (
            <p className="text-[11px] text-[#9aa5a8] leading-snug mt-1 font-sans">
              {description}
            </p>
          )}

          {/* Caret arrow pointing down to the button */}
          <div
            className={`absolute top-full -mt-[1px] w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#5d6b73]/60 ${caretClass}`}
          />
        </div>
      )}
    </div>
  );
}
