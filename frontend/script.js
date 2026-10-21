// script.js
document.addEventListener("DOMContentLoaded", () => {
    // Magnetic Button Effect
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // Particle Animation along SVG Path
    const path = document.getElementById('journeyPath');
    const particles = document.querySelectorAll('.particle');
    
    if (path && particles.length > 0) {
        const pathLength = path.getTotalLength();
        
        particles.forEach((particle, index) => {
            let progress = (index * (100 / particles.length));
            let speed = 0.1 + (Math.random() * 0.05);
            
            function animateParticle() {
                progress += speed;
                if (progress > 100) progress = 0;
                
                const point = path.getPointAtLength((progress / 100) * pathLength);
                particle.setAttribute('cx', point.x);
                particle.setAttribute('cy', point.y);
                
                requestAnimationFrame(animateParticle);
            }
            
            animateParticle();
        });
    }

    // Glass Card Hover Effects interacting with path
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (path) {
                path.style.strokeDasharray = 'none';
                path.style.strokeWidth = '3';
                path.style.filter = 'url(#glow)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (path) {
                path.style.strokeDasharray = '8,8';
                path.style.strokeWidth = '2';
            }
        });
    });

    // Horizontal Journey Animation
    const jPath = document.getElementById('jPath');
    const jParticle = document.querySelector('.j-particle');
    const jSvg = document.querySelector('.journey-path-svg');
    
    if (jPath && jParticle && jSvg) {
        const pathLength = jPath.getTotalLength();
        let progress = 0;
        let rafId = null;
        let isRunning = false;
        
        function animateJParticle() {
            progress += 0.2;
            if (progress > 100) progress = 0;
            
            const point = jPath.getPointAtLength((progress / 100) * pathLength);
            jParticle.setAttribute('cx', point.x);
            jParticle.setAttribute('cy', point.y);
            
            rafId = requestAnimationFrame(animateJParticle);
        }
        
        if ('IntersectionObserver' in window) {
            const jObserver = new IntersectionObserver(([entry]) => {
                const isVisible = entry.isIntersecting && window.getComputedStyle(jSvg).display !== 'none';
                if (isVisible) {
                    if (!isRunning) {
                        isRunning = true;
                        animateJParticle();
                    }
                } else {
                    if (isRunning) {
                        isRunning = false;
                        cancelAnimationFrame(rafId);
                    }
                }
            }, { threshold: 0.05 });
            jObserver.observe(jSvg);
        } else {
            animateJParticle();
        }
    }
    
    const jNodes = document.querySelectorAll('.j-node');
    jNodes.forEach(node => {
        // Expand on click
        node.addEventListener('click', () => {
            jNodes.forEach(n => {
                if (n !== node) n.classList.remove('expanded');
            });
            node.classList.toggle('expanded');
        });
        
        node.addEventListener('mouseenter', () => {
            if (jPath) {
                jPath.style.strokeDasharray = 'none';
                jPath.style.strokeWidth = '3';
                jPath.style.filter = 'url(#jGlow)';
            }
        });
        
        node.addEventListener('mouseleave', () => {
            if (jPath) {
                jPath.style.strokeDasharray = '6,6';
                jPath.style.strokeWidth = '2';
                jPath.style.filter = 'none';
            }
        });
    });
});

/* ----------------------------------------------
   DREAMERS LAB  Interactive JS
---------------------------------------------- */
(function () {
  'use strict';

  /* -- Constellation canvas -- */
  const canvas = document.querySelector('.dl-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    const NUM = 90;

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function initStars() {
      stars = [];
      for (let i = 0; i < NUM; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.1 + 0.2,
          a: Math.random(),
          speed: Math.random() * 0.4 + 0.1,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function drawStars(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        const alpha = s.a * (0.5 + 0.5 * Math.sin(t * 0.001 * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(246,243,236,${alpha.toFixed(2)})`;
        ctx.fill();
      });
    }

    let raf = null;
    let isCanvasRunning = false;
    function loop(t) {
      drawStars(t);
      raf = requestAnimationFrame(loop);
    }

    const ro = new ResizeObserver(() => { resize(); initStars(); });
    ro.observe(canvas);
    resize(); initStars();

    if ('IntersectionObserver' in window) {
      const canvasObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          if (!isCanvasRunning) {
            isCanvasRunning = true;
            loop(0);
          }
        } else {
          if (isCanvasRunning) {
            isCanvasRunning = false;
            if (raf) cancelAnimationFrame(raf);
          }
        }
      }, { threshold: 0.05 });
      canvasObserver.observe(canvas);
    } else {
      loop(0);
    }
  }

  /* -- Entrance animation -- */
  const section = document.querySelector('.dl-section');
  if (section) {
    const pref = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!pref) {
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add('dl-visible');
          io.disconnect();
        }
      }, { threshold: 0.08 });
      io.observe(section);
    }
  }

  /* -- Stage card expand / collapse -- */
  const cards = document.querySelectorAll('.dl-card');
  cards.forEach(card => {
    const detailId = card.getAttribute('aria-controls');
    const detail   = document.getElementById(detailId);
    const closeBtn = detail ? detail.querySelector('.dl-detail-close') : null;

    function openCard() {
      // close others
      cards.forEach(c => {
        if (c !== card) {
          c.setAttribute('aria-expanded', 'false');
          const d = document.getElementById(c.getAttribute('aria-controls'));
          if (d) d.hidden = true;
        }
      });
      const isOpen = card.getAttribute('aria-expanded') === 'true';
      card.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      if (detail) detail.hidden = isOpen;
    }

    card.addEventListener('click', openCard);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCard(); }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', e => {
        e.stopPropagation();
        card.setAttribute('aria-expanded', 'false');
        if (detail) detail.hidden = true;
      });
    }
  });

  /* -- Smooth scroll CTA -- */
  document.querySelectorAll('a[href^="#dl-"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.getElementById(a.getAttribute('href').slice(1));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();





/* ==========================================================================
   HOW BUILDING DREAMS WORKS - Interactive Stepper Logic
   ========================================================================== */
(function initDarkTimeline() {
    const stagesData = [
        {
            stepNum: "01",
            name: "Discover",
            tagline: '"Spotting the invisible spark."',
            desc: "Understand yourself, identify real problems and discover high-potential opportunities in the world around you.",
            milestone: "Problem Opportunity Statement",
            icon: "💡",
            activities: ["Self-awareness & Passion Audit", "Real-world Problem Hunting", "Market Observation & Insights"],
            mindset: "From passive observer to active problem solver.",
            accent: "#ff6b00"
        },
        {
            stepNum: "02",
            name: "Define",
            tagline: '"Focusing chaos into clarity."',
            desc: "Turn a broad idea into a clear, sharp problem worth solving with a validated target audience.",
            milestone: "Core Problem Canvas",
            icon: "🎯",
            activities: ["Target Persona Drafting", "Value Proposition Mapping", "Core Problem Definition"],
            mindset: "Focusing on the problem, not just the solution.",
            accent: "#06b6d4"
        },
        {
            stepNum: "03",
            name: "Validate",
            tagline: '"Replacing guesswork with real evidence."',
            desc: "Talk to real potential customers and test your core assumptions before investing time in building.",
            milestone: "Validation Scorecard & Insights Report",
            icon: "🔬",
            activities: ["Customer Interview Sprints", "Landing Page Smoke Tests", "Willingness-to-Pay Testing"],
            mindset: "Falling in love with truth over assumptions.",
            accent: "#3b82f6"
        },
        {
            stepNum: "04",
            name: "Build",
            tagline: '"From concept to tangible reality."',
            desc: "Create the simplest, fastest version of your solution that delivers real core value.",
            milestone: "Working V1 Prototype / MVP",
            icon: "🛠️",
            activities: ["Rapid No-code/Code Prototyping", "Minimum Viable Product (MVP)", "Core User Loop Design"],
            mindset: "Speed of execution beats perfection.",
            accent: "#8b5cf6"
        },
        {
            stepNum: "05",
            name: "Test",
            tagline: '"Measuring real reactions in the wild."',
            desc: "Put your prototype directly in the hands of real users and collect unfiltered feedback.",
            milestone: "Usability Audit & Product Refinements",
            icon: "🧪",
            activities: ["User Usability Sessions", "Friction & Drop-off Analysis", "Iterative Feedback Loops"],
            mindset: "Feedback is food for growth.",
            accent: "#ec4899"
        },
        {
            stepNum: "06",
            name: "Launch",
            tagline: '"Opening doors to your first believers."',
            desc: "Find your first users, acquire early customers, and gain initial momentum in the market.",
            milestone: "First 100 Active Users & Initial Traction",
            icon: "🚀",
            activities: ["Early Adopter Onboarding", "Product Launch Campaign", "Initial Channel Experimentation"],
            mindset: "Shipping is where real learning begins.",
            accent: "#f59e0b"
        },
        {
            stepNum: "07",
            name: "Grow",
            tagline: '"Unlocking momentum and scale."',
            desc: "Build your dream team, optimize venture economics, and prepare for scale or funding.",
            milestone: "Scalable Growth & Venture Roadmap",
            icon: "🌱",
            activities: ["Unit Economics & Funnel Optimization", "Team & Co-founder Recruitment", "Investor & Partner Pitching"],
            mindset: "Building an enduring organization.",
            accent: "#10b981"
        }
    ];

    let currentStep = 0;
    let autoplayTimer = null;
    let isAutoplay = true; // Enabled by default as requested

    function startAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
        autoplayTimer = setInterval(() => {
            currentStep = (currentStep + 1) % stagesData.length;
            setStage(currentStep);
        }, 3000); // 3 seconds timer
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    function resetAutoplayTimer() {
        if (isAutoplay) {
            startAutoplay();
        }
    }

    function setStage(index) {
        if (index < 0 || index >= stagesData.length) return;
        currentStep = index;
        const data = stagesData[currentStep];

        // Progress bar width
        const progressEl = document.getElementById("ndStepperProgress");
        if (progressEl) {
            const pct = (currentStep / (stagesData.length - 1)) * 100;
            progressEl.style.width = `${pct}%`;
        }

        // Stepper tabs active class
        const tabs = document.querySelectorAll("#ndStepperSteps .nd-step-tab");
        tabs.forEach((tab, idx) => {
            if (idx === currentStep) tab.classList.add("active");
            else tab.classList.remove("active");
        });

        // Showcase card update with animation
        const showcase = document.getElementById("ndStageShowcase");
        if (showcase) {
            showcase.style.opacity = "0.75";
            showcase.style.transform = "translateY(4px)";
            setTimeout(() => {
                const counter = document.getElementById("ndStageCounter");
                const tagline = document.getElementById("ndStageTagline");
                const title = document.getElementById("ndStageTitle");
                const desc = document.getElementById("ndStageDesc");
                const delivVal = document.getElementById("ndStageDeliverable");
                const delivIcon = document.querySelector(".nd-deliv-icon");
                const actList = document.getElementById("ndStageActivities");
                const mindset = document.getElementById("ndStageMindset");

                if (counter) counter.textContent = `STAGE ${data.stepNum} OF 07`;
                if (tagline) tagline.textContent = data.tagline;
                if (title) title.textContent = `${data.stepNum}. ${data.name}`;
                if (desc) desc.textContent = data.desc;
                if (delivVal) delivVal.textContent = data.milestone;
                if (delivIcon) delivIcon.textContent = data.icon;

                if (actList) {
                    actList.innerHTML = data.activities.map(act => `
                        <li><span class="nd-act-icon">✦</span> ${act}</li>
                    `).join('');
                }

                if (mindset) mindset.textContent = data.mindset;

                showcase.style.opacity = "1";
                showcase.style.transform = "translateY(0)";
            }, 120);
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        setStage(0);

        // Bind Stepper Tabs
        const tabs = document.querySelectorAll("#ndStepperSteps .nd-step-tab");
        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                const step = parseInt(tab.getAttribute("data-step"), 10);
                setStage(step);
                resetAutoplayTimer();
            });
        });

        // Prev & Next Buttons
        const prevBtn = document.getElementById("ndPrevStep");
        const nextBtn = document.getElementById("ndNextStep");

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                const target = (currentStep - 1 + stagesData.length) % stagesData.length;
                setStage(target);
                resetAutoplayTimer();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                const target = (currentStep + 1) % stagesData.length;
                setStage(target);
                resetAutoplayTimer();
            });
        }

        // Autoplay button toggle
        const autoBtn = document.getElementById("ndTimelineAutoplay");
        if (autoBtn) {
            autoBtn.classList.add("active");
            if (autoBtn.querySelector(".nd-play-text")) autoBtn.querySelector(".nd-play-text").textContent = "Pause Journey";
            if (autoBtn.querySelector(".nd-play-icon")) autoBtn.querySelector(".nd-play-icon").textContent = "⏸";

            autoBtn.addEventListener("click", () => {
                isAutoplay = !isAutoplay;
                if (isAutoplay) {
                    autoBtn.classList.add("active");
                    if (autoBtn.querySelector(".nd-play-text")) autoBtn.querySelector(".nd-play-text").textContent = "Pause Journey";
                    if (autoBtn.querySelector(".nd-play-icon")) autoBtn.querySelector(".nd-play-icon").textContent = "⏸";
                    startAutoplay();
                } else {
                    autoBtn.classList.remove("active");
                    if (autoBtn.querySelector(".nd-play-text")) autoBtn.querySelector(".nd-play-text").textContent = "Auto Play Journey";
                    if (autoBtn.querySelector(".nd-play-icon")) autoBtn.querySelector(".nd-play-icon").textContent = "▶";
                    stopAutoplay();
                }
            });
        }

        // Start 3-second auto-play timer by default
        startAutoplay();
    });
})();



// Dreamers Lab Movable Strip Controls
document.addEventListener("DOMContentLoaded", () => {
  const prevBtn = document.getElementById("dlStripPrev");
  const nextBtn = document.getElementById("dlStripNext");
  const grid = document.querySelector(".dl-grid");

  if (prevBtn && grid) {
    prevBtn.addEventListener("click", () => {
      grid.scrollBy({ left: -370, behavior: "smooth" });
    });
  }

  if (nextBtn && grid) {
    nextBtn.addEventListener("click", () => {
      grid.scrollBy({ left: 370, behavior: "smooth" });
    });
  }
});



// Dreamers Lab Movable Strip & Track Bar Synchronization
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".dl-grid");
  const prevBtn = document.getElementById("dlTrackPrev");
  const nextBtn = document.getElementById("dlTrackNext");
  const fill = document.getElementById("dlTrackFill");

  if (!grid) return;

  function updateTrackFill() {
    if (!fill) return;
    const scrollLeft = grid.scrollLeft;
    const maxScroll = grid.scrollWidth - grid.clientWidth;
    if (maxScroll <= 0) {
      fill.style.width = "100%";
      fill.style.left = "0%";
      return;
    }
    const scrollPct = scrollLeft / maxScroll;
    const thumbWidthPct = (grid.clientWidth / grid.scrollWidth) * 100;
    const finalWidth = Math.max(thumbWidthPct, 20);
    fill.style.width = `${finalWidth}%`;
    fill.style.left = `${scrollPct * (100 - finalWidth)}%`;
  }

  grid.addEventListener("scroll", updateTrackFill);
  window.addEventListener("resize", updateTrackFill);
  setTimeout(updateTrackFill, 200);

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      grid.scrollBy({ left: -370, behavior: "smooth" });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      grid.scrollBy({ left: 370, behavior: "smooth" });
    });
  }
});


/* ==========================================================================
   FAQ — Premium Editorial Accordion
   ========================================================================== */
(function initFaq() {
    function setupFaq() {
        const roots = Array.from(document.querySelectorAll('.bd-faq'));
        if (!roots.length) return;

        roots.forEach(root => {
            const items = Array.from(root.querySelectorAll('.bd-faq-item'));
            const buttons = Array.from(root.querySelectorAll('.bd-faq-q'));
            if (!items.length || !buttons.length) return;

            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            function setOpen(item, open) {
                const btn = item.querySelector('.bd-faq-q');
                const panel = item.querySelector('.bd-faq-a');
                item.classList.toggle('is-open', open);
                if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
                if (panel) panel.setAttribute('aria-hidden', open ? 'false' : 'true');
            }

            function toggle(item) {
                if (!item) return;
                const willOpen = !item.classList.contains('is-open');
                items.forEach(it => setOpen(it, false));
                if (willOpen) setOpen(item, true);
            }

            // Make the DOM state the single source of truth on load.
            items.forEach(it => setOpen(it, it.classList.contains('is-open')));

            buttons.forEach((btn, i) => {
                btn.addEventListener('click', () => toggle(btn.closest('.bd-faq-item')));

                btn.addEventListener('keydown', e => {
                    let idx = null;
                    if (e.key === 'ArrowDown') idx = (i + 1) % buttons.length;
                    else if (e.key === 'ArrowUp') idx = (i - 1 + buttons.length) % buttons.length;
                    else if (e.key === 'Home') idx = 0;
                    else if (e.key === 'End') idx = buttons.length - 1;
                    if (idx === null) return;
                    e.preventDefault();
                    buttons[idx].focus();
                });
            });

            /* Instant visibility for FAQ items — no delayed entrance blocking */
            root.classList.add('is-visible');

            /* Functional CTA — smooth scroll to the existing contact CTA section */
            const cta = root.querySelector('.bd-faq-cta');
            if (cta) {
                cta.addEventListener('click', e => {
                    const href = cta.getAttribute('href') || '';
                    if (!href.startsWith('#')) return;
                    const target = document.getElementById(href.slice(1));
                    if (!target) return;
                    e.preventDefault();
                    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
                });
            }
        });
    }

    // script.js is loaded before the FAQ markup, so defer until the DOM exists.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupFaq, { once: true });
    } else {
        setupFaq();
    }
})();
