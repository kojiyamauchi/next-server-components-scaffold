import { describe, expect, it } from '@jest/globals'

import { authSchema, type AuthSchemaType } from './index'

describe('認証スキーマ', () => {
  const validAuthData = {
    email: 'test@example.com',
    password: 'Password123!',
    login: true,
    signup: false,
  }

  describe('有効なデータ', () => {
    it('正しい認証データを検証する', () => {
      const result = authSchema.safeParse(validAuthData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validAuthData)
      }
    })

    it('ログインとサインアップの両方がfalseでも検証を通す', () => {
      const data = {
        ...validAuthData,
        login: false,
        signup: false,
      }
      const result = authSchema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(data)
      }
    })

    it('ログインとサインアップの両方がtrueでも検証を通す', () => {
      const data = {
        ...validAuthData,
        login: true,
        signup: true,
      }
      const result = authSchema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(data)
      }
    })
  })

  describe('メールアドレスバリデーション', () => {
    it('有効なメールアドレスを受け入れる', () => {
      const result = authSchema.safeParse({ ...validAuthData, email: 'test@example.com' })
      expect(result.success).toBe(true)
    })

    it('サブドメインありのメールアドレスを受け入れる', () => {
      const result = authSchema.safeParse({ ...validAuthData, email: 'test@mail.example.com' })
      expect(result.success).toBe(true)
    })

    it('無効なメールアドレス形式を拒否する', () => {
      const result = authSchema.safeParse({ ...validAuthData, email: 'invalid-email' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('メールアドレスの形式が正しくありません')
      }
    })

    it('@マークなしのメールアドレスを拒否する', () => {
      const result = authSchema.safeParse({ ...validAuthData, email: 'test-example.com' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('メールアドレスの形式が正しくありません')
      }
    })

    it('ドメインなしのメールアドレスを拒否する', () => {
      const result = authSchema.safeParse({ ...validAuthData, email: 'test@' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('メールアドレスの形式が正しくありません')
      }
    })

    it('空のメールアドレスを拒否する', () => {
      const result = authSchema.safeParse({ ...validAuthData, email: '' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('メールアドレスの形式が正しくありません')
      }
    })

    it('メールアドレスの欠落を拒否する', () => {
      const { email: _email, ...dataWithoutEmail } = validAuthData
      const result = authSchema.safeParse(dataWithoutEmail)
      expect(result.success).toBe(false)
    })
  })

  describe('パスワードバリデーション', () => {
    describe('文字数制限', () => {
      it('8文字のパスワードを受け入れる', () => {
        const result = authSchema.safeParse({ ...validAuthData, password: 'Pass123!' })
        expect(result.success).toBe(true)
      })

      it('72文字のパスワードを受け入れる', () => {
        const longPassword = 'A'.repeat(69) + 'a1!'
        const result = authSchema.safeParse({ ...validAuthData, password: longPassword })
        expect(result.success).toBe(true)
      })

      it('7文字以下のパスワードを拒否する', () => {
        const result = authSchema.safeParse({ ...validAuthData, password: 'Pass12!' })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('8文字以上必要です')
        }
      })

      it('73文字以上のパスワードを拒否する', () => {
        const tooLongPassword = 'A'.repeat(70) + 'a1!'
        const result = authSchema.safeParse({ ...validAuthData, password: tooLongPassword })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('72文字以下にしてください')
        }
      })
    })

    describe('小文字要件', () => {
      it('小文字を含むパスワードを受け入れる', () => {
        const result = authSchema.safeParse({ ...validAuthData, password: 'PASSWORD123a!' })
        expect(result.success).toBe(true)
      })

      it('小文字を含まないパスワードを拒否する', () => {
        const result = authSchema.safeParse({ ...validAuthData, password: 'PASSWORD123!' })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('小文字を含めてください')
        }
      })
    })

    describe('大文字要件', () => {
      it('大文字を含むパスワードを受け入れる', () => {
        const result = authSchema.safeParse({ ...validAuthData, password: 'passwordA123!' })
        expect(result.success).toBe(true)
      })

      it('大文字を含まないパスワードを拒否する', () => {
        const result = authSchema.safeParse({ ...validAuthData, password: 'password123!' })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('大文字を含めてください')
        }
      })
    })

    describe('数字要件', () => {
      it('数字を含むパスワードを受け入れる', () => {
        const result = authSchema.safeParse({ ...validAuthData, password: 'Password1!' })
        expect(result.success).toBe(true)
      })

      it('数字を含まないパスワードを拒否する', () => {
        const result = authSchema.safeParse({ ...validAuthData, password: 'Password!' })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('数字を含めてください')
        }
      })
    })

    describe('記号要件', () => {
      it('記号を含むパスワードを受け入れる', () => {
        const result = authSchema.safeParse({ ...validAuthData, password: 'Password123!' })
        expect(result.success).toBe(true)
      })

      it('様々な記号を含むパスワードを受け入れる', () => {
        const symbols = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=']
        symbols.forEach((symbol) => {
          const result = authSchema.safeParse({ ...validAuthData, password: `Password123${symbol}` })
          expect(result.success).toBe(true)
        })
      })

      it('記号を含まないパスワードを拒否する', () => {
        const result = authSchema.safeParse({ ...validAuthData, password: 'Password123' })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('記号を含めてください')
        }
      })
    })

    describe('複合エラー', () => {
      it('複数の要件を満たさないパスワードで複数のエラーを返す', () => {
        const result = authSchema.safeParse({ ...validAuthData, password: 'short' })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues.length).toBe(4)
          const messages = result.error.issues.map((issue) => issue.message)
          expect(messages).toContain('8文字以上必要です')
          expect(messages).toContain('大文字を含めてください')
          expect(messages).toContain('数字を含めてください')
          expect(messages).toContain('記号を含めてください')
        }
      })

      it('空のパスワードで複数のエラーを返す', () => {
        const result = authSchema.safeParse({ ...validAuthData, password: '' })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues.length).toBe(5)
          const messages = result.error.issues.map((issue) => issue.message)
          expect(messages).toContain('8文字以上必要です')
          expect(messages).toContain('小文字を含めてください')
          expect(messages).toContain('大文字を含めてください')
          expect(messages).toContain('数字を含めてください')
          expect(messages).toContain('記号を含めてください')
        }
      })
    })

    it('パスワードの欠落を拒否する', () => {
      const { password: _password, ...dataWithoutPassword } = validAuthData
      const result = authSchema.safeParse(dataWithoutPassword)
      expect(result.success).toBe(false)
    })
  })

  describe('ログインフラグバリデーション', () => {
    it('trueのログインフラグを受け入れる', () => {
      const result = authSchema.safeParse({ ...validAuthData, login: true })
      expect(result.success).toBe(true)
    })

    it('falseのログインフラグを受け入れる', () => {
      const result = authSchema.safeParse({ ...validAuthData, login: false })
      expect(result.success).toBe(true)
    })

    it('文字列のログインフラグを拒否する', () => {
      const result = authSchema.safeParse({ ...validAuthData, login: 'true' })
      expect(result.success).toBe(false)
    })

    it('数値のログインフラグを拒否する', () => {
      const result = authSchema.safeParse({ ...validAuthData, login: 1 })
      expect(result.success).toBe(false)
    })

    it('ログインフラグの欠落を拒否する', () => {
      const { login: _login, ...dataWithoutLogin } = validAuthData
      const result = authSchema.safeParse(dataWithoutLogin)
      expect(result.success).toBe(false)
    })
  })

  describe('サインアップフラグバリデーション', () => {
    it('trueのサインアップフラグを受け入れる', () => {
      const result = authSchema.safeParse({ ...validAuthData, signup: true })
      expect(result.success).toBe(true)
    })

    it('falseのサインアップフラグを受け入れる', () => {
      const result = authSchema.safeParse({ ...validAuthData, signup: false })
      expect(result.success).toBe(true)
    })

    it('文字列のサインアップフラグを拒否する', () => {
      const result = authSchema.safeParse({ ...validAuthData, signup: 'false' })
      expect(result.success).toBe(false)
    })

    it('数値のサインアップフラグを拒否する', () => {
      const result = authSchema.safeParse({ ...validAuthData, signup: 0 })
      expect(result.success).toBe(false)
    })

    it('サインアップフラグの欠落を拒否する', () => {
      const { signup: _signup, ...dataWithoutSignup } = validAuthData
      const result = authSchema.safeParse(dataWithoutSignup)
      expect(result.success).toBe(false)
    })
  })

  describe('全フィールド欠落', () => {
    it('空のオブジェクトを拒否する', () => {
      const result = authSchema.safeParse({})
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBe(4)
      }
    })
  })

  describe('TypeScript型', () => {
    it('正しい構造のAuthSchemaTypeをエクスポートする', () => {
      const authData: AuthSchemaType = {
        email: 'test@example.com',
        password: 'Password123!',
        login: true,
        signup: false,
      }
      expect(authData.email).toBe('test@example.com')
      expect(authData.password).toBe('Password123!')
      expect(authData.login).toBe(true)
      expect(authData.signup).toBe(false)
    })
  })
})
