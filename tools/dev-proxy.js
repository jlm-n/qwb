import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createServer as createViteServer } from 'vite';
import http from 'http';

async function startServer() {
  const app = express();
  const port = 5173;

  // Create Vite server
  const vite = await createViteServer({
    server: { 
      port: 5174,
    },
    appType: 'spa'
  });

  // Start Vite server
  await vite.listen();

  // Proxy configuration for the target server
  const targetProxyOptions = {
    target: 'http://172.16.0.20:8113',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      // Log the proxied request
      console.log(`Proxying ${req.method} ${req.url} to ${proxyReq.path}`);
    },
    onError: (err, req, res) => {
      console.error('Proxy Error:', err);
      res.status(500).send('Proxy Error');
    },
  };

  // Create the proxy middleware for the target server
  const targetProxy = createProxyMiddleware(targetProxyOptions);

  // Forward /api requests to the target server
  app.use('/api', targetProxy);

  // Create Vite proxy middleware
  const viteProxy = createProxyMiddleware({
    target: 'http://localhost:5174',
    changeOrigin: true,
    ws: true,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying to Vite: ${req.method} ${req.url}`);
    },
    onError: (err, req, res) => {
      console.error('Vite Proxy Error:', err);
      res.status(500).send('Vite Proxy Error');
    }
  });

  // Serve everything else through Vite proxy
  app.use(viteProxy);

  // Create HTTP server
  const server = http.createServer(app);

  // Start the server
  server.listen(port, () => {
    console.log(`Dev proxy server running at http://localhost:${port}`);
    console.log(`Forwarding /api requests to http://172.16.0.20:8113`);
    console.log(`Serving dev server at http://localhost:${port}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
}); 