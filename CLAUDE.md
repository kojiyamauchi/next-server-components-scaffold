# CLAUDE.md

このファイルは、このリポジトリでコードを操作する際にClaude Code (claude.ai/code) にガイダンスを提供します。

## プロジェクト概要

Next.js 15、React 19、TypeScript、Tailwind CSS 4、Prismaを使用したフルスタックプロジェクトです。パッケージマネージャーにYarnを使用し、包括的なリンティング、テスト、コード品質ツールを含んでいます。PostgreSQLをデータベースとして使用し、Supabaseで管理されています。

## パッケージマネージャー

- **Yarn のみを使用** - このプロジェクトはpackageManagerフィールドでYarn 4.6.0を強制します
- npmはenginesフィールドで明示的にブロックされています

## 開発コマンド

```bash
# 開発サーバー（pathpidaによる型安全ルーティングとNext.js開発サーバーを並列実行）
yarn dev

# Storybook開発サーバー
yarn storybook

# プロダクションビルド（pathpidaビルドとNext.jsビルドを並列実行）
yarn build

# Storybookビルド
yarn build:storybook

# プロダクションサーバー起動
yarn start

# リンティング
yarn lint

# TypeScriptタイプチェック
yarn typecheck

# スペルチェック
yarn spellcheck

# gitフック インストール
yarn prepare
```

## データベース（Prisma + Supabase）

```bash
# Supabaseローカル開発サーバー起動
yarn db:start

# Supabaseローカル開発サーバー停止
yarn db:stop

# データベースリセット
yarn db:reset

# Prismaクライアント生成
yarn prisma:generate

# マイグレーション実行（開発環境）
yarn prisma:migrate:dev

# マイグレーションリセット
yarn prisma:migrate:reset

# マイグレーション実行（本番環境）
yarn prisma:migrate:deploy

# マイグレーション状況確認
yarn prisma:migrate:status

# データベーススキーマを直接プッシュ
yarn prisma:push

# データベーススキーマをPrismaスキーマに反映
yarn prisma:pull

# シードデータ投入
yarn prisma:seed

# Prismaスキーマ検証
yarn prisma:validate

# Prismaスキーマフォーマット
yarn prisma:format

# Prisma Studio起動（データベース管理GUI）
yarn prisma:studio
```

## テスト

### Jest設定

- テストファイル：`src/**/*.test.+(ts|js)` に配置（各featureディレクトリ内）
- 設定：Reactテスト用のjsdom環境を使用
- モジュールエイリアス：`@/*` は `src/*` にマップ
- テスト実行：`yarn jest`

### Storybook + Vitest設定

- Storybookコンポーネントのテスト用にVitestを設定
- ブラウザテスト：Playwrightプロバイダーを使用
- テスト実行：Storybookサーバー経由で自動実行

## コード品質とスタイル

### ESLint設定

- Next.js core-web-vitalsとTypeScript設定を拡張
- 厳格なルールでTypeScript ESLintを使用
- `simple-import-sort`プラグインでインポートソート
- カスタムルールには明示的な関数戻り値型（warn）、アンダースコア例外での未使用変数なしを含む
- Console許可：`console.info` と `console.error` のみ

### Prettier設定

- タブ幅：2スペース
- シングルクォート：有効
- セミコロンなし
- 印刷幅：160文字
- 末尾カンマ：すべて

### プリコミットフック（lint-staged）

`.ts` および `.mjs` ファイルの場合：

1. Prettierフォーマット
2. ESLintで自動修正（最大警告数0）
3. 全ファイルのCSpellチェック

## アーキテクチャ

- **フレームワーク**：Next.js 15 App Router（src/appディレクトリ構造）
- **UI**：React 19
- **スタイリング**：Tailwind CSS 4
- **データベース**：PostgreSQL + Prisma ORM + Supabase
- **TypeScript**：パスエイリアス（`@/*` → `src/*`, `~/*` → `./`）付きのStrictモード
- **ビルドツール**：開発とビルドの両方でTurbopack
- **ルーティング**：pathpidaによる型安全なルーティング（`src/libs/path/`に自動生成）
- **UI開発**：Storybook 9.x（アクセシビリティ、ドキュメンテーション、テスト統合）
- **状態管理**：Server Actions + React Server Components（featuresディレクトリ内のactionsで管理）

## ファイル構造規約

- **Pages**: Next.js App Router用の`src/app/`（ルートグループ構造を採用）
- **Components**: 再利用可能なコンポーネントを`src/components/`に配置
- **Features**: 機能別のコンポーネント、pages、actions、schemas、repositories、containersを`src/features/`に配置
  - `actions/`: Server Actions（CRUD操作、状態管理）
  - `components/`: 機能固有のコンポーネント
  - `containers/`: Server Componentsによるデータ取得とUI結合
  - `pages/`: Next.js App Routerで使用するページコンポーネント
  - `repositories/`: データベースアクセス層
  - `schemas/`: Zodによる型定義とバリデーション
- **Libraries**: ユーティリティとライブラリを`src/libs/`に配置（Prismaクライアント等）
- **Utils**: 汎用ヘルパー関数を`src/utils/`に配置
- **Stories**: Storybookストーリーを各コンポーネントディレクトリに`.stories.tsx`として配置
- **Tests**: テストファイルを各機能ディレクトリ内に`.test.ts`として配置
- **Path Aliases**: srcディレクトリからのインポートには`@/`を使用、ルートからは`~/*`を使用
- **Type-safe Routing**: pathpidaによる型安全なルーティングパスは`src/libs/$path.ts`に自動生成

## 重要な開発ツール

- **pathpida**: 型安全なルーティング（開発時に自動監視、ビルド時に生成）
- **Prisma**: PostgreSQLデータベースのORM、マイグレーション、型安全なクエリ
- **Supabase**: PostgreSQLデータベースホスティング、ローカル開発環境
- **Zod**: ランタイム型バリデーション、Prismaスキーマとの連携
- **Storybook**: コンポーネント開発とドキュメンテーション
- **Husky + lint-staged**: プリコミットフックによるコード品質維持
- **CSpell**: プロジェクト全体のスペルチェック
- **npm-run-all**: 並列コマンド実行（`run-p`コマンド）

## データベーススキーマ

プロジェクトは以下のモデルを含みます：

- **User**: ユーザー情報（名前、URL、電話、メール）
- **Order**: 注文情報（ユーザーとの関連）
- **Item**: 商品情報
- **OrderItem**: 注文と商品の中間テーブル
- **Feed**: フィード情報（商品との関連）

詳細は`prisma/schema.prisma`を参照してください。
