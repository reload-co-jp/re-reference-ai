import { Metadata } from "next"
import { FC } from "react"
import { Breadcrumb } from "components/elements/breadcrumb"
import { Container, Section } from "components/elements/layout"
import { toJsonLd } from "lib/json-ld"
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OG_IMAGE_URL,
  SITE_PUBLISHER_NAME,
  SITE_URL,
} from "lib/site"

const TITLE = "運営者情報"
const DESCRIPTION = `${SITE_NAME}(RRA)の運営者情報。`

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/about/` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: `${SITE_URL}/about/`,
    images: [SITE_OG_IMAGE_URL],
    siteName: SITE_NAME,
    locale: "ja_JP",
  },
  twitter: { title: TITLE, description: DESCRIPTION, images: [SITE_OG_IMAGE_URL] },
}

const breadcrumbList = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: TITLE, item: `${SITE_URL}/about/` },
  ],
}

const ROWS: { label: string; value: string }[] = [
  { label: "サイト名", value: `${SITE_NAME}（RRA）` },
  { label: "運営", value: SITE_PUBLISHER_NAME },
  { label: "サイト概要", value: SITE_DESCRIPTION },
]

const AboutPage: FC = () => (
  <Container>
    <script
      dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbList) }}
      type="application/ld+json"
    />
    <Breadcrumb items={[{ href: "/", name: SITE_NAME }, { name: TITLE }]} />
    <Section style={{ padding: "1rem 0 3rem" }}>
      <h1 style={{ fontSize: "2.25rem", margin: 0 }}>{TITLE}</h1>
    </Section>

    <Section>
      <dl style={{ margin: 0 }}>
        {ROWS.map((row) => (
          <div
            key={row.label}
            style={{
              borderBottom: "1px solid var(--color-border)",
              display: "flex",
              flexWrap: "wrap",
              gap: ".5rem 1.5rem",
              padding: "1rem 0",
            }}
          >
            <dt
              style={{
                color: "var(--color-text-muted)",
                flexShrink: 0,
                fontSize: ".85rem",
                width: "8rem",
              }}
            >
              {row.label}
            </dt>
            <dd style={{ flex: "1 1 20rem", lineHeight: 1.8, margin: 0 }}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  </Container>
)

export default AboutPage
