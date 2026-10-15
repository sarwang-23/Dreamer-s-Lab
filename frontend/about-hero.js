/* ==========================================================================
   ABOUT HERO — Ultra-Premium Interactive Storytelling & Physics Engine
   Awwwards / Apple / Stripe Level Interaction
   ========================================================================== */
(function () {
  'use strict';

  var hero = document.querySelector('.ab-hero');
  if (!hero) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var visual = hero.querySelector('.ab-visual');

  /* ── Interactive Venture Stage Switcher ────────────────────────────── */
  var STAGES = {
    discover: {
      pill: 'STAGE 01 · DISCOVER',
      metric: '• Validation Track',
      title: 'Turn raw curiosity into validated problems',
      desc: 'Talk to real customers, test market viability, and refine problem statements before building.',
      tags: ['Customer Discovery', 'Problem Framing', 'Market Sizing']
    },
    build: {
      pill: 'STAGE 02 · BUILD',
      metric: '• Sprint Track',
      title: 'Prototype rapidly with hands-on mentor sprints',
      desc: 'Build functional MVPs, iterate on early user feedback, and test core value propositions.',
      tags: ['MVP Prototyping', 'User Testing', 'Mentor Feedback', 'Tech & No-Code']
    },
    launch: {
      pill: 'STAGE 03 · LAUNCH',
      metric: '• Venture Track',
      title: 'Roll out your venture to real users & institutional backing',
      desc: 'Gain market traction, pitch on Demo Day, and connect with seed accelerators & grants.',
      tags: ['Demo Day', 'Pilot Customers', 'Institutional Grants', 'Pitch Deck']
    }
  };

  function initStageSwitcher() {
    var nodes = hero.querySelectorAll('.ab-node');
    var card = document.getElementById('ab-stage-card');
    var wrapper = hero.querySelector('.ab-stage-wrapper');
    var stage = hero.querySelector('.ab-stage');
    if (!nodes.length || !card) return;

    var pill = document.getElementById('ab-stage-pill');
    var metric = document.getElementById('ab-stage-metric');
    var title = document.getElementById('ab-stage-title');
    var desc = document.getElementById('ab-stage-desc');
    var tags = document.getElementById('ab-stage-tags');

    var hideTimer = null;

    function openStage(stageKey) {
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }

      var data = STAGES[stageKey];
      if (!data) return;

      nodes.forEach(function (node) {
        var match = node.dataset.stage === stageKey;
        node.classList.toggle('is-active', match);
        node.setAttribute('aria-pressed', String(match));
      });

      if (stage) {
        stage.classList.remove('has-active-discover', 'has-active-build', 'has-active-launch');
        stage.classList.add('has-active-' + stageKey);
      }

      if (pill) pill.textContent = data.pill;
      if (metric) metric.textContent = data.metric;
      if (title) title.textContent = data.title;
      if (desc) desc.textContent = data.desc;
      if (tags) {
        tags.innerHTML = data.tags.map(function (t) {
          return '<span class="ab-tag">' + t + '</span>';
        }).join('');
      }

      if (wrapper) wrapper.classList.add('has-active');
      card.classList.add('is-open');
    }

    function scheduleClose() {
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(function () {
        if (wrapper) wrapper.classList.remove('has-active');
        card.classList.remove('is-open');
        if (stage) {
          stage.classList.remove('has-active-discover', 'has-active-build', 'has-active-launch');
        }
        nodes.forEach(function (node) {
          node.classList.remove('is-active');
          node.setAttribute('aria-pressed', 'false');
        });
      }, 180);
    }

    nodes.forEach(function (node) {
      node.addEventListener('mouseenter', function () {
        openStage(node.dataset.stage);
      });
      node.addEventListener('mouseleave', function () {
        scheduleClose();
      });
      node.addEventListener('click', function (e) {
        e.preventDefault();
        openStage(node.dataset.stage);
      });
      node.addEventListener('focus', function () {
        openStage(node.dataset.stage);
      });
      node.addEventListener('blur', function () {
        scheduleClose();
      });
    });

    card.addEventListener('mouseenter', function () {
      if (hideTimer) {
        clearTimeout(hideTimer);
        hideTimer = null;
      }
    });
    card.addEventListener('mouseleave', function () {
      scheduleClose();
    });
  }

  /* ── Interactive Particle Constellation Canvas ─────────────────────── */
  function initCanvas() {
    if (!visual) return;
    var canvas = visual.querySelector('.ab-visual-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var w = 1;
    var h = 1;
    var raf = 0;
    var running = false;
    var particles = [];
    var pointer = { x: -9999, y: -9999, active: false };

    function size() {
      var rect = visual.getBoundingClientRect();
      w = Math.max(1, rect.width + 60);
      h = Math.max(1, rect.height + 60);
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn() {
      var count = w < 480 ? 22 : w < 768 ? 36 : 52;
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.16,
          vy: (Math.random() - 0.5) * 0.16,
          r: 0.7 + Math.random() * 1.3,
          a: 0.18 + Math.random() * 0.45
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, w, h);
      var linkDist = w < 480 ? 80 : 110;
      var i, j, p;

      for (i = 0; i < particles.length; i++) {
        p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        if (pointer.active) {
          var pdx = p.x - pointer.x;
          var pdy = p.y - pointer.y;
          var pd2 = pdx * pdx + pdy * pdy;
          var pr = 100;
          if (pd2 < pr * pr) {
            var pd = Math.sqrt(pd2) || 1;
            var pf = (1 - pd / pr) * 0.8;
            p.x += (pdx / pd) * pf;
            p.y += (pdy / pd) * pf;
          }
        }
      }

      // Constellation connecting links between particles
      for (i = 0; i < particles.length; i++) {
        for (j = i + 1; j < particles.length; j++) {
          var a = particles[i];
          var b = particles[j];
          var dx = a.x - b.x;
          var dy = a.y - b.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < linkDist * linkDist) {
            var alpha = (1 - Math.sqrt(d2) / linkDist) * 0.14;
            ctx.strokeStyle = 'rgba(255, 126, 45, ' + alpha.toFixed(3) + ')';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Magnetic connection to cursor pointer
      if (pointer.active) {
        var lr = 120;
        for (i = 0; i < particles.length; i++) {
          p = particles[i];
          var ldx = p.x - pointer.x;
          var ldy = p.y - pointer.y;
          var ld2 = ldx * ldx + ldy * ldy;
          if (ld2 < lr * lr) {
            var la = (1 - Math.sqrt(ld2) / lr) * 0.28;
            ctx.strokeStyle = 'rgba(255, 107, 26, ' + la.toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pointer.x, pointer.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }
      }

      // Render glowing particle nodes
      for (i = 0; i < particles.length; i++) {
        p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 140, 58, ' + p.a.toFixed(3) + ')';
        ctx.fill();
      }
    }

    function loop() {
      step();
      raf = requestAnimationFrame(loop);
    }
    function start() {
      if (running || reduceMotion) return;
      running = true;
      loop();
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function toLocal(clientX, clientY) {
      var rect = visual.getBoundingClientRect();
      pointer.x = clientX - rect.left + 30;
      pointer.y = clientY - rect.top + 30;
      pointer.active = true;
    }

    visual.addEventListener('mousemove', function (e) {
      toLocal(e.clientX, e.clientY);
    });
    visual.addEventListener('mouseenter', function () {
      visual.classList.add('is-hot');
    });
    visual.addEventListener('mouseleave', function () {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
      visual.classList.remove('is-hot');
    });

    size();
    spawn();

    if (reduceMotion) {
      step();
      return;
    }

    if ('ResizeObserver' in window) {
      new ResizeObserver(function () {
        size();
        spawn();
        if (!running) step();
      }).observe(visual);
    } else {
      window.addEventListener('resize', function () {
        size();
        spawn();
      });
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) start();
          else stop();
        });
      }, { threshold: 0.05 }).observe(visual);
    } else {
      start();
    }
  }

  /* ── Smooth Cursor Parallax Physics ────────────────────────────────── */
  function initParallax() {
    if (reduceMotion) return;
    var tx = 0;
    var ty = 0;
    var cx = 0;
    var cy = 0;
    var active = false;

    function tick() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      hero.style.setProperty('--ab-px', cx.toFixed(4));
      hero.style.setProperty('--ab-py', cy.toFixed(4));
      if (Math.abs(tx - cx) > 0.0004 || Math.abs(ty - cy) > 0.0004) {
        requestAnimationFrame(tick);
      } else {
        active = false;
      }
    }

    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      tx = (e.clientX - rect.left) / rect.width - 0.5;
      ty = (e.clientY - rect.top) / rect.height - 0.5;
      if (!active) {
        active = true;
        requestAnimationFrame(tick);
      }
    });

    hero.addEventListener('mouseleave', function () {
      tx = 0;
      ty = 0;
      if (!active) {
        active = true;
        requestAnimationFrame(tick);
      }
    });
  }

  /* ── Magnetic Primary CTA Physics ──────────────────────────────────── */
  function initMagnetic() {
    if (reduceMotion) return;
    hero.querySelectorAll('[data-magnetic]').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var mx = e.clientX - (rect.left + rect.width / 2);
        var my = e.clientY - (rect.top + rect.height / 2);
        btn.style.setProperty('--ab-mx', (mx * 0.28).toFixed(1) + 'px');
        btn.style.setProperty('--ab-my', (my * 0.42).toFixed(1) + 'px');
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.setProperty('--ab-mx', '0px');
        btn.style.setProperty('--ab-my', '0px');
      });
    });
  }

  /* ── Micro Scroll Cue Fade ─────────────────────────────────────────── */
  function initCue() {
    var cue = hero.querySelector('.ab-scrollcue');
    if (!cue) return;
    var onScroll = function () {
      cue.style.opacity = window.scrollY > 80 ? '0' : '0.75';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  initStageSwitcher();
  initCanvas();
  initParallax();
  initMagnetic();
  initCue();
})();
