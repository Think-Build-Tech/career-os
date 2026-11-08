// tools/scripts/serve-test-apps.js

const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.hbc': 'application/octet-stream',
};

function createSpaServer(staticDir, port, name) {
  const resolvedDir = path.resolve(staticDir);

  const server = http.createServer((req, res) => {
    // Enable CORS for all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const urlPath = req.url.split('?')[0];
    let filePath = path.join(resolvedDir, urlPath);

    // If requesting directory or root, serve index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    // If file doesn't exist, SPA fallback to index.html
    if (!fs.existsSync(filePath)) {
      filePath = path.join(resolvedDir, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`File not found in ${name}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Error reading file: ${err.message}`);
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`[${name}] Serving static files from ${resolvedDir} at http://localhost:${port}`);
  });

  return server;
}

const webDir = path.resolve(__dirname, '../../dist/apps/web/browser');
const mobileDir = path.resolve(__dirname, '../../apps/mobile/dist');

createSpaServer(webDir, 4200, 'CareerOS Web');
createSpaServer(mobileDir, 8081, 'CareerOS Mobile');
