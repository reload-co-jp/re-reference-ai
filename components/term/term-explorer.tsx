"use client"

import { FC, useState } from "react"
import { Badge, Section, SectionTitle } from "components/elements/layout"
import { TermCard } from "components/term/term-card"
import { TermSummaryCard } from "lib/terms"

const matchesQuery = (term: TermSummaryCard, query: string): boolean => {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  const haystack = [
    term.name,
    ...(term.aliases ?? []),
    term.tagline,
    term.category,
    ...term.tags,
  ]
    .join(" ")
    .toLowerCase()
  return haystack.includes(normalized)
}

export const TermExplorer: FC<{ categories: string[]; terms: TermSummaryCard[] }> = ({
  categories,
  terms,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  const filteredTerms = terms.filter(
    (term) =>
      (!selectedCategory || term.category === selectedCategory) &&
      matchesQuery(term, query),
  )

  return (
    <>
      <Section style={{ paddingTop: "3.5rem" }}>
        <form
          onSubmit={(e) => e.preventDefault()}
          role="search"
          style={{ display: "flex", gap: ".75rem", marginBottom: "2rem" }}
        >
          <input
            aria-label="用語を検索"
            name="q"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="用語を検索（例: LLM, RAG, Transformer）"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border-strong)",
              borderRadius: "2px",
              color: "var(--color-text)",
              flex: 1,
              fontSize: "1rem",
              padding: ".75rem 1rem",
            }}
            type="search"
            value={query}
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

        <SectionTitle>カテゴリ</SectionTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
          {categories.map((category) => {
            const isSelected = category === selectedCategory
            return (
              <button
                key={category}
                aria-pressed={isSelected}
                onClick={() =>
                  setSelectedCategory(isSelected ? null : category)
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
                type="button"
              >
                <Badge
                  style={{
                    background: isSelected
                      ? "var(--color-accent)"
                      : "var(--color-accent-dim)",
                    color: isSelected ? "#0a0f0c" : "var(--color-accent-bright)",
                    fontSize: ".85rem",
                    padding: ".4rem .9rem",
                  }}
                >
                  {category}
                </Badge>
              </button>
            )
          })}
        </div>
      </Section>

      <Section>
        <SectionTitle>
          用語
          {(selectedCategory || query) && (
            <span
              style={{
                color: "var(--color-text-muted)",
                fontSize: ".85rem",
                fontWeight: "normal",
              }}
            >
              {[selectedCategory, query && `"${query}"`]
                .filter(Boolean)
                .join(" / ")}
              （{filteredTerms.length}件）
            </span>
          )}
        </SectionTitle>
        {filteredTerms.length > 0 ? (
          <div
            style={{
              display: "grid",
              gap: "1.25rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(15rem, 1fr))",
            }}
          >
            {filteredTerms.map((term) => (
              <TermCard key={term.slug} term={term} />
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--color-text-muted)" }}>
            該当する用語が見つかりません。
          </p>
        )}
      </Section>
    </>
  )
}
