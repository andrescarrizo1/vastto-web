import requests
import json
import datetime

# --- CONFIGURACIÓN ---
PRODUCTS_FILE = 'scripts/formatted_products.json'
REPORT_FILE = 'broken_products_report.txt'

def load_products():
    with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_products(products):
    with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)

def check_url(url):
    try:
        # Usar un user-agent para evitar bloqueos básicos de ML
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.head(url, timeout=10, headers=headers, allow_redirects=True)
        return response.status_code != 404
    except:
        return False

def find_replacement(category, product_title):
    # Lógica de scraping ligero o consulta API para buscar reemplazo
    print(f"!!! ALERTA: Buscando reemplazo para '{product_title}' en categoría '{category}'")
    # Retornar una estructura vacía o predefinida para que el usuario la llene
    return {
        "title": f"NUEVO TOP SELLER: {product_title}",
        "price": 0,
        "originalPrice": None,
        "image": "/images/placeholder.jpg",
        "url": "https://www.mercadolibre.com.ar/...", # <- USUARIO: PONER LINK AQUÍ
        "badge": "NUEVO",
        "rating": 0,
        "reviews": 0,
        "freeShipping": True,
        "verdict": "Producto actualizado automáticamente. Falta descripción.",
        "pros": [],
        "cons": []
    }

def process_products():
    products_data = load_products()
    broken_products_log = []
    
    for category, products in products_data.items():
        for i, product in enumerate(products):
            if not check_url(product['url']):
                print(f"[-] Producto roto detectado: {product['title']}")
                broken_products_log.append(f"Categoría: {category} | Producto: {product['title']} | URL: {product['url']}")
                
                # Reemplazo inteligente
                new_product = find_replacement(category, product['title'])
                products_data[category][i] = new_product
    
    save_products(products_data)
    
    if broken_products_log:
        with open(REPORT_FILE, 'w', encoding='utf-8') as f:
            f.write("Productos detectados como 404:\n")
            f.write("\n".join(broken_products_log))
        print(f"\n!!! Se han detectado {len(broken_products_log)} errores. Revisa '{REPORT_FILE}' para detalles.")

if __name__ == "__main__":
    process_products()
