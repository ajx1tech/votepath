import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

/**
 * Logs a user's journey stage to Firestore.
 * @param {string} stage - The current stage of the user's journey.
 * @param {string} country - The user's country.
 * @returns {Promise<void>}
 */
export async function logUserJourney(stage: string, country: string): Promise<void> {
  try {
    const journeysRef = collection(db, 'journeys');
    await addDoc(journeysRef, {
      stage,
      country,
      timestamp: serverTimestamp(),
      sessionId: crypto.randomUUID()
    });
  } catch (error) {
    console.error('Error logging user journey:', error);
  }
}

/**
 * Fetches the top 5 most popular questions from Firestore.
 * @returns {Promise<string[]>} Array of popular questions.
 */
export async function getPopularQuestions(): Promise<string[]> {
  try {
    const questionsRef = collection(db, 'questions');
    const q = query(questionsRef, orderBy('count', 'desc'), limit(5));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data().question as string);
  } catch (error) {
    console.error('Error fetching popular questions:', error);
    return [];
  }
}
