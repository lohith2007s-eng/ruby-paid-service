'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getRestaurants } from '@/app/actions'

export default function Home() {
  const [address, setAddress] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [connStatus, setConnStatus] = useState<any>(null)

  useEffect(() => {
    import('@/app/actions').then(actions => {
      actions.getRestaurants().then(setRestaurants)
      actions.testConnection().then(setConnStatus)
    })
  }, [])

  return (
    <div style={{ marginTop: '5rem' }}>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        padding: '8rem 0', 
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(rgba(15,15,15,0.7), rgba(15,15,15,0.9)), url("/images/chicken_biriyani.jpg") no-repeat center center/cover'
      }}>
        <div className="container animate-fade-in" style={{ zIndex: 10 }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1 className="gradient-text" style={{ marginBottom: '1.5rem', lineHeight: '1.1' }}>
              Premium Dining, Delivered at Ruby Speed.
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
              Experience high-end, reliable food delivery from the finest restaurants like Mahesh Mane Biriyani. Skip the wait. Savour the taste.
            </p>
            
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
              <input 
                type="text" 
                placeholder="Enter Delivery Address..." 
                className="input-glass" 
                style={{ flex: '1', minWidth: '250px' }}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Search Cuisines (e.g., Biriyani, Snacks)..." 
                className="input-glass" 
                style={{ flex: '1', minWidth: '250px' }}
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
              />
              <button className="btn-primary" style={{ padding: '1rem 2.5rem' }}>
                Find Food
              </button>
            </div>
            
            <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--primary-red)' }}>✦</span> Fastest Delivery
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--primary-red)' }}>✦</span> Premium Service
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--primary-red)' }}>✦</span> Top Rated Restaurants
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Restaurants */}
      <section className="section container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div>
            <h2 className="gradient-text" style={{ marginBottom: '0.5rem' }}>Top Rated Restaurants</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Curated highly-rated local favorites.</p>
          </div>
          <Link href="/restaurants" className="btn-secondary">View All</Link>
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
      </section>

      {/* How It Works */}
      <section className="section" style={{ background: 'linear-gradient(180deg, var(--bg-dark) 0%, rgba(30, 0, 0, 0.5) 100%)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="gradient-text" style={{ marginBottom: '1rem' }}>How Ruby Paid Service Works</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>Three simple steps to enjoy a world-class culinary experience without leaving your couch.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', textAlign: 'center' }}>
            {[{ step: '01', title: 'Discover', desc: 'Browse our curated list of high-end restaurants and signature dishes.' }, 
              { step: '02', title: 'Order', desc: 'Customize your meal and checkout securely with ease.' }, 
              { step: '03', title: 'Enjoy', desc: 'Track your order in real-time as our Ruby drivers bring it to you at lightning speed.' }].map((item, i) => (
              <div key={i} className="glass-panel" style={{ padding: '3rem 2rem', position: 'relative' }}>
                <div className="pulse-animation" style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, var(--primary-red), var(--ruby-dark))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, margin: '0 auto 2rem auto' }}>
                  {item.step}
                </div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section container" style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ position: 'relative', height: '500px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
             <Image src="/images/chicken leg piece.jpg" alt="Why Choose Us" layout="fill" objectFit="cover" />
          </div>
        </div>
        <div style={{ flex: '1', minWidth: '350px' }}>
          <h2 className="gradient-text" style={{ marginBottom: '1.5rem' }}>Why Choose Ruby Paid Service?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            We do not just deliver food; we deliver an experience. From careful restaurant curation to white-glove delivery, everything is designed around quality.
          </p>
          
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--ruby-light)', fontSize: '1.5rem' }}>⚡</div>
              <div>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Unmatched Speed</h4>
                <p style={{ color: 'var(--text-secondary)' }}>Our routing algorithms guarantee the shortest transit times, keeping your food fresh and hot.</p>
              </div>
            </li>
            <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--ruby-light)', fontSize: '1.5rem' }}>💎</div>
              <div>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Premium Service</h4>
                <p style={{ color: 'var(--text-secondary)' }}>Professionally trained couriers handling your fine dining orders with the care they deserve.</p>
              </div>
            </li>
            <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--ruby-light)', fontSize: '1.5rem' }}>🏅</div>
              <div>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Exclusive Partners</h4>
                <p style={{ color: 'var(--text-secondary)' }}>Access to top-rated menus like Kalabhairavva Dry Gobi that you won&apos;t find on other platforms.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>
      
      {/* Connection Status & Manual Fix */}
      {connStatus && (
        <div style={{
          position: 'fixed', bottom: '1rem', right: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem',
          backgroundColor: connStatus.success ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)', border: `1px solid ${connStatus.success ? '#00ff00' : '#ff0000'}`,
          padding: '1rem', borderRadius: '12px', fontSize: '0.85rem', zIndex: 1000, maxWidth: '300px'
        }}>
          <div><b>DB Status:</b> {connStatus.success ? `Connected (${connStatus.count} restaurants)` : `Error: ${connStatus.message}`}</div>
          
          {((connStatus.count ?? 0) <= 5 || !connStatus.success) && (
            <button 
              onClick={async () => {
                const actions = await import('@/app/actions');
                setConnStatus({ success: false, message: 'Updating database... please wait' });
                const res = await actions.runSeed();
                if (res.success) {
                  alert('Database updated successfully! Refresh to see the new images.');
                  window.location.reload();
                } else {
                  setConnStatus({ success: false, message: 'Update failed: ' + res.message });
                }
              }}
              style={{
                background: 'var(--primary-red)', color: 'white', border: 'none', padding: '0.5rem', 
                borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              Fix & Update Images (Force Seed)
            </button>
          )}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .restaurant-card:hover .card-image { transform: scale(1.05); }
        .restaurant-card:hover .glass-panel { border-color: rgba(255, 102, 89, 0.3); box-shadow: 0 8px 32px rgba(211, 47, 47, 0.15); }
      `}} />
    </div>
  )
}
