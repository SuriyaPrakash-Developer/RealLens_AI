import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Moon, Sun, LogIn, UserRoundPlus, LogOut } from 'lucide-react';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { useAuthStore } from '../store/useAuthStore';
import { getCopy } from '../content/copy';
import { logoutUser } from '../utils/authApi';

export default function Navbar() {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';
  const theme = usePreferencesStore((state) => state.theme);
  const toggleTheme = usePreferencesStore((state) => state.toggleTheme);
  const language = usePreferencesStore((state) => state.language);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);
  const token = useAuthStore((state) => state.token);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const content = getCopy(language).navbar;
  const navItems = [
    { to: '/', label: content.home, key: 'home' },
    { to: '/about', label: content.about, key: 'about' },
    { to: '/#classifier', label: content.classifier, key: 'classifier' },
    { to: '/#history', label: content.history, key: 'history' },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    if (location.pathname === '/about') {
      setActiveSection('about');
      return;
    }

    if (location.pathname === '/login') {
      setActiveSection('login');
      return;
    }

    if (location.pathname === '/register') {
      setActiveSection('register');
      return;
    }

    const updateActiveSection = () => {
      const sections = ['home', 'classifier', 'history']
        .map((item) => document.getElementById(item))
        .filter((section): section is HTMLElement => section !== null);

      let currentSection: HTMLElement | null = null;
      for (let index = sections.length - 1; index >= 0; index -= 1) {
        if (window.scrollY >= sections[index].offsetTop - 140) {
          currentSection = sections[index];
          break;
        }
      }

      setActiveSection(currentSection ? currentSection.id : 'home');
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
    };
  }, [location.pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const isDark = theme === 'dark';

  const handleLogout = async () => {
    try {
      if (token) {
        await logoutUser();
      }
    } finally {
      clearAuth();
      closeMenu();
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/85 backdrop-blur-md supports-backdrop-filter:bg-white/75 dark:border-zinc-800 dark:bg-zinc-950/85 dark:supports-backdrop-filter:bg-zinc-950/75">
      <div className="mx-auto w-full max-w-none px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5">
              {!isAuthRoute && (
                <div className="rounded-2xl bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                  <Shield className="h-6 w-6" />
                </div>
              )}
              <div>
                <span className="block text-xl font-black tracking-tight text-zinc-900 dark:text-white">
                  RealLens AI
                </span>
                {!isAuthRoute && (
                  <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400 xl:block dark:text-zinc-500">
                    {content.brandSubtitle}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {!isAuthRoute && (
            <div className="hidden items-center gap-2 md:flex">
              <div className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                {navItems.map((item) => {
                  const isActive = activeSection === item.key;

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-indigo-300'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                {!token && (
                  <>
                    <Link
                      to="/login"
                      aria-label={content.login}
                      title={content.login}
                      className={`rounded-full border p-2.5 transition-colors ${
                        activeSection === 'login'
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-indigo-300'
                      }`}
                    >
                      <LogIn className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/register"
                      aria-label={content.register}
                      title={content.register}
                      className={`rounded-full border p-2.5 transition-colors ${
                        activeSection === 'register'
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-indigo-300'
                      }`}
                    >
                      <UserRoundPlus className="h-4 w-4" />
                    </Link>
                  </>
                )}
                {token && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="Logout"
                    title="Logout"
                    className="rounded-full border border-zinc-200 bg-white p-2.5 text-zinc-600 transition-colors hover:text-rose-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-rose-300"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`rounded-full px-3 py-2 text-xs font-bold transition-colors ${language === 'en' ? 'bg-indigo-600 text-white' : 'text-zinc-600 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-300'}`}
                >
                  {content.english}
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ta')}
                  className={`rounded-full px-3 py-2 text-xs font-bold transition-colors ${language === 'ta' ? 'bg-indigo-600 text-white' : 'text-zinc-600 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-300'}`}
                >
                  {content.tamil}
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`rounded-full px-3 py-2 text-xs font-bold transition-colors ${language === 'hi' ? 'bg-indigo-600 text-white' : 'text-zinc-600 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-300'}`}
                >
                  {content.hindi}
                </button>
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={content.themeToggle}
                  className="rounded-full border border-zinc-200 bg-zinc-50 p-2 text-zinc-600 transition-colors hover:text-indigo-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:text-indigo-300"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {!isAuthRoute && (
            <div className="md:hidden">
              <button
                type="button"
                onClick={toggleMenu}
                aria-expanded={isOpen}
                aria-label="Toggle navigation menu"
                className="rounded-xl border border-zinc-200 bg-white p-2 text-zinc-600 shadow-sm transition-colors hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:text-indigo-300"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              {isOpen && (
                <div className="absolute right-4 top-20 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 text-left shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                  {navItems.map((item) => {
                    const isActive = activeSection === item.key;

                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={closeMenu}
                        className={`block rounded-xl px-4 py-3.5 text-base font-semibold transition-colors ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-indigo-300'
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                  {!token && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <Link
                        to="/login"
                        onClick={closeMenu}
                        className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                          activeSection === 'login'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        <LogIn className="h-4 w-4" />
                        {content.login}
                      </Link>
                      <Link
                        to="/register"
                        onClick={closeMenu}
                        className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                          activeSection === 'register'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        <UserRoundPlus className="h-4 w-4" />
                        {content.register}
                      </Link>
                    </div>
                  )}
                  {token && (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  )}
                  <div className="mt-3 rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
                    <div className="mb-3 px-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                      {content.languageLabel}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setLanguage('en')}
                        className={`flex-1 rounded-lg px-3 py-2.5 text-base font-semibold ${language === 'en' ? 'bg-indigo-600 text-white' : 'bg-zinc-50 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'}`}
                      >
                        {content.english}
                      </button>
                      <button
                        type="button"
                        onClick={() => setLanguage('ta')}
                        className={`flex-1 rounded-lg px-3 py-2.5 text-base font-semibold ${language === 'ta' ? 'bg-indigo-600 text-white' : 'bg-zinc-50 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'}`}
                      >
                        {content.tamil}
                      </button>
                      <button
                        type="button"
                        onClick={() => setLanguage('hi')}
                        className={`flex-1 rounded-lg px-3 py-2.5 text-base font-semibold ${language === 'hi' ? 'bg-indigo-600 text-white' : 'bg-zinc-50 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'}`}
                      >
                        {content.hindi}
                      </button>
                      <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={content.themeToggle}
                        className="rounded-lg border border-zinc-200 p-2.5 text-zinc-600 dark:border-zinc-700 dark:text-zinc-200"
                      >
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
