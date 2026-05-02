'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ElectionStage } from '@/lib/electionData';

interface StageDetailProps {
  stage: ElectionStage;
  language: string;
}

/**
 * Renders the detailed view for a selected election stage.
 */
export default function StageDetail({ stage, language }: StageDetailProps) {
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  // Load checked steps from localStorage on mount and when stage changes
  useEffect(() => {
    const saved = localStorage.getItem(`votepath-stage-${stage.id}`);
    if (saved) {
      try {
        setCheckedSteps(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved steps', e);
      }
    } else {
      setCheckedSteps({});
    }
  }, [stage.id]);

  const toggleStep = (stepIndex: number) => {
    const newState = { ...checkedSteps, [stepIndex]: !checkedSteps[stepIndex] };
    setCheckedSteps(newState);
    localStorage.setItem(`votepath-stage-${stage.id}`, JSON.stringify(newState));
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      key={stage.id} // Re-animate on stage change
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="bg-slate-900/80 backdrop-blur-md rounded-xl p-6 md:p-8 border border-slate-700 shadow-xl w-full"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
        <span className="text-6xl" aria-hidden="true">{stage.icon}</span>
        <div>
          <h2 className="text-3xl font-bold text-white">{stage.title}</h2>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mt-2 ${stage.color}`}>
            {stage.id.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Action Steps Section */}
        <div>
          <h3 className="text-xl font-semibold text-blue-300 mb-4 flex items-center">
            <span className="mr-2" aria-hidden="true">📋</span> Action Steps
          </h3>
          <ul className="space-y-3" aria-label="Action steps checklist">
            {stage.steps.map((step, idx) => {
              const isChecked = !!checkedSteps[idx];
              return (
                <li key={idx} className="flex items-start">
                  <div className="flex items-center h-6">
                    <input 
                      type="checkbox" 
                      id={`step-${stage.id}-${idx}`}
                      checked={isChecked}
                      onChange={() => toggleStep(idx)}
                      className="w-5 h-5 rounded border-slate-600 text-purple-600 focus:ring-purple-500 bg-slate-800 cursor-pointer"
                      aria-label={`Mark step ${idx + 1} as completed`}
                    />
                  </div>
                  <label 
                    htmlFor={`step-${stage.id}-${idx}`}
                    className={`ml-3 cursor-pointer select-none transition-colors duration-200 ${
                      isChecked ? 'line-through text-slate-500' : 'text-slate-200'
                    }`}
                  >
                    {step}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Documents and Tips Section */}
        <div className="space-y-8">
          {stage.documents.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-purple-300 mb-4 flex items-center">
                <span className="mr-2" aria-hidden="true">📁</span> Required Documents
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {stage.documents.map((doc, idx) => (
                  <div key={idx} className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 flex items-center shadow-sm">
                    <span className="text-2xl mr-3" aria-hidden="true">📄</span>
                    <span className="text-slate-200 text-sm font-medium">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stage.tips.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-yellow-300 mb-4 flex items-center">
                <span className="mr-2" aria-hidden="true">💡</span> Pro Tips
              </h3>
              <div className="space-y-3">
                {stage.tips.map((tip, idx) => (
                  <div key={idx} className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-700/50 shadow-sm">
                    <p className="text-yellow-100/90 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
