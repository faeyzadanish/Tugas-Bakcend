# Tugas-Bakcend - Manajemen Inventory Barang

CRUD full-stack sederhana dengan Express.js, Prisma, PostgreSQL Neon, dan Vanilla JavaScript.

## Setup

```bash
npm init -y
npm install express cors dotenv @prisma/client
npm install -D prisma nodemon
npx prisma init
```

Salin `.env.example` menjadi `.env`, lalu isi `DATABASE_URL` dengan connection string PostgreSQL dari Neon.

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Buka http://localhost:3000.

## API

- `GET /api/barang` mengambil semua barang.
- `POST /api/barang` membuat barang baru.
- `PUT /api/barang/:id` mengubah barang.
- `DELETE /api/barang/:id` menghapus barang.

Body JSON untuk POST dan PUT:

```json
{
  "nama_barang": "Keyboard mekanikal",
  "jumlah": 10,
  "harga": 750000
}
}
