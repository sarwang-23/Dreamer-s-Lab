import re

content = open('insights/index.html', encoding='utf-8').read()
matches = re.finditer(r'<(section|header|footer)[^>]*>', content)
for m in matches:
    tag = m.group(0)
    print(tag[:120])
