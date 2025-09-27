# CLAUDE.md

このファイルは、このリポジトリでコードを操作する際にClaude Code (claude.ai/code) にガイダンスを提供します。

## 言語設定

**重要：このプロジェクトでは日本語でのコミュニケーションを優先してください。すべての応答、説明、コメント、ドキュメンテーションは日本語で行ってください。**

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

## Claude Code Agent設定

このプロジェクトでは以下のagentが設定されています：

### 利用可能なAgent

#### 1. general-purpose（デフォルト）
- **用途**: 新規開発、実装、調査、テスト作成
- **得意分野**:
  - 新規コンポーネント・機能の実装
  - ユニットテスト・統合テストの作成
  - コードベースの分析・調査
  - バグ修正・リファクタリング
  - 複雑な多段階タスクの実行

#### 2. test-automation-specialist
- **用途**: テスト実行、失敗分析、テスト修正
- **得意分野**:
  - Jestテストスイートの自動実行
  - テスト失敗の分析と修正
  - 既存テストのメンテナンス
  - CI/CD失敗の対応
  - コード変更後の品質チェック

### Agent使い分けガイド

#### 日常的な開発作業（general-purposeが自動使用）
```bash
# 新規作成・実装
user: "新しいコンポーネントのテストを作成してください"
user: "ユーザープロフィール機能を実装してください"
user: "バグを修正してください"

# 調査・分析
user: "このコードの動作を調べてください"
user: "パフォーマンス改善の方法を提案してください"
```

#### テスト自動化が必要な場合（test-automation-specialistが自動選択）
```bash
# テスト実行・修正
user: "コード変更後のテストを実行してください"
user: "CI/CDでテストが失敗しています。修正してください"
user: "デプロイ前の品質チェックをお願いします"
user: "テストが通らないので修正してください"
```

### Agent設定の変更

```bash
# デフォルトagentの変更
claude set-agent general-purpose      # 開発作業用（推奨）
claude set-agent test-automation-specialist  # テスト特化用

# 現在の設定確認
ls .claude/agents/  # 利用可能なagent一覧
```

### 運用のポイント

- **手動切り替え不要**: Claudeが文脈に応じて適切なagentを自動選択
- **効率的な開発**: 新規作成はgeneral-purpose、テスト関連はtest-automation-specialistが自動対応
- **品質保証**: テスト実行時には専門agentが包括的な検証を実行

## 文字エンコーディング設定

### 文字化け対策

プロジェクトでは日本語を多用するため、文字化けを防ぐための設定が重要です：

#### 1. ファイル作成時の注意点
```bash
# ファイル作成時はUTF-8エンコーディングを必須とする
# 特にテストファイルやドキュメントファイルで日本語を使用する場合
```

#### 2. エディタ設定
- **VSCode**: `"files.encoding": "utf8"` を設定
- **WebStorm**: File Encodings で UTF-8 を指定
- **Vim**: `set encoding=utf-8` を.vimrcに追加

#### 3. Git設定
```bash
# Git設定でUTF-8を指定
git config --global core.quotepath false
git config --global core.precomposeunicode true
```

#### 4. Node.js/Jest設定
```bash
# 環境変数でUTF-8を指定
export LANG=ja_JP.UTF-8
export LC_ALL=ja_JP.UTF-8
```

#### 5. 文字化け発生時の対処法
```bash
# ファイルを削除して再作成
rm [文字化けファイル]
# UTF-8エンコーディングで再作成
```

### Agent設定での対策

- **general-purpose agent**: 日本語ファイル作成時にUTF-8エンコーディングを使用
- **test-automation-specialist agent**: テスト実行時に文字化けチェックを含める

**重要**: 日本語を含むファイル（特にテストファイル）は必ずUTF-8エンコーディングで作成し、作成後に表示確認を行うこと
