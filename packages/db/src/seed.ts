import { PrismaClient } from "./generated/prisma";

// Get database URL from environment variable
const databaseUrl =
  process.env.ZERO_UPSTREAM_DB ||
  "postgresql://postgres:postgres@localhost:5432/postgres";

// Create Prisma client directly for seeding (avoids auth dependency)
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

async function main() {
  console.log("🌱 Seeding database...");
  console.log("📊 Database URL:", databaseUrl.replace(/:[^:@]+@/, ":****@"));

  // Check if organization exists
  let organization = await prisma.organization.findFirst({
    where: {
      name: "Default Organization",
    },
  });

  if (organization) {
    console.log("✅ Organization already exists:", organization);
  } else {
    // Create organization if it doesn't exist
    organization = await prisma.organization.create({
      data: {
        name: "Default Organization",
      },
    });
    console.log("✅ Created organization:", organization);
  }

  const orgCount = await prisma.organization.count();
  console.log(`📈 Total organizations: ${orgCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
