/**
 * enemy3d.js – CSS 3D Standee Miniature System
 * Uses CSS filters + clip-path for creature display (no Canvas CORS needed).
 */
(function () {
    'use strict';

    // ── Global CSS ─────────────────────────────────────────────────────────
    if (!document.getElementById('enemy3d-styles')) {
        const s = document.createElement('style');
        s.id = 'enemy3d-styles';
        s.textContent = `
            @keyframes e3d-float {
                0%,100% { transform: translateX(-50%) translateY(0px); }
                50%      { transform: translateX(-50%) translateY(-4px); }
            }
            @keyframes e3d-sway {
                0%,100% { transform: rotateY(0deg); }
                30%     { transform: rotateY(12deg); }
                70%     { transform: rotateY(-12deg); }
            }
            @keyframes e3d-pulse {
                0%,100% { box-shadow: 0 0 7px 2px rgba(200,20,20,0.6), 0 5px 14px rgba(0,0,0,0.95); }
                50%     { box-shadow: 0 0 14px 5px rgba(230,50,50,1),   0 5px 14px rgba(0,0,0,0.95); }
            }
            .e3d-wrap {
                position: absolute;
                bottom: -4px;
                left: 50%;
                width: 54px;
                height: 76px;
                z-index: 30;
                pointer-events: none;
                animation: e3d-float 3.5s ease-in-out infinite;
            }
            .e3d-fighold {
                position: absolute;
                bottom: 14px;
                left: 0;
                width: 100%;
                height: 62px;
                display: flex;
                align-items: flex-end;
                justify-content: center;
                animation: e3d-sway 5s ease-in-out infinite;
            }
            /* PNG: transparent creature — show as-is with drop shadow */
            .e3d-fig-png {
                max-width: 50px;
                max-height: 62px;
                object-fit: contain;
                display: block;
                filter:
                    drop-shadow(0 4px 10px rgba(0,0,0,0.95))
                    drop-shadow(0 0 5px rgba(220,38,38,0.5))
                    saturate(1.2);
            }
            /* JPG card: show only the creature art area (upper 55% = illustration) */
            .e3d-fig-card-wrap {
                width: 40px;
                height: 52px;
                border-radius: 50% 50% 40% 40% / 40% 40% 30% 30%;
                overflow: hidden;
                box-shadow:
                    0 0 0 2px #cc1a1a,
                    0 4px 10px rgba(0,0,0,0.9),
                    0 0 8px rgba(220,38,38,0.5);
                flex-shrink: 0;
            }
            .e3d-fig-card {
                width: 100%;
                height: 100%;
                object-fit: cover;
                /* 
                 * Card layout: top ~25% = stats/title, middle ~55% = creature illustration,
                 * bottom ~20% = reward text. We show only the creature illustration.
                 */
                object-position: center 42%;
                display: block;
                filter: saturate(1.15) contrast(1.08);
            }
            .e3d-base {
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%) rotateX(60deg);
                width: 42px;
                height: 16px;
                background: radial-gradient(ellipse at 35% 35%, #3a0e0e 0%, #0d0404 100%);
                border-radius: 50%;
                border: 2px solid #cc1e1e;
                animation: e3d-pulse 2.2s ease-in-out infinite;
            }
            .e3d-rim {
                position: absolute;
                inset: 3px;
                border-radius: 50%;
                border: 1px solid rgba(255,90,90,0.55);
            }
        `;
        document.head.appendChild(s);
    }

    const ACTIVE = [];

    function createStandee(mountEl, imgSrc) {
        const isPng = imgSrc.toLowerCase().endsWith('.png');

        const wrap = document.createElement('div');
        wrap.className = 'e3d-wrap';

        const figHold = document.createElement('div');
        figHold.className = 'e3d-fighold';

        if (isPng) {
            // PNG: transparent background creature — show directly
            const img = document.createElement('img');
            img.className = 'e3d-fig-png';
            img.alt = '';
            img.src = imgSrc;
            figHold.appendChild(img);
        } else {
            // JPG card: oval-cropped to show only the creature illustration area
            const cardWrap = document.createElement('div');
            cardWrap.className = 'e3d-fig-card-wrap';
            const img = document.createElement('img');
            img.className = 'e3d-fig-card';
            img.alt = '';
            img.src = imgSrc;
            cardWrap.appendChild(img);
            figHold.appendChild(cardWrap);
        }

        const base = document.createElement('div');
        base.className = 'e3d-base';
        const rim = document.createElement('div');
        rim.className = 'e3d-rim';
        base.appendChild(rim);

        wrap.appendChild(figHold);
        wrap.appendChild(base);

        mountEl.style.overflow = 'visible';
        mountEl.style.position = 'relative';
        mountEl.appendChild(wrap);
        ACTIVE.push(wrap);
    }

    window.Enemy3D = {
        init() {
            document.querySelectorAll('[data-enemy3d-img]').forEach(el => {
                const src = el.getAttribute('data-enemy3d-img');
                if (src) createStandee(el, src);
            });
        },
        cleanup() {
            ACTIVE.forEach(el => { if (el.parentNode) el.parentNode.removeChild(el); });
            ACTIVE.length = 0;
        }
    };

}());
