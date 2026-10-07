"use client"

import { FC, useEffect } from "react"
import { ADSENSE_CLIENT_ID } from "components/analytics/google-adsense"

const DISPLAY_AD_SLOT = "4829146611" // 共通ディスプレイ

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

export const DisplayAd: FC = () => {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // 広告ブロッカー等で失敗しても描画は継続
    }
  }, [])

  if (process.env.NODE_ENV !== "production") {
    return null
  }

  return (
    <ins
      className="adsbygoogle"
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-format="auto"
      data-ad-slot={DISPLAY_AD_SLOT}
      data-full-width-responsive="true"
      style={{ display: "block", marginBottom: "3rem" }}
    />
  )
}
