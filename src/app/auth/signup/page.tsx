'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const SignUpPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du compte.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Créer un compte</h1>
        <p className="text-sm mb-4">
          Vous avez déjà un compte ?{' '}
          <a href="/auth/signin" className="text-blue-600 hover:underline">
            Se connecter
          </a>
        </p>

        <label className="block text-sm font-semibold mt-4">Numéro de téléphone ou e-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mt-1"
        />

        <label className="block text-sm font-semibold mt-4">Votre nom</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mt-1"
        />

        <label className="block text-sm font-semibold mt-4">Mot de passe (au moins 6 caractères)</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mt-1"
        />
        <p className="text-xs text-gray-600 mt-1">Les mots de passe doivent comporter au moins 6 caractères.</p>

        <label className="block text-sm font-semibold mt-4">Confirmez le mot de passe</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mt-1"
        />

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <button
          onClick={handleSignUp}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded mt-6"
        >
          Continuer
        </button>

        <div className="mt-6 border-t pt-4">
          <p className="text-sm font-semibold">Vous achetez pour le travail ?</p>
          <a href="#" className="text-blue-600 text-sm hover:underline">
            Créer un compte professionnel gratuit
          </a>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          En créant un compte, vous acceptez les{' '}
          <a href="/conditions-of-use" className="text-blue-600 hover:underline">
            Conditions d'utilisation
          </a>{' '}
          et la{' '}
          <a href="/privacy-notice" className="text-blue-600 hover:underline">
            Notice de confidentialité
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
