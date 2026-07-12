# Webhook Validator - Resiliente ante Environment Variables faltantes

Inicialmente, falta WOMPI_EVENT_SECRET generaba error 500 en webhooks, bloqueando confirmaciones de pagos. El fix consiste en sanitizar la validación del secreto:

- Único: Envoltoria de `ENV.fetch` en `begin/rescue` para devolver `false` en KeyError
- único: Evita caías recursivas de reintentos en Wompi

Resultado: Webhooks fallidos ahora devuelven 400 o 200 OK (según contexto), conservando flujo de pagos.