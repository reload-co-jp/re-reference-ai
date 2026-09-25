// Static export (out/) を走査し、内部リンク切れ・SEOメタデータ欠落・canonical重複を検出する。
// 使い方: pnpm build && pnpm check:seo
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const OUT_DIR = "out"
const SITE_URL = "https://rra.reload.co.jp"

if (!existsSync(OUT_DIR)) {
  console.error(`${OUT_DIR}/ がない。先に pnpm build を実行する。`)
  process.exit(1)
}

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return name === "_next" ? [] : walk(path)
    return [path]
  })

const htmlFiles = walk(OUT_DIR).filter(
  (path) =>
    path.endsWith(".html") &&
    !/(^|\/)(404|_not-found)(\/|\.html)/.test(relative(OUT_DIR, path))
)

const decode = (value) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")

const getMeta = (html, attr, key) => {
  const match =
    html.match(
      new RegExp(`<meta[^>]*${attr}="${key}"[^>]*content="([^"]*)"`)
    ) ??
    html.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${key}"`))
  return match ? decode(match[1]) : undefined
}

const pagePathFromFile = (file) => {
  const rel = relative(OUT_DIR, file).replace(/\\/g, "/")
  if (rel === "index.html") return "/"
  return `/${rel.replace(/index\.html$/, "").replace(/\.html$/, "")}`
}

const resolveInternal = (href) => {
  const path = decodeURIComponent(href.split(/[?#]/)[0])
  if (!path || path === "/") return join(OUT_DIR, "index.html")
  const candidates = [
    join(OUT_DIR, path),
    join(OUT_DIR, path, "index.html"),
    join(OUT_DIR, `${path.replace(/\/$/, "")}.html`),
  ]
  return candidates.find(
    (candidate) => existsSync(candidate) && statSync(candidate).isFile()
  )
}

const errors = []
const warnings = []
const canonicals = new Map()
const noindexPaths = new Set()

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8")
  const pagePath = pagePathFromFile(file)
  const report = (list, message) => list.push(`${pagePath}: ${message}`)

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]
  const description = getMeta(html, "name", "description")
  const robots = getMeta(html, "name", "robots") ?? ""
  const canonical = html.match(
    /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/
  )?.[1]
  const noindex = robots.includes("noindex")

  if (noindex) noindexPaths.add(pagePath)

  if (!title?.trim()) report(errors, "missing title")
  else if ((title.match(/Re Reference AI/g) ?? []).length > 1)
    report(errors, `duplicated site name in title: ${title}`)
  if (!description?.trim()) report(errors, "missing description")

  if (!noindex) {
    if (!canonical) report(errors, "missing canonical")
    else {
      const expected = `${SITE_URL}${pagePath}`
      if (
        canonical !== expected &&
        !(pagePath === "/" && canonical === SITE_URL)
      )
        report(
          errors,
          `canonical mismatch: ${canonical} (expected ${expected})`
        )
      const seen = canonicals.get(canonical)
      if (seen) report(errors, `duplicate canonical with ${seen}: ${canonical}`)
      else canonicals.set(canonical, pagePath)
    }
    for (const key of [
      "og:title",
      "og:description",
      "og:url",
      "og:type",
      "og:image",
    ]) {
      if (!getMeta(html, "property", key)) report(errors, `missing ${key}`)
    }
  }

  const hrefs = [...html.matchAll(/<a[^>]*\shref="([^"]+)"/g)].map((match) =>
    decode(match[1])
  )
  for (const href of new Set(hrefs)) {
    const internal = href.startsWith(SITE_URL)
      ? href.slice(SITE_URL.length) || "/"
      : href
    if (!internal.startsWith("/") || internal.startsWith("//")) continue
    if (!resolveInternal(internal))
      report(errors, `broken internal link: ${href}`)
    else if (
      !internal.split(/[?#]/)[0].endsWith("/") &&
      !/\.[a-z0-9]+$/i.test(internal.split(/[?#]/)[0])
    )
      report(warnings, `link without trailing slash: ${href}`)
  }
}

const sitemapPath = join(OUT_DIR, "sitemap.xml")
if (!existsSync(sitemapPath)) errors.push("sitemap.xml: missing")
else {
  const urls = [
    ...readFileSync(sitemapPath, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g),
  ].map((match) => match[1])
  const seen = new Set()
  for (const url of urls) {
    const path = url.slice(SITE_URL.length) || "/"
    if (seen.has(url)) errors.push(`sitemap.xml: duplicate url ${url}`)
    seen.add(url)
    if (!resolveInternal(path)) errors.push(`sitemap.xml: url not found ${url}`)
    if (noindexPaths.has(path))
      errors.push(`sitemap.xml: noindex page listed ${url}`)
  }
  for (const [canonical, pagePath] of canonicals) {
    if (!seen.has(canonical) && !(pagePath === "/" && seen.has(`${SITE_URL}/`)))
      warnings.push(`sitemap.xml: indexable page not listed ${canonical}`)
  }
}

if (!existsSync(join(OUT_DIR, "robots.txt"))) errors.push("robots.txt: missing")

warnings.forEach((warning) => console.warn(`warn  ${warning}`))
errors.forEach((error) => console.error(`error ${error}`))
console.log(
  `\nchecked ${htmlFiles.length} pages: ${errors.length} errors, ${warnings.length} warnings`
)
process.exit(errors.length > 0 ? 1 : 0)
