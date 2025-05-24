'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    setLoading(false);
    if (res?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-black/80 border border-blue-800 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-blue-200 mb-6 text-center drop-shadow">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-blue-300 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-blue-700 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-blue-300 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-blue-700 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg shadow hover:from-blue-500 hover:to-cyan-400 transition-colors duration-200 mt-2"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-8 text-center text-blue-300 text-sm">
          <p>Use your registered email and password to sign in.</p>
          <p className="mt-2">Student: <span className="text-blue-100">student1@example.com</span></p>
          <p>Faculty: <span className="text-blue-100">faculty1@example.com</span></p>
          <p>HOD: <span className="text-blue-100">hod@example.com</span></p>
          <p className="mt-2">Password for all: <span className="text-blue-100">password123</span></p>
        </div>
      </div>
    </div>
  );
} 