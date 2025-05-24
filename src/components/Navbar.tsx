'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { AcademicCapIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-lg shadow-lg border-b border-cyan-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <AcademicCapIcon className="h-8 w-8 text-cyan-400 drop-shadow-lg" />
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight drop-shadow">Feedback System</span>
            </Link>
          </div>
          {session && (
            <div className="flex items-center space-x-6">
              {session.user?.role === 'STUDENT' && (
                <Link
                  href="/student"
                  className="px-4 py-2 rounded-lg text-base font-semibold text-cyan-100 bg-gradient-to-r from-cyan-600 to-blue-600 shadow hover:from-cyan-500 hover:to-blue-500 hover:text-white transition-all duration-200 border border-cyan-500/40"
                >
                  Student Dashboard
                </Link>
              )}
              {session.user?.role === 'FACULTY' && (
                <Link
                  href="/faculty"
                  className="px-4 py-2 rounded-lg text-base font-semibold text-purple-100 bg-gradient-to-r from-purple-600 to-pink-600 shadow hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-200 border border-purple-500/40"
                >
                  Faculty Dashboard
                </Link>
              )}
              {session.user?.role === 'HOD' && (
                <Link
                  href="/hod"
                  className="px-4 py-2 rounded-lg text-base font-semibold text-emerald-100 bg-gradient-to-r from-emerald-600 to-green-600 shadow hover:from-emerald-500 hover:to-green-500 hover:text-white transition-all duration-200 border border-emerald-500/40"
                >
                  HOD Dashboard
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="ml-4 px-5 py-2 rounded-lg text-base font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 shadow hover:from-red-400 hover:to-pink-400 transition-all duration-200 border-0 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
} 