import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
        teacherId: params.teacherId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        rating: true,
        comment: true,
        createdAt: true,
      },
    });

    if (!feedbacks || feedbacks.length === 0) {
      return NextResponse.json([]);
    }

    // Group feedbacks by week
    const weeklyData = feedbacks.reduce((acc: any, feedback) => {
      const date = new Date(feedback.createdAt);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!acc[weekKey]) {
        acc[weekKey] = {
          ratings: [],
          comments: [],
        };
      }

      acc[weekKey].ratings.push(feedback.rating);
      if (feedback.comment) {
        acc[weekKey].comments.push(feedback.comment);
      }

      return acc;
    }, {});

    // Calculate average ratings for each week
    const trends = Object.entries(weeklyData).map(([date, data]: [string, any]) => ({
      date,
      rating: Number((data.ratings.reduce((a: number, b: number) => a + b, 0) / data.ratings.length).toFixed(1)),
      comment: data.comments[0] || '', // Include one comment per week for the report
    }));

    return NextResponse.json(trends);
  } catch (error) {
    console.error('Error fetching feedback trends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback trends' },
      { status: 500 }
    );
  }
} 