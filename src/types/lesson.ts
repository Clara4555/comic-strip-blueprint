export interface CharacterProfile {
  name: string;
  type: string;
  appearance: string;
  personality: string;
  specialty: string;
  clothing: string;
  importantVisualDetails: string;
}

export interface ComicPanel {
  scene: string;
  characters: string;
  action: string;
  emotion: string;
  dialogue: string;
  background: string;
  details: string;
  style: string;
  imagePrompt: string;
  generatedImage: string;
  review: PanelReview | null;
  improvements: string;
  promptVersions: PromptVersion[];
  status: 'pending' | 'prompted' | 'generated' | 'reviewed' | 'complete';
}

export interface PanelReview {
  character: boolean;
  setting: boolean;
  action: boolean;
  details: boolean;
  emotion: boolean;
  style: boolean;
  consistency: boolean;
}

export interface PromptVersion {
  version: number;
  prompt: string;
  label: string;
}

export interface Blueprint {
  storyIdea: string;
  mainCharacter: CharacterProfile;
  supportingCharacters: CharacterProfile[];
  panels: {
    panel1: Omit<ComicPanel, 'promptVersions'>;
    panel2: Omit<ComicPanel, 'promptVersions'>;
    panel3: Omit<ComicPanel, 'promptVersions'>;
  };
}

export interface LessonState {
  id: string;
  studentName: string;
  blueprint: Blueprint;
  panels: {
    panel1: ComicPanel;
    panel2: ComicPanel;
    panel3: ComicPanel;
  };
  characterDescription: string;
  progress: {
    currentScreen: number;
    completedScreens: number[];
  };
  quizAnswers: Record<number, string>;
  reflectionAnswers: Record<number, string>;
  challengePrompt: string;
}

export interface SmartPrompt {
  say: string;
  mention: string;
  ask: string;
  request: string;
  thank: string;
}

export interface QuizQuestion {
  id: number;
  type: 'multiple-choice' | 'true-false' | 'choose-better' | 'scenario' | 'whats-missing';
  question: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

export interface ProgressStage {
  id: string;
  label: string;
  icon: string;
}
