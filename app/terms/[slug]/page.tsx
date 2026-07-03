import { Metadata } from "next"
import { FC } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Breadcrumb } from "components/elements/breadcrumb"
import { Badge, Container, Section, SectionTitle } from "components/elements/layout"
import { toJsonLd } from "lib/json-ld"
import { SITE_NAME, SITE_OG_IMAGE_URL, SITE_URL } from "lib/site"
import { getCategorySlug, getRelatedTerms, getTermBySlug, Term, terms } from "lib/terms"

export const dynamicParams = false

export const generateStaticParams = () => terms.map((term) => ({ slug: term.slug }))

type Props = { params: Promise<{ slug: string }> }

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params
  const term = getTermBySlug(slug)

  if (!term) {
    return {}
  }

  const title = term.name
  const description = term.summary ?? term.tagline
  const url = `${SITE_URL}/terms/${term.slug}/`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, type: "article", url, images: [SITE_OG_IMAGE_URL] },
    twitter: { title, description, images: [SITE_OG_IMAGE_URL] },
  }
}

const buildJsonLd = (term: Term, relatedTerms: Term[]) => {
  const url = `${SITE_URL}/terms/${term.slug}/`
  const categoryUrl = `${SITE_URL}/categories/${getCategorySlug(term.category)}/`
  const description = term.summary ?? term.tagline

  const definedTerm = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.name,
    alternateName: term.aliases,
    description,
    url,
    inDefinedTermSet: `${SITE_URL}/`,
    termCode: term.category,
  }

  const techArticle = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: term.name,
    description,
    url,
    about: term.name,
    keywords: term.tags?.join(", "),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    ...(relatedTerms.length > 0 && {
      mentions: relatedTerms.map((related) => ({
        "@type": "DefinedTerm",
        name: related.name,
        url: `${SITE_URL}/terms/${related.slug}/`,
      })),
    }),
  }

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: term.category, item: categoryUrl },
      { "@type": "ListItem", position: 3, name: term.name, item: url },
    ],
  }

  const faqPage = term.faq &&
    term.faq.length > 0 && {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: term.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    }

  return [definedTerm, techArticle, breadcrumbList, faqPage].filter(Boolean)
}

const TermPage: FC<Props> = async ({ params }) => {
  const { slug } = await params
  const term = getTermBySlug(slug)

  if (!term) {
    notFound()
  }

  const relatedTerms = getRelatedTerms(term)
  const jsonLdBlocks = buildJsonLd(term, relatedTerms)

  return (
    <Container>
      {jsonLdBlocks.map((block) => (
        <script
          key={(block as { "@type": string })["@type"]}
          dangerouslySetInnerHTML={{ __html: toJsonLd(block) }}
          type="application/ld+json"
        />
      ))}
      <Breadcrumb
        items={[
          { href: "/", name: SITE_NAME },
          { href: `/categories/${getCategorySlug(term.category)}/`, name: term.category },
          { name: term.name },
        ]}
      />
      {/* Hero */}
      <Section
        style={{
          borderBottom: "1px solid var(--color-border)",
          padding: "2.5rem 0 3rem",
        }}
      >
        <Badge style={{ marginBottom: "1rem" }}>{term.category}</Badge>
        <h1 style={{ fontSize: "2.25rem", margin: 0 }}>{term.name}</h1>
        {term.aliases && term.aliases.length > 0 && (
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "1.25rem",
              margin: ".5rem 0 0",
            }}
          >
            {term.aliases.join(" / ")}
          </p>
        )}
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
      {term.summary && (
        <Section style={{ marginTop: "3rem" }}>
          <SectionTitle>概要</SectionTitle>
          <p style={{ whiteSpace: "pre-line" }}>{term.summary}</p>
        </Section>
      )}

      {/* Background */}
      {term.background && (
        <Section>
          <SectionTitle>背景</SectionTitle>
          <p style={{ whiteSpace: "pre-line" }}>{term.background}</p>
        </Section>
      )}

      {/* History */}
      {term.history && (
        <Section>
          <SectionTitle>歴史</SectionTitle>
          <p style={{ whiteSpace: "pre-line" }}>{term.history}</p>
        </Section>
      )}

      {/* Architecture */}
      {term.architecture && (
        <Section>
          <SectionTitle>アーキテクチャ</SectionTitle>
          <p style={{ whiteSpace: "pre-line" }}>{term.architecture}</p>
        </Section>
      )}

      {/* Workflow */}
      {term.workflow && (
        <Section>
          <SectionTitle>ワークフロー</SectionTitle>
          <p style={{ whiteSpace: "pre-line" }}>{term.workflow}</p>
        </Section>
      )}

      {/* Code Examples */}
      {term.codeExamples && term.codeExamples.length > 0 && (
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
      {term.advantages && term.advantages.length > 0 && (
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
      )}

      {/* Disadvantages */}
      {term.disadvantages && term.disadvantages.length > 0 && (
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
      )}

      {/* Comparisons */}
      {term.comparisons && term.comparisons.length > 0 && (
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
      {term.faq && term.faq.length > 0 && (
        <Section>
          <SectionTitle>よくある質問</SectionTitle>
          {term.faq.map((item) => (
            <div key={item.question} style={{ marginBottom: "1.25rem" }}>
              <p style={{ fontWeight: 600, marginBottom: ".375rem" }}>{item.question}</p>
              <p style={{ color: "var(--color-text-muted)", whiteSpace: "pre-line" }}>{item.answer}</p>
            </div>
          ))}
        </Section>
      )}

      {/* References */}
      {term.references && term.references.length > 0 && (
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
      )}
    </Container>
  )
}

export default TermPage
