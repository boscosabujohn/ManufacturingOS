import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for Route Protection
 * Validates the presence of an access token in cookies
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Define public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/offline'];
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

    // 2. Define static assets or API routes to skip
    const isStaticFile = pathname.match(/\.(.*)$/);
    const isApiRoute = pathname.startsWith('/api/');

    if (isPublicRoute || isStaticFile || isApiRoute) {
        return NextResponse.next();
    }

    // 3. Check for auth token in cookies (sent by the hardened ApiClient)
    const token = request.cookies.get('access_token')?.value;

    // 4. Redirect to login if token is missing on a protected route
    if (!token) {
        const loginUrl = new URL('/login', request.url);
        // Store the original destination to redirect back after login
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
