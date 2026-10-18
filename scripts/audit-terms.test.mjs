import assert from "node:assert/strict"
import { test } from "node:test"
import { auditTerms } from "./audit-terms.mjs"

const base = {
  tagline: "テスト用に十分な長さを持つ一文の定義テキスト",
  summary: "あ".repeat(250),
  category: "技術",
  tags: ["評価"],
  references: [{ type: "Documentation", label: "Doc", url: "https://example.com" }],
}

const rules = (issues, slug) => issues.filter((i) => i.slug === slug).map((i) => i.rule)

test("正常な用語は問題なし", () => {
  const issues = auditTerms({ terms: [{ ...base, slug: "a", name: "A" }], tagDescriptions: { 評価: "x" } })
  assert.deepEqual(issues, [])
})

test("各種問題を検出する", () => {
  const issues = auditTerms({
    terms: [
      { ...base, slug: "a", name: "A", aliases: ["A", "x", "X"], relatedTerms: ["missing"], references: [] },
      { ...base, slug: "b", name: "B", aliases: ["x"], summary: undefined, tagline: base.tagline },
      { ...base, slug: "c", name: "C", summary: "現在の最新版は" + "い".repeat(200) + "最強", tags: ["孤立"] },
    ],
    tagDescriptions: { 評価: "x" },
    timelines: [{ slug: "t", events: [{ title: "e", relatedTerms: ["zzz"] }] }],
  })
  assert.ok(rules(issues, "a").includes("alias-equals-name"))
  assert.ok(rules(issues, "a").includes("duplicate-alias"))
  assert.ok(rules(issues, "a").includes("broken-related"))
  assert.ok(rules(issues, "a").includes("missing-references"))
  assert.ok(rules(issues, "a").includes("ambiguous-name"))
  assert.ok(rules(issues, "b").includes("missing-summary"))
  assert.ok(rules(issues, "b").includes("duplicate-text"))
  assert.ok(rules(issues, "c").includes("volatile-without-date"))
  assert.ok(rules(issues, "c").includes("vague-or-assertive"))
  assert.ok(rules(issues, "c").includes("orphan-tag"))
  assert.ok(rules(issues, "timeline/t").includes("broken-content-ref"))
  assert.ok(rules(issues, "timeline/t").includes("event-without-source"))
})

test("否定の「必ずしも」は断定表現として扱わない", () => {
  const issues = auditTerms({
    terms: [{ ...base, slug: "a", name: "A", summary: "必ずしも正しいとは限らない。" + "う".repeat(200) }],
    tagDescriptions: { 評価: "x" },
  })
  assert.deepEqual(rules(issues, "a"), [])
})
