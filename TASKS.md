# Inspiration Store - Estado y Plan del Proyecto

## Resumen

`Inspiration Store` es un monorepo con:

- `house/`: frontend en React + Vite + Tailwind.
- `server/`: backend API en Rails 8 + PostgreSQL + JWT + ActiveAdmin + Action Cable.
- `legacy/root_rails_app/`: copia archivada de la antigua app Rails raíz.

El flujo principal del proyecto hoy está concentrado en `house/` y `server/`.

## Estado General

- El flujo base de e-commerce ya funciona: catálogo, auth, carrito, pedido, pago y retorno.
- El repo ya quedó reorganizado y documentado alrededor de `house/` y `server/`.
- El backend ya tiene mejor cobertura en checkout, auth, policies, webhook y polimorfismo.
- El punto principal pendiente ya no es estructura: ahora es robustez del API, testing completo y preparación para producción.

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
- JSONAPI::Serializer
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
- [x] Cobertura de tests para login, signup y current user

### Carrito y pedidos

- [x] Agregar productos al carrito
- [x] Editar cantidades
- [x] Eliminar productos del carrito
- [x] Validación de stock al comprar
- [x] Creación de pedidos desde el carrito
- [x] Historial de pedidos
- [x] Reserva de stock al crear pedido
- [x] Restauración de stock si el pago pendiente termina cancelado

### Pagos

- [x] Integración con Mercado Pago
- [x] Creación de preferencia de pago
- [x] Redirección al checkout externo
- [x] Webhook para notificaciones de pago
- [x] Manejo de estados `approved`, `pending` y `cancelled/rejected`
- [x] Pantallas de retorno de pago: éxito, fallo y pendiente
- [x] Consulta del estado real del pedido al volver del checkout
- [x] Tests de pagos y webhook

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
- [x] Gestión administrativa de pedidos
- [x] Acciones rápidas de pedido: `paid -> shipped -> completed`

### Polimorfismo y direcciones

- [x] Polimorfismo activo para `Review`, `Note` y `Address`
- [x] Restricción de tipos válidos para asociaciones polimórficas
- [x] `Order` expone correctamente `notes` y `addresses`
- [x] Normalización compatible de direcciones mediante `Address`
- [x] Sincronización entre `user.address` y `Address`
- [x] Sincronización entre `order.shipping_address` y `Address`
- [x] Tests de polimorfismo y normalización

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
- [x] Descuento inicial de stock al generar pedido con lógica de reserva
- [x] Restauración de stock cuando el pago se cancela
- [x] Correcciones en `WebhooksController`
- [x] Correcciones en carga de imágenes con Active Storage
- [x] Corrección de slugs de categorías
- [x] Mejoras de UX con toasts y loading states
- [x] Corrección de estructura del proyecto para evitar ambigüedad entre apps Rails
- [x] Corrección de asociación faltante `User -> orders`
- [x] Corrección de filtros Ransack para pedidos en ActiveAdmin

## Plan de Mejora por Fases

### Fase 1 - Cerrar el flujo de compra

Objetivo: asegurar que el proceso de compra funcione completo y de forma confiable.

- [x] Probar creación de pedido desde carrito con datos reales
- [x] Verificar redirección correcta a Mercado Pago
- [x] Implementar pantallas de retorno: éxito, fallo y pendiente
- [x] Confirmar que el webhook actualiza el pedido correctamente
- [x] Definir estados operativos del pedido (`pending`, `paid`, `cancelled`, `shipped`, `completed`)
- [x] Reflejar esos estados tanto en frontend como en admin
- [x] Cubrir pagos y webhook con tests básicos

### Fase 2 - Fortalecer backend y reglas de negocio

Objetivo: reducir errores lógicos y dejar el backend más robusto.

- [x] Revisar consistencia del flujo de stock, pedido y pago
- [x] Revisar policies de `Order` y `Product`
- [x] Confirmar protección de endpoints sensibles con JWT
- [x] Cerrar reglas principales del polimorfismo y normalización de direcciones
- [x] Estandarizar respuestas JSON de error y éxito
- [x] Centralizar manejo de errores del API
- [ ] Revisar validaciones de modelos restantes

### Fase 3 - Mejorar testing

Objetivo: cubrir lo que hoy sería más costoso romper.

- [x] Añadir tests de autenticación JWT
- [x] Añadir tests de requests para pagos
- [x] Añadir tests de webhook de Mercado Pago
- [x] Añadir tests de policies/autorización
- [x] Añadir tests de polimorfismo y normalización de direcciones
- [x] Confirmar cobertura mínima de transición completa de estados de pedido
- [ ] Ejecutar `bin/ci` como rutina estable antes de commits importantes

### Fase 4 - Mejorar panel administrativo

Objetivo: hacer que el admin sirva para operar la tienda, no solo para CRUD básico.

- [x] Añadir gestión de pedidos en ActiveAdmin
- [x] Permitir actualización rápida de estado de pedidos desde admin
- [x] Mostrar mejor estado, pago y dirección del pedido
- [x] Añadir filtros más potentes para pedidos y usuarios
- [x] Rediseñar los formularios de productos y categorías para guiarlos mejor
- [x] Enriquecer las vistas de reviews y notas con contexto operativo
- [ ] Revisar necesidades reales de operación diaria

### Fase 5 - Preparar proyecto para producción

Objetivo: dejar el sistema listo para desplegar sin improvisación.

- [x] Crear documentación de variables de entorno
- [x] Añadir `.env.example` o equivalente documentado
- [x] Documentar configuración de frontend y backend
- [ ] Definir estrategia de despliegue de `server/`
- [ ] Definir build y publicación de `house/`
- [ ] Revisar secretos, logs y archivos temporales antes de publicar

### Fase 6 - Pulir experiencia de usuario

Objetivo: que el proyecto se sienta más terminado y confiable.

- [x] Mejorar feedback del retorno de pago
- [ ] Mejorar mensajes de error de red de forma global
- [ ] Mejorar estados vacíos y loaders restantes
- [ ] Pulir experiencia del checkout
- [ ] Mejorar feedback visual del estado del pedido

### Fase 7 - Presentación y portafolio

Objetivo: que el proyecto también comunique bien su valor.

- [ ] Mejorar README para presentación pública
- [ ] Documentar arquitectura general del sistema
- [ ] Añadir screenshots o demo visual
- [ ] Resumir funcionalidades clave para portafolio
- [ ] Explicar decisiones técnicas importantes del proyecto

## Orden Recomendado de Trabajo

1. Fase 2 - Fortalecer backend y respuestas del API
2. Fase 3 - Seguir ampliando testing crítico
3. Fase 4 - Profundizar admin operativo
4. Fase 5 - Preparar producción
5. Fase 6 - Pulir UX
6. Fase 7 - Presentación y portafolio

## Prioridad Inmediata

Lo siguiente que más conviene hacer, en orden:

1. Estandarizar respuestas y errores del API para no seguir creciendo con formatos mixtos.
2. Añadir tests de transición completa de estados de pedido y flujo de compra.
3. Mejorar filtros y operación diaria del admin de pedidos.
4. Preparar variables de entorno y base documental para despliegue.

## Riesgos Técnicos Abiertos

- La reserva de stock al crear pedido ya quedó consistente, pero sigue siendo una decisión de negocio a revisar si luego quieres un modelo de descuento solo al aprobar pago.
- Siguen apareciendo warnings de `devise_for` con Rails 8.2; no están rompiendo funcionalidad, pero conviene revisarlos más adelante.
- El sistema ya sincroniza `Address` con campos legacy, pero todavía conviven ambos modelos; a futuro conviene elegir una sola fuente de verdad.

## Estado de Testing

### Backend

Cobertura ya añadida sobre:

- usuarios y autenticación
- categorías
- productos
- carrito
- pedidos
- pagos
- webhook de Mercado Pago
- policies
- polimorfismo
- normalización de direcciones

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

## Regla Operativa del Repo

- Trabajar frontend solo en `house/`.
- Trabajar backend solo en `server/`.
- No reactivar ni usar `legacy/root_rails_app/` salvo para consulta histórica.
