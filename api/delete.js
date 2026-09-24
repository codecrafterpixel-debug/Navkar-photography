import { del } from '@vercel/blob';
import { getDb, initDb } from './db.js';
import { getBlobToken } from './upload.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

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

    const blobToken = getBlobToken();

    if (records.length > 0 && records[0].url) {
      try {
        await del(records[0].url, blobToken ? { token: blobToken } : undefined);
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
