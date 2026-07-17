import { readFile } from "node:fs/promises"

const TOP_N = Number(process.env.TOP_N ?? 30)
const jsonOutput = process.argv.includes("--json")

const terms = JSON.parse(await readFile("data/terms.json", "utf8"))
const comparisons = JSON.parse(await readFile("data/comparisons.json", "utf8"))
const zennKeywords = JSON.parse(await readFile("data/zenn-ai-keywords.json", "utf8"))

const bySlug = new Map(terms.map((term) => [term.slug, term]))

const existingPairs = new Set(comparisons.flatMap((c) => [`${c.left}|${c.right}`, `${c.right}|${c.left}`]))

const zennKeywordSet = new Set(zennKeywords.keywords.map((k) => k.keyword.toLowerCase()))

const mentionsInZenn = (term) => {
  const names = [term.name, ...(term.aliases ?? [])].map((s) => s.toLowerCase())
  return names.some((name) => zennKeywordSet.has(name))
}

// 一方の name が他方の summary/tagline に出現する場合、包含関係(構成要素 vs 全体)の疑いとして減点する
const looksContained = (a, b) => {
  const haystack = `${b.summary ?? ""} ${b.tagline ?? ""}`.toLowerCase()
  return haystack.includes(a.name.toLowerCase())
}

const PRIORITY_CATEGORIES = new Set(["モデル", "エージェント"])

const pairs = new Map()

for (const term of terms) {
  for (const relatedSlug of term.relatedTerms ?? []) {
    const other = bySlug.get(relatedSlug)
    if (!other) continue
    if (!(other.relatedTerms ?? []).includes(term.slug)) continue
    if (term.category !== other.category) continue

    const key = [term.slug, relatedSlug].sort().join("|")
    if (pairs.has(key)) continue
    if (existingPairs.has(key)) continue

    const [leftSlug, rightSlug] = key.split("|")
    const left = bySlug.get(leftSlug)
    const right = bySlug.get(rightSlug)

    const sharedTags = (left.tags ?? []).filter((tag) => (right.tags ?? []).includes(tag))

    let score = 0
    const breakdown = []

    const tagScore = sharedTags.length * 2
    if (tagScore > 0) {
      score += tagScore
      breakdown.push(`共有タグ${sharedTags.length}件:+${tagScore}`)
    }

    if (looksContained(left, right) || looksContained(right, left)) {
      score -= 2
      breakdown.push("包含関係疑い:-2")
    }

    if (PRIORITY_CATEGORIES.has(left.category)) {
      score += 3
      breakdown.push(`カテゴリ${left.category}:+3`)
    }

    const zennHits = [mentionsInZenn(left), mentionsInZenn(right)].filter(Boolean).length
    if (zennHits > 0) {
      const zennScore = zennHits * 2
      score += zennScore
      breakdown.push(`Zenn言及${zennHits}件:+${zennScore}`)
    }

    pairs.set(key, {
      left: leftSlug,
      right: rightSlug,
      category: left.category,
      score,
      breakdown,
    })
  }
}

const ranked = [...pairs.values()].sort((a, b) => b.score - a.score).slice(0, TOP_N)

if (jsonOutput) {
  console.log(JSON.stringify(ranked, null, 2))
} else {
  console.log(`候補ペア: 全${pairs.size}件中、上位${ranked.length}件\n`)
  for (const p of ranked) {
    console.log(`${p.score}\t${p.left} vs ${p.right}\t[${p.category}]\t${p.breakdown.join(" ")}`)
  }
}
