# Seguridad

## Cómo reportar un problema

Si encontrás una vulnerabilidad, escribime por los medios de la página de Contacto del sitio.
No la publiques hasta que haya tenido tiempo de corregirla.

## Medidas aplicadas

- **Acceso del administrador:** inicio de sesión con GitHub, limitado a un único ID de usuario.
  Sesiones de 8 horas con cookie HttpOnly y SameSite=Strict, guardadas como hash en la base.
- **API:** validación de toda entrada con Zod, SQL parametrizado, verificación del origen en
  toda operación que modifica datos y respuestas de error sin detalles internos.
- **Límite de frecuencia** en la API pública, el panel y el inicio de sesión.
- **Sitio:** Content-Security-Policy estricta y cabeceras de seguridad.
- **Fotografías:** los originales nunca se publican. Las copias públicas no tienen metadatos
  EXIF (incluida la ubicación) y sus direcciones llevan un sufijo aleatorio.
- **Registro de auditoría** de acciones administrativas, sin direcciones IP.
- **Dependencias** vigiladas semanalmente con Dependabot.