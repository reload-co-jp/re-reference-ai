import { Metadata } from "next"
import { FC } from "react"
import { Container, Section } from "components/elements/layout"
import { TermExplorer } from "components/term/term-explorer"
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_OG_IMAGE_URL, SITE_TAGLINE_JA, SITE_URL } from "lib/site"
import { categories, termSummaries } from "lib/terms"

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

const Page: FC = () => {
  return (
    <Container>
      <Section
        style={{
          borderBottom: "1px solid var(--color-border)",
          padding: "4.5rem 0 3.5rem",
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
            margin: "0 auto 2.5rem",
            maxWidth: "32rem",
          }}
        >
          AI・LLM・機械学習領域の一次情報を集約した技術リファレンス
        </p>
      </Section>

      <TermExplorer categories={categories} terms={termSummaries} />
    </Container>
  )
}

export default Page
