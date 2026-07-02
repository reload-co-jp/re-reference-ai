import { MetadataRoute } from "next"
import { SITE_URL } from "lib/site"
import { terms } from "lib/terms"

export const dynamic = "force-static"

const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: `${SITE_URL}/`,
    changeFrequency: "weekly",
    priority: 1,
  },
  ...terms.map((term) => ({
    url: `${SITE_URL}/terms/${term.slug}/`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
]

export default sitemap
