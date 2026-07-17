import { NextResponse } from "next/server"
import { termToMarkdown } from "lib/markdown"
import { getTermBySlug, terms } from "lib/terms"

export const dynamic = "force-static"
export const dynamicParams = false

export const generateStaticParams = () => terms.map((term) => ({ slug: term.slug }))

type Props = { params: Promise<{ slug: string }> }

export const GET = async (_request: Request, { params }: Props) => {
  const { slug } = await params
  const term = getTermBySlug(slug)

  if (!term) {
    return new NextResponse("Not Found", { status: 404 })
  }

  return new NextResponse(termToMarkdown(term), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
