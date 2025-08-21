import './globals.css'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Providers } from './providers'

export const metadata = {
  title: 'District 79 Directory',
  description: 'School plans management system for NYC District 79',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <SpeedInsights />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}