import { beforeEach, describe, expect, it, jest } from '@jest/globals'

import { createUserRepo } from '../../repositories'
import { CreateUserStateType } from '../states'
import { createUser } from './index'

jest.mock('../../repositories')
jest.mock('@/libs', () => ({
  pagesPath: {
    users: {
      $url: jest.fn().mockReturnValue({ path: '/users' }),
      _id: (id: number): { $url: () => { path: string } } => ({
        $url: (): { path: string } => ({
          path: `/users/${id}`,
        }),
      }),
    },
  },
}))

// Mock Next.js modules
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

const mockCreateUserRepo = createUserRepo as jest.MockedFunction<typeof createUserRepo>

describe('ユーザー作成アクション', () => {
  const initialState: CreateUserStateType = {
    success: false,
    message: null,
    data: null,
    errors: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateUserRepo.mockResolvedValue({
      id: 1,
      name: 'テストユーザー',
      url: 'https://example.com',
      phone: '03-1234-5678',
      email: 'test@example.com',
      create_at: new Date(),
      update_at: new Date(),
    })
  })

  const createFormData = (data: Record<string, string>): FormData => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.set(key, value)
    })
    return formData
  }

  describe('有効なデータ', () => {
    it('正しいフォームデータでユーザーを作成する', async () => {
      const formData = createFormData({
        name: 'テストユーザー',
        url: 'https://example.com',
        phone1: '03',
        phone2: '1234',
        phone3: '5678',
        email: 'test@example.com',
      })

      const result = await createUser(initialState, formData)

      expect(result.success).toBe(true)
      expect(result.message).toBe(null)
      expect(result.createId).toBe(1)
      expect(result.redirectPath).toBe('/users/1')
      expect(mockCreateUserRepo).toHaveBeenCalledWith({
        name: 'テストユーザー',
        url: 'https://example.com',
        phone: '03-1234-5678',
        email: 'test@example.com',
        create_at: expect.any(Date),
        update_at: expect.any(Date),
      })
    })
  })

  describe('バリデーションエラー', () => {
    it('空の氏名でバリデーションエラーを返す', async () => {
      const formData = createFormData({
        name: '',
        url: 'https://example.com',
        phone1: '03',
        phone2: '1234',
        phone3: '5678',
        email: 'test@example.com',
      })

      const result = await createUser(initialState, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('エラー項目があります')
      expect(result.errors).toEqual([{ name: '氏名は1文字以上で入力してください' }])
      expect(mockCreateUserRepo).not.toHaveBeenCalled()
    })
  })

  describe('リポジトリ層エラー', () => {
    it('リポジトリ層でエラーが発生した場合にエラーを投げる', async () => {
      const formData = createFormData({
        name: 'テストユーザー',
        url: 'https://example.com',
        phone1: '03',
        phone2: '1234',
        phone3: '5678',
        email: 'test@example.com',
      })

      const repoError = new Error('Database connection failed')
      mockCreateUserRepo.mockRejectedValue(repoError)

      await expect(createUser(initialState, formData)).rejects.toThrow('Internal Server Error')
    })
  })
})
