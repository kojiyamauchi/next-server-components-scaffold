import { beforeEach, describe, expect, it, jest } from '@jest/globals'

// Mock @/libs entirely to avoid env dependency
jest.mock('@/libs', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}))

import { fetchUserRepo } from '../../repositories'
import { getUser } from './index'

jest.mock('../../repositories')

const mockFetchUserRepo = fetchUserRepo as jest.MockedFunction<typeof fetchUserRepo>

describe('ユーザー取得アクション', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('ユーザーが存在する場合', () => {
    it('正しいIDでユーザー情報を取得し電話番号を分割する', async () => {
      mockFetchUserRepo.mockResolvedValue({
        id: 1,
        name: 'テストユーザー',
        url: 'https://example.com',
        phone: '03-1234-5678',
        email: 'test@example.com',
        create_at: new Date(),
        update_at: new Date(),
      })

      const result = await getUser(1)

      expect(result).toEqual({
        id: 1,
        name: 'テストユーザー',
        url: 'https://example.com',
        phone1: '03',
        phone2: '1234',
        phone3: '5678',
        email: 'test@example.com',
        createAt: expect.any(Date),
        updateAt: expect.any(Date),
      })
      expect(mockFetchUserRepo).toHaveBeenCalledWith(1)
    })
  })

  describe('ユーザーが存在しない場合', () => {
    it('ユーザーが見つからない場合nullを返す', async () => {
      mockFetchUserRepo.mockResolvedValue(null)

      const result = await getUser(999)

      expect(result).toBe(null)
      expect(mockFetchUserRepo).toHaveBeenCalledWith(999)
    })
  })

  describe('リポジトリ層エラー', () => {
    it('リポジトリ層でエラーが発生した場合にエラーを投げる', async () => {
      const repoError = new Error('Database connection failed')
      mockFetchUserRepo.mockRejectedValue(repoError)

      await expect(getUser(1)).rejects.toThrow('Internal Server Error')
      expect(mockFetchUserRepo).toHaveBeenCalledWith(1)
    })
  })
})
