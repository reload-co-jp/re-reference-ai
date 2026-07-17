import { NextResponse } from "next/server"
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE_JA, SITE_URL } from "lib/site"
import { categories, getCategorySlug, getTermsByCategory } from "lib/terms"

export const dynamic = "force-static"

const buildLlmsTxt = (): string => {
  const sections = categories.map((category) => {
    const items = getTermsByCategory(category)
      .map((term) => `- [${term.name}](${SITE_URL}/terms/${term.slug}/): ${term.tagline}`)
      .join("\n")
    return `## ${category}\n\n${items}`
  })

  return [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_TAGLINE_JA} — ${SITE_DESCRIPTION}`,
    "",
    `各用語ページはMarkdown版を \`/terms/<slug>/markdown\` で提供する。`,
    "",
    `- [用語一覧](${SITE_URL}/)`,
    `- [年表](${SITE_URL}/timeline/)`,
    `- [比較](${SITE_URL}/compare/)`,
    ...categories.map(
      (category) => `- [${category}](${SITE_URL}/categories/${getCategorySlug(category)}/)`,
    ),
    "",
    ...sections,
    "",
  ].join("\n")
}

export const GET = (): NextResponse =>
  new NextResponse(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
