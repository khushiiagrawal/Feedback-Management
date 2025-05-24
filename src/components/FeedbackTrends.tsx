import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface FeedbackData {
  date: string;
  rating: number;
}

interface FeedbackTrendsProps {
  teacherId: string;
}

export default function FeedbackTrends({ teacherId }: FeedbackTrendsProps) {
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeedbackTrends() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/feedback-trends/${teacherId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch feedback trends');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }
        setFeedbackData(data);
      } catch (error) {
        console.error('Error fetching feedback trends:', error);
        setError(error instanceof Error ? error.message : 'Failed to load feedback trends');
      } finally {
        setLoading(false);
      }
    }

    if (teacherId) {
      fetchFeedbackTrends();
    }
  }, [teacherId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  if (!feedbackData || feedbackData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No feedback data available
      </div>
    );
  }

  const chartData = {
    labels: feedbackData.map(item => item.date),
    datasets: [
      {
        label: 'Average Rating',
        data: feedbackData.map(item => item.rating),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Feedback Trends Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
} 