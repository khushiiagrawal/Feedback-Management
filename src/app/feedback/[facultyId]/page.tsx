'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

type Rating = 'POOR' | 'FAIR' | 'GOOD' | 'VERY_GOOD' | 'EXCELLENT';

export default function FeedbackForm({ params }: { params: { facultyId: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [facultyName, setFacultyName] = useState('');

  const [ratings, setRatings] = useState({
    teachingQuality: 'GOOD' as Rating,
    subjectKnowledge: 'GOOD' as Rating,
    communication: 'GOOD' as Rating,
    punctuality: 'GOOD' as Rating,
    interaction: 'GOOD' as Rating,
    clarity: 'GOOD' as Rating,
    methodology: 'GOOD' as Rating,
    overallRating: 'GOOD' as Rating,
  });

  const [comments, setComments] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/student/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          facultyId: parseInt(params.facultyId),
          ...ratings,
          comments,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit feedback');
      }

      router.push('/student');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (field: keyof typeof ratings, value: Rating) => {
    setRatings(prev => ({ ...prev, [field]: value }));
  };

  if (status === 'loading') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Submit Feedback</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.entries(ratings).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <div className="flex gap-4">
                {(['POOR', 'FAIR', 'GOOD', 'VERY_GOOD', 'EXCELLENT'] as Rating[]).map((rating) => (
                  <label key={rating} className="inline-flex items-center">
                    <input
                      type="radio"
                      name={key}
                      value={rating}
                      checked={value === rating}
                      onChange={() => handleRatingChange(key as keyof typeof ratings, rating)}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">{rating}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
              Additional Comments
            </label>
            <textarea
              id="comments"
              name="comments"
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter your comments here..."
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 