# Validaciones y respuestas de error del API

Este documento complementa `ApiResponses` y enumera las validaciones clave que garantizan el flujo seguro del API.

## Formato estándar de respuesta de error

Todos los errores controlados siguen el mismo contenedor JSON:

```json
{
  "success": false,
  "error": "Mensaje legible para el cliente",
  "error_code": "bad_request|unauthorized|not_found|validation_failed|internal_error",
  "details": ["..." | { ... }]
}
```

- `error`: texto que el frontend puede mostrar, normalmente traducido para el usuario final.
- `error_code`: identificador corto dentro de `ApiResponses::ERROR_CODES` que indica la categoría.
- `details`: opcionalmente incluye el array de errores de validación (por ejemplo, `model.errors.full_messages`).
- Usa `render_validation_errors(errors)` para incluir todos los errores como `details` con el código `validation_failed`.

## Validaciones críticas por modelo

| Modelo | Validaciones relevantes |
|--------|-------------------------|
| `Order` | `total` (presencia y ≥ 0), `shipping_address` (presencia), estados `enum` (`pending`, `paid`, `shipped`, `completed`, `cancelled`) y `payment_method` (`card`, `cash_on_delivery`).
| `Product` | `title`, `price`, `stock` (>= 0), `slug` (único). Actua como referencia de inventario. |
| `CartItem` | `quantity` (> 0) y validación personalizada `validate_stock_availability` que no permite exceder el stock actual. |
| `Category` | `name` y `slug` (únicos, presentes) para mantener la navegación filtrada. |
| `Address` | `address_line_1` presente y `addressable_type` limitado a `User`/`Order`, junto con `address_type` (`shipping`, `billing`, `home`). |
| `Review` y `Note` | `rating`, `comment`, `body` y referencias polimórficas sólo a clases permitidas (`REVIEWABLE_TYPES`, `NOTABLE_TYPES`). |
| `User` | `name` obligatorio y Devise controla el resto (`email`, contraseña). Mantiene sincronización con `Address`. |

### Validaciones operativas complementarias
- `OrderItem` exige `quantity` y `unit_price` para que el resumen del pedido sea consistente.
- `Address` y `Order` sincronizan direcciones legadas, por lo que las actualizaciones deben pasar por `sync_legacy_address_column_from_addresses!`.
- `Order#apply_payment_update!` usa `with_lock` para proteger inventario, y restaura stock sólo si el pedido estaba en `pending`.

## Buenas prácticas al extender el API

1. Siempre usa `render_success`, `render_error`, `render_validation_errors` u otros helpers de `ApiResponses` para mantener la forma del payload.
2. Cuando agregues nuevos modelos críticos, registra sus validaciones en esta tabla; así reflejamos rápidamente qué campos se deben documentar en el frontend.
3. Para errores personalizados, agrega mensajes claros y (si aplica) detalles con campos e información adicional, sin cambiar el string `error` esperado por el cliente.
4. Los `error_code` también permiten diferenciar en los logs entre un `BadRequest` por params faltantes y un `Validation failed` con reglas del modelo.

