import { useState } from 'react';
import { Rating } from '@prisma/client';

interface FeedbackFormProps {
  facultyId: number;
  onSubmit: (data: FeedbackData) => Promise<void>;
}

interface FeedbackData {
  teachingQuality: Rating;
  subjectKnowledge: Rating;
  communication: Rating;
  punctuality: Rating;
  interaction: Rating;
  clarity: Rating;
  methodology: Rating;
  overallRating: Rating;
  comments: string;
}

const ratingOptions: Rating[] = ['POOR', 'FAIR', 'GOOD', 'VERY_GOOD', 'EXCELLENT'];

export default function StudentFeedbackForm({ facultyId, onSubmit }: FeedbackFormProps) {
  const [formData, setFormData] = useState<FeedbackData>({
    teachingQuality: 'GOOD',
    subjectKnowledge: 'GOOD',
    communication: 'GOOD',
    punctuality: 'GOOD',
    interaction: 'GOOD',
    clarity: 'GOOD',
    methodology: 'GOOD',
    overallRating: 'GOOD',
    comments: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const questions = [
    { id: 'teachingQuality', label: 'Teaching Quality' },
    { id: 'subjectKnowledge', label: 'Subject Knowledge' },
    { id: 'communication', label: 'Communication Skills' },
    { id: 'punctuality', label: 'Punctuality' },
    { id: 'interaction', label: 'Student Interaction' },
    { id: 'clarity', label: 'Clarity in Teaching' },
    { id: 'methodology', label: 'Teaching Methodology' },
    { id: 'overallRating', label: 'Overall Rating' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Faculty Feedback Form</h2>
      
      {questions.map((question) => (
        <div key={question.id} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {question.label}
          </label>
          <div className="flex gap-4">
            {ratingOptions.map((rating) => (
              <label key={rating} className="inline-flex items-center">
                <input
                  type="radio"
                  name={question.id}
                  value={rating}
                  checked={formData[question.id as keyof FeedbackData] === rating}
                  onChange={(e) => setFormData({
                    ...formData,
                    [question.id]: e.target.value as Rating,
                  })}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">{rating}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Additional Comments
        </label>
        <textarea
          value={formData.comments}
          onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={4}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Submit Feedback
      </button>
    </form>
  );
} 