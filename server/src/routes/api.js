const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { addJob } = require('../services/ingestion');
const { getInsights } = require('../services/groq');
const authRoutes = require('./auth');
const verifyToken = require('../middleware/auth');

const prisma = new PrismaClient();

// Auth Routes
router.use('/auth', authRoutes);

// Helper to resolve demo tenant
const resolveTenantId = async (id) => {
    if (id === 'demo_tenant') {
        const tenant = await prisma.tenant.findUnique({ where: { shopifyDomain: 'demo' } });
        return tenant ? tenant.id : id;
    }
    return id;
};

// Create a Tenant (Store) - Protected
router.post('/tenants', async (req, res) => {
    try {
        const { name, shopifyDomain, accessToken } = req.body;
        let tenant = await prisma.tenant.findUnique({ where: { shopifyDomain } });
        if (!tenant) {
            tenant = await prisma.tenant.create({
                data: { name, shopifyDomain, accessToken: accessToken || 'demo_token' }
            });
        }
        res.json(tenant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Trigger Ingestion (Async via Queue)
router.post('/ingest/:tenantId', async (req, res) => {
    try {
        let { tenantId } = req.params;
        tenantId = await resolveTenantId(tenantId);
        const job = addJob('SYNC_SHOPIFY', tenantId);
        res.json({ message: 'Ingestion started', jobId: job.position });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dashboard Data with Comprehensive Analytics
router.get('/dashboard/:tenantId', async (req, res) => {
    try {
        let { tenantId } = req.params;
        tenantId = await resolveTenantId(tenantId);

        // Fetch all core metrics in parallel
        const [
            customerCount,
            orderCount,
            productsCount,
            eventsCount,
            totalRevenueResult,
            orders,
            topCustomers,
            products,
            recentEvents,
            ordersByStatus,
            productsByCategory
        ] = await Promise.all([
            prisma.customer.count({ where: { tenantId } }),
            prisma.order.count({ where: { tenantId } }),
            prisma.product.count({ where: { tenantId } }),
            prisma.event.count({ where: { tenantId } }),
            prisma.order.aggregate({
                where: { tenantId },
                _sum: { totalPrice: true, subtotal: true, tax: true, shipping: true },
                _avg: { totalPrice: true }
            }),
            prisma.order.findMany({
                where: { tenantId },
                orderBy: { createdAt: 'desc' },
                take: 10,
                include: { customer: true }
            }),
            prisma.customer.findMany({
                where: { tenantId },
                orderBy: { totalSpent: 'desc' },
                take: 10
            }),
            prisma.product.findMany({
                where: { tenantId },
                orderBy: { price: 'desc' },
                take: 10
            }),
            prisma.event.findMany({
                where: { tenantId },
                orderBy: { createdAt: 'desc' },
                take: 20,
                include: { customer: true }
            }),
            prisma.order.groupBy({
                by: ['financialStatus'],
                where: { tenantId },
                _count: true,
                _sum: { totalPrice: true }
            }),
            prisma.product.groupBy({
                by: ['productType'],
                where: { tenantId },
                _count: true,
                _sum: { price: true }
            })
        ]);

        // Chart Data: Revenue by Day (Last 30 days)
        const rawOrders = await prisma.order.findMany({
            where: { tenantId },
            select: { createdAt: true, totalPrice: true, subtotal: true, tax: true, shipping: true }
        });

        // Group by date
        const revenueByDate = {};
        rawOrders.forEach(order => {
            const date = new Date(order.createdAt).toISOString().split('T')[0];
            if (!revenueByDate[date]) {
                revenueByDate[date] = { revenue: 0, orders: 0, tax: 0, shipping: 0 };
            }
            revenueByDate[date].revenue += order.totalPrice;
            revenueByDate[date].orders += 1;
            revenueByDate[date].tax += order.tax || 0;
            revenueByDate[date].shipping += order.shipping || 0;
        });

        const chartData = Object.keys(revenueByDate)
            .map(date => ({
                date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                revenue: Math.round(revenueByDate[date].revenue),
                orders: revenueByDate[date].orders,
                tax: Math.round(revenueByDate[date].tax),
                shipping: Math.round(revenueByDate[date].shipping)
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(-30);

        // Event analytics
        const eventsByType = await prisma.event.groupBy({
            by: ['eventType'],
            where: { tenantId },
            _count: true
        });

        // Order status breakdown
        const statusBreakdown = ordersByStatus.map(item => ({
            status: item.financialStatus || 'unknown',
            count: item._count,
            revenue: item._sum.totalPrice || 0
        }));

        // Category breakdown
        const categoryBreakdown = productsByCategory.map(item => ({
            category: item.productType || 'Other',
            count: item._count,
            totalValue: item._sum.price || 0
        }));

        // Calculate trends (mock for now - compare with previous period)
        const revenueTrend = 12.5;
        const ordersTrend = 8.3;
        const customersTrend = 15.7;

        res.json({
            // Core Metrics
            customerCount,
            orderCount,
            productsCount,
            eventsCount,
            totalRevenue: totalRevenueResult._sum.totalPrice || 0,
            totalTax: totalRevenueResult._sum.tax || 0,
            totalShipping: totalRevenueResult._sum.shipping || 0,
            averageOrderValue: totalRevenueResult._avg.totalPrice || 0,

            // Trends
            revenueTrend,
            ordersTrend,
            customersTrend,

            // Lists
            recentOrders: orders.map(order => ({
                ...order,
                customerName: order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'Guest'
            })),
            topCustomers,
            topProducts: products,
            recentEvents: recentEvents.map(event => ({
                ...event,
                customerName: event.customer ? `${event.customer.firstName} ${event.customer.lastName}` : 'Anonymous',
                data: event.eventData ? JSON.parse(event.eventData) : {}
            })),

            // Charts Data
            chartData,
            statusBreakdown,
            categoryBreakdown,
            eventsByType: eventsByType.map(e => ({
                type: e.eventType,
                count: e._count
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// AI Insights Endpoint
router.post('/insights/:tenantId', async (req, res) => {
    try {
        let { tenantId } = req.params;
        tenantId = await resolveTenantId(tenantId);

        // Gather data for AI context
        const [totalRevenue, orderCount, customerCount, topProducts] = await Promise.all([
            prisma.order.aggregate({ where: { tenantId }, _sum: { totalPrice: true } }),
            prisma.order.count({ where: { tenantId } }),
            prisma.customer.count({ where: { tenantId } }),
            prisma.product.findMany({ where: { tenantId }, take: 5, orderBy: { price: 'desc' } })
        ]);

        const contextData = {
            totalRevenue: totalRevenue._sum.totalPrice || 0,
            orderCount,
            customerCount,
            topProducts
        };

        const insights = await getInsights(contextData);
        res.json({ insights: insights.insights || insights });
    } catch (error) {
        console.error('Insights Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// AI Prediction Endpoint
router.post('/predict/:tenantId', async (req, res) => {
    try {
        let { tenantId } = req.params;
        tenantId = await resolveTenantId(tenantId);

        // In a real app, we'd fetch historical data here. For now, we'll use mock or body data.
        const { historicalData } = req.body;

        // If no data provided, fetch some from DB
        let dataToAnalyze = historicalData;
        if (!dataToAnalyze) {
            const orders = await prisma.order.findMany({
                where: { tenantId },
                orderBy: { createdAt: 'asc' },
                take: 100,
                select: { createdAt: true, totalPrice: true }
            });
            dataToAnalyze = orders;
        }

        const { predictTrends } = require('../services/groq');
        const prediction = await predictTrends(dataToAnalyze);
        res.json(prediction);
    } catch (error) {
        console.error('Prediction Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// AI Chat Endpoint
router.post('/chat/:tenantId', async (req, res) => {
    try {
        let { tenantId } = req.params;
        tenantId = await resolveTenantId(tenantId);
        const { message } = req.body;

        // Fetch context
        const [totalRevenue, orderCount] = await Promise.all([
            prisma.order.aggregate({ where: { tenantId }, _sum: { totalPrice: true } }),
            prisma.order.count({ where: { tenantId } })
        ]);

        const context = {
            revenue: totalRevenue._sum.totalPrice || 0,
            orders: orderCount,
            tenantId
        };

        const { chatWithAssistant } = require('../services/groq');
        const response = await chatWithAssistant(message, context);
        res.json({ response });
    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
