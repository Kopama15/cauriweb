'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/lib/firebase';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export default function OtpVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone');

  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Setup and send OTP
  useEffect(() => {
    const init = async () => {
      if (!phone || typeof window === 'undefined') return;

      try {
        if (!window.recaptchaVerifier) {
          window.recaptchaVerifier = new RecaptchaVerifier(
            'recaptcha-container',
            {
              size: 'invisible',
            },
            auth
          );
        }

        const appVerifier = window.recaptchaVerifier;
        const result = await signInWithPhoneNumber(auth, phone, appVerifier);
        setConfirmationResult(result);
      } catch (err: any) {
        console.error('OTP send error:', err);
        setError(err.message || 'Erreur lors de l’envoi du code');
      }
    };

    init();
  }, [phone]);

  // 2. Handle OTP verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!confirmationResult) throw new Error('OTP non initialisé');

      await confirmationResult.confirm(otp);
      router.push('/');
    } catch (err: any) {
      console.error('OTP verify error:', err);
      setError('Code OTP invalide.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Vérification OTP</h1>

        {phone && (
          <p className="text-sm text-center mb-4 text-gray-600">
            Un code a été envoyé à <span className="font-semibold">{phone}</span>
          </p>
        )}

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              Code OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Entrez le code reçu"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>

          {/* Hidden container for Firebase reCAPTCHA */}
          <div id="recaptcha-container" />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded focus:outline-none focus:ring"
          >
            {loading ? 'Vérification...' : 'Vérifier le code'}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Vous n'avez pas reçu le code ? Réessayez dans quelques instants.
        </p>
      </div>
    </div>
  );
}
