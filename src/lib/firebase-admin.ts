
import admin from 'firebase-admin';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let firestoreInstance: admin.firestore.Firestore | undefined;
let authInstance: admin.auth.Auth | undefined;

// --- Firebase Admin SDK Initialization ---
// This code attempts to initialize the Firebase Admin SDK.
// Initialization relies on Application Default Credentials (ADC).
// Common errors ("Could not refresh access token", "Getting metadata from plugin failed", status code 500/403)
// usually indicate problems with ADC setup or IAM permissions.

if (!getApps().length) {
  console.log("Attempting to initialize Firebase Admin SDK...");
  try {
    // Initialize using Application Default Credentials (ADC).
    // This works automatically in managed environments like App Hosting and Cloud Run
    // IF the underlying service account has the necessary IAM permissions.

    // **FOR LOCAL DEVELOPMENT (Cloud Workstations, local machine):**
    // 1. **Install Google Cloud SDK (`gcloud`)**: If not already installed.
    // 2. **Authenticate ADC**: Run `gcloud auth application-default login` in your terminal.
    //    - Make sure you log in with a Google account that has permissions in YOUR_PROJECT_ID.
    // 3. **Set Project**: Run `gcloud config set project YOUR_PROJECT_ID`. Replace YOUR_PROJECT_ID with your actual GCP Project ID.
    // 4. **Check IAM Permissions**: The Google account used in step 2 needs Firestore permissions
    //    in YOUR_PROJECT_ID. The 'Cloud Datastore User' or 'Firebase Admin SDK Administrator' roles are common.
    //    Check IAM settings in the Google Cloud Console.

    // **FOR MANAGED ENVIRONMENTS (App Hosting, Cloud Run):**
    // - The environment uses a **service account** to interact with Google Cloud services.
    // - **Check Service Account Permissions**: Go to the Google Cloud Console, find the service account
    //   used by your App Hosting/Cloud Run service, and ensure it has the necessary Firestore permissions
    //   (e.g., 'Cloud Datastore User' role) in YOUR_PROJECT_ID.

    initializeApp();
    console.log('Firebase Admin SDK initialized successfully using Application Default Credentials.');

    // Try accessing services immediately after initialization to catch permission errors early.
    try {
      firestoreInstance = getFirestore();
      authInstance = getAuth();
      console.log("Firestore and Auth services accessed successfully after initialization.");
    } catch (serviceError: any) {
      console.error("-----------------------------------------------------");
      console.error("Firebase Admin SDK initialized, BUT failed to access services (Firestore/Auth):");
      console.error("Service Access Error Code:", serviceError.code);
      console.error("Service Access Error Message:", serviceError.message);
      console.error("** LIKELY CAUSE: Insufficient IAM permissions for the authenticated account/service account.**");
      console.error("Please verify the roles/permissions in GCP IAM for the principal used by ADC.");
      console.error("Required roles often include 'Cloud Datastore User' or similar for Firestore access.");
      console.error("See setup steps above for local dev / managed environments.");
      console.error("-----------------------------------------------------");
      // Keep instances undefined so checks elsewhere fail gracefully.
    }

  } catch (error: any) {
    console.error("-----------------------------------------------------");
    console.error('Firebase Admin SDK initialization FAILED!');
    console.error("Initialization Error Code:", error.code);
    console.error("Initialization Error Message:", error.message);
    console.error("-----------------------------------------------------");
    console.error('COMMON CAUSES & SOLUTIONS:');
    console.error('1. Application Default Credentials (ADC) not configured correctly:');
    console.error('   - Local Dev: Run `gcloud auth application-default login` and `gcloud config set project YOUR_PROJECT_ID`.');
    console.error('   - Managed Env: Check the service account\'s existence and activation.');
    console.error('2. Insufficient IAM Permissions:');
    console.error('   - The account/service account used for ADC needs Firestore permissions (e.g., "Cloud Datastore User" role in GCP IAM for YOUR_PROJECT_ID).');
    console.error('3. Network Issues:');
    console.error('   - Ensure the environment can reach Google Cloud APIs (googleapis.com). Check firewall rules.');
    if (error.message?.includes('Could not refresh access token') || error.message?.includes('Getting metadata from plugin failed')) {
         console.error('SPECIFIC HINT: These errors strongly suggest an ADC setup or permission problem. Double-check steps 1 & 2.');
    }
    console.error("-----------------------------------------------------");
    // Let the application continue, but Firestore/Auth will be unusable.
  }
} else {
    console.log("Firebase Admin SDK already initialized. Accessing existing services.");
    // Access services from the existing app if not done already during initial setup
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
// Code using these exports should check if they are defined before using them.
const firestore = firestoreInstance;
const auth = authInstance;

export { admin, firestore, auth };
