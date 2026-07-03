import { createLinter, loadTextlintrc } from "textlint"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const termsPath = path.join(rootDir, "data/terms.json")

const terms = JSON.parse(await readFile(termsPath, "utf-8"))

const extractFields = (term) => {
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

const descriptor = await loadTextlintrc({ cwd: rootDir })
const linter = createLinter({ descriptor })

let totalErrors = 0

for (const term of terms) {
  for (const [fieldPath, text] of extractFields(term)) {
    const virtualPath = `terms.json#${term.slug}.${fieldPath}.md`
    const result = await linter.lintText(text, virtualPath)
    if (result.messages.length > 0) {
      totalErrors += result.messages.length
      console.log(`\n${term.slug} / ${fieldPath}`)
      for (const m of result.messages) {
        console.log(`  L${m.line}:${m.column} ${m.message} (${m.ruleId})`)
      }
    }
  }
}

if (totalErrors > 0) {
  console.log(`\n${totalErrors} 件の指摘`)
  process.exit(1)
} else {
  console.log("問題なし")
}
