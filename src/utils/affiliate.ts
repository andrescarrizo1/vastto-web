// Mercado Libre Affiliate Utils
export const AFFILIATE_ID = 'caan170047';

/**
 * Add affiliate parameter to Mercado Libre URLs
 */
export function addAffiliateParam(url: string): string {
  if (!url.includes('mercadolibre.com')) return url;
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}matt_tool=${AFFILIATE_ID}`;
}

/**
 * Get tracking link for Mercado Libre product
 */
export function getAffiliateLink(productUrl: string): string {
  return addAffiliateParam(productUrl);
}
