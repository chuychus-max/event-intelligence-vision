# Event Intelligence · visión de producto

Sitio de una sola página con la visión de ShipbayOS para la inteligencia de recintos y eventos
en vivo: mercado, tecnología global, perfil de OCESA (prospecto), demo interactiva del producto,
cómo nos integramos al ecosistema (Ticketmaster Ignite, OVG, Banamex), horizontes a 2/5/10
años, plan por fases y huecos.

No es un cliente. El contenido sale de `research/mapas-digitales-indoor/` (docs 01–05), y cada
cifra lleva su fuente y su calidad. **La demo usa datos sintéticos** (`src/lib/simulation.ts`),
no datos de OCESA ni de Ticketmaster.

## Recorrido

Tres actos (contexto → solución → cómo lo hacemos), 12 láminas. Modo **Express** (por defecto)
muestra el resumen de cada lámina y deja el detalle a un clic; **Completo** lo abre todo. La
barra superior dice en qué acto y lámina vas, cuánto falta y abre el índice. Los minutos son
estimados a mano en `src/lib/reading.ts`; si cambias mucho una sección, ajústalos ahí.

## Mapa del estadio (3D)

La portada y el centro de mando usan una maqueta 3D del estadio de la ilustración
`public/estadio.webp` (la misma silueta: gradas en U abiertas hacia el escenario y la cubierta
naranja continua), dibujada en Three.js con volúmenes crema, contorno grafito y sombras. Encima
corren flujos de gente por puerta, filas de barras como columnas, spots y, en cada evento del
copiloto, un haz de luz con ondas en el punto exacto y su tarjeta. Se arrastra para girar.
Escena y anclas (`gate:C`, `bar:4`, `spot:1`, `pista`) en `src/lib/stadium3d.ts`; etiquetas
y tarjetas en `src/components/Venue3D.tsx`. Sin WebGL se muestra la ilustración original.

## Stack

Next.js 16 (App Router, `output: "export"`) · React 19 · Tailwind v4 · Three.js (gemelo digital
en WebGL) · lucide-react. Tipografías Space Mono e IBM Plex Mono servidas desde el propio sitio
(`@fontsource`). Gráficas hechas a mano en HTML/SVG.

Dirección de arte: portafolio de despacho de arquitectura. Papel, concreto, grafito y tinta;
retícula visible, filetes finos, tipografía mono espaciada, fichas técnicas y pies de figura. El
gemelo 3D es una maqueta axonométrica (cámara ortográfica). El color sólo marca estado (ocre =
atención, ladrillo = crítico). El color de marca vive en una sola variable, `--brand` en
`src/app/globals.css`: hoy es tinta; para usar la paleta de OCESA basta con cambiar ese valor.
El 3D se pausa fuera de pantalla y muestra una imagen fija si el usuario pidió reducir movimiento.

## Correr y construir

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # genera out/ (sitio estático)
```

## Desplegar en Vercel

1. En Vercel: **Add New → Project** e importa este repo.
2. **Root Directory:** `ui/event-intelligence-vision`. Framework: Next.js (lo detecta solo).
3. Deploy. No hacen falta variables de entorno.

El sitio menciona a un prospecto por nombre e incluye una lectura de sus riesgos. Antes de
compartir el enlace, activa **Deployment Protection** (contraseña o Vercel Authentication) en
*Settings → Deployment Protection*. La página ya va con `noindex`.

## Dónde editar

| Qué | Archivo |
|---|---|
| Cifras, textos, fuentes | `src/lib/data.ts` |
| Modelo de la simulación | `src/lib/simulation.ts` |
| Gemelo digital 3D (escena, capas, etiquetas) | `src/lib/twin.ts` |
| Recorrido: actos, orden, minutos | `src/lib/reading.ts` |
| Maqueta 3D del estadio: volúmenes, anclas, cámara | `src/lib/stadium3d.ts` · `src/components/Venue3D.tsx` |
| Secciones | `src/components/*.tsx` (orden en `src/app/page.tsx`) |
| Colores, tipografía y animaciones | `src/app/globals.css` (tokens de hoja y de pantalla) |
