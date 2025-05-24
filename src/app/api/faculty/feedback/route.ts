import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Rating } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get faculty ID from session
    const faculty = await prisma.faculty.findUnique({
      where: { email: session.user?.email! },
      include: {
        feedbacks: {
          include: {
            sentiment: true,
          },
        },
      },
    });

    if (!faculty) {
      return NextResponse.json({ error: 'Faculty not found' }, { status: 404 });
    }

    // Initialize stats object
    const stats = {
      teachingQuality: { POOR: 0, FAIR: 0, GOOD: 0, VERY_GOOD: 0, EXCELLENT: 0 },
      subjectKnowledge: { POOR: 0, FAIR: 0, GOOD: 0, VERY_GOOD: 0, EXCELLENT: 0 },
      communication: { POOR: 0, FAIR: 0, GOOD: 0, VERY_GOOD: 0, EXCELLENT: 0 },
      punctuality: { POOR: 0, FAIR: 0, GOOD: 0, VERY_GOOD: 0, EXCELLENT: 0 },
      interaction: { POOR: 0, FAIR: 0, GOOD: 0, VERY_GOOD: 0, EXCELLENT: 0 },
      clarity: { POOR: 0, FAIR: 0, GOOD: 0, VERY_GOOD: 0, EXCELLENT: 0 },
      methodology: { POOR: 0, FAIR: 0, GOOD: 0, VERY_GOOD: 0, EXCELLENT: 0 },
      overallRating: { POOR: 0, FAIR: 0, GOOD: 0, VERY_GOOD: 0, EXCELLENT: 0 },
      sentiment: {
        positive: 0,
        neutral: 0,
        negative: 0,
      },
    };

    // Process feedback
    faculty.feedbacks.forEach((feedback) => {
      // Update rating counts
      Object.keys(stats).forEach((key) => {
        if (key !== 'sentiment' && feedback[key as keyof typeof feedback]) {
          const rating = feedback[key as keyof typeof feedback] as Rating;
          stats[key as keyof typeof stats][rating]++;
        }
      });

      // Update sentiment counts
      if (feedback.sentiment) {
        const label = feedback.sentiment.label.toLowerCase();
        stats.sentiment[label as keyof typeof stats.sentiment]++;
      }
    });

    // Calculate sentiment percentages
    const totalFeedbacks = faculty.feedbacks.length;
    if (totalFeedbacks > 0) {
      Object.keys(stats.sentiment).forEach((key) => {
        stats.sentiment[key as keyof typeof stats.sentiment] = Math.round(
          (stats.sentiment[key as keyof typeof stats.sentiment] / totalFeedbacks) * 100
        );
      });
    }

    // Calculate areas of improvement
    const areasOfImprovement = calculateAreasOfImprovement(faculty.feedbacks);

    return NextResponse.json({ stats, areasOfImprovement });
  } catch (error) {
    console.error('Error fetching faculty feedback:', error);
    return NextResponse.json(
      { error: 'Failed to fetch faculty feedback' },
      { status: 500 }
    );
  }
}

function calculateAreasOfImprovement(feedbacks: any[]) {
  const categories = [
    'teachingQuality',
    'subjectKnowledge',
    'communication',
    'punctuality',
    'interaction',
    'clarity',
    'methodology',
  ];

  const ratingWeights = {
    POOR: 1,
    FAIR: 2,
    GOOD: 3,
    VERY_GOOD: 4,
    EXCELLENT: 5,
  };

  const areas = categories.map((category) => {
    let totalScore = 0;
    let count = 0;

    feedbacks.forEach((feedback) => {
      if (feedback[category]) {
        totalScore += ratingWeights[feedback[category]];
        count++;
      }
    });

    const averageScore = count > 0 ? totalScore / count : 0;
    const scorePercentage = (averageScore / 5) * 100;

    let recommendation = '';
    if (scorePercentage < 60) {
      recommendation = 'Focus on improving this aspect through additional training and practice.';
    } else if (scorePercentage < 80) {
      recommendation = 'Continue to enhance this area with regular feedback and self-assessment.';
    } else {
      recommendation = 'Maintain the current high standards and share best practices with others.';
    }

    return {
      category: category.replace(/([A-Z])/g, ' $1').trim(),
      score: scorePercentage,
      recommendation,
    };
  });

  return areas.sort((a, b) => a.score - b.score);
} 