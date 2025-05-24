'use client';
import { useState, useEffect } from 'react';
import { Rating } from '@prisma/client';

interface FeedbackStats {
  teachingQuality: { [key in Rating]: number };
  subjectKnowledge: { [key in Rating]: number };
  communication: { [key in Rating]: number };
  punctuality: { [key in Rating]: number };
  interaction: { [key in Rating]: number };
  clarity: { [key in Rating]: number };
  methodology: { [key in Rating]: number };
  overallRating: { [key in Rating]: number };
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

interface AreaOfImprovement {
  category: string;
  score: number;
  recommendation: string;
}

export default function FacultyDashboard() {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [areasOfImprovement, setAreasOfImprovement] = useState<AreaOfImprovement[]>([]);

  useEffect(() => {
    fetchFacultyFeedback();
  }, []);

  const fetchFacultyFeedback = async () => {
    try {
      const response = await fetch('/api/faculty/feedback');
      const data = await response.json();
      setStats(data.stats);
      setAreasOfImprovement(data.areasOfImprovement);
    } catch (error) {
      console.error('Error fetching faculty feedback:', error);
    }
  };

  const calculateAverageRating = (ratings: { [key in Rating]: number }) => {
    const weights = {
      POOR: 1,
      FAIR: 2,
      GOOD: 3,
      VERY_GOOD: 4,
      EXCELLENT: 5,
    };
    let total = 0;
    let count = 0;
    Object.entries(ratings).forEach(([rating, c]) => {
      total += weights[rating as Rating] * c;
      count += c;
    });
    return count > 0 ? total / count : 0;
  };

  if (!stats) {
    return <div className="text-blue-200 text-xl text-center py-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-blue-200 mb-8 text-center drop-shadow">Faculty Dashboard</h1>

        {/* Sentiment Analysis Overview */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 shadow-xl rounded-2xl p-8 mb-10 border border-blue-800">
          <h2 className="text-2xl font-bold text-blue-100 mb-6">Feedback Sentiment Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/70 border border-blue-800 rounded-xl p-6 flex flex-col items-center">
              <span className="text-green-400 text-lg font-semibold mb-2">Positive</span>
              <span className="text-3xl font-extrabold text-green-300">{stats.sentiment.positive}%</span>
            </div>
            <div className="bg-black/70 border border-blue-800 rounded-xl p-6 flex flex-col items-center">
              <span className="text-yellow-400 text-lg font-semibold mb-2">Neutral</span>
              <span className="text-3xl font-extrabold text-yellow-200">{stats.sentiment.neutral}%</span>
            </div>
            <div className="bg-black/70 border border-blue-800 rounded-xl p-6 flex flex-col items-center">
              <span className="text-red-400 text-lg font-semibold mb-2">Negative</span>
              <span className="text-3xl font-extrabold text-red-300">{stats.sentiment.negative}%</span>
            </div>
          </div>
        </div>

        {/* Areas of Improvement */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg rounded-2xl p-8 mb-10 border border-blue-700">
          <h2 className="text-2xl font-bold text-blue-100 mb-6">Areas of Improvement</h2>
          <div className="space-y-4">
            {areasOfImprovement.map((area, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 bg-black/60 rounded-lg p-4">
                <h3 className="font-semibold text-blue-200 mb-1">{area.category}</h3>
                <p className="text-sm text-blue-300 mb-2">{area.recommendation}</p>
                <div className="w-full bg-blue-900 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-blue-400 h-2.5 rounded-full"
                    style={{ width: `${area.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Feedback Analysis */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 shadow-xl rounded-2xl p-8 border border-blue-800">
          <h2 className="text-2xl font-bold text-blue-100 mb-6">Detailed Feedback Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(stats).map(([category, ratings]) => {
              if (category === 'sentiment') return null;
              const average = calculateAverageRating(ratings as { [key in Rating]: number });
              return (
                <div key={category} className="bg-black/60 border border-blue-800 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-200 mb-2">{category.replace(/([A-Z])/g, ' $1').trim()}</h3>
                  <div className="space-y-2">
                    {Object.entries(ratings).map(([rating, count]) => (
                      <div key={rating} className="flex items-center">
                        <span className="w-24 text-sm text-blue-300">{rating}</span>
                        <div className="flex-1 bg-blue-900 rounded-full h-2.5">
                          <div
                            className="bg-blue-400 h-2.5 rounded-full"
                            style={{ width: `${(count / Object.values(ratings).reduce((a, b) => a + b, 0)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-blue-100">{count}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-blue-400">
                    Average Rating: <span className="font-bold text-blue-200">{average.toFixed(1)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 