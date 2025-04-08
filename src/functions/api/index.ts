import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import { HTTPException } from 'hono/http-exception';
import ky from 'ky';

const app = new Hono();

app.post('/graphql', async (c) => {
  // API key will be passed in the header from the authorizer.
  // If authorized it will always be available here.
  const apiKey = c.req.header('x-api-key');

  const apiUrl = process.env.GRAPHQL_API_URL;
  if (!apiUrl) {
    throw new HTTPException(500, { message: 'API URL not configured' });
  }

  const body = await c.req.json();

  const data = await ky
    .post<Record<string, any>>(apiUrl, {
      json: body,
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    })
    .json();

  return c.json(data);
});

// Not found
app.notFound((c) => {
  throw new HTTPException(404, { message: 'Not found' });
});

// Error handler
app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return c.json({ error: error.message }, error.status);
  }
  return c.json({ error: error.message }, 500);
});

export const handler = handle(app);
