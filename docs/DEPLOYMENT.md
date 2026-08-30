# Deployment Guide

## Quick Start — Railway (Recomendado)

### 1. Crear cuenta y proyecto
1. Andá a [railway.app](https://railway.app) y creá cuenta con GitHub
2. Click **New Project → Deploy from GitHub repo**
3. Seleccioná `inspiration-store`

### 2. Agregar PostgreSQL
En el dashboard del proyecto:
- **New → Database → PostgreSQL**
- Railway te da `DATABASE_URL` automáticamente

### 3. Configurar variables de entorno
Andá a tu servicio → **Variables** y pegá todas las variables de `server/.env.production`:

```bash
# Copiá el template y reemplazá los placeholders
cat server/.env.production
```

**Variables obligatorias para que arranque:**
| Variable | Cómo generarla |
|---|---|
| `DATABASE_URL` | Railway la da automáticamente |
| `DEVISE_JWT_SECRET_KEY` | `openssl rand -hex 64` |
| `WOMPI_PUBLIC_KEY` | Dashboard de Wompi |
| `WOMPI_INTEGRITY_KEY` | Dashboard de Wompi |
| `WOMPI_EVENT_SECRET` | Dashboard de Wompi |
| `FRONTEND_URL` | Tu dominio de Vercel |
| `APP_HOST` | `api.tu-dominio.com` |
| `CORS_ORIGINS` | `https://tu-dominio.vercel.app` |
| `RAILS_ENV` | `production` |
| `SECRET_KEY_BASE` | `openssl rand -hex 64` |

### 4. Configurar build
En **Settings → Build**:
- **Build Command:**
  ```bash
  cd server && bundle install && bundle exec rails assets:precompile
  ```
- **Start Command:**
  ```bash
  cd server && bundle exec rails server -b 0.0.0.0 -p $PORT
  ```

### 5. Deploy
Push a `main` → Railway despliega automáticamente.

---

## Frontend — Vercel

### 1. Conectar repo
1. Andá a [vercel.com](https://vercel.com) y creá cuenta con GitHub
2. **New Project → Import** → seleccioná `inspiration-store`
3. En **Framework Preset** → **Vite**
4. En **Root Directory** → `house`

### 2. Variables de entorno
En **Settings → Environment Variables**:
```
VITE_API_URL=https://api.tu-dominio.com
VITE_CABLE_URL=wss://api.tu-dominio.com/cable
VITE_SENTRY_DSN=tu-frontend-dsn
```

### 3. Deploy
Push a `main` → Vercel despliega automáticamente.

---

## Post-Deploy Checklist

Después del primer deploy, verificá:

```
✅ GET /api/v1/health → { "status": "ok", "database": "ok" }
✅ GET / → Página carga
✅ Login/Signup funciona
✅ Agregar producto al carrito
✅ Checkout con Wompi (modo fake o real)
✅ Webhook recibe eventos (probar con Wompi test)
✅ Sentry captura errores (generá un error intencional)
✅ WebSocket conecta (notificaciones en tiempo real)
```

---

## Generar Secretos

```bash
# JWT Secret (64 hex chars)
openssl rand -hex 64

# Rails Secret Key Base (64 hex chars)
openssl rand -hex 64

# Database password (24 hex chars)
openssl rand -hex 24
```

---

## Variables por Entorno

| Variable | Development | Production |
|---|---|---|
| `WOMPI_FAKE_MODE` | `true` | `false` |
| `WOMPI_*_KEY` | Test keys | Production keys |
| `SENTRY_DSN` | Vacío | Tu DSN |
| `RAILS_LOG_LEVEL` | `debug` | `info` |
| `APP_HOST` | `localhost` | `api.tu-dominio.com` |
| `FRONTEND_URL` | `http://localhost:5173` | `https://tu-dominio.vercel.app` |

---

## Troubleshooting

### "Host not allowed" en producción
Agregá tu dominio a `APP_HOST` en las env vars.

### CORS error
Verificá que `CORS_ORIGINS` incluya exactamente tu dominio de frontend (con `https://`).

### WebSocket no conecta
Verificá que `CABLE_URL` use `wss://` (no `ws://`).

### Imágenes no cargan
En producción sin S3, Active Storage usa storage local que se pierde en cada deploy. Configurar S3 después del primer deploy.
