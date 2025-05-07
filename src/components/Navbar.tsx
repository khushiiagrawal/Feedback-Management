import Link from 'next/link'
import { HomeIcon, ChatBubbleLeftRightIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { AcademicCapIcon} from '@heroicons/react/24/outline'

export default function Navbar() {
  return (
    <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <AcademicCapIcon className="h-8 w-8 text-cyan-400" />
              <span className="text-xl font-bold text-cyan-400">Feedback System</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center space-x-2 text-blue-300 hover:text-cyan-400 px-3 py-2 rounded-lg text-lg font-medium transition-colors duration-200"
            >
              <HomeIcon className="h-6 w-6" />
              <span>Home</span>
            </Link>
            <Link
              href="/feedback"
              className="flex items-center space-x-2 text-blue-300 hover:text-cyan-400 px-3 py-2 rounded-lg text-lg font-medium transition-colors duration-200"
            >
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
              <span>Feedback</span>
            </Link>
            <Link
              href="/admin"
              className="flex items-center space-x-2 text-blue-300 hover:text-cyan-400 px-4 py-2 rounded-lg text-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              <ChartBarIcon className="h-6 w-6" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 