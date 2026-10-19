import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load server-side environment variables without VITE_ prefix
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'vite-dev-api-mandi',
        configureServer(server) {
          server.middlewares.use('/api/mandi', async (req, res) => {
            if (req.method !== 'GET') {
              res.statusCode = 405;
              return res.end(JSON.stringify({ error: 'Method not allowed' }));
            }

            const apiKey = env.DATA_GOV_API_KEY || process.env.DATA_GOV_API_KEY;
            const resourceId = env.MANDI_RESOURCE_ID || process.env.MANDI_RESOURCE_ID || '9ef84268-d588-465a-a308-a864a43d0070';

            if (!apiKey || apiKey === 'your_data_gov_in_api_key_here') {
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                status: 'DEMO',
                source: 'DEMO',
                records: [],
                message: 'Server-side DATA_GOV_API_KEY is not configured or using placeholder.',
              }));
            }

            try {
              const baseUrl = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json`;
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 8000);

              const [karnatakaRes, bananaRes, coconutRes] = await Promise.allSettled([
                fetch(`${baseUrl}&limit=100&filters%5Bstate%5D=Karnataka`, { signal: controller.signal, headers: { Accept: 'application/json' } }),
                fetch(`${baseUrl}&limit=20&filters%5Bcommodity%5D=Banana`, { signal: controller.signal, headers: { Accept: 'application/json' } }),
                fetch(`${baseUrl}&limit=20&filters%5Bcommodity%5D=Coconut`, { signal: controller.signal, headers: { Accept: 'application/json' } }),
              ]);
              clearTimeout(timeoutId);

              const rawRecords: any[] = [];
              if (karnatakaRes.status === 'fulfilled' && karnatakaRes.value.ok) {
                const data: any = await karnatakaRes.value.json();
                if (data && Array.isArray(data.records)) rawRecords.push(...data.records);
              }
              if (bananaRes.status === 'fulfilled' && bananaRes.value.ok) {
                const data: any = await bananaRes.value.json();
                if (data && Array.isArray(data.records)) rawRecords.push(...data.records);
              }
              if (coconutRes.status === 'fulfilled' && coconutRes.value.ok) {
                const data: any = await coconutRes.value.json();
                if (data && Array.isArray(data.records)) rawRecords.push(...data.records);
              }

              const todayStr = new Date().toLocaleDateString('en-GB');
              const isToday = rawRecords.some(r => r.arrival_date?.includes(todayStr) || r.arrival_date?.includes('2026'));

              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                status: 'ok',
                records: rawRecords,
                total: rawRecords.length,
                isLiveToday: isToday,
                fetchedAt: new Date().toISOString(),
              }));
            } catch (err) {
              res.statusCode = 502;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                status: 'error',
                message: err instanceof Error ? err.message : 'Server error',
                records: [],
              }));
            }
          });
        },
      },
    ],
    server: {
      proxy: {
        // When running external server.js on port 3001
        '/api/external': {
          target: 'http://127.0.0.1:3001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/external/, '/api'),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
  };
});
