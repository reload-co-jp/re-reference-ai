import { FC } from "react"
import { Badge, Container, Section, SectionTitle } from "components/elements/layout"
import { TermCard } from "components/term/term-card"
import { categories, terms } from "lib/terms"

const Page: FC = () => {
  return (
    <Container>
      <Section
        style={{
          padding: "3rem 0",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: ".5rem" }}>Re Reference AI</h1>
        <p style={{ color: "#bbb", fontSize: "1.1rem", marginBottom: "2rem" }}>
          AI技術リファレンス
        </p>
        <form
          role="search"
          style={{ display: "flex", gap: ".5rem", justifyContent: "center" }}
        >
          <input
            aria-label="用語を検索"
            name="q"
            placeholder="用語を検索（例: LLM, RAG, Transformer）"
            style={{
              background: "#2a2a2a",
              border: "1px solid #3a3a3a",
              borderRadius: ".375rem",
              color: "#f0f0f0",
              flex: 1,
              fontSize: "1rem",
              maxWidth: "28rem",
              padding: ".625rem .75rem",
            }}
            type="search"
          />
          <button
            style={{
              background: "#4f9dff",
              border: "none",
              borderRadius: ".375rem",
              color: "#111",
              cursor: "pointer",
              fontWeight: 600,
              padding: ".625rem 1.25rem",
            }}
            type="submit"
          >
            検索
          </button>
        </form>
      </Section>

      <Section>
        <SectionTitle>カテゴリ</SectionTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
          {categories.map((category) => (
            <Badge key={category} style={{ fontSize: ".85rem", padding: ".375rem .75rem" }}>
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
            gap: "1rem",
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
