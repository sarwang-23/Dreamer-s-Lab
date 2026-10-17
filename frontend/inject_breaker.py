content = open(r'd:\Projects\sarwang\Dreamer-s-Lab\frontend\insights\index.html', encoding='utf-8').read()

idx_hero_end = content.find('</header>')
idx_audience = content.find('ins-audience-section')
idx_audience_tag = content.rfind('<section', 0, idx_audience + 1)

print('hero </header> at:', idx_hero_end)
print('audience <section> at:', idx_audience_tag)
print('Between:')
print(repr(content[idx_hero_end:idx_audience_tag]))

# Inject section breaker between </header> and <section ...ins-audience-section>
BREAKER = '''
  <!-- ── Section Breaker ── -->
  <div class="ins-section-breaker" aria-hidden="true">
    <div class="ins-breaker-line"></div>
    <div class="ins-breaker-nodes">
      <span class="ins-breaker-dot"></span>
      <span class="ins-breaker-dash"></span>
      <span class="ins-breaker-label">02 / WHO IT&rsquo;S FOR</span>
      <span class="ins-breaker-dash"></span>
      <span class="ins-breaker-dot"></span>
    </div>
    <div class="ins-breaker-line"></div>
  </div>

  '''

new_content = content[:idx_hero_end + len('</header>')] + BREAKER + content[idx_hero_end + len('</header>'):]

with open(r'd:\Projects\sarwang\Dreamer-s-Lab\frontend\insights\index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
print('Injected section breaker OK')
