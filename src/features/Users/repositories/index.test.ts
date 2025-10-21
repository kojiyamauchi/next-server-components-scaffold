import type { User } from '@prisma/client'

const mockFindMany = jest.fn()
const mockFindUnique = jest.fn()
const mockCreate = jest.fn()
const mockUpdate = jest.fn()
const mockDelete = jest.fn()

jest.mock('@/libs/prismaClient', () => ({
  prisma: {
    user: {
      findMany: mockFindMany,
      findUnique: mockFindUnique,
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete,
    },
  },
}))

import { createUserRepo, deleteUserRepo, fetchUserRepo, fetchUsersRepo, updateUserRepo } from './index'

describe('Repositories Unit Test', () => {
  beforeEach(() => {
    mockFindMany.mockClear()
    mockFindUnique.mockClear()
    mockCreate.mockClear()
    mockUpdate.mockClear()
    mockDelete.mockClear()
  })

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    url: 'https://example.com',
    phone: '123-456-7890',
    email: 'test@example.com',
    create_at: new Date('2023-01-01'),
    update_at: new Date('2023-01-01'),
  }

  const mockUsers: User[] = [
    mockUser,
    {
      id: 2,
      name: 'Test User 2',
      url: 'https://example2.com',
      phone: '987-654-3210',
      email: 'test2@example.com',
      create_at: new Date('2023-01-02'),
      update_at: new Date('2023-01-02'),
    },
  ]

  describe('fetchUsersRepo', () => {
    it('すべてのユーザーを注文と共にid昇順で取得する', async () => {
      mockFindMany.mockResolvedValue(mockUsers)

      const result = await fetchUsersRepo()

      expect(mockFindMany).toHaveBeenCalledWith({
        orderBy: {
          id: 'asc',
        },
        include: {
          order: true,
        },
      })
      expect(result).toEqual(mockUsers)
    })

    it('ユーザーが存在しない場合は空配列を返す', async () => {
      mockFindMany.mockResolvedValue([])

      const result = await fetchUsersRepo()

      expect(result).toEqual([])
    })

    it('データベース操作が失敗した場合はエラーを投げる', async () => {
      const dbError = new Error('Database connection failed')
      mockFindMany.mockRejectedValue(dbError)

      await expect(fetchUsersRepo()).rejects.toThrow('Database connection failed')
    })
  })

  describe('fetchUserRepo', () => {
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

    it('データベース操作が失敗した場合はエラーを投げる', async () => {
      const dbError = new Error('Database connection failed')
      mockFindUnique.mockRejectedValue(dbError)

      await expect(fetchUserRepo(1)).rejects.toThrow('Database connection failed')
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
  })

  describe('updateUserRepo', () => {
    it('提供されたデータでユーザーを更新する', async () => {
      const updatedUser = { ...mockUser, name: 'Updated User' }
      mockUpdate.mockResolvedValue(updatedUser)

      const result = await updateUserRepo(updatedUser)

      expect(mockUpdate).toHaveBeenCalledWith({
        where: {
          id: updatedUser.id,
        },
        data: updatedUser,
      })
      expect(result).toEqual(updatedUser)
    })

    it('ユーザーが存在しない場合はエラーを投げる', async () => {
      const nonExistentUser = { ...mockUser, id: 999 }
      const dbError = new Error('Record to update not found')
      mockUpdate.mockRejectedValue(dbError)

      await expect(updateUserRepo(nonExistentUser)).rejects.toThrow('Record to update not found')
      expect(mockUpdate).toHaveBeenCalledWith({
        where: {
          id: 999,
        },
        data: nonExistentUser,
      })
    })

    it('データベース操作が失敗した場合はエラーを投げる', async () => {
      const dbError = new Error('Database connection failed')
      mockUpdate.mockRejectedValue(dbError)

      await expect(updateUserRepo(mockUser)).rejects.toThrow('Database connection failed')
    })

    it('部分的なデータでユーザーを更新する', async () => {
      const partialUpdate = { ...mockUser, email: 'newemail@example.com' }
      mockUpdate.mockResolvedValue(partialUpdate)

      const result = await updateUserRepo(partialUpdate)

      expect(mockUpdate).toHaveBeenCalledWith({
        where: {
          id: partialUpdate.id,
        },
        data: partialUpdate,
      })
      expect(result).toEqual(partialUpdate)
    })
  })

  describe('deleteUserRepo', () => {
    it('指定されたIDのユーザーを削除する', async () => {
      mockDelete.mockResolvedValue(mockUser)

      const result = await deleteUserRepo(1)

      expect(mockDelete).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      })
      expect(result).toEqual(mockUser)
    })

    it('ユーザーが存在しない場合はエラーを投げる', async () => {
      const dbError = new Error('Record to delete does not exist')
      mockDelete.mockRejectedValue(dbError)

      await expect(deleteUserRepo(999)).rejects.toThrow('Record to delete does not exist')
      expect(mockDelete).toHaveBeenCalledWith({
        where: {
          id: 999,
        },
      })
    })

    it('データベース操作が失敗した場合はエラーを投げる', async () => {
      const dbError = new Error('Database connection failed')
      mockDelete.mockRejectedValue(dbError)

      await expect(deleteUserRepo(1)).rejects.toThrow('Database connection failed')
    })

    it('負のIDパラメータを処理する', async () => {
      const dbError = new Error('Record to delete does not exist')
      mockDelete.mockRejectedValue(dbError)

      await expect(deleteUserRepo(-1)).rejects.toThrow('Record to delete does not exist')
      expect(mockDelete).toHaveBeenCalledWith({
        where: {
          id: -1,
        },
      })
    })
  })

  describe('createUserRepo', () => {
    const newUserData: Omit<User, 'id'> = {
      name: 'New User',
      url: 'https://newuser.com',
      phone: '555-123-4567',
      email: 'newuser@example.com',
      create_at: new Date('2023-01-03'),
      update_at: new Date('2023-01-03'),
    }

    it('新しいユーザーを作成する', async () => {
      const createdUser = { id: 3, ...newUserData }
      mockCreate.mockResolvedValue(createdUser)

      const result = await createUserRepo(newUserData)

      expect(mockCreate).toHaveBeenCalledWith({
        data: newUserData,
      })
      expect(result).toEqual(createdUser)
    })

    it('重複するメールアドレスによりユーザー作成が失敗した場合はエラーを投げる', async () => {
      const dbError = new Error('Unique constraint failed on the fields: (`email`)')
      mockCreate.mockRejectedValue(dbError)

      await expect(createUserRepo(newUserData)).rejects.toThrow('Unique constraint failed on the fields: (`email`)')
      expect(mockCreate).toHaveBeenCalledWith({
        data: newUserData,
      })
    })

    it('データベース操作が失敗した場合はエラーを投げる', async () => {
      const dbError = new Error('Database connection failed')
      mockCreate.mockRejectedValue(dbError)

      await expect(createUserRepo(newUserData)).rejects.toThrow('Database connection failed')
    })

    it('最小限の必須データでユーザーを作成する', async () => {
      const minimalUserData: Omit<User, 'id'> = {
        name: 'Minimal User',
        url: 'https://minimal.com',
        phone: '111-222-3333',
        email: 'minimal@example.com',
        create_at: new Date(),
        update_at: new Date(),
      }
      const createdUser = { id: 4, ...minimalUserData }
      mockCreate.mockResolvedValue(createdUser)

      const result = await createUserRepo(minimalUserData)

      expect(mockCreate).toHaveBeenCalledWith({
        data: minimalUserData,
      })
      expect(result).toEqual(createdUser)
    })

    it('特殊文字を含むデータでユーザー作成を処理する', async () => {
      const specialCharUserData: Omit<User, 'id'> = {
        name: 'Test User with "special" & <chars>',
        url: 'https://special-chars.com',
        phone: '999-888-7777',
        email: 'special+chars@example.com',
        create_at: new Date(),
        update_at: new Date(),
      }
      const createdUser = { id: 5, ...specialCharUserData }
      mockCreate.mockResolvedValue(createdUser)

      const result = await createUserRepo(specialCharUserData)

      expect(mockCreate).toHaveBeenCalledWith({
        data: specialCharUserData,
      })
      expect(result).toEqual(createdUser)
    })
  })
})
