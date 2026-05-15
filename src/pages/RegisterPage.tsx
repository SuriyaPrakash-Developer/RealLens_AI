import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { UserRoundPlus, User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { useAuthStore } from '../store/useAuthStore';
import { registerUser } from '../utils/authApi';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const language = usePreferencesStore((state) => state.language);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const contentByLanguage = {
    en: {
      badge: 'Create Account',
      title: 'Get started with RealLens AI',
      description: 'Create an account and begin tracking your visual art analysis journey.',
      helperTitle: 'Create your secure account',
      helperBody: 'After registration, your classifier history and personalized settings stay organized in one workspace.',
      name: 'Full Name',
      namePlaceholder: 'Your name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      terms: 'I agree to the terms of service and privacy policy',
      submit: 'Register',
      submitting: 'Creating account...',
      nameError: 'Enter your full name.',
      emailError: 'Enter a valid email address.',
      passwordError: 'Password must be at least 6 characters.',
      confirmPasswordError: 'Passwords do not match.',
      termsError: 'Accept the terms to continue.',
      success: 'Account registered successfully. You can now log in.',
      switchText: 'Already have an account?',
      switchLink: 'Login',
    },
    ta: {
        badge: 'புதிய கணக்கு',
        title: 'RealLens AI-ல் தொடங்குங்கள்',
        description: 'கணக்கை உருவாக்கி உங்கள் கலை ஆய்வுகளை சேமிக்க தொடங்குங்கள்.',
        helperTitle: 'உங்கள் கணக்கை பாதுகாப்பாக உருவாக்குங்கள்',
        helperBody: 'பதிவு செய்தவுடன் உங்கள் வகைப்படுத்தல் வரலாறு மற்றும் தனிப்பயன் அமைப்புகள் ஒரே இடத்தில் சேமிக்கப்படும்.',
        name: 'முழு பெயர்',
        namePlaceholder: 'உங்கள் பெயர்',
        email: 'மின்னஞ்சல்',
        password: 'கடவுச்சொல்',
        confirmPassword: 'கடவுச்சொல் உறுதிப்படுத்து',
        terms: 'சேவை விதிமுறைகள் மற்றும் தனியுரிமை கொள்கைக்கு நான் ஒப்புக்கொள்கிறேன்',
        submit: 'பதிவு செய்',
        submitting: 'பதிவு செய்கிறது...',
        nameError: 'உங்கள் முழு பெயரை உள்ளிடுங்கள்.',
        emailError: 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடுங்கள்.',
        passwordError: 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்.',
        confirmPasswordError: 'இரண்டு கடவுச்சொற்களும் பொருந்தவில்லை.',
        termsError: 'தொடர சேவை விதிமுறைகளை ஏற்கவும்.',
        success: 'கணக்கு வெற்றிகரமாக பதிவு செய்யப்பட்டது. உள்நுழையலாம்.',
        switchText: 'ஏற்கனவே கணக்கு உள்ளதா?',
        switchLink: 'உள்நுழை',
      },
    hi: {
      badge: 'नया खाता',
      title: 'RealLens AI के साथ शुरू करें',
      description: 'खाता बनाएं और अपनी विजुअल आर्ट विश्लेषण यात्रा को ट्रैक करना शुरू करें।',
      helperTitle: 'अपना सुरक्षित खाता बनाएं',
      helperBody: 'रजिस्ट्रेशन के बाद आपका क्लासिफायर इतिहास और निजी सेटिंग्स एक ही वर्कस्पेस में संगठित रहते हैं।',
      name: 'पूरा नाम',
      namePlaceholder: 'आपका नाम',
      email: 'ईमेल',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      terms: 'मैं सेवा की शर्तों और गोपनीयता नीति से सहमत हूं',
      submit: 'रजिस्टर',
      submitting: 'खाता बनाया जा रहा है...',
      nameError: 'अपना पूरा नाम दर्ज करें।',
      emailError: 'मान्य ईमेल पता दर्ज करें।',
      passwordError: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।',
      confirmPasswordError: 'दोनों पासवर्ड समान नहीं हैं।',
      termsError: 'जारी रखने के लिए शर्तें स्वीकार करें।',
      success: 'खाता सफलतापूर्वक बनाया गया। अब आप लॉगिन कर सकते हैं।',
      switchText: 'क्या पहले से खाता है?',
      switchLink: 'लॉगिन',
    },
  };
  const content = contentByLanguage[language];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (fullName.trim().length < 2) {
      setErrorMessage(content.nameError);
      return;
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmailValid) {
      setErrorMessage(content.emailError);
      return;
    }

    if (password.length < 6) {
      setErrorMessage(content.passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(content.confirmPasswordError);
      return;
    }

    if (!agree) {
      setErrorMessage(content.termsError);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await registerUser(fullName.trim(), email, password);

      if (!result.ok || !result.token || !result.user) {
        setErrorMessage(result.error || 'Unable to create account right now.');
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
    <main className="mx-auto w-full max-w-none px-4 py-10 sm:px-6 lg:px-10 xl:px-12 md:py-14">
      <section className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <motion.form
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          onSubmit={handleSubmit}
          className="order-2 rounded-4xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 md:p-8 lg:order-1"
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
            <label htmlFor="register-name" className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">{content.name}</label>
            <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 transition-colors focus-within:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-within:border-indigo-600">
              <User className="h-4 w-4 text-zinc-400" />
              <input
                id="register-name"
                type="text"
                required
                value={fullName}
                onChange={(event) => {
                  setFullName(event.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full bg-transparent py-3 text-sm text-zinc-800 outline-none dark:text-zinc-100"
                placeholder={content.namePlaceholder}
                autoComplete="name"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="register-email" className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">{content.email}</label>
            <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 transition-colors focus-within:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-within:border-indigo-600">
              <Mail className="h-4 w-4 text-zinc-400" />
              <input
                id="register-email"
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
            <label htmlFor="register-password" className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">{content.password}</label>
            <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 transition-colors focus-within:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-within:border-indigo-600">
              <Lock className="h-4 w-4 text-zinc-400" />
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full bg-transparent py-3 text-sm text-zinc-800 outline-none dark:text-zinc-100"
                placeholder="••••••••"
                autoComplete="new-password"
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

          <div className="mt-4">
            <label htmlFor="register-confirm-password" className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">{content.confirmPassword}</label>
            <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 transition-colors focus-within:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-within:border-indigo-600">
              <Lock className="h-4 w-4 text-zinc-400" />
              <input
                id="register-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full bg-transparent py-3 text-sm text-zinc-800 outline-none dark:text-zinc-100"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                className="rounded-md p-1 text-zinc-500 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-300"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <label className="mt-4 flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={agree}
              onChange={(event) => {
                setAgree(event.target.checked);
                if (errorMessage) setErrorMessage(null);
              }}
              required
              className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>{content.terms}</span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-indigo-300 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <UserRoundPlus className="h-4 w-4" />
            {isSubmitting ? content.submitting : content.submit}
          </button>

          <p className="mt-5 text-center text-sm text-zinc-500 dark:text-zinc-400">
            {content.switchText}{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
              {content.switchLink}
            </Link>
          </p>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="order-1 rounded-4xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 md:p-8 lg:order-2"
        >
          <div className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300">
            {content.badge}
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-zinc-900 md:text-5xl dark:text-white">{content.title}</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600 md:text-lg dark:text-zinc-300">{content.description}</p>

          <div className="mt-8 rounded-3xl border border-zinc-100 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">{content.helperTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{content.helperBody}</p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
