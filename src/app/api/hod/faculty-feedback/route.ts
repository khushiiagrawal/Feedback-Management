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

    // Get HOD ID from session
    const hod = await prisma.hOD.findUnique({
      where: { email: session.user?.email! },
    });

    if (!hod) {
      return NextResponse.json({ error: 'HOD not found' }, { status: 404 });
    }

    // Get all faculty in the department
    const faculty = await prisma.faculty.findMany({
      where: {
        department: hod.department,
      },
      include: {
        feedbacks: {
          include: {
            sentiment: true,
          },
        },
      },
    });

    // Process faculty feedback
    const facultyFeedback = faculty.map((faculty) => {
      const feedbacks = faculty.feedbacks;
      const totalFeedbacks = feedbacks.length;

      // Calculate overall rating
      const ratingWeights = {
        POOR: 1,
        FAIR: 2,
        GOOD: 3,
        VERY_GOOD: 4,
        EXCELLENT: 5,
      };

      let overallRating = 0;
      if (totalFeedbacks > 0) {
        const ratingSum = feedbacks.reduce((sum, feedback) => {
          return sum + ratingWeights[feedback.overallRating];
        }, 0);
        overallRating = ratingSum / totalFeedbacks;
      }

      // Calculate sentiment percentages
      const sentimentCounts = {
        positive: 0,
        neutral: 0,
        negative: 0,
      };

      feedbacks.forEach((feedback) => {
        if (feedback.sentiment) {
          const label = feedback.sentiment.label.toLowerCase();
          sentimentCounts[label as keyof typeof sentimentCounts]++;
        }
      });

      const sentiment = {
        positive: totalFeedbacks > 0 ? Math.round((sentimentCounts.positive / totalFeedbacks) * 100) : 0,
        neutral: totalFeedbacks > 0 ? Math.round((sentimentCounts.neutral / totalFeedbacks) * 100) : 0,
        negative: totalFeedbacks > 0 ? Math.round((sentimentCounts.negative / totalFeedbacks) * 100) : 0,
      };

      // Calculate areas of improvement
      const areasOfImprovement = calculateAreasOfImprovement(feedbacks);

      return {
        id: faculty.id,
        name: faculty.name,
        department: faculty.department,
        overallRating,
        sentiment,
        areasOfImprovement,
      };
    });

    return NextResponse.json(facultyFeedback);
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