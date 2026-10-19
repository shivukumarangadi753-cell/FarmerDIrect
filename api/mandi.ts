export default async function handler(req: any, res: any) {
  // Set CORS headers for Vercel deployment
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.DATA_GOV_API_KEY;
  const resourceId = process.env.MANDI_RESOURCE_ID || '9ef84268-d588-465a-a308-a864a43d0070';

  if (!apiKey || apiKey === 'your_data_gov_in_api_key_here') {
    return res.status(200).json({
      status: 'DEMO',
      source: 'DEMO',
      records: [],
      message: 'Server-side DATA_GOV_API_KEY is not configured or using placeholder.',
    });
  }

  try {
    const baseUrl = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    // Parallel fetch on the server side: Karnataka APMC records + live Banana & Coconut
    const [karnatakaRes, bananaRes, coconutRes] = await Promise.allSettled([
      fetch(`${baseUrl}&limit=100&filters%5Bstate%5D=Karnataka`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      }),
      fetch(`${baseUrl}&limit=20&filters%5Bcommodity%5D=Banana`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      }),
      fetch(`${baseUrl}&limit=20&filters%5Bcommodity%5D=Coconut`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      }),
    ]);
    clearTimeout(timeoutId);

    const rawRecords: any[] = [];

    if (karnatakaRes.status === 'fulfilled' && karnatakaRes.value.ok) {
      const data: any = await karnatakaRes.value.json();
      if (data && Array.isArray(data.records)) {
        rawRecords.push(...data.records);
      }
    }

    if (bananaRes.status === 'fulfilled' && bananaRes.value.ok) {
      const data: any = await bananaRes.value.json();
      if (data && Array.isArray(data.records)) {
        rawRecords.push(...data.records);
      }
    }

    if (coconutRes.status === 'fulfilled' && coconutRes.value.ok) {
      const data: any = await coconutRes.value.json();
      if (data && Array.isArray(data.records)) {
        rawRecords.push(...data.records);
      }
    }

    const todayStr = new Date().toLocaleDateString('en-GB'); // dd/mm/yyyy
    const latestArrival = rawRecords[0]?.arrival_date || '';
    const isToday = rawRecords.some(
      (r) => r.arrival_date?.includes(todayStr) || r.arrival_date?.includes('2026')
    );

    return res.status(200).json({
      status: 'ok',
      records: rawRecords,
      total: rawRecords.length,
      isLiveToday: isToday,
      latestArrival,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Upstream API error';
    return res.status(502).json({
      status: 'error',
      message: errorMsg,
      records: [],
    });
  }
}
