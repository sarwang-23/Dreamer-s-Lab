/* ==========================================================================
   Building Dreams — Closing CTA (reusable global component)
   Renders the signature "Your dream doesn't need to wait." section.
   Usage:
     <div data-closing-cta></div>              (auto-mounts on load)
   Options via data attributes on the mount node:
     data-cta-primary="student|founder|university"
   Programmatic:
     BuildingDreamsCTA.render({ primary: 'founder' })  -> HTMLElement
     BuildingDreamsCTA.mount(hostEl)
   ========================================================================== */
(function () {
    'use strict';

    var ARROW =
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" ' +
        'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
        '<line x1="5" y1="12" x2="18" y2="12"></line><polyline points="12 6 18 12 12 18"></polyline></svg>';

    var ICONS = {
        student:
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
            '<circle cx="12" cy="12" r="9"></circle>' +
            '<polygon points="15.6 8.4 13.1 13.1 8.4 15.6 10.9 10.9 15.6 8.4"></polygon></svg>',
        founder:
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
            '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9Z"></path>' +
            '<path d="M4 7.5 12 12l8-4.5"></path><path d="M12 12v9"></path></svg>',
        university:
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
            '<circle cx="12" cy="5" r="2.4"></circle><circle cx="5.5" cy="18.5" r="2.4"></circle>' +
            '<circle cx="18.5" cy="18.5" r="2.4"></circle>' +
            '<path d="M10.9 6.9 6.7 16.4M13.1 6.9l4.2 9.5M7.9 18.5h8.2"></path></svg>'
    };

    var PROGRAM_DESCRIPTIONS = {
        student: 'Chart your journey',
        founder: 'Build your venture',
        university: 'Create an ecosystem'
    };

    var BASE = '/';
    try {
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) {
            BASE = import.meta.env.BASE_URL;
        }
    } catch (e) {}

    function getUrl(path) {
        var b = (BASE || '/').replace(/\/+$/, '');
        var p = (path || '').replace(/^\/+/, '');
        return b ? (b + '/' + p) : ('/' + p);
    }

    var DEFAULT_ACTIONS = [
        { id: 'student', label: "I'm a Student", href: getUrl('dreamers-lab/') },
        { id: 'founder', label: "I'm a Founder", href: getUrl('student-entrepreneurs/') },
        { id: 'university', label: "I'm a University", href: getUrl('universities/') }
    ];

    var BG_SVG =
        '<svg class="bd-close-bg-svg" viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice" ' +
        'fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
        '<circle cx="1200" cy="120" r="380" stroke="#FF6835" stroke-opacity="0.06" stroke-width="1" stroke-dasharray="4 10"></circle>' +
        '<circle cx="1200" cy="120" r="240" stroke="#FF6835" stroke-opacity="0.05" stroke-width="0.8"></circle>' +
        '<circle cx="200" cy="660" r="320" stroke="#C8F050" stroke-opacity="0.05" stroke-width="1" stroke-dasharray="3 8"></circle>' +
        '<circle cx="720" cy="380" r="500" stroke="#ffffff" stroke-opacity="0.02" stroke-width="1"></circle>' +
        '<circle cx="180" cy="140" r="2.5" fill="#FF6835" opacity="0.55"></circle>' +
        '<circle cx="1330" cy="650" r="3" fill="#C8F050" opacity="0.40"></circle>' +
        '<circle cx="520" cy="80" r="2" fill="#ffffff" opacity="0.30"></circle>' +
        '<circle cx="980" cy="700" r="2.5" fill="#FF6835" opacity="0.35"></circle>' +
        '<circle cx="1250" cy="460" r="2" fill="#C8F050" opacity="0.28"></circle>' +
        '<circle cx="340" cy="280" r="1.8" fill="#ffffff" opacity="0.20"></circle>' +
        '<circle cx="860" cy="180" r="2.2" fill="#FF6835" opacity="0.22"></circle>' +
        '</svg>';

    var ORBS_HTML =
        '<div class="bd-close-orb bd-close-orb--orange" aria-hidden="true"></div>' +
        '<div class="bd-close-orb bd-close-orb--lime" aria-hidden="true"></div>' +
        '<div class="bd-close-orb bd-close-orb--blue" aria-hidden="true"></div>';

    var MOTIF_SVG =
        '<svg class="bd-close-motif-svg" viewBox="0 0 520 150" fill="none" ' +
        'xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
        '<ellipse cx="260" cy="75" rx="235" ry="55" stroke="#10483D" stroke-opacity="0.10" stroke-width="1" stroke-dasharray="4 8"></ellipse>' +
        '<ellipse cx="260" cy="75" rx="160" ry="88" stroke="#10483D" stroke-opacity="0.06" stroke-width="1" stroke-dasharray="3 9" transform="rotate(-18 260 75)"></ellipse>' +
        '<path class="bd-close-motif-path" pathLength="1" d="M14 118 C 130 116 170 46 286 50 C 372 53 432 74 498 44" ' +
        'stroke="#FF6835" stroke-opacity="0.85" stroke-width="2" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="0"></path>' +
        '<circle class="bd-close-motif-glow" cx="498" cy="44" r="16" fill="#FF6835" opacity="0.16"></circle>' +
        '<circle class="bd-close-motif-core" cx="498" cy="44" r="5" fill="#FF6835"></circle>' +
        '<circle cx="14" cy="118" r="4" fill="#10483D" opacity="0.5"></circle>' +
        '<circle cx="150" cy="92" r="2.5" fill="#82988E" opacity="0.6"></circle>' +
        '<circle cx="286" cy="50" r="3" fill="#10483D" opacity="0.45"></circle>' +
        '<circle cx="410" cy="68" r="2.5" fill="#D5F078"></circle>' +
        '<circle cx="498" cy="44" r="11" stroke="#FF6835" stroke-opacity="0.35" stroke-width="1" stroke-dasharray="2 4"></circle>' +
        '</svg>';

    function buildActions(primary, actionsList) {
        var actions = (Array.isArray(actionsList) && actionsList.length) ? actionsList : DEFAULT_ACTIONS;
        return actions.map(function (action) {
            var isPrimary = action.id === primary;
            var cls = 'bd-close-card' + (isPrimary ? ' bd-close-card--primary' : '');
            return (
                '<a class="' + cls + '" href="' + action.href + '" data-audience="' + action.id + '">' +
                '<span class="bd-close-card-icon" aria-hidden="true">' + (ICONS[action.id] || '') + '</span>' +
                '<span class="bd-close-card-body">' +
                '<span class="bd-close-card-label">' + action.label + '</span>' +
                '<span class="bd-close-card-note">' + (PROGRAM_DESCRIPTIONS[action.id] || '') + '</span>' +
                '</span>' +
                '<span class="bd-close-card-arrow" aria-hidden="true">' + ARROW + '</span>' +
                '</a>'
            );
        }).join('');
    }

    function render(options) {
        var opts = options || {};
        var primary = opts.primary || 'student';
        if (!PROGRAM_DESCRIPTIONS[primary]) primary = 'student';

        var section = document.createElement('section');
        section.className = 'bd-close';
        section.setAttribute('aria-labelledby', 'bd-close-title');
        section.innerHTML =
            '<div class="bd-close-bg" aria-hidden="true">' + BG_SVG + ORBS_HTML + '</div>' +
            '<div class="bd-close-inner">' +
            '<div class="bd-close-eyebrow" aria-hidden="true">' +
            '<span class="bd-close-eyebrow-dot"></span>' +
            'Start Your Journey' +
            '</div>' +
            '<div class="bd-close-motif" aria-hidden="true">' + MOTIF_SVG + '</div>' +
            '<h2 class="bd-close-title" id="bd-close-title">' +
            '<span class="bd-close-title-main">Your dream doesn\'t<br>need to</span> ' +
            '<span class="bd-close-title-accent">wait.</span>' +
            '</h2>' +
            '<p class="bd-close-kicker">Let\'s build it together.</p>' +
            '<nav class="bd-close-actions" aria-label="Choose your starting point">' +
            buildActions(primary, opts.actions) +
            '</nav>' +
            '</div>';
        return section;
    }

    function enhance(section) {
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) return;

        section.classList.add('bd-close--animate');
        if (!('IntersectionObserver' in window)) {
            section.classList.add('is-visible');
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    section.classList.add('is-visible');
                    io.disconnect();
                }
            });
        }, { threshold: 0.15 });
        io.observe(section);
    }

    function mount(host) {
        if (!host || host.getAttribute('data-bd-cta-mounted') === 'true') return;
        host.setAttribute('data-bd-cta-mounted', 'true');

        var primary = host.getAttribute('data-cta-primary') || 'student';
        var studentHref = host.getAttribute('data-href-student');
        var founderHref = host.getAttribute('data-href-founder');
        var universityHref = host.getAttribute('data-href-university');

        var customActions = null;
        if (studentHref || founderHref || universityHref) {
            customActions = DEFAULT_ACTIONS.map(function (action) {
                if (action.id === 'student' && studentHref) return Object.assign({}, action, { href: studentHref });
                if (action.id === 'founder' && founderHref) return Object.assign({}, action, { href: founderHref });
                if (action.id === 'university' && universityHref) return Object.assign({}, action, { href: universityHref });
                return action;
            });
        }

        var section = render({ primary: primary, actions: customActions });
        host.appendChild(section);
        enhance(section);
    }

    function mountAll(root) {
        var scope = root || document;

        Array.prototype.forEach.call(scope.querySelectorAll('[data-closing-cta]'), function (host) {
            mount(host);
        });

        Array.prototype.forEach.call(scope.querySelectorAll('.nd-cta-footer'), function (legacy) {
            if (!legacy.parentNode) return;
            if (legacy.getAttribute('data-bd-cta-replaced') === 'true') return;
            legacy.setAttribute('data-bd-cta-replaced', 'true');
            var host = document.createElement('div');
            host.setAttribute('data-closing-cta', '');
            legacy.parentNode.replaceChild(host, legacy);
            mount(host);
        });
    }

    window.BuildingDreamsCTA = {
        render: render,
        mount: mount,
        mountAll: mountAll
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { mountAll(); }, { once: true });
    } else {
        mountAll();
    }
})();
