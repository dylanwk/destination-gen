import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import {Selector} from "@/app/components/selector";


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Roam Roulette',
  description: 'Let an AI-model choose your next Destination',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="coffee">
      <head><link rel="icon" href="/favicon.ico" sizes="any" /></head>
      <body className="bg-neutral mb-2">
      <div className="flex flex-col items-center">
        <div className="max-w-screen-md min-h-[100vh] w-full flex flex-col">

          <Selector/>

          {children}

        </div>
      </div>
      </body>
      </html>
  )
}
