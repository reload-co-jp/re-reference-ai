import { SITE_URL } from "lib/site"
import { getTermBySlug, Term } from "lib/terms"

const heading = (title: string, level = 2): string => `${"#".repeat(level)} ${title}\n`

const list = (items: string[]): string => items.map((item) => `- ${item}`).join("\n")

export const termToMarkdown = (term: Term): string => {
  const url = `${SITE_URL}/terms/${term.slug}/`
  const sections: string[] = []

  sections.push(`# ${term.name}とは\n`)
  if (term.aliases && term.aliases.length > 0) {
    sections.push(`別名: ${term.aliases.join(" / ")}\n`)
  }
  sections.push(`> ${term.tagline}\n`)
  sections.push(`カテゴリ: ${term.category}\nタグ: ${term.tags.join(", ")}\nURL: ${url}\n`)

  if (term.plainSummary) {
    sections.push(`${heading("ひとことで言うと")}\n${term.plainSummary}\n`)
  }
  if (term.summary) {
    sections.push(`${heading("概要")}\n${term.summary}\n`)
  }
  if (term.background) {
    sections.push(`${heading("背景")}\n${term.background}\n`)
  }
  if (term.history) {
    sections.push(`${heading("歴史")}\n${term.history}\n`)
  }
  if (term.architecture) {
    sections.push(`${heading("アーキテクチャ")}\n${term.architecture}\n`)
  }
  if (term.workflow) {
    sections.push(`${heading("ワークフロー")}\n${term.workflow}\n`)
  }
  if (term.codeExamples && term.codeExamples.length > 0) {
    const examples = term.codeExamples
      .map((example) => `${example.title}\n\n\`\`\`${example.language}\n${example.code}\n\`\`\``)
      .join("\n\n")
    sections.push(`${heading("コード例")}\n${examples}\n`)
  }
  if (term.advantages && term.advantages.length > 0) {
    sections.push(`${heading("利点")}\n${list(term.advantages)}\n`)
  }
  if (term.disadvantages && term.disadvantages.length > 0) {
    sections.push(`${heading("欠点")}\n${list(term.disadvantages)}\n`)
  }
  if (term.comparisons && term.comparisons.length > 0) {
    const items = term.comparisons
      .map((comparison) => {
        const target = getTermBySlug(comparison.slug)
        if (!target) return null
        return `${target.name} — ${comparison.note}`
      })
      .filter((item): item is string => Boolean(item))
    if (items.length > 0) {
      sections.push(`${heading("比較")}\n${list(items)}\n`)
    }
  }
  if (term.relatedTerms && term.relatedTerms.length > 0) {
    const items = term.relatedTerms
      .map((slug) => getTermBySlug(slug))
      .filter((related): related is Term => Boolean(related))
      .map((related) => `[${related.name}](${SITE_URL}/terms/${related.slug}/)`)
    if (items.length > 0) {
      sections.push(`${heading("関連用語")}\n${list(items)}\n`)
    }
  }
  if (term.faq && term.faq.length > 0) {
    const items = term.faq.map((item) => `**Q. ${item.question}**\n\nA. ${item.answer}`).join("\n\n")
    sections.push(`${heading("よくある質問")}\n${items}\n`)
  }
  if (term.references && term.references.length > 0) {
    const items = term.references.map((reference) => `[${reference.label}](${reference.url}) (${reference.type})`)
    sections.push(`${heading("参考文献")}\n${list(items)}\n`)
  }

  return sections.join("\n")
}
