import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'District 79 Directory',
  description: 'School plans management system for NYC District 79',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}