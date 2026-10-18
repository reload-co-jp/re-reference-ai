// data/*.json の用語データを機械的に品質監査し、用語ごとに問題点と修正候補を一覧化する。
// データは書き換えない(修正は根拠を確認したうえで人手で行う)。
// 使い方: pnpm audit:terms [--json] [--slug <slug>] [--rule <rule>]
import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const MIN_TAGLINE = 15
const MIN_SUMMARY = 80
const MIN_DESCRIPTION_TOTAL = 200

// 断定・誇張・曖昧表現。事実として裏付けが必要、または情報量のない言い回し
const VAGUE_PATTERNS = [
  /必ず(?!しも)/,
  /絶対に/,
  /最強/,
  /圧倒的/,
  /革命的/,
  /唯一の/,
  /完璧/,
  /誰でも簡単/,
  /と言われている/,
  /とされることもある/,
  /など様々/,
  /さまざまな面で/,
]

// 時間経過で古くなりやすい記述
const VOLATILE_PATTERNS = [/最新/, /現時点/, /現在[はの]/, /\d{4}年\d{1,2}月時点/, /\d{4}年時点/]

const TEXT_FIELDS = ["plainSummary", "summary", "background", "history", "architecture", "workflow"]

const termTexts = (term) => [
  ...TEXT_FIELDS.map((field) => [field, term[field]]),
  ...(term.advantages ?? []).map((v, i) => [`advantages[${i}]`, v]),
  ...(term.disadvantages ?? []).map((v, i) => [`disadvantages[${i}]`, v]),
  ...(term.faq ?? []).map((f, i) => [`faq[${i}].answer`, f.answer]),
].filter(([, v]) => typeof v === "string" && v.length > 0)

const normalize = (text) => text.replace(/[\s、。・,.()（）「」]/g, "").toLowerCase()

export const auditTerms = ({ terms, tagDescriptions = {}, comparisons = [], timelines = [], articles = [] }) => {
  const issues = []
  const add = (slug, rule, message, suggestion) => issues.push({ slug, rule, message, suggestion })
  const slugs = new Set(terms.map((t) => t.slug))

  // 名称・別名の索引(大文字小文字無視)
  const nameOwners = new Map()
  for (const term of terms) {
    for (const name of new Set([term.name, ...(term.aliases ?? [])].map((n) => n.toLowerCase()))) {
      nameOwners.set(name, [...(nameOwners.get(name) ?? []), term.slug])
    }
  }

  // 説明文の重複検出用
  const textOwners = new Map()
  for (const term of terms) {
    for (const field of ["tagline", "plainSummary", "summary"]) {
      if (!term[field]) continue
      const key = normalize(term[field])
      textOwners.set(key, [...(textOwners.get(key) ?? []), `${term.slug}.${field}`])
    }
  }

  const tagCounts = new Map()
  terms.forEach((t) => t.tags.forEach((tag) => tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)))

  for (const term of terms) {
    const { slug } = term

    // 定義・概要の欠落/過少
    if (!term.tagline || term.tagline.length < MIN_TAGLINE)
      add(slug, "short-definition", `tagline が短い(${term.tagline?.length ?? 0}字)`, "対象・目的・特徴が分かる一文に補う")
    if (!term.summary)
      add(slug, "missing-summary", "summary(概要)がない", "公式資料を確認し概要を追加する")
    else if (term.summary.length < MIN_SUMMARY)
      add(slug, "short-summary", `summary が短い(${term.summary.length}字)`, "定義・用途・前提条件を補う")
    const total = termTexts(term).reduce((sum, [, v]) => sum + v.length, 0)
    if (total < MIN_DESCRIPTION_TOTAL)
      add(slug, "thin-content", `本文の総量が少ない(${total}字)`, "利用例・利点・制約・混同しやすい用語を根拠付きで追加する")

    // 名称・別名の不整合
    const aliases = term.aliases ?? []
    if (aliases.includes(term.name)) add(slug, "alias-equals-name", `aliases に name「${term.name}」が含まれる`, "aliases から削除する")
    const lowered = aliases.map((a) => a.toLowerCase())
    const dupAliases = lowered.filter((a, i) => lowered.indexOf(a) !== i)
    if (dupAliases.length) add(slug, "duplicate-alias", `aliases が重複: ${[...new Set(dupAliases)].join(", ")}`, "重複を削除する")
    for (const alias of [term.name, ...aliases]) {
      if (/^\s|\s$/.test(alias)) add(slug, "name-whitespace", `前後に空白: 「${alias}」`, "空白を削除する")
      const owners = (nameOwners.get(alias.toLowerCase()) ?? []).filter((s) => s !== slug)
      if (owners.length)
        add(slug, "ambiguous-name", `「${alias}」が他の用語(${owners.join(", ")})の名称/別名と重複`, "別名を整理し、別概念なら混同しやすい用語として相互に比較へ記載する")
    }

    // 関連・比較リンク
    for (const ref of term.relatedTerms ?? []) {
      if (!slugs.has(ref)) add(slug, "broken-related", `relatedTerms の「${ref}」が存在しない`, "実在するslugに修正するか削除する")
      if (ref === slug) add(slug, "self-related", "relatedTerms に自身が含まれる", "削除する")
    }
    for (const c of term.comparisons ?? []) {
      if (!slugs.has(c.slug)) add(slug, "broken-comparison", `comparisons の「${c.slug}」が存在しない`, "実在するslugに修正するか削除する")
      if (!c.note?.trim()) add(slug, "empty-comparison-note", `comparisons「${c.slug}」の note が空`, "相違点を記述する")
    }
    const relDup = (term.relatedTerms ?? []).filter((s, i, a) => a.indexOf(s) !== i)
    if (relDup.length) add(slug, "duplicate-related", `relatedTerms が重複: ${relDup.join(", ")}`, "重複を削除する")

    // 出典
    const references = term.references ?? []
    if (references.length === 0) add(slug, "missing-references", "references(出典)がない", "公式ドキュメント・論文などの一次情報を追加する")
    for (const r of references) {
      if (!r.url) add(slug, "reference-without-url", `参考資料「${r.label}」に URL がない`, "URL を追加する")
      else if (!/^https:\/\//.test(r.url)) add(slug, "reference-url-scheme", `参考資料 URL が https でない: ${r.url}`, "https の正規URLを確認する")
    }

    // 古くなりやすい記述と更新確認日
    if (!term.updatedAt) {
      const volatile = termTexts(term).find(([, v]) => VOLATILE_PATTERNS.some((p) => p.test(v)))
      if (volatile)
        add(slug, "volatile-without-date", `${volatile[0]} に時点依存の記述があるが updatedAt がない`, "内容を確認した日を updatedAt に記録する(未確認のまま日付だけ更新しない)")
    }

    // 断定・曖昧表現
    for (const [field, value] of termTexts(term)) {
      const hit = VAGUE_PATTERNS.map((p) => value.match(p)?.[0]).filter(Boolean)
      if (hit.length) add(slug, "vague-or-assertive", `${field}: 「${[...new Set(hit)].join("」「")}」`, "条件・出典を明示するか具体的な表現に改める")
    }

    // カテゴリ・タグ
    for (const tag of term.tags) {
      if (!tagDescriptions[tag] && (tagCounts.get(tag) ?? 0) < 2)
        add(slug, "orphan-tag", `タグ「${tag}」は他の用語で使われず説明もない`, "既存タグへの統合を検討する")
    }
    if (term.tags.length === 0) add(slug, "no-tags", "tags が空", "内容に合う既存タグを付与する")
  }

  // 重複説明
  for (const [, owners] of textOwners) {
    if (owners.length < 2) continue
    for (const owner of owners) {
      const [slug, field] = owner.split(".")
      add(slug, "duplicate-text", `${field} が ${owners.filter((o) => o !== owner).join(", ")} と同一`, "用語固有の説明に書き分ける")
    }
  }

  // 他コンテンツからの参照切れ
  const checkRef = (source, ref) => {
    if (!slugs.has(ref)) add(source, "broken-content-ref", `用語「${ref}」が存在しない`, "実在するslugに修正するか削除する")
  }
  for (const c of comparisons) {
    checkRef(`compare/${c.slug}`, c.left)
    checkRef(`compare/${c.slug}`, c.right)
  }
  for (const tl of timelines) {
    for (const ref of [...(tl.targetTerms ?? []), ...(tl.relatedTerms ?? []), ...tl.events.flatMap((e) => e.relatedTerms ?? [])])
      checkRef(`timeline/${tl.slug}`, ref)
    tl.events.forEach((e, i) => {
      if (!e.references?.length) add(`timeline/${tl.slug}`, "event-without-source", `events[${i}]「${e.title}」に根拠がない`, "一次情報の URL を追加する")
    })
  }
  for (const a of articles) {
    for (const ref of [...a.modelSlugs, ...(a.relatedTerms ?? []), ...(a.sections ?? []).flatMap((s) => s.terms ?? [])])
      checkRef(`articles/${a.slug}`, ref)
  }

  return issues
}

const main = () => {
  const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
  const read = (file) => JSON.parse(readFileSync(path.join(root, "data", file), "utf8"))
  const args = process.argv.slice(2)
  const option = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined)

  let issues = auditTerms({
    terms: read("terms.json"),
    tagDescriptions: read("tag-descriptions.json"),
    comparisons: read("comparisons.json"),
    timelines: read("timelines.json"),
    articles: read("articles.json"),
  })
  if (option("--slug")) issues = issues.filter((i) => i.slug === option("--slug"))
  if (option("--rule")) issues = issues.filter((i) => i.rule === option("--rule"))

  if (args.includes("--json")) {
    console.log(JSON.stringify(issues, null, 2))
    return
  }

  const bySlug = Map.groupBy(issues, (i) => i.slug)
  for (const [slug, list] of bySlug) {
    console.log(`\n${slug}`)
    list.forEach((i) => console.log(`  [${i.rule}] ${i.message}\n    → ${i.suggestion}`))
  }
  const byRule = Map.groupBy(issues, (i) => i.rule)
  console.log(`\n${issues.length} issues / ${bySlug.size} targets`)
  ;[...byRule].sort((a, b) => b[1].length - a[1].length).forEach(([rule, list]) => console.log(`  ${rule}: ${list.length}`))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
