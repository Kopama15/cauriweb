// src/lib/otp.ts
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, getAuth } from 'firebase/auth';
import { auth } from './firebase';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export const setupRecaptcha = (containerId = 'recaptcha-container') => {
  if (typeof window === 'undefined') return;

  const resolvedAuth = getAuth(); // This avoids "appVerificationDisabledForTesting"

  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(containerId, {
      size: 'invisible',
    }, resolvedAuth);
  }
};

export const sendOtp = async (phoneNumber: string) => {
  setupRecaptcha(); // this ensures recaptchaVerifier exists
  const appVerifier = window.recaptchaVerifier!;
  window.confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};
