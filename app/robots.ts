import { MetadataRoute } from "next"
import { SITE_URL } from "lib/site"

export const dynamic = "force-static"

const AI_CRAWLER_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "GoogleOther",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "Meta-ExternalAgent",
]

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: "*",
      allow: "/",
    },
    {
      userAgent: AI_CRAWLER_USER_AGENTS,
      allow: "/",
    },
  ],
  sitemap: `${SITE_URL}/sitemap.xml`,
})

export default robots
