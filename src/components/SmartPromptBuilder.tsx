import { useState } from 'react';
import type { SmartPrompt } from '@/types/lesson';
import { SmartLetter, Tag } from './Cards';

interface SmartPromptBuilderProps {
  initialPrompt?: SmartPrompt;
  onPromptChange: (prompt: SmartPrompt) => void;
  prefill?: Partial<SmartPrompt>;
}

export function SmartPromptBuilder({ initialPrompt, onPromptChange, prefill }: SmartPromptBuilderProps) {
  const [prompt, setPrompt] = useState<SmartPrompt>(
    initialPrompt || {
      say: prefill?.say || '',
      mention: prefill?.mention || '',
      ask: prefill?.ask || '',
      request: prefill?.request || 'Use a colorful cartoon comic style',
      thank: prefill?.thank || 'Thank you!',
    }
  );

  const update = (field: keyof SmartPrompt, value: string) => {
    const next = { ...prompt, [field]: value };
    setPrompt(next);
    onPromptChange(next);
  };

  const fullPrompt = [prompt.say, prompt.mention, prompt.ask, prompt.request, prompt.thank]
    .filter((s) => s.trim())
    .join(' ');

  const sections: { key: keyof SmartPrompt; letter: string; word: string; description: string; color: string; placeholder: string }[] = [
    {
      key: 'say',
      letter: 'S',
      word: 'SAY',
      description: 'What are you asking the AI to create?',
      color: 'bg-cyan-100 text-cyan-700',
      placeholder: 'Create a colorful comic-style image of...',
    },
    {
      key: 'mention',
      letter: 'M',
      word: 'MENTION',
      description: 'What important details must it know?',
      color: 'bg-emerald-100 text-emerald-700',
      placeholder: 'Include [character details]...',
    },
    {
      key: 'ask',
      letter: 'A',
      word: 'ASK',
      description: 'What exactly should happen in the scene?',
      color: 'bg-amber-100 text-amber-700',
      placeholder: 'Show [character] [doing action] in [setting]...',
    },
    {
      key: 'request',
      letter: 'R',
      word: 'REQUEST',
      description: 'What style or format should the image use?',
      color: 'bg-rose-100 text-rose-700',
      placeholder: 'Use a colorful cartoon comic style...',
    },
    {
      key: 'thank',
      letter: 'T',
      word: 'THANK',
      description: 'Finish politely.',
      color: 'bg-violet-100 text-violet-700',
      placeholder: 'Thank you!',
    },
  ];

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        {sections.map((s) => (
          <SmartLetter key={s.key} letter={s.letter} word={s.word} description={s.description} color={s.color}>
            <textarea
              className="textarea-field text-sm min-h-[50px]"
              value={prompt[s.key]}
              placeholder={s.placeholder}
              onChange={(e) => update(s.key, e.target.value)}
            />
          </SmartLetter>
        ))}
      </div>

      <div className="rounded-2xl border-2 border-cyan-200 bg-cyan-50/50 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Tag color="bg-cyan-500 text-white">Your Full Prompt</Tag>
        </div>
        <div className="rounded-xl bg-white border border-cyan-200 p-4 text-sm text-slate-700 leading-relaxed min-h-[60px]">
          {fullPrompt || <span className="text-slate-400 italic">Start filling in the SMART sections above to build your prompt...</span>}
        </div>
      </div>
    </div>
  );
}
