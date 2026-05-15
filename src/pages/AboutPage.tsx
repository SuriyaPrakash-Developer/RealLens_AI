import React from 'react';
import { motion } from 'motion/react';
import { Layers3, ScanSearch, Database, Workflow } from 'lucide-react';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { getCopy } from '../content/copy';

const architectureIcons = [Layers3, ScanSearch, Workflow, Database];

export default function AboutPage() {
  const language = usePreferencesStore((state) => state.language);
  const content = getCopy(language).aboutPage;

  return (
    <main className="mx-auto w-full max-w-none px-4 py-10 sm:px-6 lg:px-10 xl:px-12 md:py-14">
      <section className="mb-12 text-center md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300"
        >
          {content.badge}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-6 text-4xl font-black tracking-tight text-zinc-900 md:text-5xl xl:text-6xl dark:text-white"
        >
          {content.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-5 max-w-5xl text-lg leading-relaxed text-zinc-600 md:text-xl dark:text-zinc-300"
        >
          {content.intro}
        </motion.p>
      </section>

      <section className="mb-12 rounded-4xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
        <h2 className="text-2xl font-black tracking-tight text-zinc-900 md:text-3xl dark:text-white">{content.architectureTitle}</h2>
        <p className="mt-4 max-w-6xl text-base leading-relaxed text-zinc-600 md:text-lg dark:text-zinc-300">{content.architectureBody}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {content.architectureLayers.map((layer, index) => {
            const Icon = architectureIcons[index];
            return (
              <div key={layer.title} className="rounded-3xl border border-zinc-100 bg-zinc-50 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <Icon className="mb-4 h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{layer.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{layer.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-4xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 md:text-3xl dark:text-white">{content.stepsTitle}</h2>
          <ol className="mt-6 space-y-4">
            {content.steps.map((step, index) => (
              <li key={step} className="flex gap-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <p className="text-sm leading-relaxed text-zinc-600 md:text-base dark:text-zinc-300">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-4xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 md:text-3xl dark:text-white">{content.stackTitle}</h2>
          <div className="mt-6 space-y-4">
            {content.stack.map((item) => (
              <div key={item} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-600 md:text-base dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}