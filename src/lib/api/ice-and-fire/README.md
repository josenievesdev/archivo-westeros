# Integración: An API of Ice and Fire

Esta carpeta es la única frontera que conoce el contrato de
`https://anapioficeandfire.com/api`.

## Archivos

| Archivo | Responsabilidad |
| --- | --- |
| `api_client.ts` | Peticiones HTTP, URL base, parámetros y errores de estado. |
| `api_endpoints.ts` | Rutas de personajes y casas. |
| `api_types.ts` | DTOs que reproducen la respuesta externa. |
| `internal_types.ts` | Modelos estables consumidos por la aplicación. |
| `character_api.ts` | Operaciones de lista y detalle de personajes. |
| `house_api.ts` | Operaciones de lista y detalle de casas. |
| `*_normalizer.ts` | Conversión de DTO externo a modelo interno. |
| `normalizer_utils.ts` | Limpieza de cadenas y extracción de IDs de URLs. |
| `index.ts` | API pública del módulo para las features. |

## Reglas

- Ningún componente debe importar `api_types.ts`.
- Los normalizadores no traducen ni completan hechos ausentes.
- Una cadena vacía que representa ausencia se convierte en `null`.
- Las referencias externas se convierten a identificadores internos.
- Las consultas de React viven en las features, no en este módulo.
- Los normalizadores específicos de otra fuente deben vivir junto a esa integración;
  `src/lib/normalizers` se reserva para composición entre fuentes.

## Endpoints actuales

- `GET /characters`
- `GET /characters/:id`
- `GET /houses`
- `GET /houses/:id`

No se añadirán más recursos hasta que una feature los necesite.
