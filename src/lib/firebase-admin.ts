import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

// Ensure Firebase Admin is initialized only once
if (!getApps().length) {
  try {
    admin.initializeApp({
      // Use Application Default Credentials (ADC) which App Hosting provides automatically
      // No need to explicitly provide credentials here when deployed to App Hosting
      // For local development, ensure ADC are set up (gcloud auth application-default login)
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Firebase Admin SDK initialization failed:', error);
    // Fallback for local development without ADC (less secure, use only for testing)
    // Requires a service account key file (firebase-service-account.json)
    // Make sure this file is in .gitignore
    try {
        const serviceAccount = require('../../firebase-service-account.json'); // Adjust path if needed
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
         console.log('Firebase Admin SDK initialized with service account.');
    } catch (saError) {
         console.error('Firebase Admin SDK initialization with service account failed:', saError);
         console.error('Ensure Application Default Credentials are set or a service account key is available.');
    }
  }
}

const firestore = admin.firestore();
const auth = admin.auth();
// Export other admin services as needed

export { admin, firestore, auth };
