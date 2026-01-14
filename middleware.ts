import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Robustly handle missing env vars to avoid white-screen crashes on Edge Runtime
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        console.warn('Middleware: Supabase env vars missing. Skipping auth check.')
        return response
    }

    try {
        // Create Supabase client with cookie handling
        const supabase = createServerClient(
            supabaseUrl,
            supabaseKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            request.cookies.set(name, value) // Update request cookies for the current request
                            response.cookies.set(name, value, options) // Update response cookies for the browser
                        })
                    },
                },
            }
        )

        const {
            data: { user },
        } = await supabase.auth.getUser()

        const path = request.nextUrl.pathname

        // Public routes that don't require authentication
        const publicRoutes = ['/login', '/signup', '/auth/callback', '/forgot-password']

        // Check strict match or if it just generally starts with /auth or /api/auth
        const isPublicRoute = publicRoutes.some(route =>
            path === route ||
            path.startsWith('/auth/') ||
            path.startsWith('/api/auth')
        )

        // Exceptions for Next.js internals and static assets
        const isInternal =
            path.startsWith('/_next') ||
            path.startsWith('/static') ||
            path.includes('.')

        if (isInternal) {
            return response
        }

        // If no user and trying to access a protected route
        if (!user && !isPublicRoute) {
            const redirectUrl = request.nextUrl.clone()
            redirectUrl.pathname = '/login'
            return NextResponse.redirect(redirectUrl)
        }

        // If user is logged in and trying to access auth pages (login/signup)
        if (user && isPublicRoute && path !== '/auth/callback' && !path.startsWith('/api/')) {
            const redirectUrl = request.nextUrl.clone()
            redirectUrl.pathname = '/'
            return NextResponse.redirect(redirectUrl)
        }

        return response
    } catch (e) {
        console.error('Middleware error:', e)
        // Fail open or safe redirect to avoid white screen
        return response
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
