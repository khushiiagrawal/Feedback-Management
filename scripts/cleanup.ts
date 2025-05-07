import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupDuplicates() {
  try {
    // Get all faculty members
    const allFaculty = await prisma.faculty.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    // Create a map to store unique faculty by name and subject
    const uniqueFaculty = new Map()
    const duplicates: number[] = []

    // Find duplicates
    allFaculty.forEach(faculty => {
      const key = `${faculty.name}-${faculty.subject}`
      if (uniqueFaculty.has(key)) {
        duplicates.push(faculty.id)
      } else {
        uniqueFaculty.set(key, faculty.id)
      }
    })

    // Delete duplicates
    if (duplicates.length > 0) {
      await prisma.faculty.deleteMany({
        where: {
          id: {
            in: duplicates
          }
        }
      })
      console.log(`Deleted ${duplicates.length} duplicate faculty entries`)
    } else {
      console.log('No duplicates found')
    }

    // Get remaining faculty count
    const remainingCount = await prisma.faculty.count()
    console.log(`Remaining faculty count: ${remainingCount}`)

  } catch (error) {
    console.error('Error cleaning up duplicates:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupDuplicates() 