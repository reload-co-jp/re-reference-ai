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
