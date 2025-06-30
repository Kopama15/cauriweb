'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { sendOtp } from '@/lib/otp';
import {
  parsePhoneNumberFromString,
  AsYouType,
  CountryCode,
} from 'libphonenumber-js';

const dialCodeMap: Partial<Record<CountryCode, string>> = {
  CI: '+225',
  FR: '+33',
  US: '+1',
  CA: '+1',
  GB: '+44',
  DE: '+49',
  SN: '+221',
  TG: '+228',
  BJ: '+229',
};

export default function OtpPage() {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState('+225');
  const [countryIso2, setCountryIso2] = useState<CountryCode>('CI');
  const [rawPhone, setRawPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.country_code) {
          const iso2 = data.country_code as CountryCode;
          setCountryIso2(iso2);
          setCountryCode(dialCodeMap[iso2] || '+225');
        }
      } catch {
        // fallback already set to CI / +225
      }
    };
    fetchCountry();
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const phoneNumber = parsePhoneNumberFromString(rawPhone, countryIso2);
      if (!phoneNumber || !phoneNumber.isValid()) {
        setError('Numéro invalide');
        return;
      }

      const e164 = phoneNumber.number;
      await sendOtp(e164);
      router.push(`/auth/otp/verify?phone=${encodeURIComponent(e164)}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue');
      }
    }
  };

  const handlePhoneChange = (input: string) => {
    const formatter = new AsYouType(countryIso2);
    const formatted = formatter.input(input);
    setRawPhone(formatted);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Créer un compte</h1>

        <div className="flex justify-center mb-4">
          <button className="bg-gray-300 text-black px-4 py-2 rounded-l">Email</button>
          <button className="bg-yellow-400 text-black px-4 py-2 rounded-r font-semibold">Téléphone</button>
        </div>

        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}

        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
            <div className="flex gap-2 items-center">
              <img
                src={`https://flagcdn.com/w40/${countryIso2.toLowerCase()}.png`}
                alt="flag"
                className="w-6 h-4 object-cover border border-gray-300 rounded-sm"
              />
              <input
                type="tel"
                value={rawPhone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder={`Numéro sans indicatif (${countryCode})`}
                required
                className="flex-grow border border-gray-300 rounded p-2 text-sm"
              />
            </div>
          </div>

          <div id="recaptcha-container" />

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded focus:outline-none focus:ring"
          >
            Continuer
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4">
          En créant un compte, vous acceptez les{' '}
          <Link href="/conditions-of-use" className="text-blue-600 hover:underline">
            Conditions d&apos;utilisation
          </Link>{' '}
          et la{' '}
          <Link href="/privacy-notice" className="text-blue-600 hover:underline">
            Politique de confidentialité
          </Link>
          .
        </p>

        <hr className="my-6" />

        <p className="text-sm text-center">
          Déjà un compte ?{' '}
          <Link href="/auth/signin" className="text-blue-600 font-semibold hover:underline">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
}
