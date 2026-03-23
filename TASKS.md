# Inspiration Store - Estado y Plan del Proyecto

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

## Plan de Mejora por Fases

### Fase 1 - Cerrar el flujo de compra

Objetivo: asegurar que el proceso de compra funcione completo y de forma confiable.

- [ ] Probar creación de pedido desde carrito con datos reales
- [ ] Verificar redirección correcta a Mercado Pago
- [ ] Implementar o validar pantallas de retorno: éxito, fallo y pendiente
- [ ] Confirmar que el webhook actualiza el pedido correctamente
- [ ] Definir estados finales del pedido (`pending`, `paid`, `failed`, `cancelled`)
- [ ] Reflejar esos estados tanto en frontend como en admin

### Fase 2 - Fortalecer backend y reglas de negocio

Objetivo: reducir errores lógicos y dejar el backend más robusto.

- [ ] Estandarizar respuestas JSON de error y éxito
- [ ] Centralizar manejo de errores del API
- [ ] Revisar validaciones de modelos clave
- [ ] Revisar policies de Pundit para usuarios y admin
- [ ] Confirmar protección de endpoints sensibles
- [ ] Revisar consistencia del flujo de stock, pedido y pago

### Fase 3 - Mejorar testing

Objetivo: cubrir lo que hoy sería más costoso romper.

- [ ] Añadir tests de autenticación JWT
- [ ] Añadir tests de requests para pagos
- [ ] Añadir tests de webhook de Mercado Pago
- [ ] Añadir tests de policies/autorización
- [ ] Confirmar cobertura mínima de pedido, carrito y transición de estados
- [ ] Ejecutar `bin/ci` como rutina estable antes de commits importantes

### Fase 4 - Mejorar panel administrativo

Objetivo: hacer que el admin sirva para operar la tienda, no solo para CRUD básico.

- [ ] Añadir mejor gestión de pedidos en ActiveAdmin
- [ ] Permitir actualización de estado de pedidos desde admin
- [ ] Mostrar mejor stock, pagos y estado de entrega
- [ ] Añadir filtros útiles para usuarios, pedidos y productos
- [ ] Revisar necesidades reales de operación diaria

### Fase 5 - Preparar proyecto para producción

Objetivo: dejar el sistema listo para desplegar sin improvisación.

- [ ] Crear documentación de variables de entorno
- [ ] Añadir `.env.example` o equivalente documentado
- [ ] Documentar configuración de frontend y backend
- [ ] Definir estrategia de despliegue de `server/`
- [ ] Definir build y publicación de `house/`
- [ ] Revisar secretos, logs y archivos temporales antes de publicar

### Fase 6 - Pulir experiencia de usuario

Objetivo: que el proyecto se sienta más terminado y confiable.

- [ ] Mejorar mensajes de error de red
- [ ] Mejorar estados vacíos y loaders
- [ ] Pulir experiencia del checkout
- [ ] Mejorar feedback visual del estado del pedido
- [ ] Añadir páginas o vistas de confirmación de pago más claras

### Fase 7 - Presentación y portafolio

Objetivo: que el proyecto también comunique bien su valor.

- [ ] Mejorar README para presentación pública
- [ ] Documentar arquitectura general del sistema
- [ ] Añadir screenshots o demo visual
- [ ] Resumir funcionalidades clave para portafolio
- [ ] Explicar decisiones técnicas importantes del proyecto

## Orden Recomendado de Trabajo

1. Fase 1 - Cerrar flujo de compra
2. Fase 2 - Fortalecer backend
3. Fase 3 - Mejorar testing
4. Fase 4 - Mejorar panel administrativo
5. Fase 5 - Preparar producción
6. Fase 6 - Pulir UX
7. Fase 7 - Presentación y portafolio

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
