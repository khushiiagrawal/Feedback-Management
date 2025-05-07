# Student Feedback Management System

A modern web application built with Next.js, TypeScript, and MySQL for managing student feedback for faculty members. The system provides an intuitive interface for students to submit feedback and administrators to view and analyze the feedback data.

## Features

- 📝 Easy feedback submission form with star ratings
- 👥 Faculty member selection
- 📊 Admin dashboard for feedback analysis
- 🔒 Secure data handling

## Tech Stack

- **Frontend:**
  - Next.js 14
  - TypeScript
  - Tailwind CSS

- **Backend:**
  - Next.js API Routes
  - Prisma ORM
  - MySQL Database

## Prerequisites

- Node.js (v18 or higher)
- MySQL Server
- npm or yarn package manager

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd dbms-project-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="mysql://username:password@localhost:3306/feedback_system"
   ```

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000` (or the next available port if 3000 is in use).



## Database Schema

The system uses the following main tables:
- Faculty: Stores faculty member information
- Feedback: Stores student feedback submissions
- Students: Stores student information


