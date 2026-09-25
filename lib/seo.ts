import { Metadata } from "next"

// 各コンテンツ(JSON)で任意指定できるSEO上書き。未指定時はページ側の自動生成値を使う
export type SEO = {
  title?: string
  description?: string
  canonical?: string
  noindex?: boolean
}

export const applySeo = (metadata: Metadata, seo?: SEO): Metadata => {
  if (!seo) return metadata
  const title = seo.title ?? metadata.title
  const description = seo.description ?? metadata.description
  return {
    ...metadata,
    title,
    description,
    ...(seo.canonical && {
      alternates: { ...metadata.alternates, canonical: seo.canonical },
    }),
    openGraph: {
      ...metadata.openGraph,
      ...(typeof title === "string" && { title }),
      ...(description && { description }),
      ...(seo.canonical && { url: seo.canonical }),
    },
    twitter: {
      ...metadata.twitter,
      ...(typeof title === "string" && { title }),
      ...(description && { description }),
    },
    ...(seo.noindex && { robots: { follow: true, index: false } }),
  }
}
