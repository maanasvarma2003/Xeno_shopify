const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Comprehensive dummy data for realistic e-commerce simulation
const PRODUCT_CATEGORIES = {
    Electronics: [
        { title: 'iPhone 15 Pro Max', vendor: 'Apple', price: 1199, compareAtPrice: 1299, inventory: 45, description: 'Latest flagship smartphone with A17 Pro chip' },
        { title: 'Samsung Galaxy S24 Ultra', vendor: 'Samsung', price: 1099, compareAtPrice: 1199, inventory: 38, description: 'Premium Android flagship with S Pen' },
        { title: 'MacBook Pro 16"', vendor: 'Apple', price: 2499, compareAtPrice: 2699, inventory: 22, description: 'M3 Max chip, 36GB RAM, 1TB SSD' },
        { title: 'Dell XPS 15', vendor: 'Dell', price: 1899, compareAtPrice: 2099, inventory: 18, description: 'Intel i9, 32GB RAM, 4K OLED display' },
        { title: 'Sony WH-1000XM5', vendor: 'Sony', price: 399, compareAtPrice: 449, inventory: 67, description: 'Industry-leading noise cancellation headphones' },
        { title: 'AirPods Pro 2', vendor: 'Apple', price: 249, compareAtPrice: 279, inventory: 89, description: 'Active noise cancellation with USB-C' },
        { title: 'iPad Air M2', vendor: 'Apple', price: 599, compareAtPrice: 649, inventory: 54, description: '11-inch Liquid Retina display' },
        { title: 'Apple Watch Ultra 2', vendor: 'Apple', price: 799, compareAtPrice: 849, inventory: 31, description: 'Rugged titanium smartwatch' },
    ],
    Fashion: [
        { title: 'Nike Air Max 270', vendor: 'Nike', price: 150, compareAtPrice: 180, inventory: 120, description: 'Lifestyle sneakers with Max Air unit' },
        { title: 'Adidas Ultraboost 23', vendor: 'Adidas', price: 190, compareAtPrice: 220, inventory: 95, description: 'Premium running shoes' },
        { title: 'Levi\'s 501 Original Jeans', vendor: 'Levi\'s', price: 98, compareAtPrice: 128, inventory: 200, description: 'Classic straight fit denim' },
        { title: 'North Face Jacket', vendor: 'The North Face', price: 299, compareAtPrice: 349, inventory: 76, description: 'Waterproof insulated jacket' },
        { title: 'Ray-Ban Aviator', vendor: 'Ray-Ban', price: 154, compareAtPrice: 189, inventory: 143, description: 'Classic pilot sunglasses' },
        { title: 'Timex Weekender', vendor: 'Timex', price: 45, compareAtPrice: 65, inventory: 234, description: 'Casual analog watch' },
    ],
    Home: [
        { title: 'Dyson V15 Detect', vendor: 'Dyson', price: 649, compareAtPrice: 749, inventory: 42, description: 'Cordless vacuum with laser detection' },
        { title: 'Ninja Air Fryer', vendor: 'Ninja', price: 129, compareAtPrice: 159, inventory: 88, description: '6-quart air fryer with dehydrator' },
        { title: 'Instant Pot Duo', vendor: 'Instant Pot', price: 99, compareAtPrice: 129, inventory: 156, description: '7-in-1 electric pressure cooker' },
        { title: 'Philips Hue Starter Kit', vendor: 'Philips', price: 199, compareAtPrice: 229, inventory: 67, description: 'Smart LED lighting system' },
        { title: 'iRobot Roomba j7+', vendor: 'iRobot', price: 799, compareAtPrice: 899, inventory: 34, description: 'Self-emptying robot vacuum' },
    ],
    Beauty: [
        { title: 'Dyson Airwrap', vendor: 'Dyson', price: 599, compareAtPrice: 649, inventory: 28, description: 'Multi-styler hair tool' },
        { title: 'Olaplex Hair Set', vendor: 'Olaplex', price: 88, compareAtPrice: 110, inventory: 145, description: 'Bond building hair care system' },
        { title: 'Fenty Beauty Kit', vendor: 'Fenty', price: 125, compareAtPrice: 155, inventory: 92, description: 'Complete makeup collection' },
        { title: 'La Mer Moisturizer', vendor: 'La Mer', price: 345, compareAtPrice: 395, inventory: 56, description: 'Luxury face cream' },
    ],
    Sports: [
        { title: 'Peloton Bike+', vendor: 'Peloton', price: 2495, compareAtPrice: 2695, inventory: 15, description: 'Interactive fitness bike' },
        { title: 'Bowflex Dumbbells', vendor: 'Bowflex', price: 429, compareAtPrice: 549, inventory: 43, description: 'Adjustable weight set 5-52.5 lbs' },
        { title: 'Yeti Cooler 45', vendor: 'Yeti', price: 325, compareAtPrice: 375, inventory: 67, description: 'Rotomolded cooler' },
        { title: 'GoPro HERO 12', vendor: 'GoPro', price: 399, compareAtPrice: 449, inventory: 78, description: '5.3K action camera' },
    ]
};

const CUSTOMER_NAMES = [
    { firstName: 'Emma', lastName: 'Johnson', city: 'New York', country: 'USA', phone: '+1-555-0101' },
    { firstName: 'Liam', lastName: 'Smith', city: 'Los Angeles', country: 'USA', phone: '+1-555-0102' },
    { firstName: 'Olivia', lastName: 'Williams', city: 'Chicago', country: 'USA', phone: '+1-555-0103' },
    { firstName: 'Noah', lastName: 'Brown', city: 'Houston', country: 'USA', phone: '+1-555-0104' },
    { firstName: 'Ava', lastName: 'Jones', city: 'Phoenix', country: 'USA', phone: '+1-555-0105' },
    { firstName: 'Ethan', lastName: 'Garcia', city: 'Philadelphia', country: 'USA', phone: '+1-555-0106' },
    { firstName: 'Sophia', lastName: 'Miller', city: 'San Antonio', country: 'USA', phone: '+1-555-0107' },
    { firstName: 'Mason', lastName: 'Davis', city: 'San Diego', country: 'USA', phone: '+1-555-0108' },
    { firstName: 'Isabella', lastName: 'Rodriguez', city: 'Dallas', country: 'USA', phone: '+1-555-0109' },
    { firstName: 'William', lastName: 'Martinez', city: 'San Jose', country: 'USA', phone: '+1-555-0110' },
    { firstName: 'Mia', lastName: 'Hernandez', city: 'Austin', country: 'USA', phone: '+1-555-0111' },
    { firstName: 'James', lastName: 'Lopez', city: 'Jacksonville', country: 'USA', phone: '+1-555-0112' },
    { firstName: 'Charlotte', lastName: 'Gonzalez', city: 'Fort Worth', country: 'USA', phone: '+1-555-0113' },
    { firstName: 'Benjamin', lastName: 'Wilson', city: 'Columbus', country: 'USA', phone: '+1-555-0114' },
    { firstName: 'Amelia', lastName: 'Anderson', city: 'Charlotte', country: 'USA', phone: '+1-555-0115' },
    { firstName: 'Lucas', lastName: 'Thomas', city: 'San Francisco', country: 'USA', phone: '+1-555-0116' },
    { firstName: 'Harper', lastName: 'Taylor', city: 'Indianapolis', country: 'USA', phone: '+1-555-0117' },
    { firstName: 'Henry', lastName: 'Moore', city: 'Seattle', country: 'USA', phone: '+1-555-0118' },
    { firstName: 'Evelyn', lastName: 'Jackson', city: 'Denver', country: 'USA', phone: '+1-555-0119' },
    { firstName: 'Alexander', lastName: 'Martin', city: 'Boston', country: 'USA', phone: '+1-555-0120' },
];

const EVENT_TYPES = [
    'cart_abandoned',
    'checkout_started',
    'product_viewed',
    'product_added_to_cart',
    'wishlist_added',
    'search_performed',
    'email_opened',
    'discount_applied'
];

// In-memory queue simulation
const jobQueue = [];
let isProcessing = false;

const processQueue = async () => {
    if (isProcessing || jobQueue.length === 0) return;
    isProcessing = true;

    const job = jobQueue.shift();
    console.log(`🔄 Processing job: ${job.type} for tenant ${job.tenantId}`);

    try {
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (job.type === 'SYNC_SHOPIFY') {
            await syncComprehensiveData(job.tenantId);
        }
    } catch (error) {
        console.error('❌ Job failed:', error);
    } finally {
        isProcessing = false;
        processQueue();
    }
};

const syncComprehensiveData = async (tenantId) => {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) return;

    console.log(`📦 Syncing comprehensive data for ${tenant.name}...`);

    // 1. Create Products (40+ products across categories)
    const allProducts = [];
    for (const [category, products] of Object.entries(PRODUCT_CATEGORIES)) {
        for (const product of products) {
            const createdProduct = await prisma.product.upsert({
                where: { tenantId_shopifyId: { tenantId, shopifyId: `prod_${category}_${product.title.replace(/\s+/g, '_')}` } },
                update: {},
                create: {
                    shopifyId: `prod_${category}_${product.title.replace(/\s+/g, '_')}`,
                    title: product.title,
                    description: product.description,
                    vendor: product.vendor,
                    productType: category,
                    price: product.price,
                    compareAtPrice: product.compareAtPrice,
                    inventory: product.inventory,
                    imageUrl: `https://picsum.photos/seed/${product.title}/400/400`,
                    tenantId
                }
            });
            allProducts.push(createdProduct);
        }
    }

    console.log(`✅ Created ${allProducts.length} products`);

    // 2. Create Customers (20 customers)
    const createdCustomers = [];
    for (const customer of CUSTOMER_NAMES) {
        const createdCustomer = await prisma.customer.upsert({
            where: { tenantId_shopifyId: { tenantId, shopifyId: `cust_${customer.firstName}_${customer.lastName}` } },
            update: {},
            create: {
                shopifyId: `cust_${customer.firstName}_${customer.lastName}`,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: `${customer.firstName.toLowerCase()}.${customer.lastName.toLowerCase()}@example.com`,
                phone: customer.phone,
                city: customer.city,
                country: customer.country,
                totalSpent: 0,
                ordersCount: 0,
                tenantId
            }
        });
        createdCustomers.push(createdCustomer);
    }

    console.log(`✅ Created ${createdCustomers.length} customers`);

    // 3. Create Orders (50-100 orders with realistic data)
    const orderCount = 75;
    let orderNumber = 1000;

    for (let i = 0; i < orderCount; i++) {
        const customer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
        const itemsCount = Math.floor(Math.random() * 4) + 1; // 1-4 items per order

        let subtotal = 0;
        for (let j = 0; j < itemsCount; j++) {
            const product = allProducts[Math.floor(Math.random() * allProducts.length)];
            subtotal += product.price || 0;
        }

        const tax = subtotal * 0.08; // 8% tax
        const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
        const totalPrice = subtotal + tax + shipping;

        // Create orders over the last 30 days
        const daysAgo = Math.floor(Math.random() * 30);
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - daysAgo);

        const financialStatuses = ['paid', 'paid', 'paid', 'pending', 'refunded'];
        const fulfillmentStatuses = ['fulfilled', 'fulfilled', 'shipped', 'processing', 'pending'];

        await prisma.order.upsert({
            where: { tenantId_shopifyId: { tenantId, shopifyId: `order_${orderNumber}` } },
            update: {},
            create: {
                shopifyId: `order_${orderNumber}`,
                orderNumber: orderNumber,
                totalPrice: Math.round(totalPrice * 100) / 100,
                subtotal: Math.round(subtotal * 100) / 100,
                tax: Math.round(tax * 100) / 100,
                shipping: shipping,
                currency: 'USD',
                financialStatus: financialStatuses[Math.floor(Math.random() * financialStatuses.length)],
                fulfillmentStatus: fulfillmentStatuses[Math.floor(Math.random() * fulfillmentStatuses.length)],
                itemsCount: itemsCount,
                customerId: customer.id,
                tenantId,
                createdAt: orderDate
            }
        });

        // Update customer totals
        await prisma.customer.update({
            where: { id: customer.id },
            data: {
                totalSpent: { increment: totalPrice },
                ordersCount: { increment: 1 }
            }
        });

        orderNumber++;
    }

    console.log(`✅ Created ${orderCount} orders`);

    // 4. Create Events (100+ events for analytics)
    const eventCount = 150;
    for (let i = 0; i < eventCount; i++) {
        const customer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
        const eventType = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
        const product = allProducts[Math.floor(Math.random() * allProducts.length)];

        const daysAgo = Math.floor(Math.random() * 30);
        const eventDate = new Date();
        eventDate.setDate(eventDate.getDate() - daysAgo);

        const eventData = {
            productId: product.shopifyId,
            productTitle: product.title,
            price: product.price,
            timestamp: eventDate.toISOString()
        };

        await prisma.event.create({
            data: {
                eventType,
                eventData: JSON.stringify(eventData),
                customerId: customer.id,
                tenantId,
                createdAt: eventDate
            }
        });
    }

    console.log(`✅ Created ${eventCount} events`);
    console.log(`🎉 Comprehensive data sync complete for ${tenant.name}!`);
};

module.exports = {
    addJob: (type, tenantId) => {
        jobQueue.push({ type, tenantId });
        processQueue();
        return { status: 'queued', position: jobQueue.length };
    }
};
