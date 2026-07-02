export const toJsonLd = (data: unknown): string =>
  JSON.stringify(data).replace(/</g, "\\u003c")
