'use client';

import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { askElectionAssistant, ChatMessage } from '@/lib/geminiService';

interface AIChatProps {
  language: string;
  currentStage: string;
}

const QUICK_QUESTIONS = [
  "How do I register to vote?",
  "What ID do I need on voting day?",
  "What is NOTA?",
  "How are votes counted?"
];

// Extend window for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function AIChat({ language, currentStage }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        // set lang based on current language if we mapped it, default to en-US for now
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, [language]);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert('Speech recognition is not supported in this browser.');
      }
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Optional: Add local debounce/rate limit UI here to prevent rapid clicking
    if (isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setRateLimitMessage('');

    try {
      const responseText = await askElectionAssistant(text, messages, language);
      if (responseText === "I'm having trouble connecting right now. Please try again in a moment.") {
        setRateLimitMessage("Please wait... taking a moment to process.");
      }
      const assistantMsg: ChatMessage = { role: 'assistant', content: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
      setRateLimitMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] bg-slate-900 rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-xl">
            🤖
          </div>
          <div>
            <h3 className="font-bold text-white">VotePath Assistant</h3>
            <p className="text-xs text-slate-400">Powered by Gemini AI</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <div className="text-center text-slate-400 mt-10">
            <p className="mb-6">Hello! I'm here to help you understand the election process.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {QUICK_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="bg-slate-800 hover:bg-slate-700 text-sm text-slate-200 py-2 px-4 rounded-full border border-slate-600 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] p-3 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-purple-600 text-white rounded-br-sm' 
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm'
              }`}
            >
              {msg.role === 'user' ? (
                <p>{msg.content}</p>
              ) : (
                <div 
                  className="prose prose-invert max-w-none text-sm"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.content) }} 
                />
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-bl-sm flex space-x-2">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-800 border-t border-slate-700 relative">
        {rateLimitMessage && (
          <p className="absolute -top-6 left-4 text-xs text-yellow-500 bg-slate-900 px-2 py-1 rounded">
            {rateLimitMessage}
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <button
            type="button"
            onClick={toggleListen}
            className={`p-3 rounded-full flex-shrink-0 transition-colors ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
            title={!recognitionRef.current ? "Speech recognition not supported in your browser" : "Voice input"}
          >
            {isListening ? '🎙️' : '🎤'}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Ask a question about voting..."}
            className="flex-1 bg-slate-900 text-white placeholder-slate-400 border border-slate-600 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Ask a question about voting"
            disabled={isListening || isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-full flex-shrink-0 transition-colors"
            aria-label="Send message"
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}
