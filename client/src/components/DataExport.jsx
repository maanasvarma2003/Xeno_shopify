import { motion } from 'framer-motion';
import { Download, FileText, Table } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../api';
import { useToast } from './Toast';

export default function DataExport() {
    const { addToast } = useToast();

    const exportToCSV = async () => {
        try {
            addToast('Preparing CSV export...', 'info');
            const tenantId = 'demo_tenant';
            const response = await api.get(`/dashboard/${tenantId}`);
            const data = response.data;

            // Format orders data as CSV
            const headers = ['Order ID', 'Customer', 'Date', 'Status', 'Amount'];
            const rows = data.recentOrders?.map(order => [
                order.orderNumber,
                order.customerName,
                new Date(order.createdAt).toLocaleDateString(),
                order.financialStatus,
                order.totalPrice
            ]) || [];

            const csv = [
                headers.join(','),
                ...rows.map(row => row.join(','))
            ].join('\n');

            // Download
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `shopify-orders-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            addToast('CSV exported successfully!', 'success');
        } catch (error) {
            console.error(error);
            addToast('Failed to export CSV', 'error');
        }
    };

    const exportToJSON = async () => {
        try {
            addToast('Preparing JSON export...', 'info');
            const tenantId = 'demo_tenant';
            const response = await api.get(`/dashboard/${tenantId}`);

            const json = JSON.stringify(response.data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `shopify-dashboard-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            window.URL.revokeObjectURL(url);

            addToast('JSON exported successfully!', 'success');
        } catch (error) {
            console.error(error);
            addToast('Failed to export JSON', 'error');
        }
    };

    const exportToPDF = async () => {
        try {
            addToast('Generating PDF report...', 'info');
            const tenantId = 'demo_tenant';
            const response = await api.get(`/dashboard/${tenantId}`);
            const data = response.data;

            // Create new PDF document
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // Add header with gradient background (simulated with rectangle)
            doc.setFillColor(59, 130, 246); // Blue
            doc.rect(0, 0, pageWidth, 40, 'F');

            // Add title
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.text('Shopify Intelligence', pageWidth / 2, 20, { align: 'center' });

            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text('Dashboard Report', pageWidth / 2, 30, { align: 'center' });

            // Reset text color for body
            doc.setTextColor(0, 0, 0);

            // Add date
            doc.setFontSize(10);
            doc.setFont('helvetica', 'italic');
            const date = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            doc.text(`Generated on: ${date}`, 14, 50);

            // Metrics Summary Section
            let y = 60;
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(30, 41, 59); // Slate-800
            doc.text('Key Metrics Overview', 14, y);

            y += 10;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(71, 85, 105); // Slate-600

            const formatCurrency = (amount) => {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }).format(amount);
            };

            // Metrics boxes
            const metrics = [
                { label: 'Total Revenue', value: formatCurrency(data.totalRevenue || 0), color: [59, 130, 246] },
                { label: 'Total Orders', value: (data.orderCount || 0).toString(), color: [99, 102, 241] },
                { label: 'Active Customers', value: (data.customerCount || 0).toString(), color: [168, 85, 247] },
                { label: 'Average Order Value', value: formatCurrency(data.averageOrderValue || 0), color: [236, 72, 153] }
            ];

            metrics.forEach((metric, index) => {
                const x = 14 + (index % 2) * 95;
                const boxY = y + Math.floor(index / 2) * 25;

                // Draw colored box
                doc.setFillColor(...metric.color);
                doc.roundedRect(x, boxY, 90, 20, 2, 2, 'F');

                // Add text
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.text(metric.label, x + 3, boxY + 7);

                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text(metric.value, x + 3, boxY + 16);
            });

            y += 60;

            // Recent Orders Section
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(30, 41, 59);
            doc.text('Recent Orders', 14, y);

            y += 5;

            // Prepare table data
            const tableData = (data.recentOrders || []).slice(0, 15).map(order => [
                `#${order.orderNumber}`,
                order.customerName || 'Guest',
                new Date(order.createdAt).toLocaleDateString(),
                order.financialStatus || 'N/A',
                formatCurrency(order.totalPrice || 0)
            ]);

            // Create table
            autoTable(doc, {
                startY: y,
                head: [['Order ID', 'Customer', 'Date', 'Status', 'Amount']],
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: [59, 130, 246],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    fontSize: 10
                },
                bodyStyles: {
                    fontSize: 9,
                    textColor: [51, 65, 85]
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252]
                },
                styles: {
                    lineColor: [226, 232, 240],
                    lineWidth: 0.5
                },
                columnStyles: {
                    0: { cellWidth: 22 },
                    1: { cellWidth: 45 },
                    2: { cellWidth: 28 },
                    3: { cellWidth: 28 },
                    4: { cellWidth: 27, halign: 'right' }
                },
                margin: { left: 14, right: 14 }
            });

            // Check if we need a new page for the summary
            const finalY = doc.lastAutoTable.finalY || y;
            if (finalY > pageHeight - 60) {
                doc.addPage();
                y = 20;
            } else {
                y = finalY + 15;
            }

            // Category Breakdown
            if (data.categoryBreakdown && data.categoryBreakdown.length > 0) {
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(30, 41, 59);
                doc.text('Sales by Category', 14, y);

                y += 5;

                const categoryData = data.categoryBreakdown.map(cat => [
                    cat.category || 'Other',
                    cat.count?.toString() || '0',
                    formatCurrency(cat.totalValue || 0)
                ]);

                autoTable(doc, {
                    startY: y,
                    head: [['Category', 'Products', 'Total Value']],
                    body: categoryData,
                    theme: 'grid',
                    headStyles: {
                        fillColor: [99, 102, 241],
                        textColor: [255, 255, 255],
                        fontStyle: 'bold',
                        fontSize: 10
                    },
                    bodyStyles: {
                        fontSize: 9,
                        textColor: [51, 65, 85]
                    },
                    alternateRowStyles: {
                        fillColor: [248, 250, 252]
                    },
                    margin: { left: 14, right: 14 }
                });
            }

            // Footer on last page
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setFont('helvetica', 'italic');
                doc.setTextColor(148, 163, 184);
                doc.text(
                    `Page ${i} of ${pageCount}`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                );
                doc.text(
                    '© 2024 Shopify Intelligence - Confidential',
                    pageWidth / 2,
                    pageHeight - 5,
                    { align: 'center' }
                );
            }

            // Save the PDF
            const fileName = `shopify-report-${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);

            addToast('PDF report downloaded successfully!', 'success');
        } catch (error) {
            console.error('PDF Export Error:', error);
            addToast('Failed to export PDF. Please try again.', 'error');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
        >
            <div className="flex items-center gap-2 mb-4">
                <Download className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Export Data</h3>
            </div>
            <p className="text-sm text-slate-500 mb-6">Download your dashboard data in different formats</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={exportToCSV}
                    className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100 rounded-xl hover:border-green-300 transition-all group"
                >
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Table className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-slate-900 mb-1">Export as CSV</p>
                        <p className="text-xs text-slate-500">For Excel & Sheets</p>
                    </div>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={exportToJSON}
                    className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-xl hover:border-blue-300 transition-all group"
                >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-slate-900 mb-1">Export as JSON</p>
                        <p className="text-xs text-slate-500">Complete data dump</p>
                    </div>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={exportToPDF}
                    className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 rounded-xl hover:border-purple-300 transition-all group"
                >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-slate-900 mb-1">Export as PDF</p>
                        <p className="text-xs text-slate-500">Pretty reports</p>
                    </div>
                </motion.button>
            </div>
        </motion.div>
    );
}
