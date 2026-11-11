require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function parseBarangInput(body) {
  const nama_barang = typeof body.nama_barang === 'string' ? body.nama_barang.trim() : '';
  const jumlah = Number(body.jumlah);
  const harga = Number(body.harga);

  if (!nama_barang || !Number.isInteger(jumlah) || jumlah < 0 || !Number.isFinite(harga) || harga < 0) {
    return null;
  }

  return { nama_barang, jumlah, harga };
}

app.get('/api/barang', async (req, res) => {
  try {
    const barang = await prisma.barang.findMany({ orderBy: { id: 'desc' } });
    res.json(barang);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data barang.' });
  }
});

app.post('/api/barang', async (req, res) => {
  const data = parseBarangInput(req.body);
  if (!data) {
    return res.status(400).json({ message: 'Nama, jumlah, dan harga harus valid.' });
  }

  try {
    const barang = await prisma.barang.create({ data });
    res.status(201).json(barang);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menambahkan barang.' });
  }
});

app.put('/api/barang/:id', async (req, res) => {
  const id = Number(req.params.id);
  const data = parseBarangInput(req.body);
  if (!Number.isInteger(id) || !data) {
    return res.status(400).json({ message: 'ID atau data barang tidak valid.' });
  }

  try {
    const barang = await prisma.barang.update({ where: { id }, data });
    res.json(barang);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Barang tidak ditemukan.' });
    }
    res.status(500).json({ message: 'Gagal mengubah barang.' });
  }
});

app.delete('/api/barang/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'ID barang tidak valid.' });
  }

  try {
    await prisma.barang.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Barang tidak ditemukan.' });
    }
    res.status(500).json({ message: 'Gagal menghapus barang.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

async function shutdown() {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
