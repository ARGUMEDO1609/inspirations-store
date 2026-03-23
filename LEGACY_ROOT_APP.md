# Legacy Root Rails App

La app Rails que antes vivía en la raíz fue archivada en:

- `legacy/root_rails_app/`

## Estado actual

- La ruta activa de desarrollo es `house/` + `server/`.
- La API funcional del proyecto vive en `server/`.
- El despliegue configurado con Kamal vive en `server/config/deploy.yml`.
- CI y Dependabot del repositorio ya están alineados con `server/` y `house/`.

## Uso esperado

No uses `legacy/root_rails_app/` como punto principal de desarrollo, pruebas o despliegue, salvo que necesites revisar comportamiento heredado.
