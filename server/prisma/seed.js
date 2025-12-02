const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const tenants = [
    { name: 'Demo Store', shopifyDomain: 'demo', accessToken: 'shpat_1234567890' }
];

const customers = [
    { shopifyId: 'c1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', totalSpent: 150.00, ordersCount: 2 },
    { shopifyId: 'c2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', totalSpent: 450.50, ordersCount: 5 },
    { shopifyId: 'c3', firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com', totalSpent: 89.99, ordersCount: 1 },
    { shopifyId: 'c4', firstName: 'Bob', lastName: 'Brown', email: 'bob@example.com', totalSpent: 1200.00, ordersCount: 12 },
    { shopifyId: 'c5', firstName: 'Charlie', lastName: 'Davis', email: 'charlie@example.com', totalSpent: 0.00, ordersCount: 0 },
    { shopifyId: 'c6', firstName: 'Diana', lastName: 'Evans', email: 'diana@example.com', totalSpent: 300.00, ordersCount: 3 },
    { shopifyId: 'c7', firstName: 'Evan', lastName: 'Foster', email: 'evan@example.com', totalSpent: 55.00, ordersCount: 1 },
    { shopifyId: 'c8', firstName: 'Fiona', lastName: 'Green', email: 'fiona@example.com', totalSpent: 750.00, ordersCount: 8 },
    { shopifyId: 'c9', firstName: 'George', lastName: 'Harris', email: 'george@example.com', totalSpent: 220.00, ordersCount: 2 },
    { shopifyId: 'c10', firstName: 'Hannah', lastName: 'Irwin', email: 'hannah@example.com', totalSpent: 99.99, ordersCount: 1 },
    { shopifyId: 'c11', firstName: 'Ian', lastName: 'Jones', email: 'ian@example.com', totalSpent: 500.00, ordersCount: 4 },
    { shopifyId: 'c12', firstName: 'Julia', lastName: 'King', email: 'julia@example.com', totalSpent: 120.00, ordersCount: 2 },
    { shopifyId: 'c13', firstName: 'Kevin', lastName: 'Lee', email: 'kevin@example.com', totalSpent: 350.00, ordersCount: 3 },
    { shopifyId: 'c14', firstName: 'Laura', lastName: 'Miller', email: 'laura@example.com', totalSpent: 600.00, ordersCount: 6 },
    { shopifyId: 'c15', firstName: 'Mike', lastName: 'Nelson', email: 'mike@example.com', totalSpent: 45.00, ordersCount: 1 },
    { shopifyId: 'c16', firstName: 'Nina', lastName: 'Owens', email: 'nina@example.com', totalSpent: 800.00, ordersCount: 7 },
    { shopifyId: 'c17', firstName: 'Oscar', lastName: 'Perry', email: 'oscar@example.com', totalSpent: 250.00, ordersCount: 3 },
    { shopifyId: 'c18', firstName: 'Paula', lastName: 'Quinn', email: 'paula@example.com', totalSpent: 150.00, ordersCount: 2 },
    { shopifyId: 'c19', firstName: 'Quincy', lastName: 'Roberts', email: 'quincy@example.com', totalSpent: 900.00, ordersCount: 9 },
    { shopifyId: 'c20', firstName: 'Rachel', lastName: 'Scott', email: 'rachel@example.com', totalSpent: 110.00, ordersCount: 1 },
];

const products = [
    { shopifyId: 'p1', title: 'Classic T-Shirt', vendor: 'FashionCo', productType: 'Apparel' },
    { shopifyId: 'p2', title: 'Running Shoes', vendor: 'Sporty', productType: 'Footwear' },
    { shopifyId: 'p3', title: 'Leather Wallet', vendor: 'LuxeLeather', productType: 'Accessories' },
    { shopifyId: 'p4', title: 'Denim Jeans', vendor: 'FashionCo', productType: 'Apparel' },
    { shopifyId: 'p5', title: 'Sunglasses', vendor: 'SunShades', productType: 'Accessories' },
    { shopifyId: 'p6', title: 'Hoodie', vendor: 'FashionCo', productType: 'Apparel' },
    { shopifyId: 'p7', title: 'Sneakers', vendor: 'Sporty', productType: 'Footwear' },
    { shopifyId: 'p8', title: 'Watch', vendor: 'TimeKeepers', productType: 'Accessories' },
    { shopifyId: 'p9', title: 'Backpack', vendor: 'TravelGear', productType: 'Accessories' },
    { shopifyId: 'p10', title: 'Socks', vendor: 'CozyFeet', productType: 'Apparel' },
];

const orders = [
    { shopifyId: 'o1', orderNumber: 1001, totalPrice: 50.00, currency: 'USD', financialStatus: 'paid', customerIndex: 0 },
    { shopifyId: 'o2', orderNumber: 1002, totalPrice: 120.00, currency: 'USD', financialStatus: 'paid', customerIndex: 1 },
    { shopifyId: 'o3', orderNumber: 1003, totalPrice: 89.99, currency: 'USD', financialStatus: 'pending', customerIndex: 2 },
    { shopifyId: 'o4', orderNumber: 1004, totalPrice: 200.00, currency: 'USD', financialStatus: 'paid', customerIndex: 3 },
    { shopifyId: 'o5', orderNumber: 1005, totalPrice: 150.00, currency: 'USD', financialStatus: 'refunded', customerIndex: 5 },
    { shopifyId: 'o6', orderNumber: 1006, totalPrice: 55.00, currency: 'USD', financialStatus: 'paid', customerIndex: 6 },
    { shopifyId: 'o7', orderNumber: 1007, totalPrice: 300.00, currency: 'USD', financialStatus: 'paid', customerIndex: 7 },
    { shopifyId: 'o8', orderNumber: 1008, totalPrice: 110.00, currency: 'USD', financialStatus: 'paid', customerIndex: 8 },
    { shopifyId: 'o9', orderNumber: 1009, totalPrice: 99.99, currency: 'USD', financialStatus: 'pending', customerIndex: 9 },
    { shopifyId: 'o10', orderNumber: 1010, totalPrice: 250.00, currency: 'USD', financialStatus: 'paid', customerIndex: 10 },
    { shopifyId: 'o11', orderNumber: 1011, totalPrice: 60.00, currency: 'USD', financialStatus: 'paid', customerIndex: 11 },
    { shopifyId: 'o12', orderNumber: 1012, totalPrice: 175.00, currency: 'USD', financialStatus: 'paid', customerIndex: 12 },
    { shopifyId: 'o13', orderNumber: 1013, totalPrice: 400.00, currency: 'USD', financialStatus: 'paid', customerIndex: 13 },
    { shopifyId: 'o14', orderNumber: 1014, totalPrice: 45.00, currency: 'USD', financialStatus: 'paid', customerIndex: 14 },
    { shopifyId: 'o15', orderNumber: 1015, totalPrice: 350.00, currency: 'USD', financialStatus: 'paid', customerIndex: 15 },
    { shopifyId: 'o16', orderNumber: 1016, totalPrice: 125.00, currency: 'USD', financialStatus: 'paid', customerIndex: 16 },
    { shopifyId: 'o17', orderNumber: 1017, totalPrice: 75.00, currency: 'USD', financialStatus: 'pending', customerIndex: 17 },
    { shopifyId: 'o18', orderNumber: 1018, totalPrice: 500.00, currency: 'USD', financialStatus: 'paid', customerIndex: 18 },
    { shopifyId: 'o19', orderNumber: 1019, totalPrice: 110.00, currency: 'USD', financialStatus: 'paid', customerIndex: 19 },
    { shopifyId: 'o20', orderNumber: 1020, totalPrice: 100.00, currency: 'USD', financialStatus: 'paid', customerIndex: 0 },
];

async function main() {
    console.log('Start seeding ...');

    // Create Tenant
    const tenant = await prisma.tenant.upsert({
        where: { shopifyDomain: tenants[0].shopifyDomain },
        update: {},
        create: tenants[0],
    });
    console.log(`Created tenant: ${tenant.name}`);

    // Create Customers
    for (const c of customers) {
        await prisma.customer.upsert({
            where: { tenantId_shopifyId: { tenantId: tenant.id, shopifyId: c.shopifyId } },
            update: {},
            create: { ...c, tenantId: tenant.id },
        });
    }
    console.log(`Seeded ${customers.length} customers`);

    // Create Products
    for (const p of products) {
        await prisma.product.upsert({
            where: { tenantId_shopifyId: { tenantId: tenant.id, shopifyId: p.shopifyId } },
            update: {},
            create: { ...p, tenantId: tenant.id },
        });
    }
    console.log(`Seeded ${products.length} products`);

    // Create Orders
    for (const o of orders) {
        const customer = await prisma.customer.findFirst({
            where: { shopifyId: customers[o.customerIndex].shopifyId, tenantId: tenant.id }
        });

        if (customer) {
            // Check if order exists to avoid duplicates in run
            const existingOrder = await prisma.order.findUnique({
                where: { tenantId_shopifyId: { tenantId: tenant.id, shopifyId: o.shopifyId } }
            });

            if (!existingOrder) {
                await prisma.order.create({
                    data: {
                        shopifyId: o.shopifyId,
                        orderNumber: o.orderNumber,
                        totalPrice: o.totalPrice,
                        currency: o.currency,
                        financialStatus: o.financialStatus,
                        tenantId: tenant.id,
                        customerId: customer.id
                    }
                });
            }
        }
    }
    console.log(`Seeded ${orders.length} orders`);

    // Create Custom Events (Bonus)
    const eventTypes = ['CART_ABANDONED', 'CHECKOUT_STARTED', 'PRODUCT_VIEWED'];
    for (let i = 0; i < 20; i++) {
        const randomCustomerIndex = Math.floor(Math.random() * customers.length);
        const customer = await prisma.customer.findFirst({
            where: { shopifyId: customers[randomCustomerIndex].shopifyId, tenantId: tenant.id }
        });

        if (customer) {
            await prisma.event.create({
                data: {
                    type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
                    payload: JSON.stringify({ url: '/checkout', timestamp: new Date().toISOString() }),
                    tenantId: tenant.id,
                    customerId: customer.id
                }
            });
        }
    }
    console.log('Seeded 20 custom events');

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
