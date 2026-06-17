
import { createServer } from 'node:http';
import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = join(__dirname, 'public', 'uploads');
const PORT = 3002;
const MAX_BODY = 10 * 1024 * 1024; // 10 MB

await mkdir(UPLOAD_DIR, { recursive: true });

const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/upload') {
    try {
      const chunks = [];
      let size = 0;

      for await (const chunk of req) {
        size += chunk.length;
        if (size > MAX_BODY) {
          res.writeHead(413, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'File too large' }));
          return;
        }
        chunks.push(chunk);
      }

      const body = JSON.parse(Buffer.concat(chunks).toString());
      const { data, name } = body; 

      if (!data || typeof data !== 'string') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing data field' }));
        return;
      }

      const match = data.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!match) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid base64 image' }));
        return;
      }

      const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
      const buffer = Buffer.from(match[2], 'base64');
      const filename = `${randomUUID()}.${ext}`;
      const filepath = join(UPLOAD_DIR, filename);

      await writeFile(filepath, buffer);

      const url = `/uploads/${filename}`;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ url }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Upload failed' }));
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Upload server running on http://localhost:${PORT}`);
});
