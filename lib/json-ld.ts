import { SITE_PUBLISHER_NAME, SITE_URL } from "lib/site"

export const toJsonLd = (data: unknown): string =>
  JSON.stringify(data).replace(/</g, "\\u003c")

export const organizationRef = {
  "@type": "Organization",
  name: SITE_PUBLISHER_NAME,
  url: SITE_URL,
} as const

export const buildOrganizationJsonLd = () => ({
  "@context": "https://schema.org",
  ...organizationRef,
})

export const buildItemListJsonLd = (
  name: string,
  items: { name: string; url: string }[],
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    url: item.url,
  })),
})
