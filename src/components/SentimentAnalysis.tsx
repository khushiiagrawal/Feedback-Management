import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { SentimentResult } from '@/lib/sentiment';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SentimentAnalysisProps {
  feedback: string;
}

export default function SentimentAnalysis({ feedback }: SentimentAnalysisProps) {
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function analyzeFeedback() {
      if (!feedback) return;
      
      setLoading(true);
      try {
        const response = await fetch('/api/analyze-sentiment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: feedback }),
        });
        
        const data = await response.json();
        setSentiment(data);
      } catch (error) {
        console.error('Error analyzing sentiment:', error);
      } finally {
        setLoading(false);
      }
    }

    analyzeFeedback();
  }, [feedback]);

  if (loading) {
    return <div className="animate-pulse">Analyzing sentiment...</div>;
  }

  if (!sentiment) {
    return null;
  }

  const chartData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [
          sentiment.positive * 100,
          sentiment.neutral * 100,
          sentiment.negative * 100,
        ],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
      },
    ],
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Sentiment Analysis</h3>
      <div className="h-64">
        <Pie data={chartData} options={{ maintainAspectRatio: false }} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-green-600 font-semibold">
            {Math.round(sentiment.positive * 100)}%
          </div>
          <div className="text-sm text-gray-600">Positive</div>
        </div>
        <div>
          <div className="text-yellow-600 font-semibold">
            {Math.round(sentiment.neutral * 100)}%
          </div>
          <div className="text-sm text-gray-600">Neutral</div>
        </div>
        <div>
          <div className="text-red-600 font-semibold">
            {Math.round(sentiment.negative * 100)}%
          </div>
          <div className="text-sm text-gray-600">Negative</div>
        </div>
      </div>
    </div>
  );
} 