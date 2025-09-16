import { beforeEach, describe, expect, it, jest } from '@jest/globals'

// Mock @/libs entirely to avoid env dependency
jest.mock('@/libs', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
    },
  },
}))

import { fetchUsersRepo } from '../../repositories'
import { getUsers } from './index'

jest.mock('../../repositories')

const mockFetchUsersRepo = fetchUsersRepo as jest.MockedFunction<typeof fetchUsersRepo>

describe('ユーザー一覧取得アクション', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('ユーザーが存在する場合', () => {
    it('複数のユーザーを取得する', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'テストユーザー1',
          url: 'https://example1.com',
          phone: '03-1234-5678',
          email: 'test1@example.com',
          create_at: new Date('2024-01-01'),
          update_at: new Date('2024-01-01'),
        },
        {
          id: 2,
          name: 'テストユーザー2',
          url: 'https://example2.com',
          phone: '06-9876-5432',
          email: 'test2@example.com',
          create_at: new Date('2024-01-02'),
          update_at: new Date('2024-01-02'),
        },
      ]

      mockFetchUsersRepo.mockResolvedValue(mockUsers)

      const result = await getUsers()

      expect(result).toEqual(mockUsers)
      expect(result).toHaveLength(2)
      expect(mockFetchUsersRepo).toHaveBeenCalledTimes(1)
    })

    it('ユーザーが存在しない場合空配列を返す', async () => {
      mockFetchUsersRepo.mockResolvedValue([])

      const result = await getUsers()

      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })
  })

  describe('リポジトリ層エラー', () => {
    it('リポジトリ層でエラーが発生した場合にエラーを投げる', async () => {
      const repoError = new Error('Database connection failed')
      mockFetchUsersRepo.mockRejectedValue(repoError)

      await expect(getUsers()).rejects.toThrow('Internal Server Error')
      expect(mockFetchUsersRepo).toHaveBeenCalledTimes(1)
    })
  })
})
