# Inspiration Store - Estado del Proyecto

## Resumen

`Inspiration Store` es un monorepo con:

- `house/`: frontend en React + Vite + Tailwind.
- `server/`: backend API en Rails 8 + PostgreSQL + JWT + ActiveAdmin + Action Cable.
- `legacy/root_rails_app/`: copia archivada de la antigua app Rails raíz.

El flujo principal del proyecto hoy está concentrado en `house/` y `server/`.

## Estructura Actual

```text
inspiration-store/
├── house/                  # Frontend React
├── server/                 # Backend Rails API
├── bin/dev                 # Arranque conjunto
├── bin/setup               # Setup del proyecto activo
├── bin/ci                  # CI local del proyecto activo
├── docs/                   # Documentación técnica
└── legacy/root_rails_app/  # App Rails heredada archivada
```

## Stack Tecnológico

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Action Cable client
- Mercado Pago SDK React

### Backend

- Ruby on Rails 8
- PostgreSQL
- Devise
- JWT
- Pundit
- ActiveAdmin
- Action Cable
- Active Storage
- Mercado Pago SDK
- RSpec + FactoryBot

## Funcionalidades Implementadas

### Catálogo y navegación

- [x] Listado de productos
- [x] Filtro por categorías
- [x] Vista de detalle de producto
- [x] Navegación principal de tienda

### Autenticación y usuario

- [x] Registro de usuario
- [x] Login con JWT
- [x] Logout con revocación de token
- [x] Carga del usuario autenticado
- [x] Perfil de usuario con edición básica

### Carrito y pedidos

- [x] Agregar productos al carrito
- [x] Editar cantidades
- [x] Eliminar productos del carrito
- [x] Validación de stock al comprar
- [x] Creación de pedidos desde el carrito
- [x] Historial de pedidos

### Pagos

- [x] Integración con Mercado Pago
- [x] Creación de preferencia de pago
- [x] Redirección al checkout externo
- [x] Webhook para notificaciones de pago

### Tiempo real

- [x] Notificaciones de cambios de productos
- [x] Notificaciones de actualización de pedidos
- [x] Integración frontend con Action Cable

### Administración

- [x] ActiveAdmin configurado
- [x] Gestión administrativa de productos
- [x] Gestión administrativa de categorías
- [x] Gestión administrativa de usuarios
- [x] Gestión administrativa de reviews, notes y addresses

### Arquitectura y mantenimiento

- [x] Reorganización del repo como monorepo claro
- [x] Archivado de la app Rails antigua en `legacy/root_rails_app/`
- [x] Scripts raíz alineados con `server/` y `house/`
- [x] CI alineada con la estructura activa
- [x] Dependabot alineado con la estructura activa
- [x] Documentación base del repo actualizada

## Correcciones Ya Realizadas

- [x] URLs hardcodeadas del frontend corregidas
- [x] Mejoras en autenticación JWT
- [x] Corrección de login y registro
- [x] Validación de stock en carrito y pedido
- [x] Descuento de stock al generar pedidos
- [x] Correcciones en `WebhooksController`
- [x] Correcciones en carga de imágenes con Active Storage
- [x] Corrección de slugs de categorías
- [x] Mejoras de UX con toasts y loading states
- [x] Corrección de estructura del proyecto para evitar ambigüedad entre apps Rails

## Estado de Testing

### Backend

- Hay specs de modelos y requests dentro de `server/spec/`.
- El proyecto tiene cobertura al menos sobre:
  - usuarios
  - categorías
  - productos
  - carrito
  - pedidos

### Ejecutar checks

Desde la raíz:

```bash
bin/ci
```

Checks manuales útiles:

```bash
cd server && bundle exec rspec
cd house && npm run lint
cd house && npm run build
```

## Pendientes Recomendados

### Alta prioridad

- [ ] Verificar flujo completo de pago de punta a punta en entorno local
- [ ] Revisar manejo de errores del checkout y estados de pago
- [ ] Confirmar cobertura de tests para webhooks y autenticación
- [ ] Revisar permisos y políticas de admin sobre pedidos

### Media prioridad

- [ ] Mejorar gestión administrativa de pedidos
- [ ] Mejorar panel admin para operaciones diarias
- [ ] Añadir documentación de variables de entorno
- [ ] Documentar proceso de despliegue futuro
- [ ] Refinar estados y mensajes del frontend en fallos de red

### Baja prioridad

- [ ] Limpiar logs y archivos temporales heredados si ya no aportan valor
- [ ] Revisar si `legacy/root_rails_app/` debe mantenerse o eliminarse en el futuro
- [ ] Añadir documentación funcional para portafolio o demo

## Estado Actual de Organización

### Activo

- `house/`
- `server/`
- `bin/`
- `docs/`

### Archivado

- `legacy/root_rails_app/`

## Regla Operativa

A partir de ahora:

- el frontend se trabaja en `house/`;
- el backend se trabaja en `server/`;
- la raíz se usa como punto de entrada del monorepo;
- la app en `legacy/root_rails_app/` no debe tratarse como parte activa del proyecto.
