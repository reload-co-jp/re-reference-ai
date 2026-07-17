# 比較記事 拡充プラン（実装ハンドオフ用）

目的: 比較記事（`data/comparisons.json`）を現在の 5 件から継続的に量産できる体制を作る。
このドキュメントだけで実装着手できるよう、現状・スキーマ・タスク・受け入れ条件を記載する。

## 現状

- 用語データ: `data/terms.json` — 327 件。カテゴリ: 技術 165 / インフラ 37 / アーキテクチャ 36 / モデル 36 / エージェント 30 / 評価 23
- 比較記事: `data/comparisons.json` — 5 件
  - `gpt-vs-claude`, `mcp-vs-function-calling`, `retrieval-augmented-generation-vs-fine-tuning`, `langchain-vs-langgraph`, `crewai-vs-autogen`
- ページ: `app/compare/page.tsx`（一覧）、`app/compare/[slug]/page.tsx`（詳細）。静的生成（`out/` に export）
- Zenn 需要データ: `data/zenn-ai-keywords.json`（`{ articleCount, generatedAt, keywords: [{ keyword, count, samples[] }] }`）、`data/zenn-articles.json`
- 既存スキル: `.claude/skills/add-term/SKILL.md` — 用語追加の生成フローが定義済み。比較記事版を作る際のテンプレートにする
- 事前調査結果: 「相互に relatedTerms で参照し合い、同カテゴリで、まだ比較記事がないペア」は 371 組存在。ネタ不足ではなく、優先度付けと生成フローがボトルネック

## comparisons.json のスキーマ（1 エントリ）

`left` / `right` は `terms.json` の `slug` を指す。`lib/comparisons.ts` の `Comparison` 型が正。必須は `slug` / `left` / `right` / `summary` の4つのみ、他は任意（`?`付き）。ただし既存5件は全フィールド埋まっているため、新規追加分も揃えるのが望ましい。

```
slug:          string              例 "mcp-vs-function-calling"（"<left>-vs-<right>"）
left:          string              term slug
right:         string              term slug
summary:       string              比較全体の要約
quickSummary?: string[]            箇条書きの短い結論
table?:        { item, left, right }[]        観点別比較表
architecture?: { left: string, right: string }  各アーキテクチャ説明
features?:     { feature, left, right }[]     left/right は string または boolean
advantages?:   { left: string[], right: string[] }
disadvantages?:{ left: string[], right: string[] }
bestUseCases?: { left: string, right: string }   ← left/rightは文字列(配列ではない)
migration?:    string              乗り換え・併用の指針
faq?:          { question, answer }[]
references?:   { type, label, url }[]
```

注意: `terms.json` 側にも `comparisons` フィールドがあるが、これは「関連用語との対比ノート」（`{ slug, note }[]`）であり、比較記事とは別物。混同しないこと。

## タスク

### Phase 1: 候補ペア抽出スクリプト `scripts/suggest-comparisons.mjs`

既存スクリプト（`scripts/fetch-zenn-ai-keywords.mjs` 等）の書き方に合わせた ESM で作成。

1. **ペア抽出**: `terms.json` から相互 relatedTerms かつ同カテゴリのペアを列挙。`comparisons.json` に既存のペア（左右逆も含む）は除外
2. **包含関係フィルタ**: 「attention vs transformer」のような構成要素 vs 全体の関係は比較記事に不適。ヒューリスティック:
   - 共通タグ数でスコア加点（同じ土俵の兄弟概念ほどタグが重なる）
   - 一方の `summary` / `tagline` に他方の名前が「〜の一部」「〜で使われる」的文脈で出るペアは減点（実装は名前の出現有無だけでも可）
   - カテゴリ「モデル」「エージェント」のペアを優先加点（プロダクト同士の比較は需要が高い）
3. **需要スコア**: `zenn-ai-keywords.json` の keyword / count と用語名・aliases を突合し、両方の用語が Zenn で言及されているペアを加点
4. **出力**: スコア降順で `slug ペア / カテゴリ / スコア内訳` を標準出力（上位 30 件程度）。`--json` フラグで JSON 出力

受け入れ条件:
- `node scripts/suggest-comparisons.mjs` が動き、既存 5 記事のペアが出力に含まれない
- `llama vs qwen`, `bm25 vs semantic-search`, `fine-tuning vs lora` のような「兄弟概念」ペアが上位に来る
- `attention vs transformer` のような包含ペアが上位 10 件に入らない

**実装済み（`scripts/suggest-comparisons.mjs`）・検証結果:**
- `attention vs transformer` は 207/371 位 → 上位10件外の条件は満たす
- `bm25 vs semantic-search`（268位）・`fine-tuning vs lora`（339位）は上位に来ない。原因はタグ語彙の不一致（例: lora のタグ「ファインチューニング」が fine-tuning 自身のタグに含まれないため共有タグスコアが0になる）。ペナルティ調整で無理に押し上げると他の良ペアを壊すため未対応
- `llama vs qwen` はそもそも候補に入らない（qwen→llama の片方向リンクのみで、relatedTerms 相互条件を満たさない。terms.json 側のデータ欠落）
- 一方、実際の上位30件は `gemini vs grok` / `llama vs mistral` / `gemma vs phi` / `claude vs gemini` / `gpt vs grok` / `crewai vs langgraph` など質の高いペアを的確に抽出できている。当初の具体例3つは執筆時の仮説であり実データと完全一致しなかったが、スクリプト自体の有効性は確認できた
- 改善の余地（未着手）: タグ語彙不一致の補完（例: 他方の name/slug が自分の tags に含まれる場合の加点）、relatedTerms の片方向リンク補完

### Phase 2: 比較記事追加スキル `.claude/skills/add-comparison/SKILL.md`

`.claude/skills/add-term/SKILL.md` を読み、同じ構成・トーンで比較記事版を作成。

- 入力: ペア（term slug 2 つ）または「候補から選んで」
- 手順: ① 両 term のデータを読む → ② 上記スキーマ全フィールドを埋めて `comparisons.json` に追記 → ③ 検証
- 文体・品質基準は add-term スキルおよび既存 5 記事に準拠（日本語、references は公式ドキュメント優先）
- `slug` は `"<left>-vs-<right>"`。left/right の順序は既存記事の慣例（メジャー・先発が left）に従う

受け入れ条件:
- スキル手順に検証ステップが含まれる: JSON 妥当性、left/right が terms.json に存在、slug 重複なし、`pnpm build` 成功

### Phase 3: 内部リンク確認・強化 ✅完了

1. term 詳細ページ（`app/terms/[slug]/page.tsx`）→ 既に実装済み（`getComparisonsForTerm` + 「関連する比較」セクション）。対応不要
2. 比較記事詳細ページ（`app/compare/[slug]/page.tsx`）→ 未実装だったため追加。`getComparisonsForTerm(left)` / `getComparisonsForTerm(right)` の結果をマージ・重複除去し、自分自身を除外して「関連する比較」セクションをページ末尾に追加。現状の5記事は互いに left/right を共有していないため表示は空（条件分岐で非表示、正しい挙動）。今後 `claude vs gemini` のように既存記事と用語を共有するペアを追加すると自動的にリンクが機能する
3. `app/sitemap.ts` → 既に `comparisons` から動的生成済み。対応不要
   `app/llms.txt/route.ts` → 用語は個別列挙されているが比較記事は `/compare/` 一覧へのリンクのみだったため、`## 比較` セクションを追加し `comparisons` から個別列挙するよう変更

検証: `pnpm lint` / `pnpm build` 通過。`out/llms.txt` に `## 比較` セクションと5記事のリンクが出力されることを確認済み。

### Phase 4（任意・スコープ外可）: 初回バッチ生成

Phase 1 の上位候補から 5〜10 記事を add-comparison スキルで生成。1 記事ずつ生成 → 検証 → コミット。

## 検証コマンド

```bash
node scripts/suggest-comparisons.mjs        # Phase 1
jq 'length' data/comparisons.json           # 追加件数確認
pnpm build                                  # 静的生成が通ること
node scripts/lint-terms-text.mjs            # 既存 lint（terms 用。比較記事に流用できるか要確認）
```

## 制約

- パッケージマネージャは pnpm。新規依存は追加しない（Node 標準 + 既存依存で完結させる）
- `data/*.json` は整形済み（インデント 2）。追記時もフォーマット維持
- コミットは Phase ごとに分ける。コミットメッセージは既存履歴の英語スタイル（例: "Add timeline and compare"）に合わせる
