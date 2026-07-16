import { FC } from "react"
import Link from "next/link"
import { Badge, Card } from "components/elements/layout"
import { getEventYearRange, TimelineSummaryCard } from "lib/timelines"

export const TimelineCard: FC<{ timeline: TimelineSummaryCard }> = ({ timeline }) => (
  <Link
    href={`/timeline/${timeline.slug}/`}
    style={{ color: "inherit", textDecoration: "none" }}
  >
    <Card style={{ height: "100%" }}>
      <h3 style={{ fontSize: "1.05rem", margin: 0 }}>{timeline.title}</h3>
      <p
        style={{
          color: "var(--color-text-muted)",
          fontSize: ".85rem",
          margin: ".75rem 0 1rem",
        }}
      >
        {timeline.description}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem" }}>
        <Badge>{timeline.category}</Badge>
        <Badge>
          {timeline.events.length}件のイベント / {getEventYearRange(timeline)}
        </Badge>
      </div>
    </Card>
  </Link>
)
