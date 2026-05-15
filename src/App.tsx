import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { usePreferencesStore } from './store/usePreferencesStore';
import { useAuthStore } from './store/useAuthStore';
import { getCopy } from './content/copy';

export default function App() {
  const theme = usePreferencesStore((state) => state.theme);
  const language = usePreferencesStore((state) => state.language);
  const token = useAuthStore((state) => state.token);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const validateSession = useAuthStore((state) => state.validateSession);
  const content = getCopy(language);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    validateSession();
  }, [validateSession]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-600 dark:bg-zinc-950 dark:text-zinc-300">
        <p className="text-sm font-semibold">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-900 selection:bg-indigo-100 selection:text-indigo-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100 dark:selection:bg-indigo-700 dark:selection:text-white">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={token ? <HomePage /> : <Navigate to="/login" replace />} />
          <Route path="/about" element={token ? <AboutPage /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={token ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/register" element={token ? <Navigate to="/" replace /> : <RegisterPage />} />
        </Routes>
      </div>
      {token && <ChatBot />}
      <footer className="border-t border-zinc-200 bg-white py-4 dark:border-zinc-800 dark:bg-zinc-950 md:py-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
            {content.footer}
          </p>
        </div>
      </footer>
    </div>
  );
}
