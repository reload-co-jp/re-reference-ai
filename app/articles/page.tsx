import { Metadata } from "next"
import { FC } from "react"
import { Breadcrumb } from "components/elements/breadcrumb"
import { Container, Section, SectionTitle } from "components/elements/layout"
import { ArticleCard } from "components/article/article-card"
import { articleSummaries } from "lib/articles"
import { buildItemListJsonLd, toJsonLd } from "lib/json-ld"
import { SITE_NAME, SITE_OG_IMAGE_URL, SITE_URL } from "lib/site"

const TITLE = "特集記事(Articles)"
const DESCRIPTION = "オープンウェイトLLM一覧等、複数のAI・機械学習モデル/技術をまとめて紹介する特集記事の一覧。"

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/articles/` },
  keywords: ["特集", "まとめ", "一覧", "Article", "AI", "LLM"],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: `${SITE_URL}/articles/`,
    images: [SITE_OG_IMAGE_URL],
    siteName: SITE_NAME,
    locale: "ja_JP",
  },
  twitter: { title: TITLE, description: DESCRIPTION, images: [SITE_OG_IMAGE_URL] },
}

const breadcrumbList = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: TITLE, item: `${SITE_URL}/articles/` },
  ],
}

const itemList = buildItemListJsonLd(
  TITLE,
  articleSummaries.map((article) => ({
    name: article.title,
    url: `${SITE_URL}/articles/${article.slug}/`,
  })),
)

const ArticleIndexPage: FC = () => (
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
      <p style={{ color: "var(--color-text-muted)", fontSize: "1.1rem", marginTop: ".75rem" }}>
        {DESCRIPTION}
      </p>
    </Section>

    <Section>
      <SectionTitle>記事一覧</SectionTitle>
      <div
        style={{
          display: "grid",
          gap: "1.25rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(15rem, 1fr))",
        }}
      >
        {articleSummaries.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </Section>
  </Container>
)

export default ArticleIndexPage
