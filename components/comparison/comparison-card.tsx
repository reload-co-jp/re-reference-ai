import { FC } from "react"
import Link from "next/link"
import { Badge, Card } from "components/elements/layout"
import { ComparisonSummaryCard } from "lib/comparisons"
import { getTermBySlug } from "lib/terms"

export const ComparisonCard: FC<{ comparison: ComparisonSummaryCard }> = ({ comparison }) => {
  const leftName = getTermBySlug(comparison.left)?.name ?? comparison.left
  const rightName = getTermBySlug(comparison.right)?.name ?? comparison.right

  return (
    <Link
      href={`/compare/${comparison.slug}/`}
      style={{ color: "inherit", textDecoration: "none" }}
    >
      <Card style={{ height: "100%" }}>
        <h3 style={{ fontSize: "1.05rem", margin: 0 }}>
          {leftName} <span style={{ color: "var(--color-text-muted)" }}>vs</span> {rightName}
        </h3>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: ".85rem",
            margin: ".75rem 0 1rem",
          }}
        >
          {comparison.summary}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem" }}>
          <Badge>{leftName}</Badge>
          <Badge>{rightName}</Badge>
        </div>
      </Card>
    </Link>
  )
}
