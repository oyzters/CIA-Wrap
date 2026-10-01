# Publicar en la Chrome Web Store

Todo lo que pide el [Developer Dashboard](https://chrome.google.com/webstore/devconsole),
listo para copiar. El `.zip` se arma con `python tools/package.py` (sale en `dist/`).

## Antes del primer envío

- [ ] Cuenta de desarrollador **de Oyzters** (no personal: transferir una extensión después es difícil).
      Pago único de registro y correo verificado.
- [ ] La landing publicada en **https://cia.potronet.com**, con **https://cia.potronet.com/privacidad** en línea — la tienda pide
      la URL de la política de privacidad y el revisor la abre.
- [ ] `python tools/package.py` sin errores → `dist/cia-wrap-<versión>.zip`.
- [ ] Imágenes de `store/` (capturas y mosaico promocional).

## Ficha (pestaña *Store listing*)

| Campo | Valor |
|---|---|
| Nombre | CIA Wrap (sale del manifest) |
| Resumen | Interfaz moderna para el portal CIA del ITSON: diseño limpio, modo oscuro y pantallas a todo lo ancho. No oficial. |
| Categoría | Educación |
| Idioma | Español (Latinoamérica) |
| Sitio web | https://cia.potronet.com |
| Correo de soporte | mdjesuscv@gmail.com |
| Ícono | `extension/icons/icon-128.png` (128×128) |
| Capturas | `store/captura-*.png` (1280×800) |
| Mosaico promocional pequeño | `store/promo-440x280.png` |

**Descripción**

```
Una interfaz moderna para el portal CIA / PeopleSoft del ITSON. Proyecto independiente de estudiantes — no oficial.

El mismo portal, con otra cara:
• Diseño limpio y consistente, con modo claro, oscuro o automático.
• Pantallas a todo lo ancho: sin cajas encimadas ni texto cortado.
• Centro de Alumnado como panel: tu saldo, retenciones y clases de la semana de un vistazo.
• Horario semanal como calendario, con un color por materia.
• Menú lateral y ruta de navegación para no perderte entre secciones.
• Iconos y controles modernos en lugar de los de PeopleSoft.

Privado por diseño:
• Corre en tu navegador, sobre la sesión que ya iniciaste.
• No inicia sesión por ti ni lee o guarda contraseñas.
• No envía datos a ningún lado. No hay servidor intermedio.

Desde el ícono de la extensión la enciendes o apagas, eliges el tema y abres el portal.

Código abierto (MIT): github.com/oyzters/CIA-Wrap
Sitio: cia.potronet.com

CIA Wrap no está afiliado ni respaldado por el Instituto Tecnológico de Sonora (ITSON). "ITSON", "CIA" y PeopleSoft pertenecen a sus respectivos titulares.
```

## Prácticas de privacidad (pestaña *Privacy*)

**Propósito único**

```
Rediseñar la interfaz del portal CIA / PeopleSoft del ITSON (estilos, maquetación, iconos y navegación) sobre la sesión del propio estudiante, sin cambiar la lógica ni los datos del sistema.
```

**Justificación de permisos**

| Permiso | Justificación |
|---|---|
| `storage` | Recordar si la interfaz está encendida y el tema elegido (claro, oscuro o automático). Se guarda solo en el navegador. |
| `smartweb1.itson.edu.mx`, `smartweb2.itson.edu.mx` | Es el portal CIA / PeopleSoft que la extensión reestiliza. Se declara con `*://` porque el portal sirve sus páginas por HTTP (puerto 8600); la extensión no envía nada a ese servidor. |
| `apps9.itson.edu.mx/CIA*` | Portada de acceso del CIA, que también se reestiliza. Solo esa ruta: el resto de apps9 no se toca. |

**¿Usa código remoto?** No. Todo el JavaScript va dentro del paquete. Lo único externo
son las tipografías de Google Fonts (CSS y fuentes, no código).

**Uso de datos:** no se marca ninguna categoría — la extensión no recopila ni transmite
datos del usuario. Se certifican las tres declaraciones (no se venden datos a terceros,
no se usan para fines ajenos al propósito único, no se usan para crédito o préstamos).

**Política de privacidad:** https://cia.potronet.com/privacidad

## Notas para el revisor

```
CIA Wrap es una capa visual sobre el portal CIA / PeopleSoft del ITSON (apps9.itson.edu.mx/CIA y smartweb1/2.itson.edu.mx). Para verla funcionando hace falta una
cuenta institucional del ITSON, que no podemos compartir. La extensión solo reestiliza
las páginas que el usuario ya tiene abiertas con su propia sesión: no inicia sesión,
no lee ni guarda contraseñas, no hace peticiones de red propias y no envía datos.
Las capturas de la ficha muestran el portal con la extensión activa. Es un proyecto
independiente de estudiantes, sin afiliación oficial con el ITSON (así lo dice la ficha).
```

## Distribución

Pública, en todas las regiones. Publicación: **manual después de la aprobación** si
quieren coordinarla con un anuncio; si no, automática.

## Publicar una actualización

1. Subir `version` en `extension/manifest.json` (tiene que ser mayor que la publicada).
2. Agregar la versión a `CHANGELOG.md` y, en lenguaje de usuario, a `extension/changelog.js`.
3. `git tag v<versión> && git push origin v<versión>` → la Action arma el zip y crea el
   Release. Sin la Action: `python tools/package.py`, subir el zip en el dashboard
   (*Package* → *Upload new package*) y enviar a revisión.
4. Toda actualización pasa por revisión (normalmente horas o pocos días; más si cambian
   permisos o sitios). Al aprobarse, Chrome la instala sola a los usuarios y el ícono
   muestra **NEW** con las novedades.

## Publicar desde GitHub (opcional)

La Action `.github/workflows/release.yml` también sube el zip a la tienda si el repo
tiene estos secretos (*Settings → Secrets and variables → Actions*):

| Secreto | De dónde sale |
|---|---|
| `CWS_EXTENSION_ID` | El ID de la extensión en el dashboard (tras el primer envío manual). |
| `CWS_CLIENT_ID`, `CWS_CLIENT_SECRET` | Un cliente OAuth en Google Cloud con la *Chrome Web Store API* habilitada. |
| `CWS_REFRESH_TOKEN` | Generado una vez con ese cliente. |

La guía para obtenerlos: [chrome-webstore-upload-keys](https://github.com/fregante/chrome-webstore-upload-keys).
El primer envío siempre es manual (ahí se crea el ID y se llena la ficha).

## Nombre y marca

La tienda revisa nombres que parecen suplantar a una institución. Por eso el nombre es
**CIA Wrap** (sin "ITSON") y la ficha, la landing y la política de privacidad dicen que es
un proyecto no oficial. No usar logotipos del ITSON en las imágenes de la ficha.
