import Link from 'next/link'
import { AcademicCapIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-cyan-400 sm:text-6xl">
                  Student Feedback Management System
                </h1>
                <p className="mt-6 text-lg leading-8 text-blue-300">
                  A modern platform for students to provide valuable feedback to faculty members,
                  helping improve the quality of education and teaching methods.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Link
                    href="/feedback"
                    className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:from-cyan-600 hover:to-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 transition-all duration-200 transform hover:scale-105"
                  >
                    Submit Feedback
                  </Link>
                  <Link
                    href="/admin"
                    className="text-sm font-semibold leading-6 text-blue-300 hover:text-cyan-400 transition-colors duration-200"
                  >
                    Admin Dashboard <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-cyan-400">Better Education</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-cyan-400 sm:text-4xl">
            Everything you need to improve teaching quality
          </p>
          <p className="mt-6 text-lg leading-8 text-blue-300">
            Our platform provides a comprehensive solution for collecting, analyzing, and acting upon student feedback.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-cyan-500/20">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-cyan-400">
                <AcademicCapIcon className="h-5 w-5 flex-none text-cyan-400" aria-hidden="true" />
                Faculty Evaluation
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-blue-300">
                <p className="flex-auto">Comprehensive feedback system for evaluating faculty performance and teaching methods.</p>
              </dd>
            </div>
            <div className="flex flex-col bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-cyan-500/20">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-cyan-400">
                <ChartBarIcon className="h-5 w-5 flex-none text-cyan-400" aria-hidden="true" />
                Analytics Dashboard
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-blue-300">
                <p className="flex-auto">Detailed analytics and insights to help improve teaching quality and student satisfaction.</p>
              </dd>
            </div>
            <div className="flex flex-col bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-cyan-500/20">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-cyan-400">
                <UserGroupIcon className="h-5 w-5 flex-none text-cyan-400" aria-hidden="true" />
                Student Engagement
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-blue-300">
                <p className="flex-auto">Easy-to-use interface for students to provide meaningful feedback and suggestions.</p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
