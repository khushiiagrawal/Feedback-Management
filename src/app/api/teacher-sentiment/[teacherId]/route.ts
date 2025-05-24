import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { analyzeSentiment } from '@/lib/sentiment-analysis';

export async function GET(
  request: Request,
  { params }: { params: { teacherId: string } }
) {
  try {
    if (!params.teacherId) {
      return NextResponse.json(
        { error: 'Teacher ID is required' },
        { status: 400 }
      );
    }

    const feedbacks = await prisma.feedback.findMany({
      where: {
        facultyId: parseInt(params.teacherId),
      },
      select: {
        comment: true,
      },
    });

    if (!feedbacks || feedbacks.length === 0) {
      return NextResponse.json({ sentiment: 'neutral', score: 0 });
    }

    const comments = feedbacks
      .map((f) => f.comment)
      .filter((comment): comment is string => comment !== null);

    if (comments.length === 0) {
      return NextResponse.json({ sentiment: 'neutral', score: 0 });
    }

    const sentiment = await analyzeSentiment(comments.join(' '));
    return NextResponse.json(sentiment);
  } catch (error) {
    console.error('Error analyzing teacher sentiment:', error);
    return NextResponse.json(
      { error: 'Failed to analyze sentiment' },
      { status: 500 }
    );
  }
} 