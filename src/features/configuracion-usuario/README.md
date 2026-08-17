# Feature: configuración de usuario

## Objetivo

Centralizar preferencias que afecten seguridad narrativa, accesibilidad e inmersión.

## Alcance

- Audio activado o desactivado.
- Temporada y episodio actuales.
- Nivel de spoilers y revelado manual.
- Reducción de efectos y posibles preferencias visuales.

## Datos requeridos

Un modelo versionado de preferencias con valores predeterminados seguros. La primera
persistencia podrá ser local; una cuenta remota solo se añadirá si aporta sincronización
real entre dispositivos.

## Ideas futuras

Perfiles de progreso, sincronización opcional, controles de contraste, intensidad de
ambiente y consumo de datos.

## Estado

Sin implementación. No existe store global ni integración con Supabase.
