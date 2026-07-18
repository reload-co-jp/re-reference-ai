import { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import Link from "next/link"
import { GoogleAnalytics } from "components/analytics/google-analytics"
import { Title } from "components/elements/layout"
import { toJsonLd } from "lib/json-ld"
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_OG_IMAGE_URL,
  SITE_TAGLINE_JA,
  SITE_URL,
} from "lib/site"
import "./reset.css"

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600"],
})

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
})

export const metadata: Metadata = {
  applicationName: SITE_NAME,
  authors: [{ name: "Reload" }],
  creator: "Reload",
  metadataBase: new URL(SITE_URL),
  keywords: SITE_KEYWORDS,
  publisher: "Reload",
  title: {
    default: `${SITE_NAME} (RRA) — ${SITE_TAGLINE_JA}・技術リファレンス`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE_JA}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [SITE_OG_IMAGE_URL],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE_JA}`,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE_URL],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    follow: true,
    index: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: "RRA",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html className={`${display.variable} ${body.variable}`} lang="ja">
      <body>
        <GoogleAnalytics />
        <script
          dangerouslySetInnerHTML={{ __html: toJsonLd(websiteJsonLd) }}
          type="application/ld+json"
        />
        <header
          style={{
            alignItems: "center",
            background: "var(--color-bg-elevated)",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "space-between",
            padding: "1rem 1.5rem",
            position: "relative",
          }}
        >
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            <Title>Re Reference AI</Title>
          </Link>
          <nav>
            <ul
              style={{
                display: "flex",
                gap: "1.25rem",
                fontSize: ".85rem",
                listStyle: "none",
                margin: 0,
                padding: 0,
              }}
            >
              <li>
                <Link href="/timeline/" style={{ color: "var(--color-text-muted)" }}>
                  技術年表
                </Link>
              </li>
              <li>
                <Link href="/compare/" style={{ color: "var(--color-text-muted)" }}>
                  技術比較
                </Link>
              </li>
              <li>
                <Link href="/articles/" style={{ color: "var(--color-text-muted)" }}>
                  特集記事
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main
          style={{
            background: "var(--color-bg)",
            minHeight: "calc(100dvh - 7.5rem)",
            padding: "1rem",
          }}
        >
          {children}
        </main>
        <footer
          style={{
            alignItems: "center",
            background: "var(--color-bg-elevated)",
            borderTop: "1px solid var(--color-border)",
            color: "var(--color-text-muted)",
            display: "flex",
            flexWrap: "wrap",
            fontSize: ".75rem",
            gap: "1rem",
            justifyContent: "space-between",
            letterSpacing: "0.02em",
            padding: "1.25rem 1.5rem",
          }}
        >
          <p style={{ margin: 0 }}>&copy; Reload</p>
          <Link href="/about/" style={{ color: "var(--color-text-muted)" }}>
            運営者情報
          </Link>
        </footer>
      </body>
    </html>
  )
}
export default RootLayout
