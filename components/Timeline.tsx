'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ELECTION_TIMELINE } from '@/lib/electionData';

export default function Timeline() {
  return (
    <div 
      className="max-w-4xl mx-auto py-12 px-4 sm:px-6 relative"
      aria-label="India election history timeline"
    >
      {/* Vertical center line for desktop */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-slate-800 transform -translate-x-1/2 rounded-full" aria-hidden="true"></div>
      
      {/* Vertical left line for mobile */}
      <div className="md:hidden absolute left-8 top-0 bottom-0 w-1 bg-slate-800 rounded-full" aria-hidden="true"></div>

      <div className="space-y-12">
        {ELECTION_TIMELINE.map((event, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`relative flex items-center ${isEven ? 'justify-start' : 'md:justify-end justify-start'}`}
            >
              {/* Content Box */}
              <div className={`w-full md:w-5/12 pl-12 md:pl-0 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700 shadow-xl relative z-10 hover:border-purple-500 transition-colors duration-300">
                  <div className="flex flex-col mb-2">
                    <span className="inline-block px-3 py-1 bg-purple-600/20 text-purple-300 text-sm font-bold rounded-full border border-purple-500/30 w-fit mb-2">
                      {event.year}
                    </span>
                    <h3 className="text-xl font-bold text-white">{event.event}</h3>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{event.description}</p>
                </div>
              </div>

              {/* Timeline Node */}
              <div 
                className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-purple-500 border-4 border-slate-900 transform -translate-x-1/2 z-20 shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                aria-hidden="true"
              ></div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
