# Project Structure

## Estructura canónica actual

La estructura funcional del proyecto hoy es:

```text
inspiration-store/
├── house/                  # Frontend React
├── server/                 # Backend Rails API
├── bin/dev                 # Arranque conjunto
├── bin/setup               # Setup del proyecto activo
├── bin/ci                  # Checks del proyecto activo
└── legacy/root_rails_app/  # App Rails heredada archivada
```

## Qué se hizo

- Se confirmó que el desarrollo activo usa `house/` y `server/`.
- Se migró CI y Dependabot para apuntar a esas carpetas.
- La app Rails antigua de la raíz fue archivada en `legacy/root_rails_app/`.
- Los scripts útiles de la raíz ahora delegan al proyecto activo.

## Qué quedó en la raíz

- `bin/dev`
- `bin/setup`
- `bin/ci`
- wrappers como `bin/rails`, `bin/rake`, `bin/rubocop`
- documentación del proyecto
- `house/`
- `server/`
- `legacy/`

## Qué quedó archivado

Dentro de `legacy/root_rails_app/` quedó la app Rails raíz original, incluyendo:

- `app/`
- `config/`
- `db/`
- `public/`
- `test/`
- `Dockerfile`
- `config.ru`
- `Gemfile`
- scripts Rails heredados

## Regla práctica

A partir de ahora:

- trabaja frontend en `house/`;
- trabaja backend en `server/`;
- usa la raíz solo como punto de entrada del monorepo;
- trata `legacy/root_rails_app/` como archivo histórico, no como app activa.
