import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Image as ImageIcon, RotateCcw, Sparkles, ScanSearch, UserCheck } from 'lucide-react';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { getCopy } from '../content/copy';

interface HistoryListProps {
  history: HistoryItem[];
  onReset: () => void;
  isResetting: boolean;
}

export default function HistoryList({ history, onReset, isResetting }: HistoryListProps) {
  const language = usePreferencesStore((state) => state.language);
  const content = getCopy(language).history;
  const aiCount = history.filter((item) => item.prediction.includes('AI')).length;
  const humanCount = history.length - aiCount;
  const latestRun = history[0]?.timestamp;

  const statCards = [
    { label: content.total, value: history.length, icon: Clock },
    { label: content.aiCount, value: aiCount, icon: Sparkles },
    { label: content.humanCount, value: humanCount, icon: UserCheck },
  ];

  return (
    <div className="mt-12 w-full px-0 md:mt-16">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Clock className="h-7 w-7 text-zinc-400 md:h-8 md:w-8" />
            <h2 className="text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl md:text-4xl dark:text-white">{content.title}</h2>
          </div>
          <p className="mt-2.5 max-w-4xl text-sm leading-relaxed text-zinc-500 sm:mt-3 sm:text-base md:text-lg dark:text-zinc-400">
            {content.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          disabled={history.length === 0 || isResetting}
          aria-label={content.resetLabel}
          title={content.resetLabel}
          className="inline-flex items-center justify-center self-start rounded-2xl border border-zinc-200 bg-white p-3 text-zinc-500 transition-colors hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-indigo-800 dark:hover:text-indigo-300 md:self-auto"
        >
          <RotateCcw className={`h-5 w-5 md:h-6 md:w-6 ${isResetting ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-[repeat(3,minmax(0,1fr))_1.2fr]">
        {statCards.map((item) => (
          <div key={item.label} className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">{item.label}</p>
              <item.icon className="h-5 w-5 text-indigo-500 md:h-6 md:w-6 dark:text-indigo-400" />
            </div>
            <p className="mt-3 text-3xl font-black text-zinc-900 sm:mt-4 sm:text-4xl dark:text-white">{item.value}</p>
          </div>
        ))}
        <div className="rounded-3xl border border-dashed border-indigo-200 bg-indigo-50/70 p-5 shadow-sm sm:col-span-2 sm:p-6 xl:col-span-1 dark:border-indigo-900/60 dark:bg-indigo-950/30">
          <div className="flex items-center gap-3">
            <ScanSearch className="h-5 w-5 text-indigo-600 md:h-6 md:w-6 dark:text-indigo-300" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-700 dark:text-indigo-300">{content.latest}</p>
          </div>
          <p className="mt-3 text-sm font-semibold text-zinc-800 sm:mt-4 sm:text-base md:text-lg dark:text-zinc-100">
            {latestRun ? new Date(latestRun).toLocaleString() : '—'}
          </p>
        </div>
      </div>
      
      <div className="grid gap-4">
        {history.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-zinc-200 px-6 py-16 text-center text-base text-zinc-400 dark:border-zinc-800 dark:text-zinc-500 md:text-lg">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-500">
              <ImageIcon className="h-8 w-8" />
            </div>
            {content.empty}
          </div>
        ) : (
          history.map((item, index) => (
            <div 
              key={item.id}
              className="rounded-3xl border border-zinc-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg sm:p-5 lg:p-6 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-800"
            >
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
                <div className="flex items-start gap-3.5 sm:items-center sm:gap-4">
                  <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 sm:h-14 sm:w-14 lg:h-16 lg:w-16 dark:bg-zinc-800 dark:text-zinc-500">
                    <ImageIcon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2.5 sm:gap-3">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-500 sm:h-8 sm:w-8 sm:text-sm dark:bg-zinc-800 dark:text-zinc-400">
                        {index + 1}
                      </span>
                      <p className="break-all text-base font-semibold text-zinc-900 sm:text-lg md:text-xl dark:text-zinc-100">{item.filename}</p>
                    </div>
                    <div className="grid gap-1.5 text-xs text-zinc-500 sm:gap-2 sm:text-sm md:text-base dark:text-zinc-400">
                      <p className="break-all"><span className="font-semibold text-zinc-700 dark:text-zinc-300">{content.fileLabel}:</span> {item.filename}</p>
                      <p><span className="font-semibold text-zinc-700 dark:text-zinc-300">{content.analyzedOn}:</span> {new Date(item.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <span className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider sm:px-4 sm:text-sm
                      ${item.prediction.includes('AI') ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300'}`}>
                      {item.prediction}
                    </span>
                    <p className="text-sm font-semibold text-zinc-700 sm:text-base md:text-lg dark:text-zinc-300">{item.confidence}% {content.confidence}</p>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className={`h-full rounded-full ${item.prediction.includes('AI') ? 'bg-orange-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.max(6, item.confidence)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
