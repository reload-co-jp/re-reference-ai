import { FaqItem, Reference } from "lib/terms"

export type TimelineEvent = {
  date: string
  title: string
  description: string
  organizations?: string[]
  references?: Reference[]
  relatedTerms?: string[]
}

export type TimelineVersion = {
  version: string
  date: string
  note?: string
}

export type Timeline = {
  slug: string
  title: string
  description: string
  category: string
  targetTerms?: string[]
  events: TimelineEvent[]
  majorVersions?: TimelineVersion[]
  relatedTerms?: string[]
  faq?: FaqItem[]
  references?: Reference[]
  updatedAt?: string
}

import timelinesData from "data/timelines.json"

export const timelines = timelinesData as Timeline[]

export type TimelineSummaryCard = Pick<
  Timeline,
  "slug" | "title" | "description" | "category" | "events"
>

export const timelineSummaries: TimelineSummaryCard[] = timelines.map(
  ({ slug, title, description, category, events }) => ({
    slug,
    title,
    description,
    category,
    events,
  }),
)

export const getTimelineBySlug = (slug: string): Timeline | undefined =>
  timelines.find((timeline) => timeline.slug === slug)

export const getTimelinesForTerm = (termSlug: string): Timeline[] =>
  timelines.filter(
    (timeline) =>
      timeline.targetTerms?.includes(termSlug) ||
      timeline.relatedTerms?.includes(termSlug) ||
      timeline.events.some((event) => event.relatedTerms?.includes(termSlug)),
  )

export const getEventYearRange = (timeline: Timeline): string => {
  const years = timeline.events
    .map((event) => event.date.slice(0, 4))
    .filter(Boolean)
    .sort()
  if (years.length === 0) return ""
  const first = years[0]
  const last = years[years.length - 1]
  return first === last ? first : `${first} - ${last}`
}
