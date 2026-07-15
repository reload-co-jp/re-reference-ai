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
}

import categoriesData from "data/categories.json"
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
