import { Inter, Playfair_Display } from "next/font/google"
import Link from "next/link"
import { Title } from "components/elements/layout"
import "./reset.css"

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600"],
})

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
})

export const metadata = {
  title: "Re Reference AI (RRA)",
  description: "AI技術リファレンス",
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html className={`${display.variable} ${body.variable}`} lang="ja">
      <body>
        <header
          style={{
            background: "var(--color-bg-elevated)",
            borderBottom: "1px solid var(--color-border)",
            padding: "1rem 1.5rem",
            position: "relative",
          }}
        >
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            <Title>Re Reference AI</Title>
          </Link>
        </header>
        <main
          style={{
            background: "var(--color-bg)",
            minHeight: "calc(100dvh - 7.5rem)",
            padding: "1rem",
          }}
        >
          {children}
        </main>
        <footer
          style={{
            background: "var(--color-bg-elevated)",
            borderTop: "1px solid var(--color-border)",
            color: "var(--color-text-muted)",
            fontSize: ".75rem",
            letterSpacing: "0.02em",
            padding: "1.25rem 1.5rem",
          }}
        >
          <p>&copy; Reload</p>
        </footer>
      </body>
    </html>
  )
}
export default RootLayout
