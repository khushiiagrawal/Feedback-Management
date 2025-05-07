'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { StarIcon } from '@heroicons/react/20/solid'

interface Faculty {
  id: number
  name: string
  subject: string
}

export default function FeedbackPage() {
  const router = useRouter()
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    facultyId: '',
    rating: 5,
    comments: '',
  })
  const [hoveredRating, setHoveredRating] = useState(0)

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch('/api/faculty')
        if (!response.ok) {
          throw new Error('Failed to fetch faculty')
        }
        const data = await response.json()
        setFaculty(data)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load faculty members'
        console.error('Error fetching faculty:', errorMessage)
        toast.error('Failed to load faculty members')
      }
    }

    fetchFaculty()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      toast.success('Feedback submitted successfully!')
      router.push('/')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit feedback'
      console.error('Error submitting feedback:', errorMessage)
      toast.error('Failed to submit feedback. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-extrabold text-cyan-400 sm:text-5xl sm:tracking-tight lg:text-5xl">
            Submit Feedback
          </h1>
          <p className="mt-3 text-lg text-blue-300">
            Help us improve by sharing your valuable feedback
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-cyan-500/20">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <label htmlFor="studentName" className="block text-lg font-medium text-blue-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="studentName"
                  required
                  className="mt-1 block w-full rounded-lg border-2 border-cyan-500/30 bg-gray-900/50 px-4 py-3 text-md text-cyan-100 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 placeholder:text-gray-500"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="studentEmail" className="block text-lg font-medium text-blue-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="studentEmail"
                  required
                  className="mt-1 block w-full rounded-lg border-2 border-cyan-500/30 bg-gray-900/50 px-4 py-3 text-md text-cyan-100 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 placeholder:text-gray-500"
                  value={formData.studentEmail}
                  onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="facultyId" className="block text-lg font-medium text-blue-300 mb-2">
                Faculty Member
              </label>
              <select
                id="facultyId"
                required
                className="mt-1 block w-full rounded-lg border-2 border-cyan-500/30 bg-gray-900/50 px-4 py-3 text-md text-cyan-100 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200"
                value={formData.facultyId}
                onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
              >
                <option value="" className="bg-gray-900 text-lg">Select a faculty member</option>
                {faculty.map((member) => (
                  <option key={member.id} value={member.id} className="bg-gray-900 text-lg">
                    {member.name} ({member.subject})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium text-blue-300 mb-2">
                Rating
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    className="focus:outline-none transform hover:scale-110 transition-transform duration-200"
                    onMouseEnter={() => setHoveredRating(rating)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setFormData({ ...formData, rating })}
                  >
                    <StarIcon
                      className={`h-12 w-12 ${
                        rating <= (hoveredRating || formData.rating)
                          ? 'text-cyan-400'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="comments" className="block text-lg font-medium text-blue-300 mb-2">
                Comments
              </label>
              <textarea
                id="comments"
                rows={4}
                required
                className="mt-1 block w-full rounded-lg border-2 border-cyan-500/30 bg-gray-900/50 px-4 py-3 text-md text-cyan-100 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 placeholder:text-gray-500"
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                placeholder="Share your thoughts and suggestions..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-3 py-3 border border-transparent text-md font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200 transform hover:scale-105"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 