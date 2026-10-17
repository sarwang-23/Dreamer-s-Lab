import re

html_path = r'insights/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

old_section_pattern = r'<section class="ins-section ins-newsletter-section".*?</section>'

new_section_html = '''<section class="ins-section ins-newsletter-section" aria-labelledby="ins-news-title">
    <div class="ins-wrap">
      <div class="ins-newsletter-card">
        <!-- Ambient radial glow behind card -->
        <div class="ins-news-glow" aria-hidden="true"></div>

        <div class="ins-newsletter-grid">
          <!-- Left: Editorial Content -->
          <div class="ins-newsletter-editorial">
            <div class="ins-news-kicker-badge">
              <span class="ins-news-pulse-dot" aria-hidden="true"></span>
              <span class="ins-news-kicker">CURATED DISPATCH</span>
            </div>
            <h2 class="ins-newsletter-title" id="ins-news-title">
              A little inspiration.<br>
              <em class="ins-serif-em">A lot of practical action.</em>
            </h2>
            <p class="ins-newsletter-sub">
              Get occasional insights on entrepreneurship, student innovation, venture building and upcoming Building Dreams opportunities.
            </p>
          </div>

          <!-- Right: Interactive Form -->
          <div class="ins-newsletter-form-col">
            <form class="ins-newsletter-form" data-demo-form novalidate>
              <div class="ins-news-field-group">
                <div class="ins-news-input-wrap">
                  <svg class="ins-news-mail-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                  <label class="ins-visually-hidden" for="insights-sub-email">Your email address</label>
                  <input type="email" id="insights-sub-email" name="email" autocomplete="email" placeholder="Enter your email address" required class="ins-news-input">
                </div>

                <button type="submit" class="ins-news-submit-btn">
                  <span>Send me Building Dreams insights</span>
                  <span class="ins-news-arrow">&rarr;</span>
                </button>
              </div>

              <div class="ins-news-meta-line">
                <svg class="ins-news-lock-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <p class="ins-news-disclaimer">No noise. Just useful ideas, stories and opportunities.</p>
              </div>

              <div class="ins-form-success" role="status">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Thank you &mdash; your subscription request has been noted.</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>'''

match = re.search(old_section_pattern, html, flags=re.DOTALL)
if match:
    html = html[:match.start()] + new_section_html + html[match.end():]
    print("Replaced newsletter section in index.html successfully.")
else:
    print("ERROR: Could not find newsletter section in index.html!")

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
