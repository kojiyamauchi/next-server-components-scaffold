import type { User } from '@prisma/client'

const mockFindUnique = jest.fn()

jest.mock('@/libs/prismaClient', () => ({
  prisma: {
    user: {
      findUnique: mockFindUnique,
    },
  },
}))

import { fetchUserRepo } from './index'

describe('fetchUserRepo Unit Test', () => {
  beforeEach(() => {
    mockFindUnique.mockClear()
  })

  const mockUser: User = {
    id: 1,
    name: 'テストユーザー',
    url: 'https://example.com',
    phone: '090-1234-5678',
    email: 'test@example.com',
    create_at: new Date('2023-01-01'),
    update_at: new Date('2023-01-01'),
  }

  describe('正常系', () => {
    it('指定されたIDのユーザーを注文と共に取得する', async () => {
      mockFindUnique.mockResolvedValue(mockUser)

      const result = await fetchUserRepo(1)

      expect(mockFindUnique).toHaveBeenCalledWith({
        include: {
          order: true,
        },
        where: {
          id: 1,
        },
      })
      expect(result).toEqual(mockUser)
    })

    it('大きな数値のIDでユーザーを取得できる', async () => {
      const largeIdUser = { ...mockUser, id: 999999 }
      mockFindUnique.mockResolvedValue(largeIdUser)

      const result = await fetchUserRepo(999999)

      expect(mockFindUnique).toHaveBeenCalledWith({
        include: {
          order: true,
        },
        where: {
          id: 999999,
        },
      })
      expect(result).toEqual(largeIdUser)
    })

    it('注文情報を含むユーザーを正しく取得する', async () => {
      const userWithOrders = {
        ...mockUser,
        order: [
          {
            id: 1,
            userId: 1,
            order_date: new Date('2023-01-01'),
            total_price: 1000,
          },
        ],
      }
      mockFindUnique.mockResolvedValue(userWithOrders)

      const result = await fetchUserRepo(1)

      expect(result).toEqual(userWithOrders)
      expect(mockFindUnique).toHaveBeenCalledWith({
        include: {
          order: true,
        },
        where: {
          id: 1,
        },
      })
    })
  })

  describe('異常系 - ユーザー未発見', () => {
    it('ユーザーが見つからない場合はnullを返す', async () => {
      mockFindUnique.mockResolvedValue(null)

      const result = await fetchUserRepo(999)

      expect(mockFindUnique).toHaveBeenCalledWith({
        include: {
          order: true,
        },
        where: {
          id: 999,
        },
      })
      expect(result).toBeNull()
    })

    it('存在しない大きなIDの場合はnullを返す', async () => {
      mockFindUnique.mockResolvedValue(null)

      const result = await fetchUserRepo(9999999)

      expect(result).toBeNull()
    })
  })

  describe('異常系 - データベースエラー', () => {
    it('データベース接続エラーが発生した場合はエラーを投げる', async () => {
      const dbError = new Error('Database connection failed')
      mockFindUnique.mockRejectedValue(dbError)

      await expect(fetchUserRepo(1)).rejects.toThrow('Database connection failed')
      expect(mockFindUnique).toHaveBeenCalledWith({
        include: {
          order: true,
        },
        where: {
          id: 1,
        },
      })
    })

    it('Prismaクライアントエラーが発生した場合はエラーを投げる', async () => {
      const prismaError = new Error('Prisma Client Error')
      mockFindUnique.mockRejectedValue(prismaError)

      await expect(fetchUserRepo(1)).rejects.toThrow('Prisma Client Error')
    })

    it('タイムアウトエラーが発生した場合はエラーを投げる', async () => {
      const timeoutError = new Error('Query timeout')
      mockFindUnique.mockRejectedValue(timeoutError)

      await expect(fetchUserRepo(1)).rejects.toThrow('Query timeout')
    })
  })

  describe('エッジケース', () => {
    it('IDが0の場合も処理できる', async () => {
      const zeroIdUser = { ...mockUser, id: 0 }
      mockFindUnique.mockResolvedValue(zeroIdUser)

      const result = await fetchUserRepo(0)

      expect(mockFindUnique).toHaveBeenCalledWith({
        include: {
          order: true,
        },
        where: {
          id: 0,
        },
      })
      expect(result).toEqual(zeroIdUser)
    })

    it('負のIDパラメータを処理する', async () => {
      mockFindUnique.mockResolvedValue(null)

      const result = await fetchUserRepo(-1)

      expect(mockFindUnique).toHaveBeenCalledWith({
        include: {
          order: true,
        },
        where: {
          id: -1,
        },
      })
      expect(result).toBeNull()
    })

    it('最大整数値のIDを処理する', async () => {
      const maxIntUser = { ...mockUser, id: Number.MAX_SAFE_INTEGER }
      mockFindUnique.mockResolvedValue(maxIntUser)

      const result = await fetchUserRepo(Number.MAX_SAFE_INTEGER)

      expect(mockFindUnique).toHaveBeenCalledWith({
        include: {
          order: true,
        },
        where: {
          id: Number.MAX_SAFE_INTEGER,
        },
      })
      expect(result).toEqual(maxIntUser)
    })

    it('注文が空の配列の場合も正しく処理する', async () => {
      const userWithoutOrders = {
        ...mockUser,
        order: [],
      }
      mockFindUnique.mockResolvedValue(userWithoutOrders)

      const result = await fetchUserRepo(1)

      expect(result).toEqual(userWithoutOrders)
    })

    it('複数の注文を持つユーザーを正しく取得する', async () => {
      const userWithMultipleOrders = {
        ...mockUser,
        order: [
          {
            id: 1,
            userId: 1,
            order_date: new Date('2023-01-01'),
            total_price: 1000,
          },
          {
            id: 2,
            userId: 1,
            order_date: new Date('2023-01-02'),
            total_price: 2000,
          },
          {
            id: 3,
            userId: 1,
            order_date: new Date('2023-01-03'),
            total_price: 3000,
          },
        ],
      }
      mockFindUnique.mockResolvedValue(userWithMultipleOrders)

      const result = await fetchUserRepo(1)

      expect(result).toEqual(userWithMultipleOrders)
    })
  })
})
