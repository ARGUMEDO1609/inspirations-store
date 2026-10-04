# Deploy on Fly.io and Vercel

Deploy the Rails API from `server/` to Fly.io first. Deploy the React app from
`house/` to Vercel second, after the API has its final public URL.

## 1. Prepare the Fly API

Install and authenticate the Fly CLI, then work from the API directory:

```bash
cd server
fly auth login
cp fly.toml.example fly.toml
```

Replace `your-fly-api-app` in `fly.toml` with a globally unique name. The
public API will be available at `https://<app-name>.fly.dev`.

Create the Fly app without deploying it yet:

```bash
fly apps create <app-name>
```

Create or select a Fly Managed Postgres cluster in the same organization and
region as the API. Managed Postgres is currently available in Sao Paulo (`gru`),
which is the nearest listed region to Colombia, and the template uses it. Create
the cluster and note its ID:

```bash
fly mpg create
fly mpg list
```

The API uses Redis for production rate limiting. Create a Redis database with a
provider of your choice and retain its TLS connection URL. Do not deploy until
you have that value.

## 2. Set Fly configuration

Set these as Fly secrets. Replace every placeholder locally; do not commit the
values or place them in `fly.toml`.

```bash
fly secrets set --app <app-name> \
  RAILS_MASTER_KEY=<value-from-server-config-master-key> \
  SECRET_KEY_BASE=<new-random-secret> \
  DEVISE_JWT_SECRET_KEY=<new-random-secret> \
  REDIS_URL=<redis-tls-url> \
  WOMPI_PUBLIC_KEY=<wompi-production-public-key> \
  WOMPI_INTEGRITY_KEY=<wompi-production-integrity-key> \
  WOMPI_EVENT_SECRET=<wompi-webhook-secret>
```

Generate `SECRET_KEY_BASE` and `DEVISE_JWT_SECRET_KEY` with `openssl rand -hex
64`. Set the non-secret production values in Fly as well:

```bash
fly secrets set --app <app-name> \
  WOMPI_CURRENCY=COP \
  WOMPI_FAKE_MODE=false \
  APP_HOST=<app-name>.fly.dev \
  BACKEND_URL=https://<app-name>.fly.dev \
  FRONTEND_URL=https://<vercel-project>.vercel.app \
  CORS_ORIGINS=https://<vercel-project>.vercel.app
```

If you add a custom frontend domain, include that exact HTTPS origin in both
`FRONTEND_URL` and `CORS_ORIGINS`, then redeploy the API.

Finally, attach the Postgres cluster. Fly writes `DATABASE_URL` as a secret; the
API configuration uses it for its primary, cache, queue, and Action Cable
connections.

```bash
fly mpg attach <cluster-id> --app <app-name>
```

## 3. Deploy and verify the API

```bash
cd server
fly deploy
fly logs --app <app-name>
```

The release command applies the primary, cache, queue, and Action Cable
migrations before traffic reaches the new machine. Verify both endpoints:

```bash
curl -i https://<app-name>.fly.dev/up
curl -i https://<app-name>.fly.dev/api/v1/health
```

Both should return a successful HTTP response. If Fly reports a failed health
check, inspect `fly logs --app <app-name>` for a missing production variable or
a failed database/Redis connection.

## 4. Deploy the frontend on Vercel

Import the Git repository in Vercel with these project settings:

| Setting | Value |
| --- | --- |
| Root Directory | `house` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Set these environment variables for Production, Preview, and Development as
appropriate:

```text
VITE_API_URL=https://<app-name>.fly.dev
VITE_CABLE_URL=wss://<app-name>.fly.dev/cable
```

Deploy from Vercel. Then return to Fly and replace `FRONTEND_URL` and
`CORS_ORIGINS` with the actual Vercel production URL if it differs from the
placeholder used above:

```bash
fly secrets set --app <app-name> \
  FRONTEND_URL=https://<actual-vercel-domain> \
  CORS_ORIGINS=https://<actual-vercel-domain>
```

## 5. Production checks

- Sign up, sign in, and refresh the browser session.
- Load products and add one to the cart.
- Complete a payment only after Wompi production keys and webhook configuration
  have been verified.
- Confirm the Wompi webhook points at the public Fly API endpoint used by the
  application.

The API uses local Active Storage in its current production configuration.
Files uploaded to the Fly machine are not durable across replacement or scaling;
configure an S3-compatible bucket before relying on product image uploads.
