import type { Metadata } from 'next'
import './globals.css'
import { SplashScreen } from '@/components/SplashScreen'

export const metadata: Metadata = {
  title: 'tinker',
  description: 'Hacé match con el par perfecto para vos.',
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
      <body className='overflow-x-hidden'>
        <SplashScreen />
        {children}
      </body>
    </html>
  )
}
