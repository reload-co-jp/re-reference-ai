import { FC } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge, Container, Section, SectionTitle } from "components/elements/layout"
import { getRelatedTerms, getTermBySlug, terms } from "lib/terms"

export const dynamicParams = false

export const generateStaticParams = () => terms.map((term) => ({ slug: term.slug }))

const TermPage: FC<{ params: Promise<{ slug: string }> }> = async ({ params }) => {
  const { slug } = await params
  const term = getTermBySlug(slug)

  if (!term) {
    notFound()
  }

  const relatedTerms = getRelatedTerms(term)

  return (
    <Container>
      {/* Hero */}
      <Section
        style={{
          borderBottom: "1px solid var(--color-border)",
          padding: "2.5rem 0 3rem",
        }}
      >
        <Badge style={{ marginBottom: "1rem" }}>{term.category}</Badge>
        <h1 style={{ fontSize: "2.25rem", margin: 0 }}>
          {term.name}
          {term.aliases && term.aliases.length > 0 && (
            <span
              style={{
                color: "var(--color-text-muted)",
                fontSize: "1.25rem",
                marginLeft: ".625rem",
              }}
            >
              ({term.aliases.join(" / ")})
            </span>
          )}
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "1.1rem",
            marginTop: ".75rem",
          }}
        >
          {term.tagline}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem", marginTop: "1.25rem" }}>
          {term.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </Section>

      {/* Summary */}
      <Section style={{ marginTop: "3rem" }}>
        <SectionTitle>概要</SectionTitle>
        <p>{term.summary}</p>
      </Section>

      {/* Background */}
      <Section>
        <SectionTitle>背景</SectionTitle>
        <p>{term.background}</p>
      </Section>

      {/* History */}
      <Section>
        <SectionTitle>歴史</SectionTitle>
        <p>{term.history}</p>
      </Section>

      {/* Architecture */}
      <Section>
        <SectionTitle>アーキテクチャ</SectionTitle>
        <p>{term.architecture}</p>
      </Section>

      {/* Workflow */}
      <Section>
        <SectionTitle>ワークフロー</SectionTitle>
        <p>{term.workflow}</p>
      </Section>

      {/* Code Examples */}
      {term.codeExamples.length > 0 && (
        <Section>
          <SectionTitle>コード例</SectionTitle>
          {term.codeExamples.map((example) => (
            <div key={example.title} style={{ marginBottom: "1rem" }}>
              <p
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: ".85rem",
                  marginBottom: ".5rem",
                }}
              >
                {example.title}
              </p>
              <pre
                style={{
                  background: "var(--color-bg-elevated)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "2px",
                  overflowX: "auto",
                  padding: "1.25rem",
                }}
              >
                <code>{example.code}</code>
              </pre>
            </div>
          ))}
        </Section>
      )}

      {/* Advantages */}
      <Section>
        <SectionTitle>利点</SectionTitle>
        <ul style={{ paddingLeft: "1.25rem" }}>
          {term.advantages.map((advantage) => (
            <li key={advantage} style={{ marginBottom: ".375rem" }}>
              {advantage}
            </li>
          ))}
        </ul>
      </Section>

      {/* Disadvantages */}
      <Section>
        <SectionTitle>欠点</SectionTitle>
        <ul style={{ paddingLeft: "1.25rem" }}>
          {term.disadvantages.map((disadvantage) => (
            <li key={disadvantage} style={{ marginBottom: ".375rem" }}>
              {disadvantage}
            </li>
          ))}
        </ul>
      </Section>

      {/* Comparisons */}
      {term.comparisons.length > 0 && (
        <Section>
          <SectionTitle>比較</SectionTitle>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {term.comparisons.map((comparison) => {
              const target = getTermBySlug(comparison.slug)
              if (!target) return null
              return (
                <li key={comparison.slug} style={{ marginBottom: ".625rem" }}>
                  <Link href={`/terms/${target.slug}/`} style={{ color: "var(--color-accent-bright)" }}>
                    {target.name}
                  </Link>
                  <span style={{ color: "var(--color-text-muted)" }}> — {comparison.note}</span>
                </li>
              )
            })}
          </ul>
        </Section>
      )}

      {/* Related Terms */}
      {relatedTerms.length > 0 && (
        <Section>
          <SectionTitle>関連用語</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
            {relatedTerms.map((related) => (
              <Link
                key={related.slug}
                href={`/terms/${related.slug}/`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <Badge style={{ fontSize: ".85rem", padding: ".4rem .9rem" }}>
                  {related.name}
                </Badge>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* FAQ */}
      {term.faq.length > 0 && (
        <Section>
          <SectionTitle>よくある質問</SectionTitle>
          {term.faq.map((item) => (
            <div key={item.question} style={{ marginBottom: "1.25rem" }}>
              <p style={{ fontWeight: 600, marginBottom: ".375rem" }}>{item.question}</p>
              <p style={{ color: "var(--color-text-muted)" }}>{item.answer}</p>
            </div>
          ))}
        </Section>
      )}

      {/* References */}
      <Section>
        <SectionTitle>参考文献</SectionTitle>
        <ul style={{ paddingLeft: "1.25rem" }}>
          {term.references.map((reference) => (
            <li key={reference.url} style={{ marginBottom: ".5rem" }}>
              <Badge style={{ marginRight: ".625rem" }}>{reference.type}</Badge>
              <a
                href={reference.url}
                rel="noreferrer"
                style={{ color: "var(--color-accent-bright)" }}
                target="_blank"
              >
                {reference.label}
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </Container>
  )
}

export default TermPage
