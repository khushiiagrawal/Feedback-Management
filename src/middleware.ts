import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // If user is not authenticated, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Role-based access control
    if (path.startsWith('/student') && token.role !== 'STUDENT') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (path.startsWith('/faculty') && token.role !== 'FACULTY') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (path.startsWith('/hod') && token.role !== 'HOD') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/student/:path*', '/faculty/:path*', '/hod/:path*'],
}; 