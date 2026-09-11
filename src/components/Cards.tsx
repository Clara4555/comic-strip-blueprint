import { useState, type ReactNode } from 'react';

interface ConceptCardProps {
  title: string;
  description: string;
  example?: string;
  icon: ReactNode;
  color: string;
  highlight?: boolean;
}

export function ConceptCard({ title, description, example, icon, color, highlight }: ConceptCardProps) {
  return (
    <div
      className={`rounded-2xl p-5 border-2 transition-all card-hover ${
        highlight ? `${color} border-current shadow-lg` : `${color} border-transparent`
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-slate-800 font-display text-lg">{title}</h4>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">{description}</p>
          {example && (
            <div className="mt-2 rounded-lg bg-white/50 px-3 py-2 text-sm text-slate-700 italic">
              {example}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface PipelineStepProps {
  label: string;
  description: string;
  isLast?: boolean;
  highlight?: boolean;
}

export function PipelineStep({ label, description, isLast, highlight }: PipelineStepProps) {
  return (
    <div className="flex flex-col items-center text-center w-full">
      <div
        className={`w-full max-w-[200px] rounded-2xl px-4 py-3 border-2 transition-all ${
          highlight
            ? 'bg-cyan-50 border-cyan-400 shadow-lg shadow-cyan-200/50'
            : 'bg-white border-slate-200'
        }`}
      >
        <p className="font-bold text-slate-800 font-display">{label}</p>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>
      {!isLast && (
        <svg className="w-6 h-6 text-cyan-400 my-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      )}
    </div>
  );
}

interface PipelineProps {
  steps: { label: string; description: string }[];
  highlightIndex?: number;
}

export function Pipeline({ steps, highlightIndex }: PipelineProps) {
  return (
    <div className="flex flex-col items-center gap-0 my-6">
      {steps.map((step, i) => (
        <PipelineStep
          key={i}
          label={step.label}
          description={step.description}
          isLast={i === steps.length - 1}
          highlight={highlightIndex === i}
        />
      ))}
    </div>
  );
}

interface PromptHighlightProps {
  prompt: string;
  highlights: { text: string; color: string }[];
}

export function PromptHighlight({ prompt, highlights }: PromptHighlightProps) {
  let result: ReactNode = prompt;
  highlights.forEach(({ text, color }) => {
    const parts = String(result).split(text);
    if (parts.length > 1) {
      result = parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <mark className={`rounded px-1 ${color}`}>{text}</mark>
          )}
        </span>
      ));
    }
  });
  return (
    <div className="rounded-xl bg-slate-50 border-2 border-slate-200 p-4 text-sm text-slate-700 leading-relaxed font-mono">
      {result}
    </div>
  );
}

interface SmartLetterProps {
  letter: string;
  word: string;
  description: string;
  color: string;
  children?: ReactNode;
}

export function SmartLetter({ letter, word, description, color, children }: SmartLetterProps) {
  return (
    <div className="flex gap-3 items-start">
      <div
        className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl font-display ${color}`}
      >
        {letter}
      </div>
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-slate-800">{letter}</span>
          <span className="text-sm text-slate-400">—</span>
          <span className="font-bold text-slate-700">{word}</span>
        </div>
        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
}

interface TagProps {
  children: ReactNode;
  color?: string;
}

export function Tag({ children, color = 'bg-cyan-100 text-cyan-700' }: TagProps) {
  return <span className={`tag ${color}`}>{children}</span>;
}

interface BlueprintFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  editable?: boolean;
  type?: 'text' | 'textarea';
}

export function BlueprintField({
  label,
  value,
  placeholder = 'Not filled in yet — add this detail',
  onChange,
  editable = false,
  type = 'text',
}: BlueprintFieldProps) {
  const [localValue, setLocalValue] = useState(value);

  const currentValue = editable ? localValue : value;
  const displayValue = currentValue || (editable ? '' : placeholder);
  const isEmpty = !currentValue;

  return (
    <div>
      <label className="label-field">{label}</label>
      {editable ? (
        type === 'textarea' ? (
          <textarea
            className="textarea-field"
            value={localValue}
            placeholder={placeholder}
            onChange={(e) => {
              setLocalValue(e.target.value);
              onChange?.(e.target.value);
            }}
          />
        ) : (
          <input
            className="input-field"
            value={localValue}
            placeholder={placeholder}
            onChange={(e) => {
              setLocalValue(e.target.value);
              onChange?.(e.target.value);
            }}
          />
        )
      ) : (
        <div
          className={`rounded-xl px-4 py-3 text-sm border-2 ${
            isEmpty
              ? 'border-amber-200 bg-amber-50 text-amber-600 italic'
              : 'border-slate-200 bg-slate-50 text-slate-700'
          }`}
        >
          {displayValue}
        </div>
      )}
    </div>
  );
}
