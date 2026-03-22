'use client'

import React, { useEffect, useState } from 'react'
import { getOrders } from '@/app/actions'
import { useSession } from 'next-auth/react'

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [prevCount, setPrevCount] = useState(0)
  const { data: session } = useSession()
  
  const isAdmin = session?.user?.name === 'Admin'

  useEffect(() => {
    if (session) {
      console.log('Current Session:', session)
    }
  }, [session])

  const fetchOrders = () => {
    if (isAdmin) {
      getOrders().then(newOrders => {
        if (newOrders.length > prevCount && prevCount > 0) {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play().catch(e => console.log('Sound blocked by browser:', e));
        }
        setOrders(newOrders)
        setPrevCount(newOrders.length)
      })
    }
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 20000) // Poll every 20 seconds
    return () => clearInterval(interval)
  }, [isAdmin, prevCount])

  if (!isAdmin) {
    return (
      <div className="container section" style={{ marginTop: '5rem', textAlign: 'center', minHeight: '60vh' }}>
        <h1 style={{ color: 'var(--ruby)', fontSize: '2rem', marginBottom: '1rem' }}>Access Denied</h1>
        <p style={{ color: 'var(--text-secondary)' }}>You do not have permission to view this page. Please sign in as the administrator.</p>
      </div>
    )
  }

  return (
    <div className="container section" style={{ marginTop: '5rem', minHeight: '80vh' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Admin Dashboard</h1>
        
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{ padding: '1.5rem', flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '1rem' }}>Total Orders</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{orders.length}</div>
          </div>
          <div style={{ padding: '1.5rem', flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '1rem' }}>Total Revenue</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--ruby-light)' }}>
              ₹{orders.reduce((sum: number, o: any) => sum + o.total, 0).toLocaleString()}
            </div>
          </div>
        </div>

        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Recent Orders</h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--ruby)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Order ID</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Date</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Customer</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Items</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Total</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => {
                  let parsedItems = []
                  try {
                    parsedItems = JSON.parse(order.items)
                  } catch (e) {}

                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '1rem', fontFamily: 'monospace' }}>#{order.id.slice(-6).toUpperCase()}</td>
                      <td style={{ padding: '1rem' }}>{new Date(order.createdAt).toLocaleString()}</td>
                      <td style={{ padding: '1rem', color: 'var(--ruby-light)' }}>{order.user.phone}</td>
                      <td style={{ padding: '1rem' }}>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem' }}>
                          {parsedItems.map((item: any) => (
                            <li key={item.id}>{item.qty || item.quantity}x {item.name}</li>
                          ))}
                        </ul>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 'bold' }}>₹{order.total}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '999px', 
                          fontSize: '0.75rem',
                          backgroundColor: order.status === 'Preparing' ? 'rgba(255, 215, 0, 0.2)' : 'rgba(76, 175, 80, 0.2)',
                          color: order.status === 'Preparing' ? '#FFD700' : '#4CAF50'
                        }}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
