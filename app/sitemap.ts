import { MetadataRoute } from "next"
import { SITE_URL } from "lib/site"
import { categories, getCategorySlug, terms } from "lib/terms"

export const dynamic = "force-static"

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
  ...terms.map((term) => ({
    url: `${SITE_URL}/terms/${term.slug}/`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
]

export default sitemap
