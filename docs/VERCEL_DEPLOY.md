# ═══════════════════════════════════════════════════════════════════
# Inspiration Store — Deploy en Vercel (Todo en uno)
# ═══════════════════════════════════════════════════════════════════
#
# IMPORTANTE: Esta configuración tiene limitaciones conocidas:
#
# ❌ Action Cable (WebSocket) NO funciona en Vercel
#    - Las notificaciones en tiempo real no van a funcionar
#    - El cart sync entre pestañas no va a funcionar
#    - Solución: usar polling o migrar a Railway/Render
#
# ❌ Cold starts de 3-5 segundos
#    - Después de 15min sin requests, el primer request tarda
#    - Impacto: usuarios experimentan lentitud inicial
#
# ❌ Filesystem efímero
#    - Active Storage local se pierde en cada request
#    - Para imágenes, configurar S3/R2 después del primer deploy
#
# ✅ Lo que SÍ funciona:
#    - API REST completa (CRUD, auth, pagos)
#    - Webhooks de Wompi
#    - Base de datos PostgreSQL (usar Railway DB o Supabase)
#    - Sentry error tracking
#
# ═══════════════════════════════════════════════════════════════════
#
# PASOS PARA DEPLOY EN VERCEL:
#
# 1. Crear cuenta en vercel.com con GitHub
#
# 2. Importar el repo:
#    - vercel.com/new → Import Git Repository
#    - Seleccionar argumedo/inspirations-store
#
# 3. Configurar el proyecto:
#    - Framework Preset: Docker
#    - Root Directory: . (raíz del repo)
#    - Dockerfile: server/Dockerfile.vercel
#
# 4. Variables de entorno (Settings → Environment Variables):
#
#    REQUERIDAS:
#    DATABASE_URL=postgresql://user:pass@host:5432/db
#    DEVISE_JWT_SECRET_KEY=generar_con_openssl_rand_hex_64
#    SECRET_KEY_BASE=generar_con_openssl_rand_hex_64
#    WOMPI_PUBLIC_KEY=pub_prod_...
#    WOMPI_INTEGRITY_KEY=prod_integrity_...
#    WOMPI_EVENT_SECRET=prod_events_...
#    WOMPI_FAKE_MODE=false
#    WOMPI_CURRENCY=COP
#    FRONTEND_URL=https://tu-proyecto.vercel.app
#    APP_HOST=tu-proyecto.vercel.app
#    CORS_ORIGINS=https://tu-proyecto.vercel.app
#    RAILS_ENV=production
#    RACK_ENV=production
#
#    OPCIONALES:
#    SENTRY_DSN=https://...@sentry.io/...
#    RAILS_LOG_LEVEL=info
#
# 5. Base de datos:
#    Opción A: Railway (gratis) - railway.app → New → PostgreSQL
#    Opción B: Supabase (gratis) - supabase.com → New Project
#    Opción C: Neon (gratis) - neon.tech
#
# 6. Deploy:
#    git push origin main → Vercel despliega automáticamente
#
# 7. Post-deploy:
#    - Verificar GET /api/v1/health
#    - Probar login/signup
#    - Probar checkout con Wompi test
#    - Configurar Sentry DSN
#
# ═══════════════════════════════════════════════════════════════════
