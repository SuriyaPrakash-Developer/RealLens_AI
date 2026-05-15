import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';
import { authFetch } from '../utils/authFetch';

const SUGGESTED_PROMPTS = [
  "How does a CNN detect AI art?",
  "What are common AI artifacts?",
  "Why is AI art detection important?",
  "How accurate is this classifier?"
];

const INITIAL_MESSAGE = "Hello! I'm your **Lens AI**. I can help you understand the technology behind this project, from CNN architectures to the ethics of deepfakes.\n\nWhat would you like to know?";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: INITIAL_MESSAGE }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleSend = async (text: string = input) => {
    const messageText = text.trim();
    if (!messageText || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: messageText };
    const currentHistory = [...messages];
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await authFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageText,
          history: currentHistory.slice(-10) // Send last 10 messages for context
        }),
      });
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error('Unexpected response format');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Chat failed');
      }

      setMessages(prev => [...prev, { role: 'model', text: data.text }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'model', text: "⚠️ " + (error.message || "I'm having trouble connecting right now. Please try again later.") }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'model', text: INITIAL_MESSAGE }]);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-3 right-3 z-50 md:bottom-8 md:right-8"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 translate-y-1 scale-[1.08] rounded-[2rem] bg-gradient-to-r from-cyan-500/25 via-indigo-500/25 to-fuchsia-500/25 blur-2xl" />
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 overflow-hidden rounded-[2rem] border border-white/40 bg-zinc-950 px-3 py-3 text-white shadow-[0_20px_60px_rgba(24,24,27,0.35)] ring-1 ring-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.08]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.32),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.28),transparent_42%)] opacity-90" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-[1.35rem] border border-white/15 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
            <div className="absolute inset-[6px] rounded-[1rem] bg-gradient-to-br from-cyan-300 via-indigo-500 to-fuchsia-500 opacity-95" />
            <MessageSquare className="relative h-5 w-5" />
          </div>
          <div className="relative hidden min-w-0 pr-1 sm:block">
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-200/85">Lens AI</div>
            <div className="text-sm font-semibold leading-tight text-white">Open Research Copilot</div>
          </div>
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/10 sm:hidden">
            <Sparkles className="h-4 w-4 text-cyan-100" />
          </div>
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close chatbot overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-sm md:bg-zinc-950/20"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 24 }}
              className="fixed inset-0 z-50 flex h-[100dvh] w-screen flex-col overflow-hidden border-y border-white/50 bg-white/80 font-sans shadow-[0_30px_100px_rgba(15,23,42,0.28)] backdrop-blur-2xl md:inset-auto md:bottom-24 md:right-8 md:h-[42rem] md:w-[27rem] md:rounded-4xl md:border dark:border-white/10 dark:bg-zinc-950/80"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.22),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.22),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.82)_0%,_rgba(244,244,245,0.86)_48%,_rgba(255,255,255,0.94)_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_30%),linear-gradient(180deg,_rgba(9,9,11,0.92)_0%,_rgba(24,24,27,0.9)_45%,_rgba(9,9,11,0.96)_100%)]" />
              <div className="pointer-events-none absolute inset-x-4 top-24 h-px bg-gradient-to-r from-transparent via-zinc-300/80 to-transparent md:inset-x-5 md:top-28 dark:via-white/10" />

              <div className="relative shrink-0 px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] md:px-6 md:pb-6 md:pt-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.35rem] border border-white/50 bg-zinc-950 text-white shadow-[0_18px_40px_rgba(79,70,229,0.22)] md:h-14 md:w-14 md:rounded-[1.6rem] dark:border-white/10 dark:bg-white/8">
                    <div className="absolute inset-[5px] rounded-[1.2rem] bg-gradient-to-br from-cyan-300 via-indigo-500 to-fuchsia-500" />
                    <Bot className="relative h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-cyan-400/35 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-200">Neural Console</span>
                      <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-200">Online</span>
                    </div>
                    <h3 className="font-display text-xl font-bold tracking-tight text-zinc-950 md:text-2xl dark:text-white">Lens AI Orbit</h3>
                    <p className="mt-1 max-w-xs text-xs leading-relaxed text-zinc-600 md:text-sm dark:text-zinc-300">
                      A guided research assistant for CNN detection logic, visual artifacts, and deepfake ethics.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={clearChat}
                    className="rounded-2xl border border-zinc-200/80 bg-white/80 p-2.5 text-zinc-500 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:border-indigo-400/40 dark:hover:text-indigo-200"
                    title="Clear Chat"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-2xl border border-zinc-200/80 bg-white/80 p-2.5 text-zinc-500 transition hover:border-rose-300 hover:text-rose-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:border-rose-400/40 dark:hover:text-rose-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 text-left sm:grid-cols-3">
                <div className="rounded-2xl border border-white/60 bg-white/70 px-3 py-2.5 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">Mode</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Explain</div>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/70 px-3 py-2.5 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">Focus</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Artifacts</div>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/70 px-3 py-2.5 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">Context</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Project</div>
                </div>
              </div>
              </div>

              <div ref={scrollRef} className="relative flex-1 space-y-4 overflow-y-auto px-4 pb-4 pt-2 md:space-y-5 md:px-6 md:pb-6">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border ${
                    msg.role === 'user'
                      ? 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-200'
                      : 'border-white/60 bg-zinc-950 text-white dark:border-white/10 dark:bg-white/10'
                  }`}>
                    {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`max-w-[90%] rounded-[1.35rem] border p-3.5 text-sm leading-relaxed shadow-sm md:max-w-[85%] md:rounded-[1.6rem] md:p-4 ${
                    msg.role === 'user' 
                    ? 'border-indigo-500/20 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-tr-md dark:from-indigo-500 dark:to-violet-500'
                    : 'border-white/60 bg-white/80 text-zinc-800 rounded-tl-md dark:border-white/10 dark:bg-white/6 dark:text-zinc-100'
                  }`}>
                    <div className="prose prose-sm prose-zinc max-w-none dark:prose-invert">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/60 bg-zinc-950 text-white dark:border-white/10 dark:bg-white/10">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 rounded-[1.6rem] rounded-tl-md border border-white/60 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/6">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600 dark:text-indigo-300" />
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Analyzing context...</span>
                  </div>
                </motion.div>
              )}

              {messages.length === 1 && (
                <div className="space-y-3 pt-2">
                  <p className="px-1 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">Suggested Topics</p>
                  <div className="grid gap-2">
                    {SUGGESTED_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(prompt)}
                        className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/75 px-3 py-3 text-left text-sm text-zinc-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-700 md:px-4 dark:border-white/10 dark:bg-white/6 dark:text-zinc-200 dark:hover:border-indigo-400/40 dark:hover:text-indigo-200"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-100 to-indigo-100 text-indigo-600 dark:from-cyan-500/10 dark:to-indigo-500/10 dark:text-indigo-200">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Prompt {i + 1}</div>
                          <div className="mt-0.5 font-medium">{prompt}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              </div>

              <div className="relative shrink-0 border-t border-white/50 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 dark:border-white/10 md:px-6 md:pb-6">
              <div className="mb-3 flex items-center justify-between px-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">
                <span>Compose Question</span>
                <span>{input.trim().length}/240</span>
              </div>
              <div className="relative flex items-center rounded-[1.5rem] border border-white/60 bg-white/80 p-2 shadow-[0_16px_40px_rgba(15,23,42,0.08)] md:rounded-[1.75rem] dark:border-white/10 dark:bg-white/6">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about CNNs or AI Art..."
                  maxLength={240}
                  className="w-full border-none bg-transparent py-3 pl-3 pr-14 text-sm text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500 md:pl-4"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 text-white shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:scale-100"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-center text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                Designed for research support. Verify important findings before relying on them.
              </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
