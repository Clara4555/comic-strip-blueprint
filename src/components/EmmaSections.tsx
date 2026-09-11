import { useState } from 'react';
import { emmaPanels, emmaCharacter } from '@/lib/emmaData';
import { ConceptCard, Pipeline, PromptHighlight, Tag } from './Cards';
import { ImageGenerationPanel } from './ImageGenerationPanel';
import { ByteMascot, TeacherTip, SectionShell, NavButtons } from './Common';

// ===================== Section 6: Emma Intro =====================
export function EmmaIntroSection({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <SectionShell
      title="Emma's Mini Comic"
      subtitle="Meet Emma — our teaching example"
      icon={
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-200">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z" /></svg>
        </div>
      }
    >
      <ByteMascot
        expression="excited"
        message="This is Emma! She's going to show us how to turn a comic blueprint into real images. Watch how she does it — then you'll do the same with YOUR comic!"
      />

      <div className="mt-6 card">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 1 0-16 0" /></svg>
          </div>
          <div>
            <h3 className="font-bold text-xl font-display text-slate-800">Emma and the Mystery Door</h3>
            <p className="text-sm text-slate-500">Emma discovers a glowing blue door in her school library...</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl bg-violet-50 border border-violet-100 p-3">
            <p className="text-xs font-bold text-violet-700 mb-1">CHARACTER</p>
            <p className="text-sm text-slate-700">{emmaCharacter.name} — {emmaCharacter.type}</p>
            <p className="text-xs text-slate-500 mt-1">{emmaCharacter.appearance}, {emmaCharacter.clothing}</p>
          </div>
          <div className="rounded-xl bg-violet-50 border border-violet-100 p-3">
            <p className="text-xs font-bold text-violet-700 mb-1">SUPPORTING CHARACTER</p>
            <p className="text-sm text-slate-700">Pip — a small friendly robot</p>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <span className="w-8 h-8 rounded-lg bg-cyan-500 text-white font-bold flex items-center justify-center text-sm">1</span>
            <div>
              <p className="text-sm font-bold text-slate-700">Beginning</p>
              <p className="text-xs text-slate-500">Emma discovers a glowing blue door in her school library</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <span className="w-8 h-8 rounded-lg bg-cyan-500 text-white font-bold flex items-center justify-center text-sm">2</span>
            <div>
              <p className="text-sm font-bold text-slate-700">Adventure</p>
              <p className="text-xs text-slate-500">Emma and Pip enter a colorful floating garden</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <span className="w-8 h-8 rounded-lg bg-cyan-500 text-white font-bold flex items-center justify-center text-sm">3</span>
            <div>
              <p className="text-sm font-bold text-slate-700">Ending</p>
              <p className="text-xs text-slate-500">Emma returns to the library with a tiny glowing flower</p>
            </div>
          </div>
        </div>
      </div>

      <TeacherTip
        say="Emma is our example character. We're going to watch how her blueprint becomes image prompts."
        ask="How is Emma's story similar to your own comic blueprint?"
        lookFor="The student recognizes that Emma has a beginning, middle, and ending — just like their blueprint."
      />

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="See Emma's Prompt" />
    </SectionShell>
  );
}

// ===================== Section 7: Emma Character Prompt =====================
export function EmmaCharacterPromptSection({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    { label: 'Who is Emma?', value: 'Emma is a curious young girl' },
    { label: 'What does she look like?', value: 'with curly brown hair and round glasses' },
    { label: 'What is she wearing?', value: 'wearing a purple hoodie and carrying a small yellow backpack' },
    { label: 'What feeling?', value: 'She looks excited and ready for an adventure' },
    { label: 'What visual style?', value: 'Colorful storybook cartoon illustration' },
  ];

  return (
    <SectionShell
      title="Building Emma's Character Prompt"
      subtitle="Before we create a scene, we need to describe Emma"
    >
      <ByteMascot expression="thinking" message="Before we create Emma's scene, we need to describe Emma. Let's build the prompt step by step!" />

      <div className="mt-6 space-y-3">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`rounded-2xl border-2 p-4 transition-all ${
              step >= i ? 'border-cyan-300 bg-cyan-50/50' : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                step > i ? 'bg-emerald-500 text-white' : step === i ? 'bg-cyan-500 text-white' : 'bg-slate-200 text-slate-400'
              }`}>
                {step > i ? '✓' : i + 1}
              </span>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{s.label}</p>
                <p className="text-sm text-slate-700 mt-0.5">{s.value}</p>
              </div>
              {step === i && (
                <button onClick={() => setStep(i + 1)} className="btn-secondary text-xs px-3 py-1.5">
                  Next Step
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {step >= steps.length && (
        <div className="mt-6 animate-bounce-in">
          <div className="flex items-center gap-2 mb-2">
            <Tag color="bg-cyan-500 text-white">Final Emma Character Prompt</Tag>
          </div>
          <PromptHighlight
            prompt="Create a colorful storybook cartoon illustration of Emma, a curious young girl with curly brown hair and round glasses, wearing a purple hoodie and carrying a small yellow backpack. She looks excited and ready for an adventure. Keep her appearance friendly, expressive, and consistent."
            highlights={[
              { text: 'curly brown hair and round glasses', color: 'bg-emerald-200 text-emerald-800' },
              { text: 'purple hoodie', color: 'bg-violet-200 text-violet-800' },
              { text: 'yellow backpack', color: 'bg-amber-200 text-amber-800' },
              { text: 'consistent', color: 'bg-cyan-200 text-cyan-800' },
            ]}
          />
        </div>
      )}

      <TeacherTip
        say="Notice how we built this prompt piece by piece — who she is, what she looks like, what she wears, her feeling, and the style."
        ask="Which part of the prompt tells the AI to keep Emma looking the same in every picture?"
        lookFor="The word 'consistent' — it reminds the AI to keep Emma's appearance the same."
      />

      <NavButtons onPrev={onPrev} onNext={onNext} nextDisabled={step < steps.length} nextLabel="Emma's First Scene" />
    </SectionShell>
  );
}

// ===================== Section 8-9: Emma Scene + Before/After =====================
export function EmmaSceneSection({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  const [showVague, setShowVague] = useState(true);
  const [selectedAdds, setSelectedAdds] = useState<string[]>([]);
  const addOptions = ['Character details', 'Setting', 'Action', 'Important details', 'Style'];

  const toggleAdd = (opt: string) => {
    setSelectedAdds((prev) => (prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]));
  };

  return (
    <SectionShell
      title="Emma's First Scene"
      subtitle="From blueprint details to a clear image prompt"
    >
      <div className="card mb-4">
        <h4 className="font-bold text-slate-700 mb-3">Blueprint Information</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="rounded-xl bg-cyan-50 p-3">
            <p className="text-xs font-bold text-cyan-700">CHARACTER</p>
            <p className="text-sm text-slate-700 mt-1">Emma</p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3">
            <p className="text-xs font-bold text-emerald-700">SETTING</p>
            <p className="text-sm text-slate-700 mt-1">School library</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-3">
            <p className="text-xs font-bold text-amber-700">ACTION</p>
            <p className="text-sm text-slate-700 mt-1">Discovering a glowing blue door</p>
          </div>
          <div className="rounded-xl bg-rose-50 p-3">
            <p className="text-xs font-bold text-rose-700">EMOTION</p>
            <p className="text-sm text-slate-700 mt-1">Curious and surprised</p>
          </div>
          <div className="rounded-xl bg-violet-50 p-3">
            <p className="text-xs font-bold text-violet-700">DETAILS</p>
            <p className="text-sm text-slate-700 mt-1">Bookshelves, books, glowing blue light</p>
          </div>
          <div className="rounded-xl bg-slate-100 p-3">
            <p className="text-xs font-bold text-slate-600">STYLE</p>
            <p className="text-sm text-slate-700 mt-1">Colorful storybook cartoon</p>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <h4 className="font-bold text-slate-700 mb-2">From Blueprint to Prompt</h4>
        <p className="text-sm text-slate-500 mb-3">Notice that we didn't just say "draw Emma." We described who she is, where she is, what she is doing, and what should be visible.</p>
        <PromptHighlight
          prompt="Create a colorful storybook cartoon illustration of Emma, a curious young girl with curly brown hair, round glasses, a purple hoodie, and a small yellow backpack, standing inside a school library. Emma is looking at a mysterious glowing blue door between two tall bookshelves. Blue light shines around the doorway, and Emma looks surprised and curious. Keep Emma's appearance consistent and make the scene feel magical and adventurous."
          highlights={[
            { text: 'curly brown hair, round glasses, a purple hoodie, and a small yellow backpack', color: 'bg-emerald-200 text-emerald-800' },
            { text: 'standing inside a school library', color: 'bg-emerald-200 text-emerald-800' },
            { text: 'looking at a mysterious glowing blue door', color: 'bg-amber-200 text-amber-800' },
            { text: 'Bookshelves, books, glowing blue light', color: 'bg-violet-200 text-violet-800' },
            { text: 'Colorful storybook cartoon', color: 'bg-cyan-200 text-cyan-800' },
          ]}
        />
      </div>

      <div className="card">
        <h4 className="font-bold text-slate-700 mb-3">What Did We Add?</h4>
        <p className="text-sm text-slate-500 mb-3">Compare the two prompts. What did the better prompt include?</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className={`rounded-2xl border-2 p-4 cursor-pointer transition-all ${showVague ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white'}`} onClick={() => setShowVague(true)}>
            <span className="tag bg-rose-100 text-rose-700 mb-2">Too Vague</span>
            <p className="text-sm text-slate-600 mt-2 font-mono leading-relaxed">"Draw Emma in a library."</p>
          </div>
          <div className={`rounded-2xl border-2 p-4 cursor-pointer transition-all ${!showVague ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white'}`} onClick={() => setShowVague(false)}>
            <span className="tag bg-emerald-100 text-emerald-700 mb-2">Better</span>
            <p className="text-sm text-slate-600 mt-2 font-mono leading-relaxed">"Create a colorful storybook cartoon illustration of Emma, a curious young girl with curly brown hair, round glasses, a purple hoodie, and a yellow backpack, standing in a school library and looking at a glowing blue door between bookshelves."</p>
          </div>
        </div>

        <p className="text-sm font-bold text-slate-700 mb-2">Select what the better prompt added:</p>
        <div className="flex flex-wrap gap-2">
          {addOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => toggleAdd(opt)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                selectedAdds.includes(opt)
                  ? 'border-cyan-400 bg-cyan-50 text-cyan-700'
                  : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'
              }`}
            >
              {selectedAdds.includes(opt) ? '✓ ' : ''}{opt}
            </button>
          ))}
        </div>
        {selectedAdds.length > 0 && (
          <div className="mt-3 rounded-xl bg-cyan-50 border border-cyan-200 p-3 text-sm text-cyan-800 animate-slide-up">
            {selectedAdds.length === 5
              ? "Excellent! You found all five! The better prompt included character details, setting, action, important details, and style. More useful information = more control!"
              : `Great start! You found ${selectedAdds.length} of 5. The better prompt included all of these: character details, setting, action, important details, and style.`}
          </div>
        )}
      </div>

      <TeacherTip
        say="The goal is not to make the prompt as long as possible. The goal is to include the details that matter."
        ask="Can you think of a detail that would NOT be useful to add?"
        lookFor="The student understands that irrelevant details don't help — only useful visual information matters."
      />

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Generate, Review, Improve" />
    </SectionShell>
  );
}

// ===================== Section 10: Generate → Review → Improve =====================
export function EmmaReviewImproveSection({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <SectionShell
      title="Generate → Review → Improve"
      subtitle="AI image creation is not always perfect on the first try"
    >
      <ByteMascot expression="thinking" message="Sometimes the AI may leave something out. That doesn't mean your idea is bad — it means you can improve your instructions!" />

      <div className="mt-6">
        <Pipeline
          steps={[
            { label: 'Generate', description: 'Create an image' },
            { label: 'Look', description: 'See the result' },
            { label: 'Compare', description: 'Check against your idea' },
            { label: 'Fix', description: 'Improve the prompt' },
            { label: 'Generate Again', description: 'Try once more' },
          ]}
        />
      </div>

      <div className="card mt-4">
        <h4 className="font-bold text-slate-700 mb-3">Emma's Example: Something Is Missing</h4>
        <div className="rounded-xl bg-rose-50 border-2 border-rose-200 p-4 mb-3">
          <p className="text-xs font-bold text-rose-700 mb-1">PROBLEM DETECTED</p>
          <p className="text-sm text-slate-700">{emmaPanels[0].issue}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="tag bg-slate-200 text-slate-600 mb-2">Original Prompt</span>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 font-mono leading-relaxed">
              {emmaPanels[0].prompt}
            </div>
          </div>
          <div>
            <span className="tag bg-emerald-100 text-emerald-700 mb-2">Improved Prompt</span>
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-slate-600 font-mono leading-relaxed">
              {emmaPanels[0].improvedPrompt}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-cyan-50 border border-cyan-200 p-4">
          <p className="text-sm text-slate-700">
            <span className="font-bold">We didn't throw away the whole idea.</span> We found what was missing and improved the instruction.
          </p>
        </div>
      </div>

      <TeacherTip
        say="We didn't start over. We found what was missing and fixed just that part."
        ask="What would you do if Emma's glasses were missing instead of her hoodie?"
        lookFor="The student suggests adding 'round glasses' more clearly to the prompt."
      />

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Character Consistency" />
    </SectionShell>
  );
}

// ===================== Section 11: Character Consistency =====================
export function CharacterConsistencySection({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  const emmaDetails = ['Curly brown hair', 'Round glasses', 'Purple hoodie', 'Yellow backpack'];

  return (
    <SectionShell
      title="Keeping Your Character Consistent"
      subtitle="How do we keep our character looking like the same character?"
    >
      <ByteMascot expression="thinking" message="If Emma has curly brown hair in one picture, but straight blonde hair in the next, she might look like a different character. Let's learn how to keep her consistent!" />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((panelNum) => (
          <div key={panelNum} className="rounded-2xl border-2 border-cyan-200 bg-gradient-to-br from-cyan-50/50 to-violet-50/30 p-4">
            <p className="text-xs font-bold text-cyan-700 mb-2">PANEL {panelNum}</p>
            <div className="w-full aspect-square rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-3">
              <svg className="w-12 h-12 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 1 0-16 0" /></svg>
            </div>
            <ul className="space-y-1">
              {emmaDetails.map((d) => (
                <li key={d} className="flex items-center gap-2 text-xs text-slate-600">
                  <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-amber-50 border-2 border-amber-200 p-4">
        <p className="text-sm text-amber-900">
          <span className="font-bold">Important:</span> The story and action can change, but important character details should stay consistent. AI tools can still make mistakes, so we review each picture.
        </p>
      </div>

      <TeacherTip
        say="Consistency means the same hair, glasses, clothing, and colors across every panel."
        ask="What details about YOUR character should stay the same in every picture?"
        lookFor="The student identifies their own character's fixed visual details."
      />

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Emma's Three Panels" />
    </SectionShell>
  );
}

// ===================== Section 12: Emma Three Panels =====================
export function EmmaThreePanelsSection({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  const [activePanel, setActivePanel] = useState(0);

  return (
    <SectionShell
      title="Emma's Three-Panel Demo"
      subtitle="Watch how Emma's blueprint becomes three visual scenes"
    >
      <div className="flex gap-2 mb-4">
        {emmaPanels.map((p, i) => (
          <button
            key={i}
            onClick={() => setActivePanel(i)}
            className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
              activePanel === i
                ? 'bg-cyan-500 text-white shadow-md'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="card animate-slide-up" key={activePanel}>
        <h4 className="font-bold text-lg font-display text-slate-800 mb-1">{emmaPanels[activePanel].title}</h4>
        <p className="text-sm text-slate-500 mb-4">{emmaPanels[activePanel].dialogue}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
          <div className="rounded-lg bg-cyan-50 p-2">
            <p className="text-xs font-bold text-cyan-700">CHARACTER</p>
            <p className="text-xs text-slate-600 mt-0.5">{emmaPanels[activePanel].character}</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-2">
            <p className="text-xs font-bold text-emerald-700">SETTING</p>
            <p className="text-xs text-slate-600 mt-0.5">{emmaPanels[activePanel].setting}</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-2">
            <p className="text-xs font-bold text-amber-700">ACTION</p>
            <p className="text-xs text-slate-600 mt-0.5">{emmaPanels[activePanel].action}</p>
          </div>
          <div className="rounded-lg bg-rose-50 p-2">
            <p className="text-xs font-bold text-rose-700">EMOTION</p>
            <p className="text-xs text-slate-600 mt-0.5">{emmaPanels[activePanel].emotion}</p>
          </div>
          <div className="rounded-lg bg-violet-50 p-2">
            <p className="text-xs font-bold text-violet-700">DETAILS</p>
            <p className="text-xs text-slate-600 mt-0.5">{emmaPanels[activePanel].details}</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-2">
            <p className="text-xs font-bold text-slate-600">STYLE</p>
            <p className="text-xs text-slate-600 mt-0.5">{emmaPanels[activePanel].style}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Blueprint</span>
          <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          <span className="text-xs font-bold text-slate-500 uppercase">Image Details</span>
          <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          <span className="text-xs font-bold text-slate-500 uppercase">Final Prompt</span>
        </div>

        <PromptHighlight
          prompt={emmaPanels[activePanel].prompt}
          highlights={[
            { text: emmaPanels[activePanel].character.split('—')[1]?.trim() || 'Emma', color: 'bg-cyan-200 text-cyan-800' },
          ]}
        />
      </div>

      {activePanel < emmaPanels.length - 1 && (
        <button onClick={() => setActivePanel(activePanel + 1)} className="btn-secondary mt-4 w-full">
          Next Panel
        </button>
      )}

      <TeacherTip
        say="Each panel shows the same process: blueprint details become image details, which become the final prompt."
        ask="What stayed the same across all three panels?"
        lookFor="Emma's character description — curly brown hair, round glasses, purple hoodie, yellow backpack."
      />

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Your Turn!" />
    </SectionShell>
  );
}
