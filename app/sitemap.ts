import { MetadataRoute } from "next"
import { comparisons } from "lib/comparisons"
import { SITE_URL } from "lib/site"
import { categories, getAllTags, getCategorySlug, getTagSlug, getTermsByTag, terms } from "lib/terms"
import { timelines } from "lib/timelines"

export const dynamic = "force-static"

const MIN_TERMS_FOR_INDEX = 3

const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: `${SITE_URL}/`,
    changeFrequency: "weekly",
    priority: 1,
  },
  ...categories.map((category) => ({
    url: `${SITE_URL}/categories/${getCategorySlug(category)}/`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  })),
  ...getAllTags()
    .filter((tag) => getTermsByTag(tag).length >= MIN_TERMS_FOR_INDEX)
    .map((tag) => ({
      url: `${SITE_URL}/tags/${getTagSlug(tag)}/`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ...terms.map((term) => ({
    url: `${SITE_URL}/terms/${term.slug}/`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
  {
    url: `${SITE_URL}/timeline/`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  },
  ...timelines.map((timeline) => ({
    url: `${SITE_URL}/timeline/${timeline.slug}/`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  })),
  {
    url: `${SITE_URL}/compare/`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  },
  ...comparisons.map((comparison) => ({
    url: `${SITE_URL}/compare/${comparison.slug}/`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  })),
]

export default sitemap
