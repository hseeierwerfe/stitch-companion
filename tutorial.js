window.TutorialManager = (function() {
    let isActive = false;
    let currentStepIndex = 0;
    let clicksNeeded = 1;
    let clicksDone = 0;
    let currentHighlightEl = null;
    let _scrollRafPending = false;

    // Scroll-Listener mit capture:true erfasst auch scrollbare Kind-Container (nicht nur window)
    document.addEventListener('scroll', () => {
        if (!isActive || !currentHighlightEl || !document.getElementById('tutorial-overlay-container')) return;
        if (_scrollRafPending) return;
        _scrollRafPending = true;
        requestAnimationFrame(() => {
            _scrollRafPending = false;
            const step = steps[currentStepIndex];
            if (step && isActive) drawOverlay(step, currentHighlightEl, true);
        });
    }, { passive: true, capture: true });

    const steps = [
        {
            text: "Wir beginnen am besten mit einem neuen Spiel.",
            shape: "oval",
            findHighlight: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Neues Spiel')); },
            findTarget: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Neues Spiel')); }
        },
        {
            text: "Sehen wir uns mal einen Helden an.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Konrad der Raufbold')); },
            findTarget: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Konrad der Raufbold')); }
        },
        {
            text: "Hier siehst du den Helden, den du wählen kannst, weshalb er in die Kolonie gesperrt wurde und seine persönliche Quest. Ist diese Quest erledigt, erhältst du als Belohnung die angegebene Questbelohnung als dauerhafte Fähigkeit.",
            shape: "rect",
            findHighlight: function() { return document.querySelector('.space-y-4.text-on-surface-variant'); },
            requireExtraOk: true
        },
        {
            text: "Wenn du willst kannst du hier zurück zur Heldenauswahl und dir die anderen Helden ansehen oder diesen Held bestätigen. Wir wollen diesen Helden bestätigen.",
            shape: "rect",
            findHighlight: function() { return document.querySelector('.mt-auto.flex.gap-4'); },
            findTarget: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Held wählen')); }
        },
        {
            text: "Du gelangst am Anfang zu Statusseite deines Helden. Hier kannst du deine Statuswerte, gelernte Talente, dein Erz und andere Ausrüstung, sowie Erfahrung Lernpunkte und Level sehen. Bereiten wir zur besseren Übersicht und zum Lernen mal einen fertigen Charakter vor.",
            shape: "rect",
            findHighlight: function() { return document.getElementById('app-content'); },
            scrollFn: function() { window.scrollTo(0,0); },
            requireExtraOk: true
        },
        {
            text: "Hier sind bereits deine ersten Statuswerte angezeigt. Von Anfang hat man 10 Lebenspunkte und 3 Rüstung. Diese Rüstung ergibt sich aus deiner Kleidung, die du von Anfang an ausgerüstet hast. Mit dem + und – Buttons neben deinen Lebenspunkten kannst du auch außerhalb des Kampfes dein Leben verändern, falls du beispielsweise durch ein Ereignis Leben verlierst oder erhälst.",
            shape: "rect",
            findHighlight: function() { return document.getElementById('tutorial-hp-armor'); },
            requireExtraOk: true
        },
        {
            text: "Hier siehst du deine Lernpunkte und deinen aktuellen Erfahrungsfortschritt. Du erhältst automatisch bei jedem Aufleveln 2 Lernpunkte, 2 maximale Lebenspunkte hinzu und heilst dein Mana und deine Lebenspunkte voll.",
            shape: "rect",
            findHighlight: function() { return document.getElementById('tutorial-lp-xp'); },
            requireExtraOk: true
        },
        {
            text: "Hier kannst du deine Erfahrung außerhalb von Quests und Kämpfen beeinflussen. Mit dem Pausen Button kannst du jegliche Erfahrung, die du durch Quests oder Kämpfe erhältst, verhindern. Dies ist vor allem nützlich, wenn du einen bereits gespielten Spielstand vorher noch nicht in der App hattest, und diesen später hier reproduzieren willst. Bei erneuten Klick auf den Button wird die erhaltene Erfahrung wieder aktiviert. Klickt man auf den + Button kann man sich manuell Erfahrung geben, entweder um einen Spielstand zu rekonstruieren, oder falls man durch Ereignisse Erfahrung erhält. Wir tun mal so, als hätten wir bereits 150 Erfahrungspunkte gesammelt.",
            shape: "rect",
            findHighlight: function() { return document.getElementById('tutorial-xp-buttons'); },
            findTarget: function() { return Array.from(document.querySelectorAll('#tutorial-xp-buttons button')).find(b => b.textContent.includes('add')); }
        },
        {
            text: "Hier kannst du dir die notwendige Erfahrung eintragen und über den OK Button bestätigen. Die Erfahrung wird dir dann automatisch gutgeschrieben.",
            shape: "rect",
            preAction: function() { 
                let ival = setInterval(() => {
                    const t = document.querySelector('#resource-amount');
                    if(t) { t.value = "150"; t.setAttribute('readonly', 'true'); t.blur(); clearInterval(ival); }
                }, 50);
                setTimeout(() => clearInterval(ival), 2000);
            },
            findHighlight: function() { return document.getElementById('resource-popup') ? document.getElementById('resource-popup').querySelector('.wood-card') : null; },
            findTarget: function() { return document.getElementById('resource-popup') ? Array.from(document.getElementById('resource-popup').querySelectorAll('button')).find(b => b.textContent.includes('OK')) : null; }
        },
        {
            text: "Nachdem die Erfahrung zugefügt wird, kehrt man automatisch zum Startbildschirm zurück. Hier sehen wir schon, dass wir 12/12 Lebenspunkte, also 2 zusätzliche Lebenspunkte erhalten haben. Zusätzlich sehen wir, dass wir 2 Lernpunkte erhalten haben. Diese können verwendet werden um Attribute zu erhöhen oder Talente zu erlernen. Außerdem steht sie Leiste Erfahrungsfortschritt auf 50 /200. Das liegt daran, dass man das erste Level nach 100 Erfahrungspunkten erreicht und sich dann die Leiste auf 0 zurücksetzt. Überschüssige Erfahrung wird selbstverständlich anschließend addiert. Das zweite Level erreicht man nach 200 Erfahrungspunkten, das 3. Nach 300 usw.",
            shape: "rect",
            scrollFn: function() { window.scrollTo(0,0); },
            requireExtraOk: true
        },
        {
            text: "Mit diesen Button kannst du deinen Spielstand speichern und gespeicherte Spielstände laden. Speichern wir einmal unseren Fortschritt ab.",
            shape: "rect",
            findHighlight: function() { let p = Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Aktionen')); return p ? p.querySelector('.grid') : null; },
            findTarget: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.toLowerCase().includes('spiel speichern unter') || (b.getAttribute('onclick') && b.getAttribute('onclick').includes("savePopup"))); },
            scrollFn: function() { let t = Array.from(document.querySelectorAll('button')).find(b => b.textContent.toLowerCase().includes('spiel speichern unter') || (b.getAttribute('onclick') && b.getAttribute('onclick').includes("savePopup"))); if(t) t.scrollIntoView({behavior: 'smooth', block: 'center'}); }
        },
        {
            text: "In diesem Fenster kannst du deinem Speicherstand einen Namen geben und diesen unter dem Namen abspeichern. Hast du bereits gespeicherte Spielstände, kannst du ebenso gut einen vorhandenen Spielstand auswählen und mit deinem aktuellen überschreiben. Wir wollen unseren Spielstand unter dem Namen Test einmal abspeichern.",
            shape: "rect",
            preAction: function() { 
                let ival = setInterval(() => {
                    const t = document.querySelector('#save-name-input');
                    if(t) { t.value = "Test"; t.setAttribute('readonly', 'true'); t.blur(); clearInterval(ival); }
                }, 50);
                setTimeout(() => clearInterval(ival), 2000);
            },
            findHighlight: function() { return document.getElementById('save-popup') ? document.getElementById('save-popup').querySelector('.wood-card') : null; },
            findTarget: function() { return document.getElementById('save-popup') ? Array.from(document.getElementById('save-popup').querySelectorAll('button')).find(b => b.textContent.includes('Speichern')) : null; }
        },
        {
            text: "In diesem Bereich auf deiner Statusseite kannst du das Kapitel wechseln, in dem du dich befindest, die Musik ein und ausstellen, dein Erz einblicken, ins Hauptmenü zurückkehren und dich mit anderen Spielern im gleichen Netzwerk verbinden, um ihren aktuellen Status überblicken zu können oder gemeinsam mit ihnen kämpfen zu können. Um ein Kapitel zu wechseln, musst du zunächst auf das Kapitel 1: Die Ankunft klicken, das neue Kapitel auswählen und im Anschluss direkt mit dem Kapitel bestätigen Button speichern.",
            shape: "rect",
            findHighlight: function() { return document.querySelector('header'); },
            scrollFn: function() { window.scrollTo(0,0); },
            requireExtraOk: true
        },
        {
            text: "Über diesen Button kommst du zurück ins Hauptmenü, wo du ebenfalls Spielstände speichern und laden kannst, aber auch ein neues Spiel beginnen kannst und vorhandene Spielstände, die du nicht mehr brauchst, löschen kannst.",
            shape: "rect",
            findHighlight: function() { return document.getElementById('btn-menu'); },
            requireExtraOk: true
        },
        {
            text: "Schauen wir uns kurz den Mehrspieler Modus an.",
            shape: "rect",
            findHighlight: function() { return document.getElementById('btn-sync'); },
            findTarget: function() { return document.getElementById('btn-sync'); }
        },
        {
            text: "Hier siehst du das Mehrspieler Menü. Es ist folgendermaßen unterteilt: Neue Partie starten: Hier kannst du ein neues Spiel eröffnen und einen Raum stellen, dem andere Spieler im selben Netzwerk beitreten können. Partie beitreten: Hat bereits ein Spieler in deinem Netzwerk eine Partie eröffnet, wird nach einem Klick auf diesen Button diese Partie angezeigt. Du kannst dieser Partie beitreten, um dich mit deinen Mitspielern zu synchronisieren. Partie fortsetzen: Gibt es eine gespeicherte Partie, kannst du diese hier wiederfinden und mit deinen Mitspielern fortsetzen. Die Fortschritte werden dann automatisch geladen. Partie speichern: Gibt es eine aktive Partie, kann diese jederzeit über diesen Button gespeichert werden.",
            shape: "rect",
            findHighlight: function() { return document.getElementById('sync-modal').querySelector('.wood-card'); },
            requireExtraOk: true
        },
        {
            text: "Sehen wir uns das einmal kurz an und legen eine neue Partie an.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('#sync-screen-main button')).find(b => b.textContent.includes('NEUE PARTIE STARTEN')); },
            findTarget: function() { return Array.from(document.querySelectorAll('#sync-screen-main button')).find(b => b.textContent.includes('NEUE PARTIE STARTEN')); }
        },
        {
            text: "In diesem Fenster kannst du deiner Partie einen Namen geben und diese dann starten. Nennen wir unsere Partie Test und starten diese einmal.",
            shape: "rect",
            preAction: function() { 
                let ival = setInterval(() => {
                    const t = document.getElementById('new-party-name-input');
                    if(t) { t.value = "Test"; t.setAttribute('readonly', 'true'); t.blur(); clearInterval(ival); }
                }, 50);
                setTimeout(() => clearInterval(ival), 2000);
            },
            findHighlight: function() { return document.getElementById('sync-screen-new'); },
            findTarget: function() { return Array.from(document.querySelectorAll('#sync-screen-new button')).find(b => b.textContent.includes('PARTIE STARTEN')); }
        },
        {
            text: "In diesem Fenster siehst du alle Mitglieder der Partie und ihren aktuellen Status. Hier kannst du auch eine Partie speichern und eine Partie endgültig starten.",
            shape: "rect",
            findHighlight: function() { return document.getElementById('sync-screen-lobby'); },
            requireExtraOk: true
        },
        {
            text: "Über diesen Button lässt sich die Partie verlassen. Dies tun wir einmal.",
            shape: "rect",
            findHighlight: function() { return document.querySelector('#sync-screen-lobby button[title=\"Lobby verlassen\"]'); },
            findTarget: function() { return document.querySelector('#sync-screen-lobby button[title=\"Lobby verlassen\"]'); }
        },
        {
            text: "Wir gehen zurück ins Status Menü, um unseren Charakter weiter aufzubauen.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('#sync-screen-main button')).find(b => b.textContent.includes('SCHLIESSEN')); },
            findTarget: function() { return Array.from(document.querySelectorAll('#sync-screen-main button')).find(b => b.textContent.includes('SCHLIESSEN')); }
        },
        {
            text: "In diesem Feld siehst du deine aktuellen Attribute und kannst dir Erz hinzufügen oder entfernen, was beispielsweise durch Ereignisse im Spielverlauf geschehen kann. Wie man sieht, können Attribute trotz Lernpunkten nicht trainiert werden, da hierfür ebenfalls Erz erforderlich ist",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Statuswerte & Training')); },
            scrollFn: function() { let t = Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Statuswerte & Training')); if(t) t.scrollIntoView({behavior: 'smooth', block: 'start'}); },
            requireExtraOk: true
        },
        {
            text: "Fügen wir uns über den + Button mal 100 Erz zu.",
            shape: "rect",
            findHighlight: function() { let p = Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Erz im Besitz')); return p ? p.querySelector('.flex.gap-2') : null; },
            findTarget: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('add') && b.closest('.wood-card') && b.closest('.wood-card').textContent.includes('Erz im Besitz')); }
        },
        {
            text: "Hier kannst du den Wert eingeben, den du im Spielverlauf findest und der dir nicht automatisch (wie z.B. in Quests) gutgeschrieben wird. Wir wollen einmal 100 Erz finden.",
            shape: "rect",
            preAction: function() { 
                let ival = setInterval(() => {
                    const t = document.querySelector('#resource-amount');
                    if(t) { t.value = "100"; t.setAttribute('readonly', 'true'); t.blur(); clearInterval(ival); }
                }, 50);
                setTimeout(() => clearInterval(ival), 2000);
            },
            findHighlight: function() { return document.getElementById('resource-popup') ? document.getElementById('resource-popup').querySelector('.wood-card') : null; },
            findTarget: function() { return document.getElementById('resource-popup') ? Array.from(document.getElementById('resource-popup').querySelectorAll('button')).find(b => b.textContent.includes('OK')) : null; }
        },
        {
            text: "Wir sehen jetzt, dass das Erhöhen von Attributen wie z.B. Stärke und Geschick möglich ist, da wir über genug Lernpunkte und Erz verfügen. Erhöhen wir zuerst die Stärke auf 2.",
            shape: "rect",
            findHighlight: function() { let card = Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Statuswerte & Training')); return card ? card.querySelector('.grid') : null; },
            interceptFn: 'upgradeStat',
            interceptArg: 'str',
            scrollFn: function() { let t = Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Statuswerte & Training')); if(t) t.scrollIntoView({behavior: 'smooth', block: 'start'}); }
        },
        {
            text: "Sehr gut! Jetzt erhöhen wir noch das Geschick auf 2.",
            shape: "rect",
            findHighlight: function() { let card = Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Statuswerte & Training')); return card ? card.querySelector('.grid') : null; },
            interceptFn: 'upgradeStat',
            interceptArg: 'dex',
            scrollFn: function() { let t = Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Statuswerte & Training')); if(t) t.scrollIntoView({behavior: 'smooth', block: 'start'}); }
        },
        {
            text: "In diesem Abschnitt sind Kampftalente angegeben, die man im Verlauf des Spiels bei verschiedenen Lehrern lernen kann. In diesen Fenstern sind angezeigt, wie viele Stufen man trainieren kann, welche kosten das Training der jeweiligen Stufe hat und welche Auswirkungen das Training einer Stufe hat.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Einhandkampf') && c.querySelector('button')); },
            scrollFn: function() { let t = Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Talente & Kampftechniken')); if(t) t.scrollIntoView({behavior: 'smooth', block: 'start'}); },
            requireExtraOk: true
        },
        {
            text: "Sehen wir uns mal an, was man für Vorteile vom Training des Einhandkampfes erhält.",
            shape: "rect",
            findHighlight: function() { let p = Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Einhandkampf') && c.querySelector('button')); return p ? Array.from(p.querySelectorAll('button')).find(b => b.textContent.includes('info')) : null; },
            findTarget: function() { let p = Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Einhandkampf') && c.querySelector('button')); return p ? Array.from(p.querySelectorAll('button')).find(b => b.textContent.includes('info')) : null; }
        },
        {
            text: "Klickt man auf den Infobutton bei den Talenten, zeigt ein Popupfenster, welche Vorteile durch ein Training des jeweiligen Attributes permanent freigeschaltet werden.",
            shape: "rect",
            findHighlight: function() { return document.getElementById('talent-info-popup') ? document.getElementById('talent-info-popup').querySelector('.wood-card') : null; },
            requireExtraOk: true
        },
        {
            text: "Kehren wir nun zurück zum Statusfenster und rüsten uns weiter aus. Schließe das Infofenster über den X-Button oben rechts oder durch Antippen des dunklen Bereichs.",
            shape: "rect",
            findHighlight: function() { const p = document.getElementById('talent-info-popup'); return p ? p.querySelector('.wood-card') : null; },
            interceptFn: 'closeTalentInfo',
        },
        {
            text: "Ganz unten befindet sich die Navigationsleiste, mit der man zwischen folgenden Kategorien wechseln kann: Status: Die aktuelle Seite mit Attributen, Erfahrung etc. Beutel: Hier ist dein Inventar strukturiert dargestellt. Sehen wir uns das an, sobald es auch was zu sehen gibt. Handeln: Im Verlauf des Spiels kann man mit verschiedenen Händlern Waren und Erz tauschen. Finden: Auf dieser Seite kann man im Prinzip jeden Gegenstand finden, der bis zu deinem aktuellen Kapitel verfügbar ist und kein Questgegenstand ist. Due kannst auf dieser Seite jedoch ebenfalls auch jeden Gegnstand aus deinem Inventar verlieren, wenn dies durch Ereignisse o.ä. im Spielverlauf geschieht. Questlog: Diese Seite sehen wir uns als nächstes an.",
            shape: "rect",
            popupTop: true,
            findHighlight: function() { return document.getElementById('nav-questlog'); },
            scrollFn: function() { let t = Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Talente & Kampftechniken')); if(t) t.scrollIntoView({behavior: 'smooth', block: 'start'}); },
            findTarget: function() { return document.getElementById('nav-questlog'); }
        },
        {
            text: "Oben im Questlog sehen wir die Lager Übersicht. Hier sind die 3 Lager mit jeweils 3 Charakteren vertreten. Diese werden mit einem Klick auf den Button „Neue Runde“ zufällig neu generiert. Schauen wir uns mal an, was ein Charakter alles für Optionen haben kann.",
            shape: "rect",
            preAction: function() { if(state.hero.campState && state.hero.campState['Neues Lager'] && state.hero.campState['Neues Lager'].active && !state.hero.campState['Neues Lager'].active.includes(5)) { state.hero.campState['Neues Lager'].active[0] = 5; render(); } },
            findHighlight: function() { return Array.from(document.querySelectorAll('.wood-card')).find(c => c.querySelector('h2') && c.querySelector('h2').textContent.includes('Neues Lager')); },
            requireExtraOk: true
        },
        {
            text: "Wenn wir uns Wolf ansehen, können wir bereits alle verfügbaren Rollen sehen. Es gib 3 Stück: Händler(symbolisiert durch das Einkaufswagen Icon), Lehrer(symbolisiert durch den Doktorhut) und Questgeber(symbolisiert durch das Klemmbrett).",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('.flex.flex-col.items-center')).find(c => c.textContent.includes('Wolf')); },
            requireExtraOk: true
        },
        {
            text: "Mit einem Klick auf den Händler Button wird man direkt zur Händlerseite weitergeleitet, wobei Wolf automatisch ausgewählt wird. Mit einem Klick auf den Lehrer Button wird man direkt auf die Statusseite umgeleitet, wo man je nach Lehrer dann lernen kann. Was welcher Lehrer unterrichtet, kann man aus den Regeln entnehmen. Mit einem Klick auf den Quest Button, beginnt ein Dialog, der eine Quest einleitet. Sehen wir uns das mal genauer an.",
            shape: "rect",
            findHighlight: function() {
                let p = Array.from(document.querySelectorAll('.flex.flex-col.items-center')).find(c => c.textContent.includes('Wolf'));
                return p ? p.querySelector('.flex.justify-center') : null;
            },
            interceptFn: 'openQuestAcceptancePopup',
            interceptArg: 'Wolf',
        },
        {
            text: "Hier sehen wir, wie eine Quest grundsätzlich eingeleitet wird. Jede Quest hat einen Namen, und einen Einleitungstext, indem der Questgeber schildert, worum es in der quest geht.",
            shape: "rect",
            findHighlight: function() { return document.getElementById('quest-confirmation-popup') ? document.getElementById('quest-confirmation-popup').querySelector('.wood-card') : null; },
            requireExtraOk: true
        },
        {
            text: "Es gibt bei jeder Quest 3 Auswahlmöglichkeiten. Quest annehmen: Hierbei stimmt man den Bedingungen des Questgebers zu und überführt diese Quest in die aktiven Quests. Quest vergeben: Diesen Button sollte man nur klicken, wenn entweder ein anderer Spieler die Quest dieses Charakters bereits angenommen hat und sie somit nicht mehr verfügbar ist oder wenn man dies Quest bereits in einer älteren Session erledigt hat, dies aber noch nicht im Questlog hier vermerkt hatte. Quest ablehnen: Hierbei lehnt man die Quest vorerst ab, kann sie aber, wenn noch verfügbar, zu jedem späteren Zeitpunkt trotzdem noch annehmen.",
            shape: "rect",
            findHighlight: function() { return document.getElementById('quest-confirmation-popup') ? document.getElementById('quest-confirmation-popup').querySelector('.flex.flex-col.gap-3.mt-6') : null; },
            requireExtraOk: true
        },
        {
            text: "Wir schauen uns einmal an, was geschieht, wenn man eine Quest annimmt.",
            shape: "rect",
            findHighlight: function() { return document.getElementById('quest-confirmation-popup') ? Array.from(document.getElementById('quest-confirmation-popup').querySelectorAll('button')).find(b => b.textContent.includes('Quest annehmen')) : null; },
            interceptFn: 'acceptQuest',
        },
        {
            text: "Neben den Hauptquests wie z.B. die Quest: Jeder hat seine eigenen Stärken! erscheinen auch weiter unten im Questlog alle angenommenen Quests. Neben einer kleinen Zusammenfassung der Quest hat jede Quest noch erforderliche Bedingungen. Diese lesen sich entwerder direkt aus der Quest oder sind noch einmal extra gekennzeichnet.",
            shape: "rect",
            scrollFn: function() { let t = Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Der Rüstungsbastler')); if(t) t.scrollIntoView({behavior: 'smooth', block: 'start'}); },
            findHighlight: function() { return Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Der Rüstungsbastler') && !c.querySelector('button[title=\"Lobby verlassen\"]')); },
            requireExtraOk: true
        },
        {
            text: "Sind die angegebenen Bedingungen erfüllt, kann man den Button Bedingung erfüllen anklickn, um in der Quest entweder fortzufahren und neue Inhalte freizuschalten oder aber sogar die Quest zu beenden. Möchte oder kann man die Bedingungen nicht erfüllen, sollte man den abbrechen Button anklicken. Durch das Abbrechen einer Quest gilt diese als fehlgeschlagen und kann auch nicht erneut begonnen werden. Sie sollte auch dann von anderen mitspielern als vergeben angeklickt werden. Wir tun jedoch einmal so, als würden wir die Bedingung erfüllen und klicken den Button Bedingung erfüllen.",
            shape: "rect",
            findHighlight: function() { let p = Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Der Rüstungsbastler')); return p ? Array.from(p.querySelectorAll('button')).find(b => b.textContent.includes('erfüllen')) : null; },
            interceptFn: 'openQuestProgressPopup',
        },
        {
            text: "Wir sehen, dass die Quest alleine weitergeht und erneut Bedingungen stellt. Man kann nun zurück ins Menü kehren und mit anderen Inhalten fortfahren, bis man die Bedingungen erfüllt hat oder direkt weiter Bedingungen erfüllen, um in der Quest fortzufahren. Wir tun spielen so einmal die Quest komplett durch und klicken auf Bedingung erfüllen & fortfahren.",
            shape: "rect",
            findHighlight: function() { return document.getElementById('quest-progress-popup') ? document.getElementById('quest-progress-popup').querySelector('.wood-card') : null; },
            interceptFn: 'progressQuestToNext',
        },
        {
            text: "Auch hier klicken wir weiter um fortzufahren.",
            shape: "rect",
            findHighlight: function() { return document.getElementById('quest-progress-popup') ? Array.from(document.getElementById('quest-progress-popup').querySelectorAll('button')).find(b => b.textContent.includes('erfüllen')) : null; },
            interceptFn: 'progressQuestToNext',
        },
        {
            text: "Auch hier klicken wir weiter um fortzufahren.",
            shape: "rect",
            findHighlight: function() { return document.getElementById('quest-progress-popup') ? Array.from(document.getElementById('quest-progress-popup').querySelectorAll('button')).find(b => b.textContent.includes('erfüllen')) : null; },
            interceptFn: 'progressQuestToNext',
        },
        {
            text: "Ist eine quest soweit bearbeitet, dass dieser Button eingeblendet wird, ist sie erfolgreich erledigt. Innerhalb vieler Quests gibt es Belohnungen, die im Text ausgewiesen werden. Auch in dieser Quest erhält man eine Belohnung, die automatisch mit einem Klick auf den Quest abschließen Button ins Inventar übertragen wird. Holen wir uns unsere Belohnung!",
            shape: "rect",
            findHighlight: function() { return document.getElementById('quest-progress-popup') ? Array.from(document.getElementById('quest-progress-popup').querySelectorAll('button')).find(b => b.textContent.includes('abschließen')) : null; },
            interceptFn: 'completeQuestWithOption',
        },
        {
            text: "Unten in der Chronik sind alle erfolgreich absolvierten und fehlgeschlagenen Quests von dir aufgelistet. Im Prinzip laufen alle Quests so ab, wie die gerade durchgespielte Quest von Wolf.",
            shape: "rect",
            scrollFn: function() { window.scrollTo(0, document.body.scrollHeight); },
            findHighlight: function() { return Array.from(document.querySelectorAll('.wood-card')).find(c => c.querySelector('h3') && c.querySelector('h3').textContent.includes('Chronik')); },
            requireExtraOk: true
        },
        {
            text: "Um die im Spiel gefundenen Gegenstände zu unserem Inventar hinzuzufügen, klicken wir in der Menüleiste mal auf finden.",
            shape: "rect",
            popupTop: true,
            findHighlight: function() { return document.getElementById('nav-finden'); },
            findTarget: function() { return document.getElementById('nav-finden'); }
        },
        {
            text: "Auf dieser Seite kann man seinem Inventar Gegenstände, die man beispielsweise durch Plündern oder Ereignisse findet, hinzufügen. Diese werden im normalen Spielverlauf gezogen und können dann hier gesucht und dem Inventar zugefügt werden. Sie sind ebenso unterteilt, wie die Karten im Brettspiel.",
            shape: "rect",
            findHighlight: function() { return document.querySelector('main'); },
            requireExtraOk: true
        },
        {
            text: "Wollen wir nun mal so tun, als würden wir im Spiel eine Buddlerzucht und einen Kurzbogen gefunden haben. Klicken wir mal auf Waffen.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Waffen')); },
            interceptFn: 'openFindingCategory',
            interceptArg: 'Waffen',
        },
        {
            text: "Nehmen wir zuerst eine Buddlerzucht.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Buddlerzucht')); },
            interceptFn: 'initiateFind',
            interceptArg: 'Buddlerzucht',
        },
        {
            text: "Klickt man bei einem Gegenstand auf finden, so kann man anschließend angeben, wie oft wir diesen Gegenstand gefunden haben. Wir bleiben bei 1 und bestätigen mit OK.",
            shape: "rect",
            findHighlight: function() { return document.getElementById('find-qty-popup') ? document.getElementById('find-qty-popup').querySelector('.wood-card') : null; },
            interceptFn: 'confirmFindingQuantity',
        },
        {
            text: "Nehmen wir jetzt noch einen Kurzbogen.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Kurzbogen')); },
            interceptFn: 'initiateFind',
            interceptArg: 'Kurzbogen',
        },
        {
            text: "Auch hier wählen wir einen Bogen und bestätigen mit OK.",
            shape: "rect",
            findHighlight: function() { return document.getElementById('find-qty-popup') ? document.getElementById('find-qty-popup').querySelector('.wood-card') : null; },
            interceptFn: 'confirmFindingQuantity',
        },
        {
            text: "Da wir jetzt einen Nahkampfwaffe und eine Fernkampfwaffe haben, verlassen wir mal das Finden Menü der Waffen.",
            shape: "rect",
            findHighlight: function() { const p = document.getElementById('finding-category-popup'); return p ? p.querySelector('.wood-card') : null; },
            interceptFn: 'closeFindingPopup',
        },
        {
            text: "Ebenso wie wir im Spielverlauf Gegenstände finden können, kann es ebenso gut passieren, dass wir durch Ereignisse oder verlorene Kämpfe Gegenstände verlieren. Dies lässt sich über das Verlieren- Fenster managen, welches bei einem Klick auf die jeweilige Kategorie alle Gegenstände zeigt, die du im Inventar trägst. Dort lassen sich die Gegenstände dann über einen Button, der sich entfernen nennt, einfach aus dem Inventar entfernen.",
            shape: "rect",
            scrollFn: function() { window.scrollTo(0, document.body.scrollHeight); },
            findHighlight: function() { return Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Inventar') && c.textContent.includes('verlieren')); },
            requireExtraOk: true
        },
        {
            text: "Schauen wir uns nun mal den Handeln Bereich an.",
            shape: "rect",
            popupTop: true,
            findHighlight: function() { return document.getElementById('nav-handeln'); },
            findTarget: function() { return document.getElementById('nav-handeln'); }
        },
        {
            text: "Hier sehen wir die Handeln Seite. Wird man hier nicht durch einen Klick auf das Handeln Symbol eines Charakters automatisch hingeleitet, kann man sich aus dem Lager den jeweiligen Händler aussuchen und so ein Handelsinventar öffnen.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Neues Lager')).parentElement; },
            requireExtraOk: true
        },
        {
            text: "Suchen wir uns einen Händler aus dem neuen Lager.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Neues Lager')); },
            interceptFn: 'openTraderPopup',
            interceptArg: 'Neues Lager',
        },
        {
            text: "In diesem Fenster werden alle Händler des neuen Lagers angezeigt. Wir wollen im folgenden mal mit Mordrag handeln.",
            shape: "rect",
            findHighlight: function() { return document.getElementById('trader-selection-popup') ? Array.from(document.getElementById('trader-selection-popup').querySelectorAll('button')).find(b => b.textContent.includes('Mordrag')) : null; },
            interceptFn: 'selectTrader',
            interceptArg: 'Mordrag',
        },
        {
            text: "Hier sehen wir, was die Waren wert sind, die wir aus unserem Inventar ins Handlsinventar verschoben haben, wobei der meiste Warenwert direkt korrekt den Regeln entsprechend umgerechnet wird. Außerdem sehen wir auch den Wert der Ware, die wir ins Handelsinventar des Händlers verschoben haben und können diese Werte direkt gegenüberstellen. Um einen Handel abschließen zu können, müssen beide Werte identisch sein.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Eigener Wert') && c.textContent.includes('Mordrag')); },
            requireExtraOk: true
        },
        {
            text: "Um sich am Ende eventuell großes Gerechne ersparen zu können, kann man bei ausreichend Erz im Besitz den Button Erzausgleich klicken, damit Erz aus der eigenen Tasche ins Handelsinventar wandert, um einen Ausgleich zu schaffen und einen Handel zu ermöglichen.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Eigener Wert') && c.textContent.includes('Mordrag')); },
            requireExtraOk: true
        },
        {
            text: "Auf dieser Seite befinden sich alle Waren, die der Händler theoretisch anbietet. Hat man im Brettspiel seine Karten umgedreht und sich für Waren entschieden, die man kaufen möchten, kann man eben diese Waren in der App auswählen und mit einem Klick auf den button kaufen zu den Waren des Händlers verschieben.",
            shape: "rect",
            findHighlight: function() { return document.getElementById('app-content'); },
            scrollFn: function() { window.scrollTo(0, document.body.scrollHeight); },
            requireExtraOk: true
        },
        {
            text: "Wir wollen einmal diese beiden Karten hier jeweils einmal kaufen. Hiezu klicken wir zunächst auf „kaufen“ beim Amulett.",
            shape: "rect",
            scrollFn: function() { let p1 = Array.from(document.querySelectorAll('.bg-surface-container-low')).find(c => c.textContent.includes('Amulett der Überdauerung')); if(p1) p1.scrollIntoView({behavior: 'instant', block: 'center'}); },
            findHighlight: function() { let p = Array.from(document.querySelectorAll('.bg-surface-container-low')).find(c => c.textContent.includes('Amulett der Überdauerung')); return p ? Array.from(p.querySelectorAll('button')).find(b => b.textContent.toUpperCase().includes('KAUFEN')) : null; },
            interceptFn: 'addToTradeOffer',
            interceptArg: 'Amulett der Überdauerung',
        },
        {
            text: "Jetzt fügen wir noch ein Bierchen zu den Waren hinzu. Beachte, dass theoretisch jeder klick auf den Kaufen Button eine Ausführung des Gegenstandes zu den Waren des händlers hinzufügt.",
            shape: "rect",
            scrollFn: function() { let t = Array.from(document.querySelectorAll('.bg-surface-container-low')).find(c => c.textContent.includes('Bierchen')); if(t) t.scrollIntoView({behavior: 'instant', block: 'center'}); },
            findHighlight: function() { let p = Array.from(document.querySelectorAll('.bg-surface-container-low')).find(c => c.textContent.includes('Bierchen')); return p ? Array.from(p.querySelectorAll('button')).find(b => b.textContent.toUpperCase().includes('KAUFEN')) : null; },
            interceptFn: 'addToTradeOffer',
            interceptArg: 'Bierchen',
        },
        {
            text: "Um jetzt den Handel abschließen zu können, müssen wir den Wert beidseitig ausgleichen. Wir könnten jetzt Waren aus unserem Inventar auf die selbe Methode in unser Waren zum Tausch Inventar packen, wie wir es beim Händler gemacht haben. Wir entscheiden uns hier jedoch für den Erzausgleich Button.",
            shape: "rect",
            scrollFn: function() { window.scrollTo(0,0); },
            findHighlight: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.toUpperCase().includes('ERZAUSGLEICH')); },
            interceptFn: 'equalizeOre',
        },
        {
            text: "Da beide Werte durch unser Erz ausgeglichen wurden, können wir jetzt den Handel abschließen.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.toUpperCase().includes('HANDEL ABSCHLIESSEN') || b.textContent.toUpperCase().includes('HANDEL ABSCHLIEßEN')); },
            interceptFn: 'confirmTrade',
        },
        {
            text: "Nach einem abgeschlossenen Handel wird man direkt zum Inventar weitergeleitet. Sehen wir uns hier einmal ein bisschen um.",
            shape: "rect",
            findHighlight: function() { return document.querySelector('main'); },
            requireExtraOk: true
        },
        {
            text: "Oben wird strukturiert angezeigt, welche Kategorien von Gegenständen es gibt. Hat man Gegenstände dieser Kategorie im Besitz, werden alle Gegenstände bei einem Klick auf den jeweiligen Button angezeigt. Hinweis: Will man einen Gegenstand genauer sehen, kann man auf das kleine Bild klicken, um dies zu vergrößern.",
            shape: "rect",
            findHighlight: function() { return document.querySelector('main .grid'); },
            requireExtraOk: true
        },
        {
            text: "Alternativ zu den einzelnen Kategoriene werden unten im Beutel alle Gegenstände in Alphabetischer Reihenfolge angezeigt. Ganz oben ist aufgelistet, wie viele Gegenstände sich im Inventar befinden. Direkt neben der Anzahl befindet sich der theoretische Verkaufswert aller addierten Waren zur Übersicht sozusagen seines aktuellen Marktwertes.",
            shape: "rect",
            scrollFn: function() { window.scrollTo(0, document.body.scrollHeight); },
            findHighlight: function() { return Array.from(document.querySelectorAll('.wood-card')).find(c => c.querySelector('h3') && c.querySelector('h3').textContent.includes('Alle Gegenstände')); },
            requireExtraOk: true
        },
        {
            text: "Wir wollen uns nun aufrüsten. Wir können insgesamt eine Nahkampfwaffe, eine Fernkampfwaffe, ein Amulett, 2 Ringe und weitere Artefakte tragen. Klicke auf 'Ausrüsten' beim Amulett der Überdauerung.",
            shape: "rect",
            findHighlight: function() { let c = Array.from(document.querySelectorAll('.bg-surface-container-low')).find(i => i.textContent.includes('Amulett der Überdauerung')); return c ? Array.from(c.querySelectorAll('button')).find(b => b.textContent.includes('Ausrüsten')) : null; },
            interceptFn: 'handleEquipItem',
            interceptArg: 'Amulett der Überdauerung',
            scrollFn: function() { let c = Array.from(document.querySelectorAll('.bg-surface-container-low')).find(i => i.textContent.includes('Amulett der Überdauerung')); if(c) c.scrollIntoView({behavior: 'smooth', block: 'center'}); }
        },
        {
            text: "Sehr gut! Als nächstes rüsten wir die Buddlerzucht (Nahkampfwaffe) aus.",
            shape: "rect",
            findHighlight: function() { let c = Array.from(document.querySelectorAll('.bg-surface-container-low')).find(i => i.textContent.includes('Buddlerzucht')); return c ? Array.from(c.querySelectorAll('button')).find(b => b.textContent.includes('Ausrüsten')) : null; },
            interceptFn: 'handleEquipItem',
            interceptArg: 'Buddlerzucht',
            scrollFn: function() { let c = Array.from(document.querySelectorAll('.bg-surface-container-low')).find(i => i.textContent.includes('Buddlerzucht')); if(c) c.scrollIntoView({behavior: 'smooth', block: 'center'}); }
        },
        {
            text: "Nun rüsten wir den Kurzbogen (Fernkampfwaffe) aus.",
            shape: "rect",
            findHighlight: function() { let c = Array.from(document.querySelectorAll('.bg-surface-container-low')).find(i => i.textContent.includes('Kurzbogen')); return c ? Array.from(c.querySelectorAll('button')).find(b => b.textContent.includes('Ausrüsten')) : null; },
            interceptFn: 'handleEquipItem',
            interceptArg: 'Kurzbogen',
            scrollFn: function() { let c = Array.from(document.querySelectorAll('.bg-surface-container-low')).find(i => i.textContent.includes('Kurzbogen')); if(c) c.scrollIntoView({behavior: 'smooth', block: 'center'}); }
        },
        {
            text: "Und zu guter Letzt den Scavengerhelm (Ausrüstung).",
            shape: "rect",
            findHighlight: function() { let c = Array.from(document.querySelectorAll('.bg-surface-container-low')).find(i => i.textContent.includes('Scavengerhelm')); return c ? Array.from(c.querySelectorAll('button')).find(b => b.textContent.includes('Ausrüsten')) : null; },
            interceptFn: 'handleEquipItem',
            interceptArg: 'Scavengerhelm',
            scrollFn: function() { let c = Array.from(document.querySelectorAll('.bg-surface-container-low')).find(i => i.textContent.includes('Scavengerhelm')); if(c) c.scrollIntoView({behavior: 'smooth', block: 'center'}); }
        },
        {
            text: "Neben ausrüstbaren Gegenständen, zu denen Waffen und Artefakte zählen, gibt es auch Verbrauchsgegenstände. Ein Beispiel ist das Bierchen: Es ist ein Konsumgegenstand, der beim Nehmen temporäre Effekte auslöst – bis zum Ende des nächsten Kampfes steigt die Stärke um 1, während Geschick und Bewegung jeweils um 1 sinken. Das Bierchen wird dabei sofort aus dem Inventar entfernt. Du kannst dich später in Ruhe im Inventar umsehen, wir wollen erst einmal einen Kampf durchspielen.",
            shape: "rect",
            scrollFn: function() { let t = Array.from(document.querySelectorAll('span')).find(c => c.textContent.includes('Bierchen')); if(t) t.scrollIntoView({behavior: 'smooth', block: 'center'}); },
            findHighlight: function() { return Array.from(document.querySelectorAll('.flex.items-center')).find(c => c.textContent.includes('Bierchen')); },
            requireExtraOk: true
        },
        {
            text: "Wir sehen jetzt in diesem Bereich alle unsere angelegten Waffen. Zunächst ist immer die Nahkampfwaffe als „primär“ ausgewählt. Das bedeutet, dass sobald der Kampf beginnt, die Primärwaffe ausgerüstet ist. Das spielt insofern eine Rolle, dass ein Waffenwechsel einen Bewegungspunkt kostet. Wir sehen außerdem das angelegte Amulett und den ausgerüsteten Helm, sowie die angelegte Rüstung.",
            shape: "rect",
            preAction: function() { navigateTo('status'); },
            findHighlight: function() { return Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Aktuelle Ausrüstung')); },
            scrollFn: function() { let t = Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Aktuelle Ausrüstung')); if(t) t.scrollIntoView({behavior: 'instant', block: 'start'}); },
            requireExtraOk: true
        },
        {
            text: "Hinweis: Da man theoretisch immer zuerst mit dem Bogen angreifen kann, ohne dass dies einen Nachteil für den Helden darstellt, ist es oft sinnvoll, eine Fernkampfwaffe als Primärwaffe auszurüsten, wenn man eine hat. Wir setzen also einfach mal einen Haken bei Primär für die Fernkampfwaffe, denn was kann gefahrloser, potentieller Schaden schon schaden, oder?",
            shape: "rect",
            scrollFn: function() {},
            findHighlight: function() { 
                let cb = document.querySelector(`input[onchange*="setPrimaryWeapon('ranged')"]`);
                return cb ? cb.closest('label') : null;
            },
            interceptFn: 'setPrimaryWeapon',
            interceptArg: 'ranged',
        },
        {
            text: "Kommt es im Spiel zu einem Kampf, kann man diesen neben dem realen Kampffeld auch alternativ in der App ausfechten. Hierzu klicken wir einfach auf den Button „Ein Kampf steht bevor“.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Ein Kampf steht bevor')); },
            findTarget: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Ein Kampf steht bevor')); }
        },
        {
            text: "In diesem Fenster gibt es 2 Optionen: Normaler Modus: Dieser Modus ist zum ausfechten einzelner Kämpfe gedacht. Es ist der im Spiel praktikable Modus. Admin Modus: Dieser Modus ist für Simulationskämpfe gedacht und dient hauptsächlich zur Datensammlung und Errechnung der Siegeswahrscheinlichkeit des Helden im aktuellen Zustand über einen Gegner. Will man diesen Modus ausprobieren, benötigt man ein Passwort. Wir wollen hier aber einen normalen Kampf ausfechten, also klicken wir auf den Button „Normaler Modus“.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Kampfvorbereitung')); },
            findTarget: function() { let c = Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Kampfvorbereitung')); return c ? Array.from(c.querySelectorAll('button')).find(b => b.textContent.includes('Normaler Modus')) : null; }
        },
        {
            text: "In diesem Fenster werden alle für dieses Kapitel verfügbaren, normalen Kreaturen dargestellt. Wir wählen für unseren Kampf einmal einen Scavenger aus.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Gegner') || c.textContent.includes('Scavenger')); },
            findTarget: function() { 
                let card = Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Gegner') || c.textContent.includes('Scavenger'));
                if (!card) return null;
                return Array.from(card.querySelectorAll('button')).find(b => b.querySelector('span') && b.querySelector('span').textContent.trim() === 'Scavenger');
            }
        },
        {
            text: "Und jetzt bestätigen wir die Auswahl noch mit weiter.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Gegner') || c.textContent.includes('Scavenger')); },
            findTarget: function() { 
                let card = Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Gegner') || c.textContent.includes('Scavenger'));
                if (!card) return null;
                return Array.from(card.querySelectorAll('button')).find(b => b.textContent.includes('Weiter'));
            }
        },
        {
            text: "Da es im Spielverlauf durchaus auch zu Mehrfachkämpfen kommen kann, lässt sich hier noch eine Auswahl treffen, wie viele Kontrahenten antreten. Treten mehr als 1 Spieler an, ist eine Synchronisation mit anderen Spielern vorher notwendig. Wir wollen zur Probe einfach mal ein 1v1 Kampf starten. Wir klicken also auf den 1v1 Button.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Mehrfachkampf')); },
            findTarget: function() { 
                let card = Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Mehrfachkampf'));
                if (!card) return null;
                return Array.from(card.querySelectorAll('button')).find(b => b.textContent.includes('1v1'));
            }
        },
        {
            text: "Und auch hier bestätigen wir die Auswahl wieder mit weiter.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Mehrfachkampf')); },
            findTarget: function() { 
                let card = Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Mehrfachkampf'));
                if (!card) return null;
                return Array.from(card.querySelectorAll('button')).find(b => b.textContent.includes('Weiter'));
            }
        },
        {
            text: "Wir befinden uns nun auf dem digitalen Schlachtfeld der App. Der Held (oben) steht dem Scavenger (unten) gegenüber. Unter dem Schlachtfeld gibt es alle nötigen Aktionen, die du im Kampf brauchen kannst.",
            shape: "rect",
            findHighlight: function() { return document.querySelector('.grid-battlefield'); },
            requireExtraOk: true
        },
        {
            text: "Die Button sind zwar selbsterklärend, aber wir gehen sie Schritt für Schritt durch, beginnend beim Bewegen-Button. Klicken wir ihn einmal an um zu sehen, was passiert.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.toUpperCase().includes('BEWEGEN')); },
            findTarget: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.toUpperCase().includes('BEWEGEN')); }
        },
        {
            text: "Beim Klick auf den Bewegen-Button werden rund um den Helden die maximal begehbaren Felder heller gekennzeichnet. Theoretisch kann man jedes dieser Felder anklicken, um sich dort hinzubewegen. Um den Gegner herum sind sämtliche Felder rot markiert, die er in seinem Zug begehen kann. So ist eine strategische Planung des eigenen Zugs ohne aufwendiges Zählen möglich.",
            shape: "rect",
            findHighlight: function() { return document.querySelector('.grid-battlefield'); },
            requireExtraOk: true
        },
        {
            text: "Wir wollen uns strategisch clever platzieren, um einen Fernkampf auf maximaler Distanz ausführen zu können. Hinweis: Für einen Fernkampfangriff benötigt man 2 übrig gebliebene Bewegungspunkte, für einen Nahkampfangriff 1. Wir gehen einfach 2 Felder nach oben an den Spielfeldrand.",
            shape: "rect",
            findHighlight: function() { return document.querySelector('.grid-battlefield'); },
            findTarget: function() { return Array.from(document.querySelectorAll('div')).find(c => c.getAttribute('onclick') && c.getAttribute('onclick').includes('handleCombatCellClick(1, 8)')); }
        },
        {
            text: "Da wir noch genug Bewegung übrig haben, können wir noch einen Fernkampf Angriff ausführen. Dies tun wir einfach über den Button „ANGRIFF (FK)“.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.toUpperCase().includes('ANGRIFF (FK)')); },
            findTarget: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.toUpperCase().includes('ANGRIFF (FK)')); }
        },
        {
            text: "In diesem Feld können wir noch einmal unseren Helden und den Gegner gegenüberstellen und die wichtigsten Statuswerte und Waffen sehen, sowie die noch verfügbare Bewegung. Unsere Bewegung ist auf 0, da nach einem Angriff (ausgenommen aufladbare Zauber) der Zug automatisch endet.",
            shape: "rect",
            scrollFn: function() { window.scrollTo(0, document.body.scrollHeight); },
            findHighlight: function() { return Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Kontrahenten')); },
            requireExtraOk: true
        },
        {
            text: "Im Kampfprotokoll lässt sich der ganze Kampf in schriftlicher Form nachvollziehen. Wir sehen hier ob wir mit dem Bogen getroffen haben, und wenn ja, wie hoch unser Schadenswurf und verursachte Schaden ist.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Kampfprotokoll')); },
            requireExtraOk: true
        },
        {
            text: "Nach dem Angriff endet unser Zug automatisch. Nun ist der Scavenger dran. Wir klicken auf GEGNERZUG, damit er einen Schritt auf uns zugeht.",
            shape: "rect",
            scrollFn: function() { window.scrollTo(0, 0); },
            findHighlight: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.toUpperCase().includes('GEGNERZUG')); },
            findTarget: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.toUpperCase().includes('GEGNERZUG')); }
        },
        {
            text: "Der Scavenger ist näher gekommen, kann aber nicht angreifen. Sein Zug ist damit beendet und wir sind wieder an der Reihe.",
            shape: "rect",
            findHighlight: function() { return document.querySelector('.grid-battlefield'); },
            requireExtraOk: true
        },
        {
            text: "Auf diese Art kann man vor einem Gegner theoretisch so oft wie möglich zurückweichen, bis die Distanz zu klein wird. Wir wollen uns jetzt einmal den Nahkampf anschauen. Klicken wir zunächst auf den BEWEGEN Button.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.toUpperCase().includes('BEWEGEN')); },
            findTarget: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.toUpperCase().includes('BEWEGEN')); }
        },
        {
            text: "Wir sehen, dass wir über unsere gesamte Bewegung den Gegner nicht erreichen können. Wir bewegen uns nun taktisch klug für den Nahkampf genau auf das Feld, welches der Scavenger nicht erreichen kann, um einen Erstschlag zu garantieren.",
            shape: "rect",
            findHighlight: function() { return document.querySelector('.grid-battlefield'); },
            findTarget: function() { return Array.from(document.querySelectorAll('div')).find(c => c.getAttribute('onclick') && c.getAttribute('onclick').includes('handleCombatCellClick(2, 8)')); }
        },
        {
            text: "Wir beenden nun erst einmal unseren Zug und lassen den Scavenger näher kommen. Klicke auf ZUG BEENDEN.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.toUpperCase().includes('ZUG BEENDEN')); },
            findTarget: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.toUpperCase().includes('ZUG BEENDEN')); }
        },
        {
            text: "Der Scavenger ist am Zug. Klicke auf GEGNERZUG.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.toUpperCase().includes('GEGNERZUG')); },
            findTarget: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.toUpperCase().includes('GEGNERZUG')); }
        },
        {
            text: "In seinem Zug hat die Bewegung des Scavenger direkt vor uns geendet. Perfekt um jetzt einen Nahkampfangriff auszuführen!",
            shape: "rect",
            findHighlight: function() { return document.querySelector('.grid-battlefield'); },
            requireExtraOk: true
        },
        {
            text: "Wir sehen hier, dass nur der BEWEGEN-Button und der ZUG BEENDEN-Button klickbar sind. Da wir unsere Fernkampfwaffe noch ausgerüstet haben, ist nur ein Fernkampfangriff theoretisch möglich. Da wir für einen Fernkampfangriff allerdings nicht unmittelbar neben einem Gegner stehen dürfen, ist auch diese Möglichkeit gesperrt.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('.flex-wrap')).find(f => f.textContent.toUpperCase().includes('BEWEGEN')); },
            requireExtraOk: true
        },
        {
            text: "Um einen Nahkampfangriff auszuführen wollen wir also zunächst unsere Waffe wechseln. Klicke auf WAFFENWECHSEL.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.toUpperCase().includes('WAFFENWECHSEL')); },
            findTarget: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.toUpperCase().includes('WAFFENWECHSEL')); }
        },
        {
            text: "Anschließend wird der ANGRIFF (NK)-Button freigeschaltet, den wir dann auch gleich benutzen wollen.",
            shape: "rect",
            findHighlight: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.toUpperCase().includes('ANGRIFF (NK)')); },
            findTarget: function() { return Array.from(document.querySelectorAll('button')).find(b => b.textContent.toUpperCase().includes('ANGRIFF (NK)')); }
        },
        {
            text: "Im Kontrahenten Feld sehen wir nun, dass die Buddlerzucht als aktive Waffe ausgerüstet wurde. Im Kampfpotokoll können wir ebenfalls nachlesen, mit welchem Würfelwurf wie viel Schaden verursacht wurde.",
            shape: "rect",
            scrollFn: function() { window.scrollTo(0, document.body.scrollHeight); },
            findHighlight: function() { return Array.from(document.querySelectorAll('.wood-card')).find(c => c.textContent.includes('Kontrahenten')); },
            requireExtraOk: true
        },
        {
            text: "Auf diese Art kann man im Prinzip jeden Kampf absolvieren. Trägt man eine Spruchrolle und hat diese ausgerüstet, lässt sich auch diese den Regeln entsprechend verwenden. Dieses Menü funktioniert ganz intuitiv. Probiere es gerne einmal aus. Wir wollen hier den Kampf verlassen. Dies kann im Spiel über eine Flucht Karte geschehen, jedoch erst im eigenen Zug. Trotzdem wollen wir einmal zurück ins Statusmenü kehren. Klicke hierfür den Schließen Button oben rechts.",
            shape: "rect",
            scrollFn: function() { window.scrollTo(0, 0); },
            findHighlight: function() { return Array.from(document.querySelectorAll('button')).find(b => b.querySelector('span') && b.querySelector('span').textContent.includes('close')); },
            findTarget: function() { return Array.from(document.querySelectorAll('button')).find(b => b.querySelector('span') && b.querySelector('span').textContent.includes('close')); }
        },
        {
            text: "Wir beenden hier das Tutorial. Hoffentlich sind alle wichtigen Fragen geklärt. Wir wünschen viel Spaß in der Kolonie!",
            shape: "none",
            requireExtraOk: true,
            preAction: function() { navigateTo('startseite'); }
        }
    ];

    function start() {
        isActive = true;
        currentStepIndex = 0;
        clicksDone = 0;
        setupOverlay();
        renderStep();
        // Hide "Weiterspielen" button
        let btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Weiterspielen'));
        if (btn) btn.style.display = 'none';
    }

    function setupOverlay() {
        if(!document.getElementById('tutorial-overlay-container')) {
            const div = document.createElement('div');
            div.id = 'tutorial-overlay-container';
            div.style.position = 'fixed';
            div.style.inset = '0';
            div.style.zIndex = '999999';
            div.style.pointerEvents = 'none';
            document.body.appendChild(div);
        }
    }

    // ── Function-Intercept-System ─────────────────────────────────────────
    // Erlaubt Schritten, eine globale Funktion zu belauschen statt onClick-
    // Attribut-Text zu vergleichen. Robuster gegenüber DOM-Änderungen.
    function setupFunctionIntercept(step) {
        const fnName = step.interceptFn;
        const argVal = step.interceptArg;
        if (!fnName || !window[fnName]) return;
        // Originale sichern (falls noch nicht geschehen)
        if (!window['_tut_orig_' + fnName]) {
            window['_tut_orig_' + fnName] = window[fnName];
        }
        const orig = window['_tut_orig_' + fnName];
        window[fnName] = function() {
            // Nur auslösen/erlauben, wenn das Argument stimmt
            if (isActive && steps[currentStepIndex] && steps[currentStepIndex].interceptFn === fnName) {
                const requiredArg = steps[currentStepIndex].interceptArg;
                if (requiredArg) {
                    let actualArg = arguments[0];
                    if (fnName === 'addToTradeOffer' && arguments[1]) actualArg = arguments[1].name;
                    if (actualArg !== requiredArg) return; // Blockiert falsche Eingaben
                }
            }
            
            orig.apply(this, arguments);
            
            if (isActive && steps[currentStepIndex] && steps[currentStepIndex].interceptFn === fnName) {
                const requiredArg = steps[currentStepIndex].interceptArg;
                let match = true;
                if (requiredArg) {
                    let actualArg = arguments[0];
                    if (fnName === 'addToTradeOffer' && arguments[1]) actualArg = arguments[1].name;
                    match = (actualArg === requiredArg);
                }
                
                if (match) {
                    const step = steps[currentStepIndex];
                    if (step.multipleClicks) {
                        step.currentClicks = (step.currentClicks || 0) + 1;
                        if (step.currentClicks < step.multipleClicks) return;
                    }
                    cleanupFunctionIntercept(fnName);
                    setTimeout(() => nextStep(), 200);
                }
            }
        };
    }

    function cleanupFunctionIntercept(fnName) {
        if (fnName && window['_tut_orig_' + fnName]) {
            window[fnName] = window['_tut_orig_' + fnName];
            delete window['_tut_orig_' + fnName];
        }
    }

    function cleanupAllIntercepts() {
        // Alle aktiven Intercepts automatisch finden und bereinigen
        Object.keys(window).forEach(key => {
            if (key.startsWith('_tut_orig_')) {
                const fnName = key.replace('_tut_orig_', '');
                cleanupFunctionIntercept(fnName);
            }
        });
    }
    // ─────────────────────────────────────────────────────────────────────

    function renderStep() {
        if (currentStepIndex >= steps.length) {
            endTutorial();
            return;
        }
        const step = steps[currentStepIndex];
        clicksNeeded = step.multipleClicks || 1;
        clicksDone = 0;

        // Eventuelle Intercepts vom vorherigen Schritt bereinigen
        cleanupAllIntercepts();

        // Clear existing highlight immediately
        const container = document.getElementById('tutorial-overlay-container');
        if (container) container.innerHTML = '';
        
        setTimeout(() => {
            if (step.preAction) step.preAction();

            // Function-Intercept für diesen Schritt einrichten (falls definiert)
            if (step.interceptFn) setupFunctionIntercept(step);
            
            let attempts = 0;
            let checkInterval = setInterval(() => {
                let highlightEl = step.findHighlight ? step.findHighlight() : null;
                // Bei interceptFn-Schritten kein findTarget nötig
                if (!step.interceptFn) {
                    let targetEl = step.findTarget ? step.findTarget() : null;
                    if (Array.isArray(targetEl)) targetEl = targetEl[0];
                    if (!highlightEl) highlightEl = targetEl;
                }
                if (Array.isArray(highlightEl)) highlightEl = highlightEl[0];
                
                if (!highlightEl && step.shape !== 'none') {
                    highlightEl = document.getElementById('app-content');
                }
                
                attempts++;
                
                if (highlightEl || (!step.findHighlight && !step.findTarget && !step.interceptFn && step.shape === 'none') || attempts > 30) {
                    clearInterval(checkInterval);
                    drawOverlay(step, highlightEl);
                }
            }, 100);
        }, 50);
    }

    function drawOverlay(step, highlightEl, isScrollUpdate = false) {
        currentHighlightEl = highlightEl;
        const container = document.getElementById('tutorial-overlay-container');
        if (!container) return;
        
        let rect = { left: 0, top: 0, width: 0, height: 0 };
        if (highlightEl) {
            if (!isScrollUpdate) {
                container.innerHTML = '';
                if (step.scrollFn) {
                    step.scrollFn();
                } else {
                    highlightEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                setTimeout(() => {
                    rect = highlightEl.getBoundingClientRect();
                    renderSVG(container, step, rect, false);
                }, 300);
            } else {
                rect = highlightEl.getBoundingClientRect();
                renderSVG(container, step, rect, true);
            }
        } else {
            if (!isScrollUpdate) {
                container.innerHTML = '';
                if (step.scrollFn) step.scrollFn();
                renderSVG(container, step, rect, false);
            }
        }
    }

    function renderSVG(container, step, rect, isUpdate = false) {
        let padding = 8;
        let br = step.shape === 'oval' ? '50%' : '8px';

        if (isUpdate) {
            let highlightDiv = container.querySelector('#tutorial-highlight-div');
            if (highlightDiv) {
                if (rect.width > 0 && step.shape !== 'none') {
                    highlightDiv.style.top = `${rect.top - padding}px`;
                    highlightDiv.style.left = `${rect.left - padding}px`;
                    highlightDiv.style.width = `${rect.width + padding*2}px`;
                    highlightDiv.style.height = `${rect.height + padding*2}px`;
                    highlightDiv.style.borderRadius = br;
                }
            }
            return;
        }

        let highlightHtml = '';
        if (rect.width > 0 && step.shape !== 'none') {
            highlightHtml = `
                <div id="tutorial-highlight-div" style="position:fixed; top: ${rect.top - padding}px; left: ${rect.left - padding}px; width: ${rect.width + padding*2}px; height: ${rect.height + padding*2}px; border: 3px solid #e4c375; border-radius: ${br}; pointer-events: none; box-shadow: 0 0 0 9999px rgba(0,0,0,0.6); z-index: 999999; animation: pulse 2s infinite;"></div>
            `;
        } else {
            highlightHtml = `<div id="tutorial-highlight-div" style="position:fixed; inset: 0; background: rgba(0,0,0,0.6); pointer-events: none; z-index: 999999;"></div>`;
        }

        let tocHtml = `
            <div id="tutorial-toc-body" style="display: none; padding: 10px; background: rgba(20, 10, 5, 0.95); border-top: 1px solid #e4c375; max-height: 250px; overflow-y: auto;">
                <div style="cursor:pointer; margin-bottom:8px; color:#e4c375; text-decoration:underline;" onclick="goToTutorialStep(0)">1. Willkommen & Einführung</div>
                <div style="cursor:pointer; margin-bottom:8px; color:#e4c375; text-decoration:underline;" onclick="goToTutorialStep(30)">2. NPCs & Quests</div>
                <div style="cursor:pointer; margin-bottom:8px; color:#e4c375; text-decoration:underline;" onclick="goToTutorialStep(44)">3. Gegenstände finden</div>
                <div style="cursor:pointer; margin-bottom:8px; color:#e4c375; text-decoration:underline;" onclick="goToTutorialStep(53)">4. Handeln</div>
                <div style="cursor:pointer; margin-bottom:8px; color:#e4c375; text-decoration:underline;" onclick="goToTutorialStep(64)">5. Ausrüsten & Inventar</div>
                <div style="cursor:pointer; margin-bottom:8px; color:#e4c375; text-decoration:underline;" onclick="goToTutorialStep(74)">6. Kampfanfang</div>
                <div style="cursor:pointer; margin-bottom:8px; color:#e4c375; text-decoration:underline;" onclick="goToTutorialStep(80)">7. Kampf & Bewegung</div>
                <div style="cursor:pointer; margin-bottom:8px; color:#e4c375; text-decoration:underline;" onclick="goToTutorialStep(99)">8. Abschluss & Loot</div>
            </div>
        `;

        let popupPosition = step.popupTop
            ? 'top: 20px; bottom: auto;'
            : 'bottom: 20px; top: auto;';

        let popupHtml = `
            <div style="position:fixed; ${popupPosition} left: 50%; transform: translateX(-50%); width: 90%; max-width: 450px; background: rgba(30, 20, 10, 0.95); border: 2px solid #e4c375; color: #e7e2dd; border-radius: 8px; z-index: 1000000; box-shadow: 0 10px 25px rgba(0,0,0,0.8); pointer-events: auto; display: flex; flex-direction: column;">
                <div style="display:flex; border-bottom: 1px solid #e4c375; background: rgba(0,0,0,0.4);">
                    <div id="tutorial-popup-header" style="padding: 10px 15px; flex-grow: 1; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                        <strong style="color: #e4c375; font-family: 'Georgia', serif;">Tutorial</strong>
                        <span style="color: #e4c375; font-size: 10px; font-weight: bold; text-transform: uppercase;">▼ Ein-/Ausblenden</span>
                    </div>
                    <div id="tutorial-toc-btn" onclick="document.getElementById('tutorial-toc-body').style.display = document.getElementById('tutorial-toc-body').style.display === 'none' ? 'block' : 'none';" style="padding: 10px 15px; border-left: 1px solid #e4c375; cursor: pointer; color: #e4c375; font-weight: bold; display: flex; align-items: center;">
                        ☰ Menü
                    </div>
                </div>
                ${tocHtml}
                <div id="tutorial-popup-body" style="padding: 15px; display: block;">
                    <p style="font-family: 'Work Sans', sans-serif; font-size: 14px; margin-bottom: 10px;">${step.text}</p>
                    ${step.requireExtraOk ? `<button id="tutorial-ok-btn" style="background: #e4c375; color: #3e2e00; padding: 8px 16px; border-radius: 4px; font-weight: bold; width: 100%; border: none; cursor: pointer; text-transform: uppercase;">OK</button>` : ''}
                </div>
            </div>
        `;

        container.innerHTML = highlightHtml + popupHtml;
    }

    window.goToTutorialStep = function(idx) {
        if (!isActive) return;
        currentStepIndex = idx;
        clicksDone = 0;
        
        // Immer den Status zurücksetzen, damit beim Zurückspringen nichts erhalten bleibt
        if (typeof startNewGame === 'function') {
            startNewGame();
        }
        
        if (idx > 0) {
            if (typeof selectHero === 'function') {
                selectHero("Konrad der Raufbold");
            }
        }
        
        if (!state.hero) return; // Failsafe
        
        // Level up the hero for step 2 (NPCs & Quests)
        if (idx >= 30) {
            state.hero.level = 1;
            state.hero.xp = { current: 50, next: 200 };
            state.hero.lastKnownMaxHp = 12;
            state.hero.hp = { current: 12, max: 12 };
        }

        // Items für spätere Schritte bereitstellen, falls übersprungen wurde
        let ensureItem = function(name) {
            if (!state.hero.inventory.some(i => i.name === name)) {
                let itemTemplate = null;
                if (typeof QUEST_ITEMS_DB !== 'undefined' && QUEST_ITEMS_DB[name]) {
                    itemTemplate = QUEST_ITEMS_DB[name];
                } else if (typeof itemPools !== 'undefined') {
                    for (let pk in itemPools) {
                        let found = itemPools[pk].find(i => i.name === name);
                        if (found) { itemTemplate = found; break; }
                    }
                }
                if (itemTemplate) {
                    state.hero.inventory.push({ ...itemTemplate, id: Date.now() + Math.random(), count: 1 });
                }
            }
        };

        if (idx >= 44) {
            ensureItem('Buddlerzucht');
            ensureItem('Kurzbogen');
        }
        if (idx >= 53) {
            ensureItem('Amulett der Überdauerung');
            ensureItem('Scavengerhelm');
            ensureItem('Bierchen');
            state.hero.ore = Math.max(state.hero.ore, 500); // give enough ore for trading
        }
        if (idx >= 64) {
            // Stats erhöhen, falls übersprungen
            state.hero.attributes.str = Math.max(state.hero.attributes.str, 2);
            state.hero.attributes.dex = Math.max(state.hero.attributes.dex, 2);
        }
        if (idx >= 74) {
            let am = state.hero.inventory.find(i => i.name === 'Amulett der Überdauerung');
            if (am) {
                state.hero.equipment.artifacts.amulet = am;
            }
            
            let bz = state.hero.inventory.find(i => i.name === 'Buddlerzucht');
            if (bz) state.hero.equipment.melee = bz;
            
            let kb = state.hero.inventory.find(i => i.name === 'Kurzbogen');
            if (kb) state.hero.equipment.ranged = kb;
            
            let sh = state.hero.inventory.find(i => i.name === 'Scavengerhelm');
            if (sh) {
                if (!state.hero.equipment.artifacts.others) state.hero.equipment.artifacts.others = [];
                // Only push if not already there
                if (!state.hero.equipment.artifacts.others.find(a => a.name === 'Scavengerhelm')) {
                    state.hero.equipment.artifacts.others.push(sh);
                }
            }
            
            state.hero.primaryWeapon = 'ranged';
        }

        // Set the appropriate screen for the step
        if (idx === 0) state.currentScreen = 'startseite';
        if (idx === 30) state.currentScreen = 'status';
        if (idx === 44) state.currentScreen = 'status';
        if (idx === 53) state.currentScreen = 'status';
        if (idx === 64) state.currentScreen = 'beutel';
        if (idx === 74) state.currentScreen = 'status';
        if (idx === 80) state.currentScreen = 'schlachtfeld';
        if (idx === 99) state.currentScreen = 'status';

        render();

        renderStep();

        let tocBody = document.getElementById('tutorial-toc-body');
        if (tocBody) tocBody.style.display = 'none';
    };

    function endTutorial() {
        isActive = false;
        cleanupAllIntercepts();
        const container = document.getElementById('tutorial-overlay-container');
        if (container) container.remove();
        
        let btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Weiterspielen'));
        if (btn) btn.style.display = 'block';
        
        render(); 
    }

    function nextStep() {
        currentStepIndex++;
        renderStep();
    }

    document.addEventListener('click', (e) => {
        if (!isActive) return;
        
        if (e.target.closest('#tutorial-popup-header')) {
            e.preventDefault(); e.stopPropagation();
            const body = document.getElementById('tutorial-popup-body');
            if (body) body.style.display = body.style.display === 'none' ? 'block' : 'none';
            return;
        }

        if (e.target.closest('#tutorial-ok-btn')) {
            e.preventDefault(); e.stopPropagation();
            nextStep();
            return;
        }

        if (e.target.closest('#tutorial-toc-btn') || e.target.closest('#tutorial-toc-body')) {
            return;
        }

        const step = steps[currentStepIndex];
        if (!step) return;

        if (step.requireExtraOk) {
            e.preventDefault(); e.stopPropagation();
            return;
        }

        // Bei interceptFn-Schritten Klicks außerhalb des Ziels blockieren
        if (step.interceptFn) {
            let targets = step.findTarget ? step.findTarget() : (step.findHighlight ? step.findHighlight() : []);
            if (!Array.isArray(targets)) targets = [targets];
            targets = targets.filter(Boolean);
            if (targets.length > 0) {
                let validClick = targets.some(t => t === e.target || t.contains(e.target));
                if (!validClick) {
                    e.preventDefault(); e.stopPropagation();
                }
            }
            return; // Fortschritt wird durch interceptFn selbst gesteuert
        }

        let targets = step.findTarget ? step.findTarget() : [];
        if (!Array.isArray(targets)) targets = [targets];
        targets = targets.filter(Boolean);

        if (targets.length === 0) {
            e.preventDefault(); e.stopPropagation();
            return;
        }

        let validClick = targets.some(t => t === e.target || t.contains(e.target));
        
        if (validClick) {
            clicksDone++;
            if (clicksDone >= clicksNeeded) {
                setTimeout(() => nextStep(), 200);
            }
        } else {
            e.preventDefault(); e.stopPropagation();
        }
    }, true);

    document.addEventListener('input', (e) => {
        if (!isActive) return;
        const step = steps[currentStepIndex];
        if (!step) return;
        if (step.expectedInput) {
            let target = step.inputTarget ? step.inputTarget() : null;
            if (Array.isArray(target)) target = target[0];
            if (target && e.target === target) {
                target.value = step.expectedInput;
            }
        }
    }, true);

    return {
        start: start,
        isActive: () => isActive
    };
})();

window.openTutorial = function() {
    const html = `
        <div id="tutorial-start-popup" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
            <div class="wood-card w-full max-w-sm p-8 relative shadow-2xl border-2 border-secondary/30 text-center">
                <h3 class="font-headline text-2xl text-primary mb-4">Tutorial starten?</h3>
                <div class="flex gap-4 mt-6">
                    <button onclick="document.getElementById('tutorial-start-popup').remove()" class="flex-1 bg-surface-container-high py-3 font-bold uppercase text-xs">Nein</button>
                    <button onclick="document.getElementById('tutorial-start-popup').remove(); window.TutorialManager.start();" class="flex-1 bg-secondary text-on-secondary py-3 font-bold uppercase text-xs shadow-lg">Ja</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
};
