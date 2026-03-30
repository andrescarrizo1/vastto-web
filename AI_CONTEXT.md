# VASTTO - Contexto para Agentes de IA (AI Handoff)

**Fecha de Última Actualización:** 30 de Marzo de 2026
**Objetivo del Proyecto:** Convertir a VASTTO en la plataforma de reseñas de afiliados líder en Argentina, dominando clústeres de contenido (Topical Authority) y con un fuerte enfoque en conversiones (CRO) y diseño premium inamovible (Dark Mode limpio y estructurado).
**Framework:** Astro 4.x + TypeScript + Node.js (Vanilla CSS sin Tailwind).

---

## Hitos de Indexación y Auditoría SEO (Logrados hoy)
1. **Indexación Confirmada:** Google Search Console verificó que el sitio ya está en el índice oficial de Google. Hemos registrado más de 130 impresiones recientes y un rendimiento incipiente positivo en la "cabeza de clúster" de auriculares.
2. **Saneamiento Técnico:** Se eliminó un script obsoleto (`check_links.py`) y su GitHub Action asociada porque estaban causando un loop de errores en las notificaciones del desarrollador. El error 404 reportado por GSC (`whoisdatacenter.com/`) fue diagnosticado como enlace basura externo, por lo que el código está limpio de fallos estructurales.

---

## Desarrollos Técnicos Ejecutados (Fase de Escalamiento)

### 1. SEO Programático Automatizado (Página de Ofertas)
- **Ruta:** `src/pages/ofertas-tecnologia-argentina.astro`
- **Funcionalidad:** Implementamos un motor de "SEO Programático". Esta página lee dinámicamente el catálogo local (`scripts/formatted_products.json`), calcula las diferencias entre `originalPrice` y `price`, indexa los mayores porcentajes de rebajas diarias, y muestra el listado.
- **Ventaja Algorítmica:** Genera un enorme "Freshness Score" (Frescura) para Googlebot, ya que cambia su contenido automáticamente al mutar los precios del JSON. Incluye marcado semántico estructurado automático (`Schema.org ItemList`).

### 2. Estándar Visual VASTTO y Control de Calidad Activo
- Tuvimos un problema con una foto "lifestyle" amateur para un reloj (Huawei Band), lo cual rompía nuestra narrativa estética premium.
- **Regla Estricta de la IA:** Cero tolerancia a imágenes ruidosas, pixeladas o renders no-oficiales. Las imágenes del catálogo deben obligatoriamente provenir de los servidores `http2.mlstatic.com` en su formato de altísima densidad (etiquetas `D_NQ_NP`).

### 3. El Pipeline de Integración de Afiliados (Herramienta Interna)
- **Ruta:** `scripts/add-product.mjs`
- **Importante para la IA Actual/Futura:** El usuario delegó toda la responsabilidad operativa manual de afiliación a la Inteligencia Artificial. *El desarrollador humano ya no debe raspar, bajar imágenes, o inyectar productos a mano.*
- **Uso:** Cuando se solicite agregar un nuevo producto, la IA debe usar `node scripts/add-product.mjs "https://link-mercadolibre..." "[categoria]"`. La IA tiene prohibido usar selectores genéricos inseguros. Esta herramienta usa Puppeteer Stealth de forma local, extrae la métrica del producto, baja la galería fotográfica de estudio ultra-HD, añade el tag `AFFILIATE_ID` matemáticamente, lo empaqueta, y lo inyecta a nuestro catálogo Maestro JSON, conservando nuestra exigencia visual.

---

## Directivas a Seguir para Próximas Sesiones
1. **La Estética lo es Todo:** Cualquier código generado, componente Astro o página añadida debe verse "Wow", costosa y sofisticada. Usar sombreados profundos, bordes redondeados, acentos neón controlados y no utilizar placeholders básicos si se puede usar el sub-agente navegador para conseguir verdaderos assets.
2. **Ataque en Cuña (Silo SEO):** El próximo paso a trabajar (que fue pospuesto hoy por el arreglo crítico visual) es expandir ferozmente el Clúster de "Auriculares" creando componentes de Tablas Comparativas CRO hiper-optimizadas.
