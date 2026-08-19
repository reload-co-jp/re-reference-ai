import { FC } from "react"
import Script from "next/script"

const ADSENSE_CLIENT_ID = "ca-pub-6542845006087970"

export const GoogleAdsense: FC = () => {
  if (process.env.NODE_ENV !== "production") {
    return null
  }

  return (
    <Script
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      strategy="afterInteractive"
    />
  )
}
