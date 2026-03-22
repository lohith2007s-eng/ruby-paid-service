'use client'

import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function LoginModal() {
  const { isModalOpen, closeModal, login } = useAuth()
  const [step, setStep] = useState<1 | 2>(1)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')

  if (!isModalOpen) return null

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length >= 10) {
      setStep(2)
      // In a real app, this would trigger an SMS API.
    } else {
      alert('Please enter a valid mobile number')
    }
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length === 4) {
      login(phone)
      setStep(1)
      setPhone('')
      setOtp('')
    } else {
      alert('Invalid OTP. Please enter 4 digits (e.g. 1234).')
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        padding: '3rem', maxWidth: '400px', width: '90%', position: 'relative'
      }}>
        <button 
          onClick={closeModal}
          style={{ position: 'absolute', top: '1rem', right: '1.5rem', color: 'var(--text-secondary)', fontSize: '1.5rem' }}
        >
          ×
        </button>
        
        <h2 className="gradient-text" style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
          {step === 1 ? 'Welcome Back' : 'Verify Phone'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
          {step === 1 ? 'Enter your mobile number to sign in or create an account.' : 'We sent a 4-digit code to ' + phone}
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="tel" 
              placeholder="Mobile Number (e.g. 9876543210)" 
              className="input-glass" 
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\\D/g, '').slice(0, 10))}
              required
            />
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Send OTP</button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Enter 4-digit OTP" 
              className="input-glass" 
              style={{ letterSpacing: '0.5rem', textAlign: 'center', fontSize: '1.5rem' }}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\\D/g, '').slice(0, 4))}
              required
            />
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Verify & Sign In</button>
            <button type="button" onClick={() => setStep(1)} style={{ color: 'var(--ruby-light)', fontSize: '0.875rem', marginTop: '1rem' }}>
              Change Phone Number
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
