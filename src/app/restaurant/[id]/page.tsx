'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { getRestaurantById } from '@/app/actions'

export default function RestaurantPage() {
  const params = useParams()
  const id = params?.id as string
  const [r, setR] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    if (id) {
      getRestaurantById(id).then(data => {
        setR(data)
        setLoading(false)
      })
    }
  }, [id])

  if (loading) {
    return <div className="container section" style={{ marginTop: '5rem', textAlign: 'center' }}>Loading menu...</div>
  }

  if (!r) {
    return <div className="container section" style={{ marginTop: '5rem', textAlign: 'center' }}>Restaurant not found.</div>
  }

  return (
    <div>
      <div style={{ height: '400px', position: 'relative', width: '100%' }}>
        <Image src={r.img} alt={r.name} layout="fill" objectFit="cover" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-dark) 0%, rgba(15,15,15,0.2) 100%)' }} />
        
        <div className="container" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: '2rem' }}>
          <Link href="/restaurants" style={{ color: 'var(--text-secondary)', display: 'inline-block', marginBottom: '1rem' }}>← Back to Restaurants</Link>
          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{r.name}</h1>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', alignItems: 'center' }}>
            <span>{r.tags}</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ color: '#FFD700' }}>★</span> {r.rating}
            </span>
          </div>
        </div>
      </div>

      <div className="container section" style={{ paddingTop: '3rem' }}>
        <h2 style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>Menu</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {r.menu.map((item: any) => (
            <div key={item.id} className="glass-panel menu-item-hover" style={{ display: 'flex', padding: '1rem', gap: '1rem', transition: 'background var(--transition-fast)' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                <Image src={item.img} alt={item.name} layout="fill" objectFit="cover" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{item.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{item.desc}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--white)' }}>
                    {typeof item.price === 'number' ? `₹${item.price}` : item.price}
                  </span>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}
                    onClick={() => {
                       const priceMatch = typeof item.price === 'string' ? item.price.match(/\d+/) : null;
                       const priceNum = typeof item.price === 'number' ? item.price : parseInt(priceMatch ? priceMatch[0] : '0');
                       addToCart({ id: item.id, name: item.name, price: priceNum });
                       alert(`Added ${item.name} to Cart!`);
                    }}
                  >Add</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .menu-item-hover:hover {
          background: rgba(255, 255, 255, 0.05);
        }
      `}} />
    </div>
  )
}
