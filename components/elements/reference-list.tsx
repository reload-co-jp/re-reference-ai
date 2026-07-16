import { FC } from "react"
import { Badge } from "components/elements/layout"
import { Reference } from "lib/terms"

export const ReferenceList: FC<{ references: Reference[] }> = ({ references }) => (
  <ul style={{ paddingLeft: "1.25rem" }}>
    {references.map((reference) => (
      <li key={reference.url} style={{ marginBottom: ".5rem" }}>
        <Badge style={{ marginRight: ".625rem" }}>{reference.type}</Badge>
        <a
          href={reference.url}
          rel="noreferrer"
          style={{ color: "var(--color-accent-bright)" }}
          target="_blank"
        >
          {reference.label}
        </a>
      </li>
    ))}
  </ul>
)
