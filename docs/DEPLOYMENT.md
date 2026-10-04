# Inspiration Store — Deploy Guide

## Frontend (Vercel)

### Configuración en Vercel Dashboard
1. **Import** → GitHub repo `inspiration-store`
2. **Root Directory:** `house`
3. **Framework Preset:** Vite
4. **Build Command:** `npm install && npm run build`
5. **Output Directory:** `dist`

### Variables de entorno en Vercel
```
VITE_API_URL=https://tu-backend.up.railway.app
VITE_CABLE_URL=wss://tu-backend.up.railway.app/cable
```

## Backend (Railway)

### Setup inicial
1. railway.app → **New Project → Deploy from GitHub repo**
2. Root Directory: `server`
3. Settings → Builder: **Dockerfile**
4. Start Command: `cd server && bundle exec rails server -b 0.0.0.0 -p $PORT`

### Variables de entorno
Ver `server/.env.production` para la lista completa.

**Requeridas:**
```
RAILS_ENV=production
RACK_ENV=production
SECRET_KEY_BASE=<generar con: openssl rand -hex 64>
DEVISE_JWT_SECRET_KEY=<generar con: openssl rand -hex 64>
DATABASE_URL=<viene de PostgreSQL addon>
WOMPI_PUBLIC_KEY=<configurar-en-el-proveedor>
WOMPI_INTEGRITY_KEY=<configurar-en-el-proveedor>
WOMPI_EVENT_SECRET=<configurar-en-el-proveedor>
WOMPI_CURRENCY=COP
WOMPI_FAKE_MODE=false
FRONTEND_URL=https://inspirations-store.vercel.app
APP_HOST=inspirations-store.vercel.app
CORS_ORIGINS=https://inspirations-store.vercel.app
```

### PostgreSQL
En Railway: **New → Database → PostgreSQL**
- `DATABASE_URL` se genera automáticamente.

### Verificar deploy
Visitá: `https://tu-backend.up.railway.app/api/v1/health`

## Post-deploy
1. Actualizar `VITE_API_URL` en Vercel con la URL de Railway
2. Hacer redeploy en Vercel
3. Probar login, carrito, checkout

## Limitaciones conocidas
- **Action Cable:** WebSocket no persiste en Vercel/Railway serverless
- **Cold starts:** Primer request después de inactividad tarda 3-5s
- **Imágenes:** Si usás ActiveStorage local, configurar S3/R2 después
