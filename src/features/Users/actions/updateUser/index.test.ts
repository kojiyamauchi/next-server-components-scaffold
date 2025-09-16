import { beforeEach, describe, expect, it, jest } from '@jest/globals'

// Mock Next.js cache functions before importing
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

// Mock @/libs entirely to avoid env dependency
jest.mock('@/libs', () => ({
  prisma: {
    user: {
      update: jest.fn(),
    },
  },
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

import { revalidatePath } from 'next/cache'

import { updateUserRepo } from '../../repositories'
import { UserStateType } from '../states'
import { updateUser } from './index'

jest.mock('next/cache')
jest.mock('../../repositories')

const mockRevalidatePath = revalidatePath as jest.MockedFunction<typeof revalidatePath>
const mockUpdateUserRepo = updateUserRepo as jest.MockedFunction<typeof updateUserRepo>

describe('ユーザー更新アクション', () => {
  const initialState: UserStateType = {
    success: false,
    message: null,
    data: null,
    errors: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUpdateUserRepo.mockResolvedValue({
      id: 1,
      name: 'テストユーザー',
      url: 'https://example.com',
      phone: '03-1234-5678',
      email: 'test@example.com',
      create_at: new Date(),
      update_at: new Date(),
    })
  })

  const createFormData = (data: Record<string, string | number>): FormData => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.set(key, value.toString())
    })
    return formData
  }

  describe('有効なデータ', () => {
    it('正しいフォームデータでユーザーを更新する', async () => {
      const formData = createFormData({
        id: '1',
        name: 'テストユーザー',
        url: 'https://example.com',
        phone1: '03',
        phone2: '1234',
        phone3: '5678',
        email: 'test@example.com',
      })

      const result = await updateUser(initialState, formData)

      expect(result.success).toBe(true)
      expect(result.message).toBe(null)
      expect(result.data).toEqual({
        id: 1,
        name: 'テストユーザー',
        url: 'https://example.com',
        phone1: '03',
        phone2: '1234',
        phone3: '5678',
        email: 'test@example.com',
      })
      expect(result.errors).toBe(null)
      expect(mockUpdateUserRepo).toHaveBeenCalledWith({
        id: 1,
        name: 'テストユーザー',
        url: 'https://example.com',
        phone: '03-1234-5678',
        email: 'test@example.com',
        create_at: expect.any(Date),
        update_at: expect.any(Date),
      })
      expect(mockRevalidatePath).toHaveBeenCalledWith('/users/1')
    })
  })

  describe('バリデーションエラー', () => {
    it('空の氏名でバリデーションエラーを返す', async () => {
      const formData = createFormData({
        id: '1',
        name: '',
        url: 'https://example.com',
        phone1: '03',
        phone2: '1234',
        phone3: '5678',
        email: 'test@example.com',
      })

      const result = await updateUser(initialState, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('エラー項目があります')
      expect(result.errors).toEqual([{ name: '氏名は1文字以上で入力してください' }])
      expect(mockUpdateUserRepo).not.toHaveBeenCalled()
      expect(mockRevalidatePath).not.toHaveBeenCalled()
    })

    it('無効なURLでバリデーションエラーを返す', async () => {
      const formData = createFormData({
        id: '1',
        name: 'テストユーザー',
        url: 'invalid-url',
        phone1: '03',
        phone2: '1234',
        phone3: '5678',
        email: 'test@example.com',
      })

      const result = await updateUser(initialState, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('エラー項目があります')
      expect(result.errors).toEqual([{ url: 'URLの形式が正しくありません' }])
      expect(mockUpdateUserRepo).not.toHaveBeenCalled()
    })

    it('複数のバリデーションエラーを返す', async () => {
      const formData = createFormData({
        id: '1',
        name: '',
        url: 'invalid-url',
        phone1: '03',
        phone2: '1234',
        phone3: '5678',
        email: 'invalid-email',
      })

      const result = await updateUser(initialState, formData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('エラー項目があります')
      expect(result.errors).toHaveLength(3)
      expect(mockUpdateUserRepo).not.toHaveBeenCalled()
    })
  })

  describe('リポジトリ層エラー', () => {
    it('リポジトリ層でエラーが発生した場合にエラーを投げる', async () => {
      const formData = createFormData({
        id: '1',
        name: 'テストユーザー',
        url: 'https://example.com',
        phone1: '03',
        phone2: '1234',
        phone3: '5678',
        email: 'test@example.com',
      })

      const repoError = new Error('Database connection failed')
      mockUpdateUserRepo.mockRejectedValue(repoError)

      await expect(updateUser(initialState, formData)).rejects.toThrow('Internal Server Error')
      expect(mockRevalidatePath).not.toHaveBeenCalled()
    })
  })
})
