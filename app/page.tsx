import { Metadata } from "next"
import { FC } from "react"
import { Container, Section } from "components/elements/layout"
import { TermExplorer } from "components/term/term-explorer"
import { SITE_URL } from "lib/site"
import { categories, terms } from "lib/terms"

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
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

      <TermExplorer categories={categories} terms={terms} />
    </Container>
  )
}

export default Page
