# PLAN.md

# Re Reference AI (RRA)

## アーキテクチャ

```
Crawler
→ Normalizer
→ PostgreSQL
→ FastAPI
→ Next.js
→ User
```

- **Crawler** — 外部データソースから情報を収集する
- **Normalizer** — 収集した生データを正規化・構造化する
- **PostgreSQL** — 正規化済みデータの永続化層
- **FastAPI** — バックエンドAPI層。PostgreSQLのデータをNext.jsへ提供する
- **Next.js** — フロントエンド。ユーザーへ画面を提供する（静的エクスポート構成、現状唯一実装済み）

## データソース

### Official（公式情報）

- ドキュメント
- 仕様書
- Changelog

### GitHub

収集項目:

- Stars
- Forks
- Releases
- Contributors
- License
- Last Commit

### Research（研究情報）

- arXiv
- OpenReview
- ACL Anthology

### Community（コミュニティ情報）

- ブログ
- リリースノート
- RSS

## データベース

主要エンティティ:

- Term（用語）
- Category（カテゴリ）
- Tag（タグ）
- Repository（GitHubリポジトリ）
- Organization（組織）
- Specification（仕様書）
- Paper（論文）
- Timeline（タイムライン）
- Comparison（比較）
- FAQ

## 検索

**Phase 1**

- PostgreSQL全文検索

**Phase 2**

- Meilisearchへ移行

## スケジューラ

**日次**

- GitHub同期
- RSS取得

**週次**

- ドキュメント同期
- 論文取得

## API（FastAPI）

- `GET /terms`
- `GET /terms/{slug}`
- `GET /compare`
- `GET /timeline`
- `GET /search`

## ロードマップ

### Phase 1

- MVP
- 検索
- カテゴリ
- Termページ

### Phase 2

- GitHub連携同期
- タイムライン
- 履歴機能

### Phase 3

- 比較ページ
- 論文対応
- 仕様書対応

### Phase 4

- AI支援執筆
- ナレッジグラフ
- 公開API

## 品質ポリシー

一次情報源の優先順位:

1. 公式仕様
2. 公式ドキュメント
3. 公式GitHubリポジトリ
4. 学術論文
5. 組織ブログ
6. カンファレンス発表

全記事は可能な限り一次情報源へのリンクを含めること。
