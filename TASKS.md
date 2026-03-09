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

- **Backend**: Rails 7, JWT, Devise, ActiveAdmin, PostgreSQL
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

## 🟡 Mejoras

- [ ] **Añadir página de perfil de usuario** - Route `/profile` referenciada en Navbar pero no existe
- [ ] **Sistema de filtrado por categorías** - Los botones de "Todo", "Digital", "Físico" en Gallery no funcionan
- [ ] **Validación de cantidad en cart** - No verifica stock disponible antes de agregar
- [ ] **Mejora UX: Toast notifications** - Reemplazar alerts por toasts
- [ ] **Loading states en acciones** - Botones sin feedback de carga

## 🟢 Nuevas Funcionalidades

- [x] **Real-time Updates (Backend)** - ActionCable configurado para transmitir cambios en Productos y Categorías.
- [x] **Real-time Updates (Frontend)** - Integrado `useActionCable` en React para actualizar la galería instantáneamente.
- [ ] **Dashboard de usuario** - Ver historial de pedidos
- [ ] **Detalle de producto** - Página individual para cada producto
- [ ] **Formulario de checkout** - Dirección de envío, datos del cliente
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
