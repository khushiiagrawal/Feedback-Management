import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const student = await prisma.student.findFirst({
    where: {
      email: session.user?.email as string,
    },
    select: {
      id: true,
      name: true,
      email: true,
      usn: true,
    },
  });

  if (!student) {
    redirect('/login');
  }

  const faculty = await prisma.faculty.findMany({
    select: {
      id: true,
      name: true,
      department: true,
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 shadow-xl rounded-2xl p-8 mb-10 border border-blue-800">
          <h1 className="text-3xl font-extrabold text-gray-600  mb-2">Welcome, <span className="text-white">{student.name}</span></h1>
          <div className="flex flex-col md:flex-row md:space-x-8 mt-4">
            <div className="flex-1 bg-black/60 rounded-xl p-6 border border-blue-800 mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-blue-300 mb-2">Your Information</h2>
              <p className="text-blue-100 mb-1"><span className="font-semibold text-blue-400">USN:</span> {student.usn}</p>
              <p className="text-blue-100"><span className="font-semibold text-blue-400">Email:</span> {student.email}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg rounded-2xl p-8 border border-blue-700">
          <h2 className="text-2xl font-bold text-blue-100 mb-6">Faculty List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faculty.map((f) => (
              <div key={f.id} className="bg-black/70 border border-blue-800 rounded-xl p-6 flex flex-col items-start shadow hover:shadow-xl transition-shadow duration-200">
                <h3 className="font-semibold text-lg text-blue-200 mb-1">{f.name}</h3>
                <p className="text-blue-400 mb-4">{f.department}</p>
                <Link
                  href={`/feedback/${f.id}`}
                  className="mt-auto inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow hover:from-blue-500 hover:to-blue-300 transition-colors duration-200"
                >
                  Give Feedback
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 