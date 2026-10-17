import re

css = open('insights.css', encoding='utf-8').read()
sections = [
    'ins-page', 'ins-section', 'ins-hero-section', 'ins-audience-section',
    'ins-journey-nav-section', 'ins-map-section', 'ins-library-section',
    'ins-iterative-section', 'ins-stories-section', 'ins-learning-section',
    'ins-newsletter-section', 'ins-final-cta-section'
]

for s in sections:
    # search for .class { ... }
    m = re.findall(rf'(\.{s}\s*\{{[^}}]*\}})', css)
    print(f"=== {s} ===")
    for rule in m:
        print(rule[:200])
