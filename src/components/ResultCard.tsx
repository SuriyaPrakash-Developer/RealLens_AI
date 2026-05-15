import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, BrainCircuit, X } from 'lucide-react';
import { PredictionResult } from '../types';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { getCopy } from '../content/copy';

interface ResultCardProps {
  result: PredictionResult;
  className?: string;
  onClose?: () => void;
}

export default function ResultCard({ result, className = '', onClose }: ResultCardProps) {
  const language = usePreferencesStore((state) => state.language);
  const content = getCopy(language).result;
  const isAI = result.prediction.includes('AI');
  const summaryLabel = isAI ? content.aiSummary : content.humanSummary;
  const usedFallback = result.analysisMode === 'fallback';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative mx-auto mt-8 w-full max-w-3xl rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/20 md:p-8 ${className}`}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close result card"
          className="absolute right-4 top-4 rounded-xl border border-zinc-200 bg-white p-2 text-zinc-500 transition-colors hover:text-indigo-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-indigo-300"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      <div className="mb-5 grid gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 sm:grid-cols-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">{content.uploadedFile}</p>
          <p className="mt-2 font-semibold text-zinc-900 break-all dark:text-white">{result.filename}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">{content.summary}</p>
          <p className="mt-2 font-semibold text-zinc-900 dark:text-white">{summaryLabel}</p>
          {usedFallback && (
            <p className="mt-1 text-xs font-medium text-amber-600">{content.fallbackLabel}</p>
          )}
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">{content.analyzedAt}</p>
          <p className="mt-2 font-semibold text-zinc-900 dark:text-white">{new Date(result.timestamp).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
        <div className={`p-3 md:p-4 rounded-2xl ${isAI ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {isAI ? <BrainCircuit className="w-8 h-8 md:w-10 md:h-10" /> : <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10" />}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-1">{content.sectionTitle}</h3>
          <div className="flex items-baseline gap-3 mb-4">
            <span className={`text-2xl md:text-3xl font-black ${isAI ? 'text-orange-600' : 'text-emerald-600'}`}>
              {result.prediction}
            </span>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-zinc-600 dark:text-zinc-300">{content.confidenceScore}</span>
                <span className="text-zinc-900 dark:text-white">{result.confidence}%</span>
              </div>
              <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden relative dark:bg-zinc-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.confidence}%` }}
                  transition={{ 
                    type: "spring",
                    stiffness: 50,
                    damping: 15,
                    mass: 1
                  }}
                  className={`h-full rounded-full relative ${isAI ? 'bg-orange-500' : 'bg-emerald-500'}`}
                >
                  <motion.div
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0  via-white/30 to-transparent w-1/2"
                  />
                </motion.div>
              </div>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                {isAI
                  ? content.aiExplanation
                  : content.humanExplanation}
              </p>
            </div>
            
            <div className="p-3 md:p-4 rounded-xl bg-zinc-50 border border-zinc-100 text-xs md:text-sm text-zinc-600 leading-relaxed dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
              <p>
                <strong>{content.technicalNote}</strong> The Convolutional Neural Network (CNN) identified patterns in the 
                {isAI ? ' structural artifacts and noise distribution ' : ' brushstroke variability and organic textures '} 
                consistent with {isAI ? 'generative model outputs' : 'human artistic techniques'}.
              </p>
              {result.note && (
                <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-700">
                  <strong>{content.systemNote}</strong> {result.note}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
