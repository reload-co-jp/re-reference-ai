import { Metadata } from "next"
import { FC } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArticleCard } from "components/article/article-card"
import { ComparisonCard } from "components/comparison/comparison-card"
import { Breadcrumb } from "components/elements/breadcrumb"
import {
  Badge,
  Container,
  Section,
  SectionTitle,
} from "components/elements/layout"
import { TermCard } from "components/term/term-card"
import { TimelineCard } from "components/timeline/timeline-card"
import { articles, getArticleTermSlugs } from "lib/articles"
import { comparisons } from "lib/comparisons"
import { buildItemListJsonLd, toJsonLd } from "lib/json-ld"
import { SITE_NAME, SITE_OG_IMAGE_URL, SITE_URL } from "lib/site"
import {
  categories,
  getAllTags,
  getCoOccurringTags,
  getTagBySlug,
  getTagDescription,
  getTagSlug,
  getTermForTag,
  getTermsByTag,
  isTagIndexable,
} from "lib/terms"
import { getTimelinesForTerm, Timeline } from "lib/timelines"

export const dynamicParams = false

export const generateStaticParams = () =>
  getAllTags().map((tag) => ({ slug: getTagSlug(tag) }))

type Props = { params: Promise<{ slug: string }> }

// 説明文があるタグのみ「〜とは」形式にする。説明のないタグで「とは」を名乗らない
const buildTitle = (tag: string) =>
  getTagDescription(tag) ? `${tag}とは？関連技術・用語一覧` : `${tag}の用語一覧`

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params
  const tag = getTagBySlug(slug)

  if (!tag) {
    return {}
  }

  const title = buildTitle(tag)
  const description =
    getTagDescription(tag) ??
    `${tag}に関連するAI・機械学習用語${getTermsByTag(tag).length}件を分類別に一覧できるページ。各用語の定義・仕組み・比較へたどれる。`
  const url = `${SITE_URL}/tags/${slug}/`

  return {
    title,
    description,
    alternates: { canonical: url },
    keywords: [tag, "AI", "機械学習", "用語一覧", "技術リファレンス"],
    openGraph: {
      title,
      description,
      type: "website",
      url,
      images: [SITE_OG_IMAGE_URL],
      siteName: SITE_NAME,
      locale: "ja_JP",
    },
    twitter: { title, description, images: [SITE_OG_IMAGE_URL] },
    robots: isTagIndexable(tag) ? undefined : { follow: true, index: false },
  }
}

const gridStyle = {
  display: "grid",
  gap: "1.25rem",
  gridTemplateColumns: "repeat(auto-fill, minmax(15rem, 1fr))",
} as const

const TagPage: FC<Props> = async ({ params }) => {
  const { slug } = await params
  const tag = getTagBySlug(slug)

  if (!tag) {
    notFound()
  }

  const title = buildTitle(tag)
  const matchedTerms = getTermsByTag(tag)
  const matchedSlugs = new Set(matchedTerms.map((term) => term.slug))
  const tagDescription = getTagDescription(tag)
  const mainTerm = getTermForTag(tag)
  const url = `${SITE_URL}/tags/${slug}/`

  const termsByCategory = categories
    .map((category) => ({
      category,
      terms: matchedTerms.filter((term) => term.category === category),
    }))
    .filter((group) => group.terms.length > 0)

  const relatedComparisons = comparisons.filter(
    (comparison) =>
      matchedSlugs.has(comparison.left) && matchedSlugs.has(comparison.right)
  )
  const relatedArticles = articles.filter((article) =>
    getArticleTermSlugs(article).some((termSlug) => matchedSlugs.has(termSlug))
  )
  const relatedTimelines = Array.from(
    new Map<string, Timeline>(
      matchedTerms
        .flatMap((term) => getTimelinesForTerm(term.slug))
        .map((timeline) => [timeline.slug, timeline])
    ).values()
  )
  const coOccurringTags = getCoOccurringTags(tag)

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: SITE_NAME,
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "タグ一覧",
        item: `${SITE_URL}/tags/`,
      },
      { "@type": "ListItem", position: 3, name: tag, item: url },
    ],
  }

  const itemList = buildItemListJsonLd(
    `${tag}の用語一覧`,
    matchedTerms.map((term) => ({
      name: term.name,
      url: `${SITE_URL}/terms/${term.slug}/`,
    }))
  )

  return (
    <Container>
      <script
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbList) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: toJsonLd(itemList) }}
        type="application/ld+json"
      />
      <Breadcrumb
        items={[
          { href: "/", name: SITE_NAME },
          { href: "/tags/", name: "タグ一覧" },
          { name: tag },
        ]}
      />
      <Section style={{ padding: "1rem 0 3rem" }}>
        <h1 style={{ fontSize: "2.25rem", margin: 0 }}>{title}</h1>
        {tagDescription && (
          <p style={{ fontSize: "1rem", lineHeight: 1.8, marginTop: "1rem" }}>
            {tagDescription}
          </p>
        )}
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "1rem",
            marginTop: ".75rem",
          }}
        >
          {tag}に関連する用語（{matchedTerms.length}件）
          {mainTerm && (
            <>
              。定義・仕組みは
              <Link
                href={`/terms/${mainTerm.slug}/`}
                style={{ color: "var(--color-accent-bright)" }}
              >
                {mainTerm.name}の用語ページ
              </Link>
              で解説。
            </>
          )}
        </p>
      </Section>

      {termsByCategory.map(({ category, terms }) => (
        <Section key={category}>
          <SectionTitle>
            {tag}関連の{category}（{terms.length}件）
          </SectionTitle>
          <div style={gridStyle}>
            {terms.map((term) => (
              <TermCard key={term.slug} term={term} />
            ))}
          </div>
        </Section>
      ))}

      {relatedComparisons.length > 0 && (
        <Section>
          <SectionTitle>{tag}関連の比較</SectionTitle>
          <div style={gridStyle}>
            {relatedComparisons.map((comparison) => (
              <ComparisonCard key={comparison.slug} comparison={comparison} />
            ))}
          </div>
        </Section>
      )}

      {relatedArticles.length > 0 && (
        <Section>
          <SectionTitle>{tag}関連の特集記事</SectionTitle>
          <div style={gridStyle}>
            {relatedArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </Section>
      )}

      {relatedTimelines.length > 0 && (
        <Section>
          <SectionTitle>{tag}関連の年表</SectionTitle>
          <div style={gridStyle}>
            {relatedTimelines.map((timeline) => (
              <TimelineCard key={timeline.slug} timeline={timeline} />
            ))}
          </div>
        </Section>
      )}

      {coOccurringTags.length > 0 && (
        <Section>
          <SectionTitle>関連するタグ</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
            {coOccurringTags.map((other) => (
              <Link
                key={other}
                href={`/tags/${getTagSlug(other)}/`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <Badge style={{ fontSize: ".85rem", padding: ".4rem .9rem" }}>
                  {other}
                </Badge>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </Container>
  )
}

export default TagPage
