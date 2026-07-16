import { createLinter, loadTextlintrc } from "textlint"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

const readJson = async (relativePath) => {
  const filePath = path.join(rootDir, relativePath)
  return JSON.parse(await readFile(filePath, "utf-8"))
}

const extractTermFields = (term) => {
  const fields = [
    ["tagline", term.tagline],
    ["summary", term.summary],
    ["background", term.background],
    ["history", term.history],
    ["architecture", term.architecture],
    ["workflow", term.workflow],
  ]

  for (const [i, v] of (term.advantages ?? []).entries()) fields.push([`advantages[${i}]`, v])
  for (const [i, v] of (term.disadvantages ?? []).entries()) fields.push([`disadvantages[${i}]`, v])
  for (const [i, c] of (term.comparisons ?? []).entries()) fields.push([`comparisons[${i}].note`, c.note])
  for (const [i, f] of (term.faq ?? []).entries()) {
    fields.push([`faq[${i}].question`, f.question])
    fields.push([`faq[${i}].answer`, f.answer])
  }

  return fields.filter(([, v]) => typeof v === "string" && v.length > 0)
}

const extractTimelineFields = (timeline) => {
  const fields = [["description", timeline.description]]

  for (const [i, e] of (timeline.events ?? []).entries()) {
    fields.push([`events[${i}].title`, e.title])
    fields.push([`events[${i}].description`, e.description])
  }
  for (const [i, f] of (timeline.faq ?? []).entries()) {
    fields.push([`faq[${i}].question`, f.question])
    fields.push([`faq[${i}].answer`, f.answer])
  }

  return fields.filter(([, v]) => typeof v === "string" && v.length > 0)
}

const extractComparisonFields = (comparison) => {
  const fields = [["summary", comparison.summary], ["migration", comparison.migration]]

  for (const [i, v] of (comparison.quickSummary ?? []).entries()) fields.push([`quickSummary[${i}]`, v])
  for (const [i, r] of (comparison.table ?? []).entries()) {
    fields.push([`table[${i}].left`, r.left])
    fields.push([`table[${i}].right`, r.right])
  }
  if (comparison.architecture) {
    fields.push(["architecture.left", comparison.architecture.left])
    fields.push(["architecture.right", comparison.architecture.right])
  }
  if (comparison.advantages) {
    for (const [i, v] of comparison.advantages.left.entries()) fields.push([`advantages.left[${i}]`, v])
    for (const [i, v] of comparison.advantages.right.entries()) fields.push([`advantages.right[${i}]`, v])
  }
  if (comparison.disadvantages) {
    for (const [i, v] of comparison.disadvantages.left.entries())
      fields.push([`disadvantages.left[${i}]`, v])
    for (const [i, v] of comparison.disadvantages.right.entries())
      fields.push([`disadvantages.right[${i}]`, v])
  }
  if (comparison.bestUseCases) {
    fields.push(["bestUseCases.left", comparison.bestUseCases.left])
    fields.push(["bestUseCases.right", comparison.bestUseCases.right])
  }
  for (const [i, f] of (comparison.faq ?? []).entries()) {
    fields.push([`faq[${i}].question`, f.question])
    fields.push([`faq[${i}].answer`, f.answer])
  }

  return fields.filter(([, v]) => typeof v === "string" && v.length > 0)
}

const descriptor = await loadTextlintrc({ cwd: rootDir })
const linter = createLinter({ descriptor })

let totalErrors = 0

const lintEntries = async (entries, virtualPrefix, extractFields) => {
  for (const entry of entries) {
    for (const [fieldPath, text] of extractFields(entry)) {
      const virtualPath = `${virtualPrefix}#${entry.slug}.${fieldPath}.md`
      const result = await linter.lintText(text, virtualPath)
      if (result.messages.length > 0) {
        totalErrors += result.messages.length
        console.log(`\n${entry.slug} / ${fieldPath}`)
        for (const m of result.messages) {
          console.log(`  L${m.line}:${m.column} ${m.message} (${m.ruleId})`)
        }
      }
    }
  }
}

const terms = await readJson("data/terms.json")
const timelines = await readJson("data/timelines.json")
const comparisons = await readJson("data/comparisons.json")

await lintEntries(terms, "terms.json", extractTermFields)
await lintEntries(timelines, "timelines.json", extractTimelineFields)
await lintEntries(comparisons, "comparisons.json", extractComparisonFields)

if (totalErrors > 0) {
  console.log(`\n${totalErrors} 件の指摘`)
  process.exit(1)
} else {
  console.log("問題なし")
}
