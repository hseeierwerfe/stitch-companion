console.log("Stitch RPG Sync Manager - Initialized");

window.SyncManager = {
    client: null,
    partyName: "",
    playerId: "",
    isHost: false,
    isConnected: false,
    players: {}, // id -> { id, name, hero, online }
    discoveredParties: {}, // name -> { partyName, hostName, timestamp }
    pingTimer: null,
    discoveryTimer: null,

    init() {
        let pid = localStorage.getItem('stitch_rpg_player_id');
        if (!pid) {
            pid = 'player_' + Math.random().toString(36).substring(2, 9);
            localStorage.setItem('stitch_rpg_player_id', pid);
        }
        this.playerId = pid;
        this.updateSyncUI();
    },

    connect(onSuccess) {
        if (this.isConnected) {
            if (onSuccess) onSuccess();
            return;
        }

        const host = "broker.hivemq.com";
        const port = 8884; // Secure WebSockets
        const clientId = "stitch_" + this.playerId + "_" + Math.random().toString(36).substring(2, 6);

        this.client = new Paho.MQTT.Client(host, port, clientId);

        this.client.onConnectionLost = (responseObject) => {
            console.warn("MQTT Connection Lost:", responseObject.errorMessage);
            this.isConnected = false;
            this.updateSyncUI();
        };

        this.client.onMessageArrived = (message) => {
            try {
                const payload = JSON.parse(message.payloadString);
                this.handleMessage(message.destinationName, payload);
            } catch (e) {
                console.error("MQTT Parse Error:", e);
            }
        };

        const options = {
            useSSL: true,
            timeout: 5,
            onSuccess: () => {
                console.log("MQTT Connected.");
                this.isConnected = true;
                this.updateSyncUI();
                if (onSuccess) onSuccess();
            },
            onFailure: (message) => {
                console.error("MQTT Failed:", message.errorMessage);
                alert("Serververbindung fehlgeschlagen. Überprüfen Sie Ihre Internetverbindung.");
                this.isConnected = false;
                this.updateSyncUI();
            }
        };

        this.client.connect(options);
    },

    disconnect() {
        this.stopPingInterval();
        this.stopDiscovery();
        if (this.client && this.isConnected) {
            try { this.client.disconnect(); } catch(e) {}
        }
        this.isConnected = false;
        this.updateSyncUI();
    },

    handleMessage(topic, payload) {
        if (payload.senderId === this.playerId) return;

        if (topic === "stitch_rpg/discovery") {
            if (payload.type === "ping") {
                this.discoveredParties[payload.partyName] = {
                    partyName: payload.partyName,
                    hostName: payload.hostName,
                    timestamp: Date.now()
                };
                this.renderDiscoveredParties();
            }
            return;
        }

        const partyTopic = "stitch_rpg/party/" + this.partyName;
        if (topic === partyTopic) {
            switch (payload.type) {
                case "join_request":
                    if (this.isHost) {
                        // Host accepts the player
                        this.players[payload.senderId] = {
                            id: payload.senderId,
                            name: payload.hero.name,
                            hero: payload.hero,
                            online: true
                        };
                        this.broadcastLobbyState();
                        this.updateSyncUI();
                    }
                    break;

                case "lobby_state":
                    if (!this.isHost) {
                        this.players = payload.players;
                        this.updateSyncUI();
                    }
                    break;

                case "game_start":
                    if (!this.isHost && payload.states[this.playerId]) {
                        // Apply state sent by Host
                        state.hero = JSON.parse(JSON.stringify(payload.states[this.playerId]));
                        window.normalizeLoadedHero(state.hero);
                        state.gameStarted = true;
                        state.currentScreen = "status";
                        if (typeof render === 'function') render();
                        this.closeModal();
                        alert("Partie wurde vom Spielleiter gestartet!");
                    }
                    break;

                case "hero_update":
                    if (this.players[payload.senderId]) {
                        this.players[payload.senderId].hero = payload.hero;
                        this.players[payload.senderId].name = payload.hero.name;
                        this.updateSyncUI();
                        if (typeof render === 'function') render();
                    }
                    break;

                case "combat_sync":
                    // 2nd device receives combat state - show battlefield
                    if (typeof state !== 'undefined' && payload.combatState) {
                        const cs = payload.combatState;
                        if (!state.combatSimulator) {
                            // Build a minimal sim for the 2nd device view
                            state.combatSimulator = {
                                active: true, isAdmin: false, multiMode: cs.multiMode || '2v1',
                                hero: { name: '(Fernsicht)', hp: 1, maxHp: 1, pos: {r:3,c:3}, remainingMov: 0, mov: 0, weapons: [], talents: {}, mana: 0, maxMana: 0, spells: [] },
                                hero2: cs.hero2,
                                enemy: cs.enemy,
                                enemy2: cs.enemy2 || null,
                                turn: cs.turn, mode: cs.mode || 'idle',
                                log: cs.log || [], endScreen: cs.endScreen || null,
                                isRemoteView: true,
                                turnOrder: ['hero','hero2','enemy'], turnIndex: 0,
                                actionDone: false, flashRed: false, confirmMoveDialog: false,
                                simWins:0, simLosses:0, simsCompleted:0, simHeroHpOnWin:0, simEnemyHpOnLoss:0,
                                lastFiveSummaries:[], lastFiveDetailedLogs:[], simStyle:'hybrid', isSimulating:false,
                                rewards: cs.rewards || null
                            };
                        } else {
                            // Update existing sim
                            state.combatSimulator.hero2 = cs.hero2;
                            state.combatSimulator.enemy = cs.enemy;
                            if (cs.enemy2) state.combatSimulator.enemy2 = cs.enemy2;
                            state.combatSimulator.turn = cs.turn;
                            state.combatSimulator.mode = cs.mode || 'idle';
                            if (cs.endScreen) state.combatSimulator.endScreen = cs.endScreen;
                            if (cs.log) state.combatSimulator.log = cs.log;
                            state.combatSimulator.rewards = cs.rewards || null;
                        }
                        // Sync HP/Mana back to local player 2 hero state
                        if (cs.hero2 && cs.hero2.name === state.hero.name) {
                            state.hero.hp.current = cs.hero2.hp;
                            if (cs.hero2.mana !== undefined) {
                                state.hero.manaCurrent = cs.hero2.mana;
                            }
                        }
                        if (cs.turn === 'hero2' && state.combatSimulator.hero2) {
                            state.currentScreen = 'schlachtfeld';
                        }
                        if (typeof render === 'function') render();
                    }
                    break;

                case "combat_move":
                    // Host device receives hero2 move from 2nd device
                    if (typeof state !== 'undefined' && state.combatSimulator && state.combatSimulator.hero2) {
                        if (payload.hero2pos) state.combatSimulator.hero2.pos = payload.hero2pos;
                        if (payload.hero2hp !== undefined) state.combatSimulator.hero2.hp = payload.hero2hp;
                        if (payload.hero2remainingMov !== undefined) state.combatSimulator.hero2.remainingMov = payload.hero2remainingMov;
                        if (payload.hero2weapons) state.combatSimulator.hero2.weapons = payload.hero2weapons;
                        if (payload.logEntry) state.combatSimulator.log.unshift(payload.logEntry);
                        if (payload.lootedItems) {
                            // Peer looted the items, clear them on host to prevent double looting
                            if (state.combatSimulator.rewards) {
                                state.combatSimulator.rewards.items = [];
                            }
                        }
                        if (payload.endTurn) {
                            // Advance turn on host
                            if (typeof window.advanceCombatTurn === 'function') window.advanceCombatTurn();
                        } else {
                            // Sync changes back to all peers
                            if (typeof window.broadcastCombatSync === 'function') window.broadcastCombatSync();
                        }
                        if (typeof render === 'function') render();
                    }
                    break;

                case "leave":
                    if (this.players[payload.senderId]) {
                        if (this.isHost) {
                            delete this.players[payload.senderId];
                            this.broadcastLobbyState();
                        } else {
                            this.players[payload.senderId].online = false;
                        }
                        this.updateSyncUI();
                    }
                    break;
            }
        }
    },

    // --- Commands ---
    startNewParty(name) {
        if (!name) return;
        this.partyName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, "_");
        this.isHost = true;
        this.players = {};

        // Add self
        this.players[this.playerId] = {
            id: this.playerId,
            name: state.hero.name,
            hero: state.hero,
            online: true
        };

        this.connect(() => {
            this.client.subscribe("stitch_rpg/party/" + this.partyName);
            this.startPingInterval();
            this.showLobbyScreen();
        });
    },

    joinParty(name) {
        if (!name) return;
        this.partyName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, "_");
        this.isHost = false;
        this.players = {};

        this.connect(() => {
            this.client.subscribe("stitch_rpg/party/" + this.partyName);
            this.sendPayload({
                type: "join_request",
                hero: state.hero
            });
            this.showLobbyScreen();
        });
    },

    broadcastLobbyState() {
        if (!this.isHost) return;
        this.sendPayload({
            type: "lobby_state",
            players: this.players
        });
    },

    startGame() {
        if (!this.isHost) return;

        const states = {};
        for (const pid in this.players) {
            states[pid] = this.players[pid].hero;
        }

        this.sendPayload({
            type: "game_start",
            states: states
        });

        state.gameStarted = true;
        state.currentScreen = "status";
        if (typeof render === 'function') render();
        this.closeModal();
    },

    broadcastHeroState() {
        if (!this.partyName || !this.isConnected) return;
        this.sendPayload({
            type: "hero_update",
            hero: state.hero
        });
    },

    broadcastCombatMove(moveData) {
        if (!this.partyName || !this.isConnected) return;
        this.sendPayload({ type: 'combat_move', ...moveData });
    },

    startPingInterval() {
        this.stopPingInterval();
        this.pingTimer = setInterval(() => {
            if (this.isConnected && this.isHost) {
                const msg = new Paho.MQTT.Message(JSON.stringify({
                    type: "ping",
                    partyName: this.partyName,
                    hostName: state.hero.name,
                    senderId: this.playerId
                }));
                msg.destinationName = "stitch_rpg/discovery";
                try { this.client.send(msg); } catch(e) {}
            }
        }, 3000);
    },

    stopPingInterval() {
        if (this.pingTimer) {
            clearInterval(this.pingTimer);
            this.pingTimer = null;
        }
    },

    startDiscovery() {
        this.discoveredParties = {};
        this.connect(() => {
            this.client.subscribe("stitch_rpg/discovery");
            this.renderDiscoveredParties();
        });

        if (this.discoveryTimer) clearInterval(this.discoveryTimer);
        this.discoveryTimer = setInterval(() => {
            const now = Date.now();
            let changed = false;
            for (const name in this.discoveredParties) {
                if (now - this.discoveredParties[name].timestamp > 10000) {
                    delete this.discoveredParties[name];
                    changed = true;
                }
            }
            if (changed) {
                this.renderDiscoveredParties();
            }
        }, 2000);
    },

    stopDiscovery() {
        if (this.discoveryTimer) {
            clearInterval(this.discoveryTimer);
            this.discoveryTimer = null;
        }
        if (this.client && this.isConnected) {
            try { this.client.unsubscribe("stitch_rpg/discovery"); } catch(e) {}
        }
    },

    sendPayload(payload) {
        if (!this.client || !this.isConnected) return;
        payload.senderId = this.playerId;
        const msg = new Paho.MQTT.Message(JSON.stringify(payload));
        msg.destinationName = "stitch_rpg/party/" + this.partyName;
        try { this.client.send(msg); } catch(e) { console.error("MQTT Send Error:", e); }
    },

    // --- Save & Resume ---
    saveParty() {
        if (!this.partyName) return;
        const partyData = {
            partyName: this.partyName,
            isHost: this.isHost,
            players: this.players,
            timestamp: Date.now()
        };
        try {
            localStorage.setItem('stitch_rpg_party_save_' + this.partyName, JSON.stringify(partyData));
            let savedList = JSON.parse(localStorage.getItem('stitch_rpg_party_saves') || "[]");
            if (!savedList.includes(this.partyName)) {
                savedList.push(this.partyName);
                localStorage.setItem('stitch_rpg_party_saves', JSON.stringify(savedList));
            }
            alert("Partie '" + this.partyName.toUpperCase() + "' erfolgreich auf dem Gerät gespeichert!");
        } catch(e) {
            console.error("Save Party Error:", e);
        }
    },

    deleteParty(name) {
        if (!name) name = this.partyName;
        if (!name) return;
        try {
            localStorage.removeItem('stitch_rpg_party_save_' + name);
            let savedList = JSON.parse(localStorage.getItem('stitch_rpg_party_saves') || "[]");
            savedList = savedList.filter(n => n !== name);
            localStorage.setItem('stitch_rpg_party_saves', JSON.stringify(savedList));
            if (name === this.partyName) {
                this.leaveParty();
            }
            this.renderSavedParties();
        } catch(e) {
            console.error("Delete Party Error:", e);
        }
    },

    resumeParty(name) {
        const saved = localStorage.getItem('stitch_rpg_party_save_' + name);
        if (!saved) return;
        const partyData = JSON.parse(saved);
        this.partyName = partyData.partyName;
        this.isHost = partyData.isHost;
        this.players = partyData.players;

        // Reset other players to offline until they rejoin
        for (const pid in this.players) {
            if (pid !== this.playerId) {
                this.players[pid].online = false;
            }
        }

        this.connect(() => {
            this.client.subscribe("stitch_rpg/party/" + this.partyName);
            if (this.isHost) {
                this.startPingInterval();
            } else {
                this.sendPayload({
                    type: "join_request",
                    hero: state.hero
                });
            }
            this.showLobbyScreen();
        });
    },

    leaveParty() {
        if (this.partyName) {
            this.sendPayload({ type: "leave" });
            if (this.client && this.isConnected) {
                try { this.client.unsubscribe("stitch_rpg/party/" + this.partyName); } catch(e) {}
            }
        }
        this.stopPingInterval();
        this.stopDiscovery();
        this.partyName = "";
        this.isHost = false;
        this.players = {};
        this.disconnect();
        this.updateSyncUI();
        this.showMainScreen();
    },

    // --- UI Control ---
    openModal() {
        document.getElementById('sync-modal').classList.remove('hidden');
        if (this.partyName) {
            this.showLobbyScreen();
        } else {
            this.showMainScreen();
        }
    },

    closeModal() {
        document.getElementById('sync-modal').classList.add('hidden');
        this.stopDiscovery();
    },

    showMainScreen() {
        this.hideAllSubScreens();
        document.getElementById('sync-screen-main').classList.remove('hidden');
        this.updateSyncUI();
    },

    showNewPartyScreen() {
        this.hideAllSubScreens();
        document.getElementById('sync-screen-new').classList.remove('hidden');
        document.getElementById('new-party-name-input').value = "";
    },

    showJoinScreen() {
        this.hideAllSubScreens();
        document.getElementById('sync-screen-join').classList.remove('hidden');
        this.startDiscovery();
    },

    showResumeScreen() {
        this.hideAllSubScreens();
        document.getElementById('sync-screen-resume').classList.remove('hidden');
        this.renderSavedParties();
    },

    showLobbyScreen() {
        this.hideAllSubScreens();
        document.getElementById('sync-screen-lobby').classList.remove('hidden');
        this.updateSyncUI();
    },

    hideAllSubScreens() {
        document.getElementById('sync-screen-main').classList.add('hidden');
        document.getElementById('sync-screen-new').classList.add('hidden');
        document.getElementById('sync-screen-join').classList.add('hidden');
        document.getElementById('sync-screen-resume').classList.add('hidden');
        document.getElementById('sync-screen-lobby').classList.add('hidden');
    },

    updateSyncUI() {
        const syncIcon = document.getElementById('sync-icon');
        if (syncIcon) {
            if (this.partyName) {
                syncIcon.innerText = "sync";
                syncIcon.className = "material-symbols-outlined text-lg text-green-500 animate-spin";
            } else {
                syncIcon.innerText = "sync_disabled";
                syncIcon.className = "material-symbols-outlined text-lg text-red-500";
            }
        }

        this.renderLobbyPlayers();

        const statusText = document.getElementById('sync-status-text');
        if (statusText) {
            if (this.partyName) {
                statusText.innerHTML = `Partie: <strong class="text-secondary uppercase">${this.partyName}</strong> (${this.isHost ? 'Spielleiter' : 'Spieler'})`;
            } else {
                statusText.innerText = "Keine aktive Partie-Verbindung.";
            }
        }

        const saveBtn = document.getElementById('btn-sync-save');
        if (saveBtn) {
            if (this.partyName) {
                saveBtn.disabled = false;
                saveBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
                saveBtn.disabled = true;
                saveBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        }
    },

    renderLobbyPlayers() {
        const lobbyTitle = document.getElementById('lobby-party-title');
        if (lobbyTitle) {
            lobbyTitle.innerText = "Partie: " + this.partyName.toUpperCase();
        }

        const list = document.getElementById('lobby-players-list');
        if (!list) return;

        list.innerHTML = "";

        const sortedPlayers = Object.values(this.players);
        sortedPlayers.forEach(p => {
            const h = p.hero;
            const eq = h.equipment || {};
            const hpCur = h.hp ? h.hp.current : 0;
            const hpMax = h.hp ? h.hp.max : 10;
            const hpPct = Math.max(0, Math.min(100, Math.round((hpCur / hpMax) * 100)));
            const hpColor = hpPct > 60 ? '#22c55e' : hpPct > 30 ? '#f59e0b' : '#ef4444';
            const isSelf = p.id === this.playerId;

            // Build weapon thumbnails
            const buildWeaponThumb = (w, label) => {
                if (!w) return '';
                const img = w.image ? `<img src="${w.image}" alt="${w.name}" class="w-10 h-10 object-cover rounded-sm border border-outline-variant/30 cursor-pointer hover:border-secondary/60 transition-all hover:scale-110" onclick="window.SyncManager.zoomImage('${w.image.replace(/'/g,"\\'")}',' ${w.name}')">` :
                    `<div class="w-10 h-10 bg-surface-variant/50 rounded-sm border border-outline-variant/20 flex items-center justify-center"><span class="material-symbols-outlined text-base text-on-surface-variant">swords</span></div>`;
                return `<div class="flex flex-col items-center gap-0.5">${img}<span class="text-[8px] text-on-surface-variant text-center leading-tight max-w-[44px] truncate">${w.name}</span></div>`;
            };

            // Build spell thumbnails
            const spells = eq.spells || [];
            const spellThumbs = spells.map(sp => {
                const img = sp.image ? `<img src="${sp.image}" alt="${sp.name}" class="w-10 h-10 object-cover rounded-sm border border-secondary/30 cursor-pointer hover:border-secondary transition-all hover:scale-110" onclick="window.SyncManager.zoomImage('${sp.image.replace(/'/g,"\\'")}',' ${sp.name}')">` :
                    `<div class="w-10 h-10 bg-surface-variant/50 rounded-sm border border-secondary/20 flex items-center justify-center"><span class="material-symbols-outlined text-base text-secondary">auto_fix_high</span></div>`;
                return `<div class="flex flex-col items-center gap-0.5">${img}<span class="text-[8px] text-secondary text-center leading-tight max-w-[44px] truncate">${sp.name}</span></div>`;
            }).join('');

            const card = document.createElement('div');
            card.className = "flex flex-col gap-2 p-3 bg-surface-variant/20 border border-outline-variant/20 rounded-sm mb-3 text-on-surface";
            card.innerHTML = `
                <!-- HEADER: Portrait + Name + Status + HP -->
                <div class="flex items-center gap-3">
                    <!-- Hero Portrait -->
                    ${ h.image ? `<img src="${h.image}" alt="${h.name}" class="w-14 h-14 object-cover rounded-sm border-2 border-secondary/40 cursor-pointer hover:border-secondary transition-all hover:scale-105 shrink-0" onclick="window.SyncManager.zoomImage('${h.image.replace(/'/g,"\\'")}',' ${h.name}')">` :
                        `<div class="w-14 h-14 bg-surface-variant/60 rounded-sm border-2 border-outline-variant/30 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-3xl text-on-surface-variant">person_4</span></div>`
                    }
                    <!-- Name, Status, HP -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2 mb-1">
                            <span class="font-bold text-secondary text-sm truncate">${h.name}${isSelf ? ' <span class="text-[9px] text-on-surface-variant font-normal">(Du)</span>' : ''}</span>
                            <span class="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${p.online ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">${p.online ? 'Online' : 'Offline'}</span>
                        </div>
                        <!-- HP Bar -->
                        <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-sm" style="color:${hpColor}">favorite</span>
                            <div class="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                                <div class="h-full rounded-full transition-all" style="width:${hpPct}%;background:${hpColor}"></div>
                            </div>
                            <span class="text-[10px] font-mono font-bold" style="color:${hpColor}">${hpCur}/${hpMax}</span>
                        </div>
                        <!-- Stats -->
                        <div class="grid grid-cols-4 gap-0.5 text-[9px] text-on-surface-variant font-mono mt-1.5">
                            <div>STR <span class="text-on-surface">${h.attributes ? h.attributes.str : '-'}</span></div>
                            <div>DEX <span class="text-on-surface">${h.attributes ? h.attributes.dex : '-'}</span></div>
                            <div>MAN <span class="text-on-surface">${h.attributes ? h.attributes.mana : '-'}</span></div>
                            <div>BWG <span class="text-on-surface">${h.attributes ? h.attributes.mov : '-'}</span></div>
                        </div>
                    </div>
                </div>

                <!-- WEAPONS ROW -->
                ${ (eq.melee || eq.ranged) ? `
                <div class="border-t border-outline-variant/15 pt-2">
                    <span class="text-[9px] uppercase tracking-wider text-on-surface-variant mb-1.5 block">Waffen</span>
                    <div class="flex gap-2 flex-wrap">
                        ${buildWeaponThumb(eq.melee, 'Nahkampf')}
                        ${buildWeaponThumb(eq.ranged, 'Fernkampf')}
                    </div>
                </div>` : '' }

                <!-- SPELLS ROW -->
                ${ spells.length > 0 ? `
                <div class="border-t border-outline-variant/15 pt-2">
                    <span class="text-[9px] uppercase tracking-wider text-secondary mb-1.5 block">Angelegte Magie (${spells.length})</span>
                    <div class="flex gap-2 flex-wrap">
                        ${spellThumbs}
                    </div>
                </div>` : '' }
            `;
            list.appendChild(card);
        });

        // Save party button at bottom of list
        const saveRow = document.createElement('div');
        saveRow.className = "mt-1 pt-3 border-t border-outline-variant/20";
        saveRow.innerHTML = `
            <button onclick="window.SyncManager.saveParty()"
                class="w-full flex items-center justify-center gap-2 bg-surface-container-high text-secondary border border-secondary/30
                       font-bold py-2.5 rounded-sm hover:bg-surface-container-highest hover:border-secondary/60 active:scale-95
                       transition-all text-[11px] uppercase tracking-widest">
                <span class="material-symbols-outlined text-base">save</span>
                Partie speichern
            </button>
        `;
        list.appendChild(saveRow);

        const startBtn = document.getElementById('btn-lobby-start');
        if (startBtn) {
            if (this.isHost) {
                startBtn.classList.remove('hidden');
                const allReady = Object.values(this.players).every(p => p.online);
                startBtn.disabled = !allReady;
                if (allReady) {
                    startBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                } else {
                    startBtn.classList.add('opacity-50', 'cursor-not-allowed');
                }
            } else {
                startBtn.classList.add('hidden');
            }
        }
    },

    zoomImage(src, title) {
        const existing = document.getElementById('sync-image-zoom');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'sync-image-zoom';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(0,0,0,0.92);backdrop-filter:blur(6px);cursor:zoom-out;animation:fadeIn .15s ease-out';
        overlay.onclick = () => overlay.remove();
        overlay.innerHTML = `
            <div style="position:relative;max-width:480px;width:100%;" onclick="event.stopPropagation()">
                <button onclick="document.getElementById('sync-image-zoom').remove()"
                    style="position:absolute;top:-14px;right:-14px;z-index:1;width:32px;height:32px;border-radius:50%;background:#211f1d;border:1px solid rgba(212,197,159,0.3);color:#e4c375;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:18px;line-height:1">
                    &times;
                </button>
                <img src="${src}" alt="${title || ''}" style="width:100%;border-radius:4px;border:2px solid rgba(228,195,117,0.3);box-shadow:0 25px 60px rgba(0,0,0,0.8);display:block;object-fit:contain;max-height:70vh;">
                ${title ? `<p style="text-align:center;color:#e4c375;font-family:'Newsreader',serif;font-size:14px;margin-top:10px;font-style:italic;">${title}</p>` : ''}
            </div>
        `;
        document.body.appendChild(overlay);
    },

    renderDiscoveredParties() {
        const list = document.getElementById('discovered-parties-list');
        if (!list) return;

        list.innerHTML = "";
        const parties = Object.values(this.discoveredParties);
        if (parties.length === 0) {
            list.innerHTML = `<p class="text-center italic text-on-surface-variant py-4 text-xs">Suche nach geöffneten Partien...</p>`;
            return;
        }

        parties.forEach(p => {
            const row = document.createElement('div');
            row.className = "flex justify-between items-center p-3 bg-surface-variant/40 hover:bg-surface-variant/70 border border-outline-variant/20 rounded-sm mb-2 cursor-pointer transition-all";
            row.onclick = () => {
                this.joinParty(p.partyName);
            };
            row.innerHTML = `
                <div class="flex flex-col">
                    <span class="font-bold text-secondary text-sm uppercase">${p.partyName}</span>
                    <span class="text-[10px] text-on-surface-variant">Spielleiter: ${p.hostName}</span>
                </div>
                <button class="bg-secondary text-on-secondary px-3 py-1 text-[10px] font-bold uppercase rounded-sm">BEITRETEN</button>
            `;
            list.appendChild(row);
        });
    },

    renderSavedParties() {
        const list = document.getElementById('saved-parties-list');
        if (!list) return;

        list.innerHTML = "";
        const savedList = JSON.parse(localStorage.getItem('stitch_rpg_party_saves') || "[]");
        if (savedList.length === 0) {
            list.innerHTML = `<p class="text-center italic text-on-surface-variant py-4 text-xs">Keine gespeicherten Partien vorhanden.</p>`;
            return;
        }

        savedList.forEach(name => {
            const dataStr = localStorage.getItem('stitch_rpg_party_save_' + name);
            if (!dataStr) return;
            const data = JSON.parse(dataStr);
            const playerNames = Object.values(data.players).map(p => p.name).join(", ");

            const row = document.createElement('div');
            row.className = "flex flex-col p-3 bg-surface-variant/40 border border-outline-variant/20 rounded-sm mb-2";
            row.innerHTML = `
                <div class="flex justify-between items-center border-b border-outline-variant/10 pb-2 mb-2">
                    <span class="font-bold text-secondary text-sm uppercase">${name}</span>
                    <div class="flex gap-2">
                        <button class="bg-red-950/40 text-red-400 border border-red-900/50 px-2 py-1 text-[10px] font-bold rounded-sm hover:bg-red-900/50" onclick="window.SyncManager.deleteParty('${name}')">LÖSCHEN</button>
                        <button class="bg-secondary text-on-secondary px-3 py-1 text-[10px] font-bold rounded-sm hover:brightness-110" onclick="window.SyncManager.resumeParty('${name}')">LADEN</button>
                    </div>
                </div>
                <div class="text-[10px] text-on-surface-variant italic">
                    Spieler: ${playerNames}
                </div>
            `;
            list.appendChild(row);
        });
    }
};

window.addEventListener('DOMContentLoaded', () => {
    window.SyncManager.init();
});
