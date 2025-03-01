-- CreateTable
CREATE TABLE "WalletAsset" (
    "id" TEXT NOT NULL,
    "walletID" TEXT NOT NULL,
    "assetID" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WalletAsset_walletID_assetID_key" ON "WalletAsset"("walletID", "assetID");

-- AddForeignKey
ALTER TABLE "WalletAsset" ADD CONSTRAINT "WalletAsset_walletID_fkey" FOREIGN KEY ("walletID") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletAsset" ADD CONSTRAINT "WalletAsset_assetID_fkey" FOREIGN KEY ("assetID") REFERENCES "Assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
