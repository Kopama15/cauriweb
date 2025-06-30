'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch {
      setError("Email ou mot de passe invalide.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md border shadow-md rounded-md p-6 bg-white">
        <h2 className="text-lg font-semibold mb-4 text-center">Connexion</h2>

        {/* Tabs */}
        <div className="flex justify-between border border-black rounded-md overflow-hidden mb-4">
          <button
            onClick={() => setMode('email')}
            className={`w-1/2 py-2 text-sm font-semibold ${
              mode === 'email' ? 'bg-black text-white' : 'bg-white'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setMode('phone')}
            className={`w-1/2 py-2 text-sm font-semibold ${
              mode === 'phone' ? 'bg-black text-white' : 'bg-white'
            }`}
          >
            Téléphone
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Email login form */}
        {mode === 'email' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Adresse e-mail"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mot de passe"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        )}

        {/* Phone tab placeholder */}
        {mode === 'phone' && (
          <div className="text-center text-sm text-gray-500 mt-4">
            La connexion par téléphone arrive bientôt...
          </div>
        )}

        <p className="text-xs text-gray-500 mt-6 text-center">
          En continuant, vous acceptez nos{' '}
          <Link href="/conditions-of-use" className="text-blue-600 hover:underline">
            Conditions d&apos;utilisation
          </Link>{' '}
          et{' '}
          <Link href="/privacy-notice" className="text-blue-600 hover:underline">
            Notice de confidentialité
          </Link>
          .
        </p>

        <hr className="my-4" />

        <p className="text-sm text-center">
          Nouveau sur Cauri ?{' '}
          <Link href="/auth/signup" className="text-blue-600 font-semibold hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
