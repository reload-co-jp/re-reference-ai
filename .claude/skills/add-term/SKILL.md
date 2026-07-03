---
name: add-term
description: Re Reference AI (RRA) に新しいTerm（用語ページ）を追加する。「用語を追加して」「Termを追加」「新しい用語ページを作って」等で起動。
---

# Termの追加

`data/terms.json` に新しいTermエントリを追加し、静的サイトに用語ページを増やす。

## 手順

1. **型定義を確認する**: `lib/terms.ts` の `Term` 型を読み、フィールド構成を把握する。`name` / `tagline` / `category` / `tags` / `slug` 以外は全て任意項目（`?`付き）。

2. **既存データを確認する**:
   - `data/terms.json` — 既存termのslug一覧・文体・粒度を確認する（新規termも同じ日本語の文体に合わせる）
   - `data/categories.json` — 既存カテゴリ一覧。新カテゴリが必要な場合はここに追加する

3. **ユーザーから情報を集める。最低限必要なのは以下のみ**:
   - `slug`（kebab-case、英数字とハイフンのみ、例: `vector-database`）
   - `name`（表示名。英語略称と日本語正式名のどちらを`name`にしaliasesにするかは、既存データのパターン — LLM/RAGは英語略称をname、日本語正式名・英語正式名をaliasesに入れている — に合わせる）
   - `tagline`（一文の要約）
   - `category`（`data/categories.json` の既存カテゴリから選ぶか、新規追加）
   - `tags`（配列、1〜3個程度）

4. **他の項目は分かる範囲だけ埋める。無理に捻出しない**:
   - `summary` / `background` / `history` / `architecture` / `workflow` は分からなければ書かない（フィールド自体を省略する）
   - `summary` は数百〜千文字程度を目安にする（短すぎる一文要約は`tagline`と重複、長すぎるとページが冗長になる）
   - `history` を書く場合は、分かる範囲で語（用語）の初出（最初に発表・命名された年・論文・組織など）を先頭の一文として明記する。根拠のない年号や出典を作文しない

   - `codeExamples` / `advantages` / `disadvantages` / `comparisons` / `relatedTerms` / `faq` / `references` も同様に、根拠のない内容を作文しない
   - `comparisons` と `relatedTerms` で参照する `slug` は必ず `data/terms.json` に実在するslugにする（存在しないslugを書くとページ内リンクが壊れる）
   - `references` の `type` は `lib/terms.ts` の `ReferenceType` union（Official Website / Documentation / Specification / GitHub / RFC / Research Paper / Blog / Conference）のいずれかにする

5. **`data/terms.json` の配列末尾に新規オブジェクトを追加する**。既存エントリと同じ2スペースインデントのJSON整形に揃える。

6. **相互リンクを整える（該当する場合）**: 新termが既存termと関連する場合、既存term側の `relatedTerms` や `comparisons` にも新termのslugを追記するか検討する（片方向リンクで終わらせない）。

7. **検証する**:
   ```
   pnpm lint
   pnpm lint:text
   pnpm build
   ```
   ビルドで `/terms/<slug>` が静的生成されることを確認する（`generateStaticParams` が `data/terms.json` を読むため、追加すれば自動的に対象になる）。
   `pnpm lint:text` は `data/terms.json` 内の日本語文章をtextlintでチェックする（AI特有の誇張表現・冗長表現・助詞の連続などを検出）。新規追加分に指摘があれば文章を修正する。

## 参考: 最小構成の例

```json
{
  "slug": "vector-database",
  "name": "ベクトルデータベース",
  "tagline": "埋め込みベクトルを高速に類似検索できるデータベース",
  "category": "インフラ",
  "tags": ["検索", "RAG"]
}
```

`summary`以下が無くても型エラーにはならず、該当セクションはページ上で自動的に非表示になる（`app/terms/[slug]/page.tsx` が各フィールドの有無でconditional renderしているため）。
