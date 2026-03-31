# Inspiration Store

Repositorio principal de `Inspiration Store`.

## Estructura activa

- `house/`: frontend en React + Vite + Tailwind.
- `server/`: backend API en Rails 8 + PostgreSQL + JWT + ActiveAdmin + Action Cable.
- `bin/dev`: arranque conjunto de frontend y backend.

## Cómo correr el proyecto en desarrollo

Desde la raíz:

```bash
bin/dev
```

## Scripts útiles en la raíz

- `bin/setup`: prepara `server/` y `house/`.
- `bin/ci`: corre checks del backend y del frontend.
- `bin/rails`: delega al backend real en `server/`.

## Estructura heredada

La app Rails antigua de la raíz ya no vive en la raíz del repositorio. Fue archivada en:

- `legacy/root_rails_app/`

Esa copia se conserva solo por compatibilidad y referencia histórica.

## Resumen

El flujo activo del proyecto está en:

- `house/`
- `server/`

## Arquitectura y enfoque

- `server/`: API Rails 8 con PostgreSQL, JWT, Pundit y ActiveAdmin. Expone `api/v1` y maneja pagos vía Mercado Pago, está sincronizado con Action Cable y centraliza errores mediante `ApiResponses`.
- `house/`: frontend React + Vite + Tailwind que consume el API, reconcilia el carrito y muestra la experiencia completa (catalogación, checkout y páginas de pedidos). Desde el último ciclo se reforzó el banner global de estado de red y la carga de colecciones para minimizar errores de conexión.

## Documentación clave

- `docs/DEPLOYMENT.md`: checklist de variables, despliegues y mantenimiento de logs/secretos tanto del backend como del frontend (`bin/thrust` se usa para empujar la UI).
- `docs/api-validation-and-errors.md`: formato estándar de errores JSON y validaciones críticas (`Order`, `CartItem`, `Product`, `Address`, `User`, etc.).
- `TASKS.md`: tablero vivo con el estado del flujo de compra, mejoras de admin, testing y preparación de producción; actualízalo cada vez que completes fases grandes.

## Pruebas, arranque y QA

- `bin/dev`: levanta `house` y `server` en paralelo para desarrollo local.
- `bin/setup`: instala dependencias, prepara DB y paquetes para ambos lados.
- `bin/ci`: corre `bundle exec rspec`, lint del backend, `npm run lint` y `npm run build`. Ideal antes de cualquier push o release.

## Estado del frontend

- La app ya tiene un banner persistente que informa sobre la red y errores globales, con un botón de reintento en galerías vacías o cuando falla la carga de productos.
- Se mantiene el carrito, checkout e historial de pedidos con toques de UX: loaders, notificaciones y mensajes específicos sobre stock, direcciones o pagos (contra entrega y Mercado Pago).
