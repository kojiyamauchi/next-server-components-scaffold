import type { User } from '@prisma/client'

const mockFetchUserRepo = jest.fn()

jest.mock('../repositories', () => ({
  fetchUserRepo: mockFetchUserRepo,
}))

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init): { json: () => Promise<unknown>; status: number } => ({
      json: async (): Promise<unknown> => body,
      status: init?.status || 200,
    })),
  },
}))

import { GET } from './route'

describe('GET /api/users/[id] Unit Test', () => {
  beforeEach(() => {
    mockFetchUserRepo.mockClear()
    jest.clearAllMocks()
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
    it('有効なIDでユーザーを取得し、整形されたデータを返す', async () => {
      mockFetchUserRepo.mockResolvedValue(mockUser)

      const mockRequest = {} as Request
      const mockParams = { params: Promise.resolve({ id: '1' }) }

      const response = await GET(mockRequest, mockParams)
      const data = await response.json()

      expect(mockFetchUserRepo).toHaveBeenCalledWith(1)
      expect(response.status).toBe(200)
      expect(data).toEqual({
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

    it('大きな数値のIDでユーザーを取得できる', async () => {
      const largeIdUser = { ...mockUser, id: 999999 }
      mockFetchUserRepo.mockResolvedValue(largeIdUser)

      const mockRequest = {} as Request
      const mockParams = { params: Promise.resolve({ id: '999999' }) }

      const response = await GET(mockRequest, mockParams)
      const data = await response.json()

      expect(mockFetchUserRepo).toHaveBeenCalledWith(999999)
      expect(response.status).toBe(200)
      expect(data.id).toBe(999999)
    })

    it('ハイフンなしの電話番号を正しく分割する', async () => {
      const userWithDifferentPhone = {
        ...mockUser,
        phone: '080-9876-5432',
      }
      mockFetchUserRepo.mockResolvedValue(userWithDifferentPhone)

      const mockRequest = {} as Request
      const mockParams = { params: Promise.resolve({ id: '1' }) }

      const response = await GET(mockRequest, mockParams)
      const data = await response.json()

      expect(data.phone1).toBe('080')
      expect(data.phone2).toBe('9876')
      expect(data.phone3).toBe('5432')
    })
  })

  describe('異常系 - バリデーションエラー', () => {
    it('数値以外のIDを受け取った場合は400エラーを返す', async () => {
      const mockRequest = {} as Request
      const mockParams = { params: Promise.resolve({ id: 'invalid' }) }

      const response = await GET(mockRequest, mockParams)
      const data = await response.json()

      expect(mockFetchUserRepo).not.toHaveBeenCalled()
      expect(response.status).toBe(400)
      expect(data).toEqual({ message: 'Invalid value.' })
    })

    it('文字列を含むIDを受け取った場合は400エラーを返す', async () => {
      const mockRequest = {} as Request
      const mockParams = { params: Promise.resolve({ id: '123abc' }) }

      const response = await GET(mockRequest, mockParams)
      const data = await response.json()

      expect(mockFetchUserRepo).not.toHaveBeenCalled()
      expect(response.status).toBe(400)
      expect(data).toEqual({ message: 'Invalid value.' })
    })

    it('特殊文字を含むIDを受け取った場合は400エラーを返す', async () => {
      const mockRequest = {} as Request
      const mockParams = { params: Promise.resolve({ id: '@#$' }) }

      const response = await GET(mockRequest, mockParams)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({ message: 'Invalid value.' })
    })
  })

  describe('異常系 - ユーザー未発見', () => {
    it('存在しないIDの場合は404エラーを返す', async () => {
      mockFetchUserRepo.mockResolvedValue(null)

      const mockRequest = {} as Request
      const mockParams = { params: Promise.resolve({ id: '999' }) }

      const response = await GET(mockRequest, mockParams)
      const data = await response.json()

      expect(mockFetchUserRepo).toHaveBeenCalledWith(999)
      expect(response.status).toBe(404)
      expect(data).toEqual({ message: 'No results found.' })
    })
  })

  describe('異常系 - サーバーエラー', () => {
    it('リポジトリ層でエラーが発生した場合は500エラーを返す', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const dbError = new Error('Database connection failed')
      mockFetchUserRepo.mockRejectedValue(dbError)

      const mockRequest = {} as Request
      const mockParams = { params: Promise.resolve({ id: '1' }) }

      const response = await GET(mockRequest, mockParams)
      const data = await response.json()

      expect(mockFetchUserRepo).toHaveBeenCalledWith(1)
      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Internal Server Error' })
      expect(consoleErrorSpy).toHaveBeenCalledWith('Maybe Repository Layer Error', dbError)

      consoleErrorSpy.mockRestore()
    })

    it('予期しないエラーが発生した場合は500エラーを返す', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      mockFetchUserRepo.mockRejectedValue(new Error('Unexpected error'))

      const mockRequest = {} as Request
      const mockParams = { params: Promise.resolve({ id: '1' }) }

      const response = await GET(mockRequest, mockParams)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Internal Server Error' })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('エッジケース', () => {
    it('IDが0の場合も処理できる', async () => {
      const zeroIdUser = { ...mockUser, id: 0 }
      mockFetchUserRepo.mockResolvedValue(zeroIdUser)

      const mockRequest = {} as Request
      const mockParams = { params: Promise.resolve({ id: '0' }) }

      const response = await GET(mockRequest, mockParams)
      const data = await response.json()

      expect(mockFetchUserRepo).toHaveBeenCalledWith(0)
      expect(response.status).toBe(200)
      expect(data.id).toBe(0)
    })

    it('浮動小数点数のIDも数値として処理する', async () => {
      const floatIdUser = { ...mockUser, id: 1 }
      mockFetchUserRepo.mockResolvedValue(floatIdUser)

      const mockRequest = {} as Request
      const mockParams = { params: Promise.resolve({ id: '1.5' }) }

      const response = await GET(mockRequest, mockParams)

      expect(mockFetchUserRepo).toHaveBeenCalledWith(1.5)
      expect(response.status).toBe(200)
    })

    it('負の数のIDも処理する', async () => {
      mockFetchUserRepo.mockResolvedValue(null)

      const mockRequest = {} as Request
      const mockParams = { params: Promise.resolve({ id: '-1' }) }

      const response = await GET(mockRequest, mockParams)
      const data = await response.json()

      expect(mockFetchUserRepo).toHaveBeenCalledWith(-1)
      expect(response.status).toBe(404)
      expect(data).toEqual({ message: 'No results found.' })
    })

    it('空文字列のIDは0として処理される', async () => {
      mockFetchUserRepo.mockResolvedValue(null)

      const mockRequest = {} as Request
      const mockParams = { params: Promise.resolve({ id: '' }) }

      const response = await GET(mockRequest, mockParams)
      const data = await response.json()

      expect(mockFetchUserRepo).toHaveBeenCalledWith(0)
      expect(response.status).toBe(404)
      expect(data).toEqual({ message: 'No results found.' })
    })

    it('電話番号が異なるフォーマットでも正しく分割する', async () => {
      const userWithUnusualPhone = {
        ...mockUser,
        phone: '03-1234-5678',
      }
      mockFetchUserRepo.mockResolvedValue(userWithUnusualPhone)

      const mockRequest = {} as Request
      const mockParams = { params: Promise.resolve({ id: '1' }) }

      const response = await GET(mockRequest, mockParams)
      const data = await response.json()

      expect(data.phone1).toBe('03')
      expect(data.phone2).toBe('1234')
      expect(data.phone3).toBe('5678')
    })
  })
})
