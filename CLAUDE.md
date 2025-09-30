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
- **テストデータ生成**：@faker-js/fakerによる動的テストデータ作成

### Storybook + Vitest設定

- Storybookコンポーネントのテスト用にVitestを設定
- ブラウザテスト：Playwrightプロバイダーを使用
- テスト実行：Storybookサーバー経由で自動実行
- **カバレッジ測定**：@vitest/coverage-v8による詳細なカバレッジ分析
- **ブラウザテスト**：@vitest/browserによる実ブラウザ環境テスト

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
- **環境変数管理**：@t3-oss/env-nextjsによる型安全な環境変数
- **日付処理**：dayjs（軽量ライブラリ採用）
- **UI Kit**：@headlessui/react（アクセシビリティ対応）
- **テストツール**：Jest（単体テスト）+ Vitest（Storybookテスト）+ Playwright（E2Eテスト）
- **開発体験**：tsx（TypeScript直接実行）+ npm-run-all（並列実行）

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
- **@t3-oss/env-nextjs**: 型安全な環境変数管理
- **@faker-js/faker**: テストデータ生成
- **dayjs**: 軽量な日付ライブラリ
- **tsx**: TypeScriptファイル直接実行（Prismaシード等）
- **@headlessui/react**: アクセシブルなUIコンポーネント
- **react-loading-skeleton**: ローディングスケルトンUI
- **@supabase/ssr**: Supabase SSR対応
- **Vitest**: Storybookテスト実行エンジン
- **Playwright**: ブラウザテスト自動化

## データベーススキーマ

プロジェクトは以下のモデルを含みます：

- **User**: ユーザー情報（名前、URL、電話、メール）
- **Order**: 注文情報（ユーザーとの関連）
- **Item**: 商品情報
- **OrderItem**: 注文と商品の中間テーブル
- **Feed**: フィード情報（商品との関連）

詳細は`prisma/schema.prisma`を参照してください。

## 環境変数管理

### @t3-oss/env-nextjs統合

型安全な環境変数管理を実装：

```bash
# 環境変数の型定義と実行時チェック
DATABASE_URL=          # サーバーサイド環境変数
DIRECT_URL=           # Prisma Direct URL
NEXT_PUBLIC_SUPABASE_URL=      # クライアントサイド環境変数
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Supabase匿名キー
```

### 設定ファイル

- **開発環境**: `.env.local`
- **型定義**: `src/libs/env.ts`
- **バリデーション**: Zodスキーマによる実行時チェック

## UIライブラリ・コンポーネント

### 採用ライブラリ

- **@headlessui/react**: アクセシブルなヘッドレスUIコンポーネント
- **react-loading-skeleton**: ローディング状態のスケルトンUI
- **Tailwind CSS 4**: ユーティリティファーストCSSフレームワーク

### デザインシステム

- **アクセシビリティ**: @headlessui/reactによるWAI-ARIA準拠
- **レスポンシブ**: Tailwind CSSのブレークポイント活用
- **ローディング**: react-loading-skeletonによる一貫したローディングUX

## CI/CD（GitHub Actions）

このプロジェクトでは3つのGitHub Actionsワークフローで包括的なCI/CDパイプラインを構築しています。

### ワークフロー構成

#### 1. Pull Request CI (`ci.yml`)

```yaml
# 実行トリガー: main ブランチへのPR作成・更新時
# 環境: Node.js 22.x, Yarn 4.6.0, PostgreSQL 15
```

**ジョブフロー**:

```
setup → [cspell, eslint, typecheck, jest] (並列実行) → build-test → [deploy-app-preview, deploy-storybook-preview] (並列実行)
```

**品質チェック項目**:

- **CSpell**: スペルチェック（reviewdog統合でPRレビューコメント自動投稿）
- **ESLint**: コード品質チェック（`.ts/.mjs/.js`ファイル対象、reviewdog統合）
- **TypeScript**: 型チェック（EPMatt/reviewdog-action-tsc使用、警告レベル表示）
- **Jest**: ユニットテスト（テストファイル存在時のみ実行、動的スキップ機能）
- **Build Test**: PostgreSQL環境でのPrismaマイグレーション + Next.jsビルドテスト

**Vercelプレビューデプロイ**:

- Next.jsアプリとStorybookを別プロジェクトとして並列デプロイ
- 環境変数の動的設定・削除・追加・検証プロセス
- PRへのデプロイURL自動コメント投稿機能
- プレビュー用データベース環境での動作確認

#### 2. Production CI (`production.yml`)

```yaml
# 実行トリガー: main ブランチへのpush（マージ後）
# 環境: Pull Request CIと同一設定
```

**本番デプロイ特徴**:

- Pull Request CIの全品質チェックを再実行
- プロダクション環境への自動デプロイ
- 本番データベースでのPrismaマイグレーション実行
- Next.jsアプリとStorybookの並列プロダクションデプロイ

#### 3. Local Test (`local.yml`)

```yaml
# 実行トリガー: workflow_call（手動実行・他ワークフロー呼び出し）
# 用途: ローカル環境の再現、最小限のビルドテスト
```

### 技術的特徴

#### 高度なキャッシュ戦略

- `yarn.lock`ハッシュベースのnode_modulesキャッシュ
- setup ジョブでの依存関係一元管理
- 後続ジョブでのキャッシュ復元による高速化

#### 条件分岐による最適化

```bash
# 各チェック項目の個別ON/OFF制御
LAUNCH_CSPELL: on/off    # CSpellチェック
LAUNCH_ESLINT: on/off    # ESLintチェック
LAUNCH_TYPECHECK: on/off # TypeScriptチェック
LAUNCH_JEST: on/off      # Jestテスト
LAUNCH_BUILD: on/off     # ビルドテスト
LAUNCH_DEPLOY: on/off    # デプロイ実行

# テストファイル存在チェックによる動的スキップ
if find src -type f \( -name "*.test.ts" -o -name "*.test.js" \) | grep -q .;
```

#### reviewdog統合による高品質なPRレビュー

- **CSpell**: 警告レベルでのスペルミス指摘
- **ESLint**: コード品質問題の自動コメント
- **TypeScript**: 型エラーの詳細表示
- すべてGitHub PR ReviewとしてUI上に表示

#### PostgreSQL統合テスト環境

```yaml
services:
  postgres:
    image: postgres:15
    env:
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
      POSTGRES_DB: test
    options: >-
      --health-cmd "pg_isready -U test"
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
```

#### Vercel環境変数管理

- プレビュー/プロダクション環境での動的環境変数設定
- 環境変数の削除→追加→検証フロー
- Supabase環境変数の自動設定
- データベースURLの環境別管理

#### 並列デプロイ戦略

- Next.jsアプリケーション（メイン機能）
- Storybook（UIコンポーネントドキュメント）
- それぞれ独立したVercelプロジェクトとして管理

### 実行権限とセキュリティ

```yaml
permissions:
  contents: read # リポジトリ内容の読み取り
  deployments: write # デプロイメント管理
  pull-requests: write # PRコメント投稿
```

### 必要なGitHub Secrets

```bash
# Vercel関連（メインアプリ）
VERCEL_TOKEN                    # Vercel CLI認証トークン
VERCEL_ORG_ID                   # Vercel組織ID
VERCEL_PROJECT_ID               # VercelプロジェクトID

# Vercel関連（Storybook）
STORYBOOK_VERCEL_TOKEN          # Storybook用Vercelトークン
STORYBOOK_VERCEL_PROJECT_ID     # StorybookプロジェクトID

# データベース関連（プレビュー環境）
PREVIEW_DATABASE_URL            # プレビュー用データベースURL
PREVIEW_DIRECT_URL              # プレビュー用ダイレクトURL
PREVIEW_NEXT_PUBLIC_SUPABASE_URL         # プレビュー用SupabaseURL
PREVIEW_NEXT_PUBLIC_SUPABASE_ANON_KEY    # プレビュー用Supabase匿名キー

# データベース関連（本番環境）
PRODUCTION_DATABASE_URL         # 本番用データベースURL
PRODUCTION_DIRECT_URL           # 本番用ダイレクトURL
PRODUCTION_NEXT_PUBLIC_SUPABASE_URL      # 本番用SupabaseURL
PRODUCTION_NEXT_PUBLIC_SUPABASE_ANON_KEY # 本番用Supabase匿名キー
```

### CI/CDフロー実行例

#### Pull Request作成時

1. **並列品質チェック**: CSpell, ESLint, TypeScript, Jest
2. **ビルドテスト**: PostgreSQL環境でのマイグレーション + ビルド
3. **プレビューデプロイ**: Next.js + Storybook並列デプロイ
4. **PRコメント**: デプロイURLの自動通知

#### Main ブランチマージ時

1. **全品質チェック再実行**: プロダクション品質保証
2. **本番デプロイ**: プロダクション環境への自動デプロイ
3. **本番データベース**: Prismaマイグレーション適用

### トラブルシューティング

#### ワークフロー失敗時の対処

```bash
# 個別チェック項目の無効化（緊急時）
env:
  LAUNCH_ESLINT: off     # ESLintをスキップ
  LAUNCH_JEST: off       # Jestをスキップ

# ローカルでの再現確認
yarn cspell --dot --no-must-find-files "**/*"  # CSpell実行
yarn lint                                        # ESLint実行
yarn typecheck                                  # TypeScript実行
yarn jest                                        # Jest実行
yarn build-test                                 # ビルドテスト実行
```

このCI/CDパイプラインにより、コード品質の維持、自動デプロイ、プレビュー環境での確認を効率的に実現しています。

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

## Claude Code カスタムスラッシュコマンド

このプロジェクトでは、Jest単体テストの作成と実行を効率化するカスタムスラッシュコマンドを提供しています。

### 利用可能なスラッシュコマンド

#### 1. `/add-ut` - ユニットテスト作成

**用途**: 指定したファイルの包括的なユニットテストを自動作成

**実行内容**:
- general-purposeエージェントを使用
- 指定ファイルのユニットテストを網羅的に作成
- 同一フォルダ内に`index.test.ts`として保存
- 自動的に品質チェック（Jest、ESLint、TypeScript）を実行
- Git add/commit まで自動実行

**使用方法**:
```bash
/add-ut [対象ファイルパス]

# 例
/add-ut src/features/Login/actions/calc/index.ts
```

**実行フロー**:
1. 対象ファイルの機能分析
2. 包括的なテストケース設計（正常系、異常系、エッジケース）
3. `index.test.ts` ファイル作成
4. Jest実行によるテスト検証
5. ESLint静的解析
6. TypeScript型チェック
7. Git add/commit（自動コミットメッセージ生成）

**生成されるテストの品質基準**:
- 正常系: 基本動作の網羅的検証
- 異常系: バリデーションエラー、不正入力の検証
- エッジケース: 境界値、特殊な数値・文字列の検証
- 日本語でのテスト記述とエラーメッセージ
- TypeScript型安全性の確保

#### 2. `/maint-ut` - ユニットテスト実行・修正

**用途**: 既存テストの実行、失敗分析、修正

**実行内容**:
- test-automation-specialistエージェントを使用
- Jestテストスイート全体またはファイル指定での実行
- テスト失敗時の自動分析と修正提案
- 既存テストのメンテナンス

**使用方法**:
```bash
/maint-ut [オプション: テストファイルパス]

# 全テスト実行
/maint-ut

# 特定ファイルのテスト実行
/maint-ut src/features/Login/actions/calc/index.test.ts
```

**実行フロー**:
1. Jestテストスイート実行
2. 失敗テストの分析
3. 原因特定と修正提案
4. 修正後の再実行・検証

### スラッシュコマンドの利点

1. **一貫性**: プロジェクト規約に準拠したテストを自動生成
2. **効率化**: 手動作業を削減し、開発速度を向上
3. **品質保証**: 自動的な品質チェックとGit操作
4. **学習効果**: 生成されたテストから実装パターンを学習可能

### 注意事項

- `/add-ut`: 新規テスト作成時はgit pushまで実行しない（手動確認を推奨）
- `/maint-ut`: 既存コード変更時の品質チェックに最適
- コミット前に生成されたテストコードを確認することを推奨

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
