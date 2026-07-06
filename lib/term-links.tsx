import { ReactNode } from "react"
import Link from "next/link"
import { Term, terms } from "lib/terms"

// これらは頻出しすぎる一般語のため、本文中の自動リンク化対象から除外する
const EXCLUDED_MATCH_STRINGS = new Set([
  "LLM",
  "RAG",
  "API",
  "AI",
  "ML",
  "RL",
  "NN",
  "NLP",
  "SLM",
  "VLM",
  "Memory",
  "メモリ",
])

type Candidate = { text: string; term: Term }

let candidatesByFirstChar: Map<string, Candidate[]> | null = null

const buildCandidateIndex = (): Map<string, Candidate[]> => {
  if (candidatesByFirstChar) return candidatesByFirstChar

  const seen = new Set<string>()
  const flat: Candidate[] = []
  for (const term of terms) {
    for (const name of [term.name, ...(term.aliases ?? [])]) {
      if (name.length < 3 || EXCLUDED_MATCH_STRINGS.has(name)) continue
      const key = `${term.slug}:${name}`
      if (seen.has(key)) continue
      seen.add(key)
      flat.push({ text: name, term })
    }
  }
  // 開始位置ごとに最長一致を優先するため、文字列長の降順に並べる
  flat.sort((a, b) => b.text.length - a.text.length)

  const index = new Map<string, Candidate[]>()
  for (const candidate of flat) {
    const firstChar = candidate.text[0]
    const bucket = index.get(firstChar)
    if (bucket) {
      bucket.push(candidate)
    } else {
      index.set(firstChar, [candidate])
    }
  }
  candidatesByFirstChar = index
  return index
}

const isAlnum = (ch: string | undefined): boolean => ch !== undefined && /[A-Za-z0-9]/.test(ch)

// 半角英数字のみ単語境界をチェックする(HTML中のMLのような部分一致誤爆を防ぐため)。日本語には単語境界の概念がないため対象外。
const hasWordBoundary = (text: string, start: number, needle: string): boolean => {
  const startsAlnum = /[A-Za-z0-9]/.test(needle[0])
  const endsAlnum = /[A-Za-z0-9]/.test(needle[needle.length - 1])
  if (startsAlnum && isAlnum(text[start - 1])) return false
  if (endsAlnum && isAlnum(text[start + needle.length])) return false
  return true
}

// 本文中に登場する他のtermの名称・別名を検出し、該当箇所を/terms/[slug]へのリンクに変換する
export const linkifyTermMentions = (text: string, currentSlug: string): ReactNode[] => {
  const index = buildCandidateIndex()
  const nodes: ReactNode[] = []
  let buffer = ""
  let i = 0
  let key = 0

  const flush = () => {
    if (buffer) {
      nodes.push(buffer)
      buffer = ""
    }
  }

  while (i < text.length) {
    const bucket = index.get(text[i])
    let matched: Candidate | null = null
    if (bucket) {
      // 自身の名称/別名も候補に含めたうえで最長一致を優先する。
      // こうしないと、自分の名称の内部に他termの短い別名が部分一致してしまう
      // (例: 「コーディングエージェント」内の「エージェント」がai-agentへ誤って部分リンクされる)。
      for (const candidate of bucket) {
        if (text.startsWith(candidate.text, i) && hasWordBoundary(text, i, candidate.text)) {
          matched = candidate
          break
        }
      }
    }

    if (matched && matched.term.slug !== currentSlug) {
      flush()
      nodes.push(
        <Link
          key={`link-${key++}`}
          href={`/terms/${matched.term.slug}/`}
          style={{ color: "var(--color-accent-bright)" }}
        >
          {matched.text}
        </Link>,
      )
      i += matched.text.length
    } else if (matched) {
      buffer += matched.text
      i += matched.text.length
    } else {
      buffer += text[i]
      i += 1
    }
  }
  flush()
  return nodes
}
