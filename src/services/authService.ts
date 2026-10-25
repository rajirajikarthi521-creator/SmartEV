import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types/user';

export interface AuthResponse {
  success: boolean;
  user?: UserProfile;
  error?: string;
}

/**
 * Maps Firebase Auth errors to readable user-facing messages
 */
export function mapAuthError(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please log in.';
    case 'auth/invalid-email':
      return 'The email address is invalid. Please enter a valid email.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please verify your credentials.';
    case 'auth/user-not-found':
      return 'No account was found with this email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again after a few minutes.';
    default:
      return error?.message || 'Authentication failed. Please try again.';
  }
}

/**
 * Register a new user with email and password
 */
export async function registerUser(
  email: string,
  password: string,
  displayName: string
): Promise<AuthResponse> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (displayName && displayName.trim()) {
      await updateProfile(cred.user, { displayName: displayName.trim() });
    }

    // Create user profile in Firestore
    try {
      await setDoc(doc(db, 'users', cred.user.uid), {
        displayName: displayName.trim() || cred.user.email?.split('@')[0] || 'User',
        email: cred.user.email,
        createdAt: serverTimestamp(),
      });
    } catch (profileErr) {
      console.warn('Profile document creation failed (non-blocking):', profileErr);
    }

    return {
      success: true,
      user: {
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName: displayName || cred.user.displayName || undefined,
      },
    };
  } catch (err: any) {
    return { success: false, error: mapAuthError(err) };
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    return {
      success: true,
      user: {
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName: cred.user.displayName || undefined,
      },
    };
  } catch (err: any) {
    return { success: false, error: mapAuthError(err) };
  }
}

/**
 * Sign out the currently logged in user
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Subscribe to authentication state changes
 */
export function onAuthChange(callback: (user: UserProfile | null) => void): () => void {
  return onAuthStateChanged(auth, (firebaseUser: User | null) => {
    if (firebaseUser) {
      callback({
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || undefined,
      });
    } else {
      callback(null);
    }
  });
}
