import { execFileSync } from "node:child_process"

type GitDates = { datePublished?: string; dateModified?: string }

const cache = new Map<string, GitDates>()

const runGitLog = (extraArgs: string[], filePath: string): string => {
  try {
    return execFileSync(
      "git",
      ["log", ...extraArgs, "--format=%aI", "--", filePath],
      { cwd: process.cwd(), encoding: "utf8" },
    ).trim()
  } catch {
    return ""
  }
}

export const getFileGitDates = (filePath: string): GitDates => {
  const cached = cache.get(filePath)
  if (cached) return cached

  const modified = runGitLog(["-1"], filePath)
  const added = runGitLog(["--diff-filter=A", "--follow", "--reverse"], filePath).split("\n")[0]
  const result: GitDates = {
    datePublished: added || modified || undefined,
    dateModified: modified || added || undefined,
  }
  cache.set(filePath, result)
  return result
}

let termDatesCache: Map<string, GitDates> | undefined

const toIsoDate = (epochSeconds: number): string =>
  new Date(epochSeconds * 1000).toISOString().slice(0, 10)

// data/terms.json を git blame し、slug行のコミット日を追加日、用語オブジェクト範囲内の最新コミット日を更新日とする
// (汎用行 "]," 等は blame が古いコミットに対応付けるため、最古日は追加日に使わない)
export const getTermGitDates = (slug: string): GitDates => {
  if (!termDatesCache) {
    termDatesCache = new Map()
    let output: string
    try {
      output = execFileSync("git", ["blame", "--line-porcelain", "--", "data/terms.json"], {
        cwd: process.cwd(),
        encoding: "utf8",
        maxBuffer: 256 * 1024 * 1024,
      })
    } catch {
      return {}
    }
    let currentSlug: string | undefined
    let time = 0
    let added = 0
    let max = 0
    const flush = () => {
      if (currentSlug && max > 0) {
        termDatesCache!.set(currentSlug, {
          datePublished: toIsoDate(added),
          dateModified: toIsoDate(max),
        })
      }
    }
    for (const line of output.split("\n")) {
      if (line.startsWith("author-time ")) {
        time = Number(line.slice(12))
      } else if (line.startsWith("\t")) {
        const slugMatch = /^\t {4}"slug": "([^"]+)"/.exec(line)
        if (slugMatch) {
          flush()
          currentSlug = slugMatch[1]
          added = time
          max = 0
        }
        max = Math.max(max, time)
      }
    }
    flush()
  }
  return termDatesCache.get(slug) ?? {}
}
