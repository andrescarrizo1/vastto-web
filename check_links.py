import requests
import json
import re
from src.utils.affiliate import AFFILIATE_ID

# --- CONFIGURACIÓN ---
PRODUCTS_FILE = 'scripts/formatted_products.json'
REPORT_FILE = 'broken_products_report.txt'

def load_products():
    with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_products(products):
    with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)

def get_product_id_from_url(search_url):
    # Esto es una simplificación; en un entorno real necesitarías
    # usar una librería de scraping (ej. BeautifulSoup) o la API de ML
    # para obtener el producto correcto en lugar de una búsqueda.
    # Por ahora, simularemos la extracción del ID:
    print(f"Buscando ID real para: {search_url}")
    return "MLA12345678" 

def construct_affiliate_url(item_id):
    base_url = f"https://www.mercadolibre.com.ar/p/{item_id}"
    return f"{base_url}?matt_tool={AFFILIATE_ID}"

def process_products():
    products_data = load_products()
    
    for category, products in products_data.items():
        print(f"--- Procesando categoría: {category} ---")
        for i, product in enumerate(products):
            # 1. Convertir de Search a Item ID
            item_id = get_product_id_from_url(product['url'])
            
            # 2. Construir URL correcta
            new_url = construct_affiliate_url(item_id)
            
            # 3. Validación de coherencia simple (simulada)
            # Aquí compararías el título del JSON vs el título del producto real
            is_valid = True 
            
            if is_valid:
                product['url'] = new_url
                product['active'] = True
            else:
                product['active'] = False
                print(f"[!] Coherencia baja en: {product['title']}")
            
            products_data[category][i] = product
            
    save_products(products_data)
    print("--- Procesamiento finalizado ---")

if __name__ == "__main__":
    process_products()
