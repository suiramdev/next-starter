import { prisma } from "./prisma";

async function main() {
  console.log("🌱 Seeding database...");

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
