import { getDb, initDb } from './db.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bucket } = req.query;
  if (!bucket) {
    return res.status(400).json({ error: 'Bucket parameter is required' });
  }

  try {
    const sql = getDb();
    await initDb();

    const rows = await sql`
      SELECT id, bucket, name, url, created_at
      FROM gallery_images
      WHERE bucket = ${bucket}
      ORDER BY created_at ASC;
    `;

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Database list error:', error);
    return res.status(500).json({ error: error.message || 'Failed to list images' });
  }
}
