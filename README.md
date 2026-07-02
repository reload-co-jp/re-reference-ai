# Re Reference AI (RRA)

**URL**: https://rra.reload.co.jp

**タグライン**: The AI Technical Reference

## 概要

Re Reference AI（RRA）は、AI・LLM・AIエージェント・機械学習・生成AI領域を対象とした技術リファレンスサイト。

単なる用語集（glossary）とは異なり、以下の情報を1つの用語ページに集約する:

- 定義
- 公式仕様
- GitHubリポジトリ情報
- 公式ドキュメント
- 研究論文
- RFC
- SDK
- バージョン履歴
- 採用事例
- 技術比較

## ゴール

- AIエンジニアにとっての一次リファレンスとしての地位を確立する
- 一次情報源（公式仕様・公式ドキュメント等）への直接リンクを提供する
- 各技術の背景・歴史を説明する
- 実装例（コード）を提供する
- 関連技術同士を相互リンクする

## 対象ユーザー

- AIエンジニア
- MLエンジニア
- ソフトウェアエンジニア
- 研究者
- 学生
- プロダクトマネージャー

## コア機能

- **Termページ** — 用語ごとの詳細ページ
- **カテゴリ** — 用語の分類軸
- **検索** — 用語検索
- **タグ** — 横断的なラベリング
- **関連用語** — Termページ間のリンク
- **公式リファレンス** — 一次情報源へのリンク
- **GitHubリポジトリ** — 関連OSSの情報表示（Stars/Forks/Releases等）
- **タイムライン** — 技術の時系列変遷
- **比較ページ** — 技術同士の比較表

## Termページ構成

各Termページは以下13セクションで構成する。

1. **Hero** — 用語名・略称・タグライン・カテゴリ・タグの導入部
2. **Summary** — 一段落の要約定義
3. **Background** — 生まれた背景・課題意識
4. **History** — 年表形式の発展経緯
5. **Architecture** — 内部構造・技術的仕組み
6. **Workflow** — 利用フロー・処理パイプライン
7. **Code Examples** — 実装サンプルコード
8. **Advantages** — 利点
9. **Disadvantages** — 欠点・限界
10. **Comparisons** — 類似技術との比較
11. **Related Terms** — 関連用語へのリンク集
12. **FAQ** — よくある質問
13. **References** — 一次情報源リンク一覧

## リファレンス種別

- Official Website（公式サイト）
- Documentation（公式ドキュメント）
- Specification（仕様書）
- GitHub（リポジトリ）
- RFC
- Research Paper（研究論文）
- Blog（ブログ）
- Conference（カンファレンス発表）

## SEO

構造化データとして以下を実装する:

- `DefinedTerm`
- `TechArticle`
- `FAQPage`
- `BreadcrumbList`
- JSON-LD全般

## 将来機能

- AI生成ドラフト
- ナレッジグラフ
- MCPサーバー
- 公開API
- GraphQL
- 英語版
- モバイルアプリ

## 現状の実装状況

- **フロントエンド（Next.js, static export）**: トップページ・Termページ雛形を実装済み（モックデータ4件: LLM / Transformer / RAG / Fine-tuning）
- **Crawler / Normalizer / PostgreSQL / FastAPI**: 未実装（詳細は [PLAN.md](./PLAN.md) 参照）
