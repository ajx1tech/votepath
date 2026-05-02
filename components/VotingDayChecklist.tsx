'use client';

import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Confetti from 'react-confetti';

const CHECKLIST_ITEMS = [
  { id: 'id', label: 'Carry approved Photo ID (Voter ID, Aadhaar, PAN, etc.)', tooltip: 'Original ID is required. Photocopies are not accepted.' },
  { id: 'slip', label: 'Carry Voter Information Slip (if available)', tooltip: 'Helps locate your name in the roll faster, but not mandatory.' },
  { id: 'booth', label: 'Check polling booth location', tooltip: 'Verify online or via Voter Helpline app.' },
  { id: 'time', label: 'Note polling hours (usually 7 AM - 6 PM)', tooltip: 'Go early to avoid long queues.' },
  { id: 'phone', label: 'Leave mobile phone outside the booth', tooltip: 'Phones and cameras are strictly prohibited inside.' },
  { id: 'queue', label: 'Join the correct queue', tooltip: 'Separate queues exist for Men, Women, and Senior Citizens/PwD.' },
  { id: 'evm', label: 'Verify your vote via VVPAT', tooltip: 'The VVPAT slip will be visible for 7 seconds through the glass.' },
  { id: 'ink', label: 'Get indelible ink mark on left forefinger', tooltip: 'Proof that you have cast your vote.' },
];

export default function VotingDayChecklist() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    const saved = localStorage.getItem('votepath-checklist');
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const totalItems = CHECKLIST_ITEMS.length;
  const completedItems = Object.values(checkedItems).filter(Boolean).length;
  const percentage = Math.round((completedItems / totalItems) * 100);

  useEffect(() => {
    if (percentage === 100) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [percentage]);

  const toggleItem = (id: string) => {
    const newState = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(newState);
    localStorage.setItem('votepath-checklist', JSON.stringify(newState));
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-6 md:p-10 border border-slate-700 shadow-xl max-w-4xl mx-auto relative print:bg-white print:text-black print:border-none print:shadow-none">
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />}
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-slate-700 print:border-gray-300">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-3xl font-bold text-white mb-2 print:text-black">Voting Day Checklist</h2>
          <p className="text-slate-400 print:text-gray-600">Ensure you have everything ready before you leave for the polling booth.</p>
        </div>
        
        <div className="w-24 h-24 print:hidden">
          <CircularProgressbar 
            value={percentage} 
            text={`${percentage}%`}
            styles={buildStyles({
              textColor: '#fff',
              pathColor: percentage === 100 ? '#22c55e' : '#a855f7',
              trailColor: '#334155',
            })}
          />
        </div>
      </div>

      {percentage === 100 && (
        <div className="mb-8 p-4 bg-green-900/30 border border-green-500/50 rounded-lg text-center print:hidden">
          <p className="text-green-400 font-bold text-lg">You're ready to vote! 🎉</p>
        </div>
      )}

      <div className="space-y-4">
        {CHECKLIST_ITEMS.map((item) => (
          <div 
            key={item.id}
            className={`flex items-start p-4 rounded-lg border transition-colors ${
              checkedItems[item.id] 
                ? 'bg-slate-800/50 border-slate-700 print:border-gray-200' 
                : 'bg-slate-800 border-slate-600 hover:border-purple-500/50 print:border-gray-400'
            }`}
          >
            <div className="flex items-center h-6">
              <input
                id={`check-${item.id}`}
                type="checkbox"
                checked={!!checkedItems[item.id]}
                onChange={() => toggleItem(item.id)}
                className="w-6 h-6 rounded border-slate-500 text-purple-600 focus:ring-purple-500 bg-slate-900 cursor-pointer print:border-black print:w-5 print:h-5"
              />
            </div>
            <div className="ml-4">
              <label 
                htmlFor={`check-${item.id}`}
                className={`text-lg cursor-pointer select-none transition-colors ${
                  checkedItems[item.id] ? 'line-through text-slate-500 print:text-gray-400' : 'text-slate-200 print:text-black'
                }`}
              >
                {item.label}
              </label>
              {item.tooltip && (
                <p className={`text-sm mt-1 ${checkedItems[item.id] ? 'text-slate-600 print:hidden' : 'text-slate-400 print:text-gray-600'}`}>
                  ℹ️ {item.tooltip}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg border border-slate-600 transition-colors"
        >
          🖨️ Print Checklist
        </button>
      </div>
    </div>
  );
}
