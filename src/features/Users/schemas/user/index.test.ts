import { describe, expect, it } from '@jest/globals'

import { createUserSchema, type CreateUserSchemaType, updateUserSchema, type UpdateUserSchemaType, userSchema, type UserSchemaType } from './index'

describe('user schema', () => {
  const validUserData = {
    id: 1,
    name: 'テストユーザー',
    url: 'https://example.com',
    phone1: '03',
    phone2: '1234',
    phone3: '5678',
    email: 'test@example.com',
    createAt: new Date('2023-01-01T00:00:00.000Z'),
    updateAt: new Date('2023-01-01T00:00:00.000Z'),
  }

  describe('有効なデータ', () => {
    it('正しいユーザーデータを検証する', () => {
      const result = userSchema.safeParse(validUserData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validUserData)
      }
    })
  })

  describe('IDバリデーション', () => {
    it('有効な数値IDを受け入れる', () => {
      const result = userSchema.safeParse({ ...validUserData, id: 123 })
      expect(result.success).toBe(true)
    })

    it('文字列IDを拒否する', () => {
      const result = userSchema.safeParse({ ...validUserData, id: '123' })
      expect(result.success).toBe(false)
    })

    it('IDの欠落を拒否する', () => {
      const { id: _id, ...dataWithoutId } = validUserData
      const result = userSchema.safeParse(dataWithoutId)
      expect(result.success).toBe(false)
    })
  })

  describe('氏名バリデーション', () => {
    it('有効な氏名を受け入れる', () => {
      const result = userSchema.safeParse({ ...validUserData, name: 'テストユーザー' })
      expect(result.success).toBe(true)
    })

    it('空文字の氏名を拒否する', () => {
      const result = userSchema.safeParse({ ...validUserData, name: '' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('氏名は1文字以上で入力してください')
      }
    })

    it('文字列以外の氏名を拒否する', () => {
      const result = userSchema.safeParse({ ...validUserData, name: 123 })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('氏名の形式が文字列ではありません')
      }
    })

    it('氏名の欠落を拒否する', () => {
      const { name: _name, ...dataWithoutName } = validUserData
      const result = userSchema.safeParse(dataWithoutName)
      expect(result.success).toBe(false)
    })
  })

  describe('URLバリデーション', () => {
    it('有効なhttps URLを受け入れる', () => {
      const result = userSchema.safeParse({ ...validUserData, url: 'https://example.com' })
      expect(result.success).toBe(true)
    })

    it('有効なhttp URLを受け入れる', () => {
      const result = userSchema.safeParse({ ...validUserData, url: 'http://example.com' })
      expect(result.success).toBe(true)
    })

    it('無効なURL形式を拒否する', () => {
      const result = userSchema.safeParse({ ...validUserData, url: 'not-a-url' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('URLの形式が正しくありません')
      }
    })

    it('空文字のURLを拒否する', () => {
      const result = userSchema.safeParse({ ...validUserData, url: '' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('URLの形式が正しくありません')
      }
    })

    it('URLの欠落を拒否する', () => {
      const { url: _url, ...dataWithoutUrl } = validUserData
      const result = userSchema.safeParse(dataWithoutUrl)
      expect(result.success).toBe(false)
    })
  })

  describe('phone1 バリデーション (市外局番)', () => {
    it('有効な1桁の市外局番を受け入れる', () => {
      const result = userSchema.safeParse({ ...validUserData, phone1: '3' })
      expect(result.success).toBe(true)
    })

    it('有効な4桁の市外局番を受け入れる', () => {
      const result = userSchema.safeParse({ ...validUserData, phone1: '0120' })
      expect(result.success).toBe(true)
    })

    it('空の市外局番を拒否する', () => {
      const result = userSchema.safeParse({ ...validUserData, phone1: '' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('電話番号:市外局番は1桁以上で入力してください')
      }
    })

    it('4桁を超える市外局番を拒否する', () => {
      const result = userSchema.safeParse({ ...validUserData, phone1: '12345' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('電話番号:市外局番は4桁以内で入力してください')
      }
    })

    it('数字以外の文字を含む市外局番を拒否する', () => {
      const result = userSchema.safeParse({ ...validUserData, phone1: '03a' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('電話番号:市外局番は数字のみで入力してください')
      }
    })

    it('ハイフンを含む市外局番を拒否する', () => {
      const result = userSchema.safeParse({ ...validUserData, phone1: '0-3' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('電話番号:市外局番は数字のみで入力してください')
      }
    })
  })

  describe('phone2 バリデーション (市内局番)', () => {
    it('有効な1桁の市内局番を受け入れる', () => {
      const result = userSchema.safeParse({ ...validUserData, phone2: '1' })
      expect(result.success).toBe(true)
    })

    it('有効な4桁の市内局番を受け入れる', () => {
      const result = userSchema.safeParse({ ...validUserData, phone2: '1234' })
      expect(result.success).toBe(true)
    })

    it('空の市内局番を拒否する', () => {
      const result = userSchema.safeParse({ ...validUserData, phone2: '' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('電話番号:市内局番は1桁以上で入力してください')
      }
    })

    it('4桁を超える市内局番を拒否する', () => {
      const result = userSchema.safeParse({ ...validUserData, phone2: '12345' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('電話番号:市内局番は4桁以内で入力してください')
      }
    })

    it('数字以外の文字を含む市内局番を拒否する', () => {
      const result = userSchema.safeParse({ ...validUserData, phone2: '123a' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('電話番号:市内局番は数字のみで入力してください')
      }
    })
  })

  describe('phone3 バリデーション (加入者番号)', () => {
    it('有効な4桁の加入者番号を受け入れる', () => {
      const result = userSchema.safeParse({ ...validUserData, phone3: '5678' })
      expect(result.success).toBe(true)
    })

    it('4桁未満の加入者番号を拒否する', () => {
      const result = userSchema.safeParse({ ...validUserData, phone3: '567' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('電話番号:加入者番号は4桁で入力してください')
      }
    })

    it('4桁を超える加入者番号を拒否する', () => {
      const result = userSchema.safeParse({ ...validUserData, phone3: '56789' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('電話番号:加入者番号は4桁で入力してください')
      }
    })

    it('数字以外の文字を含む加入者番号を拒否する', () => {
      const result = userSchema.safeParse({ ...validUserData, phone3: '567a' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('電話番号:加入者は数字のみで入力してください')
      }
    })

    it('空の加入者番号を拒否する', () => {
      const result = userSchema.safeParse({ ...validUserData, phone3: '' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('電話番号:加入者番号は4桁で入力してください')
      }
    })
  })

  describe('メールアドレスバリデーション', () => {
    it('有効なメールアドレスを受け入れる', () => {
      const result = userSchema.safeParse({ ...validUserData, email: 'test@example.com' })
      expect(result.success).toBe(true)
    })

    it('サブドメインありのメールアドレスを受け入れる', () => {
      const result = userSchema.safeParse({ ...validUserData, email: 'test@mail.example.com' })
      expect(result.success).toBe(true)
    })

    it('無効なメールアドレス形式を拒否する', () => {
      const result = userSchema.safeParse({ ...validUserData, email: 'invalid-email' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('メールアドレスの形式が正しくありません')
      }
    })

    it('@マークなしのメールアドレスを拒否する', () => {
      const result = userSchema.safeParse({ ...validUserData, email: 'test-example.com' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('メールアドレスの形式が正しくありません')
      }
    })

    it('ドメインなしのメールアドレスを拒否する', () => {
      const result = userSchema.safeParse({ ...validUserData, email: 'test@' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('メールアドレスの形式が正しくありません')
      }
    })

    it('空のメールアドレスを拒否する', () => {
      const result = userSchema.safeParse({ ...validUserData, email: '' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('メールアドレスの形式が正しくありません')
      }
    })
  })

  describe('createAt バリデーション', () => {
    it('有効なDate型のcreateAtを受け入れる', () => {
      const result = userSchema.safeParse({ ...validUserData, createAt: new Date() })
      expect(result.success).toBe(true)
    })

    it('文字列のcreateAtを拒否する', () => {
      const result = userSchema.safeParse({ ...validUserData, createAt: '2023-01-01' })
      expect(result.success).toBe(false)
    })

    it('createAtの欠落を拒否する', () => {
      const { createAt: _createAt, ...dataWithoutCreateAt } = validUserData
      const result = userSchema.safeParse(dataWithoutCreateAt)
      expect(result.success).toBe(false)
    })
  })

  describe('updateAt バリデーション', () => {
    it('有効なDate型のupdateAtを受け入れる', () => {
      const result = userSchema.safeParse({ ...validUserData, updateAt: new Date() })
      expect(result.success).toBe(true)
    })

    it('文字列のupdateAtを拒否する', () => {
      const result = userSchema.safeParse({ ...validUserData, updateAt: '2023-01-01' })
      expect(result.success).toBe(false)
    })

    it('updateAtの欠落を拒否する', () => {
      const { updateAt: _updateAt, ...dataWithoutUpdateAt } = validUserData
      const result = userSchema.safeParse(dataWithoutUpdateAt)
      expect(result.success).toBe(false)
    })
  })
})

describe('ユーザー作成スキーマ', () => {
  const validCreateUserData = {
    name: 'テストユーザー',
    url: 'https://example.com',
    phone1: '03',
    phone2: '1234',
    phone3: '5678',
    email: 'test@example.com',
  }

  it('IDなしの正しいユーザー作成データを検証する', () => {
    const result = createUserSchema.safeParse(validCreateUserData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(validCreateUserData)
    }
  })

  it('IDフィールド付きのデータを処理する', () => {
    const dataWithId = { ...validCreateUserData, id: 1 }
    const result = createUserSchema.safeParse(dataWithId)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).not.toHaveProperty('id')
      expect(result.data).toEqual(validCreateUserData)
    }
  })

  it('createAtやupdateAtフィールド付きのデータを処理する', () => {
    const dataWithTimestamps = {
      ...validCreateUserData,
      id: 1,
      createAt: new Date(),
      updateAt: new Date(),
    }
    const result = createUserSchema.safeParse(dataWithTimestamps)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).not.toHaveProperty('id')
      expect(result.data).not.toHaveProperty('createAt')
      expect(result.data).not.toHaveProperty('updateAt')
      expect(result.data).toEqual(validCreateUserData)
    }
  })

  it('userSchemaからすべてのバリデーションルールを継承する', () => {
    const invalidData = {
      name: '',
      url: 'invalid-url',
      phone1: '',
      phone2: '12345',
      phone3: '567',
      email: 'invalid-email',
    }
    const result = createUserSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0)
    }
  })
})

describe('ユーザー更新スキーマ', () => {
  const validUpdateUserData = {
    id: 1,
    name: 'テストユーザー',
    url: 'https://example.com',
    phone1: '03',
    phone2: '1234',
    phone3: '5678',
    email: 'test@example.com',
  }

  it('createAt、updateAtなしの正しいユーザー更新データを検証する', () => {
    const result = updateUserSchema.safeParse(validUpdateUserData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(validUpdateUserData)
    }
  })

  it('createAtやupdateAtフィールド付きのデータを処理する', () => {
    const dataWithTimestamps = {
      ...validUpdateUserData,
      createAt: new Date(),
      updateAt: new Date(),
    }
    const result = updateUserSchema.safeParse(dataWithTimestamps)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).not.toHaveProperty('createAt')
      expect(result.data).not.toHaveProperty('updateAt')
      expect(result.data).toEqual(validUpdateUserData)
    }
  })

  it('userSchemaからすべてのバリデーションルールを継承する', () => {
    const invalidData = {
      id: 1,
      name: '',
      url: 'invalid-url',
      phone1: '',
      phone2: '12345',
      phone3: '567',
      email: 'invalid-email',
    }
    const result = updateUserSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0)
    }
  })
})

describe('TypeScript型', () => {
  it('正しい構造のUserSchemaTypeをエクスポートする', () => {
    const userData: UserSchemaType = {
      id: 1,
      name: 'テストユーザー',
      url: 'https://example.com',
      phone1: '03',
      phone2: '1234',
      phone3: '5678',
      email: 'test@example.com',
      createAt: new Date('2023-01-01T00:00:00.000Z'),
      updateAt: new Date('2023-01-01T00:00:00.000Z'),
    }
    expect(userData.id).toBe(1)
    expect(userData.name).toBe('テストユーザー')
    expect(userData.createAt).toBeInstanceOf(Date)
    expect(userData.updateAt).toBeInstanceOf(Date)
  })

  it('idプロパティなしのCreateUserSchemaTypeをエクスポートする', () => {
    const createUserData: CreateUserSchemaType = {
      name: 'テストユーザー',
      url: 'https://example.com',
      phone1: '03',
      phone2: '1234',
      phone3: '5678',
      email: 'test@example.com',
    }
    expect(createUserData.name).toBe('テストユーザー')
  })

  it('createAt、updateAtプロパティなしのUpdateUserSchemaTypeをエクスポートする', () => {
    const updateUserData: UpdateUserSchemaType = {
      id: 1,
      name: 'テストユーザー',
      url: 'https://example.com',
      phone1: '03',
      phone2: '1234',
      phone3: '5678',
      email: 'test@example.com',
    }
    expect(updateUserData.id).toBe(1)
    expect(updateUserData.name).toBe('テストユーザー')
  })
})
