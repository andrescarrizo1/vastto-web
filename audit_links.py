#!/usr/bin/env python3
import re, os

all_links = {}
dirs_to_check = [
    'src/pages/auriculares',
    'src/pages/celulares', 
    'src/pages/smartwatch',
    'src/pages/guias',
    'src/pages/herramientas',
    'src/pages/'
]

for d in dirs_to_check:
    if not os.path.exists(d):
        continue
    for fname in sorted(os.listdir(d)):
        if fname.endswith('.astro'):
            fpath = os.path.join(d, fname)
            with open(fpath) as f:
                content = f.read()
                urls = re.findall(r'https://www\.mercadolibre\.com\.ar/[^\s\'"<>]+', content)
                clean = set()
                for u in urls:
                    u = u.strip("'\"").rstrip('.,;)')
                    if 'mercadolibre.com.ar' in u and len(u) > 30:
                        parts = u.split('?')[0].split('"')[0]
                        if parts.endswith('.'):
                            parts = parts[:-1]
                        clean.add(parts)
                if clean:
                    if d not in all_links:
                        all_links[d] = {}
                    all_links[d][fname] = sorted(clean)

total = 0
for d, pages in sorted(all_links.items()):
    print(f'\n=== {d} ===')
    for fname, urls in sorted(pages.items()):
        print(f'  {fname}:')
        for u in urls:
            print(f'    - {u}')
            total += 1

print(f'\nTOTAL: {total} URLs de ML en el sitio')
