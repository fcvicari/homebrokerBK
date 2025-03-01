/*
  Warnings:

  - You are about to drop the column `price` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Order` table. All the data in the column will be lost.
  - Added the required column `priceExec` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceOrder` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantityExec` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantityOrder` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "price",
DROP COLUMN "quantity",
ADD COLUMN     "priceExec" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "priceOrder" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantityExec" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantityOrder" DOUBLE PRECISION NOT NULL;
