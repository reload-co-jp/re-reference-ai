import { Metadata } from "next"
import { FC } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Breadcrumb } from "components/elements/breadcrumb"
import { Badge, Container, Section, SectionTitle } from "components/elements/layout"
import { ReferenceList } from "components/elements/reference-list"
import { ComparisonCard } from "components/comparison/comparison-card"
import { ComparisonTable } from "components/comparison/comparison-table"
import { FeatureTable } from "components/comparison/feature-table"
import { toJsonLd } from "lib/json-ld"
import { SITE_NAME, SITE_OG_IMAGE_URL, SITE_URL } from "lib/site"
import { linkifyTermMentions } from "lib/term-links"
import { getTermBySlug } from "lib/terms"
import {
  Comparison,
  comparisons,
  getComparisonBySlug,
  getComparisonsForTerm,
  getComparisonTermNames,
} from "lib/comparisons"
import { truncate } from "lib/text"

export const dynamicParams = false

export const generateStaticParams = () =>
  comparisons.map((comparison) => ({ slug: comparison.slug }))

type Props = { params: Promise<{ slug: string }> }

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params
  const comparison = getComparisonBySlug(slug)

  if (!comparison) {
    return {}
  }

  const { left: leftName, right: rightName } = getComparisonTermNames(comparison)
  const title = `${leftName} vs ${rightName}`
  const description = truncate(comparison.summary, 120)
  const url = `${SITE_URL}/compare/${comparison.slug}/`

  return {
    title,
    description,
    alternates: { canonical: url },
    keywords: [
      leftName,
      rightName,
      `${leftName} vs ${rightName}`,
      `${leftName} 比較`,
      `${rightName} 比較`,
      `${leftName} ${rightName} 違い`,
      "Difference between",
      "Which is better",
    ],
    openGraph: {
      title,
      description,
      type: "article",
      url,
      images: [SITE_OG_IMAGE_URL],
      siteName: SITE_NAME,
      locale: "ja_JP",
    },
    twitter: { title, description, images: [SITE_OG_IMAGE_URL] },
  }
}

const buildJsonLd = (comparison: Comparison, leftName: string, rightName: string) => {
  const url = `${SITE_URL}/compare/${comparison.slug}/`
  const leftTerm = getTermBySlug(comparison.left)
  const rightTerm = getTermBySlug(comparison.right)

  const techArticle = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${leftName} vs ${rightName}`,
    description: comparison.summary,
    url,
    image: SITE_OG_IMAGE_URL,
    about: `${leftName} vs ${rightName}`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    mentions: [leftTerm, rightTerm]
      .filter((term): term is NonNullable<typeof term> => Boolean(term))
      .map((term) => ({
        "@type": "DefinedTerm",
        name: term.name,
        url: `${SITE_URL}/terms/${term.slug}/`,
      })),
  }

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "技術比較", item: `${SITE_URL}/compare/` },
      { "@type": "ListItem", position: 3, name: `${leftName} vs ${rightName}`, item: url },
    ],
  }

  const faqPage = comparison.faq &&
    comparison.faq.length > 0 && {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: comparison.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    }

  return [techArticle, breadcrumbList, faqPage].filter(Boolean)
}

const ComparePage: FC<Props> = async ({ params }) => {
  const { slug } = await params
  const comparison = getComparisonBySlug(slug)

  if (!comparison) {
    notFound()
  }

  const { left: leftName, right: rightName } = getComparisonTermNames(comparison)
  const jsonLdBlocks = buildJsonLd(comparison, leftName, rightName)

  const relatedComparisons = [
    ...getComparisonsForTerm(comparison.left),
    ...getComparisonsForTerm(comparison.right),
  ].filter(
    (other, index, all) =>
      other.slug !== comparison.slug && all.findIndex((c) => c.slug === other.slug) === index,
  )

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
          { href: "/compare/", name: "技術比較" },
          { name: `${leftName} vs ${rightName}` },
        ]}
      />
      {/* Hero */}
      <Section
        style={{
          borderBottom: "1px solid var(--color-border)",
          padding: "2.5rem 0 3rem",
        }}
      >
        <h1 style={{ fontSize: "2.25rem", margin: 0 }}>
          {leftName} <span style={{ color: "var(--color-text-muted)" }}>vs</span> {rightName}
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "1.1rem",
            marginTop: ".75rem",
          }}
        >
          {linkifyTermMentions(comparison.summary, "")}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem", marginTop: "1.25rem" }}>
          <Link href={`/terms/${comparison.left}/`} style={{ color: "inherit", textDecoration: "none" }}>
            <Badge>{leftName}</Badge>
          </Link>
          <Link href={`/terms/${comparison.right}/`} style={{ color: "inherit", textDecoration: "none" }}>
            <Badge>{rightName}</Badge>
          </Link>
        </div>
      </Section>

      {/* Quick Summary */}
      {comparison.quickSummary && comparison.quickSummary.length > 0 && (
        <Section>
          <SectionTitle>3行で違いを説明</SectionTitle>
          <ul style={{ paddingLeft: "1.25rem" }}>
            {comparison.quickSummary.map((line) => (
              <li key={line} style={{ marginBottom: ".375rem" }}>
                {linkifyTermMentions(line, "")}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Comparison Table */}
      {comparison.table && comparison.table.length > 0 && (
        <Section>
          <SectionTitle>Comparison Table</SectionTitle>
          <ComparisonTable rows={comparison.table} leftLabel={leftName} rightLabel={rightName} />
        </Section>
      )}

      {/* Architecture */}
      {comparison.architecture && (
        <Section>
          <SectionTitle>Architecture</SectionTitle>
          <div
            style={{
              display: "grid",
              gap: "1.25rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))",
            }}
          >
            <div>
              <p style={{ color: "var(--color-accent-bright)", fontSize: ".85rem", fontWeight: 600 }}>
                {leftName}
              </p>
              <p style={{ margin: 0 }}>{linkifyTermMentions(comparison.architecture.left, "")}</p>
            </div>
            <div>
              <p style={{ color: "var(--color-accent-bright)", fontSize: ".85rem", fontWeight: 600 }}>
                {rightName}
              </p>
              <p style={{ margin: 0 }}>{linkifyTermMentions(comparison.architecture.right, "")}</p>
            </div>
          </div>
        </Section>
      )}

      {/* Feature Comparison */}
      {comparison.features && comparison.features.length > 0 && (
        <Section>
          <SectionTitle>Feature Comparison</SectionTitle>
          <FeatureTable features={comparison.features} leftLabel={leftName} rightLabel={rightName} />
        </Section>
      )}

      {/* Advantages */}
      {comparison.advantages && (
        <Section>
          <SectionTitle>Advantages</SectionTitle>
          <div
            style={{
              display: "grid",
              gap: "1.25rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))",
            }}
          >
            <div>
              <p style={{ color: "var(--color-accent-bright)", fontSize: ".85rem", fontWeight: 600 }}>
                {leftName}
              </p>
              <ul style={{ paddingLeft: "1.25rem" }}>
                {comparison.advantages.left.map((item) => (
                  <li key={item} style={{ marginBottom: ".375rem" }}>
                    {linkifyTermMentions(item, "")}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p style={{ color: "var(--color-accent-bright)", fontSize: ".85rem", fontWeight: 600 }}>
                {rightName}
              </p>
              <ul style={{ paddingLeft: "1.25rem" }}>
                {comparison.advantages.right.map((item) => (
                  <li key={item} style={{ marginBottom: ".375rem" }}>
                    {linkifyTermMentions(item, "")}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      )}

      {/* Disadvantages */}
      {comparison.disadvantages && (
        <Section>
          <SectionTitle>Disadvantages</SectionTitle>
          <div
            style={{
              display: "grid",
              gap: "1.25rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))",
            }}
          >
            <div>
              <p style={{ color: "var(--color-accent-bright)", fontSize: ".85rem", fontWeight: 600 }}>
                {leftName}
              </p>
              <ul style={{ paddingLeft: "1.25rem" }}>
                {comparison.disadvantages.left.map((item) => (
                  <li key={item} style={{ marginBottom: ".375rem" }}>
                    {linkifyTermMentions(item, "")}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p style={{ color: "var(--color-accent-bright)", fontSize: ".85rem", fontWeight: 600 }}>
                {rightName}
              </p>
              <ul style={{ paddingLeft: "1.25rem" }}>
                {comparison.disadvantages.right.map((item) => (
                  <li key={item} style={{ marginBottom: ".375rem" }}>
                    {linkifyTermMentions(item, "")}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      )}

      {/* Best Use Cases */}
      {comparison.bestUseCases && (
        <Section>
          <SectionTitle>Best Use Cases</SectionTitle>
          <div
            style={{
              display: "grid",
              gap: "1.25rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))",
            }}
          >
            <div>
              <p style={{ color: "var(--color-accent-bright)", fontSize: ".85rem", fontWeight: 600 }}>
                {leftName}
              </p>
              <p style={{ margin: 0 }}>{linkifyTermMentions(comparison.bestUseCases.left, "")}</p>
            </div>
            <div>
              <p style={{ color: "var(--color-accent-bright)", fontSize: ".85rem", fontWeight: 600 }}>
                {rightName}
              </p>
              <p style={{ margin: 0 }}>{linkifyTermMentions(comparison.bestUseCases.right, "")}</p>
            </div>
          </div>
        </Section>
      )}

      {/* Migration */}
      {comparison.migration && (
        <Section>
          <SectionTitle>Migration</SectionTitle>
          <p style={{ whiteSpace: "pre-line" }}>{linkifyTermMentions(comparison.migration, "")}</p>
        </Section>
      )}

      {/* FAQ */}
      {comparison.faq && comparison.faq.length > 0 && (
        <Section>
          <SectionTitle>FAQ</SectionTitle>
          {comparison.faq.map((item) => (
            <div key={item.question} style={{ marginBottom: "1.25rem" }}>
              <p style={{ fontWeight: 600, marginBottom: ".375rem" }}>{item.question}</p>
              <p style={{ color: "var(--color-text-muted)", whiteSpace: "pre-line" }}>
                {linkifyTermMentions(item.answer, "")}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* References */}
      {comparison.references && comparison.references.length > 0 && (
        <Section>
          <SectionTitle>参考文献</SectionTitle>
          <ReferenceList references={comparison.references} />
        </Section>
      )}

      {/* Related Comparisons */}
      {relatedComparisons.length > 0 && (
        <Section>
          <SectionTitle>関連する比較</SectionTitle>
          <div
            style={{
              display: "grid",
              gap: "1.25rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(15rem, 1fr))",
            }}
          >
            {relatedComparisons.map((other) => (
              <ComparisonCard key={other.slug} comparison={other} />
            ))}
          </div>
        </Section>
      )}
    </Container>
  )
}

export default ComparePage
