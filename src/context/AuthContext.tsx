'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type AuthContextType = {
  isLoggedIn: boolean
  phoneNumber: string | null
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
  login: (phone: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [phoneNumber, setPhoneNumber] = useState<string | null>('GUEST-PHONE')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {} // Disable login modal
  const closeModal = () => setIsModalOpen(false)
  
  const login = (phone: string) => {
    setPhoneNumber(phone)
    setIsLoggedIn(true)
    setIsModalOpen(false)
  }

  const logout = () => {
    setPhoneNumber(null)
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, phoneNumber, isModalOpen, openModal, closeModal, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
