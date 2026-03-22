'use server'

import prisma from '@/lib/prisma'

export async function getRestaurants() {
  try {
    const restaurants = await prisma.restaurant.findMany()
    return restaurants
  } catch (error: any) {
    console.error('DATABASE_ERROR [getRestaurants]:', error.message)
    return []
  }
}

export async function getRestaurantById(id: string) {
  return await prisma.restaurant.findUnique({
    where: { id },
    include: { menu: true }
  })
}

export async function placeOrder(
  email: string, 
  total: number, 
  items: string,
  customerName?: string,
  customerPhone?: string,
  deliveryAddress?: string,
  restaurantName?: string
) {
  const finalEmail = email || 'guest@rubyspeed.com'
  let user = await prisma.user.findUnique({ where: { email: finalEmail } })
  if (!user) {
    user = await prisma.user.create({ data: { email: finalEmail } })
  }
  
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      total,
      items,
      customerName,
      customerPhone,
      deliveryAddress,
      restaurantName
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
          content: `🚀 **New Order Received!**\n` + 
                   `**Restaurant:** ${restaurantName || 'N/A'}\n` +
                   `**Customer:** ${customerName || finalEmail}\n` +
                   `**Phone:** ${customerPhone || 'N/A'}\n` +
                   `**Address:** ${deliveryAddress || 'N/A'}\n` +
                   `**Total:** ₹${total}\n` +
                   `[View in Admin Dashboard](${process.env.NEXTAUTH_URL}/admin)`
        })
      })
    } catch (e) {
      console.error('Failed to send notification:', e)
    }
  }
  
  return order
}

export async function getOrders() {
  try {
    return await prisma.order.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error: any) {
    console.error('DATABASE_ERROR [getOrders]:', error.message)
    return []
  }
}

export async function testConnection() {
  try {
    await prisma.$connect()
    const count = await prisma.restaurant.count()
    return { success: true, count, message: 'Connected to Supabase!' }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
