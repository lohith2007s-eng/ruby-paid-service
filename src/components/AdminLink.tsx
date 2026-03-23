'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function AdminLink() {
  const { data: session } = useSession()
  
  const isAdmin = session?.user?.name === 'Admin'
  
  if (!isAdmin) return null
  
  return (
    <Link href="/admin" style={{ fontWeight: 500, fontSize: 'var(--nav-font-size)', color: 'var(--ruby-light)', transition: 'color var(--transition-fast)' }} className="nav-link">Admin</Link>
  )
}
