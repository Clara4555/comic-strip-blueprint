import { useState, useEffect, useCallback } from 'react';
import type { Blueprint, ComicPanel, PanelReview, SmartPrompt } from '@/types/lesson';
import { supabase } from '@/lib/supabase';
import { defaultBlueprint, createDefaultPanels, buildCharacterDescription } from '@/lib/blueprintData';
import { progressStages, quizQuestions } from '@/lib/quizData';
import { ProgressBar, ByteMascot, TeacherTip, SectionShell, NavButtons } from '@/components/Common';
import { ConceptCard, Pipeline, SmartLetter, Tag, BlueprintField } from '@/components/Cards';
import {
  EmmaIntroSection,
  EmmaCharacterPromptSection,
  EmmaSceneSection,
  EmmaReviewImproveSection,
  CharacterConsistencySection,
  EmmaThreePanelsSection,
} from '@/components/EmmaSections';
import {
  StudentTurnSection,
  CharacterPrepSection,
  PanelBuilderSection,
} from '@/components/StudentSections';
import {
  ComicBuilderSection,
  ComicDirectorReviewSection,
  MiniChallengeSection,
  ReflectionSection,
  CompletionSection,
} from '@/components/ComicSections';
import { QuizSection } from '@/components/QuizSection';

const STORAGE_KEY = 'ai_explorers_lesson2';

interface SavedState {
  id: string;
  studentName: string;
  blueprint: Blueprint;
  panels: { panel1: ComicPanel; panel2: ComicPanel; panel3: ComicPanel };
  characterDescription: string;
  progress: { currentScreen: number; completedScreens: number[] };
  quizAnswers: Record<number, string>;
  reflectionAnswers: Record<number, string>;
  challengePrompt: string;
}

function loadLocalState(): Partial<SavedState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLocalState(state: SavedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [completedScreens, setCompletedScreens] = useState<number[]>([]);
  const [studentName, setStudentName] = useState('Young Explorer');
  const [blueprint, setBlueprint] = useState<Blueprint>(defaultBlueprint);
  const [panels, setPanels] = useState(createDefaultPanels());
  const [characterDescription, setCharacterDescription] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<number, string>>({});
  const [challengePrompt, setChallengePrompt] = useState('');
  const [recordId, setRecordId] = useState<string | null>(null);

  // Load state on mount
  useEffect(() => {
    (async () => {
      const local = loadLocalState();
      if (local) {
        if (local.studentName) setStudentName(local.studentName);
        if (local.blueprint) setBlueprint(local.blueprint);
        if (local.panels) setPanels(local.panels);
        if (local.characterDescription) setCharacterDescription(local.characterDescription);
        if (local.progress) {
          setCurrentScreen(local.progress.currentScreen ?? 0);
          setCompletedScreens(local.progress.completedScreens ?? []);
        }
        if (local.quizAnswers) setQuizAnswers(local.quizAnswers);
        if (local.reflectionAnswers) setReflectionAnswers(local.reflectionAnswers);
        if (local.challengePrompt) setChallengePrompt(local.challengePrompt);
        if (local.id) setRecordId(local.id);
      }

      // Try to load from Supabase
      try {
        const { data } = await supabase.from('lesson_state').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle();
        if (data && !local) {
          setStudentName(data.student_name || 'Young Explorer');
          if (data.blueprint) setBlueprint({ ...defaultBlueprint, ...data.blueprint });
          if (data.panels) setPanels({ ...createDefaultPanels(), ...data.panels });
          if (data.character_description) setCharacterDescription(data.character_description);
          if (data.progress) {
            setCurrentScreen(data.progress.currentScreen ?? 0);
            setCompletedScreens(data.progress.completedScreens ?? []);
          }
          if (data.quiz_answers) setQuizAnswers(data.quiz_answers);
          if (data.reflection_answers) setReflectionAnswers(data.reflection_answers);
          if (data.challenge_prompt) setChallengePrompt(data.challenge_prompt);
          setRecordId(data.id);
        }
      } catch {
        // Supabase not available — continue with local state
      }
      setLoaded(true);
    })();
  }, []);

  // Save state whenever it changes
  const saveState = useCallback(
    async (overrides?: Partial<SavedState>) => {
      const state: SavedState = {
        id: recordId || '',
        studentName,
        blueprint,
        panels,
        characterDescription,
        progress: { currentScreen, completedScreens },
        quizAnswers,
        reflectionAnswers,
        challengePrompt,
        ...overrides,
      };

      saveLocalState(state);

      try {
        if (recordId) {
          await supabase.from('lesson_state').update({
            student_name: studentName,
            blueprint,
            panels,
            character_description: characterDescription,
            progress: { currentScreen, completedScreens },
            quiz_answers: quizAnswers,
            reflection_answers: reflectionAnswers,
            challenge_prompt: challengePrompt,
            updated_at: new Date().toISOString(),
          }).eq('id', recordId);
        } else {
          const { data } = await supabase.from('lesson_state').insert({
            student_name: studentName,
            blueprint,
            panels,
            character_description: characterDescription,
            progress: { currentScreen, completedScreens },
            quiz_answers: quizAnswers,
            reflection_answers: reflectionAnswers,
            challenge_prompt: challengePrompt,
          }).select('id').single();
          if (data) setRecordId(data.id);
        }
      } catch {
        // Supabase not available — local state is saved
      }
    },
    [recordId, studentName, blueprint, panels, characterDescription, currentScreen, completedScreens, quizAnswers, reflectionAnswers, challengePrompt]
  );

  // Save on state changes (debounced via useEffect)
  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => saveState(), 800);
    return () => clearTimeout(timer);
  }, [loaded, saveState]);

  const goToScreen = (screen: number) => {
    setCurrentScreen(screen);
    if (!completedScreens.includes(screen)) {
      setCompletedScreens([...completedScreens, screen]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goNext = () => goToScreen(currentScreen + 1);
  const goPrev = () => goToScreen(Math.max(0, currentScreen - 1));

  const updatePanel = (panelKey: 'panel1' | 'panel2' | 'panel3', panel: ComicPanel) => {
    setPanels((prev) => ({ ...prev, [panelKey]: panel }));
  };

  const updateBlueprintCharacter = (field: keyof Blueprint['mainCharacter'], value: string) => {
    setBlueprint((prev) => ({
      ...prev,
      mainCharacter: { ...prev.mainCharacter, [field]: value },
    }));
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg animate-pulse-soft mb-4">
            <svg className="w-8 h-8 text-white animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
          </div>
          <p className="text-slate-400 font-bold">Loading your creative studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ProgressBar stages={progressStages} currentIndex={currentScreen} completedScreens={completedScreens} onStageClick={goToScreen} />
      <div className="pb-12">
        {currentScreen === 0 && <WelcomeSection studentName={studentName} blueprint={blueprint} onNext={goNext} />}
        {currentScreen === 1 && <BlueprintRecapSection blueprint={blueprint} onPrev={goPrev} onNext={goNext} />}
        {currentScreen === 2 && <WhatIsAISection onPrev={goPrev} onNext={goNext} />}
        {currentScreen === 3 && <WhatCanWeControlSection onPrev={goPrev} onNext={goNext} />}
        {currentScreen === 4 && <SmartImageSection onPrev={goPrev} onNext={goNext} />}
        {currentScreen === 5 && <EmmaIntroSection onPrev={goPrev} onNext={goNext} />}
        {currentScreen === 6 && <EmmaCharacterPromptSection onPrev={goPrev} onNext={goNext} />}
        {currentScreen === 7 && <EmmaSceneSection onPrev={goPrev} onNext={goNext} />}
        {currentScreen === 8 && <EmmaReviewImproveSection onPrev={goPrev} onNext={goNext} />}
        {currentScreen === 9 && <CharacterConsistencySection onPrev={goPrev} onNext={goNext} />}
        {currentScreen === 10 && <EmmaThreePanelsSection onPrev={goPrev} onNext={goNext} />}
        {currentScreen === 11 && (
          <StudentTurnSection
            blueprint={blueprint}
            onBlueprintChange={setBlueprint}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
        {currentScreen === 12 && (
          <CharacterPrepSection
            blueprint={blueprint}
            onBlueprintChange={setBlueprint}
            onCharacterDescriptionChange={setCharacterDescription}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
        {currentScreen === 13 && (
          <PanelBuilderSection
            panelNumber={1}
            blueprint={blueprint}
            panel={panels.panel1}
            onPanelChange={(p) => updatePanel('panel1', p)}
            characterDescription={characterDescription}
            onPrev={goPrev}
            onNext={goNext}
            completedPanels={completedScreens.filter((s) => s >= 13 && s <= 15).map((s) => s - 12)}
          />
        )}
        {currentScreen === 14 && (
          <PanelBuilderSection
            panelNumber={2}
            blueprint={blueprint}
            panel={panels.panel2}
            onPanelChange={(p) => updatePanel('panel2', p)}
            characterDescription={characterDescription}
            onPrev={goPrev}
            onNext={goNext}
            completedPanels={[1]}
          />
        )}
        {currentScreen === 15 && (
          <PanelBuilderSection
            panelNumber={3}
            blueprint={blueprint}
            panel={panels.panel3}
            onPanelChange={(p) => updatePanel('panel3', p)}
            characterDescription={characterDescription}
            onPrev={goPrev}
            onNext={goNext}
            completedPanels={[1, 2]}
          />
        )}
        {currentScreen === 16 && (
          <ComicBuilderSection
            blueprint={blueprint}
            panels={panels}
            onPanelDialogueChange={(key, dialogue) => updatePanel(key, { ...panels[key], dialogue })}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
        {currentScreen === 17 && (
          <ComicDirectorReviewSection panels={panels} blueprint={blueprint} onPrev={goPrev} onNext={goNext} />
        )}
        {currentScreen === 18 && (
          <QuizSection answers={quizAnswers} onAnswer={(qid, ans) => setQuizAnswers((prev) => ({ ...prev, [qid]: ans }))} onPrev={goPrev} onNext={goNext} />
        )}
        {currentScreen === 19 && (
          <MiniChallengeSection challengePrompt={challengePrompt} onChallengeChange={setChallengePrompt} onPrev={goPrev} onNext={goNext} />
        )}
        {currentScreen === 20 && (
          <ReflectionSection answers={reflectionAnswers} onAnswer={(qid, ans) => setReflectionAnswers((prev) => ({ ...prev, [qid]: ans }))} onPrev={goPrev} onNext={goNext} />
        )}
        {currentScreen === 21 && (
          <CompletionSection studentName={studentName} onPrev={goPrev} onRestart={() => goToScreen(0)} />
        )}
      </div>
    </div>
  );
}

// ===================== Section 1: Welcome =====================
function WelcomeSection({ studentName, blueprint, onNext }: { studentName: string; blueprint: Blueprint; onNext: () => void }) {
  return (
    <SectionShell>
      <div className="text-center py-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-xl shadow-cyan-300/40 animate-float-slow mb-4">
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="6" width="16" height="12" rx="4" />
            <circle cx="9" cy="11" r="1" fill="currentColor" />
            <circle cx="15" cy="11" r="1" fill="currentColor" />
            <path d="M9 15c1-1 5-1 6 0" />
            <path d="M12 3v3" />
            <circle cx="12" cy="3" r="1" fill="currentColor" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold font-display text-slate-800 mb-1">Welcome Back, Creative Director!</h1>
        <p className="text-slate-500 text-lg mb-2">Lesson 2: Bring Your Comic to Life</p>
        <p className="text-cyan-600 font-bold text-sm uppercase tracking-wide">AI Explorers — Generative AI</p>
      </div>

      <ByteMascot
        expression="excited"
        size="lg"
        message={`Welcome back, Creative Director! You already planned your comic. Today we're going to bring your ideas to life!`}
      />

      <div className="mt-6 card">
        <h3 className="font-bold text-lg font-display text-slate-800 mb-3">Today's Journey</h3>
        <Pipeline
          steps={[
            { label: 'Your Blueprint', description: 'Your plan from Lesson 1' },
            { label: 'Your Prompt', description: 'Turn it into instructions' },
            { label: 'AI Image', description: 'AI creates your scene' },
            { label: 'Your Comic', description: 'Put it all together!' },
          ]}
        />
      </div>

      {blueprint.storyIdea && (
        <div className="mt-4 card">
          <h3 className="font-bold text-slate-700 mb-2">Your Saved Comic Blueprint</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl bg-cyan-50 p-3">
              <p className="text-xs font-bold text-cyan-700">STORY</p>
              <p className="text-sm text-slate-700 mt-1">{blueprint.storyIdea}</p>
            </div>
            <div className="rounded-xl bg-violet-50 p-3">
              <p className="text-xs font-bold text-violet-700">MAIN CHARACTER</p>
              <p className="text-sm text-slate-700 mt-1">{blueprint.mainCharacter.name || 'Not named yet'}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3">
              <p className="text-xs font-bold text-emerald-700">SUPPORTING CHARACTERS</p>
              <p className="text-sm text-slate-700 mt-1">{blueprint.supportingCharacters.filter((c) => c.name).map((c) => c.name).join(', ') || 'Not named yet'}</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3">
              <p className="text-xs font-bold text-amber-700">SCENES</p>
              <p className="text-sm text-slate-700 mt-1">3 panels planned</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-600 p-4 text-center">
        <p className="text-white font-bold text-sm">YOU are the creator. AI is your creative helper.</p>
      </div>

      <TeacherTip
        say="Last class, you planned the story. Today, we're going to turn your scenes into pictures."
        ask="Are you excited to see your comic characters come to life?"
        lookFor="Enthusiasm and readiness to start creating."
      />

      <div className="mt-6 text-center">
        <button onClick={onNext} className="btn-primary text-lg px-8 py-4">
          Start Bringing It to Life
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </div>
    </SectionShell>
  );
}

// ===================== Section 2: Blueprint Recap =====================
function BlueprintRecapSection({ blueprint, onPrev, onNext }: { blueprint: Blueprint; onPrev: () => void; onNext: () => void }) {
  return (
    <SectionShell
      title="Quick Blueprint Recap"
      subtitle="Your blueprint is like a plan for your comic"
    >
      <ByteMascot expression="happy" message="Your blueprint is like a plan for your comic. Before an artist draws a comic, they need to know what they are drawing. Your blueprint tells us what each picture needs to show!" />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📖</span>
            <h4 className="font-bold font-display text-slate-800">My Story</h4>
          </div>
          <p className="text-sm text-slate-600">{blueprint.storyIdea || 'Add your story idea to get started'}</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🧑</span>
            <h4 className="font-bold font-display text-slate-800">My Characters</h4>
          </div>
          <div className="space-y-2">
            <div className="rounded-lg bg-violet-50 px-3 py-2">
              <p className="text-xs font-bold text-violet-700">MAIN</p>
              <p className="text-sm text-slate-700">{blueprint.mainCharacter.name || 'Not named'}</p>
              <p className="text-xs text-slate-500">{blueprint.mainCharacter.type}</p>
            </div>
            {blueprint.supportingCharacters.map((c, i) => (
              <div key={i} className="rounded-lg bg-emerald-50 px-3 py-2">
                <p className="text-xs font-bold text-emerald-700">SUPPORTING {i + 1}</p>
                <p className="text-sm text-slate-700">{c.name || 'Not named'}</p>
                <p className="text-xs text-slate-500">{c.type}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🎬</span>
            <h4 className="font-bold font-display text-slate-800">My Scenes</h4>
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((n) => {
              const panel = blueprint.panels[`panel${n}` as keyof typeof blueprint.panels];
              return (
                <div key={n} className="rounded-lg bg-slate-50 px-3 py-2">
                  <p className="text-xs font-bold text-slate-500">PANEL {n}</p>
                  <p className="text-sm text-slate-700">{panel.scene}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <TeacherTip
        say="Today we are going to use your blueprint as our instruction sheet."
        ask="Which part of your blueprint tells us who should appear in the picture?"
        lookFor="The student identifies the character information as the key to who appears in the image."
      />

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="What is AI Image Generation?" />
    </SectionShell>
  );
}

// ===================== Section 3: What Is AI Image Generation =====================
function WhatIsAISection({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <SectionShell
      title="What is AI Image Generation?"
      subtitle="An AI image generator is a tool that can create an image from instructions"
    >
      <ByteMascot expression="thinking" message="An AI image generator is a tool that can create an image from instructions. The AI cannot see the picture inside your head — you have to describe your idea!" />

      <div className="mt-6 card">
        <Pipeline
          steps={[
            { label: 'Your Idea', description: 'This is what you imagine' },
            { label: 'Text Prompt', description: 'You describe what you want' },
            { label: 'AI Image Generator', description: 'AI uses your instructions' },
            { label: 'Image', description: 'You get a visual result' },
          ]}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 p-4">
          <span className="tag bg-rose-100 text-rose-700 mb-2">Too Little Info</span>
          <p className="text-sm text-slate-600 font-mono mt-2">"A girl"</p>
          <p className="text-xs text-slate-500 mt-2">The AI has very little information to work with.</p>
        </div>
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4">
          <span className="tag bg-emerald-100 text-emerald-700 mb-2">Much More Info</span>
          <p className="text-sm text-slate-600 font-mono mt-2">"Create a young girl with curly brown hair, wearing a yellow jacket and blue sneakers, standing in a colorful science classroom"</p>
          <p className="text-xs text-slate-500 mt-2">You have given the AI much more information to work with.</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-600 p-4 text-center text-white">
        <p className="font-bold">More useful information = more control over the result</p>
        <p className="text-sm text-cyan-100 mt-1">But the goal is not to make the prompt as long as possible. The goal is to include the details that matter.</p>
      </div>

      <TeacherTip
        say="An AI image generator doesn't know what you imagined until you describe it."
        ask="What information did we give the AI about the girl in the second example?"
        lookFor="Character, clothing, and setting details."
      />

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="What Can We Control?" />
    </SectionShell>
  );
}

// ===================== Section 4: What Can We Control =====================
function WhatCanWeControlSection({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  const [combined, setCombined] = useState(false);

  const cards = [
    { title: 'Character', desc: 'Who or what is in the picture?', example: 'A young astronaut girl', color: 'bg-cyan-50', icon: <svg className="w-5 h-5 text-cyan-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 1 0-16 0" /></svg> },
    { title: 'Setting', desc: 'Where does the scene happen?', example: 'On the surface of Mars', color: 'bg-emerald-50', icon: <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l9-9 9 9M9 21V12" /></svg> },
    { title: 'Action', desc: 'What is happening?', example: 'Exploring a glowing cave', color: 'bg-amber-50', icon: <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2l-2 2.5h3L12 7" /><path d="M5 12h14M12 7v10" /></svg> },
    { title: 'Details', desc: 'What important things should appear?', example: 'A small robot companion, glowing rocks, stars in the sky', color: 'bg-violet-50', icon: <svg className="w-5 h-5 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v6m0 10v6M4.22 4.22l4.24 4.24m7.07 7.07l4.24 4.24M1 12h6m10 0h6M4.22 19.78l4.24-4.24m7.07-7.07l4.24-4.24" /></svg> },
    { title: 'Style', desc: 'What should the picture look or feel like?', example: 'Colorful cartoon illustration', color: 'bg-rose-50', icon: <svg className="w-5 h-5 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /></svg> },
  ];

  return (
    <SectionShell
      title="What Can We Control?"
      subtitle="These are the kinds of details that can help when you're describing a picture"
    >
      <ByteMascot expression="thinking" message="You already learned SMART. These are simply the kinds of details that can help when you're describing a picture. They're not a new framework — they're the same ideas!" />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        {cards.map((c) => (
          <ConceptCard key={c.title} title={c.title} description={c.desc} example={c.example} icon={c.icon} color={c.color} />
        ))}
      </div>

      <div className="mt-6 card">
        <h4 className="font-bold text-slate-700 mb-3">When We Combine Them All:</h4>
        <button onClick={() => setCombined(true)} disabled={combined} className="btn-secondary mb-3 w-full disabled:opacity-50">
          {combined ? 'Combined!' : 'Combine All Five'}
        </button>
        {combined && (
          <div className="rounded-xl bg-cyan-50 border-2 border-cyan-200 p-4 text-sm text-slate-700 leading-relaxed animate-bounce-in">
            "Create a <mark className="bg-cyan-200 rounded px-1">colorful cartoon illustration</mark> of a <mark className="bg-cyan-200 rounded px-1">young astronaut girl</mark> <mark className="bg-amber-200 rounded px-1">exploring a glowing cave</mark> <mark className="bg-emerald-200 rounded px-1">on Mars</mark> with a <mark className="bg-violet-200 rounded px-1">small robot companion, glowing rocks, and stars visible in the sky</mark>."
          </div>
        )}
      </div>

      <TeacherTip
        say="These five categories are not a new prompting framework. You already learned SMART."
        ask="Which of these five details is most important for keeping your character consistent?"
        lookFor="Character — it tells the AI who should be in the picture."
      />

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Connect to SMART" />
    </SectionShell>
  );
}

// ===================== Section 5: SMART + Image Prompts =====================
function SmartImageSection({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <SectionShell
      title="SMART + Image Details = Clear Image Prompt"
      subtitle="You already know SMART. Now let's use it for image creation!"
    >
      <ByteMascot expression="excited" message="You already know how to talk to AI using SMART. Today we're going to use those same skills to give instructions to an AI image generator!" />

      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 shadow-lg">
          <span className="text-white font-bold font-display text-lg">SMART</span>
          <span className="text-white/70">+</span>
          <span className="text-white font-bold font-display text-lg">Image Details</span>
          <span className="text-white/70">=</span>
          <span className="text-white font-bold font-display text-lg">Clear Image Prompt</span>
        </div>
      </div>

      <div className="mt-6 card">
        <h4 className="font-bold text-slate-700 mb-4">Let's walk through the example with Emma:</h4>
        <div className="space-y-5">
          <SmartLetter letter="S" word="SAY" description="Say what you want." color="bg-cyan-100 text-cyan-700">
            <div className="rounded-lg bg-cyan-50 px-3 py-2 text-sm text-slate-700">"Create a picture of Emma..."</div>
          </SmartLetter>
          <SmartLetter letter="M" word="MENTION" description="Mention important details." color="bg-emerald-100 text-emerald-700">
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-slate-700">"Emma is a curious girl with curly brown hair, round glasses, a purple hoodie, and a small yellow backpack."</div>
          </SmartLetter>
          <SmartLetter letter="A" word="ASK" description="Ask clearly." color="bg-amber-100 text-amber-700">
            <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-slate-700">"Show Emma exploring an unusual room."</div>
          </SmartLetter>
          <SmartLetter letter="R" word="REQUEST" description="Request the style or format." color="bg-rose-100 text-rose-700">
            <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-slate-700">"Make it a colorful storybook cartoon style."</div>
          </SmartLetter>
          <SmartLetter letter="T" word="THANK" description="Thank the AI and keep learning." color="bg-violet-100 text-violet-700">
            <div className="rounded-lg bg-violet-50 px-3 py-2 text-sm text-slate-700">"Thank you!"</div>
          </SmartLetter>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-amber-50 border-2 border-amber-200 p-4">
        <p className="text-sm text-amber-900">
          <span className="font-bold">Note:</span> "Thank" does not magically improve the image. It is part of the SMART communication habit you already learned. The actual visual details come from what you describe.
        </p>
      </div>

      <TeacherTip
        say="SMART helps us organize our image instructions the same way it helped us organize our text prompts."
        ask="Which SMART letter helps us tell the AI what style to use?"
        lookFor="R — Request the style or format."
      />

      <NavButtons onPrev={onPrev} onNext={onNext} nextLabel="Meet Emma" />
    </SectionShell>
  );
}
