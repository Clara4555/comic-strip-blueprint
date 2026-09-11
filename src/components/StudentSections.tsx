import { useState } from 'react';
import type { Blueprint, ComicPanel, SmartPrompt, PanelReview, CharacterProfile } from '@/types/lesson';
import { ByteMascot, SectionShell, NavButtons, TeacherTip } from './Common';
import { BlueprintField, Tag, PromptHighlight } from './Cards';
import { SmartPromptBuilder } from './SmartPromptBuilder';
import { ImageGenerationPanel } from './ImageGenerationPanel';
import { ImageReviewPanel } from './ImageReviewPanel';
import { buildCharacterDescription, buildSmartPrompt, emptySmartPrompt } from '@/lib/blueprintData';
import { emmaPanels, emmaCharacter } from '@/lib/emmaData';

// ===================== Emma Guide Sidebar (persistent) =====================
function EmmaGuide({ panelNumber, phase }: { panelNumber: number; phase: string }) {
  const emmaPanel = emmaPanels[panelNumber - 1];
  if (!emmaPanel) return null;

  return (
    <div className="lg:sticky lg:top-20 space-y-3">
      <div className="rounded-2xl border-2 border-violet-200 bg-violet-50/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-violet-700">EMMA'S GUIDE</p>
            <p className="text-xs text-violet-500">Panel {panelNumber} — {emmaPanel.title}</p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="rounded-lg bg-white/60 p-2">
            <p className="font-bold text-slate-600">Character</p>
            <p className="text-slate-500 mt-0.5">{emmaPanel.character}</p>
          </div>
          <div className="rounded-lg bg-white/60 p-2">
            <p className="font-bold text-slate-600">Setting</p>
            <p className="text-slate-500 mt-0.5">{emmaPanel.setting}</p>
          </div>
          <div className="rounded-lg bg-white/60 p-2">
            <p className="font-bold text-slate-600">Action</p>
            <p className="text-slate-500 mt-0.5">{emmaPanel.action}</p>
          </div>
          <div className="rounded-lg bg-white/60 p-2">
            <p className="font-bold text-slate-600">Emotion</p>
            <p className="text-slate-500 mt-0.5">{emmaPanel.emotion}</p>
          </div>
          <div className="rounded-lg bg-white/60 p-2">
            <p className="font-bold text-slate-600">Details</p>
            <p className="text-slate-500 mt-0.5">{emmaPanel.details}</p>
          </div>
          <div className="rounded-lg bg-white/60 p-2">
            <p className="font-bold text-slate-600">Style</p>
            <p className="text-slate-500 mt-0.5">{emmaPanel.style}</p>
          </div>
        </div>

        <div className="mt-3 rounded-lg bg-violet-100 border border-violet-200 p-3">
          <p className="text-xs font-bold text-violet-700 mb-1">EMMA'S PROMPT</p>
          <p className="text-xs text-slate-600 font-mono leading-relaxed">{emmaPanel.prompt}</p>
        </div>

        {phase === 'review' || phase === 'improve' ? (
          <div className="mt-3 rounded-lg bg-amber-100 border border-amber-200 p-3">
            <p className="text-xs font-bold text-amber-700 mb-1">EMMA'S REVIEW ISSUE</p>
            <p className="text-xs text-slate-600">{emmaPanel.issue}</p>
            <p className="text-xs font-bold text-amber-700 mt-2 mb-1">EMMA'S FIX</p>
            <p className="text-xs text-slate-600 font-mono leading-relaxed">{emmaPanel.improvedPrompt}</p>
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-cyan-200 bg-cyan-50/50 p-3">
        <p className="text-xs font-bold text-cyan-700 mb-1">EMMA'S CHARACTER</p>
        <p className="text-xs text-slate-600">{emmaCharacter.name} — {emmaCharacter.type}</p>
        <p className="text-xs text-slate-500 mt-1">{emmaCharacter.appearance}, {emmaCharacter.clothing}</p>
      </div>
    </div>
  );
}

// ===================== Section 13: Student's Turn (with story idea input) =====================
export function StudentTurnSection({
  blueprint,
  onBlueprintChange,
  onPrev,
  onNext,
}: {
  blueprint: Blueprint;
  onBlueprintChange: (bp: Blueprint) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [storyIdea, setStoryIdea] = useState(blueprint.storyIdea || '');
  const [mainCharName, setMainCharName] = useState(blueprint.mainCharacter.name || '');
  const [mainCharType, setMainCharType] = useState(blueprint.mainCharacter.type || '');
  const [supp1Name, setSupp1Name] = useState(blueprint.supportingCharacters[0]?.name || '');
  const [supp1Type, setSupp1Type] = useState(blueprint.supportingCharacters[0]?.type || '');
  const [supp2Name, setSupp2Name] = useState(blueprint.supportingCharacters[1]?.name || '');
  const [supp2Type, setSupp2Type] = useState(blueprint.supportingCharacters[1]?.type || '');

  const saveBlueprint = () => {
    onBlueprintChange({
      ...blueprint,
      storyIdea,
      mainCharacter: { ...blueprint.mainCharacter, name: mainCharName, type: mainCharType },
      supportingCharacters: [
        { ...blueprint.supportingCharacters[0], name: supp1Name, type: supp1Type },
        { ...blueprint.supportingCharacters[1], name: supp2Name, type: supp2Type },
      ],
    });
  };

  return (
    <SectionShell
      title="Your Turn: Open Your Comic"
      subtitle="Let's set up your story so you know exactly what you're creating"
    >
      <ByteMascot
        expression="excited"
        message="You've seen how Emma's blueprint became image instructions. Now it's your turn! First, let's make sure your story idea and characters are ready. This is YOUR comic — we're bringing YOUR ideas to life!"
      />

      {/* Story idea section */}
      <div className="mt-6 card">
        <h4 className="font-bold text-slate-700 mb-2">Your Story Idea</h4>
        <p className="text-sm text-slate-500 mb-3">What is your comic about? Write a short description of your story so you always know what you're creating.</p>
        <textarea
          className="textarea-field min-h-[80px]"
          value={storyIdea}
          placeholder="Example: A young explorer discovers a hidden cave behind their school that leads to an underground world full of glowing crystals..."
          onChange={(e) => setStoryIdea(e.target.value)}
          onBlur={saveBlueprint}
        />

        <div className="mt-3 rounded-xl bg-violet-50 border border-violet-100 p-3">
          <p className="text-xs font-bold text-violet-700 mb-1">EMMA'S STORY (for reference)</p>
          <p className="text-xs text-slate-600">Emma discovers a glowing blue door in her school library, enters a colorful floating garden with a robot friend, and returns with a tiny glowing flower.</p>
        </div>
      </div>

      {/* Character quick-setup */}
      <div className="mt-4 card">
        <h4 className="font-bold text-slate-700 mb-2">Your Characters</h4>
        <p className="text-sm text-slate-500 mb-3">Make sure your characters have names and types. You can add more details in the next step.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl bg-violet-50 p-3 space-y-2">
            <p className="text-xs font-bold text-violet-700">MAIN CHARACTER</p>
            <input className="input-field text-sm" value={mainCharName} placeholder="Character name" onChange={(e) => setMainCharName(e.target.value)} onBlur={saveBlueprint} />
            <input className="input-field text-sm" value={mainCharType} placeholder="Character type (e.g., brave young explorer)" onChange={(e) => setMainCharType(e.target.value)} onBlur={saveBlueprint} />
          </div>
          <div className="rounded-xl bg-emerald-50 p-3 space-y-2">
            <p className="text-xs font-bold text-emerald-700">SUPPORTING CHARACTER 1</p>
            <input className="input-field text-sm" value={supp1Name} placeholder="Character name" onChange={(e) => setSupp1Name(e.target.value)} onBlur={saveBlueprint} />
            <input className="input-field text-sm" value={supp1Type} placeholder="Character type" onChange={(e) => setSupp1Type(e.target.value)} onBlur={saveBlueprint} />
          </div>
        </div>
        <div className="mt-3 rounded-xl bg-amber-50 p-3 space-y-2">
          <p className="text-xs font-bold text-amber-700">SUPPORTING CHARACTER 2</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input className="input-field text-sm" value={supp2Name} placeholder="Character name" onChange={(e) => setSupp2Name(e.target.value)} onBlur={saveBlueprint} />
            <input className="input-field text-sm" value={supp2Type} placeholder="Character type" onChange={(e) => setSupp2Type(e.target.value)} onBlur={saveBlueprint} />
          </div>
        </div>
      </div>

      {/* Scene overview */}
      <div className="mt-4 card">
        <h4 className="font-bold text-slate-700 mb-3">Your Scenes (3 Panels)</h4>
        <div className="space-y-2">
          {[1, 2, 3].map((n) => {
            const panel = blueprint.panels[`panel${n}` as keyof typeof blueprint.panels];
            return (
              <div key={n} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <span className="w-8 h-8 rounded-lg bg-cyan-500 text-white font-bold flex items-center justify-center text-sm flex-shrink-0">{n}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-700">{panel.scene}</p>
                  <p className="text-xs text-slate-500">{panel.action || 'Action not described yet — you\'ll fill this in when building each panel'}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 rounded-xl bg-violet-50 border border-violet-100 p-3">
          <p className="text-xs font-bold text-violet-700 mb-1">EMMA'S 3 PANELS (for reference)</p>
          <div className="space-y-1 text-xs text-slate-600">
            <p><span className="font-bold">Panel 1 — Beginning:</span> Emma discovers a glowing blue door</p>
            <p><span className="font-bold">Panel 2 — Adventure:</span> Emma and Pip enter a floating garden</p>
            <p><span className="font-bold">Panel 3 — Ending:</span> Emma returns with a glowing flower</p>
          </div>
        </div>
      </div>

      <button onClick={() => { saveBlueprint(); onNext(); }} className="btn-primary mt-6 w-full text-lg py-4">
        I'm Ready — Prepare My Character
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </button>

      <NavButtons onPrev={onPrev} onNext={() => {}} nextDisabled nextLabel="" />
    </SectionShell>
  );
}

// ===================== Section 14: Character Preparation (saves to blueprint) =====================
export function CharacterPrepSection({
  blueprint,
  onBlueprintChange,
  onCharacterDescriptionChange,
  onPrev,
  onNext,
}: {
  blueprint: Blueprint;
  onBlueprintChange: (bp: Blueprint) => void;
  onCharacterDescriptionChange: (desc: string) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const char = blueprint.mainCharacter;
  const masterDescription = buildCharacterDescription(char);

  const updateChar = (field: keyof CharacterProfile, value: string) => {
    const updated = { ...char, [field]: value };
    onBlueprintChange({ ...blueprint, mainCharacter: updated });
    onCharacterDescriptionChange(buildCharacterDescription(updated));
  };

  return (
    <SectionShell
      title="Character Preparation"
      subtitle="These details help us describe your character consistently in every panel"
    >
      <ByteMascot expression="thinking" message="Before we create your first scene, let's prepare your main character. Just like Emma has curly brown hair, round glasses, a purple hoodie, and a yellow backpack in every picture — your character needs fixed details too. These will stay the same in all three panels!" />

      {/* Emma reference card */}
      <div className="mt-6 rounded-2xl border-2 border-violet-200 bg-violet-50/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z" /></svg>
          </div>
          <p className="text-sm font-bold text-violet-700">EMMA'S CHARACTER (as your guide)</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="rounded-lg bg-white/60 p-2 text-xs">
            <p className="font-bold text-slate-600">Appearance</p>
            <p className="text-slate-500">{emmaCharacter.appearance}</p>
          </div>
          <div className="rounded-lg bg-white/60 p-2 text-xs">
            <p className="font-bold text-slate-600">Clothing</p>
            <p className="text-slate-500">{emmaCharacter.clothing}</p>
          </div>
          <div className="rounded-lg bg-white/60 p-2 text-xs">
            <p className="font-bold text-slate-600">Personality</p>
            <p className="text-slate-500">{emmaCharacter.personality}</p>
          </div>
          <div className="rounded-lg bg-white/60 p-2 text-xs">
            <p className="font-bold text-slate-600">Specialty</p>
            <p className="text-slate-500">{emmaCharacter.specialty}</p>
          </div>
        </div>
      </div>

      {/* Student character fields */}
      <div className="mt-4 card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 1 0-16 0" /></svg>
          </div>
          <div>
            <h3 className="font-bold text-lg font-display text-slate-800">{char.name || 'Your Main Character'}</h3>
            <p className="text-sm text-slate-500">{char.type || 'Character type not set'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <BlueprintField label="Name" value={char.name} editable onChange={(v) => updateChar('name', v)} />
          <BlueprintField label="Type" value={char.type} editable onChange={(v) => updateChar('type', v)} />
          <BlueprintField label="Appearance" value={char.appearance} type="textarea" editable onChange={(v) => updateChar('appearance', v)} />
          <BlueprintField label="Personality" value={char.personality} type="textarea" editable onChange={(v) => updateChar('personality', v)} />
          <BlueprintField label="Specialty / Ability" value={char.specialty} editable onChange={(v) => updateChar('specialty', v)} />
          <BlueprintField label="Clothing" value={char.clothing} editable onChange={(v) => updateChar('clothing', v)} />
        </div>
        <div className="mt-3">
          <BlueprintField label="Important Visual Details" value={char.importantVisualDetails} type="textarea" editable onChange={(v) => updateChar('importantVisualDetails', v)} />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-violet-50/30 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Tag color="bg-cyan-500 text-white">Character Master Description</Tag>
          <span className="text-xs text-slate-400">This will be auto-filled into every panel prompt</span>
        </div>
        <div className="rounded-xl bg-white border border-cyan-200 p-4 text-sm text-slate-700 leading-relaxed min-h-[60px]">
          {masterDescription || <span className="text-slate-400 italic">Fill in your character details above to build the master description...</span>}
        </div>
      </div>

      <TeacherTip
        say="This master description will be reused in every panel prompt to keep the character consistent — just like Emma always has curly brown hair, round glasses, a purple hoodie, and a yellow backpack."
        ask="Which details about your character should NEVER change between panels?"
        lookFor="The student identifies permanent visual traits like hair, clothing, and accessories."
      />

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Build Panel 1" />
    </SectionShell>
  );
}

// ===================== Section 15-16: Panel Builder (with Emma guide) =====================
interface PanelBuilderProps {
  panelNumber: 1 | 2 | 3;
  blueprint: Blueprint;
  panel: ComicPanel;
  onPanelChange: (panel: ComicPanel) => void;
  characterDescription: string;
  onPrev: () => void;
  onNext: () => void;
  completedPanels: number[];
}

export function PanelBuilderSection({
  panelNumber,
  blueprint,
  panel,
  onPanelChange,
  characterDescription,
  onPrev,
  onNext,
  completedPanels,
}: PanelBuilderProps) {
  const [phase, setPhase] = useState<'details' | 'smart' | 'generate' | 'review' | 'improve'>('details');
  const [smartPrompt, setSmartPrompt] = useState<SmartPrompt>(emptySmartPrompt());

  const emmaPanel = emmaPanels[panelNumber - 1];
  const bpPanel = blueprint.panels[`panel${panelNumber}` as keyof typeof blueprint.panels];

  const updatePanel = (field: keyof ComicPanel, value: string) => {
    onPanelChange({ ...panel, [field]: value });
  };

  const handleSmartChange = (sp: SmartPrompt) => {
    setSmartPrompt(sp);
    const full = buildSmartPrompt(sp);
    updatePanel('imagePrompt', full);
  };

  const handleImageSaved = (imageData: string) => {
    const versions = [...(panel.promptVersions || [])];
    if (panel.imagePrompt && !versions.find((v) => v.prompt === panel.imagePrompt)) {
      versions.push({ version: versions.length + 1, prompt: panel.imagePrompt, label: versions.length === 0 ? 'Original' : 'Improved' });
    }
    onPanelChange({ ...panel, generatedImage: imageData, promptVersions: versions, status: 'generated' });
    setPhase('review');
  };

  const handleReviewChange = (review: PanelReview) => {
    onPanelChange({ ...panel, review, status: 'reviewed' });
  };

  const handleImprove = () => {
    const versions = [...(panel.promptVersions || [])];
    if (panel.imagePrompt && !versions.find((v) => v.prompt === panel.imagePrompt)) {
      versions.push({ version: versions.length + 1, prompt: panel.imagePrompt, label: 'Improved' });
    }
    onPanelChange({ ...panel, improvements: panel.improvements || 'Saved', promptVersions: versions, status: 'complete' });
    onNext();
  };

  const phases = ['details', 'smart', 'generate', 'review', 'improve'] as const;
  const phaseLabels = ['Scene Details', 'SMART Prompt', 'Generate', 'Review', 'Improve'];

  return (
    <SectionShell
      title={`Panel ${panelNumber}: ${bpPanel.scene}`}
      subtitle="We're going one panel at a time so we can get each scene right. Emma's example is always on the right to guide you!"
    >
      {/* Progress indicator */}
      <div className="flex items-center gap-1 mb-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-1">
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
              completedPanels.includes(n) ? 'bg-emerald-500 text-white' :
              n === panelNumber ? 'bg-cyan-500 text-white shadow-md' :
              'bg-slate-200 text-slate-400'
            }`}>
              {completedPanels.includes(n) ? '✓' : n}
            </span>
            {n < 3 && <div className="w-4 h-0.5 bg-slate-200" />}
          </div>
        ))}
      </div>

      {/* Split layout: student work + Emma guide */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        {/* Left: Student workspace */}
        <div className="space-y-4">
          {/* Phase tabs */}
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
            {phases.map((p, i) => (
              <button
                key={p}
                onClick={() => setPhase(p)}
                className={`flex-1 rounded-lg px-2 py-2 text-xs font-bold transition-all ${
                  phase === p ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {phaseLabels[i]}
              </button>
            ))}
          </div>

          {/* Phase: Details — with always-visible Emma comparison */}
          {phase === 'details' && (
            <div className="card animate-slide-up">
              <h4 className="font-bold text-slate-700 mb-1">Scene Details from Your Blueprint</h4>
              <p className="text-sm text-slate-500 mb-3">Review and edit the details for this panel. Look at Emma's example on the right to see what kinds of details she used!</p>

              {/* Emma vs Student comparison — always visible */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                <div className="rounded-xl bg-violet-50 border border-violet-100 p-3">
                  <p className="text-xs font-bold text-violet-700 mb-2">EMMA'S PANEL {panelNumber}</p>
                  <div className="space-y-1 text-xs text-slate-600">
                    <p><span className="font-bold">Character:</span> {emmaPanel.character}</p>
                    <p><span className="font-bold">Setting:</span> {emmaPanel.setting}</p>
                    <p><span className="font-bold">Action:</span> {emmaPanel.action}</p>
                    <p><span className="font-bold">Emotion:</span> {emmaPanel.emotion}</p>
                    <p><span className="font-bold">Details:</span> {emmaPanel.details}</p>
                    <p><span className="font-bold">Style:</span> {emmaPanel.style}</p>
                  </div>
                </div>
                <div className="rounded-xl bg-cyan-50 border border-cyan-100 p-3">
                  <p className="text-xs font-bold text-cyan-700 mb-2">YOUR PANEL {panelNumber}</p>
                  <div className="space-y-1 text-xs text-slate-600">
                    <p><span className="font-bold">Character:</span> {panel.characters || '— fill in below —'}</p>
                    <p><span className="font-bold">Setting:</span> {panel.background || '— fill in below —'}</p>
                    <p><span className="font-bold">Action:</span> {panel.action || '— fill in below —'}</p>
                    <p><span className="font-bold">Emotion:</span> {panel.emotion || '— fill in below —'}</p>
                    <p><span className="font-bold">Details:</span> {panel.details || '— fill in below —'}</p>
                    <p><span className="font-bold">Style:</span> {panel.style || '— fill in below —'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="label-field">Character — Who is in the scene?</label>
                  <input className="input-field" value={panel.characters} placeholder={characterDescription || 'Who appears in this scene?'} onChange={(e) => updatePanel('characters', e.target.value)} />
                </div>
                <div>
                  <label className="label-field">Setting — Where are they?</label>
                  <input className="input-field" value={panel.background} placeholder={bpPanel.background || 'Where does the scene happen?'} onChange={(e) => updatePanel('background', e.target.value)} />
                </div>
                <div>
                  <label className="label-field">Action — What are they doing?</label>
                  <input className="input-field" value={panel.action} placeholder={bpPanel.action || 'What is happening?'} onChange={(e) => updatePanel('action', e.target.value)} />
                </div>
                <div>
                  <label className="label-field">Emotion — How do they feel?</label>
                  <input className="input-field" value={panel.emotion} placeholder={bpPanel.emotion || 'How does the character feel?'} onChange={(e) => updatePanel('emotion', e.target.value)} />
                </div>
                <div>
                  <label className="label-field">Details — What should we see?</label>
                  <input className="input-field" value={panel.details} placeholder={bpPanel.details || 'What important things should appear?'} onChange={(e) => updatePanel('details', e.target.value)} />
                </div>
                <div>
                  <label className="label-field">Style — What should the picture look like?</label>
                  <input className="input-field" value={panel.style} placeholder="Colorful cartoon comic" onChange={(e) => updatePanel('style', e.target.value)} />
                </div>
                <div>
                  <label className="label-field">Dialogue — What does the character say?</label>
                  <input className="input-field" value={panel.dialogue} placeholder={bpPanel.dialogue || 'What speech bubble text should appear?'} onChange={(e) => updatePanel('dialogue', e.target.value)} />
                </div>
              </div>

              <button onClick={() => setPhase('smart')} className="btn-primary mt-4 w-full">
                Build SMART Prompt
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>
          )}

          {/* Phase: SMART — with Emma's SMART example */}
          {phase === 'smart' && (
            <div className="card animate-slide-up">
              <h4 className="font-bold text-slate-700 mb-1">Build Your SMART Image Prompt</h4>
              <p className="text-sm text-slate-500 mb-3">You already know SMART. Now use it to build your image prompt for Panel {panelNumber}! Emma's prompt is on the right for reference.</p>

              {/* Emma's SMART breakdown */}
              <div className="mb-4 rounded-xl bg-violet-50 border border-violet-100 p-3">
                <p className="text-xs font-bold text-violet-700 mb-2">HOW EMMA BUILT HER PANEL {panelNumber} PROMPT:</p>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <p><span className="font-bold text-cyan-600">S — Say:</span> "Create a colorful storybook cartoon illustration of Emma..."</p>
                  <p><span className="font-bold text-emerald-600">M — Mention:</span> "curly brown hair, round glasses, purple hoodie, yellow backpack"</p>
                  <p><span className="font-bold text-amber-600">A — Ask:</span> "{emmaPanel.action}"</p>
                  <p><span className="font-bold text-rose-600">R — Request:</span> "colorful storybook cartoon style"</p>
                  <p><span className="font-bold text-violet-600">T — Thank:</span> "Thank you!"</p>
                </div>
              </div>

              <SmartPromptBuilder
                prefill={{
                  say: `Create a ${panel.style || 'colorful cartoon comic'} image of...`,
                  mention: characterDescription ? `Include ${characterDescription}` : '',
                  ask: panel.action ? `Show ${panel.characters || 'the character'} ${panel.action}${panel.background ? ` in ${panel.background}` : ''}` : '',
                  request: `Use a ${panel.style || 'colorful cartoon comic'} style`,
                  thank: 'Thank you!',
                }}
                onPromptChange={handleSmartChange}
              />

              <button onClick={() => setPhase('generate')} disabled={!panel.imagePrompt} className="btn-primary mt-4 w-full disabled:opacity-30">
                Generate Image
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>
          )}

          {/* Phase: Generate */}
          {phase === 'generate' && (
            <div className="animate-slide-up">
              <div className="card mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag color="bg-cyan-500 text-white">Your Prompt for Panel {panelNumber}</Tag>
                </div>
                <PromptHighlight prompt={panel.imagePrompt || ''} highlights={[]} />
              </div>
              <ImageGenerationPanel
                prompt={panel.imagePrompt}
                panelLabel={`Panel ${panelNumber}`}
                generatedImage={panel.generatedImage}
                onImageSaved={handleImageSaved}
                editable
                onPromptChange={(p) => updatePanel('imagePrompt', p)}
              />
              {panel.generatedImage && (
                <button onClick={() => setPhase('review')} className="btn-primary mt-4 w-full">
                  Review the Image
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              )}
            </div>
          )}

          {/* Phase: Review — with Emma's review example */}
          {phase === 'review' && (
            <div className="card animate-slide-up">
              {/* Emma's review example */}
              <div className="mb-4 rounded-xl bg-violet-50 border border-violet-100 p-3">
                <p className="text-xs font-bold text-violet-700 mb-1">EMMA'S REVIEW EXAMPLE:</p>
                <p className="text-xs text-slate-600 mb-1">When Emma generated her Panel {panelNumber} image, she found this problem:</p>
                <p className="text-xs text-slate-600 italic">"{emmaPanel.issue}"</p>
                <p className="text-xs text-slate-600 mt-1">She fixed it by improving her prompt — you can see the fix on the right!</p>
              </div>

              <ImageReviewPanel review={panel.review} onReviewChange={handleReviewChange} />
              <div className="mt-4 flex gap-2">
                <button onClick={() => setPhase('generate')} className="btn-secondary flex-1">
                  Regenerate
                </button>
                <button onClick={() => setPhase('improve')} className="btn-primary flex-1">
                  Continue
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
            </div>
          )}

          {/* Phase: Improve — with Emma's improvement example */}
          {phase === 'improve' && (
            <div className="card animate-slide-up">
              <h4 className="font-bold text-slate-700 mb-3">Fix the Prompt (If Needed)</h4>
              <p className="text-sm text-slate-500 mb-3">
                If something was wrong or missing, improve your prompt here. If everything looks great, you can save and move on!
              </p>

              {/* Emma's improvement example */}
              <div className="mb-3 rounded-xl bg-violet-50 border border-violet-100 p-3">
                <p className="text-xs font-bold text-violet-700 mb-1">HOW EMMA FIXED HER PANEL {panelNumber}:</p>
                <div className="space-y-1 text-xs text-slate-600">
                  <p><span className="font-bold">Problem:</span> {emmaPanel.issue}</p>
                  <p><span className="font-bold">Fix:</span> Added clearer details to the prompt</p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 mb-3">
                <p className="text-xs font-bold text-slate-500 mb-1">OBSERVATION → PROBLEM → PROMPT CHANGE → NEW RESULT</p>
                <p className="text-sm text-slate-600">What would you like to improve? Add your notes below.</p>
              </div>

              <textarea
                className="textarea-field"
                value={panel.improvements}
                placeholder="Example: The character's backpack is missing. I'll add 'Make sure the character is wearing their backpack' to the prompt."
                onChange={(e) => updatePanel('improvements', e.target.value)}
              />

              <div className="mt-3">
                <label className="label-field">Updated Prompt (edit if needed)</label>
                <textarea className="textarea-field text-sm font-mono" value={panel.imagePrompt} onChange={(e) => updatePanel('imagePrompt', e.target.value)} />
              </div>

              {/* Saved prompt versions */}
              {panel.promptVersions && panel.promptVersions.length > 0 && (
                <div className="mt-3 rounded-xl bg-cyan-50 border border-cyan-200 p-3">
                  <p className="text-xs font-bold text-cyan-700 mb-2">SAVED PROMPT VERSIONS:</p>
                  <div className="space-y-2">
                    {panel.promptVersions.map((v) => (
                      <div key={v.version} className="rounded-lg bg-white border border-cyan-100 p-2">
                        <p className="text-xs font-bold text-cyan-700">Version {v.version} — {v.label}</p>
                        <p className="text-xs text-slate-500 font-mono mt-1 line-clamp-2">{v.prompt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button onClick={() => setPhase('generate')} className="btn-secondary flex-1">
                  Regenerate with Fixes
                </button>
                <button onClick={handleImprove} className="btn-primary flex-1">
                  {panelNumber < 3 ? 'Save & Go to Panel ' + (panelNumber + 1) : 'Save & Build Comic'}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Persistent Emma Guide */}
        <div>
          <EmmaGuide panelNumber={panelNumber} phase={phase} />
        </div>
      </div>

      <TeacherTip
        say="Walk through each phase: details, SMART prompt, generate, review, improve. Emma's example on the right shows the same process."
        ask="How does your panel compare to Emma's panel? What's similar? What's different?"
        lookFor="The student actively compares their work to Emma's example and identifies the same kinds of details."
      />

      <NavButtons onPrev={onPrev} onNext={() => {}} nextDisabled nextLabel="" />
    </SectionShell>
  );
}
