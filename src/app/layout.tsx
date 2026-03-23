import type { Metadata } from 'next'
import './globals.css'
import Image from 'next/image'
import Link from 'next/link'
import { CartProvider } from '@/context/CartContext'
import { NextAuthProvider } from '@/providers/NextAuthProvider'
import CartBadge from '@/components/CartBadge'
import AuthButton from '@/components/AuthButton'
import AdminLink from '@/components/AdminLink'

export const metadata: Metadata = {
  title: 'Ruby Paid Service | Premium Food Delivery',
  description: 'High-end, reliable food delivery platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
        <CartProvider>
          <nav className="glass-panel" style={{ 
          position: 'fixed', top: '1rem', left: '1rem', right: '1rem', 
          zIndex: 100, display: 'flex', justifyContent: 'space-between', 
          alignItems: 'center', padding: 'var(--nav-padding)' 
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 'var(--nav-logo-size)', height: 'var(--nav-logo-size)', borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
              <Image src="/images/ruby.jpeg" alt="[LOGO]" layout="fill" objectFit="cover" />
            </div>
            <span style={{ fontSize: 'var(--nav-font-size)', fontWeight: 800, color: 'var(--ruby-light)', whiteSpace: 'nowrap' }}>Ruby <span style={{ color: 'var(--white)' }}>Paid Service</span></span>
          </Link>
          
          <div style={{ display: 'flex', gap: 'var(--nav-gap)', alignItems: 'center' }}>
            <Link href="/" style={{ fontWeight: 500, fontSize: 'var(--nav-font-size)', transition: 'color var(--transition-fast)' }} className="nav-link">Home</Link>
            <Link href="/restaurants" style={{ fontWeight: 500, fontSize: 'var(--nav-font-size)', transition: 'color var(--transition-fast)' }} className="nav-link">Restaurants</Link>
            <AdminLink />
            <CartBadge />
            <AuthButton />
          </div>
        </nav>
        
        <main>
          {children}
        </main>
        
        <footer style={{ background: 'rgba(20,20,20,0.8)', padding: '4rem 2rem', marginTop: '4rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ maxWidth: '300px' }}>
              <h3 style={{ color: 'var(--ruby-light)', marginBottom: '1rem' }}>Ruby Paid Service</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Delivering excellence to your doorstep. Experience premium dining from the comfort of your home.</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/restaurants">Top Rated</Link></li>
                <li><Link href="/">How it Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Contact</h4>
              <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>lohith2007s@gmail.com</li>
                <li>6361762647</li>
              </ul>
              
              <h4 style={{ marginBottom: '1rem', marginTop: '2rem' }}>Developer</h4>
              <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li style={{ color: 'var(--white)', fontWeight: 600 }}>Lohith S</li>
                <li style={{ fontSize: '0.875rem' }}>(Full Stack Developer)</li>
                <li>E: lohith2007s@gmail.com</li>
                <li>P: +91 7338499165</li>
              </ul>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            © 2026 Ruby Paid Service. All rights reserved.
          </div>
        </footer>
        </CartProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
