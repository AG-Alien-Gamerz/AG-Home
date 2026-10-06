import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getMessaging } from 'firebase/messaging';

const env = import.meta.env;
export const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyBfu4YI21vaAPeW6WbElRL56PHbxl6knb0',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'ag-home-3db3f.firebaseapp.com',
    projectId: env.VITE_FIREBASE_PROJECT_ID || 'ag-home-3db3f',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'ag-home-3db3f.firebasestorage.app',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '384219186370',
    appId: env.VITE_FIREBASE_APP_ID || '1:384219186370:web:b6b69a39d6cc5affa8e75b',
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || 'G-5W214BQMNJ'
};
export const appConfig = {
    adminEmail: env.VITE_ADMIN_EMAIL,
    environment: env.VITE_ENVIRONMENT,
    functionsRegion: env.VITE_FUNCTIONS_REGION || 'us-central1',
    functionsEmulatorHost: env.VITE_FUNCTIONS_EMULATOR_HOST,
    functionsEmulatorPort: env.VITE_FUNCTIONS_EMULATOR_PORT,
    mfaEnabled: env.VITE_ENABLE_TOTP_MFA === 'true'
};
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, appConfig.functionsRegion);
export let messaging = null;
try { messaging = getMessaging(app); } catch { /* Push is optional on unsupported browsers. */ }
// Never silently redirect localhost to emulators that were not requested.
if (env.DEV && env.VITE_USE_EMULATORS === 'true') {
    const host = env.VITE_FUNCTIONS_EMULATOR_HOST || '127.0.0.1';
    connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
    if (firebaseConfig.projectId.startsWith('demo-')) auth.settings.appVerificationDisabledForTesting = true;
    connectFirestoreEmulator(db, host, 8080);
    connectFunctionsEmulator(functions, host, Number(env.VITE_FUNCTIONS_EMULATOR_PORT || 5001));
}
