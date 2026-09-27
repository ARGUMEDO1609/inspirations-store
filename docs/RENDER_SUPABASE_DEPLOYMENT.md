# Deploy with Render, Supabase, and Vercel

This setup is intended for a test or hobby deployment:

- Render hosts the Rails API and a Redis-compatible Key Value instance.
- Supabase hosts PostgreSQL.
- Vercel hosts the React frontend.

Render Free web services spin down after inactivity. Render Key Value Free does
not persist data, which is acceptable here because it is used for rate limiting.
Supabase Free projects can pause after seven days of low activity.

## 1. Create the Supabase database

1. Create a Supabase project.
2. Wait until the project is ready, then click **Connect** in its dashboard.
3. Choose **Session pooler** and copy its connection string. Render is an
   IPv4-only persistent backend, for which Supabase recommends this mode.
4. Replace the password placeholder in that string with the database password.
   Percent-encode reserved password characters such as `#`, `?`, or `&`.

Keep this connection string private. It will be the `DATABASE_URL` value in
Render; do not commit it to an `.env` file or `render.yaml`.

## 2. Create the Render Blueprint

1. Push the current repository, including `render.yaml`, to GitHub.
2. In Render, select **New > Blueprint** and choose the repository.
3. Render reads `render.yaml` and creates these resources:
   - `inspirations-store-api`, a free Docker web service rooted at `server/`.
   - `inspirations-store-cache`, a free Redis-compatible Key Value instance.
4. During setup, Render prompts for the secret fields. Set them as follows:

| Variable | Value |
| --- | --- |
| `RAILS_MASTER_KEY` | Content of `server/config/master.key`, kept private. |
| `DATABASE_URL` | The Supabase **Session pooler** URL from step 1. |
| `FRONTEND_URL` | Temporary `https://your-vercel-project.vercel.app`. |
| `BACKEND_URL` | Temporary `https://inspirations-store-api.onrender.com`. |
| `CORS_ORIGINS` | The same URL as `FRONTEND_URL`. |
| `APP_HOST` | `inspirations-store-api.onrender.com`, without `https://`. |
| `WOMPI_PUBLIC_KEY` | Your Wompi production public key. |
| `WOMPI_INTEGRITY_KEY` | Your Wompi production integrity key. |
| `WOMPI_EVENT_SECRET` | Your Wompi webhook event secret. |

`SECRET_KEY_BASE`, `DEVISE_JWT_SECRET_KEY`, and `REDIS_URL` are configured by
the Blueprint. Do not replace them manually.

The service health check is `/up`. The Docker image uses Render's `PORT`
environment variable, so no start command is needed.

## 3. Deploy the Vercel frontend

In Vercel, import the same GitHub repository and use:

| Setting | Value |
| --- | --- |
| Root Directory | `house` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Set these production variables:

```text
VITE_API_URL=https://inspirations-store-api.onrender.com
VITE_CABLE_URL=wss://inspirations-store-api.onrender.com/cable
```

After the Vercel deployment finishes, update the Render values for
`FRONTEND_URL` and `CORS_ORIGINS` with the exact Vercel production URL. Redeploy
the API from Render after changing them.

## 4. Verify

Open these endpoints after Render reports the deployment as live:

```text
https://inspirations-store-api.onrender.com/up
https://inspirations-store-api.onrender.com/api/v1/health
```

Both must return a successful response. Then test registration, login, product
loading, cart actions, and the Wompi webhook URL.

Before relying on the application in production, configure object storage for
Active Storage. The current local upload storage does not survive a Render
replacement or redeploy.
