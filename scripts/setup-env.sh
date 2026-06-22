#!/usr/bin/env bash
set -euo pipefail
REPO_ROOT=$(dirname "$0")/..
EXAMPLE="$REPO_ROOT/server/.env.example"
TARGET="$REPO_ROOT/server/.env"
if [ ! -f "$EXAMPLE" ]; then
  echo "Ejemplo .env no encontrado en $EXAMPLE"
  exit 1
fi
cp "$EXAMPLE" "$TARGET"
read -rp "WOMPI_PUBLIC_KEY (ej: pub_test_...): " wompi_public
read -rp "WOMPI_INTEGRITY_KEY (ej: test_integrity_...): " wompi_integrity
read -rp "WOMPI_EVENT_SECRET (ej: test_events_...): " wompi_event
read -rp "Activar WOMPI_FAKE_MODE? (s/n) [n]: " fake_mode_choice
sed -i.bak \
  -e "s|WOMPI_PUBLIC_KEY=.*|WOMPI_PUBLIC_KEY=$wompi_public|" \
  -e "s|WOMPI_INTEGRITY_KEY=.*|WOMPI_INTEGRITY_KEY=$wompi_integrity|" \
  -e "s|WOMPI_EVENT_SECRET=.*|WOMPI_EVENT_SECRET=$wompi_event|" \
  "$TARGET"
fake_mode_choice=${fake_mode_choice:-n}
fake_mode_choice=$(echo "$fake_mode_choice" | tr '[:upper:]' '[:lower:]')
if [[ "$fake_mode_choice" =~ ^(s|y) ]]; then
  sed -i.bak "s|WOMPI_FAKE_MODE=.*|WOMPI_FAKE_MODE=true|" "$TARGET"
  echo "Se activó WOMPI_FAKE_MODE=true" >&2
else
  sed -i.bak "s|WOMPI_FAKE_MODE=.*|WOMPI_FAKE_MODE=false|" "$TARGET"
  echo "Se dejó WOMPI_FAKE_MODE=false" >&2
fi
rm -f "$TARGET".bak
rm -f "$TARGET".bak
cat <<'EOF_MESSAGE'
Archivo $TARGET generado con los valores proporcionados.
No compartas este archivo en git.
EOF_MESSAGE
