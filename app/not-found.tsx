import { Metadata } from "next"
import { FC } from "react"
import Link from "next/link"
import { Container, Section, SectionTitle } from "components/elements/layout"
import { categories, getCategorySlug } from "lib/terms"

export const metadata: Metadata = {
  title: "ページが見つかりません",
  robots: { follow: true, index: false },
}

const NotFound: FC = () => (
  <Container>
    <Section style={{ padding: "4rem 0 2rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>ページが見つかりません</h1>
      <p style={{ color: "var(--color-text-muted)" }}>
        URLが変更されたか、削除された可能性があります。
        <Link href="/" style={{ color: "var(--color-accent-bright)" }}>
          トップページの用語検索
        </Link>
        から目的の用語を探してください。
      </p>
    </Section>
    <Section>
      <SectionTitle>カテゴリから探す</SectionTitle>
      <ul style={{ display: "flex", flexWrap: "wrap", gap: "1rem", listStyle: "none", padding: 0 }}>
        {categories.map((category) => (
          <li key={category}>
            <Link
              href={`/categories/${getCategorySlug(category)}/`}
              style={{ color: "var(--color-accent-bright)" }}
            >
              {category}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  </Container>
)

export default NotFound
