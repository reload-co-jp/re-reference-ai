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
  summary: string
  background: string
  history: string
  architecture: string
  workflow: string
  codeExamples: CodeExample[]
  advantages: string[]
  disadvantages: string[]
  comparisons: Comparison[]
  relatedTerms: string[]
  faq: FaqItem[]
  references: Reference[]
}

import categoriesData from "data/categories.json"
import termsData from "data/terms.json"

export const categories = categoriesData as string[]

export const terms = termsData as Term[]

export const getTermBySlug = (slug: string): Term | undefined =>
  terms.find((term) => term.slug === slug)

export const getTermsByCategory = (category: string): Term[] =>
  terms.filter((term) => term.category === category)

export const getRelatedTerms = (term: Term): Term[] =>
  term.relatedTerms
    .map((slug) => getTermBySlug(slug))
    .filter((t): t is Term => Boolean(t))
