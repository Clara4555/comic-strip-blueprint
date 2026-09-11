import type { QuizQuestion, ProgressStage } from '@/types/lesson';

export const progressStages: ProgressStage[] = [
  { id: 'welcome', label: 'Start', icon: 'rocket' },
  { id: 'recap', label: 'Blueprint', icon: 'clipboard-list' },
  { id: 'what-is-ai', label: 'Image AI', icon: 'image' },
  { id: 'control', label: 'Details', icon: 'sliders-horizontal' },
  { id: 'smart', label: 'SMART', icon: 'brain' },
  { id: 'emma-intro', label: 'Emma', icon: 'sparkles' },
  { id: 'character-prep', label: 'Character', icon: 'user-pen' },
  { id: 'panel1', label: 'Panel 1', icon: 'image-plus' },
  { id: 'panel2', label: 'Panel 2', icon: 'image-plus' },
  { id: 'panel3', label: 'Panel 3', icon: 'image-plus' },
  { id: 'comic', label: 'Comic', icon: 'newspaper' },
  { id: 'quiz', label: 'Quiz', icon: 'help-circle' },
  { id: 'complete', label: 'Complete', icon: 'trophy' },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    type: 'multiple-choice',
    question: 'What does an AI image generator do?',
    options: [
      { label: 'A', text: 'It reads your mind.' },
      { label: 'B', text: 'It creates an image based on your instructions.' },
      { label: 'C', text: 'It automatically knows exactly what you imagined.' },
    ],
    correctAnswer: 'B',
    explanation:
      'Correct! An AI image generator uses your instructions to create an image. It cannot see the picture inside your imagination, so your description matters.',
  },
  {
    id: 2,
    type: 'choose-better',
    question: 'Which prompt gives an AI more useful information?',
    options: [
      { label: 'A', text: '"Draw a dog."' },
      { label: 'B', text: '"Create a colorful cartoon image of a brown dog wearing a blue scarf, running through a snowy park."' },
    ],
    correctAnswer: 'B',
    explanation:
      'The second prompt explains the character, clothing, setting, action, and style — all useful details for the AI.',
  },
  {
    id: 3,
    type: 'true-false',
    question: 'True or False: Adding more words always makes an image prompt better.',
    options: [
      { label: 'A', text: 'True' },
      { label: 'B', text: 'False' },
    ],
    correctAnswer: 'B',
    explanation:
      'Not necessarily. Useful details matter more than simply making a prompt longer. The goal is to include the details that matter.',
  },
  {
    id: 4,
    type: 'scenario',
    question:
      'The character\'s red backpack keeps disappearing from the images. What could you do?',
    options: [
      { label: 'A', text: 'Ignore it.' },
      { label: 'B', text: 'Add the backpack clearly to the character description and review the next result.' },
      { label: 'C', text: 'Change the whole story.' },
    ],
    correctAnswer: 'B',
    explanation:
      'You can improve the instruction by making the important detail clearer, then check the next result.',
  },
  {
    id: 5,
    type: 'multiple-choice',
    question: 'What should you do after AI generates an image?',
    options: [
      { label: 'A', text: 'Accept it automatically.' },
      { label: 'B', text: 'Review it and compare it with your idea.' },
      { label: 'C', text: 'Let AI decide whether it is good.' },
    ],
    correctAnswer: 'B',
    explanation:
      'You are the creative director. You review the result and decide what to keep or improve.',
  },
  {
    id: 6,
    type: 'multiple-choice',
    question: 'Why is character consistency important in a comic?',
    options: [
      { label: 'A', text: 'It makes the comic longer.' },
      { label: 'B', text: 'It keeps important character details the same across all panels.' },
      { label: 'C', text: 'It makes the AI work faster.' },
    ],
    correctAnswer: 'B',
    explanation:
      'When important character details stay the same, your character looks like the same person in every panel.',
  },
  {
    id: 7,
    type: 'true-false',
    question:
      'True or False: If the AI makes a mistake, it means your idea is bad.',
    options: [
      { label: 'A', text: 'True' },
      { label: 'B', text: 'False' },
    ],
    correctAnswer: 'B',
    explanation:
      'It just means you can improve your instructions. The AI did not understand something — you can fix the prompt.',
  },
  {
    id: 8,
    type: 'whats-missing',
    question: 'What is missing from this prompt?\n\n"Draw Emma in a library."',
    options: [
      { label: 'A', text: 'Character details, setting details, action, emotion, and style' },
      { label: 'B', text: 'Nothing — it is perfect.' },
      { label: 'C', text: 'More big words.' },
    ],
    correctAnswer: 'A',
    explanation:
      'The prompt does not describe what Emma looks like, what she is doing, how she feels, or what style the image should be. Adding useful details gives you more control.',
  },
];
