'use client';

import React, { useState } from 'react';
import { QUICK_FACTS } from '@/lib/electionData';

interface QuickFactsProps {
  language: string;
}

export default function QuickFacts({ language }: QuickFactsProps) {
  const [flipped, setFlipped] = useState<number | null>(null);

  const handleFlip = (idx: number) => {
    setFlipped(flipped === idx ? null : idx);
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFlip(idx);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {QUICK_FACTS.map((fact, idx) => {
        const isFlipped = flipped === idx;

        return (
          <div 
            key={idx}
            className="relative h-64 w-full cursor-pointer perspective-1000"
            onClick={() => handleFlip(idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            tabIndex={0}
            role="button"
            aria-expanded={isFlipped}
            aria-label={`Fact: ${fact.question}. Press space to reveal answer.`}
          >
            <div 
              className={`absolute w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front side */}
              <div 
                className="absolute w-full h-full backface-hidden bg-slate-800 rounded-xl border border-slate-700 shadow-lg flex flex-col items-center justify-center p-6 text-center"
                style={{ backfaceVisibility: 'hidden' }}
                aria-hidden={isFlipped}
              >
                <span className="text-5xl mb-4">{fact.icon}</span>
                <h3 className="text-lg font-bold text-white">{fact.question}</h3>
                <p className="text-xs text-slate-400 mt-4">Tap to reveal</p>
              </div>

              {/* Back side */}
              <div 
                className="absolute w-full h-full backface-hidden bg-purple-900 rounded-xl border border-purple-700 shadow-lg flex items-center justify-center p-6 text-center transform rotate-y-180"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                aria-hidden={!isFlipped}
              >
                <p className="text-white text-lg font-medium">{fact.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
