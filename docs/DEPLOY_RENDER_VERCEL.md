# Deploy producción: Vercel + Render

## Arquitectura

- Frontend React/Vite: **Vercel** usando `house/`
- Backend Rails API: **Render** usando `server/Dockerfile`
- Base de datos: PostgreSQL administrado
- Redis: requerido por producción para rate limiting
- Imágenes/archivos: usar S3/R2 si Active Storage debe persistir

## Vercel

1. Importar repo en Vercel.
2. Configurar:
   - Root Directory: `house`
   - Framework Preset: `Vite`
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist`
3. Variables de entorno:
   - `VITE_API_URL=https://API_RENDER_HOST`
   - `VITE_CABLE_URL=wss://API_RENDER_HOST/cable`
   - Opcional: `VITE_SENTRY_DSN=...`
4. Deploy.

## Render

1. Crear PostgreSQL y copiar `DATABASE_URL`/password.
2. Crear Redis/Key Value y copiar `REDIS_URL`.
3. Crear Web Service:
   - Repo: este repositorio
   - Root Directory: `server`
   - Runtime: Docker
   - Dockerfile: `server/Dockerfile`
   - Health Check Path: `/up`
4. Variables de entorno requeridas:
   - `RAILS_ENV=production`
   - `RACK_ENV=production`
   - `SECRET_KEY_BASE=<openssl rand -hex 64>`
   - `DEVISE_JWT_SECRET_KEY=<openssl rand -hex 64>`
   - `DATABASE_URL=<postgresql://...>`
   - `SERVER_DATABASE_PASSWORD=<password de postgres>`
   - `REDIS_URL=<redis://...>`
   - `WOMPI_PUBLIC_KEY=<prod public key>`
   - `WOMPI_INTEGRITY_KEY=<prod integrity key>`
   - `WOMPI_EVENT_SECRET=<prod event secret>`
   - `WOMPI_CURRENCY=COP`
   - `WOMPI_FAKE_MODE=false`
   - `FRONTEND_URL=https://APP_VERCEL_HOST`
   - `BACKEND_URL=https://API_RENDER_HOST`
   - `APP_HOST=API_RENDER_HOST`
   - `CORS_ORIGINS=https://APP_VERCEL_HOST`
   - `SOLID_QUEUE_IN_PUMA=1`
5. Deploy el servicio.

## Postdeploy

1. Verificar backend:
   - `https://API_RENDER_HOST/up`
   - `https://API_RENDER_HOST/api/v1/health`
2. Actualizar Vercel con la URL real de Render y hacer redeploy del frontend.
3. Configurar Wompi webhook:
   - `https://API_RENDER_HOST/api/v1/webhooks/wompi`
4. Probar:
   - signup/login
   - catálogo
   - carrito
   - checkout
   - webhook Wompi
   - admin en `/admin`

## Notas importantes

- `APP_VERCEL_HOST` y `API_RENDER_HOST` van sin protocolo en `APP_HOST`, pero con `https://` en `FRONTEND_URL`, `BACKEND_URL` y `CORS_ORIGINS`.
- No commitear secretos reales en Markdown ni `.env`.
- Si Render no permite crear automáticamente las bases `cache`, `queue` y `cable`, hay que ajustar la configuración multi-database antes del primer deploy.
- Para persistencia real de imágenes, configurar S3/R2; el filesystem del servicio no debe usarse como storage permanente.
