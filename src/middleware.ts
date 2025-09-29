import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

import { env } from '~/env'

export const middleware = async (request: NextRequest): Promise<NextResponse> => {
  const supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/authed')) {
    return NextResponse.redirect(new URL('/login?from=authed', request.url))
  }

  if (!user && request.nextUrl.pathname.startsWith('/shopping')) {
    return NextResponse.redirect(new URL('/login?from=shopping', request.url))
  }

  return supabaseResponse
}

export const config = { matcher: ['/authed/:path*', '/shopping/:path*'] }
