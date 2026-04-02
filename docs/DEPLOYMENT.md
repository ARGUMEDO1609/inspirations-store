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
| `EPAYCO_PUBLIC_KEY` | Llave pública de ePayco (identifica el comercio en los APIs de Apify) |
| `EPAYCO_PRIVATE_KEY` | Llave privada de ePayco usada para firmar las solicitudes de sesión |
| `EPAYCO_P_CUST_ID` | Identificador de cliente (`p_cust_id_cliente`) usado en las confirmaciones |
| `EPAYCO_P_KEY` | Llave de seguridad (`p_key`) para verificar la firma de los webhooks |
| `FRONTEND_URL` | URL del frontend en producción |
| `BACKEND_URL` | URL del backend en producción |

## Despliegue del Backend (Rails)

1. Configura las variables de entorno en `.env`
2. Prepara la base de datos:

```bash
cd server
RAILS_ENV=production rails db:create db:migrate db:seed
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
VITE_API_URL=https://tu-backend-production.com/api/v1
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

## Checklist de despliegue del backend

1. Confirma que `server/.env` está sincronizado con el entorno (no subir el archivo a git y solo compartir variables necesarias).
2. Ejecuta los checks antes de release: `bin/ci` desde la raíz incluye `bundle exec rspec`, `bin/rubocop`, `npm run lint`, etc.
3. Prepara la base de datos productiva (crea, migra, seed) y vuelve a correr `rails db:migrate` si hay cambios pendientes.
4. Compila assets con `RAILS_ENV=production rails assets:precompile`.
5. Arranca la app con Puma o tu gestor (`RAILS_ENV=production bin/thrust` usa Thruster para subir el backend a la plataforma que elijas).

## Build y publicación del frontend

1. Actualiza `house/.env` con `VITE_API_URL` apuntando al backend en producción.
2. Corre `cd house && npm install && npm run build` para generar `house/dist/`.
3. Distribuye `dist/` mediante el servicio de tu preferencia. Para el despliegue que usamos hoy, `bin/thrust` en la raíz delega al binario `server/bin/thrust` y empuja los assets a Vercel (comprobando los logs de build antes de aceptar la release).
4. Alternativamente, alinea el hosting estático con Netlify, Vercel o un CDN y enlace la carpeta `house/dist/`.

## Revisión de secretos, logs y artefactos temporales

- Revisa `log/production.log` y `log/sidekiq.log` antes de generar la release para asegurarte de que no hay errores repetidos ni excepciones truncadas.
- Limpia `tmp/cache`, `tmp/pids`, y `tmp/sockets` si hiciera falta (`rails tmp:clear`).
- Verifica que los secretos sensibles (`DEVISE_JWT_SECRET_KEY`, `EPAYCO_PUBLIC_KEY`, `EPAYCO_PRIVATE_KEY`, `EPAYCO_P_CUST_ID`, `EPAYCO_P_KEY`, credenciales de la base de datos) estén almacenados de forma segura o inyectados como variables en el entorno de despliegue.
- Evita subir `.env` a git y documenta cualquier valor crítico directamente en este README o en `docs/DEPLOYMENT.md`.
