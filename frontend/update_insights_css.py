import re

css_path = r'insights.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Update :root variables
css = re.sub(
    r'--ins-cream:\s*#FAF7F2;',
    '--ins-cream:        #F4EFE6;\n  --ins-cream-soft:   #F9F6F0;',
    css
)
css = re.sub(
    r'--ins-border:\s*#EAE2D5;',
    '--ins-border:       #E2DAD0;',
    css
)
css = re.sub(
    r'--ins-line:\s*rgba\(41,26,20,\.10\);',
    '--ins-line:         rgba(41,26,20,.12);',
    css
)

# 2. Update .ins-section-breaker block
old_breaker_block = r'''/* ── Section Breaker ──────────────────────────────────────── */
.ins-section-breaker {
  display:flex;
  align-items:center;
  gap:0;
  width:100%;
  max-width:1200px;
  margin:0 auto;
  padding:0 clamp(1.25rem,4vw,3rem);
  box-sizing:border-box;
}
.ins-breaker-line {
  flex:1;
  height:1px;
  background:linear-gradient(90deg, transparent, var(--ins-border) 40%, var(--ins-border) 60%, transparent);
}
.ins-breaker-nodes {
  display:inline-flex;
  align-items:center;
  gap:.55rem;
  padding:0 1rem;
  flex-shrink:0;
}
.ins-breaker-dot {
  width:5px;
  height:5px;
  border-radius:50%;
  background:var(--ins-orange);
  flex-shrink:0;
  opacity:.55;
}
.ins-breaker-dash {
  width:18px;
  height:1.5px;
  background:var(--ins-border);
  border-radius:2px;
  flex-shrink:0;
}
.ins-breaker-label {
  font-family:var(--ins-sans);
  font-size:.62rem;
  font-weight:800;
  letter-spacing:.15em;
  text-transform:uppercase;
  color:var(--ins-muted);
  white-space:nowrap;
}'''

new_breaker_block = '''/* ── Section Breaker ──────────────────────────────────────── */
.ins-section-breaker {
  display:flex;
  align-items:center;
  justify-content:center;
  width:100%;
  max-width:1200px;
  margin:0 auto;
  padding:2.75rem clamp(1.25rem,4vw,3rem) 2rem;
  box-sizing:border-box;
  position:relative;
  z-index:2;
}
.ins-breaker-line {
  flex:1;
  height:1.5px;
  background:var(--ins-border);
  opacity:.85;
}
.ins-breaker-nodes {
  display:inline-flex;
  align-items:center;
  gap:.6rem;
  padding:.42rem 1.25rem;
  background:var(--ins-white);
  border:1.5px solid var(--ins-border);
  border-radius:999px;
  box-shadow:0 3px 12px rgba(41,26,20,.05);
  flex-shrink:0;
  margin:0 1rem;
}
.ins-breaker-dot {
  width:6px;
  height:6px;
  border-radius:50%;
  background:var(--ins-orange);
  flex-shrink:0;
  box-shadow:0 0 0 3px rgba(255,100,31,.2);
  animation:insBreakerDotPulse 2.4s infinite ease-out;
}
@keyframes insBreakerDotPulse {
  0%{box-shadow:0 0 0 0 rgba(255,100,31,.6)}
  70%{box-shadow:0 0 0 6px rgba(255,100,31,0)}
  100%{box-shadow:0 0 0 0 rgba(255,100,31,0)}
}
.ins-breaker-dash {
  width:14px;
  height:1.5px;
  background:var(--ins-border);
  border-radius:2px;
  flex-shrink:0;
}
.ins-breaker-label {
  font-family:var(--ins-sans);
  font-size:.68rem;
  font-weight:800;
  letter-spacing:.14em;
  text-transform:uppercase;
  color:var(--ins-teal);
  white-space:nowrap;
}'''

if old_breaker_block in css:
    css = css.replace(old_breaker_block, new_breaker_block)
    print("Replaced section-breaker block successfully.")
else:
    print("Warning: old_breaker_block not found exactly, using regex replace.")
    css = re.sub(r'/\* ── Section Breaker ──.*?\n\s*\.ins-breaker-label\s*\{[^}]*\}', new_breaker_block, css, flags=re.DOTALL)

# 3. Add vertical orange accent line to all section headers
old_header_rule = r'.ins-section-header { margin-bottom:clamp(1.75rem,3vw,2.75rem); max-width:680px; }'
new_header_rule = '''.ins-section-header { margin-bottom:clamp(1.75rem,3vw,2.75rem); max-width:680px; position:relative; }
.ins-section-header::before { content:''; display:block; width:3px; height:1.25rem; background:var(--ins-orange); border-radius:2px; margin-bottom:.85rem; }
.ins-section-header--centered::before { margin-left:auto; margin-right:auto; }'''

if old_header_rule in css:
    css = css.replace(old_header_rule, new_header_rule)
    print("Updated .ins-section-header with vertical orange line.")

# 4. Remove duplicate vertical line on audience section header
css = re.sub(r'/\* Vertical orange accent line above the "WHO IT\'S FOR" heading \*/\s*\.ins-audience-section \.ins-section-header\s*\{[^}]*\}\s*\.ins-audience-section \.ins-section-header::before\s*\{[^}]*\}', '', css)

# 5. Ensure section backgrounds and borders are crisp
css = re.sub(
    r'\.ins-audience-section\s*\{\s*background-color:var\(--ins-cream\);\s*border-top:none;\s*\}',
    '.ins-audience-section { background-color:var(--ins-cream); border-top:1px solid var(--ins-border); }',
    css
)

css = re.sub(
    r'\.ins-section\s*\{\s*position:relative;\s*padding:clamp\(2\.75rem,5vw,4\.5rem\)\s*0;\s*border-top:1px solid var\(--ins-line\);\s*overflow:hidden;\s*\}',
    '.ins-section { position:relative; padding:clamp(3rem,5.5vw,5rem) 0; border-top:1px solid var(--ins-border); overflow:hidden; }',
    css
)

# 6. Enhance card shadows on warm background
css = re.sub(
    r'(\.ins-aud-pillar\s*\{[^}]*box-shadow:)[^;]+;',
    r'\g<1>0 4px 18px rgba(41,26,20,.06);',
    css
)

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

print("Updated insights.css successfully.")
