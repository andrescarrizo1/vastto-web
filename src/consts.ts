// VASTTO 2.0 — Constantes Globales de Marca y Configuración
export const SITE_TITLE = 'VASTTO | Software, Automatización e Inteligencia Artificial';
export const SITE_NAME = 'VASTTO';
export const SITE_DESCRIPTION = 'Estudio tecnológico especializado en desarrollo de software a medida, automatización de procesos empresariales e inteligencia artificial aplicada. San Rafael, Mendoza, Argentina.';
export const SITE_TAGLINE = 'Desarrollo de software y automatización aplicada a la eficiencia operativa de tu empresa.';
export const SITE_URL = 'https://vastto.com.ar';

// Canales Oficiales y Perfil Profesional (Andrés Carrizo)
export const FOUNDER_NAME = 'Andrés Carrizo';
export const FOUNDER_ROLE = 'Desarrollador Full Stack enfocado en automatización e inteligencia artificial aplicada';
export const FOUNDER_LOCATION = 'San Rafael, Mendoza, Argentina';
export const CONTACT_EMAIL = 'carrizo226@gmail.com';
export const LINKEDIN_URL = 'https://linkedin.com/in/andres-carrizo-129893213';
export const GITHUB_URL = 'https://github.com/andrescarrizo1';

// Configuración Oficial de WhatsApp Comercial
// Número personal autorizado por Andrés Carrizo para atención comercial directa
export const WHATSAPP_NUMBER = '5492406033660';
export const WHATSAPP_DISPLAY = '+54 9 240 6033660';
export const WHATSAPP_ENABLED = true;

/**
 * Genera un enlace oficial de WhatsApp con codificación segura de parámetros.
 * El usuario siempre debe confirmar y presionar ENVIAR en WhatsApp.
 */
export function getWhatsAppLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!message || !message.trim()) {
    return base;
  }
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

// Mensajes contextuales predefinidos para puntos de contacto
export const WA_MESSAGES = {
  home: 'Hola Andrés, llegué a VASTTO y quisiera conversar sobre una solución tecnológica para mi empresa.',
  inmobiliarias: 'Hola Andrés, vi la solución inmobiliaria de VASTTO y me interesa conocer cómo implementar un sistema de captación y seguimiento de interesados.',
  automotriz: 'Hola Andrés, me interesa conocer las soluciones de VASTTO para automatizar consultas comerciales de una agencia de autos.',
  distribuidoras: 'Hola Andrés, quisiera consultar sobre automatización de pedidos y procesos para mi distribuidora.',
  automatizacion: 'Hola Andrés, vi las demostraciones de VASTTO y quisiera consultar por un proyecto de automatización.',
  ia: 'Hola Andrés, quisiera consultar sobre soluciones de inteligencia artificial y agentes para mi empresa.',
  desarrollo: 'Hola Andrés, quisiera consultar sobre desarrollo de software a medida o APIs para mi empresa.',
  marketing: 'Hola Andrés, quisiera consultar sobre desarrollo web y posicionamiento técnico para mi negocio.',
  servicios: 'Hola Andrés, estuve revisando los servicios de VASTTO y quisiera consultar por una propuesta para mi empresa.',
  demos: 'Hola Andrés, vi las demostraciones en VASTTO y quisiera consultar sobre cómo implementar una solución para mi negocio.',
  demoInmobiliaria: 'Hola Andrés, probé o revisé la demostración inmobiliaria de VASTTO y quisiera conocer cómo llevar esta solución a mi negocio.',
  demoAutomotriz: 'Hola Andrés, revisé la demo automotriz de VASTTO y quisiera conocer cómo implementar un filtro de consultas en mi agencia.',
  demoAutomatizacion: 'Hola Andrés, vi la demo de agente de pedidos de VASTTO y quisiera consultar por una automatización para mi operación.',
  contacto: 'Hola Andrés, quisiera solicitar un presupuesto para un proyecto tecnológico.',
  sobreMi: 'Hola Andrés, vi tu perfil en VASTTO y me gustaría conversar sobre un proyecto o colaboración técnica.'
} as const;
