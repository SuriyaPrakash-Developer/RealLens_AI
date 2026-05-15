import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import { PredictionResult } from '../types';
import ResultCard from './ResultCard';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { getCopy } from '../content/copy';

interface ResultDialogProps {
  isOpen: boolean;
  result: PredictionResult | null;
  onClose: () => void;
}

export default function ResultDialog({ isOpen, result, onClose }: ResultDialogProps) {
  const language = usePreferencesStore((state) => state.language);
  const content = getCopy(language).result;

  if (!result) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/55 px-4 py-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-3xl rounded-4xl border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="result-dialog-title"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close result dialog"
              className="absolute right-4 top-4 rounded-xl border border-zinc-200 bg-white p-2 text-zinc-500 transition-colors hover:text-indigo-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-indigo-300"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 flex items-center gap-3 pr-12">
              <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">{content.analysisComplete}</p>
                <h3 id="result-dialog-title" className="text-xl font-bold text-zinc-900 dark:text-white">
                  {content.resultReady}
                </h3>
              </div>
            </div>

            <div className="mb-4 grid gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 sm:grid-cols-2">
              <div>
                <span className="font-semibold text-zinc-900 dark:text-white">{content.file}</span> {result.filename}
              </div>
              <div>
                <span className="font-semibold text-zinc-900 dark:text-white">{content.timestamp}</span> {new Date(result.timestamp).toLocaleString()}
              </div>
            </div>

            <ResultCard result={result} className="mt-0 max-w-none shadow-none" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}