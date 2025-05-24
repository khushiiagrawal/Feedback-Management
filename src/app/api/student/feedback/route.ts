import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { analyzeSentiment } from '@/lib/sentiment';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const student = await prisma.student.findFirst({
      where: { email: session.user.email },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const body = await req.json();
    const {
      facultyId,
      teachingQuality,
      subjectKnowledge,
      communication,
      punctuality,
      interaction,
      clarity,
      methodology,
      overallRating,
      comments,
    } = body;

    const feedback = await prisma.feedback.create({
      data: {
        studentId: student.id,
        facultyId: parseInt(facultyId),
        teachingQuality,
        subjectKnowledge,
        communication,
        punctuality,
        interaction,
        clarity,
        methodology,
        overallRating,
        comments,
      },
    });

    // Create sentiment analysis using Hugging Face model
    const sentimentResult = await analyzeSentiment(comments);
    const sentiment = await prisma.sentiment.create({
      data: {
        feedbackId: feedback.id,
        score: sentimentResult.positive - sentimentResult.negative,
        label: sentimentResult.positive > sentimentResult.negative ? 'positive' : 
               sentimentResult.negative > sentimentResult.positive ? 'negative' : 'neutral',
      },
    });

    return NextResponse.json({ feedback, sentiment });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}

function calculateSentimentScore(text: string): number {
  // Simple sentiment analysis based on positive/negative words
  const positiveWords = ['good', 'excellent', 'great', 'amazing', 'wonderful', 'best', 'helpful', 'clear', 'understandable'];
  const negativeWords = ['poor', 'bad', 'terrible', 'worst', 'confusing', 'unclear', 'difficult', 'hard', 'boring'];

  const words = text.toLowerCase().split(/\s+/);
  let score = 0;

  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1;
    if (negativeWords.includes(word)) score -= 1;
  });

  // Normalize score between -1 and 1
  return Math.max(-1, Math.min(1, score / 5));
}

function getSentimentLabel(score: number): string {
  if (score > 0.5) return 'POSITIVE';
  if (score < 0) return 'NEGATIVE';
  return 'NEUTRAL';
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get student ID from session
    const student = await prisma.student.findUnique({
      where: { email: session.user?.email! },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get all feedback submitted by the student
    const feedback = await prisma.feedback.findMany({
      where: {
        studentId: student.id,
      },
      include: {
        faculty: true,
        sentiment: true,
      },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
} 