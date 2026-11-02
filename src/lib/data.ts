// Contenido de la investigación (research/mapas-digitales-indoor/01–04).
// Cada cifra lleva su fuente y su calidad: "primaria" (empresa, regulador, prensa
// seria) o "secundaria" (proveedor, agregador, sin verificar). Nada aquí es dato
// de OCESA salvo lo que OCESA o Live Nation publicaron.

export type Quality = "primaria" | "secundaria" | "proyeccion";

export interface Source {
  label: string;
  url: string;
}

export interface Stat {
  label: string;
  value: string;
  detail: string;
  quality: Quality;
  source: Source;
}

// ─── Mercado ────────────────────────────────────────────────────────────────

export const heroStats: Stat[] = [
  {
    label: "Gasto en sitio por asistente, Estadio GNP Seguros",
    value: "×3",
    detail: "Comida, bebida y premium después de la remodelación (Live Nation, 3T 2025)",
    quality: "primaria",
    source: {
      label: "Live Nation 3T 2025",
      url: "https://news.livenationentertainment.com/news/live-nation-entertainment-third-quarter-2025-results",
    },
  },
  {
    label: "Posición de México en música en vivo",
    value: "#3",
    detail: "Tercer mercado del mundo, según Live Nation al subir a 75% de OCESA (jul 2025)",
    quality: "primaria",
    source: {
      label: "Live Nation, jul 2025",
      url: "https://www.livenationentertainment.com/2025/07/live-nation-expands-stake-in-ocesa-as-mexico-rises-to-3rd-largest-live-music-market-globally/",
    },
  },
  {
    label: "Boletos digitales de Ticketmaster México",
    value: "80%",
    detail: "De ~22–26 M de boletos al año. El fan ya abre su boleto en la puerta",
    quality: "primaria",
    source: {
      label: "El Universal, ago 2026",
      url: "https://www.eluniversal.com.mx/techbit/ticketmaster-celebra-35-anos-en-mexico-con-mejoras-en-ciberseguridad-e-ia/",
    },
  },
];

export const marketStats: Stat[] = [
  {
    label: "Asistentes Live Nation 2025",
    value: "159 M",
    detail: "+5%. Por primera vez el mercado internacional supera a EE.UU.",
    quality: "primaria",
    source: {
      label: "Live Nation 4T 2025",
      url: "https://news.livenationentertainment.com/news/live-nation-entertainment-full-year-and-fourth-quarter-2025-results",
    },
  },
  {
    label: "Ingreso diferido por eventos (2T 2026)",
    value: "US$6.4 mil M",
    detail: "Récord, +25% anual; ventas para 2026 +11%",
    quality: "primaria",
    source: {
      label: "Live Nation 2T 2026",
      url: "https://news.livenationentertainment.com/news/live-nation-entertainment-reports-second-quarter-2026-results",
    },
  },
  {
    label: "Música en vivo global",
    value: "US$34.6 → 67.1 mil M",
    detail: "2024 → 2035: casi se duplica en una década",
    quality: "secundaria",
    source: {
      label: "Goldman Sachs vía Access AA",
      url: "https://accessaa.co.uk/live-music-industrys-value-to-nearly-double-by-2035/",
    },
  },
  {
    label: "Precio promedio Top 100 mundial",
    value: "US$91 → 136",
    detail: "2019 → 2024: +50% en cinco años",
    quality: "secundaria",
    source: {
      label: "Goldman Sachs vía Music Week",
      url: "https://musicweek.com/labels/read/music-in-the-air-2024-live-publishing-and-superfans-boost-goldman-sachs-global-growth-forecast/089723",
    },
  },
  {
    label: "Gen Z en EE.UU.: gasto mensual en música en vivo",
    value: "US$101",
    detail: "Contra US$94 de millennials (Luminate, 1T 2026, n≈4,000)",
    quality: "secundaria",
    source: {
      label: "YPulse / Luminate",
      url: "https://www.ypulse.com/newsfeed/2026/07/08/gen-z-spends-more-on-concerts-than-millennials/",
    },
  },
  {
    label: "Smart stadium (mercado global)",
    value: "US$18.1 → 39.6 mil M",
    detail: "2024 → 2030, CAGR 14.4%; el software es lo que más crece",
    quality: "secundaria",
    source: {
      label: "Grand View Research vía Security World Market",
      url: "https://www.securityworldmarket.com/int/News/Business-News/smart-stadiums-predicted-for-almost-40-billion-by-2030",
    },
  },
];

// Estimaciones del mercado de posicionamiento y navegación indoor (IPIN) en 2025.
// Se muestran juntas a propósito: el rango es el hallazgo.
export const ipinEstimates = [
  { label: "360iResearch", value: 16.9 },
  { label: "The Business Research Co.", value: 26.55 },
  { label: "Fortune Business Insights", value: 42.4 },
];

// Barreras de la Gen Z para ir a conciertos (Luminate, % que la menciona).
export const genZBarriers = [
  { label: "Precio del boleto", y2024: 75, y2026: 57 },
  { label: "Costo de viajar", y2024: 61, y2026: 31 },
];

// Señales de dónde está el dinero nuevo. Son métricas distintas; cada barra dice cuál.
export const spendSignals = [
  { label: "Estadio GNP Seguros · gasto por persona dentro del recinto, tras la remodelación (2025)", value: 200, note: "×3" },
  { label: "Anfiteatros nuevos de Live Nation · ingreso premium contra anfiteatros parecidos (2026)", value: 75 },
  { label: "Ziggo Dome, Ámsterdam · gasto por persona con su zona premium Vinyl Room (2026)", value: 30 },
  { label: "Estadio GNP Seguros · gasto extra por persona en el 1er semestre tras remodelar (2025)", value: 30 },
  { label: "Anfiteatros de Live Nation · gasto por persona dentro del recinto (2025)", value: 8 },
  { label: "Festivales de Live Nation · gasto por persona dentro del recinto (2025)", value: 6 },
];

// ─── Tecnología global ─────────────────────────────────────────────────────

export type Maturity = "Hoy" | "1–3 años" | "3–5 años" | "5–10 años";

export interface Tech {
  layer: string;
  name: string;
  who: string;
  evidence: string;
  maturity: Maturity;
  relevance: 1 | 2 | 3 | 4 | 5;
  role: "integrar" | "construir" | "alimentar" | "observar";
}

export const techLayers = [
  "Acceso",
  "Comercio",
  "Seguridad",
  "Operación",
  "Experiencia",
  "IA para el fan",
  "Navegación",
] as const;

export const technologies: Tech[] = [
  {
    layer: "Acceso",
    name: "Boleto rotativo + analítica de escaneos",
    who: "Ticketmaster SafeTix",
    evidence: "Más de 35 M de accesos en México; código cambia cada 15 s",
    maturity: "Hoy",
    relevance: 5,
    role: "construir",
  },
  {
    layer: "Acceso",
    name: "Entrada facial opt-in",
    who: "Intuit Dome, NFL (Wicket), LAFC, MLB",
    evidence: "Intuit Dome: 75% se registra al final del evento; filas largas en su inauguración",
    maturity: "1–3 años",
    relevance: 3,
    role: "observar",
  },
  {
    layer: "Comercio",
    name: "Tiendas sin cajero",
    who: "Amazon Just Walk Out (80+ recintos), Intuit Dome",
    evidence: "+20–30% de capacidad de atención (estudio pagado por AWS)",
    maturity: "Hoy",
    relevance: 3,
    role: "integrar",
  },
  {
    layer: "Comercio",
    name: "Medición de filas con visión",
    who: "WaitTime, Safari AI (Hornets, Flames)",
    evidence: "53% de los fans de MLB espera 15+ min por visita a comida",
    maturity: "Hoy",
    relevance: 4,
    role: "construir",
  },
  {
    layer: "Seguridad",
    name: "LiDAR de densidad de multitud",
    who: "Ouster en Levi's Stadium, Wembley",
    evidence: "Alertas de masa crítica frente al escenario (Super Bowl y Mundial 2026)",
    maturity: "1–3 años",
    relevance: 4,
    role: "integrar",
  },
  {
    layer: "Seguridad",
    name: "Detección de armas con IA",
    who: "Evolv: Gillette, Bank of America Stadium, VenueShield de ASM Global",
    evidence: "4 mil M de revisiones (dato del proveedor); hay dudas públicas sobre lo que detecta",
    maturity: "Hoy",
    relevance: 2,
    role: "observar",
  },
  {
    layer: "Operación",
    name: "Centro de mando con IA y gemelo digital",
    who: "FIFA/Lenovo (16 estadios del Mundial 2026), ServiceNow, Populous",
    evidence: "Detectar cuellos de botella antes de que se formen",
    maturity: "Hoy",
    relevance: 5,
    role: "construir",
  },
  {
    layer: "Operación",
    name: "Wi-Fi 7 como red y como sensor",
    who: "U. de Florida (~90k), BMO Stadium, Nissan Stadium",
    evidence: "Primer Wi-Fi 7 en un estadio universitario (mayo 2026)",
    maturity: "1–3 años",
    relevance: 3,
    role: "integrar",
  },
  {
    layer: "Experiencia",
    name: "Domos inmersivos",
    who: "Sphere, Cosm",
    evidence: "Sphere 1T26: US$386.4 M de ingreso (+38%)",
    maturity: "Hoy",
    relevance: 2,
    role: "observar",
  },
  {
    layer: "Experiencia",
    name: "Pulseras LED sincronizadas",
    who: "PixMob: Super Bowl LX, Coldplay",
    evidence: "65k pulseras en el Super Bowl LX",
    maturity: "Hoy",
    relevance: 2,
    role: "observar",
  },
  {
    layer: "IA para el fan",
    name: "App del recinto (Ignite)",
    who: "Ticketmaster: EE.UU., Australia, Sudáfrica, Reino Unido",
    evidence: "Navegación, pedidos de comida, upgrades y datos de comportamiento",
    maturity: "Hoy",
    relevance: 5,
    role: "alimentar",
  },
  {
    layer: "IA para el fan",
    name: "Agente de preguntas frecuentes",
    who: "Live Nation Venue Agent (Salesforce), 120 sitios",
    evidence: "Ticketmaster atendió 15 M consultas en 2024",
    maturity: "Hoy",
    relevance: 4,
    role: "alimentar",
  },
  {
    layer: "Navegación",
    name: "Mapa indoor estándar (IMDF)",
    who: "Apple, Mappedin, Pointr",
    evidence: "GeoJSON, estándar comunitario de OGC; Apple no cobra",
    maturity: "Hoy",
    relevance: 5,
    role: "construir",
  },
  {
    layer: "Navegación",
    name: "Punto azul sin hardware",
    who: "Bluetooth 6.0 Channel Sounding, Wi-Fi 802.11az, VPS (Niantic)",
    evidence: "Android 16 / Android 15; VPS global de Niantic desde abr 2026",
    maturity: "3–5 años",
    relevance: 3,
    role: "observar",
  },
];

// ─── OCESA ─────────────────────────────────────────────────────────────────

export const ocesaUnits = [
  {
    name: "Promoción de conciertos",
    detail: "Más de 3,000 shows al año (IQ 2024). El informe ASG habla de más de 3 M de asistentes; las cifras no cuadran",
    icon: "Megaphone",
  },
  {
    name: "Festivales propios",
    detail: "23 festivales: Vive Latino, Corona Capital, EDC México, Arre, Pulso GNP, Tecate Emblema, Flow Fest",
    icon: "Sparkles",
  },
  {
    name: "Recintos en concesión",
    detail: "Estadio GNP Seguros, Palacio de los Deportes y Autódromo (CDMX, renovados en 2023 por 10 años), más la red nacional",
    icon: "Building2",
  },
  {
    name: "Deportes de motor",
    detail: "F1 en la CDMX (récord de 404,958 asistentes en 2024, contrato hasta 2028) y NASCAR",
    icon: "Gauge",
  },
  {
    name: "Escenario OCESA",
    detail: "Teatro, musicales, exposiciones y experiencias",
    icon: "Ticket",
  },
  {
    name: "OCESA Seitrack",
    detail: "Management de artistas, disquera, editorial; JV \"Touring the World\" con Warner Music Latin",
    icon: "Users",
  },
  {
    name: "OCESA Colombia",
    detail: "Vive Claro Distrito Cultural (Bogotá): hasta 40k personas, más de 290k boletos vendidos al 1er año",
    icon: "MapPin",
  },
  {
    name: "Aliados",
    detail: "OVG Hospitality (alimentos y bebidas), Banamex (cashless), GNP, AT&T, Tecate, Coca-Cola, Telcel",
    icon: "Handshake",
  },
] as const;

export type Operator = "OCESA" | "Zignia Live";

// Aforos confirmados en la investigación. El Palacio y los teatros no tienen cifra
// verificada, así que no aparecen.
export const venueCapacities: { name: string; city: string; operator: Operator; capacity: number }[] = [
  { name: "Estadio GNP Seguros", city: "CDMX", operator: "OCESA", capacity: 65000 },
  { name: "Vive Claro", city: "Bogotá", operator: "OCESA", capacity: 40000 },
  { name: "Coliseo GNP Seguros", city: "Guadalajara", operator: "OCESA", capacity: 30000 },
  { name: "Arena CDMX", city: "CDMX", operator: "Zignia Live", capacity: 22300 },
  { name: "Arena Guadalajara", city: "Guadalajara", operator: "Zignia Live", capacity: 20000 },
  { name: "Arena Monterrey", city: "Monterrey", operator: "Zignia Live", capacity: 17600 },
  { name: "Arena VFG", city: "Guadalajara", operator: "OCESA", capacity: 15000 },
];

export const moats = [
  "Integración de punta a punta: artista → promoción → recinto → boleto (Ticketmaster) → comida (OVG) → pago (Banamex)",
  "Concesiones de recintos icónicos en la CDMX hasta ~2033",
  "Festivales de marca propia: inventario de patrocinio que se repite cada año",
  "Respaldo de Live Nation: 75% de la propiedad, capital y modelos de Venue Nation y premium",
  "Naming y patrocinios de largo plazo: GNP, Banamex, AT&T, Tecate, Coca-Cola, Telcel",
  "Segundo mercado propio: Colombia",
];

export const risks = [
  {
    title: "Seguridad en estructuras temporales",
    detail: "Colapso parcial de una grada en el Palacio de los Deportes (abr 2025, 3 heridos). La CDMX anunció revisión de protocolos",
  },
  {
    title: "Escrutinio de Profeco",
    detail: "Pulseras cashless (2025), caso BTS (2026), lineamientos para eventos de más de 20k, acción colectiva",
  },
  {
    title: "Ley Itacate (en comisiones)",
    detail: "Permitiría entrar con comida a eventos al aire libre: pega directo al gasto en sitio",
  },
  {
    title: "Guadalajara",
    detail: "Mucha oferta nueva (Coliseo GNP, Arena Guadalajara) y al menos 6 cancelaciones por violencia en feb–mar 2026",
  },
  {
    title: "Datos fragmentados",
    detail: "Boleto en Ticketmaster, alimentos y bebidas en OVG, cashless en Banamex, activaciones en cada marca",
  },
  {
    title: "Cifras discutidas",
    detail: "Harry Styles: OCESA estimó 2,550–3,000 M MXN de derrama y Canaco 2,094 M",
  },
];

// ─── Producto: candidatos evaluados (1–5) ──────────────────────────────────

export const criteria = ["Dato existe", "Encaje", "Sin choque TM", "Rapidez", "Comprador", "Foso"] as const;

export const candidates: { id: string; name: string; scores: number[]; verdict: "construir" | "capa" | "no" }[] = [
  { id: "A", name: "Copiloto de operación del evento", scores: [5, 5, 5, 4, 5, 4], verdict: "construir" },
  { id: "B", name: "Pronóstico de ingreso por puerta", scores: [4, 4, 5, 4, 5, 4], verdict: "construir" },
  { id: "C", name: "ROI de patrocinio automático", scores: [3, 5, 5, 4, 5, 4], verdict: "construir" },
  { id: "E", name: "Cumplimiento de Protección Civil", scores: [5, 4, 5, 5, 4, 2], verdict: "construir" },
  { id: "D", name: "Capa de datos del recinto (IMDF → Ignite)", scores: [4, 4, 4, 4, 3, 4], verdict: "capa" },
  { id: "F", name: "Flujo en festivales (cashless)", scores: [2, 4, 5, 3, 4, 4], verdict: "capa" },
  { id: "G", name: "Agente para fans por WhatsApp", scores: [4, 5, 1, 5, 2, 1], verdict: "no" },
  { id: "H", name: "Hardware propio (LiDAR, facial…)", scores: [1, 1, 4, 1, 3, 2], verdict: "no" },
];

export const phases = [
  {
    name: "0 · Retrospectivo",
    time: "0–6 semanas",
    what: "Analizar 3 eventos pasados (estadio, arena, festival): curvas de ingreso, saturación, ventas por zona. Sin tocar la operación.",
    need: "Log de escaneos y de ventas agregado, planos, mapa de secciones a puertas",
  },
  {
    name: "1 · Piloto en vivo",
    time: "2–3 meses",
    what: "Un recinto, una serie de fechas: tablero, pronóstico, alertas al staff, reporte automático, bitácora.",
    need: "Datos casi en tiempo real y un enlace con Operaciones",
  },
  {
    name: "2 · Comercial",
    time: "3–6 meses",
    what: "Reporte de ROI para 2–3 patrocinadores en un festival y reporte de impacto verificado.",
    need: "Datos de activaciones y visto bueno del patrocinador",
  },
  {
    name: "3 · Red",
    time: "6–12 meses",
    what: "CDMX, Guadalajara, Monterrey y F1.",
    need: "Contrato marco",
  },
  {
    name: "4 · Región",
    time: "12–24 meses",
    what: "Vive Claro, Bogotá.",
    need: "—",
  },
];

// ─── Horizontes ────────────────────────────────────────────────────────────

export const horizons = [
  {
    when: "2 años",
    year: "2027–2028",
    title: "El boleto se vuelve el recinto",
    world: [
      "Ignite / boleto con direcciones, puertas y pedidos",
      "Gemelos digitales después del Mundial 2026",
      "LiDAR de densidad y entrada biométrica en EE.UU.",
      "Ola regulatoria en México (Profeco, CDMX)",
    ],
    us: "Mapas IMDF de cada recinto alimentando a Ignite; copiloto de operación y cumplimiento con los datos que ya existen.",
  },
  {
    when: "5 años",
    year: "~2031",
    title: "Punto azul sin hardware; el recinto como medio",
    world: [
      "Bluetooth 6.0 y Wi-Fi 802.11az en la mayoría de los teléfonos",
      "Lentes inteligentes: 27–112 M de unidades en 2030 (rango muy amplio)",
      "Patrocinio vendido con métricas de audiencia, como el retail media",
    ],
    us: "La misma capa de datos sirve a la navegación precisa y a la medición de audiencia por zona para patrocinadores.",
  },
  {
    when: "10 años",
    year: "~2036",
    title: "El mapa indoor como infraestructura",
    world: [
      "Robots de limpieza, seguridad y entrega que necesitan mapas legibles por máquina",
      "Identidad, ubicación y pago en un solo flujo",
      "Gana quien gobierna bien los datos",
    ],
    us: "El mapa y el grafo del recinto, siempre al día y en estándar, son el activo. Las interfaces cambian; el dato se queda.",
  },
];

// ─── Huecos ────────────────────────────────────────────────────────────────

export type GapStatus = "resuelto" | "parcial" | "abierto" | "cliente";

export const gaps: { area: string; question: string; status: GapStatus }[] = [
  { area: "Cliente", question: "¿Quién compra en OCESA y con qué presupuesto?", status: "cliente" },
  { area: "Cliente", question: "¿Tienen centro de mando o tablero del día del evento?", status: "cliente" },
  { area: "Cliente", question: "¿Pueden compartir escaneos (Ticketmaster), ventas (OVG) y cashless (Banamex)?", status: "cliente" },
  { area: "Cliente", question: "¿Llega Ignite a México? ¿Usan el Venue Agent?", status: "cliente" },
  { area: "Mercado", question: "% de mexicanos que va a conciertos (MODECULT 2025)", status: "parcial" },
  { area: "Mercado", question: "Asistencia oficial por festival", status: "abierto" },
  { area: "Mercado", question: "Tamaño del patrocinio en México", status: "abierto" },
  { area: "Competencia", question: "¿Quién vende inteligencia operativa de eventos en México?", status: "abierto" },
  { area: "Regulación", question: "Lineamientos de Profeco para eventos de más de 20k", status: "resuelto" },
  { area: "Regulación", question: "Ley Itacate (CDMX)", status: "parcial" },
  { area: "Regulación", question: "LFPDPPP: ubicación y biometría", status: "abierto" },
  { area: "Economía", question: "¿Cuánto cobrar? ¿Cuánto cuesta el personal por puerta?", status: "cliente" },
];

export const nextSteps = [
  {
    title: "Observación en campo",
    detail: "Corona Capital, 20–22 nov 2026, Autódromo: medir filas de entrada, barras y baños para llegar con un estudio \"antes\".",
  },
  {
    title: "Prueba de datos",
    detail: "Pedir a OCESA un solo log de escaneos agregado (puerta × minuto) de un evento pasado.",
  },
  {
    title: "Entrevistas",
    detail: "Operaciones, Seguridad y Comercial de OCESA; OVG; Ticketmaster MX; 2–3 patrocinadores.",
  },
  {
    title: "Señales a vigilar",
    detail: "Resultados 3T26 de Live Nation (nov), Ley Itacate, iniciativas de reventa, expansión de Ignite.",
  },
];

// ─── Fuentes ───────────────────────────────────────────────────────────────

export const sourceGroups: { title: string; items: Source[] }[] = [
  {
    title: "Mercado",
    items: [
      { label: "Live Nation — 4T y año completo 2025", url: "https://news.livenationentertainment.com/news/live-nation-entertainment-full-year-and-fourth-quarter-2025-results" },
      { label: "Live Nation — 2T 2026", url: "https://news.livenationentertainment.com/news/live-nation-entertainment-reports-second-quarter-2026-results" },
      { label: "Live Nation — 3T 2025", url: "https://news.livenationentertainment.com/news/live-nation-entertainment-third-quarter-2025-results" },
      { label: "Pollstar — cierre 2025", url: "https://news.pollstar.com/2025/12/12/year-end-business-analysis-a-return-to-earth-2025-grosses-ticket-sales-drop-averages-increase-beyonce-oasis-coldplay-have-top-tours-venues-stadiums-rock/" },
      { label: "Goldman Sachs vía Access AA", url: "https://accessaa.co.uk/live-music-industrys-value-to-nearly-double-by-2035/" },
      { label: "YPulse — Gen Z gasta más en conciertos", url: "https://www.ypulse.com/newsfeed/2026/07/08/gen-z-spends-more-on-concerts-than-millennials/" },
      { label: "Fortune Business Insights — IPIN", url: "https://www.fortunebusinessinsights.com/indoor-positioning-and-navigation-Industry-102971" },
      { label: "GII / TBRC — IPIN", url: "https://www.giikorea.co.kr/report/tbrc1975763-indoor-positioning-indoor-navigation-ipin-global.html" },
      { label: "360iResearch vía GII — IPIN", url: "https://cn.gii.tw/report/ires1983757-indoor-positioning-indoor-navigation-market-by.html" },
      { label: "Smart stadiums ~US$40 mil M en 2030", url: "https://www.securityworldmarket.com/int/News/Business-News/smart-stadiums-predicted-for-almost-40-billion-by-2030" },
    ],
  },
  {
    title: "Tecnología",
    items: [
      { label: "IQ — Ticketmaster Ignite en Reino Unido", url: "https://www.iqmagazine.com/2026/05/ticketmaster-rolls-out-end-to-end-venue-app-platform-in-uk/" },
      { label: "Salesforce — caso Live Nation", url: "https://salesforce.com/customer-stories/live-nation" },
      { label: "KCRW — Intuit Dome", url: "https://kcrw.com/news/shows/kcrw-features/intuit-dome" },
      { label: "Chain Store Age — Just Walk Out en estadios", url: "https://chainstoreage.com/stadiums-colleges-continue-deploying-amazon-just-walk-out-platform" },
      { label: "NBC Bay Area — LiDAR y multitudes", url: "https://www.nbcbayarea.com/news/local/ai-crowd-safety-super-bowl-world-cup/3944516" },
      { label: "Lenovo — tecnología del Mundial 2026", url: "https://news.lenovo.com/breaking-down-the-technology-fifa-world-cup-2026/" },
      { label: "IE Research Datalab — modelado de ingreso", url: "https://www.ie.edu/ieresearchdatalab/news-events/2026/02/garcia-guerrero-hernandez-delfin-lee-ellero-2026-modeling-crowd-flow-during-stadium-ingress/" },
      { label: "Apple — Indoor Maps Program (IMDF)", url: "https://register.apple.com/indoor" },
      { label: "GeekWire — Niantic Spatial VPS", url: "https://www.geekwire.com/2026/from-pokemon-go-to-physical-ai-niantic-spatial-unveils-its-global-3d-mapping-platform/" },
    ],
  },
  {
    title: "OCESA y competencia",
    items: [
      { label: "Music Business Worldwide — 75% de OCESA", url: "https://www.musicbusinessworldwide.com/live-nation-strikes-646-million-stake-in-mexicos-ocesa/" },
      { label: "IQ — Global Promoters Report 2024: México", url: "https://www.iqmagazine.com/publications/global-promoters-report-2024/mexico/" },
      { label: "Cobertura 360 — concesión por 10 años (2023)", url: "https://cobertura360.mx/2023/02/15/negocios/ocesa-operara-foro-sol-palacio-deportes-autodromo-hermanos-rodriguez-decada-mas/" },
      { label: "Pollstar — Coliseo GNP Seguros (sep 2026)", url: "https://news.pollstar.com/2026/09/23/a-new-era-for-guadalajara-coliseo-gnp-seguros-opens-its-doors-with-michael-buble/" },
      { label: "Pollstar — OCESA + Oak View Group", url: "https://news.pollstar.com/2024/09/09/ocesa-oak-view-group-partner-up-to-elevate-fan-experience-in-mexican-venues/" },
      { label: "Forbes Colombia — Vive Claro", url: "https://forbes.co/2025/08/21/actualidad/abren-oficialmente-viva-claro-en-bogota" },
      { label: "The Stadium Business — Arena Guadalajara", url: "https://www.thestadiumbusiness.com/2025/10/03/arena-guadalajara-opens-its-doors/" },
      { label: "Expansión — Grupo Avalanz", url: "https://expansion.mx/empresas/2023/05/17/grupo-avalanz-duenos-empresa-rival-de-ticketmaster" },
      { label: "Excélsior — Canaco corrige a OCESA", url: "https://www.excelsior.com.mx/ciudad-de-mexico/canaco-corrige-ocesa-derrama-economica-conciertos-harry-styles" },
    ],
  },
  {
    title: "Pagos · EVO",
    items: [
      { label: "Expansión — Banamex vende su adquirente a EVO (2015)", url: "https://expansion.mx/negocios/2015/09/01/banamex-vende-su-negocio-de-proceso-de-pagos-a-evo" },
      { label: "MarketScreener — Global Payments y Banamex renuevan alianza", url: "https://es.marketscreener.com/noticias/global-payments-inc-y-banamex-renuevan-su-alianza-estrategica-ce7c5cd9df8fff20" },
      { label: "Global Payments 10-K 2024 — compra de EVO", url: "https://www.sec.gov/Archives/edgar/data/1123360/000112336025000011/gpn-20241231.htm" },
      { label: "SEC 8-K — cierre de Worldpay", url: "https://www.sec.gov/Archives/edgar/data/1123360/000110465926002705/tm262856d1_ex99-1.htm" },
      { label: "Business Wire — Global Payments y HBSE", url: "https://www.businesswire.com/news/home/20251020089023/en/Global-Payments-Named-Official-Payment-Technology-Provider-for-Select-Harris-Blitzer-Sports-Entertainment-Properties" },
      { label: "American Banker — Global Payments en deportes", url: "https://www.americanbanker.com/payments/news/global-payments-adds-payment-tech-for-cowboys-twins" },
      { label: "Payments CMI — métodos de pago LatAm (Worldpay GPR)", url: "https://paymentscmi.com/insights/main-payment-methods-latin-america-brazil-mexico-chile-peru-colombia-argentina/" },
    ],
  },
  {
    title: "Regulación y riesgo",
    items: [
      { label: "El Imparcial — lineamientos de Profeco", url: "https://www.elimparcial.com/dinero/2026/02/19/ticketmaster-acepta-nuevos-lineamientos-de-profeco-para-venta-de-boletos-en-conciertos-masivos/" },
      { label: "N+ — Ley Itacate CDMX", url: "https://www.nmas.com.mx/ciudad-de-mexico/ley-itacate-cdmx-que-dice-propuesta-reforma-permitir-ingresar-alimentos-bebidas-conciertos/" },
      { label: "Expansión — accidente de gradas en el Palacio", url: "https://politica.expansion.mx/cdmx/2025/04/24/accidente-gradas-palacio-de-los-deportes-cdmx-mecanismo" },
      { label: "Infobae — cancelaciones en Jalisco", url: "https://www.infobae.com/mexico/2026/03/12/otro-caso-fortuito-cancelan-concierto-de-jason-mraz-en-guadalajara-asi-seran-los-reembolsos/" },
      { label: "Expansión — Profeco y pulseras cashless", url: "https://expansion.mx/empresas/2025/02/25/ocesa-profeco-no-cobrar-por-pulseras-cashless-festivales" },
    ],
  },
];

// ─── Benchmark México vs mundo ─────────────────────────────────────────────
// Madurez 0–5 = evaluación propia a partir de fuentes públicas.
// 0 significa "no encontramos evidencia pública en México", no "no existe".

export interface BenchRef {
  city: string;
  venue: string;
  what: string;
  year: string;
  fact: string;
  mx?: boolean;
}

export interface BenchCapability {
  id: string;
  name: string;
  world: number;
  mexico: number;
  refs: BenchRef[];
}

export const benchmark: BenchCapability[] = [
  {
    id: "ticket",
    name: "Boleto digital antifraude",
    world: 5,
    mexico: 5,
    refs: [
      { city: "CDMX", venue: "Ticketmaster MX", what: "SafeTix, código cada 15 s", year: "2023", fact: "35 M accesos", mx: true },
      { city: "Global", venue: "Ticketmaster", what: "Bloqueo de capturas + IA", year: "2026", fact: "US$1,000 M invertidos" },
      { city: "Nueva Orleans", venue: "Super Bowl", what: "Wallet con color de puerta", year: "2025", fact: "Ujieres más rápidos" },
    ],
  },
  {
    id: "premium",
    name: "Premium y gasto en sitio",
    world: 5,
    mexico: 4,
    refs: [
      { city: "CDMX", venue: "Estadio GNP Seguros", what: "Remodelación + alimentos y premium", year: "2025", fact: "Gasto por fan ×3", mx: true },
      { city: "Los Ángeles", venue: "Hollywood Palladium", what: "Concepto Vinyl Room", year: "2026", fact: "+US$100 por fan" },
      { city: "Ámsterdam", venue: "Ziggo Dome", what: "Hospitalidad premium", year: "2026", fact: "+30% por fan" },
    ],
  },
  {
    id: "cashless",
    name: "Pagos cashless",
    world: 4,
    mexico: 4,
    refs: [
      { city: "CDMX", venue: "Festivales OCESA", what: "Pulsera con Banamex", year: "2025", fact: "Sin comisiones (Profeco)", mx: true },
      { city: "Inglewood", venue: "Intuit Dome", what: "Cara = boleto y tarjeta", year: "2024", fact: "75% registrado" },
    ],
  },
  {
    id: "app",
    name: "App de recinto con navegación",
    world: 4,
    mexico: 2,
    refs: [
      { city: "Sheffield", venue: "Utilita Arena", what: "Ignite: entrada, mapa, comida", year: "2026", fact: "Ticketmaster UK" },
      { city: "Washington", venue: "D.C. United", what: "Ignite en estadio", year: "—", fact: "EE.UU." },
      { city: "CDMX", venue: "Ticketmaster MX", what: "Boleto con direcciones", year: "2026", fact: "Ignite no confirmado", mx: true },
    ],
  },
  {
    id: "wifi",
    name: "Red de alta densidad",
    world: 4,
    mexico: 3,
    refs: [
      { city: "Gainesville", venue: "The Swamp", what: "Wi-Fi 7", year: "2026", fact: "~90k personas" },
      { city: "Los Ángeles", venue: "BMO Stadium", what: "Wi-Fi 7", year: "2026", fact: "LAFC" },
      { city: "CDMX", venue: "Estadio Banorte", what: "Red para el Mundial", year: "2026", fact: "1,200+ antenas Wi-Fi", mx: true },
    ],
  },
  {
    id: "command",
    name: "Centro de mando con IA",
    world: 4,
    mexico: 2,
    refs: [
      { city: "16 sedes", venue: "FIFA / Lenovo", what: "Gemelos digitales en vivo", year: "2026", fact: "Mundial 2026" },
      { city: "Bilbao", venue: "San Mamés", what: "Modelo de ingreso con torniquetes", year: "2026", fact: "Validado (IE)" },
      { city: "CDMX · GDL · MTY", venue: "Sedes Mundial", what: "Operación FIFA temporal", year: "2026", fact: "No permanente", mx: true },
    ],
  },
  {
    id: "wayfinding",
    name: "Mapa indoor y wayfinding",
    world: 4,
    mexico: 2,
    refs: [
      { city: "Londres", venue: "Gatwick", what: "2,000 beacons + AR", year: "2017", fact: "±3 m" },
      { city: "Nashville", venue: "Aeropuerto BNA", what: "GoodMaps (accesible)", year: "2025", fact: "LiDAR" },
      { city: "GDL · Edomex", venue: "Andares, Mundo E", what: "Kioscos y punto azul", year: "—", fact: "Centros comerciales", mx: true },
    ],
  },
  {
    id: "sponsor",
    name: "Medición de spots comerciales",
    world: 4,
    mexico: 1,
    refs: [
      { city: "EE.UU.", venue: "Walmart Connect", what: "Pantalla → venta en caja", year: "2026", fact: "~4,600 tiendas" },
      { city: "Global", venue: "Live Nation", what: "Patrocinio medido", year: "2025", fact: "US$845 M AOI, +11%" },
      { city: "México", venue: "—", what: "Sin metodología pública", year: "—", fact: "Oportunidad", mx: true },
    ],
  },
  {
    id: "density",
    name: "Densidad de multitud (LiDAR)",
    world: 3,
    mexico: 0,
    refs: [
      { city: "Santa Clara", venue: "Levi's Stadium", what: "LiDAR Ouster", year: "2026", fact: "Super Bowl + Mundial" },
      { city: "Londres", venue: "Wembley", what: "Monitoreo en cancha", year: "—", fact: "Conciertos" },
      { city: "México", venue: "—", what: "No visto en fuentes públicas", year: "—", fact: "—", mx: true },
    ],
  },
  {
    id: "face",
    name: "Entrada facial",
    world: 3,
    mexico: 0,
    refs: [
      { city: "Inglewood", venue: "Intuit Dome", what: "Game Face ID", year: "2024", fact: "50% → 75% registro" },
      { city: "Los Ángeles", venue: "BMO Stadium", what: "Wicket + Axess", year: "2026", fact: "Opt-in" },
      { city: "México", venue: "—", what: "Choca con LFPDPPP", year: "—", fact: "Dato sensible", mx: true },
    ],
  },
  {
    id: "cashierless",
    name: "Tiendas sin cajero",
    world: 4,
    mexico: 0,
    refs: [
      { city: "Seattle", venue: "Lumen Field", what: "Just Walk Out", year: "—", fact: "15 puntos" },
      { city: "Nashville", venue: "Nissan Stadium", what: "Just Walk Out", year: "2027", fact: "40+ puntos" },
      { city: "México", venue: "—", what: "No visto en fuentes públicas", year: "—", fact: "—", mx: true },
    ],
  },
];

// "Dónde México ya compite" (dato duro, con fuente).
export const mexicoWins: { value: number; format: "rank" | "int" | "plain"; prefix?: string; suffix?: string; label: string; source: Source }[] = [
  {
    value: 3,
    format: "rank",
    label: "Mercado de música en vivo del mundo (Live Nation)",
    source: { label: "Live Nation, jul 2025", url: "https://www.livenationentertainment.com/2025/07/live-nation-expands-stake-in-ocesa-as-mexico-rises-to-3rd-largest-live-music-market-globally/" },
  },
  {
    value: 404958,
    format: "int",
    label: "Asistentes al GP de F1 en la CDMX (récord 2024)",
    source: { label: "Mediotiempo", url: "https://www.mediotiempo.com/automovilismo/f1/f1-gran-premio-de-mexico-2024-rompe-record-de-asistencia" },
  },
  {
    value: 3,
    format: "plain",
    suffix: " arenas",
    label: "Mexicanas en el Top 200 mundial de Pollstar 2025",
    source: { label: "IQ Global Arena Guide 2026", url: "https://www.iqmagazine.com/publications/global-arena-guide-2026/mexico/" },
  },
  {
    value: 1,
    format: "rank",
    label: "Estadio GNP Seguros: recinto para conciertos #1 (Billboard)",
    source: { label: "El CEO", url: "https://elceo.com/actualidad/estadio-gnp-logra-reconocimiento-como-el-mejor-estadio-para-conciertos-en-el-mundo/" },
  },
];

// ─── Quién tiene qué ───────────────────────────────────────────────────────

export type Have = "si" | "parcial" | "no-visto" | "nuevo";

export const players = [
  {
    id: "ocesa",
    name: "OCESA",
    tagline: "El recinto y el evento",
    owns: ["Recintos en concesión (Estadio GNP, Palacio, Autódromo, Coliseo GNP)", "23 festivales propios", "Alimentos y bebidas con OVG", "Cashless con Banamex (adquirente: EVO · Global Payments)", "Patrocinio y naming (GNP, AT&T, Banamex)"],
  },
  {
    id: "tm",
    name: "Ticketmaster · Live Nation",
    tagline: "El boleto y el fan",
    owns: ["Boleto digital SafeTix (80% digital en MX)", "App y Wallet con direcciones", "Ignite: app de recinto (fuera de MX)", "Venue Agent: preguntas frecuentes", "Playbooks globales de premium"],
  },
  {
    id: "us",
    name: "ShipbayOS",
    tagline: "La inteligencia que los une",
    owns: ["Una sola vista en vivo de todas las fuentes", "Pronóstico de llegadas por puerta", "Copiloto con IA para el staff", "Medición de spots comerciales con metodología", "Bitácora de Protección Civil e impacto verificado"],
  },
];

export const capabilities: { name: string; ocesa: Have; tm: Have; us: Have; note?: string }[] = [
  { name: "Recintos, programación y festivales", ocesa: "si", tm: "no-visto", us: "no-visto" },
  { name: "Boleto digital y control de acceso", ocesa: "parcial", tm: "si", us: "no-visto", note: "Nosotros leemos los escaneos" },
  { name: "Alimentos, bebidas y cashless", ocesa: "si", tm: "no-visto", us: "no-visto", note: "Vía OVG y Banamex" },
  { name: "App del fan con navegación", ocesa: "no-visto", tm: "parcial", us: "no-visto", note: "Ignite existe fuera de México" },
  { name: "Mapa digital (IMDF) de cada recinto mexicano", ocesa: "no-visto", tm: "no-visto", us: "nuevo", note: "Lo producimos y se lo damos a Ignite" },
  { name: "Vista unificada en vivo (escaneos + ventas + staff)", ocesa: "no-visto", tm: "no-visto", us: "nuevo" },
  { name: "Pronóstico de llegadas y filas por puerta", ocesa: "no-visto", tm: "no-visto", us: "nuevo" },
  { name: "Copiloto con IA para operación", ocesa: "no-visto", tm: "parcial", us: "nuevo", note: "TM tiene IA para el fan, no para el staff" },
  { name: "Medición de spots comerciales con metodología", ocesa: "parcial", tm: "no-visto", us: "nuevo", note: "OCESA vende el patrocinio; falta medirlo igual cada año" },
  { name: "Bitácora de Protección Civil con evidencia", ocesa: "parcial", tm: "no-visto", us: "nuevo" },
  { name: "Reporte de impacto verificado", ocesa: "parcial", tm: "no-visto", us: "nuevo", note: "Hoy hay cifras discutidas (Canaco)" },
];

// ─── Áreas en campo ────────────────────────────────────────────────────────

export const areas: {
  layer: "ops" | "security" | "commercial" | "hospitality" | "civil" | "fan";
  name: string;
  who: string;
  sees: string;
  decides: string;
  kpi: string;
  tech: string;
  before: string;
  after: string;
}[] = [
  {
    layer: "ops",
    name: "Operaciones",
    who: "Dirección de operación del evento",
    sees: "Flujo por puerta, pronóstico a 30 min, staff por acceso",
    decides: "Abrir carriles, mover personal, cambiar la puerta sugerida en el boleto",
    kpi: "Espera p95 por puerta",
    tech: "Escaneos SafeTix + modelo de llegadas",
    before: "Radio y recorridos para saber dónde hay fila",
    after: "La fila se ve 20 minutos antes de formarse",
  },
  {
    layer: "security",
    name: "Seguridad",
    who: "Jefatura de seguridad y control de multitudes",
    sees: "Densidad por zona en pista, mapa de calor, sensores",
    decides: "Abrir válvulas de alivio, cerrar accesos a pista, reforzar zonas",
    kpi: "Personas por m² frente al escenario",
    tech: "LiDAR o cámaras existentes + alertas",
    before: "Lectura a ojo desde la torre",
    after: "Alerta por umbral, con ubicación exacta",
  },
  {
    layer: "commercial",
    name: "Comercial · Spots",
    who: "Patrocinios y ventas de OCESA",
    sees: "Tráfico, permanencia e impresiones por spot",
    decides: "Precio y ubicación de cada activación; qué renovar",
    kpi: "Índice de valor por spot",
    tech: "Wi-Fi del recinto, QR/NFC, cashless por zona",
    before: "Fotos y conteos manuales para el reporte",
    after: "Reporte con la misma metodología cada año",
  },
  {
    layer: "hospitality",
    name: "Alimentos y bebidas",
    who: "OVG Hospitality en el recinto",
    sees: "Fila y venta por barra, minuto a minuto",
    decides: "Abrir cajas, reponer, mover personal entre barras",
    kpi: "Minutos de fila / venta por minuto",
    tech: "Punto de venta + visión sobre cámaras",
    before: "Se nota la fila cuando ya hay quejas",
    after: "Se abre la caja antes del pico",
  },
  {
    layer: "civil",
    name: "Protección Civil",
    who: "Coordinación de Protección Civil del recinto",
    sees: "Aforo por zona, rutas y tiempos de evacuación",
    decides: "Simulacros, rutas, evacuación parcial",
    kpi: "Tiempo estimado de evacuación",
    tech: "Mapa IMDF + conteo de accesos",
    before: "Checklists en papel",
    after: "Bitácora con hora, responsable y evidencia",
  },
  {
    layer: "fan",
    name: "El fan",
    who: "Vía la app de Ticketmaster / Ignite",
    sees: "Su puerta, su ruta y el tiempo estimado",
    decides: "A qué hora llegar y por dónde entrar",
    kpi: "% que usa las direcciones",
    tech: "Mapa IMDF publicado al boleto y al Wallet",
    before: "Busca su puerta al llegar",
    after: "Llega a la puerta correcta, antes",
  },
];

// ─── Spots comerciales (ejemplo con datos sintéticos) ──────────────────────

export interface Spot {
  id: number;
  name: string;
  zone: string;
  index: number;
  peak: number; // personas por hora en el pico
  dwell: number; // minutos
  impressions: number; // vistas estimadas de pantalla
  conversion: number; // % de ventas cashless atribuidas
  tier: "Oro" | "Plata" | "Bronce";
  hourly: number[]; // 16:00 → 23:00, índice relativo 0–100
  insight: string;
  x: number; // posición en el croquis (0–100)
  y: number;
}

export const spots: Spot[] = [
  { id: 1, name: "Explanada principal", zone: "Exterior", index: 92, peak: 9800, dwell: 3.4, impressions: 41000, conversion: 6.1, tier: "Oro", hourly: [30, 55, 80, 100, 70, 35, 60, 40], insight: "El mejor balance de tráfico y permanencia antes del show.", x: 50, y: 86 },
  { id: 2, name: "Concourse sur", zone: "Interior", index: 78, peak: 7200, dwell: 2.1, impressions: 30000, conversion: 4.3, tier: "Plata", hourly: [10, 25, 55, 85, 60, 70, 45, 15], insight: "Fuerte en el intermedio: ideal para activaciones cortas.", x: 74, y: 76 },
  { id: 3, name: "Acceso A", zone: "Entrada", index: 64, peak: 6100, dwell: 0.8, impressions: 26000, conversion: 1.2, tier: "Bronce", hourly: [45, 70, 90, 100, 20, 5, 5, 5], insight: "Mucho tráfico y poca permanencia: sirve para marca, no para venta.", x: 20, y: 66 },
  { id: 4, name: "Barra principal", zone: "Interior", index: 88, peak: 5400, dwell: 6.2, impressions: 22000, conversion: 11.8, tier: "Oro", hourly: [15, 35, 60, 90, 100, 85, 70, 30], insight: "La mayor conversión: el patrocinador de bebida justifica precio aquí.", x: 80, y: 40 },
  { id: 5, name: "Zona premium", zone: "Hospitalidad", index: 71, peak: 1900, dwell: 9.5, impressions: 8000, conversion: 18.4, tier: "Plata", hourly: [20, 40, 70, 90, 100, 95, 80, 50], insight: "Poco tráfico, mucho valor: precio por perfil, no por volumen.", x: 28, y: 24 },
  { id: 6, name: "Salida norte", zone: "Salida", index: 55, peak: 8600, dwell: 0.5, impressions: 35000, conversion: 0.4, tier: "Bronce", hourly: [0, 0, 5, 10, 10, 20, 70, 100], insight: "Gran pico al final: muestreo y recordación al salir.", x: 52, y: 14 },
];

export const sponsorContext: Stat[] = [
  {
    label: "Patrocinio Live Nation 2025",
    value: "US$845 M",
    detail: "AOI de patrocinio, +11%; el negocio que más crece después del gasto en sitio",
    quality: "primaria",
    source: { label: "Live Nation 4T 2025", url: "https://news.livenationentertainment.com/news/live-nation-entertainment-full-year-and-fourth-quarter-2025-results" },
  },
  {
    label: "AT&T en el Estadio GNP Seguros",
    value: "2025–2028",
    detail: "Marca, activaciones y experiencias premium: un contrato que se renueva con números",
    quality: "primaria",
    source: { label: "El CEO", url: "https://elceo.com/actualidad/estadio-gnp-suma-a-nuevo-patrocinador-esta-es-la-lista-de-marcas-que-le-respaldan/" },
  },
  {
    label: "La regla del retail media",
    value: "Medir = vender",
    detail: "Una pantalla sólo se vende como inventario si mide audiencia (cámaras, permanencia, proximidad)",
    quality: "secundaria",
    source: { label: "Retail media 2026", url: "https://adrianarivas.tech/2026/05/09/retail-media-networks-in-store-digital-signage-2026/" },
  },
];

// ─── Mercado en cuatro ideas ───────────────────────────────────────────────

export const regulatoryTimeline = [
  { date: "Feb 2025", title: "Profeco y pulseras cashless", detail: "Fin de comisiones en festivales de OCESA" },
  { date: "Abr 2025", title: "Grada en el Palacio", detail: "Colapso parcial; la CDMX revisa protocolos" },
  { date: "Feb 2026", title: "Lineamientos Profeco", detail: "Eventos de +20k: precio final, reembolsos, anti-bots" },
  { date: "Mar 2026", title: "Ley Itacate", detail: "Iniciativa para entrar con comida (al aire libre)" },
  { date: "May 2026", title: "Narcocorridos CDMX", detail: "Promotor y recinto vigilan contenido" },
];

// ─── Datos no obvios (propuesta) ───────────────────────────────────────────

export type Buyer = "Dirección" | "Operaciones" | "Comercial" | "A&B" | "Seguridad · PC" | "ASG";

export const hiddenData: {
  n: number;
  name: string;
  question: string;
  why: string;
  from: string;
  buyers: Buyer[];
  payments: boolean;
}[] = [
  { n: 1, name: "Costo de la fila en pesos", question: "¿Cuánto dejó de venderse por la fila de la Puerta C?", why: "La fila se mide en minutos; nadie la traduce a ventas perdidas.", from: "Escaneos + pagos por minuto", buyers: ["Dirección", "A&B"], payments: true },
  { n: 2, name: "Ventana monetizable", question: "¿Cuántos minutos libres tiene cada sección entre que entra y empieza el show?", why: "Es el tiempo que se puede vender; cambia por puerta, sección y género.", from: "Escaneo + primer pago", buyers: ["Comercial", "A&B"], payments: true },
  { n: 3, name: "Minuto de oro", question: "¿En qué momento del show se vende más?", why: "El patrocinio se vende por lugar, no por momento; el momento vale más.", from: "Pagos × horario del escenario", buyers: ["Comercial", "A&B"], payments: true },
  { n: 4, name: "Punto de saturación comercial", question: "¿A partir de qué aforo cae el gasto por persona?", why: "Más gente no siempre es más venta: hay un aforo óptimo distinto al máximo.", from: "Escaneos + pagos + densidad", buyers: ["Dirección"], payments: true },
  { n: 5, name: "Demanda no atendida", question: "¿Dónde hay tráfico y nadie vende? ¿Qué preguntan en el bot?", why: "Las zonas sin venta no aparecen en ningún reporte de ventas.", from: "Flujo + POS + preguntas al bot", buyers: ["Comercial", "A&B"], payments: true },
  { n: 6, name: "Huella de llegada por género", question: "¿Cómo llega un público de reguetón contra uno de rock o K-pop?", why: "Cada evento se planea como si fuera el primero; la curva se repite.", from: "Historial de escaneos", buyers: ["Operaciones"], payments: false },
  { n: 7, name: "Inventario predictivo y merma", question: "¿Cuánto pedir por barra según artista y clima?", why: "La merma y los quiebres de inventario se ven al final, no antes.", from: "Historial de pagos por barra", buyers: ["A&B"], payments: true },
  { n: 8, name: "Calidad de audiencia del patrocinador", question: "¿Qué % compra en la barra de la marca y vuelve a otro evento?", why: "Se reporta volumen de gente; la marca paga por calidad y recurrencia.", from: "Pagos tokenizados, en agregado", buyers: ["Comercial"], payments: true },
  { n: 9, name: "Origen, turismo y derrama verificada", question: "¿Cuánto gasta el visitante foráneo o extranjero?", why: "Hoy la derrama se estima y se discute (Canaco vs OCESA).", from: "CP de compra + país de la tarjeta (agregado)", buyers: ["Dirección", "ASG"], payments: true },
  { n: 10, name: "Riesgo por evento antes de vender", question: "¿Qué tan grande debe ser el operativo de Protección Civil?", why: "El operativo se dimensiona por costumbre, no por un índice comparable.", from: "Aforo, género, horario, clima, historial", buyers: ["Seguridad · PC"], payments: false },
  { n: 11, name: "Aprendizaje entre funciones", question: "¿Qué falló el jueves que se corrige el viernes?", why: "En residencias (6 fechas) cada noche se vuelve a empezar de cero.", from: "Bitácora + escaneos + pagos", buyers: ["Operaciones"], payments: true },
  { n: 12, name: "Huella de carbono por asistente", question: "¿Cuánto CO₂ genera cada evento y de dónde viene?", why: "OCESA ya mide el Vive Latino; falta hacerlo en todos y por asistente.", from: "Origen + transporte + consumo", buyers: ["ASG"], payments: true },
];

// ─── EVO Payments / Global Payments ────────────────────────────────────────

export const evoFacts: Stat[] = [
  {
    label: "EVO en México",
    value: "~900 M",
    detail: "Transacciones al año en más de 250,000 terminales, como adquirente de Banamex",
    quality: "secundaria",
    source: { label: "Fintech Expert / comunicado", url: "https://www.fintechexpert.mx/p/banamex-y-global-payments-renuevan" },
  },
  {
    label: "Alianza Banamex · EVO",
    value: "2015 → 2025+",
    detail: "Citi vendió el adquirente a EVO; renovada en 2025 por varios años",
    quality: "primaria",
    source: { label: "Expansión / MarketScreener", url: "https://es.marketscreener.com/noticias/global-payments-inc-y-banamex-renuevan-su-alianza-estrategica-ce7c5cd9df8fff20" },
  },
  {
    label: "Global Payments + Worldpay",
    value: "94 mil M",
    detail: "Transacciones al año, 6 M+ comercios, US$3.7 billones, 175+ países (cierre ene 2026)",
    quality: "primaria",
    source: { label: "SEC 8-K", url: "https://www.sec.gov/Archives/edgar/data/1123360/000110465926002705/tm262856d1_ex99-1.htm" },
  },
  {
    label: "Recintos con Global Payments",
    value: "160",
    detail: "Estadios y recintos; HBSE (Prudential Center, 76ers), Lightning, Cowboys, Twins",
    quality: "secundaria",
    source: { label: "Business Wire · American Banker", url: "https://www.businesswire.com/news/home/20251020089023/en/Global-Payments-Named-Official-Payment-Technology-Provider-for-Select-Harris-Blitzer-Sports-Entertainment-Properties" },
  },
];

export const mexicoPosMix = [
  { label: "Efectivo", value: 35 },
  { label: "Tarjeta de crédito", value: 27 },
  { label: "Débito y prepago", value: 25 },
  { label: "Billeteras digitales", value: 11 },
  { label: "Compra ahora, paga después", value: 1 },
];

export const mexicoPayStats: Stat[] = [
  {
    label: "Récord en un día",
    value: "42.2 M",
    detail: "Operaciones con tarjeta en México en un solo día (oct 2026)",
    quality: "primaria",
    source: { label: "Publimetro / Banxico", url: "https://www.publimetro.com.mx/noticias/2026/10/08/pagos-con-tarjeta-invaden-tu-rutina-42-millones-de-operaciones-en-un-dia/" },
  },
  {
    label: "Con tarjeta, ene–ago 2026",
    value: "5.01 bill. MXN",
    detail: "Monto en terminales; 1,431 M de operaciones sólo en el 1T 2026",
    quality: "primaria",
    source: { label: "Banxico vía prensa", url: "https://www.yucatan.com.mx/mexico/2026/01/08/cuotas-cobradas-a-pagos-con-tarjeta-son-las-mas-altas.html" },
  },
  {
    label: "Billeteras en el mundo",
    value: "33%",
    detail: "Del gasto en tienda (56% del e-commerce); la Gen Z empuja el cambio",
    quality: "secundaria",
    source: { label: "Worldpay GPR 2026", url: "https://www.worldpay.com/en/insights/articles/what-63000-shoppers-just-told-us-about-paying" },
  },
];

export const evoFlow = [
  { step: "Tap", detail: "Pulsera, tarjeta o billetera en la barra 4" },
  { step: "Terminal", detail: "ID de terminal → stand → zona del mapa IMDF" },
  { step: "EVO · Global Payments", detail: "Autoriza y liquida; Banamex como banco aliado" },
  { step: "Dato agregado", detail: "Hora, zona, monto, método; sin datos personales" },
  { step: "Event Intelligence", detail: "Gasto por zona y minuto, spots, fila, merma" },
  { step: "Decisión", detail: "Abrir caja, mover activación, precio del spot" },
];

export const evoSuccess = [
  { title: "El dato ya existe", detail: "Cada pago deja hora, terminal, monto y método. Medir gasto por zona y minuto no requiere instalar nada." },
  { title: "El socio ya está en la mesa", detail: "Banamex es aliado de OCESA (cashless, Concert Week, Auditorio Banamex) y su adquirente es EVO." },
  { title: "Hay un playbook probado", detail: "Global Payments opera en 160 recintos con POS de recinto (Genius): pedido móvil, kioscos, analítica." },
  { title: "La regulación pide transparencia", detail: "Profeco quitó comisiones al cashless (2025) y Banxico empuja la interoperabilidad (2026)." },
  { title: "El efectivo baja", detail: "Efectivo ~35% en punto de venta y sin contacto ~30%: cada año la medición es más completa." },
  { title: "Ángulo de socio para EVO", detail: "Demostrar en México lo que Global Payments vende en EE.UU.: canal de venta conjunto con Banamex." },
];

export const evoQuestions = [
  "¿Qué plataforma y qué procesador operan las pulseras cashless de OCESA?",
  "¿Podemos recibir transacciones agregadas por terminal y minuto (sin datos personales)?",
  "¿Las barras de OVG cobran con terminales Banamex/EVO o con otro adquirente?",
  "¿Qué dice la revisión legal (LFPDPPP) sobre datos de pago tokenizados y agregados?",
  "¿Le interesa a EVO/Global Payments un piloto conjunto como caso para México?",
];
