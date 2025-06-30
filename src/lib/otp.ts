// src/lib/otp.ts
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { auth } from './firebase';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

/**
 * Initializes the invisible reCAPTCHA verifier if it hasn't been initialized yet.
 */
export const setupRecaptcha = (containerId = 'recaptcha-container') => {
  if (typeof window === 'undefined') return;

  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth, // ✅ FIXED: pass auth as first argument
      containerId, // ✅ FIXED: containerId as second argument
      {
        size: 'invisible',
      }
    );
  }
};

/**
 * Sends an OTP to the given phone number using Firebase Phone Auth.
 * Stores the confirmationResult in window for later verification.
 */
export const sendOtp = async (phoneNumber: string) => {
  setupRecaptcha(); // ensure verifier is initialized
  const appVerifier = window.recaptchaVerifier!;
  window.confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};
