import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sneaker Heart',
  description: 'Descubre las zapatillas más exclusivas con Sneaker Heart',
  icons: {
    icon: '/info/sneakers-heart-logo.png',
    apple: '/info/sneakers-heart-logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
