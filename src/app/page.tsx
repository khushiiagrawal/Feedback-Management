import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { AcademicCapIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === 'STUDENT') {
    redirect('/student');
  } else if (session?.user?.role === 'FACULTY') {
    redirect('/faculty');
  } else if (session?.user?.role === 'HOD') {
    redirect('/hod');
  }

  return (
    <div className="min-h-screen bg-black text-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 drop-shadow mb-4">
            Faculty Feedback System
          </h1>
          <p className="mt-4 text-xl text-blue-200 max-w-3xl mx-auto">
            A comprehensive platform for students to provide feedback on faculty performance, helping improve teaching quality and student experience.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-20">
          {/* Student Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-black/80 border border-blue-700 rounded-lg p-6 shadow-xl">
              <AcademicCapIcon className="h-12 w-12 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-blue-100 mb-2 text-center">Students</h3>
              <p className="text-blue-300 mb-4 text-center">
                Provide feedback on faculty performance and help improve teaching quality.
              </p>
              <Link
                href="/login"
                className="block w-full text-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow hover:from-blue-500 hover:to-cyan-400 transition-colors duration-200"
              >
                Student Login
              </Link>
            </div>
          </div>
          {/* Faculty Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-black/80 border border-purple-700 rounded-lg p-6 shadow-xl">
              <ChartBarIcon className="h-12 w-12 text-purple-400 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-blue-100 mb-2 text-center">Faculty</h3>
              <p className="text-blue-300 mb-4 text-center">
                View feedback and analytics to improve teaching methods and student engagement.
              </p>
              <Link
                href="/login"
                className="block w-full text-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow hover:from-purple-500 hover:to-pink-400 transition-colors duration-200"
              >
                Faculty Login
              </Link>
            </div>
          </div>
          {/* HOD Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-black/80 border border-emerald-700 rounded-lg p-6 shadow-xl">
              <UserGroupIcon className="h-12 w-12 text-emerald-400 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-blue-100 mb-2 text-center">HOD</h3>
              <p className="text-blue-300 mb-4 text-center">
                Monitor department performance and make data-driven decisions.
              </p>
              <Link
                href="/login"
                className="block w-full text-center px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-500 text-white font-semibold shadow hover:from-emerald-500 hover:to-green-400 transition-colors duration-200"
              >
                HOD Login
              </Link>
            </div>
          </div>
        </div>
        {/* About Us Section */}
        <div className="bg-black/80 border border-blue-800 rounded-2xl shadow-2xl p-10 mb-12">
          <h2 className="text-3xl font-extrabold text-blue-200 mb-4 text-center">About Us</h2>
          <p className="text-blue-300 text-lg text-center max-w-3xl mx-auto">
            We are a passionate team of educators and technologists dedicated to improving the quality of education through actionable feedback. Our platform bridges the gap between students and faculty, fostering a culture of continuous improvement and collaboration.
          </p>
        </div>
        {/* Our Mission Section */}
        <div className="bg-black/80 border border-blue-800 rounded-2xl shadow-2xl p-10 mb-12">
          <h2 className="text-3xl font-extrabold text-blue-200 mb-4 text-center">Our Mission</h2>
          <p className="text-blue-300 text-lg text-center max-w-3xl mx-auto">
            Our mission is to empower students to share their voices and help faculty grow through constructive feedback. We believe in transparency, accountability, and the power of data-driven insights to transform the educational experience for everyone.
          </p>
        </div>
        {/* More Section */}
        <div className="bg-black/80 border border-blue-800 rounded-2xl shadow-2xl p-10">
          <h2 className="text-3xl font-extrabold text-blue-200 mb-4 text-center">More</h2>
          <ul className="text-blue-300 text-lg text-center max-w-3xl mx-auto space-y-2">
            <li>✔️ Anonymous and secure feedback</li>
            <li>✔️ Real-time analytics for faculty and HODs</li>
            <li>✔️ Easy-to-use interface for all users</li>
            <li>✔️ Continuous updates and improvements</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
