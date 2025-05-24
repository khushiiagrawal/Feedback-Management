'use client';
import { useState, useEffect } from 'react';
import { Rating } from '@prisma/client';

interface FacultyFeedback {
  id: number;
  name: string;
  department: string;
  overallRating: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  areasOfImprovement: {
    category: string;
    recommendation: string;
    score?: number;
  }[];
}

export default function HODDashboard() {
  const [facultyFeedback, setFacultyFeedback] = useState<FacultyFeedback[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyFeedback | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacultyFeedback();
  }, []);

  const fetchFacultyFeedback = async () => {
    try {
      const response = await fetch('/api/hod/faculty-feedback');
      const data = await response.json();
      setFacultyFeedback(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching faculty feedback:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-blue-200 text-xl text-center py-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-blue-200 mb-8 text-center drop-shadow">HOD Dashboard</h1>

        {/* Department Overview */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 shadow-xl rounded-2xl p-8 mb-10 border border-blue-800">
          <h2 className="text-2xl font-bold text-blue-100 mb-6">Department Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/70 border border-blue-800 rounded-xl p-6 flex flex-col items-center">
              <span className="text-blue-400 text-lg font-semibold mb-2">Total Faculty</span>
              <span className="text-3xl font-extrabold text-blue-200">{facultyFeedback.length}</span>
            </div>
            <div className="bg-black/70 border border-blue-800 rounded-xl p-6 flex flex-col items-center">
              <span className="text-green-400 text-lg font-semibold mb-2">Average Rating</span>
              <span className="text-3xl font-extrabold text-green-200">
                {(facultyFeedback.reduce((acc, curr) => acc + curr.overallRating, 0) / facultyFeedback.length).toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Faculty List */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg rounded-2xl p-8 border border-blue-700">
          <h2 className="text-2xl font-bold text-blue-100 mb-6">Faculty List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-blue-900">
              <thead className="bg-blue-900/60">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Overall Rating</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-black/40 divide-y divide-blue-900">
                {facultyFeedback.map((faculty) => (
                  <tr key={faculty.id} className="hover:bg-blue-900/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-100">{faculty.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-300">{faculty.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-100">{faculty.overallRating.toFixed(1)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-300">
                      <button
                        onClick={() => setSelectedFaculty(faculty)}
                        className="text-blue-400 hover:text-blue-200 underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Faculty Details Modal */}
        {selectedFaculty && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-70 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 border-blue-800">
              <div className="mt-3">
                <h3 className="text-lg font-bold text-blue-100 text-center mb-2">{selectedFaculty.name}</h3>
                <div className="mt-2 px-4 py-3">
                  <div className="mb-4">
                    <h4 className="font-semibold text-blue-200 mb-2">Areas of Improvement</h4>
                    <ul className="list-disc list-inside mt-2">
                      {selectedFaculty.areasOfImprovement.map((area, index) => (
                        <li key={index} className="text-sm text-blue-100 mb-1">
                          <strong>{area.category}:</strong> {area.recommendation} <span className="text-xs text-blue-300">({area.score?.toFixed ? area.score.toFixed(1) : area.score}%)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setSelectedFaculty(null)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 