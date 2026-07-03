import { Metadata } from "next"
import { FC } from "react"
import { notFound } from "next/navigation"
import { Breadcrumb } from "components/elements/breadcrumb"
import { Container, Section, SectionTitle } from "components/elements/layout"
import { TermCard } from "components/term/term-card"
import { toJsonLd } from "lib/json-ld"
import { SITE_NAME, SITE_OG_IMAGE_URL, SITE_URL } from "lib/site"
import { categories, getCategoryBySlug, getCategorySlug, getTermsByCategory } from "lib/terms"

export const dynamicParams = false

export const generateStaticParams = () =>
  categories.map((category) => ({ slug: getCategorySlug(category) }))

type Props = { params: Promise<{ slug: string }> }

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    return {}
  }

  const title = `${category}の用語一覧`
  const description = `${category}に分類されるAI・機械学習用語の一覧。${SITE_NAME}が提供する技術リファレンス。`
  const url = `${SITE_URL}/categories/${slug}/`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, type: "website", url, images: [SITE_OG_IMAGE_URL] },
    twitter: { title, description, images: [SITE_OG_IMAGE_URL] },
  }
}

const CategoryPage: FC<Props> = async ({ params }) => {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const terms = getTermsByCategory(category)
  const url = `${SITE_URL}/categories/${slug}/`

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: category, item: url },
    ],
  }

  return (
    <Container>
      <script
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbList) }}
        type="application/ld+json"
      />
      <Breadcrumb items={[{ href: "/", name: SITE_NAME }, { name: category }]} />
      <Section style={{ padding: "1rem 0 3rem" }}>
        <h1 style={{ fontSize: "2.25rem", margin: 0 }}>{category}</h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "1.1rem", marginTop: ".75rem" }}>
          {category}に分類される用語（{terms.length}件）
        </p>
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
          {terms.map((term) => (
            <TermCard key={term.slug} term={term} />
          ))}
        </div>
      </Section>
    </Container>
  )
}

export default CategoryPage
