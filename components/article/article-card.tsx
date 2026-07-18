import { FC } from "react"
import Link from "next/link"
import { Badge, Card } from "components/elements/layout"
import { ArticleSummaryCard } from "lib/articles"

export const ArticleCard: FC<{ article: ArticleSummaryCard }> = ({ article }) => (
  <Link href={`/articles/${article.slug}/`} style={{ color: "inherit", textDecoration: "none" }}>
    <Card style={{ height: "100%" }}>
      <h3 style={{ fontSize: "1.05rem", margin: 0 }}>{article.title}</h3>
      <p
        style={{
          color: "var(--color-text-muted)",
          fontSize: ".85rem",
          margin: ".75rem 0 1rem",
        }}
      >
        {article.description}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem" }}>
        <Badge>{article.category}</Badge>
        <Badge>{article.modelSlugs.length}モデル</Badge>
      </div>
    </Card>
  </Link>
)
