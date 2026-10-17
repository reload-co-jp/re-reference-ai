import { Metadata } from "next"
import { FC } from "react"
import Link from "next/link"
import { Card, Container, Section, SectionTitle } from "components/elements/layout"
import { TermExplorer } from "components/term/term-explorer"
import { getTermGitDates } from "lib/git-dates"
import { buildItemListJsonLd, toJsonLd } from "lib/json-ld"
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_OG_IMAGE_URL, SITE_TAGLINE_JA, SITE_URL } from "lib/site"
import {
  categories,
  getCategoryDescription,
  getCategorySlug,
  getTermBySlug,
  getTermsByCategory,
  Term,
  terms,
  termSummaries,
} from "lib/terms"
import { truncate } from "lib/text"

export const metadata: Metadata = {
  title: `${SITE_NAME} (RRA) — ${SITE_TAGLINE_JA}・技術リファレンス`,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: `${SITE_NAME} — ${SITE_TAGLINE_JA}`,
    description: SITE_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    images: [SITE_OG_IMAGE_URL],
  },
  twitter: {
    title: `${SITE_NAME} — ${SITE_TAGLINE_JA}`,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE_URL],
  },
}

const categoryItemList = buildItemListJsonLd(
  "カテゴリ一覧",
  categories.map((category) => ({
    name: category,
    url: `${SITE_URL}/categories/${getCategorySlug(category)}/`,
  })),
)

// 編集部が選んだ導線。存在しないslugは表示しない
const BEGINNER_SLUGS = [
  "generative-ai",
  "large-language-model",
  "machine-learning",
  "deep-learning",
  "transformer",
  "token",
  "context-window",
  "prompt-engineering",
  "hallucination",
  "embedding",
]

const PRACTITIONER_SLUGS = [
  "retrieval-augmented-generation",
  "vector-database",
  "ai-agent",
  "mcp",
  "function-calling",
  "structured-output",
  "fine-tuning",
  "lora",
  "quantization",
  "kv-cache",
  "vllm",
  "llm-as-a-judge",
]

const LIST_LIMIT = 8

const pickTerms = (slugs: string[]): Term[] =>
  slugs.map(getTermBySlug).filter((term): term is Term => Boolean(term))

// 日付はgit履歴(data/terms.json)由来。履歴が取れない環境では空になり、セクションごと非表示になる
const datedTerms = terms
  .map((term, index) => ({ term, index, ...getTermGitDates(term.slug) }))
  .filter((entry) => entry.datePublished && entry.dateModified)

const newTerms = [...datedTerms]
  .sort((a, b) => b.datePublished!.localeCompare(a.datePublished!) || b.index - a.index)
  .slice(0, LIST_LIMIT)

const newSlugs = new Set(newTerms.map(({ term }) => term.slug))

const updatedTerms = datedTerms
  .filter((entry) => entry.dateModified! > entry.datePublished! && !newSlugs.has(entry.term.slug))
  .sort((a, b) => b.dateModified!.localeCompare(a.dateModified!) || b.index - a.index)
  .slice(0, LIST_LIMIT)

const gridStyle = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(18rem, 100%), 1fr))",
} as const

const TermLinkList: FC<{ items: { term: Term; date?: string }[] }> = ({ items }) => (
  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
    {items.map(({ term, date }) => (
      <li
        key={term.slug}
        style={{ borderBottom: "1px solid var(--color-border)", padding: ".625rem 0" }}
      >
        <Link href={`/terms/${term.slug}/`} style={{ color: "var(--color-accent-bright)", fontWeight: 600 }}>
          {term.name}
        </Link>
        {date && (
          <time
            dateTime={date}
            style={{ color: "var(--color-text-muted)", fontSize: ".75rem", marginLeft: ".5rem" }}
          >
            {date}
          </time>
        )}
        <p style={{ color: "var(--color-text-muted)", fontSize: ".85rem", margin: ".25rem 0 0" }}>
          {term.tagline}
        </p>
      </li>
    ))}
  </ul>
)

const Page: FC = () => {
  return (
    <Container>
      <script
        dangerouslySetInnerHTML={{ __html: toJsonLd(categoryItemList) }}
        type="application/ld+json"
      />
      <Section
        style={{
          padding: "3.5rem 0 1rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "var(--color-accent-bright)",
            fontSize: ".75rem",
            letterSpacing: "0.25em",
            marginBottom: "1rem",
            textTransform: "uppercase",
          }}
        >
          The AI Technical Reference
        </p>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Re Reference AI</h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "1.05rem",
            margin: "0 auto",
            maxWidth: "36rem",
          }}
        >
          {SITE_DESCRIPTION}。{terms.length}語の定義・仕組み・比較・一次情報源を、AIを学び始めた人から実装に携わるエンジニアまで向けにまとめています。
        </p>
      </Section>

      <TermExplorer categories={categories} terms={termSummaries}>
        <Section>
          <div style={gridStyle}>
            <Card>
              <SectionTitle style={{ fontSize: "1.1rem" }}>はじめて学ぶ人へ — 基礎用語</SectionTitle>
              <TermLinkList items={pickTerms(BEGINNER_SLUGS).map((term) => ({ term }))} />
            </Card>
            <Card>
              <SectionTitle style={{ fontSize: "1.1rem" }}>実装する人へ — 開発・運用の用語</SectionTitle>
              <TermLinkList items={pickTerms(PRACTITIONER_SLUGS).map((term) => ({ term }))} />
              <p style={{ fontSize: ".85rem", marginTop: "1rem" }}>
                <Link href="/compare/" style={{ color: "var(--color-accent-bright)" }}>
                  技術比較
                </Link>
                で選定時の違いも確認できます。
              </p>
            </Card>
          </div>
        </Section>

        {(newTerms.length > 0 || updatedTerms.length > 0) && (
          <Section>
            <div style={gridStyle}>
              {newTerms.length > 0 && (
                <div>
                  <SectionTitle>新着用語</SectionTitle>
                  <TermLinkList items={newTerms.map(({ term, datePublished }) => ({ term, date: datePublished }))} />
                </div>
              )}
              {updatedTerms.length > 0 && (
                <div>
                  <SectionTitle>最近更新された用語</SectionTitle>
                  <TermLinkList items={updatedTerms.map(({ term, dateModified }) => ({ term, date: dateModified }))} />
                </div>
              )}
            </div>
          </Section>
        )}

        <Section>
          <SectionTitle>カテゴリから探す</SectionTitle>
          <div style={gridStyle}>
            {categories.map((category) => {
              const description = getCategoryDescription(category)
              return (
                <Link
                  key={category}
                  className="term-card-link"
                  href={`/categories/${getCategorySlug(category)}/`}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <Card className="term-card" style={{ height: "100%" }}>
                    <h3 style={{ fontSize: "1.05rem", margin: 0 }}>
                      {category}
                      <span style={{ color: "var(--color-text-muted)", fontSize: ".8rem", fontWeight: "normal" }}>
                        {" "}
                        {getTermsByCategory(category).length}語
                      </span>
                    </h3>
                    {description && (
                      <p style={{ color: "var(--color-text-muted)", fontSize: ".85rem", margin: ".5rem 0 0" }}>
                        {truncate(description, 60)}
                      </p>
                    )}
                  </Card>
                </Link>
              )
            })}
          </div>
        </Section>
      </TermExplorer>
    </Container>
  )
}

export default Page
