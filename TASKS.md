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

- [ ] Continuar mañana con la investigación del error 403 de Wompi y asegurar que el redirect autorizado + la clave de pruebas en sandbox funcionen sobre `http://localhost:5173/payment/result`.
- [ ] Validar que la base de datos local pueda migrar (`bundle exec rails db:migrate`) y luego ejecutar los specs de checkout/webhook.
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

### Notas para la próxima sesión (14 de abril de 2026)

Hoy logramos avances críticos en la integración con Wompi:
- [x] Creamos la guía oficial de testing para Sandbox (`wompi_sandbox_testing.md`).
- [x] Establecimos el checklist seguro de pase a producción (`payment_production_checklist.md`).
- [x] Corregimos el **Error 403 de Amazon CloudFront** limpiando los saltos de línea invisibles (`\r`) en las llaves `.env` usando `.strip`.
- [x] Evitamos el bloqueo estricto del cortafuegos de AWS (SSRF) configurando el backend para que **omita `redirect-url`** temporalmente cuando se prueba desde `localhost`.
- [x] Refactorizamos la presentación visual de la moneda para que muestre `COP` al final (ej. `15.000 COP`) sin el símbolo `$`.
- [x] Diagnosticamos por qué Wompi devolvía Error 422 interno (`api/merchants/undefined`): el carrito estaba enviando cobros por 16 pesos (`amount_in_cents=1600`).
- [x] Aplicamos un parche temporal (hardcode) de `$20.000 COP` en la URL de Wompi para asegurar que la vista web de prueba pudiera cargar siempre sin estrellarse por el mínimo.

#### Próximos pasos inmediatos (Mañana)
1. **Validar secretos:** Revisar en el dashboard de Wompi que el "Secreto de Integridad" concuerde *exactamente* con `test_integrity_...` en el `.env`. Si no concuerda, la firma es inválida y Wompi devolverá 422 al dar clic en Pagar.
2. **Prueba final de Nequi:** Utilizar el número de Sandbox oficial `3991111111` en la pasarela, dar click en Pagar, y recibir la orden de `Aprobada`.
3. **Revertir parche temporal:** Cuando funcione, quitar el hardcode de `2000000` en `web_checkout_url.rb` y restaurar la fórmula real con los carritos reales >$1.500 COP.

## Regla Operativa del Repo

- Trabajar frontend solo en `house/`.
- Trabajar backend solo en `server/`.
- No reactivar ni usar `legacy/root_rails_app/` salvo para consulta histórica.
