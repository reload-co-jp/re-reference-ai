import { FC } from "react"
import { ArticleComparisonRow } from "lib/articles"
import { Term } from "lib/terms"

export const ModelComparisonTable: FC<{
  rows: ArticleComparisonRow[]
  models: Term[]
}> = ({ rows, models }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ borderCollapse: "collapse", minWidth: "48rem", width: "100%" }}>
      <thead>
        <tr>
          <th
            style={{
              borderBottom: "1px solid var(--color-border-strong)",
              color: "var(--color-text-muted)",
              fontSize: ".8rem",
              fontWeight: 600,
              padding: ".625rem .75rem",
              textAlign: "left",
            }}
          >
            項目
          </th>
          {models.map((model) => (
            <th
              key={model.slug}
              style={{
                borderBottom: "1px solid var(--color-border-strong)",
                color: "var(--color-text-muted)",
                fontSize: ".8rem",
                fontWeight: 600,
                padding: ".625rem .75rem",
                textAlign: "left",
                whiteSpace: "nowrap",
              }}
            >
              {model.name}
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
            {models.map((model) => (
              <td
                key={model.slug}
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  fontSize: ".85rem",
                  padding: ".625rem .75rem",
                  verticalAlign: "top",
                }}
              >
                {row.values[model.slug] ?? "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
