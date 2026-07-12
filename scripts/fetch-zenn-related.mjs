import { readFile, writeFile } from "node:fs/promises"

const terms = JSON.parse(await readFile("data/terms.json", "utf8"))
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const buildQueries = (term) => {
  const names = [term.name, ...(term.aliases ?? [])].filter(Boolean)
  const tags = (term.tags ?? []).slice(0, 3)
  return [
    ...names,
    ...names.map((name) => `${name} 入門`),
    ...names.map((name) => `${name} とは`),
    ...names.map((name) => `${name} LLM`),
    ...tags.map((tag) => `${term.name} ${tag}`),
    `${term.name} AI`,
    `${term.name} 機械学習`,
  ]
}

const scoreArticle = (term, article) => {
  const title = article.title.toLowerCase()
  const haystack = `${article.title} ${article.path}`.toLowerCase()
  const names = [term.name, ...(term.aliases ?? [])]
    .filter((token) => token && token.length > 1)
    .map((token) => token.toLowerCase())
  const tags = (term.tags ?? [])
    .filter((token) => token && token.length > 1)
    .map((token) => token.toLowerCase())
  const nameScore = names.reduce((sum, token) => {
    if (title.includes(token)) return sum + 120
    if (haystack.includes(token)) return sum + 45
    return sum
  }, 0)
  const tagScore = tags.reduce((sum, token) => sum + (title.includes(token) ? 18 : 0), 0)
  const contextScore = /ai|llm|機械学習|深層学習|生成ai|agent|エージェント/i.test(article.title)
    ? 12
    : 0
  const likeScore = Math.min(article.liked_count ?? 0, 200) / 5
  const bookmarkScore = Math.min(article.bookmarked_count ?? 0, 100) / 4
  const lengthScore = Math.min(article.body_letters_count ?? 0, 12000) / 1200
  return nameScore + tagScore + contextScore + likeScore + bookmarkScore + lengthScore
}

const search = async (query) => {
  const url = `https://zenn.dev/api/search?source=articles&q=${encodeURIComponent(query)}`
  const response = await fetch(url, { headers: { accept: "application/json" } })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${query}`)
  const data = await response.json()
  return data.articles ?? []
}

const collectArticles = async (term) => {
  const found = new Map()

  for (const query of buildQueries(term)) {
    const articles = await search(query)
    for (const article of articles) {
      if (!article.path || found.has(article.path)) continue
      found.set(article.path, article)
    }
    if (found.size >= 120) break
    await sleep(120)
  }

  return [...found.values()]
    .sort((a, b) => scoreArticle(term, b) - scoreArticle(term, a))
    .slice(0, 4)
    .map((article) => ({
      title: article.title,
      url: `https://zenn.dev${article.path}`,
    }))
}

const result = {}

for (const [index, term] of terms.entries()) {
  const articles = await collectArticles(term)
  result[term.slug] = articles
  console.log(`${index + 1}/${terms.length} ${term.slug}: ${articles.length}`)
  await sleep(180)
}

await writeFile("data/zenn-articles.json", `${JSON.stringify(result, null, 2)}\n`)
