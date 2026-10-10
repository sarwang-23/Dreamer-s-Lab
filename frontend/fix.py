import re

with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Fix hl-title font size so it doesn't wrap
css = re.sub(r'\.hl-title \{[^}]*\}', '.hl-title {\n    font-size: 4.8rem;\n    font-weight: 800;\n    line-height: 1.05;\n    color: #2d1f18;\n    letter-spacing: -2px;\n    margin-bottom: 2rem;\n    white-space: nowrap;\n}', css)

# Fix hl-highlight to use text-decoration instead of border
css = re.sub(r'\.hl-highlight \{[^}]*\}', '.hl-highlight {\n    color: #ff6b00;\n    text-decoration: underline;\n    text-decoration-color: #ff6b00;\n    text-decoration-thickness: 5px;\n    text-underline-offset: 6px;\n}', css)

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix SVG path to loop correctly
new_path = 'M 220 80 C 420 80, 420 180, 380 180 C 150 180, 150 330, 220 330 C 420 330, 420 450, 380 450'
html = re.sub(r'<path d=".*?"', f'<path d="{new_path}"', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Fixed CSS and HTML")
