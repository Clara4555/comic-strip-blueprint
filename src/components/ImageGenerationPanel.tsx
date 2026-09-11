import { useState } from 'react';

interface ImageGenerationPanelProps {
  prompt: string;
  onPromptChange?: (prompt: string) => void;
  generatedImage: string;
  onImageSaved?: (imageData: string) => void;
  editable?: boolean;
  panelLabel?: string;
}

export function ImageGenerationPanel({
  prompt,
  onPromptChange,
  generatedImage,
  onImageSaved,
  editable = false,
  panelLabel = 'Image',
}: ImageGenerationPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(!!generatedImage);
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentImage, setCurrentImage] = useState(generatedImage);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setHasGenerated(false);

    await new Promise((resolve) => setTimeout(resolve, 1800));

    const placeholderImage = createPlaceholderImage(prompt, panelLabel);
    setCurrentImage(placeholderImage);
    setIsGenerating(false);
    setHasGenerated(true);
    onImageSaved?.(placeholderImage);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-cyan-50/30 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5L5 21" /></svg>
            Image Generator
          </h4>
          <span className="tag bg-amber-100 text-amber-700">Demo Mode</span>
        </div>

        {editable && (
          <div className="mb-3">
            <label className="label-field text-xs">Your Image Prompt</label>
            <textarea
              className="textarea-field text-sm min-h-[60px]"
              value={prompt}
              onChange={(e) => onPromptChange?.(e.target.value)}
              placeholder="Your SMART prompt will appear here..."
            />
          </div>
        )}

        {!editable && (
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="text-xs text-cyan-600 font-semibold hover:text-cyan-800 mb-3"
          >
            {showPrompt ? 'Hide prompt' : 'Show prompt'}
          </button>
        )}
        {showPrompt && !editable && (
          <div className="mb-3 rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 font-mono leading-relaxed">
            {prompt}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isGenerating || (!prompt && editable)}
          className="btn-primary w-full"
        >
          {isGenerating ? (
            <>
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
              Generating...
            </>
          ) : hasGenerated ? (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" /></svg>
              Regenerate Image
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3l14 9-14 9V3z" /></svg>
              Generate Image
            </>
          )}
        </button>
      </div>

      <div className="rounded-2xl border-2 border-slate-200 overflow-hidden bg-white">
        {isGenerating ? (
          <div className="aspect-[4/3] flex flex-col items-center justify-center bg-gradient-to-br from-cyan-50 to-slate-50">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center animate-pulse-soft mb-3">
              <svg className="w-8 h-8 text-white animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
            </div>
            <p className="text-sm font-bold text-cyan-700">AI is creating your image...</p>
            <p className="text-xs text-slate-400 mt-1">This may take a moment</p>
          </div>
        ) : hasGenerated && currentImage ? (
          <img src={currentImage} alt={`Generated image for ${panelLabel}`} className="w-full aspect-[4/3] object-cover" />
        ) : (
          <div className="aspect-[4/3] flex flex-col items-center justify-center bg-slate-50">
            <svg className="w-12 h-12 text-slate-300 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5L5 21" /></svg>
            <p className="text-sm text-slate-400">Your generated image will appear here</p>
          </div>
        )}
      </div>

      {hasGenerated && (
        <p className="text-xs text-center text-amber-600 bg-amber-50 rounded-lg py-2 px-3">
          Demo Mode: This is a placeholder image. When a real AI image generation service is connected, actual AI-generated images will appear here.
        </p>
      )}
    </div>
  );
}

function createPlaceholderImage(prompt: string, label: string): string {
  const colors = ['#0fb6ec', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const shortPrompt = prompt.length > 60 ? prompt.substring(0, 60) + '...' : prompt;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:0.15" />
        <stop offset="100%" style="stop-color:${color};stop-opacity:0.05" />
      </linearGradient>
    </defs>
    <rect width="600" height="450" fill="url(#bg)" />
    <rect x="20" y="20" width="560" height="410" rx="16" fill="white" stroke="${color}" stroke-width="2" stroke-dasharray="8 4" opacity="0.6" />
    <circle cx="300" cy="160" r="50" fill="${color}" opacity="0.2" />
    <text x="300" y="170" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="40" fill="${color}" opacity="0.6">${label}</text>
    <text x="300" y="250" text-anchor="middle" font-family="Nunito, sans-serif" font-size="16" fill="#475569" font-weight="bold">Demo Generated Image</text>
    <rect x="100" y="280" width="400" height="60" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
    <text x="300" y="305" text-anchor="middle" font-family="Nunito, sans-serif" font-size="11" fill="#64748b">${shortPrompt}</text>
    <text x="300" y="325" text-anchor="middle" font-family="Nunito, sans-serif" font-size="9" fill="#94a3b8">Connect an AI image API to replace this placeholder</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
