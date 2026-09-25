import { Metadata } from "next"
import { FC } from "react"
import Link from "next/link"
import { Breadcrumb } from "components/elements/breadcrumb"
import {
  Badge,
  Container,
  Section,
  SectionTitle,
} from "components/elements/layout"
import { buildItemListJsonLd, toJsonLd } from "lib/json-ld"
import { SITE_NAME, SITE_OG_IMAGE_URL, SITE_URL } from "lib/site"
import { getIndexableTags, getTagSlug, getTermsByTag } from "lib/terms"

const TITLE = "タグ一覧"
const DESCRIPTION =
  "RAG・ファインチューニング・ベクトル検索・マルチエージェントなど、AI・LLMの技術テーマ別に関連用語をたどれるタグの一覧。"

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/tags/` },
  keywords: ["タグ", "AI", "LLM", "用語一覧", "技術リファレンス"],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: `${SITE_URL}/tags/`,
    images: [SITE_OG_IMAGE_URL],
    siteName: SITE_NAME,
    locale: "ja_JP",
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
    images: [SITE_OG_IMAGE_URL],
  },
}

const tags = getIndexableTags()
  .map((tag) => ({ tag, count: getTermsByTag(tag).length }))
  .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "ja"))

const breadcrumbList = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
    {
      "@type": "ListItem",
      position: 2,
      name: TITLE,
      item: `${SITE_URL}/tags/`,
    },
  ],
}

const itemList = buildItemListJsonLd(
  TITLE,
  tags.map(({ tag }) => ({
    name: tag,
    url: `${SITE_URL}/tags/${getTagSlug(tag)}/`,
  }))
)

const TagIndexPage: FC = () => (
  <Container>
    <script
      dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbList) }}
      type="application/ld+json"
    />
    <script
      dangerouslySetInnerHTML={{ __html: toJsonLd(itemList) }}
      type="application/ld+json"
    />
    <Breadcrumb items={[{ href: "/", name: SITE_NAME }, { name: TITLE }]} />
    <Section style={{ padding: "1rem 0 3rem" }}>
      <h1 style={{ fontSize: "2.25rem", margin: 0 }}>{TITLE}</h1>
      <p
        style={{
          color: "var(--color-text-muted)",
          fontSize: "1.1rem",
          marginTop: ".75rem",
        }}
      >
        {DESCRIPTION}
      </p>
    </Section>

    <Section>
      <SectionTitle>すべてのタグ</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tags/${getTagSlug(tag)}/`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <Badge style={{ fontSize: ".85rem", padding: ".4rem .9rem" }}>
              {tag}（{count}）
            </Badge>
          </Link>
        ))}
      </div>
    </Section>
  </Container>
)

export default TagIndexPage
