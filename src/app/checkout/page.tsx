'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useSession, signIn } from 'next-auth/react'
import { placeOrder } from '@/app/actions'

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [orderId, setOrderId] = useState<string | null>(null)
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { data: session } = useSession()
  const isLoggedIn = true // !!session?.user
  const email = session?.user?.email || 'guest@rubyspeed.com'

  const subtotal = getCartTotal()
  const deliveryFee = 40
  const taxes = Math.round(subtotal * 0.05)
  const total = subtotal + deliveryFee + taxes

  return (
    <div className="container section" style={{ marginTop: '5rem' }}>
      <h1 className="gradient-text" style={{ marginBottom: '2rem' }}>Checkout</h1>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
        <div style={{ flex: '1 1 60%' }}>
          {!isLoggedIn ? (
            <div className="glass-panel animate-fade-in" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
              <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Sign In Required</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                You must be signed in to place an order.
              </p>
              <button className="btn-primary" onClick={() => signIn('google')}>Sign In with Google</button>
            </div>
          ) : step === 1 ? (
            <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Delivery Details</h2>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <input type="text" placeholder="Full Name" className="input-glass" />
                <input type="text" placeholder="Phone Number" className="input-glass" />
                <textarea placeholder="Delivery Address" className="input-glass" style={{ minHeight: '100px', resize: 'vertical' }} />
                <button className="btn-primary" onClick={() => setStep(2)}>Continue to Payment</button>
              </div>
            </div>
          ) : step === 2 ? (
            <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Payment Method</h2>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ padding: '1rem', border: '1px solid var(--ruby-light)', borderRadius: '12px', background: 'rgba(211, 47, 47, 0.1)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="payment" defaultChecked /> Cash on Delivery (COD)
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button className="btn-secondary" onClick={() => setStep(1)}>Back</button>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={async () => { 
                    if (!email) return;
                    const order = await placeOrder(email, total, JSON.stringify(cartItems));
                    setOrderId(order.id);
                    clearCart(); 
                    setStep(3); 
                  }}>Pay ₹{total}</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel animate-fade-in" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚀</div>
              <h2 style={{ marginBottom: '1rem', color: 'var(--ruby-light)' }}>Order Confirmed!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Your food is being prepared. Our delivery partner will pick it up shortly.
              </p>
              <div className="glass-panel" style={{ padding: '2rem', display: 'inline-block', textAlign: 'left', minWidth: '300px' }}>
                <h4 style={{ marginBottom: '1rem' }}>Order #{orderId?.slice(-6).toUpperCase() || 'RB-9024'}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                  <span style={{ color: '#FFD700', fontWeight: 'bold' }}>Preparing</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Estimated Time:</span>
                  <span>25 Mins</span>
                </div>
              </div>
              <div style={{ marginTop: '3rem' }}>
                <Link href="/" className="btn-primary">Return Home</Link>
              </div>
            </div>
          )}
        </div>
        
        <div style={{ flex: '1 1 35%' }}>
          <div className="glass-panel sticky" style={{ padding: '2rem', position: 'sticky', top: '7rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Your Order</h2>
            {cartItems.length === 0 ? (
               <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Your cart is empty.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{item.qty}x</span>
                      <span>{item.name}</span>
                    </div>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Delivery Partner Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Taxes</span>
                <span>₹{taxes}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', fontSize: '1.25rem', fontWeight: 600 }}>
                <span>Total</span>
                <span style={{ color: 'var(--ruby-light)' }}>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
