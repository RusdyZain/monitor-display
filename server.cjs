#!/usr/bin/env node

const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const handler = require('serve-handler');

const DEFAULT_PORT = 4173;
const DEFAULT_HOST = '0.0.0.0';

const isRunningInsidePkg = typeof process.pkg !== 'undefined';
const baseDir = isRunningInsidePkg ? path.dirname(process.execPath) : __dirname;
const distDir = path.join(baseDir, 'dist');

if (!fs.existsSync(distDir)) {
  console.error('Folder dist tidak ditemukan. Jalankan "npm run build" terlebih dahulu.');
  process.exit(1);
}

const port = Number(process.env.PORT) || DEFAULT_PORT;
const host = process.env.HOST || DEFAULT_HOST;
const shouldAutoOpen = process.env.AUTO_OPEN !== 'false';

async function openBrowser(address) {
  try {
    const open = require('open');
    await open(address, { wait: false });
  } catch (err) {
    console.warn('Gagal membuka browser otomatis:', err.message);
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const pathname = parsedUrl.pathname || '/';
  const hasExtension = path.extname(pathname) !== '';

  const originalUrl = req.url;
  if (req.method === 'GET' && !hasExtension) {
    req.url = '/index.html';
  }

  handler(req, res, {
    public: distDir,
  }).finally(() => {
    req.url = originalUrl;
  });
});

server.on('error', (err) => {
  console.error('Server gagal berjalan:', err.message);
  process.exit(1);
});

server.listen(port, host, () => {
  const address = `http://localhost:${port}`;
  console.log('Menayangkan dist dari:', distDir);
  console.log(`Server berjalan di ${host}:${port}`);
  console.log(`Buka ${address} untuk melihat tampilan.`);

  if (shouldAutoOpen) {
    setTimeout(() => openBrowser(address), 800);
  }
});

const shutDown = () => {
  console.log('\nMenutup server...');
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);