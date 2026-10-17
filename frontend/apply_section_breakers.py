import re

html_path = r'insights/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Helper to create breaker HTML
def make_breaker(label):
    return f'''  <!-- ── Section Breaker: {label} ── -->
  <div class="ins-section-breaker" aria-hidden="true">
    <div class="ins-breaker-line"></div>
    <div class="ins-breaker-nodes">
      <span class="ins-breaker-dot"></span>
      <span class="ins-breaker-dash"></span>
      <span class="ins-breaker-label">{label}</span>
      <span class="ins-breaker-dash"></span>
      <span class="ins-breaker-dot"></span>
    </div>
    <div class="ins-breaker-line"></div>
  </div>\n\n'''

# Clean up existing breaker first
html = re.sub(r'\s*<!-- ── Section Breaker ── -->\s*<div class="ins-section-breaker".*?</div>\s*</div>\s*', '\n\n', html, flags=re.DOTALL)
html = re.sub(r'\s*<!-- ── Section Breaker:.*?── -->\s*<div class="ins-section-breaker".*?</div>\s*</div>\s*', '\n\n', html, flags=re.DOTALL)

# Insert breakers before each target section
insertions = [
    ('id="audience"', '02 / WHO IT&rsquo;S FOR'),
    ('id="journey-navigator"', '03 / THE VENTURE JOURNEY'),
    ('id="library"', '04 / RESOURCE LIBRARY'),
    ('id="action-flow"', '05 / THE EXPERIMENTAL LOOP'),
    ('id="stories"', '06 / FIELD LESSONS &amp; STORIES'),
    ('id="learning-outcomes"', '07 / CORE OUTCOMES'),
]

for identifier, label in insertions:
    pos = html.find(identifier)
    if pos == -1:
        print(f"ERROR: {identifier} not found!")
        continue
    # find the opening <section tag for this identifier
    sec_tag_pos = html.rfind('<section', 0, pos)
    if sec_tag_pos == -1:
        print(f"ERROR: <section before {identifier} not found!")
        continue
    
    breaker_html = make_breaker(label)
    html = html[:sec_tag_pos] + breaker_html + html[sec_tag_pos:]
    print(f"Inserted breaker for '{label}' before {identifier}")

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated insights/index.html with all section breakers successfully.")
