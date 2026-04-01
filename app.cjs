const http = require('http');
const NEXT_PORT = 3002;

// Passenger sets PORT dynamically — we listen on that and proxy to Next.js
const server = http.createServer((req, res) => {
  const opts = {
    hostname: '127.0.0.1',
    port: NEXT_PORT,
    path: req.url,
    method: req.method,
    headers: req.headers,
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
});

const port = process.env.PORT || '3002';
server.listen(parseInt(port), '0.0.0.0', () => {
  console.log('Proxy listening on ' + port + ' -> Next.js on ' + NEXT_PORT);
});
