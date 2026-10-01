# Changelog

Versiones de CIA Wrap en la Chrome Web Store. Formato: [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).
Cada versión aquí debe tener su gemela, en lenguaje de usuario, en `extension/changelog.js` —
es lo que el menú de la extensión muestra como **Novedades**. El Release de GitHub
toma las notas de esta sección (ver `.github/workflows/release.yml`).

## [1.0.0] - 2026-10-01

Primera versión publicada en la Chrome Web Store.

### Añadido
- Sistema de diseño de iVirtual Wrap: Figtree / Plus Jakarta Sans, azules ITSON, modo claro, oscuro y automático.
- Las 52 pantallas del menú rediseñadas: contenedores, rejillas, pestañas, botones, mensajes y controles nativos.
- Pantallas a todo lo ancho: las tablas de maquetación de PeopleSoft se reacomodan sin separar etiquetas de campos.
- Rejillas cortas como fichas etiqueta/valor; listas repetidas (catálogo) como filas.
- Centro de Alumnado como panel: saldo, retenciones y clases de la semana arriba; accesos agrupados.
- Horario semanal como calendario, con un color por materia.
- 41 iconos SVG en lugar de los GIF de PeopleSoft y un indicador de carga propio.
- Ruta de navegación en la barra superior, página actual marcada y grupo "Portal" plegable en el sidebar.
- Menú de la extensión: encender o apagar, tema, abrir el portal y novedades de la versión.
- Aviso "NEW" en el ícono al actualizarse.

### Cambiado
- Nombre: "ITSON CIA Wrap" pasa a **CIA Wrap**; ícono nuevo, de la misma familia que iVirtual Wrap.
- Solo se activa en la portada CIA de apps9 (`/CIA…`), no en todo apps9: ya no choca con iVirtual Wrap en el Portal de Sistemas.
- Se aplica desde el inicio de la carga, sin que se vea el portal original.

### Quitado
- La captura de depuración (Ctrl+Shift+Y) y la opción de CSS remoto.
- Recursos sin usar (logos expuestos a la web).
