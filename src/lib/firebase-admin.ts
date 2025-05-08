import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

// Ensure Firebase Admin is initialized only once
if (!getApps().length) {
  try {
    // Initialize using Application Default Credentials (ADC).
    // This works automatically in App Hosting and Cloud Run environments.
    // For local development (like Cloud Workstations or your local machine):
    // 1. Make sure you have the Google Cloud SDK installed (`gcloud`).
    // 2. Authenticate with Google Cloud: Run `gcloud auth application-default login` in your terminal.
    // 3. Set the correct project: Run `gcloud config set project YOUR_PROJECT_ID` (replace YOUR_PROJECT_ID).
    // 4. Ensure the service account used by ADC has the necessary Firestore permissions (e.g., Cloud Datastore User role).
    console.log("Initializing Firebase Admin SDK with Application Default Credentials...");
    admin.initializeApp();
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error("-----------------------------------------------------");
    console.error('Firebase Admin SDK initialization failed!');
    console.error("Error Code:", error.code);
    console.error("Error Message:", error.message);
    console.error("-----------------------------------------------------");
    console.error('Ensure Application Default Credentials (ADC) are set up correctly for your environment.');
    console.error('INSTRUCTIONS:');
    console.error('1. Install Google Cloud SDK (`gcloud`).');
    console.error('2. Run `gcloud auth application-default login`');
    console.error('3. Run `gcloud config set project YOUR_PROJECT_ID` (replace YOUR_PROJECT_ID)');
    console.error('4. Check Firestore permissions for the authenticated user/service account.');
    console.error('-----------------------------------------------------');
    // Optionally, re-throw the error or handle it differently if initialization is critical
    // throw new Error('Could not initialize Firebase Admin SDK.');
  }
} else {
    console.log("Firebase Admin SDK already initialized.");
}


// Attempt to get Firestore instance. This might also throw if initialization failed.
let firestoreInstance;
let authInstance;
try {
    firestoreInstance = admin.firestore();
    authInstance = admin.auth();
    console.log("Firestore and Auth services accessed successfully.");
} catch (error: any) {
    console.error("-----------------------------------------------------");
    console.error("Failed to get Firestore/Auth instance after initialization attempt:");
    console.error("Error Code:", error.code);
    console.error("Error Message:", error.message);
    console.error("This usually indicates the initialization itself failed earlier.");
    console.error("-----------------------------------------------------");
    // Set instances to potentially null/undefined or handle appropriately
    // Depending on how critical these are at startup.
    // For now, we'll let them be potentially undefined if init fails.
}

// Export the potentially initialized services
const firestore = firestoreInstance!;
const auth = authInstance!;

export { admin, firestore, auth };
