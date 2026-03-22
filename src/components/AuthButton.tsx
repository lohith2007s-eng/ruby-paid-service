'use client'
import React from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function AuthButton() {
  const { data: session } = useSession()

  if (session?.user) {
    return (
      <button className="btn-secondary" onClick={() => signOut()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: 'var(--ruby-light)' }}>
        <span style={{ fontSize: '1.2rem' }}>👤</span>
        {session.user.name || 'Admin'}
      </button>
    )
  }

  return (
    <button className="btn-primary" onClick={() => signIn()}>Admin Login</button>
  )
}
