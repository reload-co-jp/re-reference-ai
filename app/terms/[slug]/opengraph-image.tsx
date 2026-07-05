import { ImageResponse } from "next/og"
import { SITE_NAME, SITE_TAGLINE } from "lib/site"
import { getTermBySlug, terms } from "lib/terms"
import { truncate } from "lib/text"

export const dynamic = "force-static"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

type Props = { params: Promise<{ slug: string }> }

export const generateStaticParams = () => terms.map((term) => ({ slug: term.slug }))

const OpengraphImage = async ({ params }: Props) => {
  const { slug } = await params
  const term = getTermBySlug(slug)

  if (!term) {
    return new ImageResponse(<div />, { ...size })
  }

  const description = truncate(term.plainSummary ?? term.summary ?? term.tagline, 92)
  const aliases = term.aliases?.filter((alias) => alias !== term.name).slice(0, 3).join(" / ")

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0f0c",
          color: "#f4f6f5",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px 84px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <div
            style={{
              color: "#7fe0a8",
              fontSize: 24,
              letterSpacing: 5,
              textTransform: "uppercase",
            }}
          >
            {SITE_TAGLINE}
          </div>
          <div
            style={{
              border: "1px solid #2f5f43",
              borderRadius: 999,
              color: "#a8e8bf",
              fontSize: 26,
              padding: "10px 22px",
            }}
          >
            {term.category}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ color: "#9ba6a0", fontSize: 32 }}>{SITE_NAME}</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: term.name.length > 24 ? 70 : 86,
              fontWeight: 700,
              letterSpacing: -1,
              lineHeight: 1.08,
              maxWidth: 1000,
            }}
          >
            {term.name}
          </div>
          {aliases && <div style={{ color: "#b8c5bd", fontSize: 30 }}>{aliases}</div>}
          <div style={{ color: "#d8dfdb", fontSize: 34, lineHeight: 1.45, maxWidth: 980 }}>
            {description}
          </div>
        </div>

        <div style={{ color: "#7f8d86", fontSize: 24 }}>rra.reload.co.jp</div>
      </div>
    ),
    { ...size },
  )
}

export default OpengraphImage
