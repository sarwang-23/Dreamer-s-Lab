/* ==========================================================================
   Building Dreams — FAQ Live Search & Category Filter
   ========================================================================== */

(function () {
  'use strict';

  function initFAQ() {
    const searchInput = document.getElementById('faq-search');
    const tabButtons = document.querySelectorAll('[data-faq-filter]');
    const faqGroups = document.querySelectorAll('[data-faq-group]');
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    let activeCategory = 'all';

    function filterFAQs() {
      const query = (searchInput ? searchInput.value : '').trim().toLowerCase();

      faqGroups.forEach(group => {
        const groupCat = group.dataset.faqGroup;
        const matchesCategory = activeCategory === 'all' || groupCat === activeCategory;

        let visibleInGroup = 0;
        const items = group.querySelectorAll('.faq-item');

        items.forEach(item => {
          const qText = item.querySelector('.faq-summary')?.textContent.toLowerCase() || '';
          const aText = item.querySelector('.faq-body')?.textContent.toLowerCase() || '';
          const matchesQuery = !query || qText.includes(query) || aText.includes(query);

          if (matchesCategory && matchesQuery) {
            item.style.display = '';
            visibleInGroup++;
            // If user searched for something specific, auto-open matching questions
            if (query.length > 2) {
              item.setAttribute('open', '');
            }
          } else {
            item.style.display = 'none';
          }
        });

        // Hide group heading if all its items are hidden
        group.style.display = visibleInGroup > 0 ? '' : 'none';
      });
    }

    // Category Tabs Click
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        activeCategory = btn.dataset.faqFilter;
        filterFAQs();
      });
    });

    // Search Input
    if (searchInput) {
      searchInput.addEventListener('input', filterFAQs);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQ);
  } else {
    initFAQ();
  }
})();
