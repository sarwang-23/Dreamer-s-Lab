import json
import re

with open(r'C:\Users\Sarwang\.gemini\antigravity-ide\brain\aed1666a-439a-4da0-be5e-e14613648fec\scratch\hero_json.txt', 'r', encoding='utf-8') as f:
    data = json.load(f)

content = data.get('content', '')
if not content and 'tool_calls' in data:
    for call in data['tool_calls']:
        if call['name'] == 'run_command':
            content = call['args'].get('CommandLine', '')

match = re.search(r'(<header class=\\?"hero\\?">.*?</header>)', content, re.DOTALL)
if match:
    hero_html = match.group(1).replace('\\n', '\n').replace('\\"', '"').replace('\\\\', '\\')
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    html = re.sub(r'<header class="nd-hero">.*?</header>', hero_html, html, flags=re.DOTALL)
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Replaced successfully!")
else:
    print("Could not find hero html inside json")
