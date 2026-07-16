import { FC } from "react"
import { Badge } from "components/elements/layout"

export const VersionBadge: FC<{ version: string; date: string; note?: string }> = ({
  version,
  date,
  note,
}) => (
  <div style={{ alignItems: "baseline", display: "flex", gap: ".75rem", marginBottom: ".625rem" }}>
    <Badge style={{ flexShrink: 0 }}>{version}</Badge>
    <span style={{ color: "var(--color-text-muted)", fontSize: ".85rem" }}>{date}</span>
    {note && <span style={{ color: "var(--color-text-muted)", fontSize: ".85rem" }}>{note}</span>}
  </div>
)
