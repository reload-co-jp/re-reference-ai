import { ImageResponse } from "next/og"
import { SITE_NAME, SITE_TAGLINE } from "lib/site"
import { getTermBySlug, terms } from "lib/terms"

export const dynamic = "force-static"
export const dynamicParams = false
export const alt = SITE_NAME
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export const generateStaticParams = () => terms.map((term) => ({ slug: term.slug }))

type Props = { params: Promise<{ slug: string }> }

const OpengraphImage = async ({ params }: Props) => {
  const { slug } = await params
  const term = getTermBySlug(slug)
  const name = term?.name ?? SITE_NAME
  const category = term?.category ?? ""
  const tagline = term?.tagline ?? ""

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
        <div
          style={{
            color: "#7fe0a8",
            display: "flex",
            fontSize: 24,
            letterSpacing: 5,
            textTransform: "uppercase",
          }}
        >
          {SITE_TAGLINE}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {category && (
            <div style={{ color: "#9ba6a0", display: "flex", fontSize: 30 }}>{category}</div>
          )}
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, lineHeight: 1.1 }}>
            {name}とは
          </div>
          {tagline && (
            <div
              style={{
                color: "#d8dfdb",
                display: "flex",
                fontSize: 32,
                lineHeight: 1.45,
                maxWidth: 980,
              }}
            >
              {tagline}
            </div>
          )}
        </div>

        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
          <div style={{ color: "#7f8d86", display: "flex", fontSize: 24 }}>rra.reload.co.jp</div>
          <div style={{ color: "#a8e8bf", display: "flex", fontSize: 26 }}>{SITE_NAME}</div>
        </div>
      </div>
    ),
    { ...size },
  )
}

export default OpengraphImage
