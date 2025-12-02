/*
  Warnings:

  - You are about to drop the column `currency` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `payload` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `processedAt` on the `Order` table. All the data in the column will be lost.
  - Made the column `email` on table `Customer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `firstName` on table `Customer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `Customer` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `eventType` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `customerId` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopifyId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "totalSpent" REAL NOT NULL DEFAULT 0,
    "ordersCount" INTEGER NOT NULL DEFAULT 0,
    "city" TEXT,
    "country" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Customer_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Customer" ("createdAt", "email", "firstName", "id", "lastName", "ordersCount", "shopifyId", "tenantId", "totalSpent", "updatedAt") SELECT "createdAt", "email", "firstName", "id", "lastName", "ordersCount", "shopifyId", "tenantId", "totalSpent", "updatedAt" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_tenantId_shopifyId_key" ON "Customer"("tenantId", "shopifyId");
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventType" TEXT NOT NULL,
    "eventData" TEXT,
    "customerId" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Event_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Event_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("createdAt", "customerId", "id", "tenantId") SELECT "createdAt", "customerId", "id", "tenantId" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopifyId" TEXT NOT NULL,
    "orderNumber" INTEGER NOT NULL,
    "totalPrice" REAL NOT NULL,
    "subtotal" REAL,
    "tax" REAL,
    "shipping" REAL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "financialStatus" TEXT,
    "fulfillmentStatus" TEXT,
    "itemsCount" INTEGER NOT NULL DEFAULT 1,
    "customerId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "currency", "customerId", "financialStatus", "id", "orderNumber", "shopifyId", "tenantId", "totalPrice") SELECT "createdAt", "currency", "customerId", "financialStatus", "id", "orderNumber", "shopifyId", "tenantId", "totalPrice" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_tenantId_shopifyId_key" ON "Order"("tenantId", "shopifyId");
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopifyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "vendor" TEXT,
    "productType" TEXT,
    "price" REAL,
    "compareAtPrice" REAL,
    "inventory" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("createdAt", "id", "productType", "shopifyId", "tenantId", "title", "updatedAt", "vendor") SELECT "createdAt", "id", "productType", "shopifyId", "tenantId", "title", "updatedAt", "vendor" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_tenantId_shopifyId_key" ON "Product"("tenantId", "shopifyId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "avatar" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "password", "updatedAt") SELECT "createdAt", "email", "id", "name", "password", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
