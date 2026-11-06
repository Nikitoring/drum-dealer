const { PrismaClient } = require('@prisma/client');
const { randomBytes, scryptSync } = require('node:crypto');

const email = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD ?? '';

if (!email || !email.includes('@') || password.length < 12) {
  throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (minimum 12 characters).');
}

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) throw new Error(`Admin ${email} already exists.`);

  const salt = randomBytes(16).toString('hex');
  const passwordHash = `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
  await prisma.admin.create({ data: { email, passwordHash } });
  process.stdout.write(`Admin ${email} created.\n`);
}

main()
  .catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
