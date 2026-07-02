import { ComponentProps, FC } from "react"

export const Title: FC<ComponentProps<"h1">> = ({
  style,
  children,
  ...props
}) => (
  <h1 style={{ fontSize: "1rem", margin: 0, ...style }} {...props}>
    {children}
  </h1>
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
  <section style={{ marginBottom: "2.5rem", ...style }} {...props}>
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
      borderBottom: "1px solid #444",
      fontSize: "1.125rem",
      marginBottom: "1rem",
      paddingBottom: ".5rem",
      ...style,
    }}
    {...props}
  >
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
      background: "#3a3a3a",
      borderRadius: ".25rem",
      color: "#ccc",
      display: "inline-block",
      fontSize: ".75rem",
      padding: ".125rem .5rem",
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
      background: "#2a2a2a",
      border: "1px solid #3a3a3a",
      borderRadius: ".5rem",
      padding: "1rem",
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
)
