import { FaqItem, getTermBySlug, Reference } from "lib/terms"

export type ComparisonTableRow = {
  item: string
  left: string
  right: string
}

export type ComparisonFeature = {
  feature: string
  left: boolean | string
  right: boolean | string
}

export type Comparison = {
  slug: string
  left: string
  right: string
  summary: string
  quickSummary?: string[]
  table?: ComparisonTableRow[]
  architecture?: { left: string; right: string }
  features?: ComparisonFeature[]
  advantages?: { left: string[]; right: string[] }
  disadvantages?: { left: string[]; right: string[] }
  bestUseCases?: { left: string; right: string }
  migration?: string
  faq?: FaqItem[]
  references?: Reference[]
}

import comparisonsData from "data/comparisons.json"

export const comparisons = comparisonsData as Comparison[]

export type ComparisonSummaryCard = Pick<Comparison, "slug" | "left" | "right" | "summary">

export const comparisonSummaries: ComparisonSummaryCard[] = comparisons.map(
  ({ slug, left, right, summary }) => ({ slug, left, right, summary }),
)

export const buildComparisonSlug = (left: string, right: string): string => `${left}-vs-${right}`

export const getComparisonBySlug = (slug: string): Comparison | undefined =>
  comparisons.find((comparison) => comparison.slug === slug)

export const getComparisonsForTerm = (termSlug: string): Comparison[] =>
  comparisons.filter((comparison) => comparison.left === termSlug || comparison.right === termSlug)

export const getComparisonTermNames = (
  comparison: Comparison,
): { left: string; right: string } => ({
  left: getTermBySlug(comparison.left)?.name ?? comparison.left,
  right: getTermBySlug(comparison.right)?.name ?? comparison.right,
})
