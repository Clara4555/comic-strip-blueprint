import type { ReactNode } from 'react';

interface ByteMascotProps {
  message: string;
  expression?: 'happy' | 'excited' | 'thinking' | 'celebrate';
  size?: 'sm' | 'md' | 'lg';
}

const expressions: Record<string, string> = {
  happy: 'M12 15a2 2 0 100-4 2 2 0 000 4z',
  excited: 'M8 14l4-4 4 4',
  thinking: 'M9 14c1-1 5-1 6 0',
  celebrate: 'M8 14c2-2 4-2 6 0',
};

export function ByteMascot({ message, expression = 'happy', size = 'md' }: ByteMascotProps) {
  const sizes = {
    sm: { box: 'w-12 h-12', text: 'text-sm' },
    md: { box: 'w-16 h-16', text: 'text-base' },
    lg: { box: 'w-20 h-20', text: 'text-lg' },
  };
  const s = sizes[size];

  return (
    <div className="flex items-start gap-3 animate-slide-up">
      <div className={`${s.box} flex-shrink-0 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 animate-float-slow`}>
        <svg viewBox="0 0 24 24" className="w-3/4 h-3/4 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="6" width="16" height="12" rx="4" />
          <path d={expressions[expression]} />
          <circle cx="9" cy="11" r="1" fill="currentColor" />
          <circle cx="15" cy="11" r="1" fill="currentColor" />
          <path d="M12 3v3" />
          <circle cx="12" cy="3" r="1" fill="currentColor" />
        </svg>
      </div>
      <div className={`flex-1 rounded-2xl bg-cyan-50 border-2 border-cyan-100 px-4 py-3 ${s.text} text-slate-700 leading-relaxed`}>
        {message}
      </div>
    </div>
  );
}

interface TeacherTipProps {
  say: string;
  ask: string;
  lookFor: string;
}

export function TeacherTip({ say, ask, lookFor }: TeacherTipProps) {
  return (
    <details className="group mt-4 rounded-2xl border-2 border-amber-200 bg-amber-50 overflow-hidden">
      <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-bold text-amber-800 select-none">
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          <circle cx="12" cy="12" r="4" />
        </svg>
        Teacher Tip
        <svg className="w-4 h-4 ml-auto transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
      </summary>
      <div className="px-4 pb-4 pt-1 space-y-2 text-sm text-amber-900">
        <p><span className="font-bold">Say:</span> {say}</p>
        <p><span className="font-bold">Ask:</span> {ask}</p>
        <p><span className="font-bold">Look for:</span> {lookFor}</p>
      </div>
    </details>
  );
}

interface SectionShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
}

export function SectionShell({ children, title, subtitle, icon, className = '' }: SectionShellProps) {
  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 animate-slide-up ${className}`}>
      {title && (
        <div className="mb-6">
          {icon && <div className="mb-3 flex items-center gap-3">{icon}</div>}
          <h2 className="text-3xl font-bold font-display text-slate-800">{title}</h2>
          {subtitle && <p className="mt-2 text-slate-500 text-lg">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

interface NavButtonsProps {
  onPrev?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  prevLabel?: string;
  nextDisabled?: boolean;
  nextVariant?: 'primary' | 'secondary';
}

export function NavButtons({
  onPrev,
  onNext,
  nextLabel = 'Continue',
  prevLabel = 'Back',
  nextDisabled = false,
  nextVariant = 'primary',
}: NavButtonsProps) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
      {onPrev ? (
        <button onClick={onPrev} className="btn-ghost">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          {prevLabel}
        </button>
      ) : (
        <div />
      )}
      {onNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className={nextVariant === 'primary' ? 'btn-primary' : 'btn-secondary'}
        >
          {nextLabel}
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      )}
    </div>
  );
}

interface ProgressBarProps {
  stages: { id: string; label: string; icon: string }[];
  currentIndex: number;
  completedScreens: number[];
  onStageClick?: (index: number) => void;
}

export function ProgressBar({ stages, currentIndex, completedScreens, onStageClick }: ProgressBarProps) {
  const iconMap: Record<string, ReactNode> = {
    'rocket': <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />,
    'clipboard-list': <><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4M12 16h4M8 11h.01M8 16h.01" /></>,
    'image': <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5L5 21" /></>,
    'sliders-horizontal': <><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" /></>,
    'brain': <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2zM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z" />,
    'sparkles': <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z" />,
    'user-pen': <><path d="M11.5 15.5h2M11 19h6m-3-3v-1m4-7.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" /><path d="M17.5 13l1.5-1.5M19 14.5l-1.5-1.5" /></>,
    'image-plus': <><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" /><path d="M15 3h6v6M10 14L21 3" /><circle cx="9" cy="9" r="2" /></>,
    'newspaper': <><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" /><path d="M18 14h-8M15 18h-8M10 6h8v4h-8V6Z" /></>,
    'help-circle': <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" /></>,
    'trophy': <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" /></>,
  };

  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          {stages.map((stage, i) => {
            const isCompleted = completedScreens.includes(i);
            const isCurrent = i === currentIndex;
            return (
              <div key={stage.id} className="flex items-center flex-shrink-0">
                <div
                  onClick={() => onStageClick?.(i)}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-bold transition-all ${
                    onStageClick ? 'cursor-pointer hover:scale-105' : ''
                  } ${
                    isCurrent
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                      : isCompleted
                      ? 'bg-cyan-50 text-cyan-700'
                      : 'bg-slate-50 text-slate-400'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {iconMap[stage.icon] || iconMap['rocket']}
                  </svg>
                  <span className="hidden sm:inline">{stage.label}</span>
                </div>
                {i < stages.length - 1 && (
                  <div className={`w-3 h-0.5 ${isCompleted ? 'bg-cyan-300' : 'bg-slate-100'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
