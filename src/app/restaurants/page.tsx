'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getRestaurants } from '@/app/actions'

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<any[]>([])

  useEffect(() => {
    getRestaurants().then(setRestaurants)
  }, [])

  return (
    <div className="container section" style={{ marginTop: '5rem' }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 className="gradient-text" style={{ marginBottom: '1rem' }}>Our Exclusive Partners</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Browse our curated selection of high-end culinary experiences, delivered fast.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn-primary" style={{ padding: '0.5rem 1.5rem', background: 'var(--primary-red)' }}>All Cuisines</button>
        <button className="btn-secondary" style={{ padding: '0.5rem 1.5rem' }}>Biriyani</button>
        <button className="btn-secondary" style={{ padding: '0.5rem 1.5rem' }}>Street Food</button>
        <button className="btn-secondary" style={{ padding: '0.5rem 1.5rem' }}>Chinese</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {restaurants.map(restaurant => (
          <Link href={`/restaurant/${restaurant.id}`} key={restaurant.id} style={{ display: 'block', transition: 'transform var(--transition-normal)' }} className="restaurant-card">
            <div className="glass-panel" style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '220px', width: '100%' }}>
                <Image src={restaurant.img} alt={restaurant.name} layout="fill" objectFit="cover" style={{ transition: 'transform 0.5s ease' }} className="card-image" />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--glass-bg)', backdropFilter: 'blur(8px)', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ color: '#FFD700' }}>★</span> {restaurant.rating}
                </div>
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{restaurant.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>{restaurant.tags}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--ruby-light)', fontSize: '0.875rem', fontWeight: 600 }}>
                  <span>{restaurant.time} Delivery</span>
                  <span>View Menu ➔</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .restaurant-card:hover .card-image { transform: scale(1.05); }
        .restaurant-card:hover .glass-panel { border-color: rgba(255, 102, 89, 0.3); box-shadow: 0 8px 32px rgba(211, 47, 47, 0.15); }
      `}} />
    </div>
  )
}
