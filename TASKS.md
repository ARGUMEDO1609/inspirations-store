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
- ePayco Smart Checkout (`checkout-v2.js`)

### Backend

- Ruby on Rails 8
- PostgreSQL
- Devise
- JWT
- Pundit
- ActiveAdmin
- Action Cable
- Active Storage
- ePayco session service + webhook verifier
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

- [x] Integración con ePayco Smart Checkout
- [x] Creación de sesión con Apify (`login` + `payment/session/create`)
- [x] Apertura del checkout ePayco desde el frontend con el `sessionId`
- [x] Webhook para confirmar pagos y actualizar stock
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
- [x] Verificar que la sesión de ePayco crea el checkout correctamente
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
- [x] Revisar validaciones de modelos restantes

### Fase 3 - Mejorar testing

Objetivo: cubrir lo que hoy sería más costoso romper.

- [x] Añadir tests de autenticación JWT
- [x] Añadir tests de requests para pagos
- [x] Añadir tests de webhook de ePayco
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

## Notas recientes

- [x] Se validó la base local de test y la suite de RSpec volvió a correr correctamente.
- [x] Se corrigió la validación de stock al crear pedidos desde el carrito.
- [x] Se alinearon los specs de pagos al flujo actual con `Wompi::CheckoutBuilder`.
- [x] Se eliminó el hardcode temporal de `$20.000 COP` y Wompi volvió a usar el total real de la orden.
- [x] Se dejó un wrapper raíz `bin/rspec` para correr la suite desde el repo.
- [x] La suite backend quedó verde: `105 examples, 0 failures`.
Objetivo: dejar el sistema listo para desplegar sin improvisación.

- [x] Crear documentación de variables de entorno
- [x] Añadir `.env.example` o equivalente documentado
- [x] Documentar configuración de frontend y backend
- [x] Definir estrategia de despliegue de `server/`
- [x] Definir build y publicación de `house/`
- [x] Revisar secretos, logs y archivos temporales antes de publicar

### Fase 6 - Pulir experiencia de usuario

Objetivo: que el proyecto se sienta más terminado y confiable.

- [x] Mejorar feedback del retorno de pago
- [x] Mejorar mensajes de error de red de forma global
- [x] Mejorar estados vacíos y loaders restantes
- [ ] Pulir experiencia del checkout
- [ ] Mejorar feedback visual del estado del pedido

### Fase 7 - Presentación y portafolio

Objetivo: que el proyecto también comunique bien su valor.

- [x] Mejorar README para presentación pública
- [x] Documentar arquitectura general del sistema
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
- El flujo de Wompi ya usa el total real de la orden otra vez; falta validar en sandbox si existe un mínimo práctico de monto o una validación adicional de negocio para montos bajos.
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
- webhook de ePayco
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

## Trabajo reciente (31 de marzo de 2026)

- Actualicé las dependencias críticas de autenticación en `server/Gemfile:59-60` y reincorporé sus resoluciones en `server/Gemfile.lock:119-539` para usar `devise 5.0.3`, `devise-jwt 0.13.0`, `warden-jwt_auth 0.8.0`, `jwt 2.10.2` y `action_text-trix 2.1.17`.
- Intenté ejecutar `bundle install` desde `server/`, pero el entorno no podía alcanzar `index.rubygems.org`, así que no se pudieron descargar los paquetes actualizados.
- Tras restablecer la conectividad, el siguiente intento de `cd server && bundle install` completó exitosamente y dejó instaladas las versiones fijadas, por lo que ya hay gemas disponibles para continuar con `rubocop`, `bundler-audit` y demás comprobaciones.

### Próximos pasos inmediatos

1. Ejecutar `bundle install`/`bundle update` en `server/` una vez haya conectividad para materializar las versiones apuntadas en el `Gemfile.lock`.
2. Volver a correr `bin/rubocop` para verificar que la base sigue limpia con las nuevas gemas.
3. Re-ejecutar `bin/bundler-audit` y confirmar que no aparecen alertas sobre `action_text-trix` ni `devise`.
4. Verificar que `bin/ci` o al menos `cd server && bundle exec rspec` se siguen ejecutando sin errores tras la actualización del bundle.
5. Registrar cualquier incompatibilidad restante antes de seguir con nuevas funcionalidades o despliegues.

### Notas para la próxima sesión (15 de abril de 2026)

Hoy quedó resuelta la parte crítica de estabilidad local:
- [x] La base de test quedó accesible otra vez y `bin/rspec` funciona desde la raíz.
- [x] Se corrigió el fallo de stock insuficiente al crear órdenes.
- [x] Se actualizaron los specs request de pagos al namespace actual de Wompi.
- [x] Se limpiaron las deprecaciones de Rails 8 en specs request y rutas de Devise.
- [x] La suite backend terminó limpia con `105 examples, 0 failures`.
- [x] Se removió el hardcode temporal de Wompi y `WebCheckoutUrl` vuelve a calcular `amount_in_cents` desde `order.total`.

#### Próximos pasos inmediatos (Mañana)
1. Validar en sandbox de Wompi un pago completo de punta a punta con el monto real de la orden y confirmar que ya no reaparece el 422 interno.
2. Verificar si Wompi exige un monto mínimo práctico; si sí, decidir si la regla debe vivir en frontend, backend o ambos.
3. Ejecutar `bin/ci` completo para incluir también lint y build del frontend antes del siguiente push grande.
4. Revisar si conviene commitear o limpiar los logs locales y mantener `server/.env` solo como configuración privada.

## Recomendaciones adicionales (20 abril 2026)

### Estado actual (actualizado)
- Backend: Suite limpia (`99 examples, 0 failures`)
- Frontend: Lint y build limpios
- Slug eliminado de productos y categorías

### Tareas recomendadas

1. **Limpiar lint del frontend** - ✅ COMPLETADO
2. **Fix cart_items 500 error** - ✅ COMPLETADO
3. **Remover slug de productos/categorías** - ✅ COMPLETADO

4. **Ejecutar `bin/ci` completo**
   - Incluir lint + build del frontend antes del siguiente push

5. **Validar pago en sandbox ePayco**
   - Probar flujo completo (crear pedido → checkout → webhook → retorno)

6. **Fase 5 - Preparar producción**
   - Documentar variables de entorno
   - Definir estrategia de despliegue

## Regla Operativa del Repo

- Trabajar frontend solo en `house/`.
- Trabajar backend solo en `server/`.
- No reactivar ni usar `legacy/root_rails_app/` salvo para consulta histórica.
