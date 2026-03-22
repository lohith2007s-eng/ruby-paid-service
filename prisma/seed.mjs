import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
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
          { id: '1-2', name: 'Chicken Lollipop', price: '155', img: '/images/lchicken_lollipop.jpg', desc: 'Crispy fried chicken wings.' },
          { id: '1-3', name: 'Chicken Kabab', price: '110', img: '/images/chicken kabab.jpg', desc: 'Juicy skewered chicken.' },
          { id: '1-4', name: 'Pudina Kabab', price: '160', img: '/images/pudina kabab.jpg', desc: 'Mint flavored tender chicken skewers.' },
          { id: '1-5', name: 'Chicken Leg Piece', price: '70', img: '/images/chicken leg piece.jpg', desc: 'Spiced and roasted leg piece.' },
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
          { id: '2-1', name: 'Masale Puri', price: '45', img: '/images/masale puri.jpg', desc: 'Crushed puris with spicy peas gravy.' },
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
      img: '/images/dry gobi.jpg',
      tags: 'Chinese • Spicy',
      menu: {
        create: [
          { id: '3-1', name: 'Dry Gobi', price: 'Full ₹90 | Half ₹50', img: '/images/dry gobi.jpg', desc: 'Crispy fried cauliflower florets tossed in spices.' },
          { id: '3-2', name: 'Gobi Manchurian', price: 'Full ₹90 | Half ₹50', img: '/images/gobi manchurian.jpg', desc: 'Cauliflower tossed in soy, tomato, and chili sauces.' },
          { id: '3-3', name: 'Mashroom Pepper Dry', price: 'Full ₹130 | Half ₹70', img: '/images/mashroom pepper dry.jpg', desc: 'Mushrooms stir-fried with cracked black pepper.' },
        ]
      }
    }
  })

  console.log('Seed completed successfully')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
