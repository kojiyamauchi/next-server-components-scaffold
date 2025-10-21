import { beforeEach, describe, expect, it, jest } from '@jest/globals'

jest.mock('@/libs/prismaClient', () => ({
  prisma: {},
}))

import { deleteUserRepo } from '../../repositories'
import { deleteUserAction } from './index'

jest.mock('../../repositories')
jest.mock('@/libs/$path', () => ({
  pagesPath: {
    users: {
      $url: (): { path: string } => ({
        path: '/users',
      }),
    },
  },
}))

const mockDeleteUserRepo = deleteUserRepo as jest.MockedFunction<typeof deleteUserRepo>

describe('ユーザー削除アクション', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDeleteUserRepo.mockResolvedValue({
      id: 1,
      name: 'テストユーザー',
      url: 'https://example.com',
      phone: '03-1234-5678',
      email: 'test@example.com',
      create_at: new Date(),
      update_at: new Date(),
    })
  })

  describe('有効なID', () => {
    it('正しいIDでユーザーを削除する', async () => {
      const result = await deleteUserAction(1)

      expect(result.isSuccess).toBe(true)
      expect(result.path).toBe('/users')
      expect(mockDeleteUserRepo).toHaveBeenCalledWith(1)
    })
  })

  describe('無効なID', () => {
    it('undefinedのIDでエラーを投げる', async () => {
      await expect(deleteUserAction(undefined)).rejects.toThrow('Validate Error - Id is not number type')
      expect(mockDeleteUserRepo).not.toHaveBeenCalled()
    })

    it('NaNでエラーを投げる', async () => {
      await expect(deleteUserAction(NaN)).rejects.toThrow('Validate Error - Id is not number type')
      expect(mockDeleteUserRepo).not.toHaveBeenCalled()
    })
  })

  describe('リポジトリ層エラー', () => {
    it('リポジトリ層でエラーが発生した場合にエラーを投げる', async () => {
      const repoError = new Error('User not found')
      mockDeleteUserRepo.mockRejectedValue(repoError)

      await expect(deleteUserAction(1)).rejects.toThrow('Internal Server Error')
      expect(mockDeleteUserRepo).toHaveBeenCalledWith(1)
    })
  })
})
