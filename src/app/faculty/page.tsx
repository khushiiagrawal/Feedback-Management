import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import FacultyDashboard from '@/components/FacultyDashboard';
import { redirect } from 'next/navigation';

export default async function FacultyPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  const faculty = await prisma.faculty.findUnique({
    where: { email: session.user?.email! },
  });

  if (!faculty) {
    redirect('/login');
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl text-gray-600 font-semibold mb-4">Welcome, {faculty.name}</h2>
        <p className="text-gray-600">Department: {faculty.department}</p>
      </div>

      <FacultyDashboard />
    </div>
  );
} 