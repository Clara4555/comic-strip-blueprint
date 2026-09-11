import { useState } from 'react';
import type { Blueprint, ComicPanel } from '@/types/lesson';
import { ByteMascot, SectionShell, NavButtons, TeacherTip } from './Common';
import { Tag } from './Cards';

// ===================== Section 23: Build the Comic =====================
interface ComicBuilderProps {
  blueprint: Blueprint;
  panels: { panel1: ComicPanel; panel2: ComicPanel; panel3: ComicPanel };
  onPanelDialogueChange: (panelKey: 'panel1' | 'panel2' | 'panel3', dialogue: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function ComicBuilderSection({ blueprint, panels, onPanelDialogueChange, onPrev, onNext }: ComicBuilderProps) {
  const [editingPanel, setEditingPanel] = useState<'panel1' | 'panel2' | 'panel3' | null>(null);
  const [editDialogue, setEditDialogue] = useState('');

  const panelData = [
    { key: 'panel1' as const, label: 'Beginning', panel: panels.panel1, bpPanel: blueprint.panels.panel1 },
    { key: 'panel2' as const, label: 'Adventure', panel: panels.panel2, bpPanel: blueprint.panels.panel2 },
    { key: 'panel3' as const, label: 'Ending', panel: panels.panel3, bpPanel: blueprint.panels.panel3 },
  ];

  const startEdit = (key: 'panel1' | 'panel2' | 'panel3', current: string) => {
    setEditingPanel(key);
    setEditDialogue(current);
  };

  const saveEdit = () => {
    if (editingPanel) {
      onPanelDialogueChange(editingPanel, editDialogue);
    }
    setEditingPanel(null);
  };

  return (
    <SectionShell
      title="Build Your Comic"
      subtitle="Now the pictures and words work together to tell your story"
    >
      <ByteMascot expression="celebrate" message="Your comic is coming together! Let's put your three panels together with your dialogue to create your final comic!" />

      <div className="mt-6 rounded-3xl bg-gradient-to-br from-slate-50 to-cyan-50/30 border-2 border-slate-200 p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold font-display text-slate-800">{blueprint.storyIdea || 'My Comic'}</h3>
          <p className="text-sm text-slate-500 mt-1">by {blueprint.mainCharacter.name || 'Young Creator'}</p>
        </div>

        <div className="space-y-4">
          {panelData.map(({ key, label, panel, bpPanel }) => (
            <div key={key} className="rounded-2xl bg-white border-2 border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Tag color="bg-cyan-100 text-cyan-700">{label}</Tag>
                  <span className="text-xs text-slate-400">{panel.scene}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-0">
                <div className="relative">
                  {panel.generatedImage ? (
                    <img src={panel.generatedImage} alt={`Panel: ${label}`} className="w-full aspect-[4/3] object-cover" />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-slate-100 flex items-center justify-center">
                      <svg className="w-12 h-12 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5L5 21" /></svg>
                    </div>
                  )}
                  {panel.dialogue && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="relative bg-white rounded-2xl px-4 py-3 shadow-lg border-2 border-slate-200">
                        <div className="absolute -top-2 left-6 w-4 h-4 bg-white border-t-2 border-l-2 border-slate-200 transform rotate-45" />
                        <p className="text-sm font-bold text-slate-700">{panel.dialogue}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t md:border-t-0 md:border-l border-slate-200">
                  <p className="text-xs font-bold text-slate-500 mb-1">SPEECH BUBBLE</p>
                  {editingPanel === key ? (
                    <div className="space-y-2">
                      <textarea
                        className="textarea-field text-sm min-h-[50px]"
                        value={editDialogue}
                        onChange={(e) => setEditDialogue(e.target.value)}
                        placeholder="Type your character's dialogue..."
                      />
                      <button onClick={saveEdit} className="btn-primary text-xs px-3 py-1.5 w-full">Save</button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-slate-700 min-h-[40px]">{panel.dialogue || bpPanel.dialogue || 'No dialogue yet'}</p>
                      <button onClick={() => startEdit(key, panel.dialogue || bpPanel.dialogue || '')} className="text-xs text-cyan-600 font-bold hover:text-cyan-800">
                        Edit Speech Bubble
                      </button>
                    </div>
                  )}
                  {panel.promptVersions && panel.promptVersions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-500 mb-1">PROMPT VERSIONS</p>
                      <p className="text-xs text-slate-400">{panel.promptVersions.length} version(s) created</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TeacherTip
        say="Now the pictures and words work together to tell your story. You can edit the speech bubbles to match your original dialogue."
        ask="Does your comic tell the beginning, middle, and ending of your story?"
        lookFor="The student's comic shows a clear story flow across the three panels."
      />

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Comic Director Review" />
    </SectionShell>
  );
}

// ===================== Section 24: Comic Director Review =====================
interface ComicReviewProps {
  panels: { panel1: ComicPanel; panel2: ComicPanel; panel3: ComicPanel };
  blueprint: Blueprint;
  onPrev: () => void;
  onNext: () => void;
}

export function ComicDirectorReviewSection({ panels, blueprint, onPrev, onNext }: ComicReviewProps) {
  const checklistItems = [
    { label: 'Has my main character', check: !!blueprint.mainCharacter.name },
    { label: 'Includes my supporting characters', check: blueprint.supportingCharacters.some((c) => c.name) },
    { label: 'Shows the beginning', check: !!panels.panel1.generatedImage },
    { label: 'Shows the middle / adventure', check: !!panels.panel2.generatedImage },
    { label: 'Shows the ending', check: !!panels.panel3.generatedImage },
    { label: 'Shows clear actions', check: !!(panels.panel1.action || panels.panel2.action || panels.panel3.action) },
    { label: 'Includes important details', check: !!(panels.panel1.details || panels.panel2.details || panels.panel3.details) },
    { label: 'Includes dialogue', check: !!(panels.panel1.dialogue || panels.panel2.dialogue || panels.panel3.dialogue) },
    { label: 'Keeps important character details consistent', check: !!blueprint.mainCharacter.appearance },
    { label: 'Uses AI as a creative helper', check: true },
    { label: 'Still represents MY original idea', check: !!blueprint.storyIdea },
  ];

  const score = checklistItems.filter((i) => i.check).length;
  const total = checklistItems.length;

  return (
    <SectionShell
      title="Comic Director Review"
      subtitle="Let's check if your comic has everything it needs"
    >
      <ByteMascot expression="thinking" message="Before we finish, let's review your comic together. Check off each item to see how complete your comic is!" />

      <div className="mt-6 card">
        <div className="space-y-2">
          {checklistItems.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-xl border-2 p-3 transition-all ${
                item.check ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'
              }`}
            >
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-sm font-bold ${
                item.check ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
              }`}>
                {item.check ? '✓' : '○'}
              </span>
              <span className={`text-sm ${item.check ? 'text-slate-700' : 'text-slate-400'}`}>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-3 shadow-lg shadow-cyan-200">
            <span className="text-2xl font-bold font-display text-white">{score}/{total}</span>
            <span className="text-sm text-cyan-50">
              {score === total ? 'Perfect score! Your comic is complete!' : score >= 8 ? 'Almost there! Great work!' : 'Keep going — you\'re doing great!'}
            </span>
          </div>
        </div>
      </div>

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Practice Quiz" />
    </SectionShell>
  );
}

// ===================== Section 26: Mini Prompt Challenge =====================
interface MiniChallengeProps {
  challengePrompt: string;
  onChallengeChange: (prompt: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function MiniChallengeSection({ challengePrompt, onChallengeChange, onPrev, onNext }: MiniChallengeProps) {
  const [prompt, setPrompt] = useState(challengePrompt);
  const [checked, setChecked] = useState(false);

  const requirements = [
    { label: 'Character', test: /girl|boy|dog|cat|robot|astronaut|kid|child|hero|wizard|knight/i, hint: 'Who is in the scene?' },
    { label: 'Setting', test: /forest|cave|castle|space|school|city|garden|ocean|mountain|library|kingdom/i, hint: 'Where does it happen?' },
    { label: 'Action', test: /entering|walking|running|flying|exploring|opening|climbing|jumping|discovering/i, hint: 'What are they doing?' },
    { label: 'Important Detail', test: /glowing|magic|mysterious|shiny|colorful|ancient|hidden|sparkling/i, hint: 'What special detail is there?' },
    { label: 'Style', test: /cartoon|storybook|comic|illustration|painting|anime|realistic/i, hint: 'What should the picture look like?' },
  ];

  const results = requirements.map((r) => ({
    ...r,
    found: r.test.test(prompt),
  }));
  const foundCount = results.filter((r) => r.found).length;

  return (
    <SectionShell
      title="Mini Prompt Challenge"
      subtitle="Create an image prompt for a character entering a mysterious place"
    >
      <ByteMascot expression="excited" message="One small challenge before we finish! Create an image prompt for a character entering a mysterious place. Include character, setting, action, an important detail, and style!" />

      <div className="mt-6 card">
        <textarea
          className="textarea-field min-h-[100px]"
          value={prompt}
          placeholder="Create a colorful cartoon illustration of a young adventurer entering a mysterious glowing cave filled with ancient crystals..."
          onChange={(e) => {
            setPrompt(e.target.value);
            onChallengeChange(e.target.value);
            setChecked(false);
          }}
        />

        <button onClick={() => setChecked(true)} disabled={!prompt.trim()} className="btn-primary mt-3 w-full disabled:opacity-30">
          Check My Prompt
        </button>

        {checked && (
          <div className="mt-4 space-y-2 animate-slide-up">
            {results.map((r) => (
              <div
                key={r.label}
                className={`flex items-center gap-3 rounded-xl border-2 p-3 ${
                  r.found ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'
                }`}
              >
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-sm font-bold ${
                  r.found ? 'bg-emerald-500 text-white' : 'bg-amber-300 text-amber-800'
                }`}>
                  {r.found ? '✓' : '!'}
                </span>
                <div>
                  <p className={`text-sm font-bold ${r.found ? 'text-emerald-700' : 'text-amber-700'}`}>{r.label}</p>
                  <p className="text-xs text-slate-500">{r.found ? `Great! Found in your prompt.` : r.hint}</p>
                </div>
              </div>
            ))}

            <div className={`rounded-xl p-4 text-center ${foundCount === 5 ? 'bg-emerald-100' : 'bg-cyan-50'}`}>
              <p className={`font-bold ${foundCount === 5 ? 'text-emerald-700' : 'text-cyan-700'}`}>
                {foundCount === 5
                  ? 'Amazing! Your prompt includes all five elements!'
                  : `You included ${foundCount} of 5 elements. ${foundCount >= 3 ? 'Great work! Try adding the missing ones.' : 'Keep going — add more details!'}`}
              </p>
            </div>
          </div>
        )}
      </div>

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Reflection" />
    </SectionShell>
  );
}

// ===================== Section 27: Reflection =====================
interface ReflectionProps {
  answers: Record<number, string>;
  onAnswer: (questionId: number, answer: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function ReflectionSection({ answers, onAnswer, onPrev, onNext }: ReflectionProps) {
  const questions = [
    { id: 1, text: 'What did you change between your first prompt and your improved prompt?' },
    { id: 2, text: 'What did the AI get right?' },
    { id: 3, text: 'What did you need to fix?' },
    { id: 4, text: 'Why is it important to review an AI-generated image?' },
    { id: 5, text: 'Who is the creative director?' },
  ];

  const answeredCount = Object.keys(answers).length;

  return (
    <SectionShell
      title="Reflection"
      subtitle="Take a moment to think about what you learned today"
    >
      <ByteMascot expression="thinking" message="Let's reflect on what you learned today. Write short answers to these questions. There are no wrong answers — just your thoughts!" />

      <div className="mt-6 space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="card">
            <label className="label-field">{q.id}. {q.text}</label>
            <textarea
              className="textarea-field"
              value={answers[q.id] || ''}
              placeholder="Type your answer here..."
              onChange={(e) => onAnswer(q.id, e.target.value)}
            />
          </div>
        ))}
      </div>

      <NavButtons onPrev={onPrev} onNext={onNext} nextDisabled={answeredCount < 3} nextLabel="Complete Lesson" />
    </SectionShell>
  );
}

// ===================== Section 28-29: Completion + Next Lesson =====================
interface CompletionProps {
  studentName: string;
  onPrev: () => void;
  onRestart: () => void;
}

export function CompletionSection({ studentName, onPrev, onRestart }: CompletionProps) {
  return (
    <SectionShell>
      <div className="text-center py-8">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-xl shadow-cyan-300/40 animate-bounce-in mb-6">
          <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="M12 15l-3.5-3.5C9 11 10 10 11 10c1 0 2 1 3 1s2-1 3-1c1 0 2 1 2.5 1.5L12 15z" /><path d="M15 20h-6M18 20h-3M12 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" /></svg>
        </div>

        <h2 className="text-3xl font-bold font-display text-slate-800 mb-2">Your Comic Is Coming to Life!</h2>
        <p className="text-slate-500 mb-6">{studentName}, you did an amazing job today!</p>

        <ByteMascot expression="celebrate" size="lg" message="You planned it. You directed it. You gave AI instructions. You reviewed the results. You improved your ideas. YOU are the creative director!" />

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {[
            { label: 'Your Blueprint', icon: 'clipboard-list' },
            { label: 'Your Image Prompts', icon: 'message-square' },
            { label: 'Your Comic Images', icon: 'image' },
            { label: 'Your Comic', icon: 'newspaper' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4">
              <svg className="w-8 h-8 mx-auto text-emerald-600 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p className="text-sm font-bold text-emerald-700">{item.label}</p>
              <p className="text-xs text-emerald-500 mt-1">Complete!</p>
            </div>
          ))}
        </div>

        <div className="mt-8 max-w-md mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-amber-400 to-amber-500 p-1 shadow-xl shadow-amber-200">
            <div className="rounded-[20px] bg-white p-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="M12 15l-3.5-3.5C9 11 10 10 11 10c1 0 2 1 3 1s2-1 3-1c1 0 2 1 2.5 1.5L12 15z" /><path d="M18 20h-6M18 20h-3M12 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" /></svg>
              </div>
              <h3 className="font-bold text-lg font-display text-slate-800 text-center">AI Image Director</h3>
              <p className="text-sm text-slate-500 text-center mt-2">You learned how to use Generative AI to turn your comic ideas into visual scenes while staying in control of your creative decisions.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Next lesson preview */}
      <div className="mt-8 rounded-3xl bg-gradient-to-br from-violet-500 to-violet-700 p-6 text-white text-center">
        <p className="text-sm font-bold text-violet-200 uppercase tracking-wide mb-2">Next Lesson</p>
        <h3 className="text-2xl font-bold font-display mb-2">Make Your Comic Move</h3>
        <p className="text-violet-100 text-sm max-w-md mx-auto">Your comic is now a set of pictures. Next time, we'll explore how AI can help turn a picture into a moving scene!</p>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
        <button onClick={onPrev} className="btn-ghost">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          Back
        </button>
        <button onClick={onRestart} className="btn-secondary">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v6h6M3 13a9 9 0 1 0 3-7.7L3 8" /></svg>
          Start Over
        </button>
      </div>
    </SectionShell>
  );
}
