'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const SignUpPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      router.push('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Signup failed.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold">Create account</h2>
        <p>
          Already a customer?{' '}
          <Link href="/auth/signin" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
        <div>
          <label className="block font-medium mb-1">Enter mobile number or email</label>
          <input
            type="email"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Your name</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Password (at least 6 characters)</label>
          <input
            type="password"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Passwords must be at least 6 characters.
          </p>
        </div>
        <div>
          <label className="block font-medium mb-1">Re-enter password</label>
          <input
            type="password"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-yellow-400 text-black w-full py-2 rounded hover:bg-yellow-300"
        >
          Continue
        </button>
        <hr className="my-4" />
        <p>
          Buying for work?{' '}
          <Link href="/business-account" className="text-blue-600 hover:underline">
            Create a free business account
          </Link>
        </p>
        <p className="text-xs text-gray-600">
          By creating an account, you agree to {'Cauri\'s'}{' '}
          <Link href="/conditions-of-use" className="text-blue-600 hover:underline">
            Conditions of Use
          </Link>{' '}and{' '}
          <Link href="/privacy-notice" className="text-blue-600 hover:underline">
            Privacy Notice
          </Link>.
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;
