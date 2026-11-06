const { PrismaClient } = require("@prisma/client");
const { randomBytes, scryptSync } = require("crypto");

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

function atUtc(daysFromToday, hour) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + daysFromToday);
  date.setUTCHours(hour);
  return date;
}

async function main() {
  await prisma.admin.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash: hashPassword("admin123"),
    },
  });

  const products = [
    {
      name: "Yamaha Recording Custom 14x5.5",
      slug: "yamaha-recording-custom-14x55",
      brand: "Yamaha",
      category: "Snare drums",
      price: "42000",
      condition: "USED",
      status: "AVAILABLE",
      description: "Стальной малый барабан в отличном состоянии.",
      specifications: { size: "14x5.5", shell: "steel", finish: "black" },
      image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=1200",
    },
    {
      name: "Gretsch Catalina Club Jazz",
      slug: "gretsch-catalina-club-jazz",
      brand: "Gretsch",
      category: "Drum kits",
      price: "98000",
      condition: "USED",
      status: "AVAILABLE",
      description: "Компактная установка для джаза и небольших сцен.",
      specifications: { configuration: "18/12/14", shell: "poplar", color: "silver" },
      image: "https://images.unsplash.com/photo-1543443258-92b04ad5ecb9?w=1200",
    },
    {
      name: "Zildjian K Custom Ride 20",
      slug: "zildjian-k-custom-ride-20",
      brand: "Zildjian",
      category: "Cymbals",
      price: "36500",
      condition: "USED",
      status: "AVAILABLE",
      description: "Тёмный райд с плотной атакой и контролируемым сустейном.",
      specifications: { size: "20 inch", series: "K Custom", weight: "medium-heavy" },
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200",
    },
    {
      name: "Roland TD-17KVX2",
      slug: "roland-td-17kvx2",
      brand: "Roland",
      category: "Electronic drums",
      price: "185000",
      condition: "NEW",
      status: "AVAILABLE",
      description: "Электронная установка для занятий дома и записи.",
      specifications: { pads: 6, module: "TD-17", connectivity: "Bluetooth" },
      image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200",
    },
    {
      name: "Tama Iron Cobra 900",
      slug: "tama-iron-cobra-900",
      brand: "Tama",
      category: "Hardware",
      price: "27500",
      condition: "USED",
      status: "SOLD",
      description: "Надёжная педаль с плавным ходом.",
      specifications: { drive: "double chain", series: "Iron Cobra 900" },
      image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=1200",
    },
  ];

  for (const item of products) {
    const category = await prisma.category.upsert({
      where: { name: item.category },
      update: {},
      create: {
        name: item.category,
        slug: item.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      },
    });
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        brand: item.brand,
        categoryId: category.id,
        price: item.price,
        condition: item.condition,
        status: item.status,
        description: item.description,
        specifications: item.specifications,
      },
      create: {
        name: item.name,
        slug: item.slug,
        brand: item.brand,
        categoryId: category.id,
        price: item.price,
        condition: item.condition,
        status: item.status,
        description: item.description,
        specifications: item.specifications,
      },
    });

    const existingImage = await prisma.productImage.findFirst({ where: { productId: product.id, position: 0 } });
    if (existingImage) {
      await prisma.productImage.update({ where: { id: existingImage.id }, data: { url: item.image } });
    } else {
      await prisma.productImage.create({ data: { productId: product.id, url: item.image, position: 0 } });
    }
  }

  const points = [
    {
      name: "Ковры — Центр",
      slug: "kovry-center",
      address: "Москва, ул. Большая Никитская, 24",
      description: "Светлая комната для репетиций и записи демо.",
      equipment: "Барабаны, басовый комбо, гитарный комбо, вокальная система",
      contactPhone: "+7 999 123-45-67",
      pricePerHour: "1800",
    },
    {
      name: "Ковры — Север",
      slug: "kovry-north",
      address: "Москва, ул. Нижняя Масловка, 8",
      description: "Просторная комната для громких репетиций и больших составов.",
      equipment: "Барабаны, 2 гитарных комбо, басовый комбо, PA",
      contactPhone: "+7 999 765-43-21",
      pricePerHour: "2200",
    },
  ];

  for (const pointData of points) {
    const point = await prisma.rehearsalPoint.upsert({
      where: { slug: pointData.slug },
      update: pointData,
      create: pointData,
    });

    for (let day = 1; day <= 3; day += 1) {
      for (const hour of [12, 14, 16, 18, 20]) {
        const startAt = atUtc(day, hour);
        const endAt = new Date(startAt.getTime() + 90 * 60 * 1000);
        const status = day === 1 && hour === 16 ? "BOOKED" : day === 2 && hour === 18 ? "BLOCKED" : "AVAILABLE";
        await prisma.timeSlot.upsert({
          where: { rehearsalPointId_startAt: { rehearsalPointId: point.id, startAt } },
          update: { endAt, status },
          create: { rehearsalPointId: point.id, startAt, endAt, status },
        });
      }
    }
  }

  const bookedSlot = await prisma.timeSlot.findFirst({ where: { status: "BOOKED" }, orderBy: { startAt: "asc" } });
  if (bookedSlot) {
    const existing = await prisma.rehearsalBooking.findFirst({ where: { comment: "Seed booking: demo confirmed" } });
    if (!existing) {
      await prisma.rehearsalBooking.create({
        data: {
          timeSlotId: bookedSlot.id,
          customerName: "Иван Петров",
          customerPhone: "+7 900 000-00-01",
          customerEmail: "ivan@example.com",
          comment: "Seed booking: demo confirmed",
          personalDataConsent: true,
          status: "CONFIRMED",
        },
      });
    }
  }

  const pendingSlot = await prisma.timeSlot.findFirst({ where: { status: "AVAILABLE" }, orderBy: { startAt: "desc" } });
  if (pendingSlot) {
    const existing = await prisma.rehearsalBooking.findFirst({ where: { comment: "Seed booking: demo pending" } });
    if (!existing) {
      await prisma.rehearsalBooking.create({
        data: {
          timeSlotId: pendingSlot.id,
          customerName: "Анна Смирнова",
          customerPhone: "+7 900 000-00-02",
          customerEmail: "anna@example.com",
          comment: "Seed booking: demo pending",
          personalDataConsent: true,
          status: "PENDING",
        },
      });
    }
  }

  console.log("Seed data inserted successfully.");
  console.log("Admin login: admin@example.com / admin123");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
});
