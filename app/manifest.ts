import { MetadataRoute } from "next"
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "lib/site"

export const dynamic = "force-static"

const manifest = (): MetadataRoute.Manifest => ({
  name: `${SITE_NAME} — ${SITE_TAGLINE}`,
  short_name: SITE_NAME,
  description: SITE_DESCRIPTION,
  start_url: "/",
  display: "standalone",
  background_color: "#0a0f0c",
  theme_color: "#0a0f0c",
  icons: [
    {
      src: "/icon.svg",
      sizes: "any",
      type: "image/svg+xml",
    },
  ],
})

export default manifest
