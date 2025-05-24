import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Role } from '@prisma/client';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  
  // If there's no session, redirect to login
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Get user role from session
  const userRole = session.value.split('.')[0] as Role;

  // Protect routes based on role
  if (request.nextUrl.pathname.startsWith('/student') && userRole !== 'STUDENT') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/faculty') && userRole !== 'FACULTY') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/hod') && userRole !== 'HOD') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/faculty/:path*', '/hod/:path*'],
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            student: true,
            faculty: true,
            hod: true
          }
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id.toString(),
          email: user.email,
          role: user.role,
          name: user.student?.name || user.faculty?.name || user.hod?.name || 'User'
        };
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
        session.user.name = token.name;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET
}; 