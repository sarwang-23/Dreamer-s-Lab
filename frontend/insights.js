/* ==========================================================================
   BUILDING DREAMS — INSIGHTS & RESOURCES INTERACTION ENGINE
   A world-class digital publication and venture knowledge platform.
   Scoped vanilla JavaScript engine.
   ========================================================================== */

(function () {
  'use strict';

  var page = document.querySelector('.ins-page');
  if (!page) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------------------------
     01 — SCROLL PROGRESS INDICATOR & CHAPTER RAIL
     -------------------------------------------------------------------------- */
  var progressBar = page.querySelector('.ins-progress');
  var railLinks = Array.prototype.slice.call(page.querySelectorAll('.ins-rail a'));
  var observedSections = railLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function updateScrollProgress() {
    if (progressBar) {
      var totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = totalHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / totalHeight)) : 0;
      progressBar.style.width = (ratio * 100) + '%';
    }
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  if (observedSections.length && 'IntersectionObserver' in window && !reduceMotion) {
    var railObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = '#' + entry.target.id;
          railLinks.forEach(function (link) {
            link.classList.toggle('is-active', link.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-35% 0px -45% 0px', threshold: 0 });

    observedSections.forEach(function (sec) { railObserver.observe(sec); });
  }

  /* --------------------------------------------------------------------------
     02 — HERO CONSTELLATION PATHWAY INTERACTIVITY
     -------------------------------------------------------------------------- */
  var constellationPanel = page.querySelector('#ins-constellation-panel');
  var deckTitle = page.querySelector('#ins-deck-title');
  var deckStep = page.querySelector('#ins-deck-step');
  var deckTag = page.querySelector('#ins-deck-tag');
  var statusOutput = page.querySelector('#ins-stage-status');
  var deckCounter = page.querySelector('#ins-deck-counter');
  var progressFill = page.querySelector('#ins-deck-progress-fill');
  var diagramAura = page.querySelector('#ins-diagram-aura');
  var prevBtn = page.querySelector('#ins-prev-stage');
  var nextBtn = page.querySelector('#ins-next-stage');
  var constellationNodes = Array.prototype.slice.call(page.querySelectorAll('.ins-node'));

  var currentStageIndex = 0;
  var autoCycleTimer = null;
  var isUserInteracting = false;

  function setActiveStage(index) {
    if (!constellationNodes.length) return;
    if (index < 0) index = constellationNodes.length - 1;
    if (index >= constellationNodes.length) index = 0;
    currentStageIndex = index;

    var activeNode = constellationNodes[currentStageIndex];
    constellationNodes.forEach(function (n, idx) {
      n.classList.toggle('is-active', idx === currentStageIndex);
    });

    // Sync visible stage track items
    var trackItems = document.querySelectorAll('.ins-track-item');
    trackItems.forEach(function (t, idx) {
      t.classList.toggle('is-active', idx === currentStageIndex);
    });

    if (activeNode) {
      var stage = activeNode.getAttribute('data-stage') || '01';
      var title = activeNode.getAttribute('data-title') || 'STAGE';
      var desc = activeNode.getAttribute('data-desc') || '';
      var tag = activeNode.getAttribute('data-tag') || 'HORIZON';
      var step = activeNode.getAttribute('data-step') || ('Phase ' + stage + ' / 07');

      if (deckTitle) deckTitle.textContent = stage + ' / ' + title;
      if (deckStep) deckStep.textContent = step;
      if (deckTag) deckTag.textContent = tag;
      if (statusOutput) statusOutput.textContent = desc;
      if (deckCounter) deckCounter.textContent = stage + ' / 07';

      // Update smooth progress bar width
      if (progressFill) {
        var pct = ((currentStageIndex + 1) / constellationNodes.length) * 100;
        progressFill.style.width = pct + '%';
      }

      // Move ambient aura behind active node position
      if (diagramAura) {
        var topPos = activeNode.style.top || '11%';
        var leftPos = activeNode.style.left;
        var rightPos = activeNode.style.right;
        var bottomPos = activeNode.style.bottom;
        
        diagramAura.style.top = topPos;
        diagramAura.style.bottom = bottomPos || 'auto';
        if (leftPos) {
          diagramAura.style.left = leftPos;
          diagramAura.style.right = 'auto';
        } else if (rightPos) {
          diagramAura.style.left = 'auto';
          diagramAura.style.right = rightPos;
        }
      }
    }
  }

  if (constellationNodes.length) {
    constellationNodes.forEach(function (node, idx) {
      function activate() {
        isUserInteracting = true;
        clearInterval(autoCycleTimer);
        setActiveStage(idx);
      }

      node.addEventListener('mouseenter', activate);
      node.addEventListener('click', activate);
      var btn = node.querySelector('.ins-node-target');
      if (btn) {
        btn.addEventListener('focus', activate);
        btn.addEventListener('click', activate);
      }
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        isUserInteracting = true;
        clearInterval(autoCycleTimer);
        setActiveStage(currentStageIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        isUserInteracting = true;
        clearInterval(autoCycleTimer);
        setActiveStage(currentStageIndex + 1);
      });
    }

    // Gentle ambient auto-advancement when not interacted with
    if (!reduceMotion) {
      autoCycleTimer = setInterval(function () {
        if (!isUserInteracting) {
          setActiveStage((currentStageIndex + 1) % constellationNodes.length);
        }
      }, 5000);
    }

    // Set initial stage
    setActiveStage(0);
  }

  // Subtle Mouse Parallax on Desktop
  if (constellationPanel && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    constellationPanel.addEventListener('mousemove', function (e) {
      var rect = constellationPanel.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      var diagram = constellationPanel.querySelector('.ins-constellation-diagram');
      if (diagram) {
        diagram.style.transform = 'perspective(900px) rotateY(' + (x * 4) + 'deg) rotateX(' + (-y * 4) + 'deg)';
      }
    });

    constellationPanel.addEventListener('mouseleave', function () {
      var diagram = constellationPanel.querySelector('.ins-constellation-diagram');
      if (diagram) diagram.style.transform = 'none';
      isUserInteracting = false;
    });
  }

  /* --------------------------------------------------------------------------
     03 — AUDIENCE STARTING POINTS INTERACTIVE SELECTION
     -------------------------------------------------------------------------- */
  var audiencePillars = page.querySelectorAll('.ins-aud-pillar');
  var audienceTitle = page.querySelector('#ins-aud-focus-title');
  var audienceNarrative = page.querySelector('#ins-aud-focus-narrative');

  var audienceNarratives = {
    'aud-tab-dreamer': {
      title: 'Dreamers: Identifying the Problem Worth Solving',
      narrative: 'You have curiosity and drive, but no rigid attachment to a single business model yet. This is your superpower. Your focus right now is learning to observe friction points, conduct casual exploratory conversations, and identify whether a problem is authentic.'
    },
    'aud-tab-founder': {
      title: 'Student Founders: From Concept to Validated Venture',
      narrative: 'You are building things that didn’t exist yesterday. You don’t need academic theory — you need frameworks that help you test user demand, ship a tight MVP without debt, and run early customer outreach conversations with total clarity.'
    },
    'aud-tab-university': {
      title: 'Universities: Designing Sustainable Innovation Ecosystems',
      narrative: 'You are establishing the institutional environment where students turn ambition into viable enterprises. Focus on outcome-driven pre-incubation pathways, founder-mentor alignment, and structured pipeline measurement beyond ceremonial pitch competitions.'
    }
  };

  if (audiencePillars.length) {
    audiencePillars.forEach(function (pillar) {
      pillar.addEventListener('click', function () {
        audiencePillars.forEach(function (p) {
          p.classList.remove('is-selected');
          p.setAttribute('aria-selected', 'false');
        });
        pillar.classList.add('is-selected');
        pillar.setAttribute('aria-selected', 'true');

        var data = audienceNarratives[pillar.id];
        if (data && audienceTitle && audienceNarrative) {
          audienceTitle.textContent = data.title;
          audienceNarrative.textContent = data.narrative;
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     04 — HORIZONTAL JOURNEY STAGE NAVIGATOR
     -------------------------------------------------------------------------- */
  var stageTabs = page.querySelectorAll('.ins-stage-node');
  var stageBlocks = page.querySelectorAll('.ins-map-stage-block');

  function selectStage(stageKey) {
    stageTabs.forEach(function (tab) {
      var matches = tab.getAttribute('data-stage') === stageKey;
      tab.classList.toggle('is-active', matches);
      tab.setAttribute('aria-selected', matches ? 'true' : 'false');
    });

    stageBlocks.forEach(function (block) {
      var matches = block.getAttribute('data-stage-block') === stageKey;
      block.classList.toggle('is-visible', matches);
    });
  }

  if (stageTabs.length) {
    stageTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var stage = tab.getAttribute('data-stage');
        selectStage(stage);
      });
    });
  }

  /* --------------------------------------------------------------------------
     05 — RESOURCE LIBRARY SEARCH & REAL-TIME FILTERS
     -------------------------------------------------------------------------- */
  var searchInput = page.querySelector('#ins-lib-search');
  var formatChips = page.querySelectorAll('.ins-chip');
  var stageChips = page.querySelectorAll('.ins-stage-chip');
  var archiveEntries = Array.prototype.slice.call(page.querySelectorAll('.ins-archive-entry'));
  var emptyNotice = page.querySelector('#ins-lib-empty');
  var resetFiltersBtn = page.querySelector('#ins-reset-filters');

  var activeFormat = 'all';
  var activeStage = 'all';

  function applyLibraryFiltering() {
    var query = (searchInput ? searchInput.value : '').trim().toLowerCase();
    var matchCount = 0;

    archiveEntries.forEach(function (entry) {
      var entryTitle = (entry.getAttribute('data-title') || '').toLowerCase();
      var entryCat = entry.getAttribute('data-cat') || '';
      var entryFormat = entry.getAttribute('data-format') || '';

      var formatMatch = activeFormat === 'all' || entryFormat.toLowerCase() === activeFormat.toLowerCase();
      var stageMatch = activeStage === 'all' || entryCat.toLowerCase() === activeStage.toLowerCase();
      var queryMatch = !query || entryTitle.indexOf(query) !== -1;

      var isVisible = formatMatch && stageMatch && queryMatch;
      entry.hidden = !isVisible;
      if (isVisible) matchCount++;
    });

    if (emptyNotice) {
      emptyNotice.hidden = matchCount > 0;
    }
  }

  if (formatChips.length) {
    formatChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        formatChips.forEach(function (c) {
          c.classList.remove('is-selected');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('is-selected');
        chip.setAttribute('aria-pressed', 'true');
        activeFormat = chip.getAttribute('data-filter') || 'all';
        applyLibraryFiltering();
      });
    });
  }

  if (stageChips.length) {
    stageChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        stageChips.forEach(function (c) { c.classList.remove('is-selected'); });
        chip.classList.add('is-selected');
        activeStage = chip.getAttribute('data-stage-filter') || 'all';
        applyLibraryFiltering();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyLibraryFiltering);
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', function () {
      activeFormat = 'all';
      activeStage = 'all';
      if (searchInput) searchInput.value = '';
      formatChips.forEach(function (c) {
        c.classList.toggle('is-selected', c.getAttribute('data-filter') === 'all');
      });
      stageChips.forEach(function (c) {
        c.classList.toggle('is-selected', c.getAttribute('data-stage-filter') === 'all');
      });
      applyLibraryFiltering();
    });
  }

  /* --------------------------------------------------------------------------
     06 — RESOURCE DETAIL MODAL SYSTEM
     -------------------------------------------------------------------------- */
  var modal = document.querySelector('#ins-modal');
  var lastActiveElement = null;

  function setModalField(selector, text) {
    var el = modal ? modal.querySelector(selector) : null;
    if (el) el.textContent = text || '—';
  }

  function openResourceModal(dataset) {
    if (!modal) return;
    lastActiveElement = document.activeElement;

    setModalField('#ins-modal-cat', dataset.cat || 'Resource');
    setModalField('#ins-modal-title', dataset.title || 'Venture Guide');
    setModalField('#ins-modal-desc', dataset.desc || '');
    setModalField('#ins-modal-for', dataset.for);
    setModalField('#ins-modal-what', dataset.what);
    setModalField('#ins-modal-time', dataset.time);
    setModalField('#ins-modal-format', dataset.format);

    var grid = modal.querySelector('.ins-modal-grid');
    if (grid) grid.hidden = false;

    var saveBtn = modal.querySelector('#ins-modal-save');
    if (saveBtn) {
      saveBtn.hidden = false;
      saveBtn.setAttribute('aria-pressed', 'false');
      saveBtn.querySelector('span').textContent = 'Save for Later';
    }

    modal.hidden = false;
    window.requestAnimationFrame(function () { modal.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';

    var closeBtn = modal.querySelector('.ins-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function openStoryModal(storyTitle) {
    if (!modal) return;
    lastActiveElement = document.activeElement;

    setModalField('#ins-modal-cat', 'Founder Field Lesson');
    setModalField('#ins-modal-title', storyTitle || 'Founder Journey');
    setModalField('#ins-modal-desc', 'This complete participant case study is being published in our upcoming cohort edition. Subscribe to our newsletter to receive the full unedited founder interview.');

    var grid = modal.querySelector('.ins-modal-grid');
    if (grid) grid.hidden = true;

    var saveBtn = modal.querySelector('#ins-modal-save');
    if (saveBtn) saveBtn.hidden = true;

    modal.hidden = false;
    window.requestAnimationFrame(function () { modal.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';

    var closeBtn = modal.querySelector('.ins-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    window.setTimeout(function () { modal.hidden = true; }, 240);
    if (lastActiveElement && lastActiveElement.focus) {
      lastActiveElement.focus();
    }
  }

  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-modal-close]')) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });

    var saveBtn = modal.querySelector('#ins-modal-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        var isSaved = saveBtn.getAttribute('aria-pressed') === 'true';
        saveBtn.setAttribute('aria-pressed', isSaved ? 'false' : 'true');
        saveBtn.querySelector('span').textContent = isSaved ? 'Save for Later' : '✓ Saved to Notebook';
        triggerToast(isSaved ? 'Removed from saved items' : 'Saved to your personal reading list');
      });
    }

    var downloadBtn = modal.querySelector('#ins-modal-download');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', function () {
        triggerToast('Resource download prepared. Connecting document distribution.');
      });
    }
  }

  // Click delegation for all resource & story triggers
  page.addEventListener('click', function (e) {
    var storyTrigger = e.target.closest('[data-story-open]');
    if (storyTrigger) {
      openStoryModal(storyTrigger.getAttribute('data-story-open'));
      return;
    }

    var resTrigger = e.target.closest('[data-resource]');
    if (resTrigger && resTrigger.dataset && resTrigger.dataset.title) {
      openResourceModal(resTrigger.dataset);
    }
  });

  /* --------------------------------------------------------------------------
     07 — TOAST NOTIFICATION UTILITY
     -------------------------------------------------------------------------- */
  var toastElement = null;
  var toastTimer = null;

  function triggerToast(message) {
    if (!toastElement) {
      toastElement = document.createElement('div');
      toastElement.setAttribute('role', 'status');
      toastElement.style.cssText =
        'position:fixed;left:50%;bottom:32px;transform:translateX(-50%) translateY(24px);' +
        'background:#2C1B13;color:#FBF9F5;padding:.85rem 1.6rem;border-radius:100px;' +
        'font:700 .9rem/1 Outfit,-apple-system,sans-serif;box-shadow:0 20px 48px rgba(44,27,19,.4);' +
        'z-index:1200;opacity:0;transition:all .28s cubic-bezier(.16,1,.3,1);pointer-events:none;' +
        'border:1px solid rgba(255,107,26,.3);';
      document.body.appendChild(toastElement);
    }

    toastElement.textContent = message;
    window.requestAnimationFrame(function () {
      toastElement.style.opacity = '1';
      toastElement.style.transform = 'translateX(-50%) translateY(0)';
    });

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastElement.style.opacity = '0';
      toastElement.style.transform = 'translateX(-50%) translateY(24px)';
    }, 2800);
  }

  /* --------------------------------------------------------------------------
     08 — TYPOGRAPHIC STATEMENTS ACCORDION
     -------------------------------------------------------------------------- */
  var typoRows = page.querySelectorAll('.ins-typo-row');
  if (typoRows.length) {
    typoRows.forEach(function (row) {
      row.addEventListener('click', function () {
        var wasActive = row.classList.contains('is-active');
        typoRows.forEach(function (r) { r.classList.remove('is-active'); });
        if (!wasActive) row.classList.add('is-active');
      });
    });
  }

  /* --------------------------------------------------------------------------
     09 — ITERATIVE LOOP STAGE ACTIVATION
     -------------------------------------------------------------------------- */
  var loopNodes = page.querySelectorAll('.ins-loop-node');
  if (loopNodes.length) {
    loopNodes.forEach(function (node) {
      node.addEventListener('mouseenter', function () {
        loopNodes.forEach(function (n) { n.classList.remove('is-active'); });
        node.classList.add('is-active');
      });
    });
  }

  /* --------------------------------------------------------------------------
     10 — NEWSLETTER FORM DEMO HANDLER
     -------------------------------------------------------------------------- */
  var newsletterCard = page.querySelector('.ins-newsletter-card');
  var newsletterForm = page.querySelector('.ins-newsletter-form');
  if (newsletterCard && newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!newsletterForm.checkValidity()) return;
      newsletterCard.classList.add('is-submitted');
      triggerToast('Thank you for subscribing to Building Dreams insights.');
    });
  }

})();
