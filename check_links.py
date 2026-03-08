import requests
import json

# URLs a verificar
def check_links():
    # En un proyecto real, cargarías esto de tu base de datos o archivo JSON
    # Aquí un ejemplo simple de cómo estructurarlo
    urls = [
        "https://www.mercadolibre.com.ar/auriculares-bluetooth-sony-inalambricos-wh-1000xm5-color-negro/p/MLA19176887",
        # ... añadir más enlaces
    ]
    
    broken = []
    for url in urls:
        try:
            response = requests.head(url, timeout=5, allow_redirects=True)
            if response.status_code >= 400:
                broken.append(url)
        except:
            broken.append(url)
    
    if broken:
        print(f"Links rotos: {broken}")
        # Aquí iría la lógica para alertar (ej. enviar mail o slack)

if __name__ == "__main__":
    check_links()
