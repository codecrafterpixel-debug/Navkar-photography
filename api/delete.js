import { del } from '@vercel/blob';
import { getDb, initDb } from './db.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bucket, name } = req.query;
  if (!bucket || !name) {
    return res.status(400).json({ error: 'Bucket and name query parameters are required' });
  }

  try {
    const sql = getDb();
    await initDb();

    // Fetch the image URL first
    const records = await sql`
      SELECT url FROM gallery_images
      WHERE bucket = ${bucket} AND name = ${name}
      LIMIT 1;
    `;

    if (records.length > 0 && records[0].url) {
      try {
        await del(records[0].url);
      } catch (blobErr) {
        console.warn('Vercel blob delete warning:', blobErr);
      }
    }

    // Delete record from Neon
    await sql`
      DELETE FROM gallery_images
      WHERE bucket = ${bucket} AND name = ${name};
    `;

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: error.message || 'Failed to delete file' });
  }
}
