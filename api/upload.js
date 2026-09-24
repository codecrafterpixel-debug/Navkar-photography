import { put } from '@vercel/blob';
import { getDb, initDb } from './db.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-filename'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Verify Vercel Blob Token
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({
      error: 'Vercel Blob Storage is not connected. In your Vercel Dashboard, go to Storage > Create Database > select Blob and click Connect.'
    });
  }

  // 2. Verify Neon Database URL
  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
    return res.status(500).json({
      error: 'DATABASE_URL is missing in Vercel. Add your Neon connection string under Vercel Settings > Environment Variables.'
    });
  }

  const { bucket, filename } = req.query;
  const rawFileName = filename || req.headers['x-filename'] || `file-${Date.now()}.jpg`;

  if (!bucket) {
    return res.status(400).json({ error: 'Bucket parameter is required' });
  }

  try {
    // Read request body stream into Buffer
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    const buffer = Buffer.concat(chunks);

    if (buffer.length === 0) {
      return res.status(400).json({ error: 'Uploaded file is empty' });
    }

    const safeFilename = rawFileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniquePath = `${bucket}/${Date.now()}-${safeFilename}`;

    // Upload directly to Vercel Blob Storage
    const blob = await put(uniquePath, buffer, {
      access: 'public',
      contentType: req.headers['content-type'] || 'image/jpeg',
    });

    // Save record to Neon PostgreSQL
    const sql = getDb();
    await initDb();

    const inserted = await sql`
      INSERT INTO gallery_images (bucket, name, url)
      VALUES (${bucket}, ${uniquePath}, ${blob.url})
      RETURNING id, bucket, name, url, created_at;
    `;

    return res.status(200).json({
      name: uniquePath,
      url: blob.url,
      bucket: bucket,
      dbRecord: inserted[0]
    });
  } catch (error) {
    console.error('Upload handler error:', error);
    return res.status(500).json({ error: error.message || 'Upload failed' });
  }
}
