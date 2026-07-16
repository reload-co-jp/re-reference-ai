import { FC } from "react"
import { ComparisonFeature } from "lib/comparisons"

const renderCell = (value: boolean | string) => {
  if (typeof value === "boolean") {
    return (
      <span style={{ color: value ? "var(--color-accent-bright)" : "var(--color-text-muted)" }}>
        {value ? "○" : "—"}
      </span>
    )
  }
  return <span style={{ fontSize: ".85rem" }}>{value}</span>
}

export const FeatureTable: FC<{
  features: ComparisonFeature[]
  leftLabel: string
  rightLabel: string
}> = ({ features, leftLabel, rightLabel }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ borderCollapse: "collapse", minWidth: "28rem", width: "100%" }}>
      <thead>
        <tr>
          {["Feature", leftLabel, rightLabel].map((heading) => (
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
        {features.map((feature) => (
          <tr key={feature.feature}>
            <td
              style={{
                borderBottom: "1px solid var(--color-border)",
                fontSize: ".85rem",
                padding: ".625rem .75rem",
                whiteSpace: "nowrap",
              }}
            >
              {feature.feature}
            </td>
            <td style={{ borderBottom: "1px solid var(--color-border)", padding: ".625rem .75rem" }}>
              {renderCell(feature.left)}
            </td>
            <td style={{ borderBottom: "1px solid var(--color-border)", padding: ".625rem .75rem" }}>
              {renderCell(feature.right)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
