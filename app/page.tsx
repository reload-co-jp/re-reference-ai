import { FC } from "react"
import { Badge, Container, Section, SectionTitle } from "components/elements/layout"
import { TermCard } from "components/term/term-card"
import { categories, terms } from "lib/terms"

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
        <form
          role="search"
          style={{ display: "flex", gap: ".75rem", justifyContent: "center" }}
        >
          <input
            aria-label="用語を検索"
            name="q"
            placeholder="用語を検索（例: LLM, RAG, Transformer）"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border-strong)",
              borderRadius: "2px",
              color: "var(--color-text)",
              flex: 1,
              fontSize: "1rem",
              maxWidth: "28rem",
              padding: ".75rem 1rem",
            }}
            type="search"
          />
          <button
            className="search-button"
            style={{
              background: "var(--color-accent)",
              border: "none",
              borderRadius: "2px",
              color: "#0a0f0c",
              cursor: "pointer",
              fontWeight: 600,
              letterSpacing: "0.03em",
              padding: ".75rem 1.5rem",
            }}
            type="submit"
          >
            検索
          </button>
        </form>
      </Section>

      <Section style={{ paddingTop: "3.5rem" }}>
        <SectionTitle>カテゴリ</SectionTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
          {categories.map((category) => (
            <Badge key={category} style={{ fontSize: ".85rem", padding: ".4rem .9rem" }}>
              {category}
            </Badge>
          ))}
        </div>
      </Section>

      <Section>
        <SectionTitle>用語</SectionTitle>
        <div
          style={{
            display: "grid",
            gap: "1.25rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(15rem, 1fr))",
          }}
        >
          {terms.map((term) => (
            <TermCard key={term.slug} term={term} />
          ))}
        </div>
      </Section>
    </Container>
  )
}

export default Page
