'use server'

import prisma from '@/lib/prisma'

export async function getRestaurants() {
  return await prisma.restaurant.findMany()
}

export async function getRestaurantById(id: string) {
  return await prisma.restaurant.findUnique({
    where: { id },
    include: { menu: true }
  })
}

export async function placeOrder(email: string, total: number, items: string) {
  const finalEmail = email || 'guest@rubyspeed.com'
  let user = await prisma.user.findUnique({ where: { email: finalEmail } })
  if (!user) {
    user = await prisma.user.create({ data: { email: finalEmail } })
  }
  
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      total,
      items
    }
  })
  
  // Notification logic
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🚀 **New Order Received!**\n**Customer:** ${finalEmail}\n**Total:** ₹${total}\n**Items:** ${items}\n[View in Admin Dashboard](${process.env.NEXTAUTH_URL}/admin)`
        })
      })
    } catch (e) {
      console.error('Failed to send notification:', e)
    }
  }
  
  return order
}

export async function getOrders() {
  return await prisma.order.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  })
}
