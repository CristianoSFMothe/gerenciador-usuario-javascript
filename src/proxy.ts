import { getSessionCookie } from 'better-auth/cookies'
import { type NextRequest, NextResponse } from 'next/server'

const PROTECTED_PATH_PREFIX = '/dashboard'

const buildCspHeader = (nonce: string) => {
  const directives = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${
      process.env.NODE_ENV !== 'production' ? ` 'unsafe-eval'` : ''
    }`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' blob: data: https://res.cloudinary.com`,
    `font-src 'self'`,
    `connect-src 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
  ]

  return directives.join('; ')
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith(PROTECTED_PATH_PREFIX)) {
    const sessionCookie = getSessionCookie(request)

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const cspHeader = buildCspHeader(nonce)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', cspHeader)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  )
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload',
  )

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
