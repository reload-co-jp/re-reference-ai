"use client"

import { CSSProperties, FC, useEffect } from "react"
import { ADSENSE_CLIENT_ID } from "components/analytics/google-adsense"

const DISPLAY_AD_SLOT = "4829146611" // 共通ディスプレイ
const IN_ARTICLE_AD_SLOT = "4625326006" // 記事内

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

const usePushAd = () => {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // 広告ブロッカー等で失敗しても描画は継続
    }
  }, [])
}

export const DisplayAd: FC = () => {
  usePushAd()

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

export const InArticleAd: FC<{ style?: CSSProperties }> = ({ style }) => {
  usePushAd()

  if (process.env.NODE_ENV !== "production") {
    return null
  }

  return (
    <ins
      className="adsbygoogle"
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-format="fluid"
      data-ad-layout="in-article"
      data-ad-slot={IN_ARTICLE_AD_SLOT}
      style={{ display: "block", textAlign: "center", ...style }}
    />
  )
}
