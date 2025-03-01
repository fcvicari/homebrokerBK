/*
  Warnings:

  - You are about to drop the column `asset` on the `Order` table. All the data in the column will be lost.
  - Added the required column `assetId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "asset",
ADD COLUMN     "assetId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
