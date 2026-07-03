import { ImageResponse } from "next/og"
import { SITE_NAME, SITE_TAGLINE } from "lib/site"

export const dynamic = "force-static"
export const alt = SITE_NAME
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const OpengraphImage = () =>
  new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#0a0f0c",
          color: "#f4f6f5",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#7fe0a8",
            fontSize: 28,
            letterSpacing: 6,
            marginBottom: 24,
            textTransform: "uppercase",
          }}
        >
          {SITE_TAGLINE}
        </div>
        <div style={{ fontSize: 88, fontWeight: 600 }}>{SITE_NAME}</div>
      </div>
    ),
    { ...size },
  )

export default OpengraphImage
