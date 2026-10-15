// community.js — Mentors & Community Interactive Enhancements
document.addEventListener('DOMContentLoaded', () => {
    const networkNodes = document.querySelectorAll('.comm-node');
    const networkStat = document.getElementById('comm-network-stat-text');

    if (!networkNodes.length) return;

    const roleDescriptions = {
        'dreamers': 'Dreamers: Discovering problems & exploring early solutions',
        'builders': 'Student Builders: Experimenting, prototyping & building MVPs',
        'founders': 'Founders: Solving real-world problems & scaling ventures',
        'mentors': 'Mentors: Sharing battle-tested experience & guidance',
        'institutions': 'Institutional Partners: Creating structured campus pathways',
        'hub': 'Building Dreams Ecosystem: Connecting talent with opportunity'
    };

    networkNodes.forEach(node => {
        const role = node.getAttribute('data-role');

        node.addEventListener('mouseenter', () => {
            if (roleDescriptions[role] && networkStat) {
                networkStat.textContent = roleDescriptions[role];
                networkStat.style.color = '#FF6B1A';
            }
            highlightLinks(node, true);
        });

        node.addEventListener('mouseleave', () => {
            if (networkStat) {
                networkStat.textContent = 'Hover nodes to explore connections';
                networkStat.style.color = '#7A6A60';
            }
            highlightLinks(node, false);
        });

        node.addEventListener('focus', () => {
            if (roleDescriptions[role] && networkStat) {
                networkStat.textContent = roleDescriptions[role];
                networkStat.style.color = '#FF6B1A';
            }
            highlightLinks(node, true);
        });

        node.addEventListener('blur', () => {
            if (networkStat) {
                networkStat.textContent = 'Hover nodes to explore connections';
                networkStat.style.color = '#7A6A60';
            }
            highlightLinks(node, false);
        });
    });

    function highlightLinks(activeNode, isActive) {
        const nodeId = activeNode.id;
        const links = document.querySelectorAll(`[data-link*="${nodeId}"]`);
        links.forEach(link => {
            if (isActive) {
                link.setAttribute('stroke', '#FF6B1A');
                link.setAttribute('stroke-width', '2.5');
                link.setAttribute('stroke-opacity', '0.9');
            } else {
                link.setAttribute('stroke', '#073D33');
                link.setAttribute('stroke-width', '1.5');
                link.setAttribute('stroke-opacity', '0.35');
            }
        });
    }
});
