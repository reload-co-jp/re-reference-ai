import { ComponentProps, FC } from "react"

export const Title: FC<ComponentProps<"p">> = ({
  style,
  children,
  ...props
}) => (
  <p
    style={{
      fontSize: "1.125rem",
      letterSpacing: "0.04em",
      margin: 0,
      ...style,
    }}
    {...props}
  >
    {children}
  </p>
)

export const Container: FC<ComponentProps<"div">> = ({
  style,
  children,
  ...props
}) => (
  <div
    style={{ margin: "0 auto", maxWidth: "64rem", width: "100%", ...style }}
    {...props}
  >
    {children}
  </div>
)

export const Section: FC<ComponentProps<"section">> = ({
  style,
  children,
  ...props
}) => (
  <section style={{ marginBottom: "3rem", ...style }} {...props}>
    {children}
  </section>
)

export const SectionTitle: FC<ComponentProps<"h2">> = ({
  style,
  children,
  ...props
}) => (
  <h2
    style={{
      alignItems: "center",
      color: "var(--color-text)",
      display: "flex",
      fontSize: "1.25rem",
      gap: ".75rem",
      marginBottom: "1.25rem",
      ...style,
    }}
    {...props}
  >
    <span
      style={{
        background: "var(--color-accent)",
        borderRadius: "1px",
        display: "inline-block",
        height: "1px",
        width: "1.5rem",
      }}
    />
    {children}
  </h2>
)

export const Badge: FC<ComponentProps<"span">> = ({
  style,
  children,
  ...props
}) => (
  <span
    style={{
      background: "var(--color-accent-dim)",
      border: "1px solid var(--color-border-strong)",
      borderRadius: "2px",
      color: "var(--color-accent-bright)",
      display: "inline-block",
      fontSize: ".7rem",
      letterSpacing: "0.03em",
      padding: ".2rem .6rem",
      ...style,
    }}
    {...props}
  >
    {children}
  </span>
)

export const Card: FC<ComponentProps<"div">> = ({
  style,
  children,
  ...props
}) => (
  <div
    style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: ".25rem",
      padding: "1.5rem",
      transition: "border-color .2s ease, transform .2s ease",
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
)
