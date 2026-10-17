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
     02 — AUDIENCE STARTING POINTS INTERACTIVE SELECTION
     -------------------------------------------------------------------------- */
  var audiencePillars = page.querySelectorAll('.ins-aud-pillar');
  var audienceTitle = page.querySelector('#ins-aud-focus-title');
  var audienceNarrative = page.querySelector('#ins-aud-focus-narrative');
  var audienceNumBox = page.querySelector('#ins-traj-num');
  var audienceRoadmap = page.querySelector('#ins-traj-roadmap');
  var audienceCta = page.querySelector('#ins-traj-cta');
  var audienceCtaText = page.querySelector('#ins-traj-cta-text');
  var audienceLibLink = page.querySelector('#ins-traj-library-link');
  var audienceLibText = page.querySelector('#ins-traj-lib-text');
  var audienceAxisNodes = page.querySelectorAll('.ins-aud-jnode');

  var audienceTrajectories = {
    'aud-tab-dreamer': {
      num: '01',
      title: 'Dreamers: Identifying the Problem Worth Solving',
      narrative: 'You have curiosity and drive, but no rigid attachment to a single business model yet. This is your superpower. Your focus right now is learning to observe friction points, conduct casual exploratory conversations, and identify whether a problem is authentic before committing time or capital.',
      ctaText: 'Explore Discovery Phase (Stage 01)',
      targetStage: 'discover',
      libText: 'View Problem Discovery Tools',
      libStage: 'Idea',
      roadmap: [
        { num: '01', title: 'CURIOSITY', desc: 'Observe friction' },
        { num: '02', title: 'OBSERVATION', desc: 'Empathy interviews' },
        { num: '03', title: 'PROBLEM SPOTTING', desc: 'Filter real pain' },
        { num: '04', title: 'EXPLORATION', desc: 'Test assumptions' },
        { num: '05', title: 'CONCEPT', desc: 'Initial hypothesis' }
      ]
    },
    'aud-tab-founder': {
      num: '02',
      title: 'Student Founders: From Concept to Validated Venture',
      narrative: 'You are building things that didn’t exist yesterday. You don’t need academic theory — you need frameworks that help you test user demand, ship a tight MVP without debt, and run early customer outreach conversations with total clarity.',
      ctaText: 'Explore Validation & Build (Stages 02–03)',
      targetStage: 'validate',
      libText: 'Jump to Recommended Founder Tools',
      libStage: 'Validation',
      roadmap: [
        { num: '01', title: 'IDEA', desc: 'Initial spark' },
        { num: '02', title: 'PROBLEM', desc: 'Validated friction' },
        { num: '03', title: 'VALIDATION', desc: 'Demand evidence' },
        { num: '04', title: 'MVP', desc: 'Scrappy prototype' },
        { num: '05', title: 'FIRST USERS', desc: 'Pilot feedback' },
        { num: '06', title: 'TRACTION', desc: 'Repeatable model' }
      ]
    },
    'aud-tab-university': {
      num: '03',
      title: 'Universities: Designing Sustainable Innovation Ecosystems',
      narrative: 'You are establishing the institutional environment where students turn ambition into viable enterprises. Focus on outcome-driven pre-incubation pathways, founder-mentor alignment, and structured pipeline measurement beyond ceremonial pitch competitions.',
      ctaText: 'Explore Ecosystem Phase (Stage 06)',
      targetStage: 'ecosystem',
      libText: 'View University Ecosystem Frameworks',
      libStage: 'University',
      roadmap: [
        { num: '01', title: 'CAMPUS CULTURE', desc: 'Inspire discovery' },
        { num: '02', title: 'PRE-INCUBATION', desc: 'Structured sprints' },
        { num: '03', title: 'MENTOR NETWORKS', desc: 'Practitioner advice' },
        { num: '04', title: 'VENTURE PIPELINE', desc: 'Commercial tests' },
        { num: '05', title: 'IMPACT METRICS', desc: 'Sustainable scale' }
      ]
    }
  };

  function renderAudienceRoadmap(roadmapList) {
    if (!audienceRoadmap) return;
    audienceRoadmap.innerHTML = '';
    roadmapList.forEach(function (item, index) {
      var stepEl = document.createElement('div');
      stepEl.className = 'ins-traj-step' + (index === 0 ? ' is-active' : '');
      stepEl.innerHTML = 
        '<div class="ins-traj-step-node">' +
          '<span class="ins-traj-step-num">' + item.num + '</span>' +
        '</div>' +
        '<div class="ins-traj-step-info">' +
          '<span class="ins-traj-step-title">' + item.title + '</span>' +
          '<span class="ins-traj-step-desc">' + item.desc + '</span>' +
        '</div>';
      
      stepEl.addEventListener('mouseenter', function () {
        audienceRoadmap.querySelectorAll('.ins-traj-step').forEach(function (s) { s.classList.remove('is-active'); });
        stepEl.classList.add('is-active');
      });

      audienceRoadmap.appendChild(stepEl);
    });
  }

  function setAudienceTrajectory(tabId) {
    var data = audienceTrajectories[tabId];
    if (!data) return;

    audiencePillars.forEach(function (p) {
      var isTarget = p.id === tabId;
      p.classList.toggle('is-selected', isTarget);
      p.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    audienceAxisNodes.forEach(function (node) {
      node.classList.toggle('is-active', node.getAttribute('data-target') === tabId);
    });

    if (audienceTitle) audienceTitle.textContent = data.title;
    if (audienceNarrative) audienceNarrative.textContent = data.narrative;
    if (audienceNumBox) audienceNumBox.textContent = data.num;
    if (audienceCtaText) audienceCtaText.textContent = data.ctaText;
    if (audienceLibText) audienceLibText.textContent = data.libText;

    if (audienceCta) {
      audienceCta.onclick = function (e) {
        e.preventDefault();
        selectStage(data.targetStage);
        var targetSection = document.querySelector('#journey-navigator');
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
    }

    if (audienceLibLink) {
      audienceLibLink.onclick = function (e) {
        e.preventDefault();
        filterLibraryByStage(data.libStage);
        var libSection = document.querySelector('#library');
        if (libSection) {
          libSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
    }

    renderAudienceRoadmap(data.roadmap);
  }

  if (audiencePillars.length) {
    audiencePillars.forEach(function (pillar) {
      pillar.addEventListener('click', function () {
        setAudienceTrajectory(pillar.id);
      });
      pillar.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setAudienceTrajectory(pillar.id);
        }
      });
    });

    audienceAxisNodes.forEach(function (axisNode) {
      axisNode.addEventListener('click', function () {
        var targetId = axisNode.getAttribute('data-target');
        if (targetId) setAudienceTrajectory(targetId);
      });
    });

    // Initialize with default selected
    setAudienceTrajectory('aud-tab-founder');
  }

  /* --------------------------------------------------------------------------
     02b — AUDIENCE: REVEAL, CURSOR DRIFT, MAGNETIC CTA, MOBILE ORDER
     -------------------------------------------------------------------------- */
  var audienceSection = page.querySelector('#audience');
  if (audienceSection && audiencePillars.length) {

    /* Scroll entrance reveal */
    var revealEls = audienceSection.querySelectorAll('.ins-aud-reveal');
    audienceSection.classList.add('ins-aud-js');
    if (!reduceMotion && 'IntersectionObserver' in window) {
      var audObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview');
            audObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach(function (el) { audObserver.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-inview'); });
    }

    /* Subtle cursor drift on each journey panel */
    if (!reduceMotion) {
      audiencePillars.forEach(function (pillar) {
        pillar.addEventListener('mousemove', function (e) {
          var r = pillar.getBoundingClientRect();
          var mx = ((e.clientX - r.left) / r.width - 0.5);
          var my = ((e.clientY - r.top) / r.height - 0.5);
          pillar.style.setProperty('--aud-mx', mx.toFixed(3));
          pillar.style.setProperty('--aud-my', my.toFixed(3));
        });
        pillar.addEventListener('mouseleave', function () {
          pillar.style.setProperty('--aud-mx', '0');
          pillar.style.setProperty('--aud-my', '0');
        });
      });
    }

    /* Magnetic cursor effect on the trajectory CTA */
    var trajCta = page.querySelector('#ins-traj-cta');
    if (trajCta && !reduceMotion) {
      trajCta.addEventListener('mousemove', function (e) {
        var r = trajCta.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.28;
        var y = (e.clientY - r.top - r.height / 2) * 0.4;
        trajCta.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      trajCta.addEventListener('mouseleave', function () {
        trajCta.style.transform = '';
      });
    }

    /* Keep the selected trajectory panel directly below the active journey on mobile */
    var trajPanel = page.querySelector('#aud-panel-founder');
    var trajHome = trajPanel ? trajPanel.parentNode : null;
    var trajHomeNext = trajPanel ? trajPanel.nextSibling : null;
    var mobileMq = window.matchMedia('(max-width: 767px)');

    function placeTrajectoryPanel() {
      if (!trajPanel || !trajHome) return;
      if (mobileMq.matches) {
        var active = audienceSection.querySelector('.ins-aud-pillar.is-selected');
        if (active && active.parentNode && active.nextSibling !== trajPanel) {
          active.parentNode.insertBefore(trajPanel, active.nextSibling);
        }
      } else if (trajPanel.parentNode !== trajHome) {
        trajHome.insertBefore(trajPanel, trajHomeNext);
      }
    }

    var baseSetAudienceTrajectory = setAudienceTrajectory;
    setAudienceTrajectory = function (tabId) {
      baseSetAudienceTrajectory(tabId);
      placeTrajectoryPanel();
    };

    if (mobileMq.addEventListener) mobileMq.addEventListener('change', placeTrajectoryPanel);
    else if (mobileMq.addListener) mobileMq.addListener(placeTrajectoryPanel);

    placeTrajectoryPanel();
  }

  /* --------------------------------------------------------------------------
     03 — HORIZONTAL VENTURE JOURNEY MAP PROGRESSION
     -------------------------------------------------------------------------- */
  var stageTabs = page.querySelectorAll('.ins-stage-node');
  var stageBlocks = page.querySelectorAll('.ins-map-stage-block');
  var journeyProgressBar = page.querySelector('#ins-journey-progress');
  var ambientVjGlow = page.querySelector('#ins-vj-glow');
  var journeySection = page.querySelector('#journey-navigator');

  var stageOrder = ['discover', 'validate', 'build', 'launch', 'grow', 'ecosystem'];

  function selectStage(stageKey) {
    var stageIdx = stageOrder.indexOf(stageKey);
    if (stageIdx === -1) stageIdx = 0;

    stageTabs.forEach(function (tab, idx) {
      var matches = tab.getAttribute('data-stage') === stageKey;
      tab.classList.toggle('is-active', matches);
      tab.setAttribute('aria-selected', matches ? 'true' : 'false');
    });

    stageBlocks.forEach(function (block) {
      var matches = block.getAttribute('data-stage-block') === stageKey;
      block.classList.toggle('is-visible', matches);
    });

    // Update connecting progress bar width (from center of node 0 to center of current node)
    if (journeyProgressBar && stageTabs.length > 1) {
      var totalSteps = stageTabs.length;
      var stepRatio = stageIdx / (totalSteps - 1);
      // Map to 8% -> 92% to align with node centers
      var pct = 8 + stepRatio * 84;
      journeyProgressBar.style.width = pct + '%';
    }

    // Move ambient radial light directly behind active node
    if (ambientVjGlow && stageTabs[stageIdx]) {
      var activeTab = stageTabs[stageIdx];
      var centerPos = activeTab.offsetLeft + (activeTab.offsetWidth / 2);
      ambientVjGlow.style.left = centerPos + 'px';
    }
  }

  // Expose global helper for cross-section interactions
  window._insSelectStage = selectStage;

  if (stageTabs.length) {
    stageTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var stage = tab.getAttribute('data-stage');
        selectStage(stage);
      });
      tab.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectStage(tab.getAttribute('data-stage'));
        }
      });

      // Subtle magnetic hover feel for desktop pointers
      if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        tab.addEventListener('mousemove', function (e) {
          var rect = tab.getBoundingClientRect();
          var relX = (e.clientX - rect.left - rect.width / 2) * 0.12;
          var relY = (e.clientY - rect.top - rect.height / 2) * 0.12;
          tab.style.transform = 'translate(' + relX + 'px, ' + (relY - 3) + 'px)';
        });
        tab.addEventListener('mouseleave', function () {
          tab.style.transform = '';
        });
      }
    });

    // Scroll-triggered viewport entrance sequence
    if (journeySection && 'IntersectionObserver' in window && !reduceMotion) {
      var vjObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            journeySection.classList.add('is-entered');
            vjObserver.unobserve(journeySection);
          }
        });
      }, { threshold: 0.15 });
      vjObserver.observe(journeySection);
    } else if (journeySection) {
      journeySection.classList.add('is-entered');
    }

    // Initialize progress bar and glow position
    window.requestAnimationFrame(function () {
      selectStage('discover');
    });
  }

  // Connect stage block "Match with Library" shortcuts
  page.addEventListener('click', function (e) {
    var bridgeLink = e.target.closest('[data-jump-stage]');
    if (bridgeLink) {
      e.preventDefault();
      var stageTag = bridgeLink.getAttribute('data-jump-stage');
      filterLibraryByStage(stageTag);
      var libSec = document.querySelector('#library');
      if (libSec) libSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  /* --------------------------------------------------------------------------
     05 — RESOURCE LIBRARY: SEARCH, FILTERS, INTENT, GROUPS & DOC PREVIEW
     -------------------------------------------------------------------------- */
  var librarySection = page.querySelector('#library');
  var searchInput = page.querySelector('#ins-lib-search');
  var searchClearBtn = page.querySelector('#ins-search-clear');
  var formatChips = page.querySelectorAll('.ins-chip');
  var stageChips = page.querySelectorAll('.ins-stage-chip');
  var intentChips = page.querySelectorAll('.ins-intent-chip');
  var archiveEntries = Array.prototype.slice.call(page.querySelectorAll('.ins-archive-entry'));
  var libraryGroups = Array.prototype.slice.call(page.querySelectorAll('.ins-lib-group'));
  var emptyNotice = page.querySelector('#ins-lib-empty');
  var resetFiltersBtn = page.querySelector('#ins-reset-filters');
  var counterDisplay = page.querySelector('#ins-lib-count');

  var activeFormat = 'all';
  var activeStage = 'all';
  var activeIntent = 'all';

  // Intent → phase group mapping
  var INTENT_GROUPS = {
    problem: 'discover',
    validate: 'validate',
    mvp: 'build',
    customers: 'launch',
    pitch: 'launch',
    grow: 'grow'
  };

  function entryGroup(entry) {
    var group = entry.closest('.ins-lib-group');
    return group ? (group.getAttribute('data-phase-group') || '') : '';
  }

  var lastCount = archiveEntries.length;

  function animateCounter(value) {
    if (!counterDisplay) return;
    if (value === lastCount) return;
    lastCount = value;
    counterDisplay.classList.add('is-tick');
    window.setTimeout(function () {
      counterDisplay.textContent = value;
      counterDisplay.classList.remove('is-tick');
    }, 140);
  }

  function applyLibraryFiltering() {
    var query = (searchInput ? searchInput.value : '').trim().toLowerCase();
    var matchCount = 0;

    if (searchClearBtn) {
      searchClearBtn.hidden = !query;
    }

    archiveEntries.forEach(function (entry) {
      var entryTitle = (entry.getAttribute('data-title') || '').toLowerCase();
      var entryCat = entry.getAttribute('data-cat') || '';
      var entryFormat = entry.getAttribute('data-format') || '';
      var entryDescEl = entry.querySelector('.ins-archive-desc');
      var entryDesc = (entryDescEl ? entryDescEl.textContent : '').toLowerCase();

      var formatMatch = activeFormat === 'all' || entryFormat.toLowerCase() === activeFormat.toLowerCase();
      var stageMatch = activeStage === 'all' || entryCat.toLowerCase() === activeStage.toLowerCase();
      var intentMatch = activeIntent === 'all' || entryGroup(entry) === INTENT_GROUPS[activeIntent];
      var queryMatch = !query || entryTitle.indexOf(query) !== -1 || entryDesc.indexOf(query) !== -1;

      var isVisible = formatMatch && stageMatch && intentMatch && queryMatch;
      entry.hidden = !isVisible;
      if (isVisible) matchCount++;
    });

    // Auto-hide phase groups that have no visible rows
    libraryGroups.forEach(function (group) {
      var hasVisible = group.querySelectorAll('.ins-archive-entry:not([hidden])').length > 0;
      group.classList.toggle('is-hidden', !hasVisible);
    });

    animateCounter(matchCount);

    if (emptyNotice) {
      emptyNotice.hidden = matchCount > 0;
    }
  }

  // Stage and intent act as a single "focus" so they never conflict
  function setLibraryFocus(focus) {
    if (focus === 'intent') {
      activeStage = 'all';
      stageChips.forEach(function (c) {
        c.classList.toggle('is-selected', (c.getAttribute('data-stage-filter') || '').toLowerCase() === 'all');
      });
    } else if (focus === 'stage') {
      activeIntent = 'all';
      intentChips.forEach(function (c) { c.classList.remove('is-active'); });
    }
  }

  function filterLibraryByStage(stageName) {
    activeStage = stageName || 'all';
    stageChips.forEach(function (c) {
      var isTarget = (c.getAttribute('data-stage-filter') || '').toLowerCase() === activeStage.toLowerCase();
      c.classList.toggle('is-selected', isTarget);
    });
    setLibraryFocus('stage');
    applyLibraryFiltering();
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
        setLibraryFocus('stage');
        applyLibraryFiltering();
      });
    });
  }

  if (intentChips.length) {
    intentChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var wasActive = chip.classList.contains('is-active');
        intentChips.forEach(function (c) { c.classList.remove('is-active'); });
        if (wasActive) {
          activeIntent = 'all';
        } else {
          chip.classList.add('is-active');
          activeIntent = chip.getAttribute('data-intent') || 'all';
        }
        setLibraryFocus('intent');
        applyLibraryFiltering();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyLibraryFiltering);
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', function () {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      applyLibraryFiltering();
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', function () {
      activeFormat = 'all';
      activeStage = 'all';
      activeIntent = 'all';
      if (searchInput) searchInput.value = '';
      formatChips.forEach(function (c) {
        c.classList.toggle('is-selected', c.getAttribute('data-filter') === 'all');
      });
      stageChips.forEach(function (c) {
        c.classList.toggle('is-selected', c.getAttribute('data-stage-filter') === 'all');
      });
      intentChips.forEach(function (c) { c.classList.remove('is-active'); });
      applyLibraryFiltering();
    });
  }

  // Empty-state suggestion terms
  page.querySelectorAll('.ins-empty-term').forEach(function (term) {
    term.addEventListener('click', function () {
      if (!searchInput) return;
      searchInput.value = term.getAttribute('data-empty-term') || '';
      activeFormat = 'all';
      activeStage = 'all';
      activeIntent = 'all';
      formatChips.forEach(function (c) {
        c.classList.toggle('is-selected', c.getAttribute('data-filter') === 'all');
      });
      stageChips.forEach(function (c) {
        c.classList.toggle('is-selected', c.getAttribute('data-stage-filter') === 'all');
      });
      intentChips.forEach(function (c) { c.classList.remove('is-active'); });
      applyLibraryFiltering();
      searchInput.focus();
    });
  });

  // Row click trigger for archive entries
  archiveEntries.forEach(function (entry) {
    entry.style.cursor = 'pointer';
    entry.addEventListener('click', function (e) {
      // If clicked the download button, let the delegation handle it
      if (e.target.closest('.ins-archive-btn')) return;
      var btn = entry.querySelector('.ins-archive-btn');
      if (btn && btn.dataset && btn.dataset.title) {
        openResourceModal(btn.dataset);
      }
    });
  });

  /* ── Cursor-follow document preview ── */
  var docPreview = page.querySelector('.ins-doc-preview');
  var docPreviewInner = docPreview ? docPreview.querySelector('.ins-doc-preview-inner') : null;

  if (docPreview && docPreviewInner && !reduceMotion && window.matchMedia('(hover: hover) and (min-width: 768px)').matches) {
    var renderDocPreview = function (entry) {
      var titleEl = entry.querySelector('.ins-archive-title');
      var stageEl = entry.querySelector('.ins-badge-tag--stage');
      var formatEl = entry.querySelector('.ins-badge-tag--format');
      var numEl = entry.querySelector('.ins-archive-num');
      var title = titleEl ? titleEl.textContent : 'Resource';
      var stage = stageEl ? stageEl.textContent : '';
      var format = formatEl ? formatEl.textContent : '';
      var num = numEl ? numEl.textContent : '';
      docPreviewInner.innerHTML =
        '<span class="ins-docp-tab">SHEET ' + num + '</span>' +
        '<div class="ins-docp-title">' + title + '</div>' +
        '<div class="ins-docp-meta">' + stage + ' &middot; ' + format + '</div>' +
        '<div class="ins-docp-lines"><span></span><span></span><span></span><span></span><span></span></div>' +
        '<div class="ins-docp-grid"><span></span><span></span></div>';
    };

    var moveDocPreview = function (e) {
      docPreview.style.setProperty('--doc-x', e.clientX + 'px');
      docPreview.style.setProperty('--doc-y', e.clientY + 'px');
    };

    archiveEntries.forEach(function (entry) {
      entry.addEventListener('mouseenter', function () {
        if (entry.hidden) return;
        renderDocPreview(entry);
        docPreview.classList.add('is-on');
      });
      entry.addEventListener('mousemove', moveDocPreview);
      entry.addEventListener('mouseleave', function () {
        docPreview.classList.remove('is-on');
      });
    });
  }

  /* ── Library scroll reveal ── */
  if (librarySection) {
    librarySection.classList.add('ins-lib-js');
    var libRevealEls = librarySection.querySelectorAll('.ins-aud-reveal');
    if (!reduceMotion && 'IntersectionObserver' in window) {
      var libRevealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview');
            libRevealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
      libRevealEls.forEach(function (el) { libRevealObserver.observe(el); });
    } else {
      libRevealEls.forEach(function (el) { el.classList.add('is-inview'); });
    }
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
