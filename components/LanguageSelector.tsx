'use client';

import React, { useEffect, useState } from 'react';

interface LanguageSelectorProps {
  language: string;
  onChange: (lang: string) => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'mr', name: 'Marathi (मराठी)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
];

export default function LanguageSelector({ language, onChange }: LanguageSelectorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    onChange(newLang);
    localStorage.setItem('votepath-language', newLang);
  };

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="relative inline-block w-48">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <span aria-hidden="true" className="text-slate-400">🌐</span>
      </div>
      <select
        value={language}
        onChange={handleChange}
        className="block w-full appearance-none bg-slate-800 border border-slate-700 text-white py-2 pl-10 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer transition-colors hover:bg-slate-700"
        aria-label="Select language"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
}
