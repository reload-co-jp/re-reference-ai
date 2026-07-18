import { FaqItem, getTermBySlug, Reference, Term } from "lib/terms"
import { TimelineEvent } from "lib/timelines"

export type ArticleComparisonRow = {
  item: string
  values: Record<string, string>
}

export type Article = {
  slug: string
  title: string
  description: string
  category: string
  intro: string
  modelSlugs: string[]
  comparisonRows: ArticleComparisonRow[]
  events: TimelineEvent[]
  relatedTerms?: string[]
  faq?: FaqItem[]
  references?: Reference[]
}

import articlesData from "data/articles.json"

export const articles = articlesData as Article[]

export type ArticleSummaryCard = Pick<
  Article,
  "slug" | "title" | "description" | "category" | "modelSlugs"
>

export const articleSummaries: ArticleSummaryCard[] = articles.map(
  ({ slug, title, description, category, modelSlugs }) => ({
    slug,
    title,
    description,
    category,
    modelSlugs,
  }),
)

export const getArticleBySlug = (slug: string): Article | undefined =>
  articles.find((article) => article.slug === slug)

export const getArticleModels = (article: Article): Term[] =>
  article.modelSlugs
    .map((slug) => getTermBySlug(slug))
    .filter((term): term is Term => Boolean(term))
