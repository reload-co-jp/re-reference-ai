import { Metadata } from "next"
import { FC } from "react"
import { Breadcrumb } from "components/elements/breadcrumb"
import { Container, Section, SectionTitle } from "components/elements/layout"
import { ComparisonCard } from "components/comparison/comparison-card"
import { comparisonSummaries } from "lib/comparisons"
import { toJsonLd } from "lib/json-ld"
import { SITE_NAME, SITE_OG_IMAGE_URL, SITE_URL } from "lib/site"

const TITLE = "技術比較(Comparison)"
const DESCRIPTION = "GPT vs Claude、MCP vs Function Calling等、類似するAI技術同士の違いを比較できる技術比較の一覧。"

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/compare/` },
  keywords: ["比較", "違い", "vs", "Difference", "AI", "LLM"],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: `${SITE_URL}/compare/`,
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
    { "@type": "ListItem", position: 2, name: TITLE, item: `${SITE_URL}/compare/` },
  ],
}

const CompareIndexPage: FC = () => (
  <Container>
    <script
      dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbList) }}
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
      <SectionTitle>比較一覧</SectionTitle>
      <div
        style={{
          display: "grid",
          gap: "1.25rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(15rem, 1fr))",
        }}
      >
        {comparisonSummaries.map((comparison) => (
          <ComparisonCard key={comparison.slug} comparison={comparison} />
        ))}
      </div>
    </Section>
  </Container>
)

export default CompareIndexPage
