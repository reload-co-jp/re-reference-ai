import { FC } from "react"
import Link from "next/link"
import { Badge, Card } from "components/elements/layout"
import { TermSummaryCard } from "lib/terms"

export const TermCard: FC<{ term: TermSummaryCard }> = ({ term }) => (
  <Link
    className="term-card-link"
    href={`/terms/${term.slug}/`}
    style={{ color: "inherit", textDecoration: "none" }}
  >
    <Card className="term-card" style={{ height: "100%" }}>
      <div>
        <h3 style={{ fontSize: "1.05rem", margin: 0 }}>{term.name}</h3>
        {term.aliases && term.aliases.length > 0 && (
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: ".8rem",
              margin: ".25rem 0 0",
            }}
          >
            {term.aliases.join(" / ")}
          </p>
        )}
      </div>
      <p
        style={{
          color: "var(--color-text-muted)",
          fontSize: ".85rem",
          margin: ".75rem 0 1rem",
        }}
      >
        {term.tagline}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem" }}>
        <Badge>{term.category}</Badge>
        {term.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </Card>
  </Link>
)
