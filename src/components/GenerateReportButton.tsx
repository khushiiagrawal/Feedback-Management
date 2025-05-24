import { useState } from 'react';
import { generatePDFReport } from '@/lib/pdf-generator';

interface GenerateReportButtonProps {
  teacherId: string;
  teacherName: string;
}

export default function GenerateReportButton({ teacherId, teacherName }: GenerateReportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      // Fetch all necessary data
      const [feedbackData, sentimentData] = await Promise.all([
        fetch(`/api/feedback-trends/${teacherId}`).then(res => res.json()),
        fetch(`/api/teacher-sentiment/${teacherId}`).then(res => res.json()),
      ]);

      // Calculate average rating
      const averageRating = feedbackData.reduce((acc: number, curr: any) => acc + curr.rating, 0) / feedbackData.length;

      // Generate the report
      const report = {
        teacherName,
        averageRating,
        totalFeedbacks: feedbackData.length,
        sentimentAnalysis: sentimentData,
        feedbackTrends: feedbackData,
        comments: feedbackData.map((f: any) => f.comment).filter(Boolean),
      };

      const pdfBlob = await generatePDFReport(report);

      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `feedback-report-${teacherName}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGenerateReport}
      disabled={loading}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Generating...
        </>
      ) : (
        'Generate Report'
      )}
    </button>
  );
} 