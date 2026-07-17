---
name: add-comparison
description: Re Reference AI (RRA) に新しい比較記事（Comparison）を追加する。「比較記事を追加して」「XとYを比較する記事を作って」「比較を追加」等で起動。
---

# 比較記事の追加

`data/comparisons.json` に新しいComparisonエントリを追加し、静的サイトに `/compare/<slug>` ページを増やす。

## 手順

1. **型定義を確認する**: `lib/comparisons.ts` の `Comparison` 型を読み、フィールド構成を把握する。必須は `slug` / `left` / `right` / `summary` の4つのみ、他は任意項目（`?`付き）。ただし既存の記事は全フィールドを埋めているため、新規追加分もフィールドを揃える。

2. **比較対象を決める**:
   - ユーザーから直接 term 2つ（`slug`）の指定を受けるか、`node scripts/suggest-comparisons.mjs` を実行して候補から選ぶ
   - 両方の `slug` が `data/terms.json` に実在することを確認する
   - `data/comparisons.json` に同じペアが既に存在しないか確認する（`left`/`right` 逆順も含めてチェック）
   - `left` / `right` の順序は既存記事の慣例（知名度が高い方・先発の方を `left`）に合わせる

3. **既存データを確認する**:
   - 比較対象2つの term を `data/terms.json` から読み、`summary` / `tagline` / `advantages` / `disadvantages` / `comparisons`（対比ノート）等の既存情報を土台にする。term 側に既に対比ノートがあれば、その内容と矛盾しないようにする
   - `data/comparisons.json` の既存5件を読み、文体・粒度・セクション構成の実例として参照する

4. **全フィールドを埋める**（根拠のない内容を作文しない。分からない項目は空配列や簡潔な記述に留める）:
   - `slug`: `"<left>-vs-<right>"`
   - `summary`: 比較全体の要約（数百文字程度）
   - `quickSummary`: 箇条書きの短い結論（3〜5項目程度）
   - `table`: `{ item, left, right }[]` — 観点別の比較表（目的・アーキテクチャ・コスト等）
   - `architecture`: `{ left, right }` — それぞれのアーキテクチャ説明
   - `features`: `{ feature, left, right }[]` — `left`/`right` は文字列または真偽値
   - `advantages` / `disadvantages`: `{ left: string[], right: string[] }`
   - `bestUseCases`: `{ left: string, right: string }`（配列ではなく文字列）
   - `migration`: 乗り換え・併用の指針（文字列）
   - `faq`: `{ question, answer }[]`
   - `references`: `{ type, label, url }[]` — `type` は `lib/terms.ts` の `ReferenceType` union（Official Website / Documentation / Specification / GitHub / RFC / Research Paper / Blog / Conference）のいずれか。公式ドキュメント優先

5. **`data/comparisons.json` の配列末尾に新規オブジェクトを追加する**。既存エントリと同じ2スペースインデントのJSON整形に揃える。

6. **相互リンクを整える（該当する場合）**: 比較対象の term 側の `comparisons`（対比ノート、`{ slug, note }[]`）に相手の slug がまだ無ければ追記を検討する。term 側の `comparisons` フィールドは比較記事とは別物（関連用語との短い対比ノート）なので混同しない。

7. **検証する**:
   ```
   pnpm lint
   pnpm build
   ```
   - JSON妥当性（構文エラーがないか）
   - `left` / `right` が `data/terms.json` に実在するslugか
   - `slug` が `data/comparisons.json` 内で重複していないか
   - ビルドで `/compare/<slug>` が静的生成されることを確認する（`generateStaticParams` が `data/comparisons.json` を読むため、追加すれば自動的に対象になる）

## 参考: フィールド最小限の例（実運用では既存5件同様に全項目埋める）

```json
{
  "slug": "llama-vs-mistral",
  "left": "llama",
  "right": "mistral",
  "summary": "LlamaとMistralはいずれもオープンウェイトのLLMファミリーだが、..."
}
```
