"use client"

import { FC, ReactNode, useState } from "react"
import Link from "next/link"
import { Badge, Card } from "components/elements/layout"
import { TimelineEvent } from "lib/timelines"

export type TimelineViewEvent = TimelineEvent & { descriptionNode: ReactNode }

type Props = {
  events: TimelineViewEvent[]
  termNames: Record<string, string>
}

const groupByYear = (events: TimelineViewEvent[]): [string, TimelineViewEvent[]][] => {
  const groups = new Map<string, TimelineViewEvent[]>()
  for (const event of events) {
    const year = event.date.slice(0, 4)
    const bucket = groups.get(year)
    if (bucket) {
      bucket.push(event)
    } else {
      groups.set(year, [event])
    }
  }
  return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))
}

const eventKey = (year: string, index: number): string => `${year}-${index}`

export const TimelineView: FC<Props> = ({ events, termNames }) => {
  const groups = groupByYear(events)
  const [openKeys, setOpenKeys] = useState<Set<string>>(
    () => new Set(groups.flatMap(([year, yearEvents]) => yearEvents.map((_, i) => eventKey(year, i)))),
  )

  const toggle = (key: string) => {
    setOpenKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <div style={{ borderLeft: "2px solid var(--color-border)", paddingLeft: "1.5rem" }}>
      {groups.map(([year, yearEvents]) => (
        <div key={year} style={{ marginBottom: "2rem" }}>
          <p
            style={{
              color: "var(--color-accent-bright)",
              fontSize: "1.1rem",
              fontWeight: 600,
              marginBottom: "1rem",
              marginLeft: "-2.15rem",
            }}
          >
            {year}
          </p>
          {yearEvents.map((event, i) => {
            const key = eventKey(year, i)
            const open = openKeys.has(key)
            return (
              <div key={key} style={{ marginBottom: "1rem", position: "relative" }}>
                <span
                  style={{
                    background: "var(--color-accent)",
                    borderRadius: "50%",
                    height: ".5rem",
                    left: "-1.9rem",
                    position: "absolute",
                    top: ".4rem",
                    width: ".5rem",
                  }}
                />
                <button
                  aria-expanded={open}
                  onClick={() => toggle(key)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "inherit",
                    cursor: "pointer",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: ".25rem .75rem",
                    padding: 0,
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      color: "var(--color-text-muted)",
                      flexShrink: 0,
                      fontSize: ".8rem",
                      width: "5.5rem",
                    }}
                  >
                    {event.date}
                  </span>
                  <span style={{ fontWeight: 600 }}>{event.title}</span>
                </button>
                {open && (
                  <Card style={{ marginTop: ".625rem" }}>
                    <p style={{ margin: 0, whiteSpace: "pre-line" }}>{event.descriptionNode}</p>
                    {event.organizations && event.organizations.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: ".375rem",
                          marginTop: ".75rem",
                        }}
                      >
                        {event.organizations.map((org) => (
                          <Badge key={org}>{org}</Badge>
                        ))}
                      </div>
                    )}
                    {event.relatedTerms && event.relatedTerms.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: ".375rem",
                          marginTop: ".75rem",
                        }}
                      >
                        {event.relatedTerms.map((slug) => (
                          <Link
                            key={slug}
                            href={`/terms/${slug}/`}
                            style={{ color: "inherit", textDecoration: "none" }}
                          >
                            <Badge>{termNames[slug] ?? slug}</Badge>
                          </Link>
                        ))}
                      </div>
                    )}
                    {event.references && event.references.length > 0 && (
                      <ul style={{ marginTop: ".75rem", paddingLeft: "1.25rem" }}>
                        {event.references.map((reference) => (
                          <li key={reference.url} style={{ marginBottom: ".25rem" }}>
                            <a
                              href={reference.url}
                              rel="noreferrer"
                              style={{ color: "var(--color-accent-bright)" }}
                              target="_blank"
                            >
                              {reference.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
