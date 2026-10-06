// Provider configuration; Firebase initialization remains in firebase-config.js.
// Retained for the existing restored-session integration and compatibility callers.
export {auth} from './firebase-config.js';
export {signInWithEmailAndPassword} from 'firebase/auth';
import { GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider, OAuthProvider } from 'firebase/auth';
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({prompt:'select_account'});
googleProvider.addScope('email');
export const githubProvider = new GithubAuthProvider();
githubProvider.addScope('user:email');
export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');
export const yahooProvider = new OAuthProvider('yahoo.com');
yahooProvider.addScope('profile');
yahooProvider.addScope('email');
