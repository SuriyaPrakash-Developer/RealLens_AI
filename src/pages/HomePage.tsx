import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import UploadZone from '../components/UploadZone';
import ResultDialog from '../components/ResultDialog';
import HistoryList from '../components/HistoryList';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';
import { PredictionResult, HistoryItem } from '../types';
import { Brain, ShieldCheck, Palette, Cpu, Upload, History, MessageCircle, ScanSearch } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { getCopy } from '../content/copy';
import { authFetch } from '../utils/authFetch';

const featureIcons = [ShieldCheck, Palette, Cpu, Upload, ScanSearch, Brain, History, MessageCircle];

export default function HomePage() {
  const location = useLocation();
  const language = usePreferencesStore((state) => state.language);
  const content = getCopy(language);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResettingHistory, setIsResettingHistory] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (!location.hash) {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const id = location.hash.slice(1);
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [location.pathname, location.hash]);

  const fetchHistory = async () => {
    try {
      const response = await authFetch('/api/history');
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setHistory(data);
    } catch (fetchError) {
      console.error('Failed to fetch history:', fetchError);
    }
  };

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    setResult(null);
    setIsResultDialogOpen(false);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await authFetch('/api/predict', {
        method: 'POST',
        body: formData,
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        if (text.includes('Please wait while your application starts')) {
          throw new Error('The application is still starting up. Please wait a few seconds and try again.');
        }
        throw new Error('The server returned an unexpected response format.');
      }

      if (!response.ok) {
        throw new Error(data.error || 'An unexpected error occurred during analysis.');
      }

      setResult(data);
      setIsResultDialogOpen(true);
      fetchHistory();
    } catch (err: any) {
      console.error('Prediction failed:', err);
      setError(err.message || 'Failed to connect to the server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const requestResetHistory = () => {
    if (history.length === 0 || isResettingHistory) {
      return;
    }

    setIsResetDialogOpen(true);
  };

  const handleResetHistory = async () => {
    if (history.length === 0 || isResettingHistory) {
      return;
    }

    setIsResettingHistory(true);
    setError(null);

    try {
      const response = await authFetch('/api/history/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      let data: { error?: string } | null = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        if (text.includes('Please wait while your application starts')) {
          throw new Error('The application is still starting up. Please wait a few seconds and try again.');
        }
        throw new Error(text || 'The server returned an unexpected response while clearing history.');
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to reset history.');
      }

      setHistory([]);
      setIsResetDialogOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to reset history.');
    } finally {
      setIsResettingHistory(false);
    }
  };

  return (
    <>
      <main className="mx-auto w-full max-w-none px-4 py-8 sm:px-6 lg:px-10 xl:px-12 md:py-12">
        <section id="home" className="text-center mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300"
          >
            {content.home.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 mb-6 text-4xl font-black tracking-tight text-zinc-900 md:text-6xl xl:text-7xl dark:text-white"
          >
            {content.home.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mb-12 max-w-4xl text-lg leading-relaxed text-zinc-600 md:text-xl dark:text-zinc-300"
          >
            {content.home.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a href="#classifier" className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300">
              {content.home.startAnalysis}
            </a>
            <a href="#history" className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-indigo-200 hover:text-indigo-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-indigo-800 dark:hover:text-indigo-300">
              {content.home.viewRecentResults}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mb-12 grid w-full max-w-none grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {content.home.highlights.map((item) => (
              <div key={item.label} className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">{item.label}</p>
                <p className="mt-2 text-base font-semibold text-zinc-800 md:text-lg dark:text-zinc-100">{item.value}</p>
              </div>
            ))}
          </motion.div>

          <div className="mb-12 w-full text-left">
            <h2 className="mb-4 text-2xl font-black tracking-tight text-zinc-900 md:text-3xl xl:text-4xl dark:text-white">{content.home.aboutTitle}</h2>
            <p className="max-w-6xl text-base leading-relaxed text-zinc-600 md:text-lg dark:text-zinc-300">{content.home.aboutBody}</p>
          </div>

          <div className="mx-auto grid w-full max-w-none grid-cols-1 gap-6 text-left sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {content.home.featureCards.map((feature, index) => {
              const Icon = featureIcons[index];
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-800"
                >
                  <Icon className="mb-4 h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="mb-2 text-lg font-bold text-zinc-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section id="classifier" className="mb-12 md:mb-20">
          <div className="rounded-4xl border border-zinc-200 bg-linear-to-br from-white via-stone-50 to-indigo-50/60 p-6 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-indigo-950/40 dark:shadow-black/20 md:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <div>
                <div className="inline-flex items-center rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700 shadow-sm dark:border-indigo-900/60 dark:bg-zinc-900 dark:text-indigo-300">
                  {content.home.classifier.badge}
                </div>
                <h2 className="mt-5 text-3xl font-black tracking-tight text-zinc-900 md:text-4xl dark:text-white">{content.home.classifier.title}</h2>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg dark:text-zinc-300">{content.home.classifier.description}</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {content.home.classifier.statCards.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">{item.label}</p>
                      <p className="mt-2 text-sm font-semibold text-zinc-800 md:text-base dark:text-zinc-100">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {content.home.classifier.infoCards.map((item) => (
                  <div key={item.title} className="rounded-3xl border border-zinc-200/80 bg-white/80 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/75">
                    <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{item.desc}</p>
                  </div>
                ))}
                <div className="rounded-3xl border border-dashed border-indigo-200 bg-indigo-50/60 p-5 shadow-sm dark:border-indigo-900/60 dark:bg-indigo-950/30 sm:col-span-2">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">{content.home.classifier.noteTitle}</p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{content.home.classifier.noteBody}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <UploadZone onUpload={handleUpload} onError={setError} isLoading={isLoading} />
            </div>
          </div>
        </section>

        <section id="history" className="border-t border-zinc-200 pt-12 dark:border-zinc-800 md:pt-20">
          <HistoryList history={history} onReset={requestResetHistory} isResetting={isResettingHistory} />
        </section>
      </main>

      <ResultDialog isOpen={isResultDialogOpen} result={result} onClose={() => setIsResultDialogOpen(false)} />

      <ConfirmDialog
        isOpen={isResetDialogOpen}
        title={content.home.clearHistoryTitle}
        description={content.home.clearHistoryDescription}
        confirmLabel={content.home.clearHistoryConfirm}
        cancelLabel={content.home.clearHistoryCancel}
        isLoading={isResettingHistory}
        onConfirm={handleResetHistory}
        onCancel={() => setIsResetDialogOpen(false)}
      />

      <AnimatePresence>
        {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
      </AnimatePresence>
    </>
  );
}