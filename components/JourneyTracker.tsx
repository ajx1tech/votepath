'use client';

import React from 'react';
import { ELECTION_STAGES } from '@/lib/electionData';

interface JourneyTrackerProps {
  currentStage: number;
  onStageSelect: (stage: number) => void;
}

/**
 * Renders the election process stages as a horizontal/vertical progress tracker.
 */
export default function JourneyTracker({ currentStage, onStageSelect }: JourneyTrackerProps) {
  return (
    <div 
      className="flex flex-col md:flex-row justify-between items-start md:items-center w-full relative mb-12"
      aria-label="Voting journey progress"
      role="progressbar"
      aria-valuenow={currentStage}
      aria-valuemin={0}
      aria-valuemax={ELECTION_STAGES.length - 1}
    >
      {ELECTION_STAGES.map((stage, index) => {
        const isCompleted = index < currentStage;
        const isCurrent = index === currentStage;
        
        return (
          <div key={stage.id} className="flex flex-row md:flex-col items-center relative z-10 flex-1 w-full md:w-auto mb-6 md:mb-0">
            {/* Desktop connecting line */}
            {index < ELECTION_STAGES.length - 1 && (
              <div 
                className={`hidden md:block absolute top-6 left-1/2 w-full h-1 ${isCompleted ? 'bg-purple-600' : 'bg-slate-700'}`} 
                style={{ zIndex: -1 }}
                aria-hidden="true"
              ></div>
            )}
            
            {/* Mobile connecting line */}
            {index < ELECTION_STAGES.length - 1 && (
              <div 
                className={`md:hidden absolute left-6 top-12 w-1 h-full ${isCompleted ? 'bg-purple-600' : 'bg-slate-700'}`} 
                style={{ zIndex: -1 }}
                aria-hidden="true"
              ></div>
            )}

            <button
              onClick={() => onStageSelect(index)}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl cursor-pointer transition-all duration-300 relative z-10
                ${isCompleted ? 'bg-purple-600 text-white' : isCurrent ? 'bg-blue-900 border-2 border-blue-400' : 'bg-slate-800 border-2 border-slate-600 hover:border-slate-400'}`}
              aria-label={`Stage ${index + 1}: ${stage.title}`}
              aria-current={isCurrent ? "step" : undefined}
            >
              {isCompleted ? '✓' : stage.icon}
              {isCurrent && (
                <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-pulse opacity-50" aria-hidden="true"></div>
              )}
            </button>
            <div className="ml-4 md:ml-0 md:mt-4 text-left md:text-center max-w-[120px]">
              <p className={`font-semibold text-sm ${isCurrent ? 'text-blue-300' : isCompleted ? 'text-purple-300' : 'text-slate-400'}`}>
                {stage.title}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
