'use client'

import React from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useSession } from 'next-auth/react'

export default function CartBadge() {
  const { cartItems } = useCart()
  const { data: session } = useSession()
  const count = cartItems.reduce((acc, item) => acc + item.qty, 0)
  
  
  return (
    <Link href="/checkout" style={{ fontWeight: 500, fontSize: 'var(--nav-font-size)', transition: 'color var(--transition-fast)', position: 'relative', display: 'flex', alignItems: 'center' }} className="nav-link">
      Cart
      {count > 0 && (
        <span style={{
          position: 'absolute',
          top: '-10px',
          right: '-16px',
          background: 'var(--primary-red)',
          color: 'var(--white)',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          padding: '2px 6px',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
          {count}
        </span>
      )}
    </Link>
  )
}
