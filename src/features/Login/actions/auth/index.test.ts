import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import type { AuthResponse, AuthTokenResponsePassword } from '@supabase/supabase-js'

import { supabaseServerClient } from '@/libs/supabaseClient'

import { authInitialState } from '../state'
import { authAction } from './index'

type MockSupabaseClient = {
  auth: {
    signInWithPassword: jest.Mock
    signUp: jest.Mock
  }
}

jest.mock('@/libs', () => ({
  pagesPath: {
    authed: {
      $url: (): { path: string } => ({
        path: '/authed',
      }),
    },
    shopping: {
      $url: (): { path: string } => ({
        path: '/shopping',
      }),
    },
  },
  supabaseServerClient: jest.fn(),
}))

const mockSupabaseServerClient = jest.mocked(supabaseServerClient)

describe('認証アクション', () => {
  const mockSupabase: MockSupabaseClient = {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockSupabaseServerClient.mockResolvedValue(mockSupabase as unknown as Awaited<ReturnType<typeof supabaseServerClient>>)
  })

  const createFormData = (data: Record<string, string | boolean | null>): FormData => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        if (value) {
          formData.set(key, '')
        }
      } else if (value !== null) {
        formData.set(key, value)
      }
    })
    return formData
  }

  describe('有効なデータでのログイン成功', () => {
    it('正しいフォームデータでログインに成功する', async () => {
      const formData = createFormData({
        email: 'test@example.com',
        password: 'Password123!',
        login: true,
        signup: false,
        from: null,
      })

      const mockAuthResponse = {
        data: {
          user: { id: '123', email: 'test@example.com' },
          session: { access_token: 'token123' },
        },
        error: null,
      } as AuthTokenResponsePassword

      mockSupabase.auth.signInWithPassword.mockImplementation(() => Promise.resolve(mockAuthResponse))

      const result = await authAction(authInitialState, formData)

      expect(result.success).toBe(true)
      expect(result.message).toBe(null)
      expect(result.redirectPath).toBe('/authed')
      expect(result.validateErrors).toBe(null)
      expect(result.authError).toBe(false)
      expect(result.data).toEqual({
        email: 'test@example.com',
        password: 'Password123!',
        login: true,
        signup: false,
        from: null,
      })
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
        login: true,
        signup: false,
        from: null,
      })
    })
  })

  describe('fromパラメータとリダイレクトパス決定', () => {
    it('fromが"shopping"の場合、/shoppingにリダイレクトする', async () => {
      const formData = createFormData({
        email: 'test@example.com',
        password: 'Password123!',
        login: true,
        signup: false,
        from: 'shopping',
      })

      const mockAuthResponse = {
        data: {
          user: { id: '123', email: 'test@example.com' },
          session: { access_token: 'token123' },
        },
        error: null,
      } as AuthTokenResponsePassword

      mockSupabase.auth.signInWithPassword.mockImplementation(() => Promise.resolve(mockAuthResponse))

      const result = await authAction(authInitialState, formData)

      expect(result.success).toBe(true)
      expect(result.redirectPath).toBe('/shopping')
      expect(result.data).toEqual({
        email: 'test@example.com',
        password: 'Password123!',
        login: true,
        signup: false,
        from: 'shopping',
      })
    })

    it('fromが"authed"の場合、/authedにリダイレクトする', async () => {
      const formData = createFormData({
        email: 'test@example.com',
        password: 'Password123!',
        login: true,
        signup: false,
        from: 'authed',
      })

      const mockAuthResponse = {
        data: {
          user: { id: '123', email: 'test@example.com' },
          session: { access_token: 'token123' },
        },
        error: null,
      } as AuthTokenResponsePassword

      mockSupabase.auth.signInWithPassword.mockImplementation(() => Promise.resolve(mockAuthResponse))

      const result = await authAction(authInitialState, formData)

      expect(result.success).toBe(true)
      expect(result.redirectPath).toBe('/authed')
      expect(result.data).toEqual({
        email: 'test@example.com',
        password: 'Password123!',
        login: true,
        signup: false,
        from: 'authed',
      })
    })

    it('fromがnullまたは未指定の場合、デフォルトで/authedにリダイレクトする', async () => {
      const formData = createFormData({
        email: 'test@example.com',
        password: 'Password123!',
        login: true,
        signup: false,
        from: null,
      })

      const mockAuthResponse = {
        data: {
          user: { id: '123', email: 'test@example.com' },
          session: { access_token: 'token123' },
        },
        error: null,
      } as AuthTokenResponsePassword

      mockSupabase.auth.signInWithPassword.mockImplementation(() => Promise.resolve(mockAuthResponse))

      const result = await authAction(authInitialState, formData)

      expect(result.success).toBe(true)
      expect(result.redirectPath).toBe('/authed')
      expect(result.data).toEqual({
        email: 'test@example.com',
        password: 'Password123!',
        login: true,
        signup: false,
        from: null,
      })
    })

    it('サインアップ時にもfromパラメータに基づいてリダイレクトパスが決定される', async () => {
      const formData = createFormData({
        email: 'new@example.com',
        password: 'NewPassword123!',
        login: false,
        signup: true,
        from: 'shopping',
      })

      const mockAuthResponse = {
        data: {
          user: { id: '456', email: 'new@example.com' },
          session: null,
        },
        error: null,
      } as AuthResponse

      mockSupabase.auth.signUp.mockImplementation(() => Promise.resolve(mockAuthResponse))

      const result = await authAction(authInitialState, formData)

      expect(result.success).toBe(true)
      expect(result.redirectPath).toBe('/shopping')
      expect(result.data).toEqual({
        email: 'new@example.com',
        password: 'NewPassword123!',
        login: false,
        signup: true,
        from: 'shopping',
      })
    })
  })

  describe('有効なデータでのサインアップ成功', () => {
    it('正しいフォームデータでサインアップに成功する', async () => {
      const formData = createFormData({
        email: 'new@example.com',
        password: 'NewPassword123!',
        login: false,
        signup: true,
        from: null,
      })

      const mockAuthResponse = {
        data: {
          user: { id: '456', email: 'new@example.com' },
          session: null,
        },
        error: null,
      } as AuthResponse

      mockSupabase.auth.signUp.mockImplementation(() => Promise.resolve(mockAuthResponse))

      const result = await authAction(authInitialState, formData)

      expect(result.success).toBe(true)
      expect(result.message).toBe(null)
      expect(result.redirectPath).toBe('/authed')
      expect(result.validateErrors).toBe(null)
      expect(result.authError).toBe(false)
      expect(result.data).toEqual({
        email: 'new@example.com',
        password: 'NewPassword123!',
        login: false,
        signup: true,
        from: null,
      })
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'NewPassword123!',
        login: false,
        signup: true,
        from: null,
      })
    })
  })

  describe('バリデーションエラー', () => {
    it('無効なメール形式でバリデーションエラーを返す', async () => {
      const formData = createFormData({
        email: 'invalid-email',
        password: 'Password123!',
        login: true,
        signup: false,
      })

      const result = await authAction(authInitialState, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Validate Fail')
      expect(result.validateErrors).toEqual([{ email: 'メールアドレスの形式が正しくありません' }])
      expect(result.authError).toBe(false)
      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled()
    })

    it('短すぎるパスワードでバリデーションエラーを返す', async () => {
      const formData = createFormData({
        email: 'test@example.com',
        password: 'Pass1!',
        login: true,
        signup: false,
      })

      const result = await authAction(authInitialState, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Validate Fail')
      expect(result.validateErrors).toEqual([{ password: '8文字以上必要です' }])
      expect(result.authError).toBe(false)
      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled()
    })

    it('長すぎるパスワードでバリデーションエラーを返す', async () => {
      const formData = createFormData({
        email: 'test@example.com',
        password: 'A'.repeat(73) + 'a1!',
        login: true,
        signup: false,
      })

      const result = await authAction(authInitialState, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Validate Fail')
      expect(result.validateErrors).toEqual([{ password: '72文字以下にしてください' }])
      expect(result.authError).toBe(false)
      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled()
    })

    it('小文字を含まないパスワードでバリデーションエラーを返す', async () => {
      const formData = createFormData({
        email: 'test@example.com',
        password: 'PASSWORD123!',
        login: true,
        signup: false,
      })

      const result = await authAction(authInitialState, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Validate Fail')
      expect(result.validateErrors).toEqual([{ password: '小文字を含めてください' }])
      expect(result.authError).toBe(false)
      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled()
    })

    it('大文字を含まないパスワードでバリデーションエラーを返す', async () => {
      const formData = createFormData({
        email: 'test@example.com',
        password: 'password123!',
        login: true,
        signup: false,
      })

      const result = await authAction(authInitialState, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Validate Fail')
      expect(result.validateErrors).toEqual([{ password: '大文字を含めてください' }])
      expect(result.authError).toBe(false)
      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled()
    })

    it('数字を含まないパスワードでバリデーションエラーを返す', async () => {
      const formData = createFormData({
        email: 'test@example.com',
        password: 'Password!',
        login: true,
        signup: false,
      })

      const result = await authAction(authInitialState, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Validate Fail')
      expect(result.validateErrors).toEqual([{ password: '数字を含めてください' }])
      expect(result.authError).toBe(false)
      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled()
    })

    it('記号を含まないパスワードでバリデーションエラーを返す', async () => {
      const formData = createFormData({
        email: 'test@example.com',
        password: 'Password123',
        login: true,
        signup: false,
      })

      const result = await authAction(authInitialState, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Validate Fail')
      expect(result.validateErrors).toEqual([{ password: '記号を含めてください' }])
      expect(result.authError).toBe(false)
      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled()
    })

    it('複数の項目で同時にバリデーションエラーを返す', async () => {
      const formData = createFormData({
        email: 'invalid-email',
        password: 'short',
        login: true,
        signup: false,
      })

      const result = await authAction(authInitialState, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Validate Fail')
      expect(result.validateErrors).toHaveLength(5) // email + password(4個のエラー: 8文字以上、大文字、数字、記号)
      expect(result.authError).toBe(false)
      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled()
    })
  })

  describe('認証エラー（Supabaseからのエラーレスポンス）', () => {
    it('ログイン時の認証エラーを処理する', async () => {
      const formData = createFormData({
        email: 'test@example.com',
        password: 'Password123!',
        login: true,
        signup: false,
        from: null,
      })

      const mockAuthError = {
        data: {
          user: null,
          session: null,
        },
        error: {
          message: 'Invalid login credentials',
          status: 400,
        },
      } as AuthTokenResponsePassword

      mockSupabase.auth.signInWithPassword.mockImplementation(() => Promise.resolve(mockAuthError))

      const result = await authAction(authInitialState, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('400: Invalid login credentials')
      expect(result.redirectPath).toBe(null)
      expect(result.validateErrors).toBe(null)
      expect(result.authError).toBe(true)
      expect(result.data).toEqual({
        email: 'test@example.com',
        password: 'Password123!',
        login: true,
        signup: false,
        from: null,
      })
    })

    it('サインアップ時の認証エラーを処理する', async () => {
      const formData = createFormData({
        email: 'existing@example.com',
        password: 'Password123!',
        login: false,
        signup: true,
      })

      const mockAuthError = {
        data: {
          user: null,
          session: null,
        },
        error: {
          message: 'User already registered',
          status: 422,
        },
      } as AuthResponse

      mockSupabase.auth.signUp.mockImplementation(() => Promise.resolve(mockAuthError))

      const result = await authAction(authInitialState, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('422: User already registered')
      expect(result.redirectPath).toBe(null)
      expect(result.validateErrors).toBe(null)
      expect(result.authError).toBe(true)
      expect(result.data).toEqual({
        email: 'existing@example.com',
        password: 'Password123!',
        login: false,
        signup: true,
        from: null,
      })
    })
  })

  describe('例外エラー（ネットワークエラーなど）', () => {
    it('ログイン時のネットワークエラーで例外を投げる', async () => {
      const formData = createFormData({
        email: 'test@example.com',
        password: 'Password123!',
        login: true,
        signup: false,
        from: null,
      })

      const networkError = new Error('Network connection failed')
      mockSupabase.auth.signInWithPassword.mockImplementation(() => Promise.reject(networkError))

      await expect(authAction(authInitialState, formData)).rejects.toThrow('Internal Server Error')
    })

    it('サインアップ時のネットワークエラーで例外を投げる', async () => {
      const formData = createFormData({
        email: 'test@example.com',
        password: 'Password123!',
        login: false,
        signup: true,
      })

      const networkError = new Error('Database connection failed')
      mockSupabase.auth.signUp.mockImplementation(() => Promise.reject(networkError))

      await expect(authAction(authInitialState, formData)).rejects.toThrow('Internal Server Error')
    })

    it('Supabaseクライアント初期化エラーで例外を投げる', async () => {
      const formData = createFormData({
        email: 'test@example.com',
        password: 'Password123!',
        login: true,
        signup: false,
        from: null,
      })

      mockSupabaseServerClient.mockRejectedValue(new Error('Failed to initialize Supabase client'))

      await expect(authAction(authInitialState, formData)).rejects.toThrow('Failed to initialize Supabase client')
    })
  })

  describe('エッジケース', () => {
    it('両方のフラグがfalseの場合、空のレスポンスを返す', async () => {
      const formData = createFormData({
        email: 'test@example.com',
        password: 'Password123!',
        login: false,
        signup: false,
      })

      const result = await authAction(authInitialState, formData)

      expect(result.success).toBe(true)
      expect(result.message).toBe(null)
      expect(result.redirectPath).toBe('/authed')
      expect(result.validateErrors).toBe(null)
      expect(result.authError).toBe(false)
      expect(result.data).toEqual({
        email: 'test@example.com',
        password: 'Password123!',
        login: false,
        signup: false,
        from: null,
      })
      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled()
      expect(mockSupabase.auth.signUp).not.toHaveBeenCalled()
    })

    it('両方のフラグがtrueの場合、loginが優先される', async () => {
      const formData = createFormData({
        email: 'test@example.com',
        password: 'Password123!',
        login: true,
        signup: true,
      })

      const mockAuthResponse = {
        data: {
          user: { id: '123', email: 'test@example.com' },
          session: { access_token: 'token123' },
        },
        error: null,
      } as AuthTokenResponsePassword

      mockSupabase.auth.signInWithPassword.mockImplementation(() => Promise.resolve(mockAuthResponse))

      const result = await authAction(authInitialState, formData)

      expect(result.success).toBe(true)
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalled()
      expect(mockSupabase.auth.signUp).not.toHaveBeenCalled()
    })

    it('空文字列のメールアドレスでバリデーションエラーを返す', async () => {
      const formData = createFormData({
        email: '',
        password: 'Password123!',
        login: true,
        signup: false,
      })

      const result = await authAction(authInitialState, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Validate Fail')
      expect(result.validateErrors).toEqual([{ email: 'メールアドレスの形式が正しくありません' }])
      expect(result.authError).toBe(false)
    })

    it('空文字列のパスワードでバリデーションエラーを返す', async () => {
      const formData = createFormData({
        email: 'test@example.com',
        password: '',
        login: true,
        signup: false,
      })

      const result = await authAction(authInitialState, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Validate Fail')
      expect(result.validateErrors).toHaveLength(5) // 8文字以上 + 小文字 + 大文字 + 数字 + 記号
      expect(result.authError).toBe(false)
    })
  })
})
