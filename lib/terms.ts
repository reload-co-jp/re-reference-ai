import { SEO } from "lib/seo"

export type ReferenceType =
  | "Official Website"
  | "Documentation"
  | "Specification"
  | "GitHub"
  | "RFC"
  | "Research Paper"
  | "Blog"
  | "Conference"

export type Reference = {
  type: ReferenceType
  label: string
  url: string
}

export type ZennArticle = {
  title: string
  url: string
}

export type FaqItem = {
  question: string
  answer: string
}

export type CodeExample = {
  title: string
  language: string
  code: string
}

export type Comparison = {
  slug: string
  note: string
}

export type Term = {
  slug: string
  name: string
  aliases?: string[]
  tagline: string
  category: string
  tags: string[]
  plainSummary?: string
  summary?: string
  background?: string
  history?: string
  architecture?: string
  workflow?: string
  codeExamples?: CodeExample[]
  advantages?: string[]
  disadvantages?: string[]
  comparisons?: Comparison[]
  relatedTerms?: string[]
  faq?: FaqItem[]
  references?: Reference[]
  seo?: SEO
  updatedAt?: string
}

import categoriesData from "data/categories.json"
import categoryDescriptionsData from "data/category-descriptions.json"
import tagDescriptionsData from "data/tag-descriptions.json"
import termsData from "data/terms.json"
import zennArticlesData from "data/zenn-articles.json"

export const categories = categoriesData as string[]

export const terms = termsData as Term[]

export type TermSummaryCard = Pick<
  Term,
  "slug" | "name" | "aliases" | "tagline" | "category" | "tags"
>

export const termSummaries: TermSummaryCard[] = terms.map(
  ({ slug, name, aliases, tagline, category, tags }) => ({
    slug,
    name,
    aliases,
    tagline,
    category,
    tags,
  }),
)

const zennArticlesBySlug = zennArticlesData as Record<string, ZennArticle[]>

export const getTermBySlug = (slug: string): Term | undefined =>
  terms.find((term) => term.slug === slug)

export const getTermsByCategory = (category: string): Term[] =>
  terms.filter((term) => term.category === category)

const CATEGORY_SLUGS: Record<string, string> = {
  モデル: "models",
  アーキテクチャ: "architectures",
  技術: "techniques",
  エージェント: "agents",
  インフラ: "infrastructure",
  評価: "evaluation",
}

export const getCategorySlug = (category: string): string =>
  CATEGORY_SLUGS[category] ?? category

export const getCategoryBySlug = (slug: string): string | undefined =>
  categories.find((category) => getCategorySlug(category) === slug)

export const getRelatedTerms = (term: Term): Term[] =>
  (term.relatedTerms ?? [])
    .map((slug) => getTermBySlug(slug))
    .filter((t): t is Term => Boolean(t))

const RELATED_TERM_LIMIT = 12
const RELATED_TERM_MIN_SCORE = 3

const getTermText = (term: Term): string =>
  [
    term.plainSummary,
    term.summary,
    term.background,
    term.history,
    term.architecture,
    term.workflow,
    ...(term.advantages ?? []),
    ...(term.disadvantages ?? []),
  ]
    .filter(Boolean)
    .join("\n")

// 関連度: 同一タグ(1件ごと+3) > 明示的な関連用語(+3) > 本文中での言及(+2) > 同一カテゴリ(+1)
// 同一カテゴリのみの用語は関連が薄いため除外する
export const getRankedRelatedTerms = (term: Term, limit = RELATED_TERM_LIMIT): Term[] => {
  const explicit = new Set(term.relatedTerms ?? [])
  const text = getTermText(term)
  return terms
    .filter((candidate) => candidate.slug !== term.slug)
    .map((candidate, index) => {
      const sharedTags = candidate.tags.filter((tag) => term.tags.includes(tag)).length
      const mentioned = [candidate.name, ...(candidate.aliases ?? [])].some(
        (name) => name.length >= 3 && text.includes(name),
      )
      const score =
        sharedTags * 3 +
        (explicit.has(candidate.slug) ? 3 : 0) +
        (mentioned ? 2 : 0) +
        (candidate.category === term.category ? 1 : 0)
      return { candidate, index, score }
    })
    .filter(({ score }) => score >= RELATED_TERM_MIN_SCORE)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ candidate }) => candidate)
}

export const getZennArticles = (term: Term): ZennArticle[] =>
  zennArticlesBySlug[term.slug] ?? []

const TAG_SLUGS: Record<string, string> = {
  アライメント: "alignment",
  エージェント: "agents",
  エージェント基盤: "agent-infrastructure",
  エッジAI: "edge-ai",
  オープンウェイト: "open-weights",
  クローズドウェイト: "closed-weights",
  コーディングエージェント: "coding-agents",
  コード生成: "code-generation",
  コンテンツ最適化: "content-optimization",
  サービング: "serving",
  サンプリング: "sampling",
  スパースモデル: "sparse-models",
  スループット: "throughput",
  ツール連携: "tool-integration",
  データ: "data",
  デコーディング: "decoding",
  トークナイゼーション: "tokenization",
  トークン: "token",
  ニューラルネットワーク: "neural-network",
  ノーコード: "no-code",
  ハードウェア: "hardware",
  ビジュアルプログラミング: "visual-programming",
  ファイル形式: "file-format",
  ファインチューニング: "fine-tuning",
  プライバシー: "privacy",
  フレームワーク: "framework",
  プロトコル: "protocol",
  プロンプトエンジニアリング: "prompt-engineering",
  ベクトル検索: "vector-search",
  ベンチマーク: "benchmark",
  マーケティング: "marketing",
  マネージドサービス: "managed-service",
  マルチエージェント: "multi-agent",
  マルチモーダル: "multimodal",
  モデル圧縮: "model-compression",
  ユーザーインターフェース: "user-interface",
  ローカルLLM: "local-llm",
  安全性: "safety",
  画像認識: "image-recognition",
  学習: "training",
  機械学習: "machine-learning",
  機械翻訳: "machine-translation",
  記憶: "memory",
  協調: "collaboration",
  強化学習: "reinforcement-learning",
  系列モデリング: "sequence-modeling",
  計画: "planning",
  軽量化: "lightweighting",
  検索: "search",
  言語処理: "language-processing",
  再現性: "reproducibility",
  事前学習: "pretraining",
  自己改善: "self-improvement",
  自動化: "automation",
  自律システム: "autonomous-systems",
  実行: "execution",
  情報検索: "information-retrieval",
  信頼性: "reliability",
  深層学習: "deep-learning",
  人間評価: "human-evaluation",
  人工知能: "artificial-intelligence",
  推論: "inference",
  推論最適化: "inference-optimization",
  相互運用性: "interoperability",
  多言語: "multilingual",
  探索アルゴリズム: "search-algorithm",
  知識: "knowledge",
  // 生成AI は既存URL /tags/ai/ を維持。対話AI・AI教育は ASCII 化で "ai" に衝突するため個別に割り当てる
  生成AI: "ai",
  対話AI: "conversational-ai",
  AI教育: "ai-education",
  転移学習: "transfer-learning",
  入力設計: "input-design",
  評価: "evaluation",
  評価指標: "evaluation-metrics",
  分類: "classification",
  並列計算: "parallel-computing",
  埋め込み: "embedding",
  要約: "summarization",
  量子化: "quantization",
}

const slugifyAscii = (tag: string): string =>
  tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const hashSlug = (tag: string): string => {
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) >>> 0
  }
  return `tag-${hash.toString(36)}`
}

export const getTagSlug = (tag: string): string =>
  TAG_SLUGS[tag] ?? (slugifyAscii(tag) || hashSlug(tag))

export const getAllTags = (): string[] => {
  const set = new Set<string>()
  terms.forEach((term) => term.tags.forEach((tag) => set.add(tag)))
  return Array.from(set)
}

export const getTagBySlug = (slug: string): string | undefined =>
  getAllTags().find((tag) => getTagSlug(tag) === slug)

export const getTermsByTag = (tag: string): Term[] =>
  terms.filter((term) => term.tags.includes(tag))

const tagDescriptions = tagDescriptionsData as Record<string, string>

export const getTagDescription = (tag: string): string | undefined =>
  tagDescriptions[tag]

const categoryDescriptions = categoryDescriptionsData as Record<string, string>

export const getCategoryDescription = (category: string): string | undefined =>
  categoryDescriptions[category]

// 用語数が少ないタグページは内容が薄いため noindex にし、sitemap・タグ一覧から外す
export const MIN_TERMS_FOR_TAG_INDEX = 3

export const isTagIndexable = (tag: string): boolean =>
  getTermsByTag(tag).length >= MIN_TERMS_FOR_TAG_INDEX

export const getIndexableTags = (): string[] => getAllTags().filter(isTagIndexable)

// タグ名と一致する用語(例: タグ「RAG」→ 用語RAG)があれば、そのタグの中心用語として扱う
export const getTermForTag = (tag: string): Term | undefined =>
  terms.find((term) => term.name === tag || term.aliases?.includes(tag))

export const getCoOccurringTags = (tag: string, limit = 12): string[] => {
  const counts = new Map<string, number>()
  getTermsByTag(tag).forEach((term) =>
    term.tags.forEach((other) => {
      if (other !== tag) counts.set(other, (counts.get(other) ?? 0) + 1)
    }),
  )
  return Array.from(counts.entries())
    .filter(([other]) => isTagIndexable(other))
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([other]) => other)
}
