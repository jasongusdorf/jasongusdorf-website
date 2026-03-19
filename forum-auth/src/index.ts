import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.text('Forum Auth Service'));

const port = parseInt(process.env['PORT'] ?? '3000', 10);

serve({ fetch: app.fetch, port }, () => {
  console.log(`Forum auth service running on port ${port}`);
});
