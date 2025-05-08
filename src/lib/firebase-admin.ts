import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

// Ensure Firebase Admin is initialized only once
if (!getApps().length) {
  try {
    // Initialize using Application Default Credentials (ADC).
    // This works automatically in App Hosting and Cloud Run environments.
    // For local development:
    // 1. Make sure you have the Google Cloud SDK installed.
    // 2. Run `gcloud auth application-default login` in your terminal.
    // 3. Ensure your gcloud CLI is configured for the correct project (`gcloud config set project YOUR_PROJECT_ID`).
    admin.initializeApp();
    console.log('Firebase Admin SDK initialized successfully using Application Default Credentials.');
  } catch (error) {
    console.error('Firebase Admin SDK initialization failed:', error);
    console.error('Ensure Application Default Credentials (ADC) are set up correctly.');
    console.error('Run `gcloud auth application-default login` and `gcloud config set project YOUR_PROJECT_ID`.');
    // Optionally, re-throw the error or handle it differently if initialization is critical
    // throw new Error('Could not initialize Firebase Admin SDK.');
  }
}

const firestore = admin.firestore();
const auth = admin.auth();
// Export other admin services as needed

export { admin, firestore, auth };
