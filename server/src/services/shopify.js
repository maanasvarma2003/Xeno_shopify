const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function ingestData(tenantId) {
    console.log(`Starting ingestion for tenant ${tenantId}`);

    // In a real scenario, we would fetch credentials for tenantId
    // const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });

    // SIMULATION: Generate dummy data
    try {
        const dummyCustomers = Array.from({ length: 5 }).map((_, i) => ({
            shopifyId: `cust_${Date.now()}_${i}`,
            email: `customer${Math.floor(Math.random() * 1000)}@example.com`,
            firstName: `Customer`,
            lastName: `${Math.floor(Math.random() * 1000)}`,
            totalSpent: parseFloat((Math.random() * 1000).toFixed(2)),
            ordersCount: Math.floor(Math.random() * 10),
            tenantId
        }));

        for (const cust of dummyCustomers) {
            // Upsert to avoid duplicates in demo
            await prisma.customer.upsert({
                where: { tenantId_shopifyId: { tenantId, shopifyId: cust.shopifyId } },
                update: cust,
                create: cust
            });
        }

        const dummyOrders = Array.from({ length: 10 }).map((_, i) => ({
            shopifyId: `ord_${Date.now()}_${i}`,
            orderNumber: 1000 + Math.floor(Math.random() * 10000),
            totalPrice: parseFloat((Math.random() * 200).toFixed(2)),
            currency: 'USD',
            financialStatus: Math.random() > 0.2 ? 'paid' : 'pending',
            tenantId,
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }));

        for (const ord of dummyOrders) {
            await prisma.order.create({
                data: ord
            });
        }

        console.log(`Ingestion complete for tenant ${tenantId}`);
    } catch (err) {
        console.error("Ingestion error:", err);
    }
}

module.exports = { ingestData };
