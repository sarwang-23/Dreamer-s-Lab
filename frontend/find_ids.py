import re

content = open('insights/index.html', encoding='utf-8').read()

pattern = re.compile(r'<(section|header|footer)[^>]*id=[\"\']([^\"\']+)[\"\'][^>]*>')
for m in pattern.finditer(content):
    print(f"Index {m.start()}: ID = {m.group(2)}")
