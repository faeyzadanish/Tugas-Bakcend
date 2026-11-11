-- CreateTable
CREATE TABLE "barang" (
    "id" SERIAL NOT NULL,
    "nama_barang" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "harga" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barang_pkey" PRIMARY KEY ("id")
);
