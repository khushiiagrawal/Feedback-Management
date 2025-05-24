import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { SentimentResult } from './sentiment';

interface FeedbackReport {
  teacherName: string;
  averageRating: number;
  totalFeedbacks: number;
  sentimentAnalysis: SentimentResult;
  feedbackTrends: Array<{
    date: string;
    rating: number;
  }>;
  comments: string[];
}

export async function generatePDFReport(report: FeedbackReport): Promise<Blob> {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Feedback Analysis Report', 105, 20, { align: 'center' });
  
  // Teacher Information
  doc.setFontSize(16);
  doc.text(`Teacher: ${report.teacherName}`, 20, 40);
  
  // Summary Statistics
  doc.setFontSize(12);
  doc.text(`Average Rating: ${report.averageRating.toFixed(2)}/5`, 20, 60);
  doc.text(`Total Feedbacks: ${report.totalFeedbacks}`, 20, 70);
  
  // Sentiment Analysis
  doc.setFontSize(14);
  doc.text('Sentiment Analysis', 20, 90);
  doc.setFontSize(12);
  doc.text(`Positive: ${(report.sentimentAnalysis.positive * 100).toFixed(1)}%`, 30, 100);
  doc.text(`Neutral: ${(report.sentimentAnalysis.neutral * 100).toFixed(1)}%`, 30, 110);
  doc.text(`Negative: ${(report.sentimentAnalysis.negative * 100).toFixed(1)}%`, 30, 120);
  
  // Feedback Trends Table
  doc.setFontSize(14);
  doc.text('Feedback Trends', 20, 140);
  
  const tableData = report.feedbackTrends.map(trend => [
    trend.date,
    trend.rating.toString(),
  ]);
  
  (doc as any).autoTable({
    startY: 150,
    head: [['Date', 'Rating']],
    body: tableData,
  });
  
  // Comments
  doc.setFontSize(14);
  doc.text('Recent Comments', 20, (doc as any).lastAutoTable.finalY + 20);
  
  report.comments.forEach((comment, index) => {
    const y = (doc as any).lastAutoTable.finalY + 30 + (index * 10);
    if (y < 280) { // Check if we have space on the page
      doc.setFontSize(10);
      doc.text(comment, 20, y, { maxWidth: 170 });
    }
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  return doc.output('blob');
} 