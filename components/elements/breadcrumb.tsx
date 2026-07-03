import { FC } from "react"
import Link from "next/link"

export type BreadcrumbItem = { name: string; href?: string }

export const Breadcrumb: FC<{ items: BreadcrumbItem[] }> = ({ items }) => (
  <nav aria-label="パンくずリスト" style={{ fontSize: ".8rem", marginBottom: "1.5rem" }}>
    <ol
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: ".375rem",
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {items.map((item, index) => (
        <li
          key={item.href ?? item.name}
          style={{ alignItems: "center", display: "flex", gap: ".375rem" }}
        >
          {index > 0 && <span style={{ color: "var(--color-text-muted)" }}>/</span>}
          {item.href ? (
            <Link href={item.href} style={{ color: "var(--color-text-muted)" }}>
              {item.name}
            </Link>
          ) : (
            <span style={{ color: "var(--color-text)" }}>{item.name}</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
)
