const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const { promisify } = require('util');
const { pipeline } = require('stream');
const handler = require('serve-handler');
const Busboy = require('busboy');

const pipelineAsync = promisify(pipeline);

const DEFAULT_PORT = 4173;
const DEFAULT_HOST = '0.0.0.0';

const DEFAULT_ASSETS = {
  primaryPdf: '/pdfs/Laporan.pdf',
  secondaryPdf: '/pdfs/Laporan.pdf',
  video: '/videos/Video.mp4',
};

const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB || 200);
const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

const isRunningInsidePkg = typeof process.pkg !== 'undefined';
const baseDir = isRunningInsidePkg ? path.dirname(process.execPath) : __dirname;
const distDir = path.join(baseDir, 'dist');
const configDir = path.join(distDir, 'config');
const assetsConfigPath = path.join(configDir, 'assets.json');
const indexPath = path.join(distDir, 'index.html');

const uploadTargets = {
  pdf: {
    dir: path.join(distDir, 'uploads', 'pdfs'),
    baseUrl: '/uploads/pdfs',
    allowedExt: new Set(['.pdf']),
  },
  video: {
    dir: path.join(distDir, 'uploads', 'videos'),
    baseUrl: '/uploads/videos',
    allowedExt: new Set(['.mp4', '.mov', '.m4v', '.webm']),
  },
};

if (!fs.existsSync(distDir)) {
  console.error('Folder dist tidak ditemukan. Jalankan "npm run build" terlebih dahulu.');
  process.exit(1);
}

const fsAsync = fs.promises;

async function ensureAssetsConfig() {
  try {
    await fsAsync.mkdir(configDir, { recursive: true });
    await fsAsync.access(assetsConfigPath, fs.constants.F_OK);
  } catch {
    try {
      await fsAsync.writeFile(assetsConfigPath, JSON.stringify(DEFAULT_ASSETS, null, 2));
    } catch (writeErr) {
      console.warn('Gagal membuat config aset default:', writeErr.message);
    }
  }
}

async function ensureUploadsDirs() {
  try {
    const tasks = Object.values(uploadTargets).map((target) =>
      fsAsync.mkdir(target.dir, { recursive: true })
    );
    await Promise.all(tasks);
  } catch (err) {
    console.warn('Tidak dapat menyiapkan direktori upload:', err.message);
  }
}

function sanitizeAssets(payload) {
  if (!payload || typeof payload !== 'object') {
    return {};
  }

  const result = {};
  for (const key of Object.keys(DEFAULT_ASSETS)) {
    const value = payload[key];
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed) {
        result[key] = trimmed;
      } else if (key !== 'secondaryPdf') {
        result[key] = DEFAULT_ASSETS[key];
      }
    }
  }

  return result;
}

async function readAssetsConfig() {
  try {
    const raw = await fsAsync.readFile(assetsConfigPath, 'utf8');
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_ASSETS, ...sanitizeAssets(parsed) };
  } catch {
    return { ...DEFAULT_ASSETS };
  }
}

async function writeAssetsConfig(payload) {
  const nextConfig = { ...DEFAULT_ASSETS, ...sanitizeAssets(payload) };
  await fsAsync.mkdir(configDir, { recursive: true });
  await fsAsync.writeFile(assetsConfigPath, JSON.stringify(nextConfig, null, 2));
  return nextConfig;
}

function createSafeFilename(filename, fallbackExt = '') {
  const ext = (path.extname(filename) || fallbackExt || '').toLowerCase();
  const baseName = path
    .basename(filename, ext)
    .replace(/[^a-z0-9-_]+/gi, '-')
    .replace(/^-+|-+$/g, '');
  const timestamp = Date.now();
  return `${timestamp}-${baseName || 'asset'}${ext}`;
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
      if (body.length > 5 * 1024 * 1024) {
        reject(new Error('Payload terlalu besar'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function serveIndex(res) {
  const stream = fs.createReadStream(indexPath);
  stream.on('error', (err) => {
    console.error('Gagal membaca index.html:', err.message);
    sendJson(res, 500, { error: 'Gagal memuat index.html' });
  });
  stream.once('open', () => {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
    });
  });
  stream.pipe(res);
}

async function handleUpload(req, res, query) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Metode tidak diizinkan.' });
    return;
  }

  const type = typeof query?.type === 'string' ? query.type.toLowerCase() : '';
  const target = uploadTargets[type];

  if (!target) {
    sendJson(res, 400, { error: 'Parameter type tidak valid. Gunakan type=pdf atau type=video.' });
    return;
  }

  await fsAsync.mkdir(target.dir, { recursive: true });

  const tasks = [];
  let savedPath = null;
  let uploadError = null;

  const busboy = Busboy({
    headers: req.headers,
    limits: {
      files: 1,
      fileSize: MAX_UPLOAD_BYTES,
    },
  });

  busboy.on('file', (fieldname, file, info) => {
    const { filename } = info;

    if (savedPath || uploadError) {
      file.resume();
      return;
    }

    if (!filename) {
      uploadError = new Error('Nama file tidak valid.');
      file.resume();
      return;
    }

    const ext = path.extname(filename).toLowerCase();

    if (!target.allowedExt.has(ext)) {
      uploadError = new Error(`Ekstensi ${ext || '(tanpa ekstensi)'} tidak diizinkan untuk ${type}.`);
      file.resume();
      return;
    }

    const safeName = createSafeFilename(filename, ext);
    const destination = path.join(target.dir, safeName);
    const writeStream = fs.createWriteStream(destination);

    file.on('limit', () => {
      uploadError = new Error(`Ukuran file melebihi batas ${MAX_UPLOAD_MB} MB.`);
    });

    const task = pipelineAsync(file, writeStream)
      .then(() => {
        savedPath = `${target.baseUrl}/${safeName}`;
      })
      .catch((err) => {
        uploadError = err;
      });

    tasks.push(task);
  });

  busboy.on('error', (err) => {
    uploadError = err;
  });

  const finished = new Promise((resolve, reject) => {
    busboy.on('finish', resolve);
    busboy.on('error', reject);
  });

  req.pipe(busboy);

  try {
    await finished;
    await Promise.all(tasks);
  } catch (err) {
    uploadError = uploadError || err;
  }

  if (uploadError) {
    console.error('Upload gagal:', uploadError);
    sendJson(res, 400, { error: uploadError.message || 'Upload gagal.' });
    return;
  }

  if (!savedPath) {
    sendJson(res, 400, { error: 'Tidak ada file yang diunggah.' });
    return;
  }

  sendJson(res, 200, { path: savedPath });
}

ensureAssetsConfig().catch((err) => {
  console.warn('Tidak dapat menyiapkan config aset:', err.message);
});

ensureUploadsDirs();

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

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname || '/';

  if (pathname === '/api/assets') {
    if (req.method === 'GET') {
      const assets = await readAssetsConfig();
      sendJson(res, 200, { assets });
      return;
    }

    if (req.method === 'POST') {
      try {
        const body = await readRequestBody(req);
        const parsed = JSON.parse(body || '{}');
        const nextAssets = await writeAssetsConfig(parsed);
        sendJson(res, 200, { assets: nextAssets });
      } catch (err) {
        sendJson(res, 400, { error: err.message || 'Gagal memperbarui konfigurasi.' });
      }
      return;
    }

    sendJson(res, 405, { error: 'Metode tidak diizinkan.' });
    return;
  }

  if (pathname === '/api/upload') {
    await handleUpload(req, res, parsedUrl.query || {});
    return;
  }

  const hasExtension = path.extname(pathname) !== '';

  if (req.method === 'GET' && !hasExtension) {
    serveIndex(res);
    return;
  }

  handler(req, res, {
    public: distDir,
  }).catch((err) => {
    console.error('Gagal menyajikan file statis:', err.message);
    sendJson(res, 500, { error: 'Gagal menyajikan file.' });
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

