import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create faculty members
  const faculty = await Promise.all([
    prisma.faculty.create({
      data: {
        name: 'Dr. Sarah Johnson',
        subject: 'Computer Science',
      },
    }),
    prisma.faculty.create({
      data: {
        name: 'Prof. Michael Chen',
        subject: 'Mathematics',
      },
    }),
    prisma.faculty.create({
      data: {
        name: 'Dr. Emily Brown',
        subject: 'Physics',
      },
    }),
    prisma.faculty.create({
      data: {
        name: 'Prof. David Wilson',
        subject: 'Chemistry',
      },
    }),
  ])

  console.log('Created faculty members:', faculty)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 