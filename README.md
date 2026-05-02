# 🗳️ VotePath — Your Personal Election Guide

> Built for PromptWars: Virtual Hackathon | Challenge: Election Process Education

## 🎯 Challenge Vertical
**Election Process Education** — Making democratic participation accessible to every citizen through an intelligent, multilingual, step-by-step voting guide.

## 💡 Problem Statement
Millions of eligible voters — especially first-timers, rural citizens, and elderly voters — skip elections due to confusion about the process. VotePath eliminates that confusion with a personalized, AI-powered journey guide.

## ✨ Features
- 🧭 **Voting Journey Tracker** — 5-stage interactive progress tracker from unregistered to post-voting
- 🤖 **AI Chat Assistant** — Powered by Google Gemini, answers any election question in real time
- 🎙️ **Voice Input** — Web Speech API for hands-free interaction
- 🌐 **Multilingual** — English, Hindi, Marathi, Tamil, Bengali via Gemini Translation
- 📋 **Voting Day Checklist** — Interactive checklist with localStorage persistence
- 🃏 **Quick Facts** — Flip cards covering key electoral concepts
- 📅 **Election History Timeline** — India's key electoral milestones
- 📶 **Offline Mode** — Service Worker caches content for low-connectivity areas
- ♿ **WCAG 2.1 AA Accessible** — Screen reader support, keyboard nav, high contrast

## 🛠️ Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Radix UI
- **AI**: Google Gemini API (generative-ai SDK)
- **Database**: Firebase Firestore (journey analytics)
- **Translation**: Google Gemini multilingual capability
- **Offline**: Service Worker + PWA manifest
- **Deployment**: Google Cloud Run (Docker)

## 🏗️ Architecture
User Input → Gemini AI → Structured Response
Firebase Firestore ← Journey Analytics
Service Worker → Offline Cache

## 🚀 Running Locally
```bash
git clone https://github.com/ajx1tech/votepath
cd votepath
npm install
# Add keys to .env.local
npm run dev
```

## ✅ Testing
```bash
npm test
npm run test:coverage
```

## 🔐 Security
- CSP headers on all routes
- DOMPurify sanitizes all AI responses
- API keys in .env.local only
- Rate limiting on Gemini API calls
- XSS prevention on all inputs

## 🌐 Live Demo
[Deployed on Google Cloud Run](YOUR_CLOUD_RUN_URL)

## Google Services Used
- **Google Gemini API** — Conversational AI assistant + translation
- **Firebase Firestore** — User journey analytics
- **Google Cloud Run** — Containerized deployment

Built with ❤️ for democracy by [Ajit Sharma](https://github.com/ajx1tech) at PromptWars Virtual 2026
