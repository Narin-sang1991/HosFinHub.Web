import './globals.css'
import React from 'react';
import { Inter } from 'next/font/google'
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { StoreProvider } from './store.provider'
import MenuLayout from './MenuLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Hos Fin-hub App',
  description: 'Hospital Financial-Hub integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <StoreProvider>
      <html lang="en">
        <body className={inter.className}>
          <AntdRegistry>
            <MenuLayout>{children}</MenuLayout>
          </AntdRegistry>
        </body>
      </html>
    </StoreProvider>
  )
}