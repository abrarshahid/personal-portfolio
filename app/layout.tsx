import type { Metadata } from 'next'
import { Geist, Geist_Mono, Roboto_Condensed } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Suspense } from 'react'
import { LoadingScreen } from '@/components/loading-screen'
import { NavigationLoader } from '@/components/navigation-loader'
import './globals.css'

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: 'Abrar Shahid Rahik | AI Engineer',
  description: 'AI Engineer & Olympiad Medalist. Building intelligent systems and solving complex problems.',
  authors: [{ name: 'Abrar Shahid Rahik' }],
  openGraph: {
    title: 'Abrar Shahid Rahik | AI Engineer',
    description: 'AI Engineer & Olympiad Medalist. Building intelligent systems and solving complex problems.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abrar Shahid Rahik | AI Engineer',
    description: 'AI Engineer & Olympiad Medalist. Building intelligent systems and solving complex problems.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const getThemePreference = () => {
                  if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
                    return localStorage.getItem('theme');
                  }
                  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                };
                const isDark = getThemePreference() === 'dark';
                document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${robotoCondensed.variable} font-sans antialiased min-h-screen overflow-x-hidden`}>
        <LoadingScreen />
        <Suspense fallback={null}>
          <NavigationLoader />
        </Suspense>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
