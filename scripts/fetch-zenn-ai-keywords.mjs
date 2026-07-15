import { readFile, writeFile } from "node:fs/promises"

const PAGES = 5
const COUNT_PER_PAGE = 100
const TOP_N = 50

const terms = JSON.parse(await readFile("data/terms.json", "utf8"))
const knownKeywords = new Set(
  terms.flatMap((term) => [term.name, ...(term.aliases ?? []), ...(term.tags ?? [])]).map((s) => s.toLowerCase()),
)

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const fetchPage = async (page) => {
  const url = `https://zenn.dev/api/articles?topicname=ai&order=latest&count=${COUNT_PER_PAGE}&page=${page}`
  const response = await fetch(url, { headers: { accept: "application/json" } })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: page ${page}`)
  const data = await response.json()
  return data.articles ?? []
}

const fetchLatestArticles = async () => {
  const articles = []
  for (let page = 1; page <= PAGES; page += 1) {
    const pageArticles = await fetchPage(page)
    if (pageArticles.length === 0) break
    articles.push(...pageArticles)
    await sleep(150)
  }
  return articles
}

// カタカナ連続語(3文字以上)・英単語(2文字以上)をキーワード候補として抽出
const KATAKANA_RE = /[ァ-ー]{3,}/g
const LATIN_RE = /[A-Za-z][A-Za-z0-9.+-]{1,}/g

const STOPWORDS = new Set(["AI", "IT", "API", "Web", "OSS", "SDK", "CLI", "UI", "URL", "ver", "vs"].map((s) => s.toLowerCase()))

const extractKeywords = (title) => {
  const katakana = title.match(KATAKANA_RE) ?? []
  const latin = title.match(LATIN_RE) ?? []
  return [...katakana, ...latin]
}

const articles = await fetchLatestArticles()
console.log(`fetched ${articles.length} articles`)

const keywordStats = new Map()

for (const article of articles) {
  const url = `https://zenn.dev${article.path}`
  for (const rawKeyword of extractKeywords(article.title)) {
    const keyword = rawKeyword.trim()
    const normalized = keyword.toLowerCase()
    if (normalized.length < 2) continue
    if (STOPWORDS.has(normalized)) continue
    if (knownKeywords.has(normalized)) continue

    const stat = keywordStats.get(normalized) ?? { keyword, count: 0, samples: [] }
    stat.count += 1
    if (stat.samples.length < 3 && !stat.samples.some((sample) => sample.url === url)) {
      stat.samples.push({ title: article.title, url })
    }
    keywordStats.set(normalized, stat)
  }
}

const ranked = [...keywordStats.values()]
  .filter((stat) => stat.count >= 2)
  .sort((a, b) => b.count - a.count)
  .slice(0, TOP_N)

const result = {
  generatedAt: new Date().toISOString(),
  articleCount: articles.length,
  keywords: ranked,
}

await writeFile("data/zenn-ai-keywords.json", `${JSON.stringify(result, null, 2)}\n`)

console.log(`top keywords (${ranked.length}):`)
for (const { keyword, count } of ranked) {
  console.log(`${count}\t${keyword}`)
}
