import re

content = open('insights/index.html', encoding='utf-8').read()

matches = re.finditer(r'<section[^>]*id=[\"\']([^\"\']+)[\"\'][^>]*>', content)
for m in matches:
    sec_id = m.group(1)
    # search next 800 chars for eyebrow
    chunk = content[m.start():m.start()+1000]
    eyebrow = re.search(r'class=[\"\']ins-eyebrow-tag[\"\'][^>]*>(.*?)</div>', chunk, re.DOTALL)
    if eyebrow:
        txt = re.sub(r'<[^>]+>', '', eyebrow.group(1)).strip()
        print(f"Section #{sec_id}: eyebrow = '{txt}'")
    else:
        print(f"Section #{sec_id}: NO eyebrow")
