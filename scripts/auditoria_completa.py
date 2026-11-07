#!/usr/bin/env python3
"""auditoria_completa.py - Verificar TODOS los links ML del sitio"""
import re
import os
import json

# Extraer TODAS las URLs de ML con contexto
all_links = []
dirs = {
    'celulares': 'src/pages/celulares',
    'smartwatch': 'src/pages/smartwatch',
    'guias': 'src/pages/guias',
    'index': 'src/pages/'
}

for cat, d in dirs.items():
    if not os.path.exists(d):
        continue
    for fname in sorted(os.listdir(d)):
        if not fname.endswith('.astro'):
            continue
        fpath = os.path.join(d, fname)
        with open(fpath) as f:
            content = f.read()
        urls = re.findall(r'https://www\.mercadolibre\.com\.ar/[^\s\'"<>]+', content)
        seen = set()
        for u in urls:
            u = u.strip("'\"").rstrip('.,;)')
            parts = u.split('?')[0].split('"')[0]
            if parts.endswith('.'):
                parts = parts[:-1]
            if len(parts) > 30 and parts not in seen:
                seen.add(parts)
                mla = parts.split('/')[-1]
                product_name = parts.split('/')[4] if len(parts.split('/')) > 4 else ''
                all_links.append({
                    'page': fname,
                    'category': cat,
                    'url': parts,
                    'mla': mla,
                    'product_slug': product_name
                })

# Guardar para verificación
with open('/tmp/ml_audit_full.json', 'w') as f:
    json.dump(all_links, f, indent=2, ensure_ascii=False)

print(f"Total links a verificar: {len(all_links)}")
for cat in ['celulares', 'smartwatch', 'guias', 'index']:
    count = len([l for l in all_links if l['category'] == cat])
    print(f"  {cat}: {count}")
