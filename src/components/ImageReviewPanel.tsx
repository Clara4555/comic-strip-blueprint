import { useState } from 'react';
import type { PanelReview } from '@/types/lesson';

interface ImageReviewPanelProps {
  review: PanelReview | null;
  onReviewChange: (review: PanelReview) => void;
}

const reviewItems: { key: keyof PanelReview; label: string; description: string }[] = [
  { key: 'character', label: 'Character', description: 'Does the character look right?' },
  { key: 'setting', label: 'Setting', description: 'Is the location correct?' },
  { key: 'action', label: 'Action', description: 'Is the character doing the right thing?' },
  { key: 'details', label: 'Details', description: 'Are the important details there?' },
  { key: 'emotion', label: 'Emotion', description: 'Does the character look the way they should?' },
  { key: 'style', label: 'Style', description: 'Does the picture match the chosen style?' },
  { key: 'consistency', label: 'Consistency', description: 'Does the character match the character description?' },
];

export function ImageReviewPanel({ review, onReviewChange }: ImageReviewPanelProps) {
  const [localReview, setLocalReview] = useState<PanelReview>(
    review || {
      character: false,
      setting: false,
      action: false,
      details: false,
      emotion: false,
      style: false,
      consistency: false,
    }
  );

  const toggle = (key: keyof PanelReview) => {
    const next = { ...localReview, [key]: !localReview[key] };
    setLocalReview(next);
    onReviewChange(next);
  };

  const yesCount = Object.values(localReview).filter(Boolean).length;
  const needsFixCount = reviewItems.length - yesCount;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">🔍</span>
        <div>
          <h4 className="font-bold text-slate-800 font-display text-lg">Look Like a Creative Director</h4>
          <p className="text-sm text-slate-500">Your job isn't finished when the AI makes an image. Review it!</p>
        </div>
      </div>

      <div className="space-y-2">
        {reviewItems.map((item) => {
          const value = localReview[item.key];
          return (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-xl border-2 border-slate-200 bg-white px-4 py-3"
            >
              <div>
                <p className="font-bold text-sm text-slate-700">{item.label}</p>
                <p className="text-xs text-slate-400">{item.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => !value && toggle(item.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    value
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => value && toggle(item.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    !value
                      ? 'bg-rose-100 text-rose-600 border border-rose-200'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  Needs Fixing
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center justify-between">
        <span className="text-sm text-slate-600">
          <span className="font-bold text-emerald-600">{yesCount}</span> look right ·{' '}
          <span className="font-bold text-rose-500">{needsFixCount}</span> need fixing
        </span>
        <span className="text-sm font-bold text-slate-700">
          {needsFixCount === 0 ? 'Great job!' : 'Improve your prompt!'}
        </span>
      </div>
    </div>
  );
}
