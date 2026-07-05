import { ImageResponse } from "next/og"
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_TAGLINE_JA } from "lib/site"
import { categories, terms } from "lib/terms"

export const dynamic = "force-static"
export const alt = SITE_NAME
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const OpengraphImage = () =>
  new ImageResponse(
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
        <div style={{ color: "#7fe0a8", fontSize: 24, letterSpacing: 5, textTransform: "uppercase" }}>
          {SITE_TAGLINE}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ color: "#9ba6a0", fontSize: 34 }}>{SITE_TAGLINE_JA}</div>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.05 }}>{SITE_NAME}</div>
          <div style={{ color: "#d8dfdb", fontSize: 34, lineHeight: 1.45, maxWidth: 980 }}>
            {SITE_DESCRIPTION}
          </div>
        </div>

        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
          <div style={{ color: "#7f8d86", fontSize: 24 }}>rra.reload.co.jp</div>
          <div style={{ color: "#a8e8bf", display: "flex", gap: 18, fontSize: 26 }}>
            <span>{terms.length} terms</span>
            <span>/</span>
            <span>{categories.length} categories</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )

export default OpengraphImage
