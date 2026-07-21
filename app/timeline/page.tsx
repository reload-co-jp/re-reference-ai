import { Metadata } from "next"
import { FC } from "react"
import { Breadcrumb } from "components/elements/breadcrumb"
import { Container, Section, SectionTitle } from "components/elements/layout"
import { TimelineCard } from "components/timeline/timeline-card"
import { buildItemListJsonLd, toJsonLd } from "lib/json-ld"
import { SITE_NAME, SITE_OG_IMAGE_URL, SITE_URL } from "lib/site"
import { timelineSummaries } from "lib/timelines"

const TITLE = "技術年表(Timeline)"
const DESCRIPTION = "LLM・GPT・Transformer・MCP・Claude等、AI技術の歴史を時系列で理解できる技術年表の一覧。"

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/timeline/` },
  keywords: ["年表", "歴史", "Timeline", "Evolution", "Release History", "AI", "LLM"],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: `${SITE_URL}/timeline/`,
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
    { "@type": "ListItem", position: 2, name: TITLE, item: `${SITE_URL}/timeline/` },
  ],
}

const itemList = buildItemListJsonLd(
  TITLE,
  timelineSummaries.map((timeline) => ({
    name: timeline.title,
    url: `${SITE_URL}/timeline/${timeline.slug}/`,
  })),
)

const TimelineIndexPage: FC = () => (
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
      <SectionTitle>年表一覧</SectionTitle>
      <div
        style={{
          display: "grid",
          gap: "1.25rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(15rem, 1fr))",
        }}
      >
        {timelineSummaries.map((timeline) => (
          <TimelineCard key={timeline.slug} timeline={timeline} />
        ))}
      </div>
    </Section>
  </Container>
)

export default TimelineIndexPage
