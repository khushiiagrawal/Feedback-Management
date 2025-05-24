import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.sentiment.deleteMany()
  await prisma.feedback.deleteMany()
  await prisma.student.deleteMany()
  await prisma.faculty.deleteMany()
  await prisma.hOD.deleteMany()
  await prisma.user.deleteMany()

  // Create Users for authentication first
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'hod@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'HOD',
      },
      {
        email: 'faculty1@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'FACULTY',
      },
      {
        email: 'faculty2@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'FACULTY',
      },
      {
        email: 'student1@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'STUDENT',
      },
      {
        email: 'student2@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'STUDENT',
      },
    ],
  })

  // Get the created users
  const hodUser = await prisma.user.findUnique({
    where: { email: 'hod@example.com' },
  })

  const faculty1User = await prisma.user.findUnique({
    where: { email: 'faculty1@example.com' },
  })

  const faculty2User = await prisma.user.findUnique({
    where: { email: 'faculty2@example.com' },
  })

  const student1User = await prisma.user.findUnique({
    where: { email: 'student1@example.com' },
  })

  const student2User = await prisma.user.findUnique({
    where: { email: 'student2@example.com' },
  })

  if (!hodUser || !faculty1User || !faculty2User || !student1User || !student2User) {
    throw new Error('Failed to create users')
  }

  // Create HOD
  await prisma.hOD.create({
    data: {
      name: 'Dr. John Smith',
      email: 'hod@example.com',
      department: 'Computer Science',
      userId: hodUser.id,
    },
  })

  // Create Faculty members
  await prisma.faculty.create({
    data: {
      name: 'Dr. Sarah Johnson',
      email: 'faculty1@example.com',
      department: 'Computer Science',
      userId: faculty1User.id,
    },
  })

  await prisma.faculty.create({
    data: {
      name: 'Dr. Michael Brown',
      email: 'faculty2@example.com',
      department: 'Computer Science',
      userId: faculty2User.id,
    },
  })

  // Create Students
  await prisma.student.create({
    data: {
      name: 'Alice Cooper',
      email: 'student1@example.com',
      usn: 'CS001',
      userId: student1User.id,
    },
  })

  await prisma.student.create({
    data: {
      name: 'Bob Wilson',
      email: 'student2@example.com',
      usn: 'CS002',
      userId: student2User.id,
    },
  })

  console.log('Database has been seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 