import https from 'https';

export default async function handler(req, res) {
  const { path = '' } = req.query;
  const targetPath = path ? `/${path}` : '';
  const targetUrl = new URL(`https://task-management-laravel-api-production-b3f4.up.railway.app/api${targetPath}`);

  const headers = {
    ...req.headers,
    host: targetUrl.host,
  };
  delete headers['host'];
  delete headers['content-length'];

  const method = req.method || 'GET';
  const body = method !== 'GET' && method !== 'HEAD' ? JSON.stringify(req.body ?? {}) : undefined;

  const proxyReq = https.request(
    {
      hostname: targetUrl.hostname,
      port: targetUrl.port || 443,
      path: `${targetUrl.pathname}${targetUrl.search}`,
      method,
      headers,
    },
    (proxyRes) => {
      res.statusCode = proxyRes.statusCode || 500;
      Object.entries(proxyRes.headers).forEach(([key, value]) => {
        if (value) {
          res.setHeader(key, Array.isArray(value) ? value.join(',') : value);
        }
      });
      res.setHeader('Access-Control-Allow-Origin', 'https://task-management-react-nine.vercel.app');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
      if (method === 'OPTIONS') {
        res.end();
        return;
      }
      proxyRes.pipe(res);
    }
  );

  proxyReq.on('error', (error) => {
    res.statusCode = 502;
    res.end(JSON.stringify({ message: 'Proxy error', error: error.message }));
  });

  if (body) {
    proxyReq.write(body);
  }
  proxyReq.end();
}
