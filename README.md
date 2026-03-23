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
