import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './globals.css'
import { dark } from '@clerk/themes'
import Header from '@/components/Header'

export const metadata = {
  title: 'Your App Name',
  description: 'Your app description',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider  
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning={true}>
        <body suppressHydrationWarning={true}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}