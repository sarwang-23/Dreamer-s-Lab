import re

css_path = r'insights.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

old_css_pattern = r'\.ins-newsletter-section\s*\{\s*background-color:var\(--ins-white\);\s*\}.*?\.ins-newsletter-card\.is-submitted\s*\.ins-news-input-wrap\s*\{\s*display:none;\s*\}'

new_newsletter_css = '''/* ==========================================================================
   11 - EDITORIAL NEWSLETTER SUBSCRIPTION (Compact, High-Impact 2-Col Dispatch)
   ========================================================================== */
.ins-newsletter-section {
  background-color: var(--ins-ivory);
  padding: clamp(2rem, 3.2vw, 3rem) 0;
  border-top: 1px solid var(--ins-border);
  position: relative;
}

.ins-newsletter-card {
  position: relative;
  max-width: 980px;
  margin: 0 auto;
  background: linear-gradient(135deg, #FFFFFF 0%, #FAF8F4 100%);
  border: 1.5px solid var(--ins-border);
  border-radius: 20px;
  padding: clamp(1.5rem, 2.8vw, 2.25rem) clamp(1.4rem, 3.2vw, 2.75rem);
  box-shadow: 0 4px 20px -4px rgba(41,26,20,0.06), 0 1px 3px rgba(41,26,20,0.03);
  overflow: hidden;
  transition: box-shadow 0.28s var(--ins-ease), transform 0.28s var(--ins-ease);
}

.ins-newsletter-card:hover {
  box-shadow: 0 8px 30px -6px rgba(41,26,20,0.09), 0 2px 6px rgba(41,26,20,0.04);
}

/* Traveling top orange border stripe */
.ins-newsletter-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--ins-orange), #FF853D);
}

/* Ambient subtle background glow */
.ins-news-glow {
  position: absolute;
  top: -30px;
  right: -30px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255,100,31,0.09) 0%, rgba(7,61,51,0.04) 50%, transparent 70%);
  filter: blur(28px);
  pointer-events: none;
}

/* Two-column layout */
.ins-newsletter-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: clamp(1.4rem, 2.8vw, 2.5rem);
  align-items: center;
  position: relative;
  z-index: 1;
}

.ins-newsletter-editorial {
  text-align: left;
}

/* Kicker Badge with Pulse Dot */
.ins-news-kicker-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(7, 61, 51, 0.06);
  border: 1px solid rgba(7, 61, 51, 0.1);
  padding: 0.22rem 0.65rem;
  border-radius: 999px;
  margin-bottom: 0.55rem;
}

.ins-news-pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ins-orange);
  box-shadow: 0 0 0 0 rgba(255,100,31,0.6);
  animation: insStudioPulse 2.4s infinite ease-out;
}

.ins-news-kicker {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: var(--ins-teal);
  text-transform: uppercase;
}

.ins-newsletter-title {
  font-family: var(--ins-sans);
  font-size: clamp(1.35rem, 2.2vw, 1.85rem);
  font-weight: 800;
  line-height: 1.16;
  color: var(--ins-ink);
  margin: 0 0 0.5rem;
  letter-spacing: -0.025em;
}

.ins-newsletter-sub {
  font-size: 0.84rem;
  line-height: 1.58;
  color: var(--ins-ink-soft);
  margin: 0;
  max-width: 44ch;
}

/* Right Form Column */
.ins-newsletter-form-col {
  width: 100%;
}

.ins-newsletter-form {
  width: 100%;
}

.ins-news-field-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  width: 100%;
}

.ins-news-input-wrap {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--ins-white);
  border: 1.5px solid var(--ins-border);
  border-radius: 12px;
  padding: 0.6rem 0.85rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 1px 3px rgba(41,26,20,0.03);
}

.ins-news-input-wrap:focus-within {
  border-color: var(--ins-orange);
  box-shadow: 0 0 0 3px rgba(255,100,31,0.12);
}

.ins-news-mail-icon {
  color: var(--ins-muted);
  flex-shrink: 0;
  transition: color 0.2s ease;
}

.ins-news-input-wrap:focus-within .ins-news-mail-icon {
  color: var(--ins-orange);
}

.ins-news-input {
  flex: 1;
  background: transparent;
  border: none;
  font-family: var(--ins-sans);
  font-size: 0.85rem;
  color: var(--ins-ink);
  outline: none;
}

.ins-news-input::placeholder {
  color: #9E9086;
}

.ins-news-submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  width: 100%;
  background: var(--ins-orange);
  color: var(--ins-white);
  font-family: var(--ins-sans);
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.72rem 1.25rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(255,100,31,0.22);
  transition: all 0.22s var(--ins-ease);
}

.ins-news-submit-btn:hover {
  background: var(--ins-orange-hover);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(255,100,31,0.32);
}

.ins-news-arrow {
  transition: transform 0.2s ease;
}

.ins-news-submit-btn:hover .ins-news-arrow {
  transform: translateX(3px);
}

.ins-news-meta-line {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.55rem;
}

.ins-news-lock-icon {
  color: var(--ins-teal);
  flex-shrink: 0;
  opacity: 0.75;
}

.ins-news-disclaimer {
  font-size: 0.72rem;
  line-height: 1.4;
  color: var(--ins-muted);
  margin: 0;
}

/* Success state */
.ins-form-success {
  display: none;
  align-items: center;
  gap: 0.5rem;
  background: rgba(7,61,51,0.08);
  border: 1px solid rgba(7,61,51,0.18);
  color: var(--ins-teal);
  border-radius: 10px;
  padding: 0.65rem 0.85rem;
  font-size: 0.78rem;
  font-weight: 600;
  margin-top: 0.75rem;
}

.ins-newsletter-card.is-submitted .ins-form-success {
  display: flex;
}

.ins-newsletter-card.is-submitted .ins-news-field-group {
  opacity: 0.45;
  pointer-events: none;
}

/* Responsive adjustment */
@media (max-width: 820px) {
  .ins-newsletter-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  .ins-newsletter-editorial {
    text-align: center;
  }
  .ins-newsletter-sub {
    max-width: 100%;
  }
  .ins-news-meta-line {
    justify-content: center;
  }
}'''

match = re.search(old_css_pattern, css, flags=re.DOTALL)
if match:
    css = css[:match.start()] + new_newsletter_css + css[match.end():]
    print("Replaced newsletter CSS successfully.")
else:
    print("ERROR: old_css_pattern did not match in insights.css!")

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)
