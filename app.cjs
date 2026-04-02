const http = require('http');
const fs = require('fs');
const path = require('path');
const NEXT_PORT = 3003;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.css': 'text/css', '.js': 'application/javascript',
};

const server = http.createServer((req, res) => {
  // Serve static files directly from public/ directory
  const urlPath = req.url.split('?')[0];
  const publicPath = path.join(PUBLIC_DIR, urlPath);
  const safePath = path.resolve(publicPath);
  if (safePath.startsWith(PUBLIC_DIR)) {
    fs.stat(safePath, (err, stats) => {
      if (err || !stats.isFile()) {
        proxyToNext(req, res);
        return;
      }
      const ext = path.extname(safePath).toLowerCase();
      const mime = MIME[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': mime,
        'Content-Length': stats.size,
        'Cache-Control': 'public, max-age=31536000, immutable',
      });
      fs.createReadStream(safePath).pipe(res);
    });
    return;
  }

  proxyToNext(req, res);
});

function proxyToNext(req, res) {
  const headers = Object.assign({}, req.headers);
  headers.host = 'localhost:' + NEXT_PORT;

  const opts = {
    hostname: '127.0.0.1',
    port: NEXT_PORT,
    path: req.url,
    method: req.method,
    headers: headers,
  };

  const proxy = http.request(opts, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxy.on('error', () => {
    res.writeHead(502);
    res.end('Next.js not ready');
  });

  req.pipe(proxy, { end: true });
}

const port = process.env.PORT || '3002';
server.listen(parseInt(port), '0.0.0.0', () => {
  console.log('Proxy on :' + port + ' -> Next.js on :' + NEXT_PORT + ' | media from disk');
});
