# PLAN MAESTRO TÉCNICO Y ESTRATÉGICO — VASTTO 2.0: TRANSFORMACIÓN DIGITAL

**Proyecto:** VASTTO 2.0 (vastto.com.ar)  
**Fecha:** 7 de Noviembre de 2026  
**Líder Técnico & Fundador:** Andrés Carrizo (San Rafael, Mendoza, Argentina)  
**Equipo Responsable:** CTO & Arquitecto de Software, Director Creativo & UX/UI, Especialista en Branding Tecnológico, Desarrollador Senior Astro, Especialista SEO Técnico, Especialista CRO/Lead Gen, Experto en IA/Automatización, Consultor Estratégico B2B.  
**Estado Actual:** Rama `redesign/vastto-2` creada | Respaldo Legacy verificado en `.zip` | Listo para aprobación previa a implementación.

---

## 1. DIAGNÓSTICO DEL REPOSITORIO ACTUAL Y AUDITORÍA LEGACY

### 1.1. Inspección del Repositorio y Git Status
- **Ruta del repositorio:** `C:\Users\Ryzen 5\vastto-web`
- **Remote oficial:** `https://github.com/andrescarrizo1/vastto-web.git`
- **Hosting en producción:** Cloudflare Pages (despliegue continuo por webhook en push a rama de producción).
- **Commit base legado:** `76c152c` (*fix: eliminar 3 URLs rotas de ML en auriculares*).
- **Estado de ramas:** Sincronizada con `origin/main`.
- **Respaldo Físico Verificado:**  
  Generado archivo comprimido integral en:  
  `C:\Users\Ryzen 5\Desktop\vastto-web-legacy-backup-20261107.zip` (5.64 MB, árbol completo, código y assets).
- **Rama de Trabajo Aislada:** Creada y activa la rama `redesign/vastto-2`. Ningún cambio afectará a `main` ni a la producción en Cloudflare Pages hasta la aprobación final.

### 1.2. Inventario de Rutas y Páginas Actuales (33 URLs Legadas)
1. **Home:** `/`
2. **Institucional:** `/sobre-nosotros`
3. **Catálogo & Silos de Afiliación:**
   - `/celulares` + 8 comparativas y reviews individuales.
   - `/auriculares` + 8 comparativas y reviews individuales.
   - `/smartwatch` + 4 reviews individuales.
   - `/accesorios` (dinámica vía `[categoria].astro`).
   - `/guias` + 4 guías de compra de tecnología.
   - `/herramientas/calculadora-cuotas`
   - `/ofertas-tecnologia-argentina` (SEO programático conectado a `formatted_products.json`).
4. **Mapeo de Afiliación:** Tag de afiliado `caan170047` administrado en `src/utils/affiliate.ts`.

---

## 2. ESTRATEGIA DE MIGRACIÓN SEO Y PROTOCOLO DE REDIRECCIONES

> [!IMPORTANT]
> **Directriz Anti-Soft 404 de Google:**  
> Redirigir masivamente URLs de reviews de celulares/auriculares a la Home de un estudio B2B de software es penalizado por Google como **Soft 404**, diluyendo la autoridad del dominio.  
> Se aplicará una política estricta de **Redirección Semántica (301)** únicamente cuando exista un destino relevante, y **Código HTTP 410 (Gone - Eliminado Permanentemente)** para el catálogo de afiliados descontinuado, ordenando a Googlebot desindexar limpiamente los productos de ecommerce.

### 2.1. Mapa de Redirecciones URL por URL (`public/_redirects` de Cloudflare)

```apache
# ==============================================================================
# VASTTO 2.0 — MAPA OFICIAL DE REDIRECCIONES CLOUDFLARE PAGES
# ==============================================================================

# 1. Rutas con Equivalencia Temática Directa (301 Permanent Redirect)
/sobre-nosotros                                    /sobre-mi                       301!

# 2. Rutas de Afiliación y Productos Tecnológicos Obsoletos (410 Gone)
# Se indica a los motores que el contenido ya no existe y no debe ser indexado
/celulares                                         410
/celulares/*                                       410
/auriculares                                       410
/auriculares/*                                     410
/smartwatch                                        410
/smartwatch/*                                      410
/accesorios                                        410
/guias                                             410
/guias/*                                           410
/ofertas-tecnologia-argentina                      410
/herramientas/calculadora-cuotas                   410
```

### 2.2. Configuración de `robots.txt` y `sitemap.xml`
- `robots.txt`: Se reconfigura para permitir el rastreo de las 16 nuevas páginas B2B, restringiendo endpoints API o carpetas privadas.
- `sitemap-index.xml`: Generado dinámicamente con `@astrojs/sitemap`, incluyendo exclusivamente las 16 páginas vigentes con prioridades jerárquicas (Home: 1.0, Servicios y Demos: 0.9, Soluciones: 0.8, Sobre mí y Contacto: 0.7).

---

## 3. IDENTIDAD DE MARCA Y SISTEMA DE DISEÑO (VASTTO 2.0)

### 3.1. Posicionamiento Estratégico
- **Nombre de Marca:** VASTTO
- **Firma / Tagline:** *Tecnología. Automatización. Inteligencia Artificial.*
- **Propuesta de Valor Central:** *"Transformamos procesos empresariales en sistemas inteligentes."*
- **Personalidad de Marca:** Rigurosa, técnica, moderna, pragmática, transparente y orientada a resultados medibles de negocio.
- **Diferenciador Radical:** VASTTO no es una "agencia de marketing digital genérica" que terceriza con plantillas, sino un **estudio de ingeniería de software e inteligencia artificial aplicada** liderado por un desarrollador Full Stack real que comprende a fondo la arquitectura, el código y los cuellos de botella operativos de las empresas.

### 3.2. Tokens de Diseño y Paleta Cromática (Modo Oscuro Tecnológico Premium)
- **Fondo Base (`--bg-void`):** `#090A0F` (Negro espacial profundo de alta gama).
- **Superficie de Tarjetas (`--bg-surface`):** `#11141F` (Azul medianoche tecnológico).
- **Superficie Elevada (`--bg-surface-elevated`):** `#181D2D` con borde sutil `rgba(255, 255, 255, 0.08)`.
- **Acento Primario (`--accent-cyan`):** `#00F0FF` (Cian de alta tecnología para microinteracciones y foco de lectura).
- **Acento Secundario (`--accent-indigo`):** `#6366F1` (Índigo para gradientes de IA y automatización).
- **Acento de Conversión (`--accent-emerald`):** `#10B981` (Verde esmeralda para CTAs de éxito, WhatsApp y badges activos).
- **Tipografía:**
  - *Titulares y Display:* `Space Grotesk` o `Plus Jakarta Sans` (Geométrica, vanguardista, legible).
  - *Cuerpo y UI:* `Inter` (Precisa, estándar de la industria tech).
  - *Código, Métricas y Terminales:* `JetBrains Mono` (Credibilidad técnica inmediata).

---

## 4. ARQUITECTURA DEL SITIO (16 PÁGINAS ESTRUCTURADAS)

Cada página cuenta con una función comercial definida, metadatos propios, marcado Schema.org y un llamado a la acción específico:

```
/                                      -> Homepage: Posicionamiento, problemas, soluciones y demos
/servicios                             -> Hub general de servicios jerarquizados
/automatizacion                        -> Automatización comercial y administrativa
/inteligencia-artificial               -> Agentes IA, LLMs y asistentes operativos
/desarrollo                            -> Aplicaciones a medida, APIs e integraciones
/marketing-digital                     -> SEO técnico y campañas Meta Ads (capacidad complementaria)
/soluciones/inmobiliarias              -> Landing vertical para inmobiliarias y constructoras
/soluciones/automotrices               -> Landing vertical para agencias de autos y concesionarias
/soluciones/distribuidoras             -> Landing vertical para distribuidoras y mayoristas
/demos                                 -> Centro de demostraciones interactivas
/demos/inmobiliaria                    -> Demo interactiva: Asistente comercial inmobiliario
/demos/automotriz                      -> Demo interactiva: Calificador de consultas vehiculares
/demos/automatizacion                  -> Demo interactiva: Pipeline de agente IA con terminal
/proyectos                             -> Portfolio verificado (CUYOPROSPECT, Razón y Asombro, VASTTO)
/sobre-mi                              -> Perfil profesional, stack técnico y trayectoria de Andrés
/contacto                              -> Formulario de captación calificado y canales directos
```

---

## 5. DISEÑO DE LA HOMEPAGE Y FLUJO DE CONVERSIÓN

La estructura de la página principal está diseñada para responder las 5 preguntas del tomador de decisión en menos de 10 segundos:

1. **Hero Section:**
   - *Titular de impacto:* *"Tu empresa puede hacer más con la tecnología adecuada."*
   - *Subtítulo de autoridad:* *"Desarrollamos software, automatizaciones e inteligencia artificial para ayudar a las empresas a captar oportunidades, optimizar procesos y crecer."*
   - *Badges de Confianza:* `Desarrollo Local en San Rafael` • `Sistemas a Medida` • `Datos 100% Privados`
   - *CTAs:* `Explorar Soluciones` (Scroll a verticales) y `Probar Demos Interactivas` (Enlace a `/demos`).
   - *Elemento Visual Hero:* Mockup interactivo en vivo de una terminal/dashboard de automatización que simula la recepción y resolución de consultas comerciales.
2. **Matriz de Dolores vs Soluciones:**
   - ¿Pérdida de consultas por demoras en WhatsApp? -> Sistema de atención 24/7 y calificación de leads.
   - ¿Cargas manuales repetitivas en Excel? -> Automatización de flujos entre CRM, bases de datos y facturación.
   - ¿Sitio web lento o sin visitas calificadas? -> Desarrollo web en Astro de ultra-alto rendimiento y SEO local.
3. **Pilar de Servicios Jerarquizado:**
   - Tarjetas interactivas con chips tecnológicos (Python, FastAPI, Astro, Agentes IA).
4. **Soluciones por Industria (Cuyo y Mendoza):**
   - Módulos específicos para Inmobiliarias, Agencias de Autos y Distribuidoras.
5. **Showcase de Demos Interactivas en Vivo:**
   - Previsualización embebida para probar el asistente sin salir de la página.
6. **Portfolio de Proyectos Reales:**
   - Presentación de CUYOPROSPECT (plataforma local de prospección ética) y proyectos propios.
7. **Perfil de Liderazgo Técnico (Andrés Carrizo):**
   - Fotografía profesional, stack y visión de ingeniería aplicada.
8. **CTA Final y Garantía de Transparencia:**
   - Formulario de diagnóstico previo sin compromiso comercial invasivo.

---

## 6. ESPECIFICACIÓN TÉCNICA DE LAS 3 DEMOSTRACIONES INTERACTIVAS

Cada demo funcionará 100% en el cliente (Browser-only) mediante componentes Astro reactivos en Vanilla JavaScript / TypeScript, aisladas con datos sintéticos y con una advertencia visible de entorno de demostración:

### Demo 1: Inmobiliaria (`/demos/inmobiliaria`)
- **Problema real resuelto:** Las inmobiliarias reciben decenas de consultas diarias por WhatsApp y portales donde el 70% no califica o no tiene presupuesto definido, consumiendo horas del equipo de ventas.
- **Simulación interactiva:**
  1. *Entrada:* El visitante selecciona o escribe una consulta típica de compra/alquiler (ej: *"Busco casa en barrio privado o centro de San Rafael, presupuesto 80.000 USD"*).
  2. *Procesamiento:* El sistema desglosa presupuesto, zona deseada, tipo de propiedad y urgencia.
  3. *Salida en Pantalla:* Genera la ficha del prospecto con puntaje de oportunidad (Lead Score), asignación automática a un asesor y borrador de mensaje de WhatsApp listo para responder.

### Demo 2: Concesionaria de Automóviles (`/demos/automotriz`)
- **Problema real resuelto:** Pérdida de seguimiento comercial a clientes que consultan por vehículos con permuta o requieren planes de financiación bancaria.
- **Simulación interactiva:**
  1. *Entrada:* Selección de modelo de interés (ej: Pickup 0km vs Usado Seleccionado), indicando si entrega vehículo usado como parte de pago.
  2. *Procesamiento:* Cálculo simulado de cuotas, tasación estimativa y clasificación del potencial financiero.
  3. *Salida:* Vista estilo CRM con estado del lead, próximo paso recomendado y recordatorio automático para el vendedor.

### Demo 3: Automatización de Procesos con Agente IA (`/demos/automatizacion`)
- **Problema real resuelto:** Recepción desordenada de comprobantes, pedidos o presupuestos en PDF/texto que un administrativo debe transcribir manualmente.
- **Simulación interactiva:**
  1. *Entrada:* Selección de un documento comercial simulado (ej: orden de compra o consulta compleja).
  2. *Procesamiento:* Visualización de los pasos del agente IA en una consola interactiva (Paso 1: Extracción semántica -> Paso 2: Validación de datos -> Paso 3: Cruce con stock -> Paso 4: Notificación generada).
  3. *Salida:* Resumen JSON estructurado y actualización inmediata del panel de control.

> [!NOTE]
> **Aviso Obligatorio en Demos:** Cada pantalla exhibirá el distintivo:  
> `⚠️ MODO PROTOTIPO: Esta demostración utiliza datos sintéticos generados para exhibir capacidades de arquitectura y flujo. No interactúa con bases de datos ni clientes reales.`

---

## 7. PORTFOLIO DE CASOS REALES Y PERFIL PROFESIONAL

### 7.1. Proyectos a Exhibir con Transparencia Absoluta
1. **CUYOPROSPECT (Sistema de Inteligencia Comercial B2B Local-First):**
   - *Rol:* Creador y Arquitecto Full Stack.
   - *Stack:* Python, FastAPI, SQLite en modo WAL, Playwright, BeautifulSoup, Trafilatura, Astro 5, ReportLab.
   - *Descripción:* Plataforma diseñada para la prospección ética de empresas de Cuyo, auditoría técnica web, detección de brechas de digitalización y preparación de propuestas comerciales asistidas por LLM.
   - *Rigor Técnico:* Destacar que cuenta con arquitectura desacoplada, protección contra SSRF y ataques de inyección, y suite de pruebas automatizadas interna con 53 tests unitarios y de integración.
2. **RAZÓN Y ASOMBRO (Publicación Digital y Plataforma Editorial):**
   - *Rol:* Diseñador y Desarrollador Web.
   - *Stack:* Astro, Markdown/MDX, CSS moderno.
   - *Descripción:* Proyecto editorial independiente enfocado en máxima velocidad de carga (Core Web Vitals verdes), estructura semántica limpia, tipografía legible y optimización para lectura profunda.
3. **VASTTO 2.0 (Transformación Digital Integral):**
   - *Rol:* Propietario y Desarrollador.
   - *Descripción:* Caso de estudio en vivo de cómo una web de afiliación de consumo fue refundada tecnológicamente en una plataforma de servicios de ingeniería B2B de alto valor.

### 7.2. Perfil de Andrés Carrizo (`/sobre-mi`)
- Desarrollador Full Stack residente en San Rafael, Mendoza.
- Habilidades verificables: Python, FastAPI, JavaScript, Node.js, Astro, Docker, APIs REST, Web Scraping ético, SQL, Agentes IA, Modelos de Lenguaje (LLMs), GitHub, Cloudflare Pages, SEO Técnico y Estrategias Meta Ads.
- Enlaces oficiales:
  - LinkedIn: `https://linkedin.com/in/andres-carrizo-129893213`
  - GitHub: `https://github.com/andrescarrizo1`

---

## 8. CONVERSIÓN COMERCIAL (CRO) Y CANALES DE CONTACTO

- **Formulario de Calificación:**  
  Campos únicos: Nombre, Empresa / Comercio, Email, Teléfono/WhatsApp (opcional), Servicio de Interés y Breve Descripción del Desafío. Sin preguntas intrusivas ni datos sensibles.
- **Canal Directo de WhatsApp Dinámico:**  
  Generador de enlaces `https://wa.me/549...?text=...` que precarga un mensaje profesional adaptado a la página donde se originó el clic (ej: *"Hola Andrés, vi la demo inmobiliaria en VASTTO y me gustaría conversar sobre automatizar la atención en mi empresa."*).
- **Contacto Directo:** Enlace a email institucional y perfil de LinkedIn profesional.

---

## 9. PLAN DE EJECUCIÓN POR FASES

| Fase | Tarea Principal | Estado / Entregable |
| :---: | :--- | :---: |
| **Fase 1** | **Auditoría, Respaldo y Diagnóstico** | **COMPLETADO:** Backup zip generado, rama `redesign/vastto-2` creada, URLs mapeadas y plan técnico documentado. |
| **Fase 2** | **Branding y Sistema de Diseño** | Configuración de tokens CSS, tipografías, componentes base (`Layout`, `Navbar`, `Footer`, `Button`, `Card`, `Badge`). |
| **Fase 3** | **Homepage y Catálogo de Servicios** | Implementación de `/`, `/servicios`, `/automatizacion`, `/inteligencia-artificial`, `/desarrollo`, `/marketing-digital`. |
| **Fase 4** | **Soluciones por Industria** | Creación de `/soluciones/inmobiliarias`, `/soluciones/automotrices`, `/soluciones/distribuidoras`. |
| **Fase 5** | **Centro de Demostraciones Interactivas** | Desarrollo de `/demos`, `/demos/inmobiliaria`, `/demos/automotriz`, `/demos/automatizacion`. |
| **Fase 6** | **Portfolio y Perfil Profesional** | Desarrollo de `/proyectos` y `/sobre-mi`. |
| **Fase 7** | **Contacto, Conversión y Redirecciones** | Implementación de `/contacto`, `public/_redirects` (301 y 410), `robots.txt` y metadatos SEO. |
| **Fase 8** | **Compilación, Pruebas y Responsive** | Ejecución de `npm run build`, auditoría de accesibilidad, validación móvil y rendimiento 100/100. |
| **Fase 9** | **Revisión y Aprobación del Usuario** | Presentación completa para validación antes de realizar merge o despliegue a producción. |

---

## 10. SEGURIDAD Y PRIVACIDAD DEL SISTEMA

- La web pública de VASTTO es un sitio estático desplegado en Cloudflare Pages.
- **Aislamiento Total:** El código público nunca expondrá variables de entorno privadas, tokens de API de terceros, credenciales de correo ni la base de datos interna de CUYOPROSPECT.
- Los prototipos interactivos corren exclusivamente en el navegador del cliente con datos sintéticos locales.
