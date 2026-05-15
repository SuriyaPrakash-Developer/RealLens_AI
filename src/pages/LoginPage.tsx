import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { useAuthStore } from '../store/useAuthStore';
import { loginUser } from '../utils/authApi';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const language = usePreferencesStore((state) => state.language);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const contentByLanguage = {
    en: {
      badge: 'Account Access',
      title: 'Welcome back',
      description: 'Sign in to continue your analysis workflow and saved history.',
      helperTitle: 'Secure Sign-In Hub',
      helperBody: 'Your classifier workspace, history timeline, and preferences stay protected inside one account.',
      secureTag: 'Secure Access',
      personalTag: 'Personal Workspace',
      email: 'Email',
      password: 'Password',
      remember: 'Remember me',
      forgot: 'Forgot password?',
      submit: 'Login',
      signingIn: 'Signing in...',
      emailError: 'Enter a valid email address.',
      passwordError: 'Password must be at least 6 characters.',
      success: 'Login successful. Redirecting to your dashboard.',
      switchText: "Don't have an account?",
      switchLink: 'Register',
    },
    ta: {
        badge: 'கணக்கு அணுகல்',
        title: 'மீண்டும் வரவேற்கிறோம்',
        description: 'உங்கள் கணக்கில் உள்நுழைந்து ஆய்வு வரலாற்றை தொடருங்கள்.',
        helperTitle: 'பாதுகாப்பான உள்நுழைவு மையம்',
        helperBody: 'உங்கள் வகைப்படுத்தி பணிச்சூழல், வரலாறு மற்றும் விருப்பங்கள் அனைத்தும் ஒரே கணக்கில் பாதுகாப்பாக இருக்கும்.',
        secureTag: 'பாதுகாப்பான அணுகல்',
        personalTag: 'தனிப்பட்ட பணிச்சூழல்',
        email: 'மின்னஞ்சல்',
        password: 'கடவுச்சொல்',
        remember: 'என்னை நினைவில் கொள்',
        forgot: 'கடவுச்சொல் மறந்துவிட்டதா?',
        submit: 'உள்நுழை',
        signingIn: 'உள்நுழைகிறது...',
        emailError: 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடுங்கள்.',
        passwordError: 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்.',
        success: 'உள்நுழைவு வெற்றி. உங்கள் டாஷ்போர்டுக்கு மாற்றப்படுகிறது.',
        switchText: 'கணக்கு இல்லையா?',
        switchLink: 'பதிவு செய்',
      },
    hi: {
      badge: 'खाता प्रवेश',
      title: 'फिर से स्वागत है',
      description: 'अपना विश्लेषण कार्यप्रवाह और सहेजा गया इतिहास जारी रखने के लिए साइन इन करें।',
      helperTitle: 'सुरक्षित साइन-इन हब',
      helperBody: 'आपका क्लासिफायर वर्कस्पेस, इतिहास और पसंद एक ही खाते में सुरक्षित रहते हैं।',
      secureTag: 'सुरक्षित प्रवेश',
      personalTag: 'व्यक्तिगत वर्कस्पेस',
      email: 'ईमेल',
      password: 'पासवर्ड',
      remember: 'मुझे याद रखें',
      forgot: 'पासवर्ड भूल गए?',
      submit: 'लॉगिन',
      signingIn: 'लॉगिन हो रहा है...',
      emailError: 'मान्य ईमेल पता दर्ज करें।',
      passwordError: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।',
      success: 'लॉगिन सफल। आपके डैशबोर्ड पर भेजा जा रहा है।',
      switchText: 'क्या आपके पास खाता नहीं है?',
      switchLink: 'रजिस्टर',
    },
  };
  const content = contentByLanguage[language];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage(null);
    setSuccessMessage(null);

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmailValid) {
      setErrorMessage(content.emailError);
      return;
    }

    if (password.length < 6) {
      setErrorMessage(content.passwordError);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await loginUser(email, password);

      if (!result.ok || !result.token || !result.user) {
        setErrorMessage(result.error || 'Unable to login with the provided credentials.');
        return;
      }

      setAuth(result.token, result.user);
      setSuccessMessage(content.success);
      navigate('/');
    } catch {
      setErrorMessage('Unable to reach the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-none items-center justify-center px-4 py-8 sm:px-6 lg:px-10 xl:px-12 md:py-12">
      <section className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-4xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="pointer-events-none absolute -left-20 top-10 h-52 w-52 rounded-full bg-indigo-100/80 blur-3xl dark:bg-indigo-900/30" />
        <div className="pointer-events-none absolute -right-20 bottom-10 h-52 w-52 rounded-full bg-sky-100/70 blur-3xl dark:bg-sky-900/20" />

        <div className="relative grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="border-b border-zinc-200 p-6 dark:border-zinc-800 lg:border-b-0 lg:border-r md:p-9"
        >
          <div className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300">
            {content.badge}
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-zinc-900 md:text-5xl dark:text-white">{content.title}</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600 md:text-lg dark:text-zinc-300">{content.description}</p>

          <div className="mt-8 rounded-3xl border border-zinc-100 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">{content.helperTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{content.helperBody}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                {content.secureTag}
              </span>
              <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                {content.personalTag}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          onSubmit={handleSubmit}
          className="p-6 md:p-9"
        >
          {errorMessage && (
            <div className="mb-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div>
            <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">{content.email}</label>
            <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 transition-colors focus-within:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-within:border-indigo-600">
              <Mail className="h-4 w-4 text-zinc-400" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full bg-transparent py-3 text-sm text-zinc-800 outline-none dark:text-zinc-100"
                placeholder="name@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="login-password" className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">{content.password}</label>
            <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 transition-colors focus-within:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-within:border-indigo-600">
              <Lock className="h-4 w-4 text-zinc-400" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full bg-transparent py-3 text-sm text-zinc-800 outline-none dark:text-zinc-100"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="rounded-md p-1 text-zinc-500 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-300"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => {
                  setRemember(event.target.checked);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
              />
              {content.remember}
            </label>
            <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
              {content.forgot}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-indigo-300 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <ShieldCheck className="h-4 w-4" />
            {isSubmitting ? content.signingIn : content.submit}
          </button>

          <p className="mt-5 text-center text-sm text-zinc-500 dark:text-zinc-400">
            {content.switchText}{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
              {content.switchLink}
            </Link>
          </p>
        </motion.form>
        </div>
      </section>
    </main>
  );
}
