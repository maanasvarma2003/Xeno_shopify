const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedInitialData() {
    console.log('🌱 Seeding initial data...');

    // Create demo tenant
    const tenant = await prisma.tenant.upsert({
        where: { shopifyDomain: 'demo' },
        update: {},
        create: {
            id: 'demo_tenant',
            name: 'Demo Store',
            shopifyDomain: 'demo',
            accessToken: 'demo_token'
        }
    });

    console.log('✅ Demo tenant created:', tenant.id);

    // Check if data already exists
    const existingProducts = await prisma.product.count({ where: { tenantId: tenant.id } });

    if (existingProducts > 0) {
        console.log('📊 Data already exists. Skipping seed.');
        return;
    }

    console.log('📦 Creating comprehensive dummy data...');

    // Import the ingestion service
    const { addJob } = require('./src/services/ingestion');

    // Trigger data sync
    addJob('SYNC_SHOPIFY', tenant.id);

    console.log('🚀 Data sync job queued! Wait 5 seconds for completion...');

    // Wait for async job to complete
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('✅ Seed complete!');
}

seedInitialData()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
