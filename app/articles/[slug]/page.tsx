import { Metadata } from "next"
import { FC } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArticleCard } from "components/article/article-card"
import { ModelComparisonTable } from "components/article/model-comparison-table"
import { Breadcrumb } from "components/elements/breadcrumb"
import { Badge, Container, Section, SectionTitle } from "components/elements/layout"
import { ReferenceList } from "components/elements/reference-list"
import { TimelineView } from "components/timeline/timeline-view"
import { Article, articles, getArticleBySlug, getArticleModels } from "lib/articles"
import { getFileGitDates } from "lib/git-dates"
import { organizationRef, toJsonLd } from "lib/json-ld"
import { SITE_NAME, SITE_OG_IMAGE_URL, SITE_URL } from "lib/site"
import { linkifyTermMentions } from "lib/term-links"
import { getTermBySlug } from "lib/terms"
import { truncate } from "lib/text"

export const dynamicParams = false

export const generateStaticParams = () => articles.map((article) => ({ slug: article.slug }))

type Props = { params: Promise<{ slug: string }> }

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    return {}
  }

  const title = article.title
  const description = truncate(article.description, 120)
  const url = `${SITE_URL}/articles/${article.slug}/`

  return {
    title,
    description,
    alternates: { canonical: url },
    keywords: [
      article.title,
      ...getArticleModels(article).map((model) => model.name),
      article.category,
      "比較",
      "年表",
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
    category: article.category,
    twitter: { title, description, images: [SITE_OG_IMAGE_URL] },
  }
}

const buildJsonLd = (article: Article) => {
  const url = `${SITE_URL}/articles/${article.slug}/`
  const models = getArticleModels(article)
  const { datePublished, dateModified } = getFileGitDates("data/articles.json")

  const techArticle = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: article.title,
    description: article.description,
    url,
    image: SITE_OG_IMAGE_URL,
    about: article.title,
    datePublished,
    dateModified,
    author: organizationRef,
    publisher: organizationRef,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    mentions: models.map((model) => ({
      "@type": "DefinedTerm",
      name: model.name,
      url: `${SITE_URL}/terms/${model.slug}/`,
    })),
  }

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "特集記事(Articles)", item: `${SITE_URL}/articles/` },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ],
  }

  const faqPage = article.faq &&
    article.faq.length > 0 && {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: article.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    }

  return [techArticle, breadcrumbList, faqPage].filter(Boolean)
}

const ArticlePage: FC<Props> = async ({ params }) => {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const models = getArticleModels(article)
  const relatedTerms = (article.relatedTerms ?? [])
    .map((s) => getTermBySlug(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))

  const termNames: Record<string, string> = {}
  for (const model of models) {
    termNames[model.slug] = model.name
  }
  for (const s of article.relatedTerms ?? []) {
    const term = getTermBySlug(s)
    if (term) termNames[s] = term.name
  }

  const eventsWithLinks = article.events.map((event) => ({
    ...event,
    descriptionNode: linkifyTermMentions(event.description, ""),
  }))

  const developerByModelSlug =
    article.comparisonRows.find((row) => row.item === "開発元")?.values ?? {}

  const otherArticles = articles.filter((a) => a.slug !== article.slug)
  const jsonLdBlocks = buildJsonLd(article)

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
          { href: "/articles/", name: "特集記事(Articles)" },
          { name: article.title },
        ]}
      />
      {/* Hero */}
      <Section
        style={{
          borderBottom: "1px solid var(--color-border)",
          padding: "2.5rem 0 3rem",
        }}
      >
        <Badge style={{ marginBottom: "1rem" }}>{article.category}</Badge>
        <h1 style={{ fontSize: "2.25rem", margin: 0 }}>{article.title}</h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "1.1rem",
            lineHeight: 1.8,
            marginTop: "1rem",
            whiteSpace: "pre-line",
          }}
        >
          {linkifyTermMentions(article.intro, "")}
        </p>
      </Section>

      {/* Models */}
      <Section>
        <SectionTitle>モデル一覧</SectionTitle>
        <ol
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: ".25rem",
            listStyle: "none",
            margin: 0,
            overflow: "hidden",
            padding: 0,
          }}
        >
          {models.map((model, index) => {
            const developer = developerByModelSlug[model.slug]
            return (
              <li
                key={model.slug}
                style={{
                  borderBottom:
                    index < models.length - 1 ? "1px solid var(--color-border)" : "none",
                }}
              >
                <Link
                  href={`/terms/${model.slug}/`}
                  style={{
                    alignItems: "baseline",
                    color: "inherit",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: ".25rem 1rem",
                    padding: "1rem 1.25rem",
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      color: "var(--color-text-muted)",
                      flexShrink: 0,
                      fontSize: ".8rem",
                      width: "1.5rem",
                    }}
                  >
                    {index + 1}
                  </span>
                  <span style={{ flexShrink: 0, fontSize: "1.05rem", fontWeight: 600, width: "9rem" }}>
                    {model.name}
                  </span>
                  {developer && (
                    <Badge style={{ flexShrink: 0 }}>{developer}</Badge>
                  )}
                  <span
                    style={{
                      color: "var(--color-text-muted)",
                      flex: "1 1 20rem",
                      fontSize: ".85rem",
                    }}
                  >
                    {model.tagline}
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      </Section>

      {/* Comparison */}
      {article.comparisonRows.length > 0 && (
        <Section>
          <SectionTitle>モデル比較</SectionTitle>
          <ModelComparisonTable models={models} rows={article.comparisonRows} />
        </Section>
      )}

      {/* Timeline */}
      {article.events.length > 0 && (
        <Section>
          <SectionTitle>年表</SectionTitle>
          <TimelineView events={eventsWithLinks} termNames={termNames} />
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
      {article.faq && article.faq.length > 0 && (
        <Section>
          <SectionTitle>よくある質問</SectionTitle>
          {article.faq.map((item) => (
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
      {article.references && article.references.length > 0 && (
        <Section>
          <SectionTitle>参考文献</SectionTitle>
          <ReferenceList references={article.references} />
        </Section>
      )}

      {/* Other Articles */}
      {otherArticles.length > 0 && (
        <Section>
          <SectionTitle>他の特集記事</SectionTitle>
          <div
            style={{
              display: "grid",
              gap: "1.25rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(15rem, 1fr))",
            }}
          >
            {otherArticles.map((a) => (
              <ArticleCard
                key={a.slug}
                article={{
                  slug: a.slug,
                  title: a.title,
                  description: a.description,
                  category: a.category,
                  modelSlugs: a.modelSlugs,
                }}
              />
            ))}
          </div>
        </Section>
      )}
    </Container>
  )
}

export default ArticlePage
