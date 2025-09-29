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
    const login = new URL('/login', request.url)
    login.searchParams.set('from', 'authed')
    return NextResponse.redirect(login)
  }

  if (!user && request.nextUrl.pathname.startsWith('/shopping')) {
    const login = new URL('/login', request.url)
    login.searchParams.set('from', 'shopping')
    return NextResponse.redirect(new URL(login))
  }

  return supabaseResponse
}

export const config = { matcher: ['/authed/:path*', '/shopping/:path*'] }
