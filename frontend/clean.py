import re

with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Remove the duplicate blocks at the end
css = re.sub(r'\.hl-grid-bg \{[^}]*\}\s*\.hl-highlight::after \{[^}]*\}\s*\.hl-card-1 \{', '.hl-card-1 {', css)

# Fix hl-highlight to just use border-bottom
css = re.sub(r'\.hl-highlight \{.*?\}', '.hl-highlight {\n    color: #ff6b00;\n    position: relative;\n    display: inline-block;\n    border-bottom: 5px solid #ff6b00;\n    padding-bottom: 2px;\n}', css, flags=re.DOTALL)
css = re.sub(r'\.hl-highlight::after \{.*?\}', '', css, flags=re.DOTALL)

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)
print("Cleaned CSS")
