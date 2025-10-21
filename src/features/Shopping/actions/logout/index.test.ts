import { beforeEach, describe, expect, it, jest } from '@jest/globals'

import { supabaseServerClient } from '@/libs/supabaseClient'

import { logoutAction } from './index'

type MockSupabaseClient = {
  auth: {
    signOut: jest.Mock
  }
}

jest.mock('@/libs', () => ({
  pagesPath: {
    login: {
      $url: (): { path: string } => ({
        path: '/login',
      }),
    },
  },
  supabaseServerClient: jest.fn(),
}))

const mockSupabaseServerClient = jest.mocked(supabaseServerClient)

describe('ログアウトアクション', () => {
  const mockSupabase: MockSupabaseClient = {
    auth: {
      signOut: jest.fn(),
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockSupabaseServerClient.mockResolvedValue(mockSupabase as unknown as Awaited<ReturnType<typeof supabaseServerClient>>)
  })

  describe('ログアウト成功', () => {
    it('正常にログアウトできる', async () => {
      const mockSignOutResponse = {
        error: null,
      }

      mockSupabase.auth.signOut.mockImplementation(() => Promise.resolve(mockSignOutResponse))

      const result = await logoutAction()

      expect(result.success).toBe(true)
      expect(result.message).toBe('Logout Success')
      expect(result.redirectPath).toBe('/login')
      expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(1)
      expect(mockSupabase.auth.signOut).toHaveBeenCalledWith()
    })
  })

  describe('ログアウト失敗', () => {
    it('Supabase認証エラーでログアウトに失敗する', async () => {
      const mockSignOutError = {
        error: {
          message: 'Authentication error',
          status: 401,
        },
      }

      mockSupabase.auth.signOut.mockImplementation(() => Promise.resolve(mockSignOutError))

      const result = await logoutAction()

      expect(result.success).toBe(false)
      expect(result.message).toBe('Happen Logout Fail')
      expect(result.redirectPath).toBe(null)
      expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(1)
    })

    it('認証セッションが無効でログアウトに失敗する', async () => {
      const mockSignOutError = {
        error: {
          message: 'Invalid session',
          status: 403,
        },
      }

      mockSupabase.auth.signOut.mockImplementation(() => Promise.resolve(mockSignOutError))

      const result = await logoutAction()

      expect(result.success).toBe(false)
      expect(result.message).toBe('Happen Logout Fail')
      expect(result.redirectPath).toBe(null)
    })
  })

  describe('例外エラー', () => {
    it('Supabaseクライアント初期化エラーで例外を投げる', async () => {
      const clientError = new Error('Failed to initialize Supabase client')
      mockSupabaseServerClient.mockRejectedValue(clientError)

      await expect(logoutAction()).rejects.toThrow('Failed to initialize Supabase client')
    })

    it('ネットワークエラーで例外を投げる', async () => {
      const networkError = new Error('Network connection failed')
      mockSupabase.auth.signOut.mockImplementation(() => Promise.reject(networkError))

      await expect(logoutAction()).rejects.toThrow('Internal Server Error')
    })

    it('タイムアウトエラーで例外を投げる', async () => {
      const timeoutError = new Error('Request timeout')
      mockSupabase.auth.signOut.mockImplementation(() => Promise.reject(timeoutError))

      await expect(logoutAction()).rejects.toThrow('Internal Server Error')
    })
  })

  describe('戻り値の型チェック', () => {
    it('成功時に正しい型の戻り値を返す', async () => {
      const mockSignOutResponse = {
        error: null,
      }

      mockSupabase.auth.signOut.mockImplementation(() => Promise.resolve(mockSignOutResponse))

      const result = await logoutAction()

      expect(typeof result.success).toBe('boolean')
      expect(typeof result.message).toBe('string')
      expect(typeof result.redirectPath).toBe('string')
      expect(result).toHaveProperty('success')
      expect(result).toHaveProperty('message')
      expect(result).toHaveProperty('redirectPath')
    })

    it('失敗時に正しい型の戻り値を返す', async () => {
      const mockSignOutError = {
        error: {
          message: 'Some error',
          status: 500,
        },
      }

      mockSupabase.auth.signOut.mockImplementation(() => Promise.resolve(mockSignOutError))

      const result = await logoutAction()

      expect(typeof result.success).toBe('boolean')
      expect(typeof result.message).toBe('string')
      expect(result.redirectPath).toBe(null)
      expect(result).toHaveProperty('success')
      expect(result).toHaveProperty('message')
      expect(result).toHaveProperty('redirectPath')
    })
  })

  describe('Supabaseクライアントの呼び出し確認', () => {
    it('supabaseServerClientが1回だけ呼び出される', async () => {
      const mockSignOutResponse = {
        error: null,
      }

      mockSupabase.auth.signOut.mockImplementation(() => Promise.resolve(mockSignOutResponse))

      await logoutAction()

      expect(mockSupabaseServerClient).toHaveBeenCalledTimes(1)
      expect(mockSupabaseServerClient).toHaveBeenCalledWith()
    })

    it('signOutメソッドが引数なしで呼び出される', async () => {
      const mockSignOutResponse = {
        error: null,
      }

      mockSupabase.auth.signOut.mockImplementation(() => Promise.resolve(mockSignOutResponse))

      await logoutAction()

      expect(mockSupabase.auth.signOut).toHaveBeenCalledWith()
    })
  })

  describe('エラーケースの詳細', () => {
    it('空のエラーオブジェクトでログアウトに失敗する', async () => {
      const mockSignOutError = {
        error: {},
      }

      mockSupabase.auth.signOut.mockImplementation(() => Promise.resolve(mockSignOutError))

      const result = await logoutAction()

      expect(result.success).toBe(false)
      expect(result.message).toBe('Happen Logout Fail')
      expect(result.redirectPath).toBe(null)
    })

    it('undefined errorでログアウトに成功する', async () => {
      const mockSignOutError = {
        error: undefined,
      }

      mockSupabase.auth.signOut.mockImplementation(() => Promise.resolve(mockSignOutError))

      const result = await logoutAction()

      expect(result.success).toBe(true)
      expect(result.message).toBe('Logout Success')
      expect(result.redirectPath).toBe('/login')
    })
  })
})
