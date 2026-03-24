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
| `MP_ACCESS_TOKEN` | Token de acceso de Mercado Pago en producción |
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
- Mercado Pago requiere URLs públicas para webhooks
- Action Cable usa WebSockets para tiempo real
