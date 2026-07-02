import { FC } from "react"
import Link from "next/link"
import { Badge, Card } from "components/elements/layout"
import { Term } from "lib/terms"

export const TermCard: FC<{ term: Term }> = ({ term }) => (
  <Link href={`/terms/${term.slug}/`} style={{ color: "inherit", textDecoration: "none" }}>
    <Card style={{ height: "100%" }}>
      <div style={{ alignItems: "baseline", display: "flex", gap: ".5rem" }}>
        <h3 style={{ fontSize: "1rem", margin: 0 }}>{term.name}</h3>
        {term.shortName && (
          <span style={{ color: "#999", fontSize: ".8rem" }}>{term.shortName}</span>
        )}
      </div>
      <p style={{ color: "#bbb", fontSize: ".85rem", margin: ".5rem 0" }}>
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
