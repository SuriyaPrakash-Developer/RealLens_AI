import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { getCopy } from '../content/copy';

interface UploadZoneProps {
  onUpload: (file: File) => void;
  onError: (message: string) => void;
  isLoading: boolean;
}

export default function UploadZone({ onUpload, onError, isLoading }: UploadZoneProps) {
  const language = usePreferencesStore((state) => state.language);
  const content = getCopy(language).upload;
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Simulate progress when loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setUploadStatus('uploading');
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);
    } else if (uploadStatus === 'uploading') {
      setProgress(100);
      setUploadStatus('success');
      setTimeout(() => {
        // Keep success state for a bit then go back to idle if needed
        // but usually we keep the preview
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleFile = (file: File) => {
    if (!file) return;

    // Reset status
    setUploadStatus('idle');
    setProgress(0);

    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadStatus('error');
      onError(content.invalidType);
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setUploadStatus('error');
      onError(`${content.largeFile} (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    onUpload(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  const openFilePicker = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setUploadStatus('idle');
    setProgress(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-0">
      <div
        onClick={openFilePicker}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`relative group cursor-pointer rounded-4xl border-2 border-dashed transition-all duration-500 min-h-96 flex flex-col items-center justify-center gap-4 overflow-hidden
          ${isDragging ? 'border-indigo-500 bg-indigo-50/60 scale-[1.01] dark:bg-indigo-950/20' : 'border-zinc-300 hover:border-indigo-400 bg-white dark:border-zinc-700 dark:bg-zinc-900'}
          ${isLoading ? 'pointer-events-none' : ''}
          ${uploadStatus === 'success' ? 'border-emerald-500 bg-emerald-50/10' : ''}
          ${uploadStatus === 'error' ? 'border-rose-500 bg-rose-50/10' : ''}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_28%)]" />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div 
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 w-full h-full"
            >
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors duration-300" />
              
              {!isLoading && (
                <button
                  onClick={removeFile}
                  type="button"
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-zinc-900 hover:bg-white hover:scale-110 transition-all shadow-lg z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative z-10 flex max-w-4xl flex-col items-center gap-5 px-4 text-center"
            >
              <div className="p-5 rounded-full bg-indigo-50 text-indigo-600 ring-8 ring-white shadow-lg group-hover:scale-110 transition-transform duration-500 dark:bg-indigo-950/60 dark:ring-zinc-900 dark:text-indigo-300">
                <Upload className="w-10 h-10" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white">{content.title}</p>
                <p className="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">{content.support}</p>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  openFilePicker();
                }}
                className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-colors hover:bg-indigo-700"
              >
                {content.chooseImage}
              </button>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-zinc-600">
                {content.chips.map((chip) => (
                  <span key={chip} className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">{chip}</span>
                ))}
              </div>
              
            </motion.div>
          )}
        </AnimatePresence>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFile(e.target.files[0]);
            }
            e.target.value = '';
          }}
          accept="image/jpeg,image/png,image/webp"
        />

        {/* Overlay for Loading/Success/Error */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-8 z-20"
            >
              <div className="relative mb-6">
                <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-indigo-600">{Math.round(progress)}%</span>
                </div>
              </div>
              
              <div className="w-full max-w-xs bg-zinc-100 rounded-full h-2 mb-4 overflow-hidden">
                <motion.div 
                  className="bg-indigo-600 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                />
              </div>
              
              <p className="text-lg font-bold text-indigo-900 animate-pulse">{content.processingTitle}</p>
              <p className="mt-1 text-sm text-indigo-500">{content.processingBody}</p>
            </motion.div>
          )}

          {!isLoading && uploadStatus === 'success' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg z-20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{content.complete}</span>
            </motion.div>
          )}

          {!isLoading && uploadStatus === 'error' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500 text-white text-xs font-bold shadow-lg z-20"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{content.failed}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
