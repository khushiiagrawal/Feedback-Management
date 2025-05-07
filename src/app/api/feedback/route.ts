import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
        faculty: {
          select: {
            name: true,
            subject: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(feedbacks)
  } catch (error) {
    console.error('Error fetching feedbacks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedbacks' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { studentName, studentEmail, facultyId, rating, comments } = body

    // First, create or find the student
    const student = await prisma.student.upsert({
      where: { email: studentEmail },
      update: { name: studentName },
      create: {
        name: studentName,
        email: studentEmail,
      },
    })

    // Create the feedback
    const feedback = await prisma.feedback.create({
      data: {
        studentId: student.id,
        facultyId: parseInt(facultyId),
        rating,
        comments,
      },
    })

    return NextResponse.json(feedback)
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
} 