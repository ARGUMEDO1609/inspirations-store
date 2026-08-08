# Configuración para Producción

## Variables de Entorno

Copia `.env.example` a `.env` y configura los valores apropiados:

```bash
cp server/.env.example server/.env
```

### Obligatorias

| Variable | Descripción |
|----------|-------------|
| `DATABASE_HOST` | Host de PostgreSQL |
| `DATABASE_USERNAME` | Usuario de PostgreSQL |
| `DATABASE_PASSWORD` | Contraseña de PostgreSQL |
| `DEVISE_JWT_SECRET_KEY` | Clave secreta para JWT (genera una cadena aleatoria segura de al menos 32 caracteres) |
| `WOMPI_PUBLIC_KEY` | Llave pública de Wompi usada para iniciar el WompiCheckout |
| `WOMPI_INTEGRITY_KEY` | Llave que firma los parámetros de la sesión (`reference`, `amount_in_cents`, `currency`) |
| `WOMPI_EVENT_SECRET` | Secreto usado para validar el checksum de los webhooks de eventos |
| `WOMPI_CURRENCY` | Moneda usada por defecto (COP) |
| `WOMPI_FAKE_MODE` | `true` activa un checkout simulado para desarrollo cuando aún no tienes las claves reales |
| `FRONTEND_URL` | Origen HTTPS exacto del frontend en producción, por ejemplo `https://app.example.com` |
| `BACKEND_URL` | URL HTTPS pública del backend, por ejemplo `https://api.example.com` |
| `CORS_ORIGINS` | Origen(es) HTTPS exactos, separados por coma; incluye el frontend y ningún comodín/localhost |
| `APP_HOST` | Hostname(s) exactos aceptados por Rails, sin protocolo, por ejemplo `api.example.com` |
| `REDIS_URL` | Redis compartido para rate limiting; obligatorio en producción |
| `SERVER_DATABASE_PASSWORD` | Contraseña de la base productiva configurada en `config/database.yml` |

En entornos de desarrollo sin claves reales de Wompi puedes activar `WOMPI_FAKE_MODE=true`. Esto evita que Rails intente validar firmas o llamar a la API y genera un payload genérico para que el frontend abra el widget (usa los valores `WOMPI_FAKE_PUBLIC_KEY` y `WOMPI_FAKE_INTEGRITY_KEY`). En producción debe ser literalmente `false`; el backend no arrancará si detecta modo simulado o variables críticas faltantes.

## Despliegue del Backend (Rails)

1. Configura las variables de entorno en `.env`
2. Prepara la base de datos:

```bash
cd server
RAILS_ENV=production rails db:create db:migrate
```

3. Compila los assets:

```bash
RAILS_ENV=production rails assets:precompile
```

4. Inicia el servidor (usando Puma):

```bash
RAILS_ENV=production rails server -p 3000
```

## Despliegue del Frontend (Vite)

1. Configura la URL del API en `house/.env`:

```bash
VITE_API_URL=https://api.tu-dominio.com
VITE_CABLE_URL=wss://api.tu-dominio.com/cable
```

2. Build de producción:

```bash
cd house
npm run build
```

3. Los archivos en `dist/` pueden servirse con cualquier servidor web (Nginx, Apache, etc.)

## Estructura de Production

```
/home/argumedo/inspiration-store/
├── server/              # API Rails
│   ├── .env             # Variables de entorno
│   └── dist/            # No usado (API)
├── house/               # Frontend React
│   ├── .env             # VITE_API_URL
│   └── dist/           # Archivos estáticos para servir
└── nginx.conf          # Configuración de Nginx (opcional)
```

## Notas

- El API debe estar disponible en `https://tu-dominio.com/api/v1`
- El frontend se sirve estáticamente desde `house/dist/`
- ePayco requiere URLs públicas para las respuestas y confirmaciones del checkout y webhooks
- Action Cable usa WebSockets para tiempo real

## Checklist de despliegue verificable

No publiques si cualquiera de estos comandos falla.

1. Inyecta secretos desde el gestor de secretos de la plataforma; nunca copies `server/.env` al contenedor ni al repositorio. Configura `WOMPI_FAKE_MODE=false`, dominios HTTPS reales, Redis y base de datos.
2. Ejecuta `bin/ci` desde la raíz.
3. Ejecuta `cd server && bundle exec brakeman -q && bundle exec bundle-audit check`.
4. Ejecuta `cd house && npm audit --omit=dev && npm run build` con `VITE_API_URL=https://api.tu-dominio.com` y `VITE_CABLE_URL=wss://api.tu-dominio.com/cable`.
5. Ejecuta `cd server && RAILS_ENV=production bundle exec rails runner 'puts "production boot OK"'`. Este paso valida las variables obligatorias, HTTPS, CORS y Redis configurado.
6. Ejecuta únicamente `RAILS_ENV=production rails db:migrate`. No corras `db:seed`: contiene datos y usuarios de demostración.
7. Tras desplegar, comprueba HTTPS, `GET /up`, login/logout, checkout real de prueba, recepción de webhook Wompi, carga de archivos y WebSocket con un usuario autenticado.
8. Confirma que Active Storage usa un volumen persistente con backups o un bucket S3/R2/GCS. El almacenamiento local sin backup no es suficiente.

## Build y publicación del frontend

1. Actualiza `house/.env` con `VITE_API_URL` apuntando al backend en producción.
2. Corre `cd house && npm install && npm run build` para generar `house/dist/`.
3. Distribuye `dist/` mediante el servicio de tu preferencia. Para el despliegue que usamos hoy, `bin/thrust` en la raíz delega al binario `server/bin/thrust` y empuja los assets a Vercel (comprobando los logs de build antes de aceptar la release).
4. Alternativamente, alinea el hosting estático con Netlify, Vercel o un CDN y enlace la carpeta `house/dist/`.

## Revisión de secretos, logs y artefactos temporales

- Revisa `log/production.log` y `log/sidekiq.log` antes de generar la release para asegurarte de que no hay errores repetidos ni excepciones truncadas.
- Limpia `tmp/cache`, `tmp/pids`, y `tmp/sockets` si hiciera falta (`rails tmp:clear`).
- Verifica que los secretos sensibles (`DEVISE_JWT_SECRET_KEY`, `WOMPI_PUBLIC_KEY`, `WOMPI_INTEGRITY_KEY`, `WOMPI_EVENT_SECRET`, credenciales de la base de datos) estén almacenados de forma segura o inyectados como variables en el entorno de despliegue.
- Evita subir `.env` a git y documenta cualquier valor crítico directamente en este README o en `docs/DEPLOYMENT.md`.
