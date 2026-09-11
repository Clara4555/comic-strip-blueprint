import { useState } from 'react';
import type { QuizQuestion } from '@/types/lesson';
import { quizQuestions } from '@/lib/quizData';
import { ByteMascot, SectionShell, NavButtons, TeacherTip } from './Common';
import { Tag } from './Cards';

interface QuizSectionProps {
  answers: Record<number, string>;
  onAnswer: (questionId: number, answer: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function QuizSection({ answers, onAnswer, onPrev, onNext }: QuizSectionProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(answers[currentQ] || null);
  const [showResult, setShowResult] = useState(false);

  const question: QuizQuestion = quizQuestions[currentQ];
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === quizQuestions.length;

  const handleSelect = (label: string) => {
    setSelected(label);
    setShowResult(true);
    onAnswer(question.id, label);
  };

  const goNext = () => {
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(answers[currentQ + 1] || null);
      setShowResult(!!answers[currentQ + 1]);
    }
  };

  const goPrev = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      setSelected(answers[currentQ - 1] || null);
      setShowResult(!!answers[currentQ - 1]);
    }
  };

  const isCorrect = selected === question.correctAnswer;

  return (
    <SectionShell
      title="Practice Quiz"
      subtitle={`Question ${currentQ + 1} of ${quizQuestions.length}`}
    >
      <ByteMascot expression="happy" message="Let's check what you've learned! These questions help you show that you understand how AI image generation works." />

      <div className="mt-6 flex gap-1 mb-4">
        {quizQuestions.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-full transition-all ${
              i < currentQ ? 'bg-emerald-400' : i === currentQ ? 'bg-cyan-500' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      <div className="card animate-slide-up" key={currentQ}>
        <div className="flex items-center gap-2 mb-3">
          <Tag color="bg-cyan-100 text-cyan-700">
            {question.type === 'true-false' ? 'True / False' :
             question.type === 'choose-better' ? 'Choose the Better Prompt' :
             question.type === 'scenario' ? 'Scenario' :
             question.type === 'whats-missing' ? "What's Missing?" :
             'Multiple Choice'}
          </Tag>
        </div>

        <h4 className="font-bold text-lg text-slate-800 mb-4 whitespace-pre-line">{question.question}</h4>

        <div className="space-y-2">
          {question.options.map((opt) => {
            const isSelected = selected === opt.label;
            const isCorrectOpt = opt.label === question.correctAnswer;
            const showCorrect = showResult && isCorrectOpt;
            const showWrong = showResult && isSelected && !isCorrectOpt;

            return (
              <button
                key={opt.label}
                onClick={() => handleSelect(opt.label)}
                disabled={showResult}
                className={`w-full text-left rounded-xl border-2 p-4 transition-all flex items-start gap-3 ${
                  showCorrect
                    ? 'border-emerald-400 bg-emerald-50'
                    : showWrong
                    ? 'border-rose-400 bg-rose-50'
                    : isSelected
                    ? 'border-cyan-400 bg-cyan-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  showCorrect ? 'bg-emerald-500 text-white' :
                  showWrong ? 'bg-rose-500 text-white' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {showCorrect ? '✓' : showWrong ? '✗' : opt.label}
                </span>
                <span className="text-sm text-slate-700 leading-relaxed pt-0.5">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className={`mt-4 rounded-xl p-4 border-2 animate-slide-up ${
            isCorrect ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'
          }`}>
            <p className={`font-bold mb-1 ${isCorrect ? 'text-emerald-700' : 'text-amber-700'}`}>
              {isCorrect ? 'Correct!' : 'Not quite — here\'s the answer:'}
            </p>
            <p className="text-sm text-slate-700">{question.explanation}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <button onClick={goPrev} disabled={currentQ === 0} className="btn-ghost disabled:opacity-30">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          Previous
        </button>
        <span className="text-sm text-slate-400">{answeredCount} / {quizQuestions.length} answered</span>
        {currentQ < quizQuestions.length - 1 ? (
          <button onClick={goNext} disabled={!showResult} className="btn-secondary disabled:opacity-30">
            Next Question
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        ) : (
          <button onClick={onNext} disabled={!allAnswered} className="btn-primary disabled:opacity-30">
            Finish Quiz
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>
          </button>
        )}
      </div>

      <TeacherTip
        say="This quiz checks the student's understanding of the key concepts from today's lesson."
        ask="Which question was the hardest? Why?"
        lookFor="The student can explain the reasoning behind their answers, not just guess correctly."
      />

      <NavButtons onPrev={onPrev} onNext={() => {}} nextDisabled nextLabel="" />
    </SectionShell>
  );
}
