'use client'

import { useEffect, useState } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import { ChartBarIcon, UserGroupIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import SentimentAnalysis from '@/components/SentimentAnalysis'
import FeedbackTrends from '@/components/FeedbackTrends'
import GenerateReportButton from '@/components/GenerateReportButton'

interface Feedback {
  id: number
  rating: number
  comments: string
  createdAt: string
  student: {
    name: string
    email: string
  }
  faculty: {
    id: number
    name: string
    subject: string
  }
}

export default function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    averageRating: 0,
    totalFaculty: 0
  })
  const [selectedTeacher, setSelectedTeacher] = useState<{ id: number; name: string } | null>(null)

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('/api/feedback')
        if (!response.ok) {
          throw new Error('Failed to fetch feedbacks')
        }
        const data = await response.json()
        setFeedbacks(data)
        
        // Calculate stats
        const totalFeedbacks = data.length
        const averageRating = data.reduce((acc: number, curr: Feedback) => acc + curr.rating, 0) / totalFeedbacks
        const uniqueFaculty = new Set(data.map((f: Feedback) => f.faculty.id)).size
        
        setStats({
          totalFeedbacks,
          averageRating: parseFloat(averageRating.toFixed(1)),
          totalFaculty: uniqueFaculty
        })

        // Set the first teacher as selected by default
        if (data.length > 0) {
          setSelectedTeacher({
            id: data[0].faculty.id,
            name: data[0].faculty.name
          })
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedbacks()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-cyan-400 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Admin Dashboard
          </h1>
          <p className="mt-5 text-xl text-blue-300">
            Monitor and analyze student feedback
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl border border-cyan-500/20">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-blue-300 truncate">Total Feedbacks</dt>
                    <dd className="text-3xl font-semibold text-cyan-400">{stats.totalFeedbacks}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl border border-cyan-500/20">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <StarIcon className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-blue-300 truncate">Average Rating</dt>
                    <dd className="text-3xl font-semibold text-cyan-400">{stats.averageRating}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl border border-cyan-500/20">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-blue-300 truncate">Total Faculty</dt>
                    <dd className="text-3xl font-semibold text-cyan-400">{stats.totalFaculty}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Selection */}
        <div className="mb-8">
          <label htmlFor="teacher" className="block text-sm font-medium text-blue-300 mb-2">
            Select Teacher
          </label>
          <select
            id="teacher"
            className="block w-full max-w-xs rounded-md bg-gray-800 border-cyan-500/20 text-cyan-400 focus:ring-cyan-500 focus:border-cyan-500"
            value={selectedTeacher?.id || ''}
            onChange={(e) => {
              const teacher = feedbacks.find(f => f.faculty.id === Number(e.target.value))
              if (teacher) {
                setSelectedTeacher({
                  id: teacher.faculty.id,
                  name: teacher.faculty.name
                })
              }
            }}
          >
            {Array.from(new Set(feedbacks.map(f => f.faculty.id))).map(id => {
              const teacher = feedbacks.find(f => f.faculty.id === id)?.faculty
              return (
                <option key={id} value={id}>
                  {teacher?.name} - {teacher?.subject}
                </option>
              )
            })}
          </select>
        </div>

        {/* Analytics Section */}
        {selectedTeacher && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6">
              <h3 className="text-lg font-medium text-cyan-400 mb-4">Sentiment Analysis</h3>
              <SentimentAnalysis
                feedback={feedbacks
                  .filter(f => f.faculty.id === selectedTeacher.id)
                  .map(f => f.comments)
                  .join(' ')}
              />
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6">
              <h3 className="text-lg font-medium text-cyan-400 mb-4">Feedback Trends</h3>
              <FeedbackTrends teacherId={String(selectedTeacher.id)} />
            </div>
          </div>
        )}

        {/* Generate Report Button */}
        {selectedTeacher && (
          <div className="flex justify-end mb-8">
            <GenerateReportButton
              teacherId={String(selectedTeacher.id)}
              teacherName={selectedTeacher.name}
            />
          </div>
        )}

        {/* Feedback Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-cyan-500/20">
          <div className="px-4 py-5 sm:px-6 border-b border-cyan-500/20">
            <h3 className="text-lg leading-6 font-medium text-cyan-400">
              Recent Feedback
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-cyan-500/20">
              <thead className="bg-gray-900/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Faculty
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Rating
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Comments
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800/30 divide-y divide-cyan-500/20">
                {feedbacks.map((feedback) => (
                  <tr key={feedback.id} className="hover:bg-gray-700/30 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-cyan-900/50 flex items-center justify-center border border-cyan-500/30">
                            <span className="text-cyan-400 font-medium">
                              {feedback.student.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-cyan-400">{feedback.student.name}</div>
                          <div className="text-sm text-blue-300">{feedback.student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-cyan-900/50 flex items-center justify-center border border-cyan-500/30">
                            <AcademicCapIcon className="h-6 w-6 text-cyan-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-cyan-400">{feedback.faculty.name}</div>
                          <div className="text-sm text-blue-300">{feedback.faculty.subject}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            className={`h-5 w-5 ${
                              feedback.rating > rating
                                ? 'text-cyan-400'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-blue-300 max-w-md">{feedback.comments}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-300">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 