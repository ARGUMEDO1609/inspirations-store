#!/usr/bin/env bash
set -euo pipefail
TOKEN="${TOKEN:-}"
if [ -z "$TOKEN" ]; then
  echo "Exporta primero tu token: export TOKEN='Bearer <tu_token>'"
  exit 1
fi
API="http://localhost:3000/api/v1"
ORDER_RESPONSE=$(curl -s -X POST "$API/orders" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"order":{"shipping_address":"Dirección temporal","payment_method":"card"}}')
ORDER_ID=$(echo "$ORDER_RESPONSE" | jq -r '.data.id')
if [ "$ORDER_ID" = "null" ] || [ -z "$ORDER_ID" ]; then
  echo "No se pudo crear el pedido:"
  echo "$ORDER_RESPONSE"
  exit 1
fi
CHECKOUT=$(curl -s "$API/orders/${ORDER_ID}/pay" -H "Authorization: $TOKEN" | jq '.data.checkout')
if [ "$CHECKOUT" = "null" ]; then
  echo "No se generó la sesión de Wompi:"
  curl -s "$API/orders/${ORDER_ID}/pay" -H "Authorization: $TOKEN"
  exit 1
fi
PUBLIC_KEY=$(echo "$CHECKOUT" | jq -r '.public_key')
REFERENCE=$(echo "$CHECKOUT" | jq -r '.reference')
AMOUNT=$(echo "$CHECKOUT" | jq -r '.amount_in_cents')
CURRENCY=$(echo "$CHECKOUT" | jq -r '.currency')
SIGNATURE=$(echo "$CHECKOUT" | jq -r '.signature')
REDIRECT=$(echo "$CHECKOUT" | jq -r '.redirect_url')
cat <<EOF
Checkout generado:
- reference: $REFERENCE
- amount: $AMOUNT $CURRENCY
- public_key: $PUBLIC_KEY
- signature: $SIGNATURE
- redirect_url: $REDIRECT
- URL directa (si la tienes): https://checkout.wompi.co/l/test_VPOS_VGsoyT

Para abrirlo en la consola del navegador:
const checkout = new window.WompiCheckout({
  publicKey: "$PUBLIC_KEY",
  currency: "$CURRENCY",
  amountInCents: $AMOUNT,
  reference: "$REFERENCE",
  signature: "$SIGNATURE",
  redirectUrl: "$REDIRECT"
});
checkout.open();
