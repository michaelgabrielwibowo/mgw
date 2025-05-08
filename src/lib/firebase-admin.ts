
import admin from 'firebase-admin';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let firestoreInstance: admin.firestore.Firestore | undefined;
let authInstance: admin.auth.Auth | undefined;

// Ensure Firebase Admin is initialized only once
if (!getApps().length) {
  console.log("Attempting to initialize Firebase Admin SDK...");
  try {
    // Initialize using Application Default Credentials (ADC).
    // This works automatically in managed environments like App Hosting and Cloud Run.
    // For local development (Cloud Workstations, local machine):
    // 1. Ensure Google Cloud SDK (`gcloud`) is installed.
    // 2. Authenticate: Run `gcloud auth application-default login` in your terminal.
    // 3. Set Project: Run `gcloud config set project YOUR_PROJECT_ID`. Replace YOUR_PROJECT_ID.
    // 4. Permissions: Ensure the ADC principal (user/service account) has necessary Firestore permissions (e.g., Cloud Datastore User role).
    initializeApp();
    console.log('Firebase Admin SDK initialized successfully using Application Default Credentials.');

    // Try accessing services immediately after initialization
    try {
      firestoreInstance = getFirestore();
      authInstance = getAuth();
      console.log("Firestore and Auth services accessed successfully after initialization.");
    } catch (serviceError: any) {
      console.error("-----------------------------------------------------");
      console.error("Firebase Admin SDK initialized, BUT failed to access services (Firestore/Auth):");
      console.error("Service Access Error Code:", serviceError.code);
      console.error("Service Access Error Message:", serviceError.message);
      console.error("This often indicates permission issues with the authenticated account.");
      console.error("Please verify the roles/permissions in GCP IAM for the principal used by ADC.");
      console.error("Required roles often include 'Cloud Datastore User' or similar for Firestore access.");
      console.error("-----------------------------------------------------");
      // Decide if you want to throw or let instances be undefined
      // throw new Error('Failed to access Firebase services post-initialization.');
    }

  } catch (error: any) {
    console.error("-----------------------------------------------------");
    console.error('Firebase Admin SDK initialization FAILED!');
    console.error("Initialization Error Code:", error.code);
    console.error("Initialization Error Message:", error.message);
    console.error("-----------------------------------------------------");
    console.error('COMMON CAUSES & SOLUTIONS:');
    console.error('1. Application Default Credentials (ADC) not configured:');
    console.error('   - Run `gcloud auth application-default login` in your terminal.');
    console.error('   - Ensure you are logged in with the correct Google account.');
    console.error('2. Incorrect GCP Project Set:');
    console.error('   - Run `gcloud config set project YOUR_PROJECT_ID` (Replace YOUR_PROJECT_ID).');
    console.error('3. Insufficient Permissions:');
    console.error('   - The account used for ADC needs Firestore permissions (e.g., "Cloud Datastore User" role in GCP IAM).');
    console.error('   - If running in a service environment (Cloud Run, etc.), check the service account permissions.');
    console.error('4. Network Issues:');
    console.error('   - Ensure the environment can reach Google Cloud APIs (googleapis.com).');
    if (error.message?.includes('Could not refresh access token')) {
         console.error('SPECIFIC HINT: "Could not refresh access token" strongly suggests an ADC setup or permission problem. Double-check steps 1-3.');
    }
    console.error("-----------------------------------------------------");
    // Optional: re-throw the error if initialization is critical for the app to start
    // throw new Error('Critical Firebase Admin SDK initialization failed.');
  }
} else {
    console.log("Firebase Admin SDK already initialized. Accessing existing services.");
    // Access services from the existing app if not done already
    if (!firestoreInstance) {
       try {
           firestoreInstance = getFirestore();
           authInstance = getAuth();
           console.log("Firestore and Auth services accessed from existing app.");
       } catch (serviceError: any) {
           console.error("-----------------------------------------------------");
           console.error("Failed to access services (Firestore/Auth) from *existing* Firebase app:");
           console.error("Service Access Error Code:", serviceError.code);
           console.error("Service Access Error Message:", serviceError.message);
           console.error("This could indicate the initial setup had issues or permissions changed.");
           console.error("-----------------------------------------------------");
       }
    }
}

// Export the potentially initialized services.
// Using assertion cautiously. Consider adding checks where these are imported/used.
const firestore = firestoreInstance!;
const auth = authInstance!;

export { admin, firestore, auth };

    