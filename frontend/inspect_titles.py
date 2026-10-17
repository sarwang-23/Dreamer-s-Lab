import re

content = open('insights/index.html', encoding='utf-8').read()

# Find all section tags and their headings
matches = re.finditer(r'<(section|header)[^>]*class=[\"\']([^\"\']+)[\"\'][^>]*id=[\"\']([^\"\']+)[\"\'][^>]*>', content)
for m in matches:
    start_pos = m.start()
    tag_content = content[start_pos:start_pos+1500]
    # find h1/h2 and eyebrow
    eyebrow = re.search(r'class=[\"\']ins-eyebrow-tag[\"\'][^>]*>(.*?)</div>', tag_content, re.DOTALL)
    title = re.search(r'<h[12][^>]*>(.*?)</h[12]>', tag_content, re.DOTALL)
    eyebrow_text = re.sub(r'<[^>]+>', ' ', eyebrow.group(1)).strip() if eyebrow else 'No eyebrow'
    title_text = re.sub(r'<[^>]+>', ' ', title.group(1)).strip() if title else 'No title'
    print(f"ID: {m.group(3)} | Class: {m.group(2)[:30]}")
    print(f"  Eyebrow: {eyebrow_text}")
    print(f"  Title:   {title_text}\n")
