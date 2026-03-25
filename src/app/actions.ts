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

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    return await prisma.order.update({
      where: { id: orderId },
      data: { status }
    })
  } catch (error: any) {
    console.error('DATABASE_ERROR [updateOrderStatus]:', error.message)
    throw error
  }
}

export async function runSeed() {
  try {
    // Manually include the seeding logic here or trigger it
    // For simplicity, we can do a subset or just a log for now, 
    // but the best way is to actually run the prisma seed logic if possible.
    // Since we want to definitely add the restaurants:
    
    await prisma.menuItem.deleteMany()
    await prisma.restaurant.deleteMany()

    const r1 = await prisma.restaurant.create({
      data: {
        id: '1',
        name: 'Mahesh Mane Biriyani',
        rating: 4.9,
        time: '25-30 min',
        img: '/images/chicken_biriyani.jpg',
        tags: 'Indian • Biriyani',
        menu: {
          create: [
            { id: '1-1', name: 'Chicken Biriyani', price: '120', img: '/images/chicken_biriyani.jpg', desc: 'Authentic Indian spiced rice.' },
            { id: '1-2', name: 'Chicken Lollipop', price: '155', img: '/images/chicken_lollipop.jpg', desc: 'Crispy fried chicken wings.' },
            { id: '1-3', name: 'Chicken Kabab', price: '110', img: '/images/chicken_kabab.jpg', desc: 'Juicy skewered chicken.' },
            { id: '1-4', name: 'Pudina Kabab', price: '160', img: '/images/pudina_kabab.jpg', desc: 'Mint flavored tender chicken skewers.' },
            { id: '1-5', name: 'Chicken Leg Piece', price: '70', img: '/images/chicken_leg_piece.jpg', desc: 'Spiced and roasted leg piece.' },
          ]
        }
      }
    })

    const r2 = await prisma.restaurant.create({
      data: {
        id: '2',
        name: 'Bangarpete Panipuri',
        rating: 4.8,
        time: '15-20 min',
        img: '/images/panipuri.jpg',
        tags: 'Street Food • Snacks',
        menu: {
          create: [
            { id: '2-1', name: 'Masale Puri', price: '45', img: '/images/masale_puri.jpg', desc: 'Crushed puris with spicy peas gravy.' },
            { id: '2-2', name: 'Panipuri', price: '45', img: '/images/panipuri.jpg', desc: 'Crispy hollow puris filled with tangy water.' },
            { id: '2-3', name: 'Sevpuri', price: '55', img: '/images/sevpuri.jpg', desc: 'Puris topped with potatoes, chutneys, and sev.' },
            { id: '2-4', name: 'Bhelpuri', price: '55', img: '/images/bhelpuri.jpg', desc: 'Puffed rice, vegetables, and tangy tamarind sauce.' },
          ]
        }
      }
    })

    const r3 = await prisma.restaurant.create({
      data: {
        id: '3',
        name: 'Kalabhairavva Dry Gobi',
        rating: 4.7,
        time: '20-25 min',
        img: '/images/dry_gobi.jpg',
        tags: 'Chinese • Spicy',
        menu: {
          create: [
            { id: '3-1', name: 'Dry Gobi', price: 'Full ₹90 | Half ₹50', img: '/images/dry_gobi.jpg', desc: 'Crispy fried cauliflower florets tossed in spices.' },
            { id: '3-2', name: 'Gobi Manchurian', price: 'Full ₹90 | Half ₹50', img: '/images/gobi_manchurian.jpg', desc: 'Cauliflower tossed in soy, tomato, and chili sauces.' },
            { id: '3-3', name: 'Mushroom Pepper Dry', price: 'Full ₹130 | Half ₹70', img: '/images/mushroom_pepper_dry.jpg', desc: 'Mushrooms stir-fried with cracked black pepper.' },
          ]
        }
      }
    })

    const r4 = await prisma.restaurant.create({
      data: {
        id: '4',
        name: 'Harsha Cafe Mandya',
        rating: 4.8,
        time: '20-25 min',
        img: '/images/mini_masala_dosa.jpg',
        tags: 'Indian • South Indian',
        menu: {
          create: [
            { id: '4-1', name: 'Mini Masala Dosa Single', price: '40', img: '/images/mini_masala_dosa.jpg', desc: 'Delicious small masala dosa.' },
            { id: '4-2', name: 'Set Dosa', price: '60', img: '/images/set_dosa.jpg', desc: 'Spongey set of doses served with chutney and sagu.' },
            { id: '4-3', name: 'Rava Idli', price: '65', img: '/images/rava_idli.jpg', desc: 'Steamed semolina cake with veggies.' },
            { id: '4-4', name: 'Kesari Bath', price: '35', img: '/images/kesari_bath.jpg', desc: 'Sweet semolina dessert.' },
            { id: '4-5', name: 'Khara Bath', price: '40', img: '/images/khara_bath.jpg', desc: 'Savory semolina porridge.' },
            { id: '4-6', name: 'Chow Chow Bath', price: '56', img: '/images/chow_chow_bath.jpg', desc: 'Combination of Kesari Bath and Khara Bath.' },
          ]
        }
      }
    })

    const r5 = await prisma.restaurant.create({
      data: {
        id: '5',
        name: 'Udupi Vaibhav',
        rating: 4.6,
        time: '25-35 min',
        img: '/images/paneer_biriyani.jpg',
        tags: 'Indian • Veg',
        menu: {
          create: [
            { id: '5-1', name: 'Paneer Biriyani', price: '150', img: '/images/paneer_biriyani.jpg', desc: 'Fragrant rice with paneer cubes.' },
            { id: '5-2', name: 'Paneer 65', price: '150', img: '/images/paneer_65.jpg', desc: 'Spicy deep-fried paneer.' },
            { id: '5-3', name: 'Roti (One Plate)', price: '75', img: '/images/roti.jpg', desc: 'Indian flatbread.' },
            { id: '5-4', name: 'Curd Rice', price: '65', img: '/images/curd_rice.jpg', desc: 'Creamy yogurt rice.' },
            { id: '5-5', name: 'Rava Idli', price: '65', img: '/images/rava_idli.jpg', desc: 'South Indian semolina steamed cake.' },
            { id: '5-6', name: 'Veg Palao', price: '135', img: '/images/veg_palao.jpg', desc: 'Spiced vegetable rice.' },
            { id: '5-7', name: 'Pongal', price: '65', img: '/images/pongal.jpg', desc: 'Comforting rice and lentil dish.' },
            { id: '5-8', name: 'Mini Meals', price: '75', img: '/images/mini_meals.jpg', desc: 'Assorted small portions of meals.' },
            { id: '5-9', name: 'Bisi Bele Bath', price: '65', img: '/images/bisi_bele_bath.jpg', desc: 'Spicy lentil rice dish.' },
            { id: '5-10', name: 'Butter Roti (One Plate)', price: '80', img: '/images/butter_roti.jpg', desc: 'Roti with butter.' },
            { id: '5-11', name: 'Veg Noodles', price: '135', img: '/images/veg_noodles.jpg', desc: 'Stir-fried noodles with veggies.' },
            { id: '5-12', name: 'Chow Chow Bath', price: '76', img: '/images/chow_chow_bath.jpg', desc: 'Sweet and savory semolina combo.' },
            { id: '5-13', name: 'Parota', price: '62', img: '/images/parota.jpg', desc: 'Layered flatbread.' },
            { id: '5-14', name: 'Palak Rice', price: '130', img: '/images/palak_rice.jpg', desc: 'Rice cooked with spinach.' },
            { id: '5-15', name: 'Butter Naan', price: '95', img: '/images/butter_naan.jpg', desc: 'Soft leavened bread with butter.' },
            { id: '5-16', name: 'Idli Vada', price: '78', img: '/images/idli_vada.jpg', desc: 'Steamed rice cake and savory donut.' },
            { id: '5-17', name: 'Full Meals', price: '115', img: '/images/full_meals.jpg', desc: 'Complete South Indian meal.' },
            { id: '5-18', name: 'Bonda Soup', price: '48', img: '/images/bonda_soup.jpg', desc: 'Savory fritter in lentil soup.' },
            { id: '5-19', name: 'Rice Bath', price: '70', img: '/images/rice_bath.jpg', desc: 'Flavorful spiced rice.' },
            { id: '5-20', name: 'Mughlai Biriyani', price: '135', img: '/images/mughlai_biriyani.jpg', desc: 'Rich and creamy biriyani.' },
            { id: '5-21', name: 'Mushroom Biriyani', price: '145', img: '/images/mushroom_biriyani.jpg', desc: 'Biriyani with mushrooms.' },
            { id: '5-22', name: 'Butter Roti Curry', price: '140', img: '/images/butter_roti_curry.jpg', desc: 'Butter roti served with curry.' },
            { id: '5-23', name: 'Veg Soup', price: '75', img: '/images/veg_soup.jpg', desc: 'Mixed vegetable soup.' },
            { id: '5-24', name: 'Veg Mushroom Soup', price: '145', img: '/images/veg_mushroom_soup.jpg', desc: 'Creamy mushroom and veg soup.' },
            { id: '5-25', name: 'Mushroom Noodles', price: '150', img: '/images/mushroom_noodles.jpg', desc: 'Noodles with mushrooms.' },
            { id: '5-26', name: 'Butter Kulcha', price: '60', img: '/images/butter_kulcha.jpg', desc: 'Soft bread with butter.' },
            { id: '5-27', name: 'Rava Dosa', price: '100', img: '/images/rava_dosa.jpg', desc: 'Crispy semolina crepe.' },
            { id: '5-28', name: 'Jeera Rice', price: '150', img: '/images/jeera_rice.jpg', desc: 'Cumin flavored rice.' },
            { id: '5-29', name: 'Tomato Soup', price: '100', img: '/images/tomato_soup.jpg', desc: 'Tangy tomato soup.' },
            { id: '5-30', name: 'Mini Dosa', price: '60', img: '/images/mini_dosa.jpg', desc: 'Small size dosa.' },
            { id: '5-31', name: 'North Full Meals', price: '140', img: '/images/north_full_meals.jpg', desc: 'Complete North Indian meal.' },
            { id: '5-32', name: 'Mushroom Rice', price: '130', img: '/images/mushroom_rice.jpg', desc: 'Rice cooked with mushrooms.' },
            { id: '5-33', name: 'Masala Dosa', price: '80', img: '/images/masala_dosa.jpg', desc: 'Dosa with potato filling.' },
            { id: '5-34', name: 'Tandoori Parota', price: '125', img: '/images/tandoori_parota.jpg', desc: 'Parota cooked in tandoor.' },
            { id: '5-35', name: 'Onion Kulcha', price: '90', img: '/images/onion_kulcha.jpg', desc: 'Bread stuffed with onions.' },
            { id: '5-36', name: 'Speacial Dosa', price: '105', img: '/images/speacial_dosa.jpg', desc: 'Chef specialty dosa.' },
            { id: '5-37', name: 'Aloo Parota', price: '90', img: '/images/aloo_parota.jpg', desc: 'Bread stuffed with potatoes.' },
            { id: '5-38', name: 'Mix Veg Curry', price: '180', img: '/images/mix_veg_curry.jpg', desc: 'Mixed vegetables in rich gravy.' },
          ]
        }
      }
    })

    return { success: true, message: 'Database seeded successfully from server!' }
  } catch (error: any) {
    console.error('DATABASE_ERROR [runSeed]:', error.message)
    return { success: false, message: error.message }
  }
}
