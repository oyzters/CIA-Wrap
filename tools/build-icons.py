"""
Genera extension/icons.css: reemplaza los GIF de PeopleSoft por iconos SVG.

Cómo funciona: el <img>/<input type=image> original se queda en el DOM (sus
clics y onclick siguen funcionando), pero su bitmap se saca de la caja con
`object-position` y se pinta el icono como MÁSCARA sobre `background-color`.
La máscara va en modo luminancia: lo blanco del SVG se pinta, lo negro se
recorta (el número de los pasos, la palomita de "Inscrito").
Así el color sale de los tokens (--blue-700, --ok, ...) y responde solo a
claro/oscuro, sin duplicar cada SVG por tema.

Inventario: los GIF que aparecen en las 52 pantallas del menú (recorrido del
árbol completo). Para añadir uno: agrégalo a ICONS y vuelve a correr
    python tools/build-icons.py
"""
from pathlib import Path
from urllib.parse import quote

OUT = Path(__file__).resolve().parent.parent / "extension" / "icons.css"

# Trazos 24x24 estilo del sidebar (stroke 2, puntas redondeadas)
P = {
    "search":   '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    "arrowR":   '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "chevL":    '<path d="m15 6-6 6 6 6"/>',
    "chevR":    '<path d="m9 6 6 6-6 6"/>',
    "chevD":    '<path d="m6 9 6 6 6-6"/>',
    "download": '<path d="M12 4v11M7 10l5 5 5-5"/><path d="M5 20h14"/>',
    "calendar": '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    "deadline": '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4M12 13v3l2 1.5"/>',
    "clipchk":  '<rect x="5" y="4" width="14" height="17" rx="2.5"/><path d="M9 4.5V3h6v1.5"/><path d="m9 13 2 2 4-4"/>',
    "bookmark": '<path d="M6 4h12v17l-6-4-6 4z"/>',
    "plus":     '<path d="M12 5v14M5 12h14"/>',
    "minus":    '<path d="M5 12h14"/>',
    "trash":    '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/><path d="M10 11v6M14 11v6"/>',
    "link":     '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    "checksq":  '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    "square":   '<rect x="4" y="4" width="16" height="16" rx="3"/>',
    "dot":      '<circle cx="12" cy="12" r="3" fill="white"/>',
    # estados (rellenos para que se lean a 14px)
    "ok":       '<circle cx="12" cy="12" r="9" fill="white" stroke="none"/><path d="m8 12.5 2.8 2.8L16.5 9.5" stroke="black"/>',
    "x":        '<circle cx="12" cy="12" r="9" fill="white" stroke="none"/><path d="m9 9 6 6M15 9l-6 6" stroke="black"/>',
    "warn":     '<path d="M12 3 2.5 20h19z" fill="white" stroke-linejoin="round"/><path d="M12 10v4.5M12 17.2v.1" stroke="black"/>',
    "open":     '<circle cx="12" cy="12" r="7" fill="white" stroke="none"/>',
    "closed":   '<rect x="5.5" y="5.5" width="13" height="13" rx="3" fill="white" stroke="none"/>',
    "spinner":  '<path d="M12 3a9 9 0 1 0 9 9" stroke-width="2.6"/>',
}

def step(n, filled):
    """Círculo numerado del asistente de inscripción (Paso 1..4)."""
    if filled:
        return (f'<circle cx="12" cy="12" r="10" fill="white" stroke="none"/>'
                f'<text x="12" y="16.3" text-anchor="middle" font-family="Arial" font-weight="700" '
                f'font-size="12" fill="black" stroke="none">{n}</text>')
    # vacío: aro + número recortado (la máscara deja ver solo el trazo)
    return (f'<circle cx="12" cy="12" r="9.5" stroke-width="1.8"/>'
            f'<text x="12" y="16.3" text-anchor="middle" font-family="Arial" font-weight="700" '
            f'font-size="12" fill="white" stroke="none">{n}</text>')

def svg(body):
    s = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" '
         'stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
         + body + '</svg>')
    return 'url("data:image/svg+xml,' + quote(s, safe=" =:/,'-.") + '")'

# patrón de archivo -> (icono, color, tamaño px)
# Color = token de content.css: azul para acciones, gris para deshabilitadas,
# y su semántica para los estados.
ICONS = [
    ("PT_PROMPT",                 "search",   "blue",  16),   # lupa de búsqueda de valores
    ("PT_NAV_GO",                 "arrowR",   "blue",  16),   # "»" junto a "Más..."
    ("PT_PREVIOUSROW_D",          "chevL",    "muted", 16),
    ("PT_NEXTROW_D",              "chevR",    "muted", 16),
    ("PT_PREVIOUSROW",            "chevL",    "blue",  16),
    ("PT_NEXTROW",                "chevR",    "blue",  16),
    ("PT_DOWNLOAD",               "download", "blue",  16),
    ("PS_COLLAPSE_ICN",           "chevD",    "blue",  14),
    ("PT_COLLAPSE",               "chevD",    "blue",  14),
    ("PS_EXPAND_ICN",             "chevR",    "blue",  14),
    ("PT_EXPAND",                 "chevR",    "blue",  14),
    ("PS_ACADEMIC_DEADLINES_ICN", "deadline", "blue",  16),
    ("PS_VALIDATE_ICN",           "clipchk",  "blue",  16),
    ("PT_CALENDAR",               "calendar", "blue",  16),
    ("PT_SAVESEARCH",             "bookmark", "blue",  16),
    ("PT_ADD",                    "plus",     "blue",  16),
    ("PT_DELETE_LARGE",           "trash",    "danger",18),
    ("PT_DELETE",                 "minus",    "danger",16),
    ("PS_LEARNING_MANAGEMENT_ICN","link",     "blue",  16),
    ("PS_POINTER_ICN",            "chevR",    "blue",  14),
    ("PT_SELECT_ALL_BOXES_ICN",   "checksq",  "blue",  16),
    ("PT_CLEAR_ALL_BOXES_ICN",    "square",   "blue",  16),
    ("BULLET_",                   "dot",      "blue",  10),
    ("PS_CS_STATUS_SUCCESS_ICN",  "ok",       "ok",    14),
    ("PS_CS_STATUS_DROPPED_ICN",  "x",        "danger",14),
    ("PS_CS_STATUS_WAITLIST_ICN", "warn",     "warn",  14),
    ("PS_CS_STATUS_OPEN_ICN",     "open",     "ok",    12),
    ("PS_CS_STATUS_CLOSED_ICN",   "closed",   "blue",  12),
]
STEPS = [(n, st) for n in (1, 2, 3, 4) for st in ("ENA", "INP", "DIS")]

COLOR = {"blue": "var(--blue-700)", "muted": "var(--muted)", "ok": "var(--ok)",
         "danger": "var(--danger)", "warn": "var(--warn)"}

def rule(sel, mask, color, size):
    return (f'{sel} {{\n'
            f'  -webkit-mask: {mask} center / {size}px {size}px no-repeat !important;\n'
            f'  mask: {mask} center / {size}px {size}px no-repeat !important;\n'
            f'  mask-mode: luminance !important;\n'
            f'  background: {COLOR[color]} !important;\n'
            f'}}\n')

def sel(pat):
    return (f'html.itson-wrap img[src*="{pat}"],\n'
            f'html.itson-wrap input[type="image"][src*="{pat}"]')

out = ['/* GENERADO por tools/build-icons.py — no editar a mano. Ver la docstring del script. */\n\n']

# base común a todos los iconos reemplazados
pats = [p for p, *_ in ICONS] + [f"PS_CS_STEP0{n}_{st}_ICN" for n, st in STEPS] + ["PT_PROCESSING"]
out.append(",\n".join(sel(p) for p in pats) + " {\n"
           "  object-position: -9999px 0 !important;   /* fuera el GIF, se queda la caja */\n"
           "  width: 22px !important;\n"
           "  height: 22px !important;\n"
           "  vertical-align: middle !important;\n"
           "  border: 0 !important;\n"
           "  padding: 0 !important;\n"
           "  box-shadow: none !important;\n"
           "}\n\n")

# más específicos primero en la lista; aquí se emiten en orden inverso para que
# los patrones cortos (PT_PREVIOUSROW) no pisen a los largos (PT_PREVIOUSROW_D)
for pat, ic, color, size in reversed(ICONS):
    out.append(rule(sel(pat), svg(P[ic]), color, size))
for n, st in STEPS:
    filled = st != "DIS"
    out.append(rule(sel(f"PS_CS_STEP0{n}_{st}_ICN"), svg(step(n, filled)),
                    "blue" if filled else "muted", 20))

# toda imagen de icono enlazada: área de clic cómoda y hover de botón
out.append("""
/* iconos dentro de enlace = botón de icono */
html.itson-wrap a:has(> img[src*="PT_PROMPT"]),
html.itson-wrap a:has(> img[src*="PT_NAV_GO"]),
html.itson-wrap a:has(> img[src*="PT_CALENDAR"]),
html.itson-wrap a:has(> img[src*="PT_DOWNLOAD"]),
html.itson-wrap a:has(> img[src*="PT_ADD"]),
html.itson-wrap a:has(> img[src*="PT_DELETE"]) {
  display: inline-grid !important;
  place-items: center !important;
  border-radius: var(--r-sm) !important;
  transition: background .15s ease !important;
}
html.itson-wrap a:has(> img[src*="PT_PROMPT"]):hover,
html.itson-wrap a:has(> img[src*="PT_NAV_GO"]):hover,
html.itson-wrap a:has(> img[src*="PT_CALENDAR"]):hover,
html.itson-wrap a:has(> img[src*="PT_DOWNLOAD"]):hover,
html.itson-wrap a:has(> img[src*="PT_ADD"]):hover,
html.itson-wrap a:has(> img[src*="PT_DELETE"]):hover { background: var(--blue-50) !important; }
""")

# "Procesando..." -> spinner flotante (PeopleSoft alterna la visibilidad de #WAIT_win0)
out.append(rule("html.itson-wrap img.PSPROCESSING,\nhtml.itson-wrap img[src*=\"PT_PROCESSING\"]",
                svg(P["spinner"]), "blue", 18).replace("}\n", "  animation: iw-spin .8s linear infinite !important;\n}\n"))
out.append("""html.itson-wrap div[id^="WAIT_win"] {
  position: fixed !important;
  top: 12px !important;
  right: 16px !important;
  z-index: 2147483000 !important;
  width: 34px !important;
  height: 34px !important;
  display: grid !important;
  place-items: center !important;
  background: var(--surface) !important;
  border: 1px solid var(--line) !important;
  border-radius: 999px !important;
  box-shadow: var(--sh-2) !important;
}
html.itson-wrap div[id^="WAIT_win"] img { float: none !important; }
@keyframes iw-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  html.itson-wrap img.PSPROCESSING { animation-duration: 2.4s !important; }
}
""")

OUT.write_text("".join(out), encoding="utf-8", newline="\n")   # LF como el resto del repo, también en Windows
print(f"{OUT} ({OUT.stat().st_size} bytes, {len(pats)} iconos)")
