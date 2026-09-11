import type { Blueprint, ComicPanel, CharacterProfile, SmartPrompt } from '@/types/lesson';

export const defaultBlueprint: Blueprint = {
  storyIdea: '',
  mainCharacter: {
    name: '',
    type: '',
    appearance: '',
    personality: '',
    specialty: '',
    clothing: '',
    importantVisualDetails: '',
  },
  supportingCharacters: [
    {
      name: '',
      type: '',
      appearance: '',
      personality: '',
      specialty: '',
      clothing: '',
      importantVisualDetails: '',
    },
    {
      name: '',
      type: '',
      appearance: '',
      personality: '',
      specialty: '',
      clothing: '',
      importantVisualDetails: '',
    },
  ],
  panels: {
    panel1: createEmptyPanel('Beginning — How the story starts'),
    panel2: createEmptyPanel('Adventure — What happens next'),
    panel3: createEmptyPanel('Ending — How the story wraps up'),
  },
};

function createEmptyPanel(scene: string): Omit<ComicPanel, 'promptVersions'> {
  return {
    scene,
    characters: '',
    action: '',
    emotion: '',
    dialogue: '',
    background: '',
    details: '',
    style: 'Colorful cartoon comic',
    imagePrompt: '',
    generatedImage: '',
    review: null,
    improvements: '',
    status: 'pending',
  };
}

export function createPanel(scene: string): ComicPanel {
  return {
    ...createEmptyPanel(scene),
    promptVersions: [],
  };
}

export function createDefaultPanels() {
  return {
    panel1: createPanel('Beginning — How the story starts'),
    panel2: createPanel('Adventure — What happens next'),
    panel3: createPanel('Ending — How the story wraps up'),
  };
}

export function buildCharacterDescription(char: CharacterProfile): string {
  const parts: string[] = [];
  if (char.name) parts.push(`Main character: ${char.name}`);
  if (char.type) parts.push(`a ${char.type}`);
  if (char.appearance) parts.push(`with ${char.appearance}`);
  if (char.clothing) parts.push(`wearing ${char.clothing}`);
  if (char.importantVisualDetails) parts.push(char.importantVisualDetails);
  if (char.personality) parts.push(`${char.name || 'The character'} is ${char.personality}`);
  if (char.specialty) parts.push(`Specialty: ${char.specialty}`);

  if (parts.length === 0) return '';

  let desc = parts.join(', ');
  desc = desc.charAt(0).toUpperCase() + desc.slice(1);
  if (!desc.endsWith('.')) desc += '.';
  return desc;
}

export function buildSmartPrompt(s: SmartPrompt): string {
  const parts: string[] = [];
  if (s.say.trim()) parts.push(s.say.trim());
  if (s.mention.trim()) parts.push(s.mention.trim());
  if (s.ask.trim()) parts.push(s.ask.trim());
  if (s.request.trim()) parts.push(s.request.trim());
  if (s.thank.trim()) parts.push(s.thank.trim());
  return parts.join(' ');
}

export function emptySmartPrompt(): SmartPrompt {
  return { say: '', mention: '', ask: '', request: '', thank: '' };
}
