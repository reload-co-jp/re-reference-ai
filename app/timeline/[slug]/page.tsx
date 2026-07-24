import { Metadata } from "next"
import { FC } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Breadcrumb } from "components/elements/breadcrumb"
import { Badge, Container, Section, SectionTitle } from "components/elements/layout"
import { ReferenceList } from "components/elements/reference-list"
import { VersionBadge } from "components/elements/version-badge"
import { TimelineView } from "components/timeline/timeline-view"
import { getFileGitDates } from "lib/git-dates"
import { organizationRef, toJsonLd } from "lib/json-ld"
import { SITE_NAME, SITE_OG_IMAGE_URL, SITE_URL } from "lib/site"
import { linkifyTermMentions } from "lib/term-links"
import { getTermBySlug } from "lib/terms"
import { getTimelineBySlug, Timeline, timelines } from "lib/timelines"
import { truncate } from "lib/text"

export const dynamicParams = false

export const generateStaticParams = () => timelines.map((timeline) => ({ slug: timeline.slug }))

type Props = { params: Promise<{ slug: string }> }

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params
  const timeline = getTimelineBySlug(slug)

  if (!timeline) {
    return {}
  }

  const title = timeline.title
  const description = truncate(timeline.description, 120)
  const url = `${SITE_URL}/timeline/${timeline.slug}/`

  const primaryName =
    (timeline.targetTerms ?? [])
      .map((s) => getTermBySlug(s)?.name)
      .filter((n): n is string => Boolean(n))[0] ?? timeline.category

  return {
    title,
    description,
    alternates: { canonical: url },
    keywords: [
      timeline.title,
      `${primaryName} 歴史`,
      `${primaryName} 年表`,
      `${primaryName} Timeline`,
      `${primaryName} Evolution`,
      `${primaryName} Release History`,
      `${primaryName} Version History`,
      timeline.category,
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
    category: timeline.category,
    twitter: { title, description, images: [SITE_OG_IMAGE_URL] },
  }
}

const buildJsonLd = (timeline: Timeline) => {
  const url = `${SITE_URL}/timeline/${timeline.slug}/`
  const mentionSlugs = Array.from(
    new Set([...(timeline.targetTerms ?? []), ...(timeline.relatedTerms ?? [])]),
  )
  const mentions = mentionSlugs
    .map((slug) => getTermBySlug(slug))
    .filter((term): term is NonNullable<typeof term> => Boolean(term))
  const gitDates = getFileGitDates("data/timelines.json")
  const datePublished = gitDates.datePublished
  const dateModified = timeline.updatedAt ?? gitDates.dateModified

  const techArticle = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: timeline.title,
    description: timeline.description,
    url,
    image: SITE_OG_IMAGE_URL,
    about: timeline.title,
    datePublished,
    dateModified,
    author: organizationRef,
    publisher: organizationRef,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    ...(mentions.length > 0 && {
      mentions: mentions.map((term) => ({
        "@type": "DefinedTerm",
        name: term.name,
        url: `${SITE_URL}/terms/${term.slug}/`,
      })),
    }),
  }

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "技術年表", item: `${SITE_URL}/timeline/` },
      { "@type": "ListItem", position: 3, name: timeline.title, item: url },
    ],
  }

  const faqPage = timeline.faq &&
    timeline.faq.length > 0 && {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: timeline.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    }

  return [techArticle, breadcrumbList, faqPage].filter(Boolean)
}

const TimelinePage: FC<Props> = async ({ params }) => {
  const { slug } = await params
  const timeline = getTimelineBySlug(slug)

  if (!timeline) {
    notFound()
  }

  const targetTerms = (timeline.targetTerms ?? [])
    .map((s) => getTermBySlug(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
  const relatedTerms = (timeline.relatedTerms ?? [])
    .map((s) => getTermBySlug(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))

  const termNames: Record<string, string> = {}
  for (const s of [
    ...(timeline.targetTerms ?? []),
    ...(timeline.relatedTerms ?? []),
    ...timeline.events.flatMap((e) => e.relatedTerms ?? []),
  ]) {
    const term = getTermBySlug(s)
    if (term) termNames[s] = term.name
  }

  const eventsWithLinks = timeline.events.map((event) => ({
    ...event,
    descriptionNode: linkifyTermMentions(event.description, ""),
  }))

  const jsonLdBlocks = buildJsonLd(timeline)

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
          { href: "/timeline/", name: "技術年表" },
          { name: timeline.title },
        ]}
      />
      {/* Hero */}
      <Section
        style={{
          borderBottom: "1px solid var(--color-border)",
          padding: "2.5rem 0 3rem",
        }}
      >
        <Badge style={{ marginBottom: "1rem" }}>{timeline.category}</Badge>
        <h1 style={{ fontSize: "2.25rem", margin: 0 }}>{timeline.title}</h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "1.1rem",
            marginTop: ".75rem",
          }}
        >
          {linkifyTermMentions(timeline.description, "")}
        </p>
        {targetTerms.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem", marginTop: "1.25rem" }}>
            {targetTerms.map((term) => (
              <Link
                key={term.slug}
                href={`/terms/${term.slug}/`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <Badge>{term.name}</Badge>
              </Link>
            ))}
          </div>
        )}
      </Section>

      {/* Timeline */}
      <Section>
        <SectionTitle>年表</SectionTitle>
        <TimelineView events={eventsWithLinks} termNames={termNames} />
      </Section>

      {/* Major Versions */}
      {timeline.majorVersions && timeline.majorVersions.length > 0 && (
        <Section>
          <SectionTitle>Major Versions</SectionTitle>
          {timeline.majorVersions.map((version) => (
            <VersionBadge
              key={version.version}
              version={version.version}
              date={version.date}
              note={version.note}
            />
          ))}
        </Section>
      )}

      {/* Related Technologies */}
      {relatedTerms.length > 0 && (
        <Section>
          <SectionTitle>関連技術</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
            {relatedTerms.map((term) => (
              <Link
                key={term.slug}
                href={`/terms/${term.slug}/`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <Badge style={{ fontSize: ".85rem", padding: ".4rem .9rem" }}>{term.name}</Badge>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* FAQ */}
      {timeline.faq && timeline.faq.length > 0 && (
        <Section>
          <SectionTitle>よくある質問</SectionTitle>
          {timeline.faq.map((item) => (
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
      {timeline.references && timeline.references.length > 0 && (
        <Section>
          <SectionTitle>参考文献</SectionTitle>
          <ReferenceList references={timeline.references} />
        </Section>
      )}
    </Container>
  )
}

export default TimelinePage
