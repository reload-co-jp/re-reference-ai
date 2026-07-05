import { Metadata } from "next"
import { FC } from "react"
import { notFound } from "next/navigation"
import { Breadcrumb } from "components/elements/breadcrumb"
import { Container, Section, SectionTitle } from "components/elements/layout"
import { TermCard } from "components/term/term-card"
import { toJsonLd } from "lib/json-ld"
import { SITE_NAME, SITE_OG_IMAGE_URL, SITE_URL } from "lib/site"
import { getAllTags, getTagBySlug, getTagDescription, getTagSlug, getTermsByTag } from "lib/terms"

const MIN_TERMS_FOR_INDEX = 3

export const dynamicParams = false

export const generateStaticParams = () =>
  getAllTags().map((tag) => ({ slug: getTagSlug(tag) }))

type Props = { params: Promise<{ slug: string }> }

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params
  const tag = getTagBySlug(slug)

  if (!tag) {
    return {}
  }

  const termCount = getTermsByTag(tag).length
  const title = `${tag}の用語一覧`
  const description =
    getTagDescription(tag) ??
    `${tag}に関連するAI・機械学習用語の一覧。${SITE_NAME}が提供する技術リファレンス。`
  const url = `${SITE_URL}/tags/${slug}/`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, type: "website", url, images: [SITE_OG_IMAGE_URL] },
    twitter: { title, description, images: [SITE_OG_IMAGE_URL] },
    robots: termCount < MIN_TERMS_FOR_INDEX ? { follow: true, index: false } : undefined,
  }
}

const TagPage: FC<Props> = async ({ params }) => {
  const { slug } = await params
  const tag = getTagBySlug(slug)

  if (!tag) {
    notFound()
  }

  const matchedTerms = getTermsByTag(tag)
  const tagDescription = getTagDescription(tag)
  const url = `${SITE_URL}/tags/${slug}/`

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: tag, item: url },
    ],
  }

  return (
    <Container>
      <script
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbList) }}
        type="application/ld+json"
      />
      <Breadcrumb items={[{ href: "/", name: SITE_NAME }, { name: tag }]} />
      <Section style={{ padding: "1rem 0 3rem" }}>
        <h1 style={{ fontSize: "2.25rem", margin: 0 }}>{tag}</h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "1.1rem", marginTop: ".75rem" }}>
          {tag}に関連する用語（{matchedTerms.length}件）
        </p>
        {tagDescription && (
          <p style={{ fontSize: "1rem", lineHeight: 1.8, marginTop: "1rem" }}>{tagDescription}</p>
        )}
      </Section>

      <Section>
        <SectionTitle>用語一覧</SectionTitle>
        <div
          style={{
            display: "grid",
            gap: "1.25rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(15rem, 1fr))",
          }}
        >
          {matchedTerms.map((term) => (
            <TermCard key={term.slug} term={term} />
          ))}
        </div>
      </Section>
    </Container>
  )
}

export default TagPage
