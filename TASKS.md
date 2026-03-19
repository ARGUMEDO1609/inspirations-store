# Inspiration Store - Proyecto

## Estructura del Proyecto

```
inspiration-store/
├── server/    # Backend Rails API
│   ├── app/
│   │   ├── controllers/api/v1/  # Controladores API
│   │   ├── models/              # Modelos (User, Product, Order, CartItem, Category)
│   │   ├── admin/               # ActiveAdmin
│   │   └── serializers/
│   └── config/routes.rb
│
└── house/     # Frontend React + Vite + Tailwind
    ├── src/
    │   ├── pages/   # Gallery, Cart, Login, Signup
    │   ├── components/  # ProductCard
    │   ├── context/    # AuthContext
    │   └── api/        # axios config
    └── index.html
```

## Stack Tecnológico

- **Backend**: Rails 8, JWT, Devise, ActiveAdmin, PostgreSQL
- **Frontend**: React 18, Vite, Tailwind CSS, React Router

---

# Tareas

## ✅ Bugs Corregidos

- [x] **Fix: Hardcoded URLs en AuthContext** - Las URLs de API están hardcodeadas como `http://localhost:3000` en lugar de usar variables de entorno
- [x] **Fix: Interceptor de axios incompleto** - No maneja errores 401 para hacer logout automático
- [x] **Fix: No hay manejo de stock** - Al comprar no se descuenta el stock del producto
- [x] **Fix: WebhooksController** - Heredaba de ApplicationController incorrectamente, no manejaba errores
- [x] **Arquitectura Polimórfica Completa** - Implementado polimorfismo en `Reviews`, `Addresses` (para Usuarios/Pedidos) y `Notes` (para Auditoría interna).
- [x] **Fix: Root path intercepting Rails routes** - El catch-all `*path` bloqueaba el acceso a imágenes de ActiveStorage (204 No Content)
- [x] **Fix: Rails Server PID lock** - El archivo `server.pid` impedía el arranque del servidor tras un cierre no limpio
- [x] **Fix: ActiveStorage Image Loading** - Uso de `rails_storage_proxy_url` y configuración de host `127.0.0.1` para resolver problemas de CORS/Redirección en WSL
- [x] **Fix: Category slug** - Slug se regeneraba en cada validación
- [x] **Fix: Login/Register no funcionaba** - El SessionsController usaba `warden.authenticate!` que no funcionaba con JWT manual. Corregido usando `User.find_for_database_authentication` y autenticación JWT manual.
- [x] **Fix: ApiController callbacks** - Los controladores heredaban `before_action :authenticate_user!` pero el método no estaba registrado correctamente. Cada controlador ahora define su propio método de autenticación.

## 🟡 Mejoras

- [x] **Añadir página de perfil de usuario** - Implementada página `/profile` con edición de datos.
- [x] **Sistema de filtrado por categorías** - Implementado sistema de Todo, Categorías dinámicas y Más Populares.
- [x] **Validación de cantidad en cart** - El backend ahora verifica stock disponible y bloquea excedentes.
- [x] **Mejora UX: Toast notifications** - Reemplazar alerts por toasts
- [x] **Loading states en acciones** - Botones con feedback de carga y estados de procesamiento.
- [x] **Sistema de autenticación JWT** - Implementación completa de login, registro, logout con JWT tokens.

## 🟢 Nuevas Funcionalidades

- [x] **Real-time Updates (Backend)** - ActionCable configurado para transmitir cambios en Productos y Categorías.
- [x] **Real-time Updates (Frontend)** - Integrado `useActionCable` en React para actualizar la galería instantáneamente.
- [x] **Dashboard de usuario** - Implementada página `/orders` con historial de adquisiciones.
- [x] **Detalle de producto** - Página individual para cada producto
- [x] **Formulario de checkout** - Flujo de dos pasos en el carrito con confirmación de dirección.
- [x] **Sistema de autenticación JWT** - Login, registro, logout funcionando correctamente con tokens JWT.
- [x] **Revocación de tokens** - Los tokens JWT se revocan al hacer logout (almacenados en JwtDenylist).
- [ ] **Sistema de categorías** - Filtros y organización de productos
- [ ] **Panel de admin mejorado** - Gestión de pedidos y productos

## 🟠 Testing (RSpec)

### Tests Creados

- **Modelos**: User, Category, Product, Order, CartItem (36 tests)
- **Controladores API**: Products, Categories, CartItems, Orders (19 tests)

### Ejecutar Tests

```bash
cd server
bundle exec rspec                          # Todos los tests
bundle exec rspec spec/models               # Solo modelos
bundle exec rspec spec/requests            # Solo controladores
```

---

## Notas

- La API usa JWT para autenticación
- MercadoPago integrado para pagos
- ActiveAdmin para gestión interna
- **55 tests passing** ✅

## Archivos Modificados (Último Commit)

### Controladores API Corregidos:
- `app/controllers/api/v1/sessions_controller.rb` - Corregido login con autenticación JWT manual
- `app/controllers/api/v1/registrations_controller.rb` - Corregido registro para devolver JSON
- `app/controllers/api/v1/api_controller.rb` - Base controller sin before_action global
- `app/controllers/api/v1/users_controller.rb` - Con autenticación requerida
- `app/controllers/api/v1/products_controller.rb` - Sin autenticación para lectura
- `app/controllers/api/v1/categories_controller.rb` - Sin autenticación para lectura
- `app/controllers/api/v1/cart_items_controller.rb` - Con autenticación requerida
- `app/controllers/api/v1/orders_controller.rb` - Con autenticación requerida
- `app/controllers/api/v1/payments_controller.rb` - Con autenticación requerida

### Modelos:
- `app/models/user.rb` - Agregados métodos `find_for_jwt_authentication` y `find_for_jwt_authentication_from_token`

### Configuración:
- `config/initializers/devise.rb` - Configuración JWT (ya existente)
