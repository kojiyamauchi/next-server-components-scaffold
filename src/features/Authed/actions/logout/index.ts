'use server'

import { pagesPath } from '@/libs/$path'
import { supabaseServerClient } from '@/libs/supabaseClient'

type LogoutActionResult = {
  success: boolean
  message: string
  redirectPath: string | null
}

export const logoutAction = async (): Promise<LogoutActionResult> => {
  const supabase = await supabaseServerClient()

  try {
    const { error } = await supabase.auth.signOut()

    if (!error) {
      return { success: true, message: 'Logout Success', redirectPath: pagesPath.login.$url({ query: { from: 'authed' } }).path }
    } else {
      console.error('Happen Logout Error: ', error)
      return { success: false, message: 'Happen Logout Fail', redirectPath: null }
    }
  } catch (error) {
    console.error(`Maybe Repository Layer Error: ${error}`)
    throw new Error('Internal Server Error', { cause: error })
  }
}
