export const truncate = (text: string, maxLength = 155): string =>
  text.length <= maxLength ? text : `${text.slice(0, maxLength - 1).trimEnd()}…`
