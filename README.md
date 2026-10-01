# CIA Wrap

Interfaz moderna para el portal **CIA / PeopleSoft** del ITSON
(`apps9.itson.edu.mx/CIA` y `smartweb1/2.itson.edu.mx`): el mismo sistema de
diseño que [iVirtual Wrap](https://github.com/oyzters/iVirtual-Wrap) — Figtree,
azules ITSON, modo claro, oscuro o automático —, pantallas a todo lo ancho,
iconos propios en lugar de los GIF de PeopleSoft y el Centro de Alumnado como
panel. Todo **sobre tu propia sesión**, ya iniciada con tu cuenta.

Sitio: [cia.potronet.com](https://cia.potronet.com) · Acceso directo al portal:
[cia.potronet.com/entrar](https://cia.potronet.com/entrar)

> **Importante — qué NO es esto:** no es un login alterno ni un proxy. Cada
> persona se conecta directo a ITSON con su cuenta; esto solo re-estiliza la
> página que ya tienes abierta, en tu navegador. **No maneja contraseñas, no
> hace peticiones de red, no cambia nada en el servidor de ITSON.**
>
> El portal corre en **HTTP sin SSL**: tu usuario y contraseña viajan sin
> cifrar. Eso solo lo puede arreglar el área de TI de ITSON en el servidor;
> ninguna capa del lado del cliente lo soluciona. Vale la pena reportarlo.

## Instalar

**Chrome, Edge o Brave:** desde la [Chrome Web Store](https://cia.potronet.com) —
botón *Agregar a Chrome*. Se actualiza sola; cuando hay versión nueva, el ícono
muestra **NEW** y el menú de la extensión lista las novedades.

Desde el ícono de la extensión se enciende o apaga, se elige el tema (claro,
oscuro o automático) y se abre el portal.

### Desde el código (para desarrollar)

1. Ve a `chrome://extensions` y activa el **modo de desarrollador**.
2. **Cargar descomprimida** → la carpeta `extension/`.
3. Entra al CIA: la interfaz se aplica sola.

Para generar el `.zip` de la tienda: `python tools/package.py` (ver
[STORE.md](STORE.md) para publicar y [CHANGELOG.md](CHANGELOG.md) para las
versiones).

## Otras formas (versión anterior)

El userscript y el bookmarklet siguen funcionando, pero son de **antes de la
v1.0**: no traen el rediseño de las pantallas, los iconos ni el panel del
Centro de Alumnado. Para la experiencia completa, usa la extensión.

### Userscript — se activa sola, sin cargar extensión

1. Instala [Tampermonkey](https://www.tampermonkey.net/) o Violentmonkey.
2. Panel → **Crear nuevo script** → pega el contenido de
   `userscript/itson-peoplesoft-wrap.user.js` → **Guardar**.

### Bookmarklet — un link, cero instalación

- Abre `bookmarklet/itson-wrap-installer.html` en el navegador y **arrastra el
  botón azul** a tu barra de marcadores; o copia el código y crea el marcador a
  mano.
- Estando dentro del portal, haz clic en el marcador para activar/desactivar.
- El código fuente legible está en `bookmarklet/bookmarklet.js`.

---

## Desarrollo

- **Cambios en la extensión cargada localmente:** `chrome://extensions` → **↻**
  en la tarjeta → **F5** en el portal.
- **Diseño:** los tokens (colores, radios, sombras, tipografía) están al inicio
  de `extension/content.css`, con su versión oscura. `pages.css` cubre las
  pantallas de componente, `shell.css` el sidebar y la barra superior, e
  `icons.css` se genera con `python tools/build-icons.py`.
- **Pantallas nuevas:** el reskin apunta a las clases estándar de PeopleTools 8
  (`PSEDITBOX`, `PSPUSHBUTTON`, `PSLEVEL1GRID`, `PAGROUPBOX`, …). Si una pantalla
  se ve mal, inspecciona el elemento y agrega la clase real a `pages.css`.
- **Publicar una versión:** sube `version` en `extension/manifest.json`, agrega
  la entrada en `CHANGELOG.md` y en `extension/changelog.js` (lo que ve el
  usuario en el menú), y crea el tag. Detalle en [STORE.md](STORE.md).

## Estructura

```
CIA-Wrap/
├─ extension/       Extensión MV3 (lo que se publica en la tienda)
├─ tools/           package.py (zip para la tienda) y build-icons.py
├─ entrar/          cia.potronet.com/entrar → redirige al portal
├─ privacidad/      cia.potronet.com/privacidad → política de privacidad
├─ index.html       la landing (cia.potronet.com)
├─ userscript/      versión Tampermonkey (anterior a la v1.0)
├─ bookmarklet/     bookmarklet + página instaladora (anterior a la v1.0)
├─ CHANGELOG.md     historial de versiones
└─ STORE.md         todo lo que pide la Chrome Web Store
```

## Licencia

MIT — ver `LICENSE`.
