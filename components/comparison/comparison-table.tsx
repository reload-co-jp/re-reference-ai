import { FC } from "react"
import { ComparisonTableRow } from "lib/comparisons"

export const ComparisonTable: FC<{
  rows: ComparisonTableRow[]
  leftLabel: string
  rightLabel: string
}> = ({ rows, leftLabel, rightLabel }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ borderCollapse: "collapse", minWidth: "32rem", width: "100%" }}>
      <thead>
        <tr>
          {["Item", leftLabel, rightLabel].map((heading) => (
            <th
              key={heading}
              style={{
                borderBottom: "1px solid var(--color-border-strong)",
                color: "var(--color-text-muted)",
                fontSize: ".8rem",
                fontWeight: 600,
                padding: ".625rem .75rem",
                textAlign: "left",
              }}
            >
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.item}>
            <td
              style={{
                borderBottom: "1px solid var(--color-border)",
                color: "var(--color-text-muted)",
                fontSize: ".85rem",
                padding: ".625rem .75rem",
                verticalAlign: "top",
                whiteSpace: "nowrap",
              }}
            >
              {row.item}
            </td>
            <td
              style={{
                borderBottom: "1px solid var(--color-border)",
                fontSize: ".85rem",
                padding: ".625rem .75rem",
                verticalAlign: "top",
              }}
            >
              {row.left}
            </td>
            <td
              style={{
                borderBottom: "1px solid var(--color-border)",
                fontSize: ".85rem",
                padding: ".625rem .75rem",
                verticalAlign: "top",
              }}
            >
              {row.right}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
