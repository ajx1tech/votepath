'use client';

import React, { useState, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { ELECTION_STAGES } from '@/lib/electionData';
import { logUserJourney } from '@/lib/firebase';
import JourneyTracker from '@/components/JourneyTracker';
import StageDetail from '@/components/StageDetail';
import AIChat from '@/components/AIChat';
import QuickFacts from '@/components/QuickFacts';
import Timeline from '@/components/Timeline';
import LanguageSelector from '@/components/LanguageSelector';
import VotingDayChecklist from '@/components/VotingDayChecklist';

export default function Home() {
  const [currentStage, setCurrentStage] = useState(0);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('votepath-language');
    if (savedLang) setLanguage(savedLang);
    
    // Log initial stage on load
    logUserJourney(ELECTION_STAGES[0].id, 'IN');
  }, []);

  const handleStageSelect = (stageIdx: number) => {
    setCurrentStage(stageIdx);
    logUserJourney(ELECTION_STAGES[stageIdx].id, 'IN');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-slate-200 font-sans selection:bg-purple-500/30">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-purple-600 text-white px-4 py-2 rounded z-50 shadow-lg outline-none ring-2 ring-white"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 py-4 px-6 md:px-12 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex flex-col items-center sm:items-start mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 flex items-center">
              <span className="mr-3 text-3xl" aria-hidden="true">🗳️</span> VotePath
            </h1>
            <p className="text-slate-400 text-sm mt-1 font-medium tracking-wide">Your personal guide to voting</p>
          </div>
          <LanguageSelector language={language} onChange={setLanguage} />
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-12">
        <Tabs.Root defaultValue="journey" className="flex flex-col w-full">
          <Tabs.List 
            className="flex flex-wrap border-b border-slate-700/60 mb-10 overflow-x-auto overflow-y-hidden hide-scrollbar" 
            aria-label="Main Navigation"
          >
            <Tabs.Trigger 
              value="journey"
              className="px-6 py-4 text-sm font-medium text-slate-400 hover:text-slate-200 border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:text-purple-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-inset whitespace-nowrap"
            >
              Journey
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="learn"
              className="px-6 py-4 text-sm font-medium text-slate-400 hover:text-slate-200 border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:text-purple-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-inset whitespace-nowrap"
            >
              Learn
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="assistant"
              className="px-6 py-4 text-sm font-medium text-slate-400 hover:text-slate-200 border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:text-purple-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-inset flex items-center whitespace-nowrap"
            >
              <span className="mr-2" aria-hidden="true">🤖</span> AI Assistant
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="checklist"
              className="px-6 py-4 text-sm font-medium text-slate-400 hover:text-slate-200 border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:text-purple-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-inset flex items-center whitespace-nowrap"
            >
              <span className="mr-2" aria-hidden="true">📋</span> Checklist
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="history"
              className="px-6 py-4 text-sm font-medium text-slate-400 hover:text-slate-200 border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:text-purple-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-inset whitespace-nowrap"
            >
              History
            </Tabs.Trigger>
          </Tabs.List>

          <div className="focus-visible:outline-none rounded-lg w-full">
            <Tabs.Content value="journey" className="space-y-8 animate-in fade-in duration-700 outline-none">
              <JourneyTracker currentStage={currentStage} onStageSelect={handleStageSelect} />
              <StageDetail stage={ELECTION_STAGES[currentStage]} language={language} />
            </Tabs.Content>

            <Tabs.Content value="learn" className="animate-in fade-in duration-700 outline-none">
              <div className="mb-8 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-3">Quick Facts</h2>
                <p className="text-slate-400 text-lg">Click or press space on any card to reveal the answer.</p>
              </div>
              <QuickFacts language={language} />
            </Tabs.Content>

            <Tabs.Content value="assistant" className="animate-in fade-in duration-700 outline-none">
              <div className="max-w-4xl mx-auto">
                <AIChat language={language} currentStage={ELECTION_STAGES[currentStage].id} />
              </div>
            </Tabs.Content>

            <Tabs.Content value="checklist" className="animate-in fade-in duration-700 outline-none">
              <VotingDayChecklist />
            </Tabs.Content>

            <Tabs.Content value="history" className="animate-in fade-in duration-700 outline-none">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white mb-3">Electoral Timeline</h2>
                <p className="text-slate-400 text-lg">Key milestones in the history of Indian elections.</p>
              </div>
              <Timeline />
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800/60 py-10 px-4 text-center text-slate-500 text-sm">
        <p className="flex items-center justify-center space-x-1">
          <span>Built with</span>
          <span className="font-semibold text-purple-400">Google Gemini AI</span>
          <span className="mx-2">|</span>
          <span>Data: Election Commission of India</span>
        </p>
      </footer>
    </div>
  );
}
