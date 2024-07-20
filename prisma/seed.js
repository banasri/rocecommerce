import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const products = Array.from({ length: 100 }, () => ({
    name: faker.commerce.productName(),
    short_name: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
  }));

  await prisma.product.createMany({
    data: products,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
