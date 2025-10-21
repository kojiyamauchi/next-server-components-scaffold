import type { User } from '@prisma/client'
import { TRPCError } from '@trpc/server'

import { fetchUserRepo } from '../repositories'
import { users } from './index'

// fetchUserRepoをモック化
jest.mock('../repositories', () => ({
  fetchUserRepo: jest.fn(),
}))

const mockFetchUserRepo = fetchUserRepo as jest.MockedFunction<typeof fetchUserRepo>

describe('tRPC users controller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getUser', () => {
    const mockUser: User = {
      id: 1,
      name: 'テストユーザー',
      url: 'https://example.com',
      phone: '090-1234-5678',
      email: 'test@example.com',
      create_at: new Date('2024-01-01T00:00:00Z'),
      update_at: new Date('2024-01-02T00:00:00Z'),
    }

    describe('正常系', () => {
      it('ユーザーが正常に取得され、フォーマットされたデータが返される', async () => {
        mockFetchUserRepo.mockResolvedValue(mockUser)

        const caller = users.createCaller({})
        const result = await caller.getUser(1)

        expect(mockFetchUserRepo).toHaveBeenCalledWith(1)
        expect(result).toEqual({
          id: 1,
          name: 'テストユーザー',
          url: 'https://example.com',
          phone1: '090',
          phone2: '1234',
          phone3: '5678',
          email: 'test@example.com',
          createAt: mockUser.create_at,
          updateAt: mockUser.update_at,
        })
      })

      it('異なる電話番号フォーマットでも正しく分割される', async () => {
        const userWithDifferentPhone: User = {
          ...mockUser,
          phone: '03-9999-8888',
        }
        mockFetchUserRepo.mockResolvedValue(userWithDifferentPhone)

        const caller = users.createCaller({})
        const result = await caller.getUser(1)

        expect(result.phone1).toBe('03')
        expect(result.phone2).toBe('9999')
        expect(result.phone3).toBe('8888')
      })
    })

    describe('異常系', () => {
      it('ユーザーが見つからない場合、NOT_FOUNDエラーをスローする', async () => {
        mockFetchUserRepo.mockResolvedValue(null)

        const caller = users.createCaller({})

        await expect(caller.getUser(999)).rejects.toThrow(
          new TRPCError({
            code: 'NOT_FOUND',
            message: 'ユーザーが見つかりません',
          }),
        )
        expect(mockFetchUserRepo).toHaveBeenCalledWith(999)
      })

      it('fetchUserRepoがエラーをスローした場合、INTERNAL_SERVER_ERRORをスローする', async () => {
        const databaseError = new Error('データベース接続エラー')
        mockFetchUserRepo.mockRejectedValue(databaseError)

        const caller = users.createCaller({})

        await expect(caller.getUser(1)).rejects.toThrow(
          new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'データベース接続エラー',
          }),
        )
      })

      it('不明なエラーが発生した場合、INTERNAL_SERVER_ERRORをスローする', async () => {
        mockFetchUserRepo.mockRejectedValue('不明なエラー')

        const caller = users.createCaller({})

        await expect(caller.getUser(1)).rejects.toThrow(
          new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: '不明なサーバーエラー',
          }),
        )
      })

      it('TRPCErrorがスローされた場合、そのままスローする', async () => {
        const trpcError = new TRPCError({
          code: 'BAD_REQUEST',
          message: 'カスタムエラー',
        })
        mockFetchUserRepo.mockRejectedValue(trpcError)

        const caller = users.createCaller({})

        await expect(caller.getUser(1)).rejects.toThrow(trpcError)
      })
    })

    describe('入力バリデーション', () => {
      it('数値以外の入力を拒否する', async () => {
        const caller = users.createCaller({})

        await expect(caller.getUser('abc' as unknown as number)).rejects.toThrow()
      })

      it('負の数値でもリポジトリを呼び出す', async () => {
        mockFetchUserRepo.mockResolvedValue(null)

        const caller = users.createCaller({})

        await expect(caller.getUser(-1)).rejects.toThrow(
          new TRPCError({
            code: 'NOT_FOUND',
            message: 'ユーザーが見つかりません',
          }),
        )
        expect(mockFetchUserRepo).toHaveBeenCalledWith(-1)
      })

      it('0でもリポジトリを呼び出す', async () => {
        mockFetchUserRepo.mockResolvedValue(null)

        const caller = users.createCaller({})

        await expect(caller.getUser(0)).rejects.toThrow(
          new TRPCError({
            code: 'NOT_FOUND',
            message: 'ユーザーが見つかりません',
          }),
        )
        expect(mockFetchUserRepo).toHaveBeenCalledWith(0)
      })
    })

    describe('エッジケース', () => {
      it('電話番号が空文字の場合でも処理される', async () => {
        const userWithEmptyPhone: User = {
          ...mockUser,
          phone: '--',
        }
        mockFetchUserRepo.mockResolvedValue(userWithEmptyPhone)

        const caller = users.createCaller({})
        const result = await caller.getUser(1)

        expect(result.phone1).toBe('')
        expect(result.phone2).toBe('')
        expect(result.phone3).toBe('')
      })

      it('電話番号のハイフンが多い場合、最初の3つが使用される', async () => {
        const userWithManyHyphens: User = {
          ...mockUser,
          phone: '090-1234-5678-extra',
        }
        mockFetchUserRepo.mockResolvedValue(userWithManyHyphens)

        const caller = users.createCaller({})
        const result = await caller.getUser(1)

        expect(result.phone1).toBe('090')
        expect(result.phone2).toBe('1234')
        expect(result.phone3).toBe('5678')
      })

      it('電話番号のハイフンが少ない場合、undefinedとなる', async () => {
        const userWithFewHyphens: User = {
          ...mockUser,
          phone: '090-1234',
        }
        mockFetchUserRepo.mockResolvedValue(userWithFewHyphens)

        const caller = users.createCaller({})
        const result = await caller.getUser(1)

        expect(result.phone1).toBe('090')
        expect(result.phone2).toBe('1234')
        expect(result.phone3).toBeUndefined()
      })
    })
  })
})
