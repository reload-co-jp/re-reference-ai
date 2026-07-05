# Re Reference AI (RRA)

**URL**: https://rra.reload.co.jp

**タグライン**: The AI Technical Reference — AI・LLM・生成AI用語辞典

## 概要

Re Reference AI（RRA）は、AI・LLM・AIエージェント・機械学習・生成AI領域を対象とした技術リファレンスサイト。

単なる用語集（glossary）とは異なり、定義に加えて背景・歴史・アーキテクチャ・利点欠点・技術比較・FAQ・一次情報源リンクを1つの用語ページに集約する。

全データは `data/terms.json` に格納し、Next.jsの静的エクスポートで全ページをビルド時に生成する。データベース・バックエンドAPIは持たない。

## 技術スタック

- **Next.js 16**（App Router / `output: "export"` による静的エクスポート / `trailingSlash: true`）
- **React 19** / **TypeScript**
- **pnpm**（パッケージマネージャ）
- **ESLint / Prettier**（コード品質）
- **textlint**（`data/terms.json` 内の日本語文章の品質チェック）
- **Google Analytics**（gtag.js）

## ディレクトリ構成

```
app/
  page.tsx                        # トップページ（用語一覧 + 検索 + カテゴリフィルタ）
  terms/[slug]/page.tsx           # 用語詳細ページ
  terms/[slug]/opengraph-image.tsx # 用語ごとのOGP画像（動的生成）
  categories/[slug]/page.tsx      # カテゴリ別一覧ページ
  tags/[slug]/page.tsx            # タグ別一覧ページ
  sitemap.ts / robots.ts / manifest.ts / opengraph-image.tsx / icon.svg
components/
  elements/                       # レイアウト・パンくず等の共通部品
  term/                           # 用語カード・検索付き一覧（TermExplorer）
  analytics/                      # Google Analytics
data/
  terms.json                      # 全用語データ（唯一のデータソース）
  categories.json                 # カテゴリ一覧
lib/
  terms.ts                        # Term型定義・データアクセス関数・slug変換
  site.ts                         # サイト名・URL等の定数
  json-ld.ts / text.ts            # JSON-LD整形・テキストユーティリティ
scripts/
  lint-terms-text.mjs             # terms.json内の日本語をtextlintでチェック
.claude/skills/add-term/          # 用語追加用スキル（.agents/skills/ にも同内容）
```

## データモデル

用語は `lib/terms.ts` の `Term` 型に従う。必須フィールドは `slug` / `name` / `tagline` / `category` / `tags` のみで、それ以外は全て任意。任意フィールドが無い場合、該当セクションはページ上で自動的に非表示になる。

| フィールド | 内容 |
| --- | --- |
| `slug` | URLパス（kebab-case） |
| `name` / `aliases` | 表示名・別名（英語略称をnameに、正式名をaliasesに入れる慣例） |
| `tagline` | 一文の要約 |
| `category` / `tags` | 分類（`data/categories.json` の6カテゴリ）と横断ラベル |
| `plainSummary` | 「ひとことで言うと」の平易な説明 |
| `summary` / `background` / `history` / `architecture` / `workflow` | 本文セクション |
| `codeExamples` | 実装サンプルコード |
| `advantages` / `disadvantages` | 利点・欠点 |
| `comparisons` / `relatedTerms` | 類似技術との比較・関連用語（実在するslugのみ参照可） |
| `faq` | よくある質問 |
| `references` | 一次情報源リンク（型は下記リファレンス種別のいずれか） |

カテゴリは6種: **モデル / アーキテクチャ / 技術 / エージェント / インフラ / 評価**。

### リファレンス種別

Official Website / Documentation / Specification / GitHub / RFC / Research Paper / Blog / Conference

## 用語ページ構成

用語ページは以下のセクションからなる（データがあるものだけ表示）。

1. **Hero** — 用語名・別名・タグライン・カテゴリ・タグ
2. **ひとことで言うと** — 平易な一文要約（plainSummary）
3. **概要** / **背景** / **歴史** / **アーキテクチャ** / **ワークフロー**
4. **コード例**
5. **利点** / **欠点**
6. **比較** — 類似技術との対比（各項目に相違点の注記付き）
7. **関連用語** — 用語ページ間の相互リンク
8. **よくある質問**
9. **参考文献** — 一次情報源リンク一覧

## SEO

- **JSON-LD構造化データ**: `DefinedTerm` / `TechArticle` / `FAQPage` / `BreadcrumbList` / `WebSite`
- **サイトマップ・robots・Webマニフェスト**: `app/sitemap.ts` / `app/robots.ts` / `app/manifest.ts` で生成
- **OGP画像**: サイト全体・用語ごとの両方をビルド時に動的生成

## 開発

```sh
pnpm install
pnpm dev        # 開発サーバー
pnpm build      # 静的ビルド（全ページ生成）
pnpm lint       # ESLint
pnpm lint:text  # terms.json内の日本語文章チェック（textlint）
pnpm typecheck  # TypeScript型チェック
pnpm format     # Prettier
```

`pnpm lint:text` は `textlint-rule-preset-ja-technical-writing` と `@textlint-ja/textlint-rule-preset-ai-writing` を使い、助詞の連続・冗長表現・AI特有の誇張表現などを検出する。

## 用語の追加

`data/terms.json` の配列末尾にオブジェクトを追加するだけで、ビルド時に `/terms/<slug>/` が自動生成される。手順の詳細は `.claude/skills/add-term/SKILL.md`（Claude Code / Codex等のエージェントからは `add-term` スキルとして起動可能）を参照。

追加時の要点:

- 既存エントリと同じ日本語の文体・粒度に合わせる
- 分からないフィールドは省略する（根拠のない年号・出典・内容を作文しない）
- `comparisons` / `relatedTerms` は実在するslugのみ参照する
- 既存用語側にも逆方向のリンクを追記し、片方向リンクで終わらせない
- `pnpm lint` / `pnpm lint:text` / `pnpm build` を通す

## 将来構想

Crawler → Normalizer → PostgreSQL → FastAPI によるデータ収集パイプライン等の構想は [PLAN.md](./PLAN.md) を参照（未実装）。
