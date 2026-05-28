# Rediseño Atmen — Editorial Pulmonar v3 (mobile-first)

**Fecha:** 2026-05-27
**Autor:** William Lara · Dr. Robinson Robles (cliente)
**Estado:** Aprobado para implementación
**Repo:** `C:\Users\willi\Mi unidad\Claude\Code\atmen` · branch `main` · remoto `Milligwlr/atmen`

---

## 1. Objetivo

Dar al sitio del Dr. Robinson Robles una **identidad visual propia** que lo diferencie del playbook genérico de origen (alveos.mx). Reducir el scroll de la landing ~40% mediante un sistema de compactación moderno, sin perder contenido ni romper compliance.

**Definición de éxito:**
- Un visitante que conoce alveos.mx ve atmen.mx y dice "este es otro sitio".
- La landing pasa de ~9 viewports a ~5.5 viewports manteniendo las 11 secciones lógicas.
- Mobile 375 conserva legibilidad, tap targets ≥44px, FPS estable en marquees, y `prefers-reduced-motion` deshabilita las animaciones de marquee.
- Cero regresión en compliance (legal > schema > a11y > performance > SEO > diseño > AEO).

## 2. No-Goals

- **No reescribir** el contenido de las secciones (los testimonios verbatim, las descripciones de padecimientos, el FAQ, las credenciales se mantienen).
- **No tocar** legal/compliance: `top-bar-legal`, `footer-compliance`, JSON-LD `@graph`, disclaimers Art. 83 LGS, aviso de privacidad LFPDPPP, microdata `itemprop`.
- **No alterar** el orden lógico de secciones (hero → padecimientos → servicios → filosofía → testimonios → medios → bio preview → FAQ → CTA → contacto). El layout/composición es libre dentro de cada sección y entre splits.
- **No incluir** páginas `noindex` en esta primera pasada (aviso-de-privacidad, info-regulatoria, contacto, 404 son una segunda pasada).
- **No introducir** framework JS pesado. El sitio es static HTML + CSS + JS vanilla. El switcher y el dropdown se hacen con `<details>` / progressive enhancement o un puñado de líneas vanilla.

## 3. Constraints

### 3.1 Compliance — intocable
- `lang="es-MX"`, JSON-LD `@graph` único con `@id` consistente cross-page.
- `top-bar-legal` con folio Cofepris "en trámite ante DIGIPRiS", 3 cédulas, CNN 1509 vigente 2031.
- `footer-compliance` Art. 83 LGS completo.
- Disclaimer 911 prominente.
- Testimonios = los 10 verbatim Doctoralia actuales + nuevos verbatim que ya están aprobados (las 21 que se mostrarán en el wall deben ser todas verificables — usar set existente + ampliar solo con verbatim reales). Cero fabricación.
- `aggregateRating` 131 reseñas se queda en `MedicalBusiness` (NUNCA mover a `Physician`).
- Cero marcas farmacéuticas. Cero "garantizado / único / mejor / 100%".
- Bloque "Revisado médicamente por" queda solo en footer-compliance (ya removido de los 3 HTMLs indexables).

### 3.2 Paleta — paleta actual completa preservada
Todos los tokens existentes en `css/tokens.css` se mantienen:
- **Azules:** `--ocean #023e8a`, `--sea #0077b6`, `--sky #00b4d8`
- **Verdes:** `--leaf #06a77d`, `--pine #2a9d8f`
- **Neutros:** `--ink`, `--paper`, `--cream`, `--line`, `--muted` (añadir los que falten).

**Uso por jerarquía visual:**
- `--ocean` → top-bar, links de nav, números de stats, headings secundarios.
- `--sea` → italic `<em>` del headline + acentos.
- `--sky` → wash sutil de fondo del hero-right + reservado para microestados (hover, focus).
- `--leaf` → CTA primario "Agendar cita", dot pulse del kicker, underline cursivo del em, tag de categoría del switcher.
- `--pine` → flow-volume loops SVG signature en hero, hover de cards.
- `--ink / --cream` → texto + fondo editorial.

### 3.3 Tipografía — simplificada
- **`Inter`** (400/500/600/700/800) — sistema completo: navegación, body, stats, labels, UI, headlines principales.
- **`Fraunces`** (italic 500 únicamente) — exclusivo para el `<em>` del headline H1 ("evidencia"). Nada más.
- **Drop:** `Newsreader`, `JetBrains Mono`. El stack pasa de 4 familias a 2.
- Carga: `display=swap`, preconnect a fonts.googleapis y gstatic. Solo cargar el axis italic de Fraunces (no toda la familia).

### 3.4 Mobile-first — 80% del tráfico
- Breakpoint base: **375px** (iPhone SE/12 mini).
- Diseño se concibe en mobile primero; desktop es enhancement.
- Tap targets ≥44×44px (`@media (pointer: coarse)`).
- `contain: layout style` en cards repetitivas (testimonials).
- `hover: none` deshabilita transforms en touch.
- `prefers-reduced-motion: reduce` → marquees se vuelven grids estáticos de 2 columnas verticales, switcher se vuelve accordion, dropdown abre instantáneo.
- LCP candidate sigue siendo el headline H1 — sin `opacity:0` inicial.

### 3.5 Performance
- Mantener `display=swap` async, preconnect, preload del headline font axis.
- Marquees usan `transform: translateX` (GPU-accelerated), `will-change: transform` solo en `:hover` (no permanente).
- Imágenes con `loading="lazy"` y `decoding="async"` excepto el portrait del hero.
- SVG signature (flow-volume loops, underline cursivo, anatomical line-art) inline data-URI o `<svg>` embebido — cero requests adicionales.

## 4. Arquitectura del sistema

### 4.1 Archivos CSS — reorganización mínima
```
css/
  tokens.css       (existente — ampliar con tokens editoriales si faltan)
  site.css         (existente — base + FAB WhatsApp + nav)
  premium.css      (existente — refactor profundo para v3)
  signature.css    (NUEVO — flow-volume loops, underline cursivo, breath pulse, anatomical line-art)
```

`signature.css` aísla los elementos signature de Atmen para que sean fáciles de auditar/iterar y no contaminen los componentes base.

### 4.2 JS — vanilla, sin framework
```
js/
  agendar-menu.js     (NUEVO — dropdown abrir/cerrar, ESC para cerrar, click outside)
  switcher.js         (NUEVO — tabs accesibles del índice clínico de padecimientos)
  testimonials-wall.js(NUEVO — pausa hover, click expande, respeta prefers-reduced-motion)
```

Cada archivo <2 KB. Carga `defer`.

## 5. Componentes — spec por componente

### 5.1 Hero (split editorial)

**Estructura mobile (375):**
```
┌─────────────────────────────┐
│ top-bar-legal (wrap 2 líneas)│
│ nav (logo + hamburger)       │
│ kicker                       │
│ H1 (44px, Inter 800)         │
│   <em>evidencia</em> + underline│
│ lede                         │
│ [Agendar cita ▾] (full-width)│
│ stats 2×2 grid               │
│ ─────                        │
│ portrait + caption           │
│ credenciales (4 filas)       │
│ condition pills (scroll-x)   │
└─────────────────────────────┘
```

**Estructura desktop (≥960):**
- 2 columnas: izq `1.2fr` (texto + CTA + stats), der `1fr` (portrait + credenciales + condition pills).
- H1 escala a 58–64px.
- Flow-volume loops SVG signature como overlay decorativo del hero-left (`opacity: 0.18`, `pointer-events: none`).

**Headline:**
- H1 = `Inter 800`, line-height 1.02, letter-spacing -0.035em.
- El `<em>` es `Fraunces italic 500` en `var(--sea)`.
- Underline cursivo SVG verde leaf (signature actual, mantenido) bajo el `<em>` usando `::after` con data-URI.

**Eliminar del hero actual:**
- Triple ring conic-gradient del portrait → reemplazado por marco editorial rectangular con caption "FIG. 01".
- Breath-pulse SVG flotando suelto → se reubica como detalle del marco (esquina superior, no central).
- Shimmer gradient del headline → eliminado. El headline es texto plano sólido.

### 5.2 Botón "Agendar cita" (con menú 4 canales)

**Comportamiento:**
- Botón único primario `--leaf`, border-radius 14px, padding generoso (mobile: 18×28, full-width; desktop: 18×28 inline).
- Sufijo ▾ indica menú.
- Click/tap → menú popover abre debajo (anchor relativo).
- Tap outside, ESC, o tap en el botón → cierra.
- Cuatro items con icono + título + subtítulo + flecha:
  1. **WhatsApp** — `wa.me/52XXXXXXXXXX?text=…` (link directo, abre app).
  2. **Llamada directa** — `tel:+52XXXXXXXXXX` (consultorio Médica Sur).
  3. **Correo electrónico** — `mailto:` (asunto pre-llenado).
  4. **Agendar online** — link Doctoralia (24/7).

**Mobile:**
- Menú a full-width con `position: fixed; bottom: 0` (bottom sheet style), backdrop con `rgba(0,0,0,.4)`. Más natural en touch.

**Desktop:**
- Menú popover normal (280px ancho, ancla bottom-left del botón).

**A11y:**
- `<button aria-haspopup="menu" aria-expanded="false">`.
- Menú `role="menu"`, items `role="menuitem"`.
- Focus trap mientras abierto, ESC cierra, focus regresa al botón.
- Keyboard: ↑↓ navega items.

**Reemplaza:**
- El doble botón actual (`Agendar por WhatsApp` + `Otros canales`) desaparece.
- FAB WhatsApp flotante se mantiene como backup (no se quita — sigue siendo un patrón conocido para repeat visitors).

### 5.3 Padecimientos — Índice clínico switcher

**Patrón:** Stack switcher tipo Apple keynote / Linear features / 21st.dev.

**Estructura desktop (≥900):**
- Grid `280px 1fr`. Izquierda: lista vertical numerada (01–10) con los 10 padecimientos. Derecha: panel detalle con tag + título + descripción + 3 pilares + footer CTA.
- Click/hover en item izq → panel der cambia con transición opacity 200ms.
- Item activo: fondo `--ocean`, texto blanco, flecha → visible.

**Estructura mobile (<900):**
- Lista colapsa a accordion vertical: cada item `<details><summary>`. Tap → expande mostrando el panel completo del padecimiento. Solo uno abierto a la vez (JS controla `open` attribute).
- Primer item (Asma) abierto por default.

**Contenido por padecimiento** (los 10 actuales):
- Tag de categoría (`Vías aéreas obstructivas` / `Sueño` / `Oncológico/Pleura` / `Diagnóstico`).
- Título grande (Inter 800, 28–34px).
- Descripción clínica (2–3 líneas, lede tone).
- 3 pilares en grid 3-up: `Síntomas clave` / `Cómo lo diagnostico` / `Qué esperar`.
- Footer: link "Ver guía clínica completa →" + CTA "Agendar evaluación →".

**A11y:**
- Desktop: ARIA tabs/tabpanels (`role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, `tabindex` manejado).
- Mobile: `<details><summary>` nativo (a11y built-in).
- Switch via teclado: ←↑↓→ entre tabs (desktop), Tab + Enter en accordion (mobile).

**Reemplaza:**
- El `bento--12` con 10 cards verticales apiladas (110vh) → switcher unificado (~70vh desktop, ~80vh mobile).
- Las tag-pills scroll horizontal del hero ya cumplen función de "vista rápida" — se mantienen en hero.

### 5.4 Servicios + 3 pilares filosofía (split 2-up)

**Mobile:** apilados normales (servicios primero, luego filosofía).

**Desktop (≥1024):** split 2-up `1fr 1fr`. Servicios izq (3 cards: Espirometría simple, con broncodilatador, Ultrasonido pulmonar). Filosofía der (3 pilares glass actuales, mantenidos como están — son un signature visual y no rompen el sistema).

### 5.5 Testimonios — Wall of love (3 marquees)

**Estructura desktop:**
- Header con `Lo que dicen 131 pacientes` + agregado (4.9 / 131 / 98%).
- 3 filas de marquee horizontal con `display: flex; width: max-content` y `animation: scroll linear infinite`.
  - Fila 1: → 60s, 7 cards x2.
  - Fila 2: ← 75s, 7 cards x2.
  - Fila 3: → 90s, 7 cards x2.
- Total: **21 testimonios reales mostrados** (con duplicado para loop continuo).
- Fade mask 80px en bordes izq/der (gradient a `#fff`).
- Hover en una fila → `animation-play-state: paused`.
- Click en card → expande modal con texto completo (si hay versión larga).

**Mobile (<700):**
- Solo **1 fila** de marquee horizontal (la r1, → 60s).
- Velocidad 50% más lenta.
- Botón debajo "Ver las 131 reseñas en Doctoralia →" que enlaza al perfil.
- `prefers-reduced-motion: reduce` → marquee se vuelve grid vertical 1-col scrolleable con los primeros 6 testimonios + link al resto.

**Constraints contenido:**
- Las 21 cards deben ser verbatim Doctoralia verificables. Reusar las 10 actuales + ampliar a 21 con verbatim reales de Doctoralia (William los aporta o los extraigo del perfil público).
- Cada card: ★★★★★ + quote + avatar (iniciales sobre gradient azul) + nombre (María R., Juan Carlos M., etc.) + fuente "Doctoralia · **verificada**".

**Performance:**
- Cards usan `contain: layout style paint`.
- `will-change: transform` solo durante la animación, no permanente.
- IntersectionObserver: pausar animación cuando la sección no está en viewport.

**A11y:**
- Wrapper `role="region" aria-label="Reseñas de pacientes"`.
- Cada card `role="article"` con `aria-label` resumiendo (nombre + fuente).
- Botón "Pausar animación" visible para usuarios que lo necesiten (esquina superior del wall).

**Reemplaza:**
- Sección `testimonials-hero` + `testimonials-grid` (10 t-cards apilados, 85vh) → wall horizontal denso (~55vh desktop, ~50vh mobile).

### 5.6 Medios + Bio preview (split 2-up)

**Mobile:** apilados (medios primero, bio preview luego).
**Desktop (≥1024):** split 2-up. Medios izq (entrevista Once Noticias embed Facebook), bio preview der.

### 5.7 FAQ — Accordion compacto

- 6 preguntas en `<details><summary>` colapsadas por default.
- Solo una abierta a la vez (JS).
- Mobile: tap targets 56px de alto.
- Link al final: "Ver las 21 preguntas frecuentes completas →" → `/preguntas-frecuentes/`.

### 5.8 CTA aurora + contacto + Google Maps

- CTA aurora actual conservada (es un signature defendible) pero **sin el conic spin** — gradient estático con sutil shimmer-pulse cada 8s.
- Contacto + Maps: layout split 2-up desktop (info izq, maps der). Mobile apilado.

### 5.9 Top-bar legal + Nav + Marquee instituciones

- Top-bar legal: misma info, tipografía Inter 11px (no Mono), wrap a 2 líneas en mobile.
- Nav mobile: logo + hamburger drawer (que en lugar de menu abre el agendar menu con misma estructura + links secundarios).
- Marquee de 8 instituciones: ribbon delgado (40px alto) entre hero y padecimientos, no sección propia.

### 5.10 Footer-compliance — intocable

Sin cambios. Solo asegurar que `Inter` se aplique consistente.

## 6. Mobile-first breakdown (375px)

Ningún componente puede confiar en hover para revelar info crítica. Toda interacción crítica debe ser tap-first.

| Componente | Desktop pattern | Mobile pattern |
|---|---|---|
| Hero | Split 2-col | Stack vertical, portrait debajo del CTA |
| Agendar btn | Inline + popover | Full-width + bottom sheet modal |
| Padecimientos | Tabs switcher | `<details>` accordion |
| Servicios + Filosofía | Split 2-up | Stack |
| Testimonios wall | 3 filas marquee | 1 fila marquee + link |
| Medios + Bio | Split 2-up | Stack |
| FAQ | Accordion compacto | Accordion compacto (igual) |
| CTA + Maps | Split 2-up | Stack |
| Marquee instituciones | Ribbon | Ribbon (igual) |

## 7. A11y checklist

- Contraste ≥ 4.5:1 en todos los textos sobre fondos (verificar `--leaf` sobre `--cream` y `--sea` sobre `--cream`).
- Tap targets ≥ 44×44px con `@media (pointer: coarse)`.
- `focus-visible` global con outline `--ocean` 2px.
- ARIA roles correctos en switcher (tabs/tabpanels desktop, accordion mobile).
- `prefers-reduced-motion: reduce`:
  - Marquees → grids estáticos.
  - Dot pulse del kicker → static.
  - CTA aurora shimmer → static.
  - Switcher fade transition → instant.
- Skip-link "Saltar al contenido principal" al inicio del `<body>`.

## 8. SEO / Schema — sin cambios estructurales

- JSON-LD `@graph` se mantiene idéntico.
- `aggregateRating` 131 en `MedicalBusiness`.
- `knowsAbout` actualizado a los 10 padecimientos (ya está).
- Microdata `itemprop` en bio + credenciales preservados.

## 9. Páginas afectadas en esta pasada

1. `/` (index.html) — rediseño completo.
2. `/sobre-el-doctor/` — adopción de tipografía simplificada + hero variant + footer-compliance idéntico.
3. `/preguntas-frecuentes/` — adopción del sistema (header + footer-compliance) + las 21 Q&A pueden quedar en su layout actual o adoptar el accordion mejorado.

**Segunda pasada (no en este spec):** `/aviso-de-privacidad/`, `/informacion-regulatoria/`, `/contacto/`, `/404.html`.

## 10. Verificación visual al finalizar

Cada sección debe verificarse en:
- Desktop 1280×800.
- Mobile 375×812.
- `prefers-reduced-motion: reduce`.
- Lighthouse mobile: Performance ≥ 90, A11y ≥ 95, SEO 100.

Herramientas: `mcp__Claude_Preview__preview_*` con screenshots, snapshot, inspect, resize.

## 11. Out of scope explícito

- Cambios en `/aviso-de-privacidad/`, `/informacion-regulatoria/`, `/contacto/`, `/404.html`.
- Dark mode (no solicitado).
- i18n (sitio es es-MX only).
- Sistema de blog / contenido editorial (no solicitado en esta pasada).
- Integración real con API Doctoralia para reseñas live (las 21 quedan estáticas en HTML por ahora).

## 12. Open questions (resolver antes de implementar)

1. **Teléfonos / WhatsApp / Email / Doctoralia URL** — necesito los 4 valores reales para el menú de agendar. Si no están aprobados, uso placeholders consistentes con los existentes en el sitio.
2. **Las 21 reseñas Doctoralia** — ¿el cliente aporta el verbatim de las 11 nuevas (además de las 10 actuales), o las extraigo del perfil público de Doctoralia del Dr.? Cualquier opción requiere validación cliente antes de publicar.
3. **CSS de `premium.css`** — refactor profundo (renombrar/eliminar clases) vs. añadir capa nueva y dejar premium.css como deprecated. **Recomendación:** refactor in-place — el branch es main pero el sitio está en desarrollo, no live público.
4. **Marquee instituciones** — ¿se queda con las 8 actuales o se actualiza?

## 13. Plan de implementación (será detallado por writing-plans)

Bloques en orden:
1. Tokens y typography setup (signature.css + Fraunces axis italic only).
2. Hero v3 (simplified typo + agendar menu + portrait editorial).
3. Padecimientos switcher (tabs desktop + accordion mobile).
4. Testimonios wall (3 marquees desktop + 1 marquee mobile + reduced-motion fallback).
5. Splits 2-up (servicios+filosofía, medios+bio).
6. CTA aurora simplificada + FAQ accordion + footer pulido.
7. Replicar sistema en /sobre-el-doctor/ y /preguntas-frecuentes/.
8. Verificación visual + lighthouse + commit.
