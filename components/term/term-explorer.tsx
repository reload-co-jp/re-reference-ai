"use client"

import { FC, Fragment, ReactNode, useEffect, useId, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { InArticleAd } from "components/analytics/display-ad"
import { Badge, Section, SectionTitle } from "components/elements/layout"
import { TermCard } from "components/term/term-card"
import { TermSummaryCard } from "lib/terms"

const AD_INTERVAL = 6
const PAGE_SIZE = 48
const SUGGESTION_LIMIT = 8

// 全角/半角・大文字小文字の表記揺れを吸収し、空白/ハイフン/中黒は単語区切りとして空白1つに揃える
const normalize = (text: string): string =>
  text.normalize("NFKC").toLowerCase().replace(/[\s\-_・/]+/g, " ").trim()

// 0: 不一致 / 値が大きいほど上位。用語名・別名の完全一致 > 前方一致 > 部分一致 > 要約・タグ
const scoreTerm = (term: TermSummaryCard, query: string): number => {
  const names = [term.name, ...(term.aliases ?? [])].map(normalize)
  if (names.some((name) => name === query)) return 4
  if (names.some((name) => name.startsWith(query))) return 3
  if (names.some((name) => name.includes(query))) return 2
  return normalize([term.tagline, term.category, ...term.tags].join(" ")).includes(query) ? 1 : 0
}

const readUrlState = () => {
  const params = new URLSearchParams(window.location.search)
  return { category: params.get("category"), query: params.get("q") ?? "" }
}

export const TermExplorer: FC<{
  categories: string[]
  terms: TermSummaryCard[]
  children?: ReactNode
}> = ({ categories, terms, children }) => {
  const router = useRouter()
  const listboxId = useId()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  // 静的書き出しのため検索条件はマウント後にURLから復元する(/?q=... は WebSite の SearchAction と対応)
  useEffect(() => {
    const state = readUrlState()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(state.query)
    setSelectedCategory(state.category && categories.includes(state.category) ? state.category : null)
  }, [categories])

  useEffect(() => {
    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    if (selectedCategory) params.set("category", selectedCategory)
    const search = params.toString()
    window.history.replaceState(null, "", search ? `?${search}` : window.location.pathname)
  }, [query, selectedCategory])

  const normalizedQuery = normalize(query)
  const filteredTerms = terms
    .map((term, index) => ({
      term,
      index,
      score: normalizedQuery ? scoreTerm(term, normalizedQuery) : 1,
    }))
    .filter(
      ({ term, score }) =>
        score > 0 && (!selectedCategory || term.category === selectedCategory),
    )
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ term }) => term)
  const suggestions = normalizedQuery ? filteredTerms.slice(0, SUGGESTION_LIMIT) : []
  const showSuggestions = isSuggestionOpen && suggestions.length > 0
  const isFiltering = Boolean(selectedCategory || normalizedQuery)

  const updateQuery = (value: string) => {
    setQuery(value)
    setVisibleCount(PAGE_SIZE)
    setActiveIndex(-1)
    setIsSuggestionOpen(true)
  }

  const goToTerm = (term: TermSummaryCard) => {
    setIsSuggestionOpen(false)
    router.push(`/terms/${term.slug}/`)
  }

  return (
    <>
      <Section style={{ paddingTop: "2rem" }}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const active = suggestions[activeIndex]
            if (active) goToTerm(active)
            else setIsSuggestionOpen(false)
          }}
          role="search"
          style={{ display: "flex", gap: ".75rem", marginBottom: "2rem", position: "relative" }}
        >
          <input
            aria-activedescendant={
              showSuggestions && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
            }
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-expanded={showSuggestions}
            aria-label="用語を検索"
            autoComplete="off"
            name="q"
            onBlur={() => setIsSuggestionOpen(false)}
            onChange={(e) => updateQuery(e.target.value)}
            onFocus={() => setIsSuggestionOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" && suggestions.length > 0) {
                e.preventDefault()
                setIsSuggestionOpen(true)
                setActiveIndex((index) => (index + 1) % suggestions.length)
              } else if (e.key === "ArrowUp" && suggestions.length > 0) {
                e.preventDefault()
                setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1))
              } else if (e.key === "Escape") {
                setIsSuggestionOpen(false)
                setActiveIndex(-1)
              }
            }}
            placeholder="用語・略語・英語名で検索（例: LLM, RAG, 埋め込み）"
            role="combobox"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border-strong)",
              borderRadius: "2px",
              color: "var(--color-text)",
              flex: 1,
              fontSize: "1.05rem",
              minWidth: 0,
              padding: ".875rem 1rem",
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
          {showSuggestions && (
            <ul
              aria-label="検索候補"
              id={listboxId}
              role="listbox"
              style={{
                background: "var(--color-bg-elevated)",
                border: "1px solid var(--color-border-strong)",
                left: 0,
                listStyle: "none",
                margin: 0,
                padding: ".25rem 0",
                position: "absolute",
                right: 0,
                top: "calc(100% + .25rem)",
                zIndex: 10,
              }}
            >
              {suggestions.map((term, index) => (
                <li
                  key={term.slug}
                  aria-selected={index === activeIndex}
                  className="term-suggestion"
                  id={`${listboxId}-${index}`}
                  onMouseDown={(e) => {
                    // blur より先に遷移させる
                    e.preventDefault()
                    goToTerm(term)
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  role="option"
                  style={{ cursor: "pointer", padding: ".5rem 1rem" }}
                >
                  <span style={{ fontWeight: 600 }}>{term.name}</span>
                  {term.aliases && term.aliases.length > 0 && (
                    <span style={{ color: "var(--color-text-muted)", fontSize: ".8rem" }}>
                      {" "}
                      {term.aliases.slice(0, 2).join(" / ")}
                    </span>
                  )}
                  <span
                    style={{
                      color: "var(--color-text-muted)",
                      display: "block",
                      fontSize: ".8rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {term.category} — {term.tagline}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </form>

        <SectionTitle>カテゴリで絞り込む</SectionTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
          {categories.map((category) => {
            const isSelected = category === selectedCategory
            return (
              <button
                key={category}
                aria-pressed={isSelected}
                onClick={() => {
                  setSelectedCategory(isSelected ? null : category)
                  setVisibleCount(PAGE_SIZE)
                }}
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
                    background: isSelected ? "var(--color-accent)" : "var(--color-accent-dim)",
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

      {!isFiltering && children}

      <Section>
        <SectionTitle id="term-list">
          {isFiltering ? "検索結果" : "すべての用語"}
          <span
            aria-live="polite"
            style={{
              color: "var(--color-text-muted)",
              fontSize: ".85rem",
              fontWeight: "normal",
            }}
          >
            {isFiltering &&
              [selectedCategory, normalizedQuery && `"${query.trim()}"`].filter(Boolean).join(" / ")}
            （{filteredTerms.length}件）
          </span>
        </SectionTitle>
        {filteredTerms.length > 0 ? (
          <>
            <div
              style={{
                display: "grid",
                gap: "1.25rem",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(20rem, 100%), 1fr))",
              }}
            >
              {filteredTerms.slice(0, visibleCount).map((term, i) => (
                <Fragment key={term.slug}>
                  <TermCard term={term} />
                  {(i + 1) % AD_INTERVAL === 0 && <InArticleAd style={{ gridColumn: "1 / -1" }} />}
                </Fragment>
              ))}
            </div>
            {filteredTerms.length > visibleCount && (
              <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <button
                  className="search-button"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  style={{
                    background: "var(--color-accent)",
                    border: "none",
                    borderRadius: "2px",
                    color: "#0a0f0c",
                    cursor: "pointer",
                    fontWeight: 600,
                    padding: ".75rem 1.5rem",
                  }}
                  type="button"
                >
                  さらに表示（残り{filteredTerms.length - visibleCount}件）
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ color: "var(--color-text-muted)" }}>
            <p>該当する用語が見つかりません。</p>
            <ul style={{ paddingLeft: "1.25rem" }}>
              <li>略語・英語名・日本語名など別の表記で検索してください。</li>
              {selectedCategory && (
                <li>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--color-accent-bright)",
                      cursor: "pointer",
                      padding: 0,
                      textDecoration: "underline",
                    }}
                    type="button"
                  >
                    カテゴリの絞り込みを解除する
                  </button>
                </li>
              )}
              <li>
                <Link href="/tags/" style={{ color: "var(--color-accent-bright)" }}>
                  タグ一覧
                </Link>
                から探す
              </li>
            </ul>
          </div>
        )}
      </Section>
    </>
  )
}
