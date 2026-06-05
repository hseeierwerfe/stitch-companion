console.log("Stitch RPG Companion - Version 4.4");
const APP_VERSION = "4.4";

// Background Music (BGM) Manager
const BGM = {
    ambientSrc: "ambient_soundtrack.mp3",
    battleSrc: "battle_soundtrack.mp3",
    ambientAudio: null,
    battleAudio: null,
    isMuted: false,
    hasStarted: false,
    
    init() {
        this.ambientAudio = new Audio(this.ambientSrc);
        this.ambientAudio.loop = true;
        this.ambientAudio.volume = 0.3;

        this.battleAudio = new Audio(this.battleSrc);
        this.battleAudio.loop = true;
        this.battleAudio.volume = 0.3;

        // Try to start playing upon first user interaction (browser policy compliance)
        const startOnInteraction = () => {
            if (this.hasStarted) return;
            this.hasStarted = true;
            this.update();
            document.removeEventListener('click', startOnInteraction);
            document.removeEventListener('keydown', startOnInteraction);
        };
        document.addEventListener('click', startOnInteraction, { passive: true });
        document.addEventListener('keydown', startOnInteraction, { passive: true });
    },

    update() {
        if (!this.ambientAudio || !this.battleAudio) return;
        
        if (this.isMuted) {
            this.ambientAudio.pause();
            this.battleAudio.pause();
            return;
        }

        const isBattle = (state && state.currentScreen === 'schlachtfeld');

        if (isBattle) {
            if (this.battleAudio.paused) {
                this.battleAudio.play().catch(e => console.log("BGM Error:", e));
            }
            this.ambientAudio.pause();
        } else {
            if (this.ambientAudio.paused) {
                this.ambientAudio.play().catch(e => console.log("BGM Error:", e));
            }
            this.battleAudio.pause();
        }
    },

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.update();
    }
};

window.BGM = BGM;
BGM.init();

const DEFAULT_STATE = {
    hero: {
        name: "Neuer Held",
        level: 0,
        chapter: 1,
        guild: "keine",
        crime: "Unbekannt",
        hp: { current: 10, max: 10 },
        lp: 0,
        xp: { current: 0, next: 100 },
        xpPaused: false,
        ore: 0,
        attributes: { str: 1, dex: 1, mana: 5, mov: 5 },
        armorStats: { weapons: 0, projectiles: 0, magic: 0, fire: 0 },
        equipment: {
            melee: null,
            ranged: null,
            armor: { id: 1, name: "Sträflingsklamotten", value: 0, chapter: 0, effect: "Aura +3 Rüstung", category: "Rüstung", icon: "shield", image: "Bilder Karten/Rüstungen/Kapitel 1 & 2/Sträflingsklamotten.png" },
            artifacts: { amulet: null, ring1: null, ring2: null }
        },
        runes: [],
        talents: [
            { id: "einhand", name: "Einhandkampf", level: 0, max: 2, icon: "swords",
              descs: [
                "Würfle im Nahkampf mit einer Einhandwaffe von nun an mit 2 W6 zur Schadensberechnung, wobei die höhere Augenzahl gewertet wird!",
                "Würfele von nun an zur Schadensberechnung mit Einhandwaffen mit einem weiteren W6 und addiere die Augenzahl der beiden höchsten Ergebnisse!"
              ]},
            { id: "zweihand", name: "Zweihandkampf", level: 0, max: 2, icon: "swords",
              descs: [
                "Deine Zweihandwaffen erhalten ein zusätzliches Feld an Reichweite! Du kannst von nun an in derselben Runde angreifen, nachdem du gelaufen bist, wenn du noch eine Bewegung übrighast! Wenn einem Gegner durch deinen Angriff mit einer Zweihandwaffe Schaden zugefügt wurde, kannst du einen weiteren W6 werfen. Ist das Ergebnis eine 5 oder 6, wird der getroffene Gegner 1 Runde gelähmt.",
                "Verdopple von nun an bei der Schadensberechnung deinen W6 Wurf im Kampf! Würfelst du zur Schadensberechnung eine 6, ignoriere für diesen Angriff ebenfalls die Rüstung des Gegners."
              ]},
            { id: "bogen", name: "Bogenschiessen", level: 0, max: 2, icon: "architecture",
              descs: [
                "In deinem Zug kannst du deinen Gegner 2-mal nacheinander angreifen, bevor der nächste Charakter am Zug ist. In dieser Runde kannst du jedoch keine Bewegung durchführen!",
                "Würfele beim Schadenswurf von nun an mit 2 W6 und addiere die Augenzahl!"
              ]},
            { id: "armbrust", name: "Armbrustschiessen", level: 0, max: 2, icon: "precision_manufacturing",
              descs: [
                "Du kannst dich von nun an vor deinem Angriff mit der Armbrust ein zusätzliches Feld bewegen! Berechne deinen Stärkewert auf den Waffenschaden der Armbrust.",
                "Verringert bei jedem Treffer mit einer Armbrust die Bewegung des Gegners für die nächste Runde um die Hälfte. Du kannst dich vor deinem Angriff 1 weiteres Feld mehr bewegen. Zusätzlich verdopple den angegebenen Waffenschaden, wenn bei deinem W6 zur Schadensberechnung eine 4 oder höher gewürfelt wird."
              ]},
            { id: "magie", name: "Kreise der Magie", level: 0, max: 6, icon: "auto_fix_normal",
              descs: [
                "Deine Zauber verursachen von nun an 1 Bonusschaden an allen anvisierten Gegnern.",
                "Deine Zauber kosten von nun an insgesamt ein Mana weniger. Dies gilt ebenfalls für aufladbare Zauber, jedoch erst, wenn mindestens 1 Mana bezahlt wird. Die Aufladungsstufe zählt von dort an als bezahltes Mana +1.",
                "Du regenerierst in deinem Zug im Kampf für jede Bewegung, welche weder für die Kanalisierung noch für das Wirken von Zaubern aufgewendet wurde, einen Mana-Punkt.",
                "Deine aufladbaren Zauber verursachen von nun an pro tatsächlich verbrauchtem Mana einen Schaden mehr.",
                "Du regenerierst in deinem Zug im Kampf für jede Bewegung, welche weder für die Kanalisierung noch für das Wirken von Zaubern aufgewendet wurde, zwei weitere Mana-Punkte.",
                "Kreis 6 – Du hast alle magischen Kreise gemeistert!"
              ]},
            { id: "schloss", name: "Schlösser öffnen", level: 0, max: 2, icon: "key",
              descs: [
                "Für dich sinkt jeder Truhenspezifische Wert um 2.",
                "Für dich sinkt jeder Truhenspezifische Wert um insgesamt 4."
              ]},
            { id: "praesenz", name: "Überwältigende Präsenz", level: 0, max: 1, icon: "visibility",
              descs: [
                "Gegner weichen in der ersten Runde des Kampfes (sowohl in der manuellen Schlachtfeld-Simulation als auch im automatischen Kampf) 2 Felder vom Charakter zurück."
              ]}
        ],
        inventory: [
            { id: 1, name: "Sträflingsklamotten", value: 0, chapter: 0, effect: "Aura +3 Rüstung", category: "Rüstung", icon: "shield", image: "Bilder Karten/Rüstungen/Kapitel 1 & 2/Sträflingsklamotten.png" }
        ],
        quests: [],
        chronik: [],
        deactivatedQuests: [],
        connectionPoints: []
    },
    currentScreen: "status",
    trading: {
        selectedTrader: null,
        popupCamp: null,
        heroOffer: [],
        traderOffer: [],
        inventoryPopup: { category: null, items: [] },
        quantityPopup: { item: null, amount: 1 }
    },
    inventoryPopup: {
        category: null,
        items: []
    },
    resourcePopup: { type: null },
    talentInfo: null, // Talent object
    findingPopup: { category: null, items: [] },
    losingPopup: { category: null, items: [] },
    findingQuantityPopup: { item: null, amount: 1 },
    losingQuantityPopup: { item: null, amount: 1 },
    heroSelectionPopup: { active: false, selectedHero: null },
    questConfirmationPopup: { active: false, questId: null, text: "" },
    saveSlots: {}, // { "Name": stateData }
    savePopup: { active: false, selectedSlot: null, nameInput: "" },
    loadPopup: { active: false, selectedSlot: null },
    deletePopup: { active: false, selectedSlot: null, confirmActive: false },
    questAcceptancePopup: { active: false, npcName: '', questId: '' },
    questProgressPopup: { active: false, questId: '', currentStep: '' },
    zoomImage: null,
    gameStarted: false,
    combatPopup: { active: false, step: 'mode', passwordInput: '', error: '', selectedEnemy: null },
    combatSimulator: null
};

const HEROES = [
    {
        name: "Konrad der Raufbold",
        crime: "Konrad Raufbold hat drei königliche Wachen gedemütigt, weil er sie im Armdrücken besiegte.",
        quest: "Kämpfe im Alten Lager in der Arena gegen einen Buddler (S 2, G 2, Hp 12, W 1, R 4 er trägt einen Knüppel 1A, +30 Erfahrung) und gewinne!",
        reward: "Permanente Fähigkeit: Konrad benötigt nur die Hälfte (aufgerundet) der benötigten Stärke, um eine Waffe anzulegen.",
        image: "../../Bilder Karten/Helden/Konrad, der Raufbold.jpg"
    },
    {
        name: "Alwin der Jäger",
        crime: "Alwin der Jäger hat die Frau eines Herzogs verführt und ist seitdem der Schürzenjäger.",
        quest: "Bringe 7 Jagdtrophäen in das Neue Lager! Bei jedem Sieg über eine Tierkreatur bekommst du neben einer Belohnung auch eine Jagdtrophäe.",
        reward: "Permanente Fähigkeit: Alwin benötigt nur die Hälfte (aufgerundet) der benötigten Geschicklichkeit, um einen Bogen anzulegen.",
        image: "../../Bilder Karten/Helden/Alwin, der Jäger.jpg"
    },
    {
        name: "Nathan der Reiche",
        crime: "Nathan ist der Besitzer einer Bank und wurde vom König der Ketzerei beschuldigt, um diesen seiner Besitztümer und Reichtümer zu enteignen und diese für seine Truppen zu nutzen.",
        quest: "Erhalte durch Handel mit einem Händler 75 Erz.",
        reward: "Permanente Fähigkeit: Bei jeder Erzgewinnung erhältst du die doppelte Menge. (ausgeschlossen ist der Handel mit Nahrung!)",
        image: "../../Bilder Karten/Helden/Nathan, der Reiche.jpg"
    },
    {
        name: "Ingo der Flotte",
        crime: "Ingo hat Käse gestohlen.",
        quest: "Reise zur Bergfestung und sammle dort eine Schriftrolle, welche du anschließend ins Sektenlager bringst. Lester wird dir die Schriftrolle abnehmen. Lester muss zu diesem Zweck aufgedeckt sein.",
        reward: "Permanente Fähigkeit: Du kannst zu Beginn deines Zuges deine ganzen Aktionskarten abwerfen, um in eines der drei Lager zu reisen. Ingo regeneriert 1 Hp für jede ausgespielte Gelände-Bewegen-Aktionskarte und erhält +2 Bewegung im Kampf.",
        image: "../../Bilder Karten/Helden/Ingo, der Flotte.jpg"
    },
    {
        name: "Ralf der Haudegen",
        crime: "Ralf hat in einer Kneipe die Wache des Richters totgeschlagen.",
        quest: "Gewinne 8 Kämpfe gemeinsam mit einem Mitspieler oder besiege 3 Monster der Stufe 3 allein.",
        reward: "Permanente Fähigkeit: Du kannst im Kampf zur Schadensberechnung immer einen Extrawürfel verwenden! Das höchste Ergebnis zählt!",
        image: "../../Bilder Karten/Helden/Ralf, der Haudegen.jpg"
    },
    {
        name: "Feiwel der Feigling",
        crime: "Feiwel ist im Orkkrieg desertiert.",
        quest: "Erhalte 100 Erfahrungspunkte, ohne zu kämpfen!",
        reward: "Permanente Fähigkeit: Du kannst aus jedem Kampf flüchten, ohne eine Fluchtkarte zu verwenden. Deine Fluchtkarte kann von nun an jede andere verfügbare Aktionskarte ersetzen. Wenn du dies machst, erhältst du 30 Erfahrung pro veränderter Fluchtkarte (Pro Runde max. 1x)",
        image: "../../Bilder Karten/Helden/Feiwel, der Feigling.jpg"
    },
    {
        name: "Manfred der Stämmige",
        crime: "Manfred hat neben einem Apfel, zwei Schinken, drei Laibe Brot, fünf Käselaibe und 8 Bierfässer gestohten.",
        quest: "Verwende Nahrungskarten, die 15 Lebenspunkte wiederherstellen würden, obwohl dein Leben vollständig regeneriert ist!",
        reward: "Permanente Fähigkeit: Bei einem Levelaufstieg erhältst du immer 4 Hp. Du musst für deine Rüstungen doppelt so viel Erz zahlen, da sie angepasst werden müssen. Manfred kann insgesamt nur ein Artefakt anlegen. Er erhält -2 Bewegung im Kampf.",
        image: "../../Bilder Karten/Helden/Manfred, der Stämmige.jpg"
    },
    {
        name: "Josef der Glückspilz",
        crime: "Josef hat auf der Straße den Geldbeutel eines Adligen gefunden und wurde des Diebstahls bezichtigt.",
        quest: "Benutze 6 Plündern Karten!",
        reward: "Permanente Fähigkeit: In Kreaturenkämpfen kannst du innerhalb einer Klasse einen Gegner aussuchen. Plündern gibt zusätzliche Erfahrung in Höhe eines W6 x Kapitel x 10. Einmal pro Zug darf ein W6 um +1/-1 manipuliert werden, wobei der Zeitpunkt keine Rolle spielt.",
        image: "../../Bilder Karten/Helden/Josef, der Glückspilz.jpg"
    },
    {
        name: "Ludwig der Präsente",
        crime: "Ludwig war zur falschen Zeit am falschen Ort.",
        quest: "Beende 2 Kämpfe mit einem Zauber.",
        reward: "Permanente Fähigkeit: Pro Lernpunkt (LP) erhältst du 10 Mana anstatt 5. Zusätzlich kostet das Lernen magischer Kreise kein Erz, da die Magier deine Präsenz wahrnehmen und dich gerne kostenlos unterrichten.",
        image: "../../Bilder Karten/Helden/Ludwig, der Präsente.jpg"
    }
];

HEROES.forEach(h => {
    if (h.image) h.image = h.image.replace("../../", "");
});

// --- Questgegenstände Registry ---
const QUEST_ITEMS_DB = {
    "Gefälschter Siegelring": {
        name: "Gefälschter Siegelring",
        value: 50,
        category: "Questgegenstände",
        art: "Artefakt",
        effect: "Keiner",
        image: "bilder_karten/questkarten/gefaelscher_siegelring.jpg",
        icon: "key"
    },
    "Schartige Buddlerzucht": {
        name: "Schartige Buddlerzucht",
        value: 30,
        category: "Questgegenstände",
        class: 3,
        style: "Nahkampf",
        art: "Einhandwaffe",
        req: "2 STR",
        damage: 3,
        type: "Klingenwaffe",
        ability: "Keine",
        image: "bilder_karten/questkarten/schartige_buddlerzucht.jpg",
        icon: "swords"
    },
    "Schläferbrosche": {
        name: "Schläferbrosche",
        value: 50,
        category: "Questgegenstände",
        image: "bilder_karten/questkarten/schlaeferbrosche.jpg",
        icon: "key"
    },
    "Ration Traumruf": {
        name: "Ration Traumruf",
        value: 100,
        category: "Questgegenstände",
        art: "Konsum",
        effect: "+10 maximales Mana",
        image: "bilder_karten/questkarten/rationtraumruf.jpg",
        icon: "restaurant"
    },
    "Reste Ration Traumruf": {
        name: "Reste Ration Traumruf",
        value: 60,
        category: "Questgegenstände",
        art: "Konsum",
        effect: "+6 maximales Mana",
        image: "bilder_karten/questkarten/angebrochene_ration.png",
        icon: "restaurant"
    },
    "Minecrawlerzangen": {
        name: "Minecrawlerzangen",
        value: 10,
        category: "Questgegenstände",
        image: "bilder_karten/questkarten/crawlerzangen.jpg",
        icon: "key"
    },
    "Ring der Präsenz": {
        name: "Ring der Präsenz",
        value: 50,
        category: "Questgegenstände",
        art: "Artefakt",
        effect: "Aura: Spüre eine Präsenz. Wenn getragen von Ludwig der Präsente, erhalte den Effekt Überwältigende Präsenz",
        image: "bilder_karten/questkarten/ring_der_praesenz.jpg",
        icon: "trip_origin"
    },
    "Pachos Finger": {
        name: "Pachos Finger",
        value: 0,
        category: "Questgegenstände",
        image: "bilder_karten/questkarten/pachosfinger.jpg",
        icon: "key"
    },
    "Diegos Paket": {
        name: "Diegos Paket",
        value: 300,
        category: "Questgegenstände",
        image: "bilder_karten/questkarten/diegospaket.jpg",
        icon: "key"
    },
    "Nyras Spruchrolle": {
        name: "Nyras Spruchrolle",
        value: 20,
        category: "Questgegenstände",
        art: "Spruchrolle",
        maxCapacity: 1,
        style: "Sofort",
        element: "Schläfer",
        reqMana: 5,
        damage: 0,
        effect: "Schlaf 3",
        image: "bilder_karten/questkarten/nyras_spruchrolle.jpg",
        icon: "auto_stories"
    },
    "Nyras Karte": {
        name: "Nyras Karte",
        value: 50,
        category: "Questgegenstände",
        image: "bilder_karten/questkarten/nyraskarte.jpg",
        icon: "key"
    },
    "Nyras Bild": {
        name: "Nyras Bild",
        value: 200,
        category: "Questgegenstände",
        image: "bilder_karten/questkarten/nyras_bild.jpg",
        icon: "key"
    },
    "Jorus Rock": {
        name: "Jorus Rock",
        value: 10,
        category: "Questgegenstände",
        image: "bilder_karten/questkarten/jorus_rock.jpg",
        icon: "key"
    },
    "Jorus Traumruf": {
        name: "Jorus Traumruf",
        value: 20,
        category: "Questgegenstände",
        art: "Konsum",
        effect: "+3 maximales Mana",
        image: "bilder_karten/questkarten/jorus_traumruf.jpg",
        icon: "restaurant"
    },
    "Jorus Zettel": {
        name: "Jorus Zettel",
        value: 200,
        category: "Questgegenstände",
        image: "bilder_karten/questkarten/jorus_zettel.jpg",
        icon: "key"
    },
    "Schläferpilz": {
        name: "Schläferpilz",
        value: 20,
        category: "Questgegenstände",
        image: "bilder_karten/questkarten/schlaeferpilz.jpg",
        icon: "key"
    },
    "Amulett des freien Rückens": {
        name: "Amulett des freien Rückens",
        value: 100,
        category: "Questgegenstände",
        art: "Artefakt",
        effect: "Aura +1 Rüstung",
        image: "bilder_karten/questkarten/amulettdes_passaufdeinenrueckenauf.jpg",
        icon: "trip_origin"
    },
    "Siegelring der Wassermagier": {
        name: "Siegelring der Wassermagier",
        value: 100,
        category: "Questgegenstände",
        image: "bilder_karten/questkarten/siegelring.jpg",
        icon: "key"
    },
    "Lares Filzläuse": {
        name: "Lares Filzläuse",
        value: 1,
        category: "Questgegenstände",
        image: "bilder_karten/questkarten/laresfilzlaeuse.jpg",
        icon: "key"
    },
    "Gomez Truhe": {
        name: "Gomez Truhe",
        value: 0,
        category: "Questgegenstände",
        image: "bilder_karten/questkarten/gomez_truhe.jpg",
        icon: "key"
    },
    "Prunkvoller Helm": {
        name: "Prunkvoller Helm",
        value: 200,
        category: "Questgegenstände",
        art: "Artefakt",
        effect: "Aura +2 Rüstung",
        image: "bilder_karten/questkarten/prunkvoller_helm.jpg",
        icon: "shield"
    },
    "Teleport Tempelplatz": {
        name: "Teleport Tempelplatz",
        value: 30,
        category: "Questgegenstände",
        art: "Spruchrolle",
        maxCapacity: 1,
        style: "Sofort",
        element: "Schläfer",
        reqMana: 5,
        damage: 0,
        effect: "Teleport zum Tempelvorplatz",
        image: "bilder_karten/questkarten/telesumpf.jpg",
        icon: "auto_stories"
    },
    "Verwandlung Fleischwanze": {
        name: "Verwandlung Fleischwanze",
        value: 30,
        category: "Questgegenstände",
        art: "Spruchrolle",
        maxCapacity: 1,
        style: "Sofort",
        element: "Verwandlung",
        reqMana: 5,
        damage: 0,
        effect: "Verwandlung in eine Fleischwanze",
        image: "bilder_karten/questkarten/verwandlung_fleischwanze.jpg",
        icon: "auto_stories"
    },
    "Extrakt reiner Magie": {
        name: "Extrakt reiner Magie",
        value: 100,
        category: "Questgegenstände",
        art: "Konsum",
        effect: "+5 maximales Mana",
        image: "bilder_karten/questkarten/extrakt_reiner_magie.jpg",
        icon: "restaurant"
    },
    "Scavengerkopf": {
        name: "Scavengerkopf",
        value: 10,
        category: "Questgegenstände",
        image: "bilder_karten/questkarten/scavengerkopf.jpg",
        icon: "key"
    },
    "Scavengerhelm": {
        name: "Scavengerhelm",
        value: 50,
        category: "Questgegenstände",
        art: "Artefakt",
        effect: "Aura +1 Rüstung",
        image: "bilder_karten/questkarten/scavengerhelm.jpg",
        icon: "shield"
    },
    "Xardas Botschaft": {
        name: "Xardas Botschaft",
        value: 0,
        category: "Questgegenstände",
        image: "bilder_karten/questkarten/xardas_botschaft.jpg",
        icon: "key"
    },
    "Drax Bogen": {
        name: "Drax Bogen",
        value: 40,
        category: "Questgegenstände",
        class: 2,
        style: "Fernkampf",
        art: "Bogen",
        req: "2 DEX",
        damage: 3,
        ability: "+1 Schaden gegen Allesfresser",
        image: "bilder_karten/questkarten/drax_bogen.jpg",
        icon: "precision_manufacturing"
    },
    "Troll beschwören": {
        name: "Troll beschwören",
        value: 50,
        category: "Questgegenstände",
        art: "Spruchrolle",
        maxCapacity: 1,
        style: "Sofort",
        element: "Beschwörung",
        reqMana: 10,
        damage: 0,
        effect: "Ein Troll erscheint",
        image: "bilder_karten/questkarten/trollbeschwoeren.jpg",
        icon: "auto_stories"
    },
    "Oruns Keule": {
        name: "Oruns Keule",
        value: 10,
        category: "Questgegenstände",
        class: 3,
        style: "Nahkampf",
        art: "Einhandwaffe",
        req: "1 STR",
        damage: 3,
        type: "Stumpfe Waffe",
        ability: "Betäubt Blutfliegen bei 2 oder weniger HP",
        image: "bilder_karten/questkarten/orunskeule.jpg",
        icon: "swords"
    },
    "Lukors Brief": {
        name: "Lukors Brief",
        value: 2,
        category: "Questgegenstände",
        image: "bilder_karten/questkarten/lukorsbrief.jpg",
        icon: "key"
    },
    "Magische Reinigung": {
        name: "Magische Reinigung",
        value: 1,
        category: "Questgegenstände",
        art: "Spruchrolle",
        maxCapacity: 1,
        style: "Sofort",
        element: "Schläfer",
        reqMana: 5,
        damage: 0,
        effect: "Spirituelle Reinigung",
        image: "bilder_karten/questkarten/magische_reinigung.jpg",
        icon: "auto_stories"
    },
    "Miltens Zettel": {
        name: "Miltens Zettel",
        value: 50,
        category: "Questgegenstände",
        image: "bilder_karten/questkarten/miltens_zettel.jpg",
        icon: "key"
    },
    "Trank des puren Lebens": {
        name: "Trank des puren Lebens",
        value: 50,
        category: "Questgegenstände",
        art: "Konsum",
        effect: "+1 maximales Leben",
        image: "bilder_karten/questkarten/trank_des_puren_lebens.jpg",
        icon: "restaurant"
    },
    "Eisenamulett": {
        name: "Eisenamulett",
        value: 40,
        category: "Questgegenstände",
        art: "Artefakt",
        effect: "Aura +1 Rüstung",
        image: "Bilder Karten/Ausrüstung/Kapitel 1 & 2/Eisenamulett.png",
        icon: "trip_origin"
    },
    "Amulett der Überdauerung": {
        name: "Amulett der Überdauerung",
        value: 40,
        category: "Questgegenstände",
        art: "Artefakt",
        effect: "Aura +3 Lebenspunkte",
        image: "Bilder Karten/Ausrüstung/Kapitel 1 & 2/Amulett der Überdauerung.png",
        icon: "trip_origin"
    },
    "Ring der Geistesratsamkeit": {
        name: "Ring der Geistesratsamkeit",
        value: 30,
        category: "Questgegenstände",
        art: "Artefakt",
        effect: "Aura +5 Mana",
        image: "Bilder Karten/Ausrüstung/Kapitel 1 & 2/Ring der Geistesratsamkeit.png",
        icon: "trip_origin"
    }
};

const QUESTS_DATA = window.QUESTS_DATA;

// --- Quest Helper Functions ---
window.lootItem = lootItem;

window.gainQuestItem = function(itemName, count = 1) {
    let itemTemplate = QUEST_ITEMS_DB[itemName];
    if (!itemTemplate) {
        // Fallback: search in standard itemPools
        const allPools = Object.values(itemPools).flat();
        itemTemplate = allPools.find(i => i.name === itemName);
    }
    if (!itemTemplate) {
        console.warn("Item not found in QUEST_ITEMS_DB or standard pools:", itemName);
        return;
    }
    for (let i = 0; i < count; i++) {
        state.hero.inventory.push({
            ...itemTemplate,
            id: Date.now() + Math.random(),
            count: 1
        });
    }
};

window.loseQuestItem = function(itemName, count = 1) {
    let lost = 0;
    state.hero.inventory = state.hero.inventory.filter(item => {
        if (item.name === itemName && lost < count) {
            lost++;
            return false;
        }
        return true;
    });
};

window.gainOre = function(amount) {
    if (!state.hero.ore) state.hero.ore = 0;
    state.hero.ore += amount;
};

window.loseOre = function(amount) {
    if (!state.hero.ore) state.hero.ore = 0;
    state.hero.ore = Math.max(0, state.hero.ore - amount);
};

window.gainConnectionPoint = function(campName) {
    if (!state.hero.connectionPoints) state.hero.connectionPoints = [];
    if (!state.hero.connectionPoints.includes(campName)) {
        state.hero.connectionPoints.push(campName);
    }
};

window.loseConnectionPoint = function(campName) {
    if (!state.hero.connectionPoints) state.hero.connectionPoints = [];
    const idx = state.hero.connectionPoints.indexOf(campName);
    if (idx !== -1) {
        state.hero.connectionPoints.splice(idx, 1);
    }
};

const basePath = "Bilder Karten";

const CAMP_DATA = {
    "Altes Lager": {
        npcs: [
            { name: "Cavalorn", roles: ["H", "L"], img: `${basePath}/Personen/Händler/Cavalorn.png` },
            { name: "Dexter", roles: ["H", "Q"], img: `${basePath}/Personen/Händler/Dexter.png` },
            { name: "Fisk", roles: ["H"], img: `${basePath}/Personen/Händler/Fisk.png` },
            { name: "Huno", roles: ["H"], img: `${basePath}/Personen/Händler/Huno.png` },
            { name: "Scorpio", roles: ["H", "L"], img: `${basePath}/Personen/Händler/Scorpio.png` },
            { name: "Skip", roles: ["H"], img: `${basePath}/Personen/Händler/Skip.png` },
            { name: "Torrez", roles: ["H", "L"], img: `${basePath}/Personen/Händler/Torrez.png` },
            { name: "Diego", roles: ["L", "Q"], img: `${basePath}/Personen/Lehrer/Diego.png` },
            { name: "Thorus", roles: ["L", "Q"], img: `${basePath}/Personen/Lehrer/Thorus.png` },
            { name: "Fingers", roles: ["L"], img: `${basePath}/Personen/Lehrer/Fingers.png` },
            { name: "Scatty", roles: ["L"], img: `${basePath}/Personen/Lehrer/Scatty.png` },
            { name: "Milten", roles: ["Q"], img: `${basePath}/Personen/Quest/Milten.png` },
            { name: "Bloodwyn", roles: ["Q"], img: `${basePath}/Personen/Quest/Bloodwyn.png` },
            { name: "Sly", roles: ["Q"], img: `${basePath}/Personen/Quest/Sly.png` },
            { name: "Whistler", roles: ["Q"], img: `${basePath}/Personen/Quest/Whistler.png` },
            { name: "Scar", roles: ["Q"], img: `${basePath}/Personen/Quest/Scar.png` },
            { name: "Fletcher", roles: ["Q"], img: `${basePath}/Personen/Quest/Fletcher.png` },
            { name: "Baal Parvez", roles: ["Q"], img: `${basePath}/Personen/Quest/Baal Parvez.png` },
            { name: "Nek", roles: ["Q"], img: `${basePath}/Personen/Quest/Nek.png` }
        ]
    },
    "Neues Lager": {
        npcs: [
            { name: "Cipher", roles: ["H"], img: `${basePath}/Personen/Händler/Cipher.png` },
            { name: "Cronos", roles: ["H", "L"], img: `${basePath}/Personen/Händler/Cronos.png` },
            { name: "Mordrag", roles: ["H", "Q"], img: `${basePath}/Personen/Händler/Mordrag.png` },
            { name: "Riordian", roles: ["H"], img: `${basePath}/Personen/Händler/Riordian.png` },
            { name: "Sharky", roles: ["H"], img: `${basePath}/Personen/Händler/Sharky.png` },
            { name: "Wolf", roles: ["H", "L", "Q"], img: `${basePath}/Personen/Händler/Wolf.png` },
            { name: "Cord", roles: ["L"], img: `${basePath}/Personen/Lehrer/Cord.png` },
            { name: "Drax", roles: ["Q"], img: `${basePath}/Personen/Lehrer/Drax.png` },
            { name: "Lares", roles: ["L", "Q"], img: `${basePath}/Personen/Lehrer/Lares.png` },
            { name: "Lee", roles: ["L"], img: `${basePath}/Personen/Lehrer/Lee.png` },
            { name: "Wedge", roles: ["L"], img: `${basePath}/Personen/Lehrer/Wedge.png` },
            { name: "Buster", roles: ["Q"], img: `${basePath}/Personen/Quest/Buster.png` },
            { name: "Gorn", roles: ["Q"], img: `${basePath}/Personen/Quest/Gorn.png` },
            { name: "Homer", roles: ["Q"], img: `${basePath}/Personen/Quest/Homer.png` },
            { name: "Jarvis", roles: ["Q"], img: `${basePath}/Personen/Quest/Jarvis.png` },
            { name: "Saturas", roles: ["Q"], img: `${basePath}/Personen/Quest/Saturas.png` },
            { name: "Shrike", roles: ["Q"], img: `${basePath}/Personen/Quest/Shrike.png` },
            { name: "Torlorf", roles: ["Q"], img: `${basePath}/Personen/Quest/Torlorf.png` }
        ]
    },
    "Sektenlager": {
        npcs: [
            { name: "Baal Kadar", roles: ["H", "L"], img: `${basePath}/Personen/Händler/Baal Cadar.png` },
            { name: "Baal Namib", roles: ["H"], img: `${basePath}/Personen/Händler/Baal Namib.png` },
            { name: "Cor Kalom", roles: ["H", "Q"], img: `${basePath}/Personen/Händler/Cor Kalom.png` },
            { name: "Darrion", roles: ["H", "L"], img: `${basePath}/Personen/Händler/Darrion.png` },
            { name: "Fortuno", roles: ["H"], img: `${basePath}/Personen/Händler/Fortuno.png` },
            { name: "Joru", roles: ["H", "Q"], img: `${basePath}/Personen/Händler/Joru.png` },
            { name: "Gor Na Toth", roles: ["H", "L"], img: `${basePath}/Personen/Händler/Gor Na Toth.png` },
            { name: "Baal Tyon", roles: ["L", "Q"], img: `${basePath}/Personen/Lehrer/Baal Tyon.png` },
            { name: "Cor Angar", roles: ["L", "Q"], img: `${basePath}/Personen/Lehrer/Cor Angar.png` },
            { name: "Gor Na Drak", roles: ["L", "Q"], img: `${basePath}/Personen/Lehrer/Gor Na Drak.png` },
            { name: "Lester", roles: ["L", "Q"], img: `${basePath}/Personen/Lehrer/Lester.png` },
            { name: "Baal Orun", roles: ["Q"], img: `${basePath}/Personen/Quest/Baal Orun.png` },
            { name: "Baal Tondral", roles: ["Q"], img: `${basePath}/Personen/Quest/Baal Tondral.png` },
            { name: "Caine", roles: ["Q"], img: `${basePath}/Personen/Quest/Caine.png` },
            { name: "Nyras", roles: ["Q"], img: `${basePath}/Personen/Quest/Nyras.png` },
            { name: "Y´Berion", roles: ["Q"], img: `${basePath}/Personen/Quest/Y´Berion.png` }
        ]
    }
};

const TEACHER_DATA = {
    "Fingers": ["Geschick", "Schlösser öffnen"],
    "Cavalorn": ["Geschick", "Fernkampf", "Jagd"],
    "Scatty": ["Nahkampf"],
    "Diego": ["Stärke", "Geschick"],
    "Thorus": ["Stärke", "Nahkampf"],
    "Scorpio": ["Fernkampf"],
    "Torrez": ["Magie"],
    "Lares": ["Stärke", "Geschick"],
    "Cronos": ["Magie"],
    "Drax": ["Fernkampf"],
    "Cord": ["Nahkampf"],
    "Wolf": ["Geschick", "Fernkampf"],
    "Wedge": ["Nahkampf", "Schlösser öffnen"],
    "Lee": ["Stärke", "Geschick", "Nahkampf"],
    "Gor Na Toth": ["Stärke", "Geschick", "Jagd"],
    "Cor Angar": ["Stärke", "Nahkampf"],
    "Baal Tyon": ["Geschick", "Magie"],
    "Baal Kadar": ["Magie"],
    "Lester": ["Stärke", "Geschick", "Schlösser öffnen"],
    "Gor Na Drak": ["Nahkampf", "Fernkampf"],
    "Darrion": ["Stärke", "Schlösser öffnen"]
};

window.openTeacherPopup = function(name) {
    if (!state.teacherPopup) state.teacherPopup = {};
    state.teacherPopup.active = true;
    state.teacherPopup.name = name;
    state.teacherPopup.skills = TEACHER_DATA[name] || ["Unbekannt"];
    render();
};

window.closeTeacherPopup = function() {
    if (state.teacherPopup) state.teacherPopup.active = false;
    render();
};

window.teacherNavigateToStatus = function() {
    if (state.teacherPopup) state.teacherPopup.active = false;
    navigateTo('status');
    setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function isNpcAvailable(camp, npcIdx) {
    const npc = CAMP_DATA[camp].npcs[npcIdx];
    if (!npc) return false;
    
    // Check if NPC is exclusively a quest-giver (roles === ['Q'])
    const isExclusiveQ = npc.roles.length === 1 && npc.roles[0] === 'Q';
    if (isExclusiveQ) {
        // If quest has been accepted, delegated, or completed, they disappear from pool
        const accepted = state.hero.quests && state.hero.quests.some(q => q.giver === npc.name);
        const delegated = state.hero.deactivatedQuests && state.hero.deactivatedQuests.includes(npc.name);
        const chronik = state.hero.chronik && state.hero.chronik.some(c => c.giver === npc.name);
        if (accepted || delegated || chronik) {
            return false;
        }
    }
    return true;
}

window.checkCampActiveReplacements = function() {
    const campNames = ["Altes Lager", "Neues Lager", "Sektenlager"];
    campNames.forEach(camp => {
        if (!state.hero.campState || !state.hero.campState[camp]) return;
        const active = state.hero.campState[camp].active || [];
        let changed = false;
        const newActive = active.map(idx => {
            if (!isNpcAvailable(camp, idx)) {
                changed = true;
                // Draw a replacement
                const npcsCount = CAMP_DATA[camp].npcs.length;
                const availableIndices = [];
                for (let i = 0; i < npcsCount; i++) {
                    if (isNpcAvailable(camp, i) && !active.includes(i)) {
                        availableIndices.push(i);
                    }
                }
                if (availableIndices.length > 0) {
                    let pool = state.hero.campState[camp].pool || [];
                    const validPool = pool.filter(pIdx => availableIndices.includes(pIdx));
                    if (validPool.length > 0) {
                        const rep = validPool.pop();
                        state.hero.campState[camp].pool = pool.filter(pIdx => pIdx !== rep);
                        return rep;
                    } else {
                        return availableIndices[Math.floor(Math.random() * availableIndices.length)];
                    }
                }
            }
            return idx;
        });
        if (changed) {
            state.hero.campState[camp].active = newActive;
        }
    });
};

function initCampState() {
    if (!state.hero.campState) state.hero.campState = {};
    const campNames = ["Altes Lager", "Neues Lager", "Sektenlager"];
    campNames.forEach(camp => {
        if (!state.hero.campState[camp] || !state.hero.campState[camp].active) {
            state.hero.campState[camp] = { active: [], pool: [] };
            drawCampCharacters(camp, 3);
        }
    });
}

function drawCampCharacters(camp, count) {
    const active = [];
    const npcsCount = CAMP_DATA[camp].npcs.length;
    
    // Generate full list of available NPC indices for this camp
    const availableIndices = [];
    for (let i = 0; i < npcsCount; i++) {
        if (isNpcAvailable(camp, i)) {
            availableIndices.push(i);
        }
    }
    
    const targetCount = Math.min(count, availableIndices.length);
    
    for (let i = 0; i < targetCount; i++) {
        if (!state.hero.campState[camp].pool || state.hero.campState[camp].pool.length === 0) {
            state.hero.campState[camp].pool = [...availableIndices];
            shuffleArray(state.hero.campState[camp].pool);
        }
        
        state.hero.campState[camp].pool = state.hero.campState[camp].pool.filter(idx => availableIndices.includes(idx));
        
        if (state.hero.campState[camp].pool.length === 0) {
            state.hero.campState[camp].pool = [...availableIndices];
            shuffleArray(state.hero.campState[camp].pool);
        }
        
        let nextIdx = state.hero.campState[camp].pool.pop();
        
        if (active.includes(nextIdx)) {
            let foundIdx = -1;
            for (let j = state.hero.campState[camp].pool.length - 1; j >= 0; j--) {
                if (!active.includes(state.hero.campState[camp].pool[j])) {
                    foundIdx = j;
                    break;
                }
            }
            if (foundIdx !== -1) {
                const temp = nextIdx;
                nextIdx = state.hero.campState[camp].pool[foundIdx];
                state.hero.campState[camp].pool[foundIdx] = temp;
            } else {
                for (let idx of availableIndices) {
                    if (!active.includes(idx)) {
                        nextIdx = idx;
                        break;
                    }
                }
            }
        }
        active.push(nextIdx);
    }
    state.hero.campState[camp].active = active;
}

function nextRound() {
    const campNames = ["Altes Lager", "Neues Lager", "Sektenlager"];
    if (!state.hero.campState) initCampState();
    campNames.forEach(camp => {
        drawCampCharacters(camp, 3);
    });
    render();
    if (typeof saveGame === 'function') saveGame();
}

// --- Core Logic ---

window.navigateTo = function(screen) {
    if (screen === 'startseite' && state.currentScreen !== 'startseite') {
        state.previousScreen = state.currentScreen;
    }
    state.currentScreen = screen;
    render();
};

function updateState(updater) {
    updater(state);
    render();
}

function saveGameWithName(name) {
    state.saveSlots[name] = JSON.parse(JSON.stringify(state.hero));
    try { localStorage.setItem('stitch_rpg_saves', JSON.stringify(state.saveSlots)); } catch(e) { console.warn('localStorage error:', e); }
    state.savePopup = { active: false, selectedSlot: null, nameInput: "" };
    render();
}

function loadGameByName(name) {
    const savedHero = state.saveSlots[name];
    if (savedHero) {
        state.hero = JSON.parse(JSON.stringify(savedHero));
        window.normalizeLoadedHero(state.hero);
        state.gameStarted = true;
        state.loadPopup = { active: false, selectedSlot: null };
        navigateTo('status');
        saveGame();
    }
}

function deleteGameByName(name) {
    delete state.saveSlots[name];
    try { localStorage.setItem('stitch_rpg_saves', JSON.stringify(state.saveSlots)); } catch(e) { console.warn('localStorage error:', e); }
    state.deletePopup = { active: false, selectedSlot: null, confirmActive: false };
    render();
}

function openSavePopup() { state.savePopup.active = true; render(); }
function openLoadPopup() { state.loadPopup.active = true; render(); }
function openDeletePopup(name) { state.deletePopup = { active: true, selectedSlot: name, confirmActive: false }; render(); }

function saveGame() {
    if (window.syncAuraHp) window.syncAuraHp();
    try { localStorage.setItem('stitch_rpg_state', JSON.stringify(state)); } catch(e) { console.warn('localStorage error:', e); }
    console.log("Spielstand automatisch gespeichert.");
}

function loadGame(silent = false) {
    let saved = null;
    try { saved = localStorage.getItem('stitch_rpg_state'); } catch(e) { console.warn('localStorage error:', e); }
    if (saved) {
        try {
            const loadedState = JSON.parse(saved);
            state = JSON.parse(JSON.stringify(DEFAULT_STATE));
            Object.assign(state.hero, loadedState.hero || {});
            
            window.normalizeLoadedHero(state.hero);

            state.trading = JSON.parse(JSON.stringify(DEFAULT_STATE.trading));
            state.inventoryPopup = JSON.parse(JSON.stringify(DEFAULT_STATE.inventoryPopup));
            state.findingPopup = { category: null, items: [] };
            state.losingPopup = { category: null, items: [] };
            state.findingQuantityPopup = { item: null, amount: 1 };
            state.losingQuantityPopup = { item: null, amount: 1 };
            state.zoomImage = null;
            state.combatPopup = { active: false, step: 'mode', passwordInput: '', error: '' };
            state.questAcceptancePopup = { active: false, npcName: '', questId: '' };
            state.questProgressPopup = { active: false, questId: '', currentStep: '' };
            
            console.log("Game loaded and state normalized.");
            state.gameStarted = true;
            if (!silent) state.currentScreen = "status";
        } catch (err) {
            console.error("Error loading save:", err);
            state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        }
    } else {
        state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
    
    // Always load save slots
    let savedSlots = null;
    try { savedSlots = localStorage.getItem('stitch_rpg_saves'); } catch(e) { console.warn('localStorage error:', e); }
    if (savedSlots) {
        state.saveSlots = JSON.parse(savedSlots);
    }
    
    if (!silent) {
        render();
    }
}

function fixItemImage(item) {
    const newImage = getItemImage(item.name, item.category);
    if (newImage) {
        item.image = newImage;
    }
}

window.normalizeLoadedHero = function(hero) {
    if (!hero) return;
    
    // Auto-repair corrupted XP structure
    if (typeof hero.xp !== 'object' || hero.xp === null || hero.xp.current === undefined) {
        const xpNum = typeof hero.xp === 'number' ? hero.xp : 0;
        const nextXp = (hero.level || 1) * 100;
        hero.xp = { current: xpNum, next: nextXp };
    }
    
    if (hero.xpPaused === undefined) {
        hero.xpPaused = false;
    }
    
    // Initialize mana properties
    if (hero.manaCurrent === undefined) {
        hero.manaCurrent = window.getTotalStat ? window.getTotalStat('mana') : 5;
    }
    
    // Initialize spells equipment structure
    if (hero.equipment) {
        if (!hero.equipment.spells) hero.equipment.spells = [];
        if (hero.equipment.primarySpell === undefined) hero.equipment.primarySpell = 0;
    }
    
    // 1. Inventory Items
    if (hero.inventory) {
        const allItems = Object.values(itemPools).flat();
        hero.inventory.forEach(item => {
            if (!item.category) {
                const poolItem = allItems.find(p => p.name === item.name);
                if (poolItem) item.category = poolItem.category;
            }
            fixItemImage(item);
        });
    }
    
    // 2. Equipped Items
    if (hero.equipment) {
        const eq = hero.equipment;
        if (eq.melee) fixItemImage(eq.melee);
        if (eq.ranged) fixItemImage(eq.ranged);
        if (eq.armor) fixItemImage(eq.armor);
        if (eq.artifacts) {
            if (eq.artifacts.amulet) fixItemImage(eq.artifacts.amulet);
            if (eq.artifacts.ring1) fixItemImage(eq.artifacts.ring1);
            if (eq.artifacts.ring2) fixItemImage(eq.artifacts.ring2);
            if (eq.artifacts.others) {
                eq.artifacts.others.forEach(fixItemImage);
            }
        }
    }
    
    // 3. Talents
    if (hero.talents) {
        hero.talents.forEach(talent => {
            const defaultTalent = DEFAULT_STATE.hero.talents.find(t => t.id === talent.id);
            if (defaultTalent) {
                talent.descs = defaultTalent.descs;
                if (!talent.icon) talent.icon = defaultTalent.icon;
            }
        });
    }
    
    // 4. Quests
    if (hero.quests) {
        hero.quests.forEach(q => {
            if (q.id === 'main_quest' || q.name === 'Hauptquest' || q.name === 'Die Aufnahme bei den Schatten') {
                q.name = 'Willkommen in der Kolonie!';
                q.icon = 'Bilder Karten/Barriere außen.jfif';
                q.description = 'Angekommen als Neuling in der Kolonie, musst du zunächst das Minental und seine Bewohner kennen lernen! Im Zuge dessen musst du Erfahrung sammeln und deine Talente wieder erlernen, die du vor deiner Gefangenschaft hattest. Hierfür musst du deine eigene Quest zum Erlangen deiner passiven Fähigkeit erfüllen! Hast du die Quest erfüllt, erhältst du 100 Erfahrungspunkte und die für den weiteren Verlauf des Spiels entscheidende Heldenfähigkeit. Zusätzlich dazu muss man zwei Quests aus den Lagern absolviert haben, welche man sich frei aussuchen kann!';
            }
            if (q.id === 'hero_quest' || q.name === 'Quest zum Erlangen der passiven Fähigkeit') {
                q.name = 'Jeder hat seine eigenen Stärken!';
            }
        });
    }
    
    if (!hero.chronik) hero.chronik = [];
    if (!hero.deactivatedQuests) hero.deactivatedQuests = [];
    if (!hero.connectionPoints) hero.connectionPoints = [];
};

window.checkCombatPassword = function(val) {
    if (val === 'hajop') {
        state.combatPopup.step = 'selectEnemy';
        state.combatPopup.isAdmin = true;
        render();
    } else {
        state.combatPopup.error = 'Falsches Passwort!';
        render();
    }
};

const enemyData = {
    // Kapitel 1 – Klasse 1
    'j_scavenger': { name: 'J Scavenger',     sta: 1, ges: 1, bwg: 5, hp: 10, rust: 1, abilities: '', chapter: 1, class: 1, type: 'allesfresser' },
    'j_molerat':   { name: 'J Molerat',        sta: 1, ges: 1, bwg: 3, hp: 15, rust: 1, abilities: '', chapter: 1, class: 1, type: 'allesfresser' },
    'j_goblin':    { name: 'J Goblin',         sta: 1, ges: 1, bwg: 6, hp:  8, rust: 1, abilities: '', chapter: 1, class: 1, type: 'humanoid',     loot: [{type:'fixed', name:'Knüppel'}] },
    // Kapitel 1 – Klasse 2
    'scavenger':   { name: 'Scavenger',        sta: 2, ges: 1, bwg: 5, hp: 15, rust: 1, abilities: '', chapter: 1, class: 2, type: 'allesfresser' },
    'molerat':     { name: 'Molerat',          sta: 1, ges: 1, bwg: 3, hp: 20, rust: 1, abilities: '', chapter: 1, class: 2, type: 'allesfresser' },
    'blutfliege':  { name: 'Blutfliege',       sta: 1, ges: 3, bwg: 6, hp: 10, rust: 1, abilities: 'Präzisionsstreich 2 (Roll 2 D6, use highest)', chapter: 1, class: 2, type: 'insekt' },
    // Kapitel 1 – Klasse 3
    'wolf':        { name: 'Wolf',             sta: 3, ges: 1, bwg: 6, hp: 15, rust: 2, abilities: '', chapter: 1, class: 3, type: 'raubtier' },
    'goblin':      { name: 'Goblin',           sta: 1, ges: 4, bwg: 6, hp: 12, rust: 1, abilities: '', chapter: 1, class: 3, type: 'humanoid',     loot: [{type:'fixed', name:'Rostiges Schwert'}] },
    // Kapitel 2 – Klasse 1
    'gr_wolf':     { name: 'Gr. Wolf',         sta: 4, ges: 1, bwg: 8, hp: 20, rust: 3, abilities: '', chapter: 2, class: 1, type: 'raubtier' },
    'waran':       { name: 'Waran',            sta: 3, ges: 3, bwg: 5, hp: 15, rust: 4, abilities: 'Scheintreffer 5 (Roll D6, on 5+ no effect)', chapter: 2, class: 1, type: 'allesfresser' },
    // Kapitel 2 – Klasse 2
    'ork_hund':         { name: 'Ork-Hund',         sta: 5, ges: 1, bwg: 7, hp: 20, rust: 3, abilities: 'Sturmangriff 1 (+1 Stärke nach Bwg), Achillysferse 3 (Fernkampfschwäche)', chapter: 2, class: 2, type: 'raubtier' },
    'schwarzer_goblin': { name: 'Schwarzer Goblin', sta: 2, ges: 5, bwg: 7, hp: 14, rust: 2, abilities: 'Hinterhalt 4 (Roll D6, on 4+ Angriff vor Held wenn Bwg genutzt)', chapter: 2, class: 2, type: 'humanoid', loot: [{type:'fixed', name:'Streitkolben'}] },
    'beisser':          { name: 'Beißer',          sta: 5, ges: 1, bwg: 6, hp:  2, rust: 1, abilities: 'Panzerbrecher 5 (Roll D6, on 5+ ignore armor)', chapter: 2, class: 2, type: 'allesfresser' },
    // Kapitel 2 – Klasse 3
    'ork':         { name: 'Ork',             sta: 10, ges: 2, bwg: 6, hp: 25, rust: 3, abilities: 'Adrenalin 10/4 (HP<=10: +4 Str, 2x Bwg)', chapter: 2, class: 3, type: 'humanoid' },
    'minecrawler': { name: 'Minecrawler',     sta:  6, ges: 4, bwg: 5, hp: 25, rust: 4, abilities: 'Präzisionsstreich 2 (Roll 2 D6, use highest)', chapter: 2, class: 3, type: 'insekt' }
};


function getTalentLevel(id) {
    if (!state.hero.talents) return 0;
    const t = state.hero.talents.find(item => item.id === id);
    return t ? t.level || 0 : 0;
}

window.confirmEnemySelection = function() {
    const key = state.combatPopup.selectedEnemy;
    if (!key) return;
    const enemy = JSON.parse(JSON.stringify(enemyData[key]));
    const isAdmin = !!state.combatPopup.isAdmin;
    
    // Close selection modal
    state.combatPopup.active = false;
    
    // Initialize & launch the Combat Simulator
    window.startCombatSimulator(enemy, isAdmin);
};

window.startCombatSimulator = function(selectedEnemy, isAdmin = false) {
    const hero = state.hero;
    const eq = hero.equipment || {};
    
    // Calculate total stats
    const hp = hero.hp.current;
    const maxHp = window.getTotalMaxHp();
    const arm = window.calculateTotalArmor();
    const str = window.getTotalStat('str');
    const dex = window.getTotalStat('dex');
    const mov = window.getTotalStat('mov');
    
    const weaponsList = [];
    let activeWeaponItem = null;
    let reserveWeaponItem = null;
    
    if (hero.primaryWeapon === 'ranged' && eq.ranged) {
        activeWeaponItem = eq.ranged;
        reserveWeaponItem = eq.melee;
    } else {
        activeWeaponItem = eq.melee || eq.ranged;
        reserveWeaponItem = (activeWeaponItem === eq.melee) ? eq.ranged : null;
    }
    
    if (activeWeaponItem) {
        weaponsList.push({
            name: activeWeaponItem.name,
            type: activeWeaponItem.art || activeWeaponItem.style || 'Waffe',
            dmg: activeWeaponItem.damage || 1,
            ability: activeWeaponItem.ability || 'Keine'
        });
    } else {
        weaponsList.push({
            name: 'Faust',
            type: 'Nahkampf',
            dmg: 1,
            ability: 'Keine'
        });
    }
    
    if (reserveWeaponItem) {
        weaponsList.push({
            name: reserveWeaponItem.name,
            type: reserveWeaponItem.art || reserveWeaponItem.style || 'Waffe',
            dmg: reserveWeaponItem.damage || 1,
            ability: reserveWeaponItem.ability || 'Keine'
        });
    }
    
    let extraMov = 0;
    if (activeWeaponItem && activeWeaponItem.name.toLowerCase().includes('armbrust')) {
        const armbrustLvl = getTalentLevel('armbrust');
        if (armbrustLvl === 1) extraMov = 1;
        else if (armbrustLvl === 2) extraMov = 2;
    }
    const finalMov = mov + extraMov;
    
    const originalEnemy = JSON.parse(JSON.stringify(selectedEnemy));
    const originalWeapons = JSON.parse(JSON.stringify(weaponsList));
    
    let enemyWeapon = null;
    if (selectedEnemy.loot) {
        const fixedLoot = selectedEnemy.loot.find(l => l.type === 'fixed');
        if (fixedLoot) {
            const allWaffen = itemPools.waffen || [];
            const w = allWaffen.find(item => item.name.toLowerCase() === fixedLoot.name.toLowerCase());
            if (w) {
                enemyWeapon = {
                    name: w.name,
                    dmg: w.damage || 1,
                    type: w.art || w.style || 'Nahkampf'
                };
            }
        }
    }
    if (!enemyWeapon) {
        if (selectedEnemy.name.toLowerCase().includes('goblin')) {
            const allWaffen = itemPools.waffen || [];
            let wName = 'rostiges schwert';
            if (selectedEnemy.name.toLowerCase().includes('schwarzer') || selectedEnemy.name.toLowerCase().includes('schwarz')) wName = 'streitkolben';
            else if (selectedEnemy.name.toLowerCase().includes('j ')) wName = 'knüppel';
            const w = allWaffen.find(item => item.name.toLowerCase() === wName);
            if (w) {
                enemyWeapon = {
                    name: w.name,
                    dmg: w.damage || 1,
                    type: w.art || w.style || 'Nahkampf'
                };
            }
        } else if (selectedEnemy.name.toLowerCase() === 'ork') {
            const allWaffen = itemPools.waffen || [];
            const wName = 'grobe axt';
            const w = allWaffen.find(item => item.name.toLowerCase() === wName);
            if (w) {
                enemyWeapon = {
                    name: w.name,
                    dmg: w.damage || 1,
                    type: w.art || w.style || 'Nahkampf'
                };
            }
        }
    }
    
    state.combatSimulator = {
        active: true,
        isAdmin: isAdmin,
        originalEnemy: originalEnemy,
        originalWeapons: originalWeapons,
        simWins: 0,
        simLosses: 0,
        simsCompleted: 0,
        simHeroHpOnWin: 0,
        simEnemyHpOnLoss: 0,
        lastFiveSummaries: [],
        lastFiveDetailedLogs: [],
        simStyle: 'hybrid',
        isSimulating: false,
        hero: {
            name: hero.name || 'Valerius',
            hp: hp,
            maxHp: maxHp,
            arm: arm,
            str: str,
            dex: dex,
            mov: finalMov,
            remainingMov: finalMov,
            pos: { r: 3, c: 8 },
            startPos: { r: 3, c: 8 },
            weapons: weaponsList,
            mana: hero.manaCurrent || window.getTotalStat('mana') || 0,
            maxMana: window.getTotalStat('mana') || 0,
            spells: JSON.parse(JSON.stringify((eq.spells || []).map(s => ({ ...s, currentCharges: s.maxCapacity || 3 })))),
            primarySpell: eq.primarySpell || 0,
            talents: {
                einhand: getTalentLevel('einhand'),
                zweihand: getTalentLevel('zweihand'),
                bogen: getTalentLevel('bogen'),
                armbrust: getTalentLevel('armbrust'),
                magie: getTalentLevel('magie'),
                praesenz: getTalentLevel('praesenz')
            }
        },
        enemy: {
            name: selectedEnemy.name,
            hp: selectedEnemy.hp,
            maxHp: selectedEnemy.hp,
            arm: selectedEnemy.rust,
            str: selectedEnemy.sta,
            dex: selectedEnemy.ges,
            mov: selectedEnemy.bwg,
            pos: { r: 13, c: 8 },
            abilities: selectedEnemy.abilities || '',
            type: selectedEnemy.type || '',
            weapon: enemyWeapon
        },
        turn: 'hero',
        mode: 'idle',
        actionDone: false,
        chargingSpell: null,
        log: ['Kampf beginnt. ' + (hero.name || 'Held') + ' positioniert sich...'],
        flashRed: false,
        confirmMoveDialog: false,
        endScreen: null
    };

    // Apply Overwhelming Presence (Überwältigende Präsenz) at combat start
    if (state.combatSimulator.hero.talents.praesenz > 0) {
        let stepsMoved = 0;
        const hPos = state.combatSimulator.hero.pos;
        const ePos = state.combatSimulator.enemy.pos;
        for (let step = 0; step < 2; step++) {
            const currR = ePos.r;
            const currC = ePos.c;
            let bestNeighbor = null;
            let maxDist = -1;
            const directions = [
                { r: -1, c: 0 },
                { r: 1, c: 0 },
                { r: 0, c: -1 },
                { r: 0, c: 1 }
            ];
            for (const dir of directions) {
                const nextR = currR + dir.r;
                const nextC = currC + dir.c;
                if (nextR >= 0 && nextR <= 14 && nextC >= 0 && nextC <= 14) {
                    if (!(nextR === hPos.r && nextC === hPos.c)) {
                        const dist = Math.abs(nextR - hPos.r) + Math.abs(nextC - hPos.c);
                        if (dist > maxDist) {
                            maxDist = dist;
                            bestNeighbor = { r: nextR, c: nextC };
                        }
                    }
                }
            }
            if (bestNeighbor) {
                ePos.r = bestNeighbor.r;
                ePos.c = bestNeighbor.c;
                stepsMoved++;
            } else {
                break;
            }
        }
        if (stepsMoved > 0) {
            state.combatSimulator.log.unshift(`👑 Überwältigende Präsenz: Gegner weicht ${stepsMoved} Felder zurück!`);
        }
    }

    // Close any existing windows first to start fresh
    if (state.analyseWindow && !state.analyseWindow.closed) {
        try { state.analyseWindow.close(); } catch(e){}
    }

    // Set current screen to schlachtfeld (inline)
    state.currentScreen = 'schlachtfeld';

    // Open Admin Analytics Window (only in Admin mode)
    if (isAdmin) {
        const adminWin = window.open("", "admin_combat_analytics", "width=550,height=950");
        if (adminWin) {
            adminWin.document.open();
            adminWin.document.write(`
            <!DOCTYPE html>
            <html class="dark">
            <head>
                <meta charset="utf-8">
                <title>Analyse & Anpassung</title>
                <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
                <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
                <style>
                    .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
                    body { background-color: #131313; color: #e5e2e1; font-family: 'Noto Serif', serif; margin: 0; padding: 0; }
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b463c; }
                </style>
            </head>
            <body class="bg-[#131313] selection:bg-primary/30">
                <div id="analyse-container"></div>
            </body>
            </html>
            `);
            adminWin.document.close();
            state.analyseWindow = adminWin;
        }
    }
    
    render();
};

window.renderAnalyseWindow = function(win) {
    if (!win || win.closed) return;
    const sim = state.combatSimulator;
    if (!sim) return;

    const container = win.document.getElementById('analyse-container');
    if (!container) return;

    container.innerHTML = `
        <div class="flex flex-col font-sans select-none pb-24">
            <!-- Header -->
            <header class="bg-[#131313] w-full top-0 sticky flex items-center justify-between px-6 py-4 h-16 z-40 border-b border-primary/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-primary text-2xl">analytics</span>
                    <h1 class="text-xl font-headline tracking-[0.2em] text-[#e9c176] uppercase">ANALYSE & ANPASSUNG</h1>
                </div>
                <button onclick="window.close();" class="text-on-surface-variant hover:text-primary transition-colors bg-white/5 p-2 rounded-sm">
                    <span class="material-symbols-outlined text-lg">close</span>
                </button>
            </header>
            
            <main class="px-6 py-6 space-y-6 max-w-[500px] mx-auto w-full">
                <!-- Combat Performance Stats Card -->
                <div class="bg-surface-container-high p-4 border-l-4 border-primary border-t border-r border-b border-outline-variant/15 space-y-2 shadow-md">
                    <h3 class="text-[10px] text-primary uppercase tracking-wider font-bold mb-2">COMBAT PERFORMANCE</h3>
                    <div class="flex justify-between items-center text-xs py-1 border-b border-white/5">
                        <span class="opacity-70">Siegeswahrscheinlichkeit:</span>
                        <span class="text-primary font-bold">${sim.simsCompleted > 0 ? ((sim.simWins / sim.simsCompleted) * 100).toFixed(1) : '0.0'}%</span>
                    </div>
                    <div class="flex justify-between items-center text-xs py-1 border-b border-white/5">
                        <span class="opacity-70">Avg. Leben bei Sieg:</span>
                        <span class="text-primary font-bold">${sim.simWins > 0 ? (sim.simHeroHpOnWin / sim.simWins).toFixed(1) : '0.0'} HP</span>
                    </div>
                    <div class="flex justify-between items-center text-xs py-1">
                        <span class="opacity-70">Avg. Gegner-HP bei Niederlage:</span>
                        <span class="text-primary font-bold">${sim.simLosses > 0 ? (sim.simEnemyHpOnLoss / sim.simLosses).toFixed(1) : '0.0'} HP</span>
                    </div>
                </div>
                
                <!-- Detailed Last 5 Battles Logs -->
                <div class="space-y-2">
                    <h3 class="text-[10px] text-primary uppercase tracking-wider font-bold mb-2">DETAILLIERTE ANALYSE (LETZTE 5 KÄMPFE)</h3>
                    ${sim.lastFiveSummaries.length === 0 ? `
                        <div class="p-3 text-xs text-on-surface-variant/60 italic bg-surface-container/50 border border-outline-variant/10 text-center">
                            Keine Daten vorhanden. Führe eine Favoritensuche durch!
                        </div>
                    ` : sim.lastFiveSummaries.map((summary, index) => {
                        const reverseIdx = sim.lastFiveSummaries.length - 1 - index;
                        const sumText = sim.lastFiveSummaries[reverseIdx];
                        const logList = sim.lastFiveDetailedLogs[reverseIdx];
                        const logId = `combat-log-detail-${reverseIdx}`;
                        
                        return `
                            <div class="border border-outline-variant/20 rounded-sm overflow-hidden bg-surface-container/50 bg-[#131313]">
                                <button onclick="const el = document.getElementById('${logId}'); el.classList.toggle('hidden');" class="w-full flex justify-between items-center p-3 text-left font-bold text-xs hover:bg-white/5 transition-colors text-primary uppercase">
                                    <span>${sumText}</span>
                                    <span class="material-symbols-outlined text-sm">expand_more</span>
                                </button>
                                <div id="${logId}" class="hidden p-3 bg-black/40 text-[10px] font-mono border-t border-outline-variant/10 max-h-48 overflow-y-auto space-y-1 custom-scrollbar text-on-surface-variant/80">
                                    ${logList.map(logMsg => `<p class="leading-relaxed border-b border-white/5 pb-0.5 last:border-none">> ${logMsg}</p>`).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <!-- Enemy Stats Editing Card -->
                <div class="bg-surface-container p-4 border border-outline-variant/20 space-y-3 rounded-sm">
                    <h3 class="text-[10px] text-primary uppercase tracking-wider font-bold border-b border-primary/20 pb-1">GEGNER ANPASSEN</h3>
                    <div class="grid grid-cols-2 gap-2.5">
                        <div class="flex flex-col space-y-0.5">
                            <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Name</label>
                            <input type="text" value="${sim.enemy.name}" oninput="window.opener.state.combatSimulator.enemy.name = this.value; window.opener.render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                        </div>
                        <div class="flex flex-col space-y-0.5">
                            <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">HP</label>
                            <input type="number" value="${sim.enemy.hp}" oninput="window.opener.state.combatSimulator.enemy.hp = parseInt(this.value) || 0; window.opener.state.combatSimulator.enemy.maxHp = parseInt(this.value) || 0; window.opener.render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                        </div>
                    </div>
                    <div class="grid grid-cols-3 gap-2.5">
                        <div class="flex flex-col space-y-0.5">
                            <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Rüstung</label>
                            <input type="number" value="${sim.enemy.arm}" oninput="window.opener.state.combatSimulator.enemy.arm = parseInt(this.value) || 0; window.opener.render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                        </div>
                        <div class="flex flex-col space-y-0.5">
                            <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Stärke</label>
                            <input type="number" value="${sim.enemy.str}" oninput="window.opener.state.combatSimulator.enemy.str = parseInt(this.value) || 0; window.opener.render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                        </div>
                        <div class="flex flex-col space-y-0.5">
                            <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Geschick</label>
                            <input type="number" value="${sim.enemy.dex}" oninput="window.opener.state.combatSimulator.enemy.dex = parseInt(this.value) || 0; window.opener.render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                        </div>
                    </div>
                    <div class="flex flex-col space-y-0.5">
                        <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Bewegung</label>
                        <input type="number" value="${sim.enemy.mov}" oninput="window.opener.state.combatSimulator.enemy.mov = parseInt(this.value) || 0; window.opener.render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                    </div>
                    <div class="flex flex-col space-y-0.5">
                        <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Fähigkeiten</label>
                        <textarea rows="2" oninput="window.opener.state.combatSimulator.enemy.abilities = this.value; window.opener.render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary custom-scrollbar resize-none">${sim.enemy.abilities}</textarea>
                    </div>
                </div>
                
                <!-- Active Weapon Editing Card -->
                <div class="bg-surface-container p-4 border border-outline-variant/20 space-y-3 rounded-sm">
                    <h3 class="text-[10px] text-primary uppercase tracking-wider font-bold border-b border-primary/20 pb-1">NAHKAMPFWAFFE ANPASSEN</h3>
                    <div class="grid grid-cols-2 gap-2.5">
                        <div class="flex flex-col space-y-0.5">
                            <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Name</label>
                            <input type="text" value="${sim.hero.weapons[0].name}" oninput="window.opener.state.combatSimulator.hero.weapons[0].name = this.value; window.opener.render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                        </div>
                        <div class="flex flex-col space-y-0.5">
                            <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Schaden (DMG)</label>
                            <input type="number" value="${sim.hero.weapons[0].dmg}" oninput="window.opener.state.combatSimulator.hero.weapons[0].dmg = parseInt(this.value) || 0; window.opener.render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2.5">
                        <div class="flex flex-col space-y-0.5">
                            <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Typ (z.B. 1H oder 2H)</label>
                            <input type="text" value="${sim.hero.weapons[0].type}" oninput="window.opener.state.combatSimulator.hero.weapons[0].type = this.value; window.opener.render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                        </div>
                        <div class="flex flex-col space-y-0.5">
                            <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Effekt</label>
                            <input type="text" value="${sim.hero.weapons[0].ability}" oninput="window.opener.state.combatSimulator.hero.weapons[0].ability = this.value; window.opener.render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                        </div>
                    </div>
                </div>
                
                <!-- Reserve Weapon Editing Card -->
                ${sim.hero.weapons[1] ? `
                    <div class="bg-surface-container p-4 border border-outline-variant/20 space-y-3 rounded-sm">
                        <h3 class="text-[10px] text-primary uppercase tracking-wider font-bold border-b border-primary/20 pb-1">FERNKAMPFWAFFE ANPASSEN</h3>
                        <div class="grid grid-cols-2 gap-2.5">
                            <div class="flex flex-col space-y-0.5">
                                <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Name</label>
                                <input type="text" value="${sim.hero.weapons[1].name}" oninput="window.opener.state.combatSimulator.hero.weapons[1].name = this.value; window.opener.render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                            </div>
                            <div class="flex flex-col space-y-0.5">
                                <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Schaden (DMG)</label>
                                <input type="number" value="${sim.hero.weapons[1].dmg}" oninput="window.opener.state.combatSimulator.hero.weapons[1].dmg = parseInt(this.value) || 0; window.opener.render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-2.5">
                            <div class="flex flex-col space-y-0.5">
                                <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Typ (z.B. FK)</label>
                                <input type="text" value="${sim.hero.weapons[1].type}" oninput="window.opener.state.combatSimulator.hero.weapons[1].type = this.value; window.opener.render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                            </div>
                            <div class="flex flex-col space-y-0.5">
                                <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Effekt</label>
                                <input type="text" value="${sim.hero.weapons[1].ability}" oninput="window.opener.state.combatSimulator.hero.weapons[1].ability = this.value; window.opener.render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <!-- Reset & Save Action Buttons -->
                <div class="flex flex-col gap-2.5">
                    <button onclick="window.opener.printCombatSimulatorPDF(window)" class="w-full bg-[#1e293b] border border-primary/40 hover:bg-[#334155] text-primary py-2.5 font-headline font-bold text-xs uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-all shadow-md">
                        <span class="material-symbols-outlined text-sm">picture_as_pdf</span>
                        Statistik als PDF drucken / speichern
                    </button>
                    <div class="flex gap-3">
                        <button onclick="window.opener.resetCombatSimulatorToOriginal()" class="flex-1 bg-red-900/30 hover:bg-red-900/50 border border-red-500/40 text-red-400 py-2.5 font-headline font-bold text-xs uppercase tracking-wider rounded-sm transition-colors">
                            ORIGINAL WERTEN
                        </button>
                        <button onclick="window.opener.saveCombatSimulatorChanges()" class="flex-1 bg-primary text-on-primary py-2.5 font-headline font-bold text-xs uppercase tracking-wider rounded-sm hover:brightness-110 active:scale-95 transition-all shadow-md">
                            SPEICHERN
                        </button>
                    </div>
                </div>
            </main>
        </div>
    `;
};

function runOneSimulation(sim, style, simIndex) {
    let hHp = sim.hero.hp;
    let eHp = sim.enemy.hp;
    
    let hPos = { r: 3, c: 8 };
    let ePos = { r: 13, c: 8 };
    
    let turn = 'hero';
    let turnCount = 1;
    let battleLog = [];
    
    let heroParalysisTurns = 0;
    let heroSlowTurns = 0;
    let heroSlowMov = 0;
    let heroSlowArmor = 0;
    
    let enemyParalysisTurns = 0;
    let enemySlowTurns = 0;
    let enemySlowMov = 0;
    let enemySlowArmor = 0;
    
    let isMeleeActive = (style === 'melee' || style === 'hybrid');
    
    const d6 = () => Math.floor(Math.random() * 6) + 1;
    const addLog = (msg) => {
        battleLog.unshift(msg);
    };
    
    if (sim.hero.talents && sim.hero.talents.praesenz > 0) {
        let stepsMoved = 0;
        for (let step = 0; step < 2; step++) {
            const currR = ePos.r;
            const currC = ePos.c;
            let bestNeighbor = null;
            let maxDist = -1;
            const directions = [
                { r: -1, c: 0 },
                { r: 1, c: 0 },
                { r: 0, c: -1 },
                { r: 0, c: 1 }
            ];
            for (const dir of directions) {
                const nextR = currR + dir.r;
                const nextC = currC + dir.c;
                if (nextR >= 0 && nextR <= 14 && nextC >= 0 && nextC <= 14) {
                    if (!(nextR === hPos.r && nextC === hPos.c)) {
                        const dist = Math.abs(nextR - hPos.r) + Math.abs(nextC - hPos.c);
                        if (dist > maxDist) {
                            maxDist = dist;
                            bestNeighbor = { r: nextR, c: nextC };
                        }
                    }
                }
            }
            if (bestNeighbor) {
                ePos.r = bestNeighbor.r;
                ePos.c = bestNeighbor.c;
                stepsMoved++;
            } else {
                break;
            }
        }
        if (stepsMoved > 0) {
            addLog(`👑 Überwältigende Präsenz: Gegner weicht ${stepsMoved} Felder zurück!`);
        }
    }
    
    const getAbilityValue = (abilities, abilityName, defaultVal = 0) => {
        const reg = new RegExp(abilityName + '\\s+(\\d+)');
        const match = reg.exec(abilities);
        if (match) return parseInt(match[1]);
        return defaultVal;
    };
    
    while (hHp > 0 && eHp > 0 && turnCount < 200) {
        if (turn === 'hero') {
            let extraMov = 0;
            const wpnForMov = isMeleeActive ? sim.hero.weapons[0] : sim.hero.weapons[1];
            if (wpnForMov && wpnForMov.name.toLowerCase().includes('armbrust')) {
                const armbrustLvl = sim.hero.talents.armbrust || 0;
                if (armbrustLvl === 1) extraMov = 1;
                else if (armbrustLvl === 2) extraMov = 2;
            }
            let remainingMov = sim.hero.mov + extraMov;
            let heroAttacksThisTurn = 0;
            let heroMovedThisTurn = false;
            
            if (heroParalysisTurns > 0) {
                const roll = d6();
                if (roll >= 4) {
                    heroParalysisTurns = 0;
                    addLog('Held befreit sich von Lähmung!');
                } else {
                    heroParalysisTurns = Math.max(0, heroParalysisTurns - 1);
                    addLog('Held ist weiterhin gelähmt.');
                    turn = 'enemy';
                    turnCount++;
                    continue;
                }
            }
            
            if (heroSlowTurns > 0) {
                heroSlowTurns--;
                if (heroSlowTurns === 0) {
                    heroSlowMov = 0;
                    heroSlowArmor = 0;
                }
            }
            remainingMov = Math.max(0, remainingMov - heroSlowMov);
            
            let dist = Math.abs(hPos.r - ePos.r) + Math.abs(hPos.c - ePos.c);
            
            if (style === 'hybrid') {
                if (dist > 1 && isMeleeActive && remainingMov >= 1) {
                    isMeleeActive = false;
                    remainingMov -= 1;
                    addLog('Waffe gewechselt zu Fernkampf.');
                } else if (dist === 1 && !isMeleeActive && remainingMov >= 1) {
                    isMeleeActive = true;
                    remainingMov -= 1;
                    addLog('Waffe gewechselt zu Nahkampf.');
                }
            } else if (style === 'ranged' && isMeleeActive && remainingMov >= 1) {
                isMeleeActive = false;
                remainingMov -= 1;
            } else if (style === 'melee' && !isMeleeActive && remainingMov >= 1) {
                isMeleeActive = true;
                remainingMov -= 1;
            }
            
            if (isMeleeActive) {
                if (dist > 1 && remainingMov > 0) {
                    let steps = Math.min(remainingMov, dist - 1);
                    for (let s = 0; s < steps; s++) {
                        const dr = Math.sign(ePos.r - hPos.r);
                        const dc = Math.sign(ePos.c - hPos.c);
                        if (dr !== 0) hPos.r += dr;
                        else if (dc !== 0) hPos.c += dc;
                        heroMovedThisTurn = true;
                    }
                    remainingMov -= steps;
                    dist = Math.abs(hPos.r - ePos.r) + Math.abs(hPos.c - ePos.c);
                }
            } else {
                if (dist <= 2 && remainingMov > 0) {
                    for (let s = 0; s < remainingMov; s++) {
                        let bestDist = Math.abs(hPos.r - ePos.r) + Math.abs(hPos.c - ePos.c);
                        let bestPos = { r: hPos.r, c: hPos.c };
                        const options = [
                            { r: hPos.r + 1, c: hPos.c },
                            { r: hPos.r - 1, c: hPos.c },
                            { r: hPos.r, c: hPos.c + 1 },
                            { r: hPos.r, c: hPos.c - 1 }
                        ];
                        for (let opt of options) {
                            if (opt.r >= 1 && opt.r <= 15 && opt.c >= 1 && opt.c <= 15) {
                                let d = Math.abs(opt.r - ePos.r) + Math.abs(opt.c - ePos.c);
                                if (d > bestDist) {
                                    bestDist = d;
                                    bestPos = opt;
                                }
                            }
                        }
                        if (bestPos.r !== hPos.r || bestPos.c !== hPos.c) {
                            hPos = bestPos;
                            heroMovedThisTurn = true;
                        } else {
                            break;
                        }
                    }
                    dist = Math.abs(hPos.r - ePos.r) + Math.abs(hPos.c - ePos.c);
                }
            }
            
            const wpn = isMeleeActive ? sim.hero.weapons[0] : sim.hero.weapons[1];
            if (wpn) {
                const is1H = wpn.type.toLowerCase().includes('einhand') || wpn.type.toLowerCase().includes('1h');
                const is2H = wpn.type.toLowerCase().includes('zweihand') || wpn.type.toLowerCase().includes('2h');
                const isXBow = wpn.name.toLowerCase().includes('armbrust');
                
                let maxMeleeDist = 1;
                if (isMeleeActive && is2H && sim.hero.talents.zweihand >= 1) maxMeleeDist = 2;
                
                let canAttack = true;
                if (isMeleeActive && is2H && heroMovedThisTurn && (sim.hero.talents.zweihand || 0) < 1) {
                    canAttack = false;
                }
                
                if (isMeleeActive && dist <= maxMeleeDist && canAttack) {
                    let roll = d6();
                    let baseRoll = roll;
                    
                    if (is1H) {
                        if (sim.hero.talents.einhand === 1) {
                            roll = Math.max(roll, d6());
                        } else if (sim.hero.talents.einhand === 2) {
                            const rolls = [d6(), d6(), d6()].sort((a,b)=>b-a);
                            roll = rolls[0] + rolls[1];
                        }
                    } else if (is2H) {
                        if (sim.hero.talents.zweihand === 2) {
                            roll *= 2;
                        }
                    }
                    
                    let effEnemyArmor = sim.enemy.arm;
                    if (is2H && sim.hero.talents.zweihand === 2 && baseRoll === 6) {
                        effEnemyArmor = 0;
                    }
                    
                    if (wpn.name.toLowerCase() === 'spitzhacke') {
                        effEnemyArmor = Math.max(0, effEnemyArmor - 1);
                    }
                    
                    let dmg = sim.hero.str + roll + wpn.dmg - effEnemyArmor;
                    let finalDmg = Math.max(1, dmg);
                    
                    if (wpn.name.toLowerCase() === 'leichenfresser') {
                        finalDmg += 2;
                    }
                    
                    eHp -= finalDmg;
                    addLog(`Helden Nahkampf Treffer! Schaden: ${finalDmg} HP.`);
                    
                    if (is2H && sim.hero.talents.zweihand >= 1) {
                        if (d6() >= 5) {
                            enemyParalysisTurns = 1;
                            addLog('Gegner gelähmt!');
                        }
                    }
                }
                
                if (!isMeleeActive && dist > 1) {
                    let maxAttacks = 1;
                    if (!isXBow && sim.hero.talents.bogen >= 1) {
                        maxAttacks = 2;
                    }
                    
                    for (let attack = 0; attack < maxAttacks; attack++) {
                        if (eHp <= 0) break;
                        const rollH = d6();
                        const rollE = d6();
                        if ((sim.hero.dex + rollH) > (sim.enemy.dex + rollE)) {
                            let rollD = d6();
                            let weaponDmg = wpn.dmg;
                            let bonusDmg = 0;
                            
                            if (isXBow) {
                                if (sim.hero.talents.armbrust >= 1) {
                                    bonusDmg += sim.hero.str;
                                }
                                if (sim.hero.talents.armbrust === 2 && rollD >= 4) {
                                    weaponDmg *= 2;
                                }
                            } else {
                                if (sim.hero.talents.bogen === 2) {
                                    rollD += d6();
                                }
                            }
                            
                            let effProjProt = 2;
                            if (isXBow && sim.hero.talents.armbrust >= 1) {
                                effProjProt = 0;
                            }
                            
                            const rawDmg = rollD + weaponDmg + bonusDmg - effProjProt;
                            const finalDmg = Math.max(1, rawDmg);
                            eHp -= finalDmg;
                            addLog(`Helden Fernkampf Treffer! Schaden: ${finalDmg} HP.`);
                            
                            if (isXBow && sim.hero.talents.armbrust === 2) {
                                enemySlowMov = Math.ceil(sim.enemy.mov / 2);
                                enemySlowTurns = 1;
                            }
                        } else {
                            addLog('Helden Fernkampf verfehlt.');
                        }
                    }
                }
            }
            
            turn = 'enemy';
        } else {
            if (enemyParalysisTurns > 0) {
                const roll = d6();
                if (roll >= 4) {
                    enemyParalysisTurns = 0;
                    addLog('Gegner befreit sich von Lähmung!');
                } else {
                    enemyParalysisTurns = Math.max(0, enemyParalysisTurns - 1);
                    addLog('Gegner ist weiterhin gelähmt.');
                    turn = 'hero';
                    turnCount++;
                    continue;
                }
            }
            
            let enemyMov = sim.enemy.mov;
            if (enemySlowTurns > 0) {
                enemySlowTurns--;
                if (enemySlowTurns === 0) {
                    enemySlowMov = 0;
                }
            }
            let movLeft = Math.max(0, enemyMov - enemySlowMov);
            
            let dist = Math.abs(hPos.r - ePos.r) + Math.abs(hPos.c - ePos.c);
            let attacked = false;
            
            while (movLeft > 0) {
                if (dist === 1) {
                    const roll = d6();
                    const rawDmg = sim.enemy.str + roll - sim.hero.arm;
                    const finalDmg = Math.max(0, rawDmg);
                    hHp -= finalDmg;
                    addLog(`Gegner greift an! Schaden: ${finalDmg} HP.`);
                    attacked = true;
                    break;
                }
                
                const dr = Math.sign(hPos.r - ePos.r);
                const dc = Math.sign(hPos.c - ePos.c);
                if (dr !== 0) ePos.r += dr;
                else if (dc !== 0) ePos.c += dc;
                
                movLeft--;
                dist = Math.abs(hPos.r - ePos.r) + Math.abs(hPos.c - ePos.c);
            }
            
            if (!attacked && dist === 1) {
                const roll = d6();
                const rawDmg = sim.enemy.str + roll - sim.hero.arm;
                const finalDmg = Math.max(0, rawDmg);
                hHp -= finalDmg;
                addLog(`Gegner greift an! Schaden: ${finalDmg} HP.`);
                attacked = true;
            }
            
            if (!attacked) {
                addLog('Gegner lauert...');
            }
            
            turn = 'hero';
            turnCount++;
        }
    }
    
    sim.simsCompleted++;
    if (hHp > 0) {
        sim.simWins++;
        sim.simHeroHpOnWin += hHp;
    } else {
        sim.simLosses++;
        sim.simEnemyHpOnLoss += eHp;
    }
    
    if (simIndex > 95) {
        const resultStr = hHp > 0 ? `Sieg in ${turnCount} Zügen` : `Niederlage (Gegner HP: ${eHp})`;
        sim.lastFiveSummaries.push(`Kampf ${simIndex}: ${resultStr}`);
        sim.lastFiveDetailedLogs.push(battleLog);
    }
}

window.run100CombatSimulations = function(style) {
    if (!state.combatSimulator) return;
    const sim = state.combatSimulator;
    sim.isSimulating = true;
    sim.simWins = 0;
    sim.simLosses = 0;
    sim.simsCompleted = 0;
    sim.simHeroHpOnWin = 0;
    sim.simEnemyHpOnLoss = 0;
    sim.lastFiveSummaries = [];
    sim.lastFiveDetailedLogs = [];
    
    for (let s = 0; s < 100; s++) {
        runOneSimulation(sim, style, s + 1);
    }
    
    sim.isSimulating = false;
    render();
};

window.resetCombatSimulatorToOriginal = function() {
    if (!state.combatSimulator) return;
    const sim = state.combatSimulator;
    const origEnemy = sim.originalEnemy;
    
    sim.enemy.name = origEnemy.name;
    sim.enemy.hp = origEnemy.hp;
    sim.enemy.maxHp = origEnemy.hp;
    sim.enemy.arm = origEnemy.rust;
    sim.enemy.str = origEnemy.sta;
    sim.enemy.dex = origEnemy.ges;
    sim.enemy.mov = origEnemy.bwg;
    sim.enemy.abilities = origEnemy.abilities || '';
    
    sim.hero.weapons = JSON.parse(JSON.stringify(sim.originalWeapons));
    
    sim.simWins = 0;
    sim.simLosses = 0;
    sim.simsCompleted = 0;
    sim.simHeroHpOnWin = 0;
    sim.simEnemyHpOnLoss = 0;
    sim.lastFiveSummaries = [];
    sim.lastFiveDetailedLogs = [];
    
    alert('Daten wurden auf Originalzustand zurückgesetzt.');
    render();
};

window.saveCombatSimulatorChanges = function() {
    alert('Änderungen wurden erfolgreich gespeichert!');
    render();
};

window.printCombatSimulatorPDF = function(callerWindow) {
    const sim = state.combatSimulator;
    if (!sim) return;

    const winRate = sim.simsCompleted > 0 ? ((sim.simWins / sim.simsCompleted) * 100).toFixed(1) : '0.0';
    const avgHeroHp = sim.simWins > 0 ? (sim.simHeroHpOnWin / sim.simWins).toFixed(1) : '0.0';
    const avgEnemyHp = sim.simLosses > 0 ? (sim.simEnemyHpOnLoss / sim.simLosses).toFixed(1) : '0.0';

    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    // Save iframe ref for removal
    window._lastPdfIframe = iframe;

    const printWin = iframe.contentWindow;
    printWin.document.open();
    printWin.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>GOTIK - SCHLACHTFELD STATISTIK</title>
            <style>
                body { font-family: 'Georgia', serif; color: #111827; padding: 20px; line-height: 1.5; }
                .header { border-bottom: 2px solid #e9c176; padding-bottom: 10px; margin-bottom: 20px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; letter-spacing: 2px; }
                .header p { margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; color: #6b7280; }
                .section-title { font-size: 16px; font-weight: bold; border-left: 4px solid #e9c176; padding-left: 8px; margin: 20px 0 10px 0; text-transform: uppercase; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; font-size: 12px; }
                th { background-color: #f3f4f6; font-weight: bold; }
                .summary-card { background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
                .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
                .stat-box { text-align: center; padding: 10px; border-right: 1px solid #e5e7eb; }
                .stat-box:last-child { border-right: none; }
                .stat-val { font-size: 20px; font-weight: bold; color: #b91c1c; }
                .stat-lbl { font-size: 10px; color: #6b7280; text-transform: uppercase; }
                @media print {
                    .no-print { display: none; }
                    body { padding: 0; }
                }
            </style>
        </head>
        <body>
            <div class="no-print" style="margin-bottom: 20px; text-align: right;">
                <button onclick="window.print();" style="padding: 10px 20px; background-color: #e9c176; border: none; font-weight: bold; cursor: pointer; text-transform: uppercase; font-size: 12px;">Drucken / Als PDF speichern</button>
            </div>
            
            <div class="header">
                <h1>GOTIK - SCHLACHTFELD STATISTIK</h1>
                <p>Kampfanalyse & Auswertung vom ${new Date().toLocaleDateString('de-DE')} • ${new Date().toLocaleTimeString('de-DE')}</p>
            </div>

            <div class="section-title">I. Kontrahenten Übersicht</div>
            <table>
                <tr>
                    <th>Rolle</th>
                    <th>Name</th>
                    <th>HP (Max)</th>
                    <th>Rüstung</th>
                    <th>Stärke</th>
                    <th>Geschick</th>
                    <th>Bewegung</th>
                    <th>Ausrüstung</th>
                </tr>
                <tr>
                    <td><strong>Held</strong></td>
                    <td>${sim.hero.name}</td>
                    <td>${sim.hero.hp} (${sim.hero.maxHp})</td>
                    <td>${sim.hero.arm}</td>
                    <td>${sim.hero.str}</td>
                    <td>${sim.hero.dex}</td>
                    <td>${sim.hero.mov}</td>
                    <td>${sim.hero.weapons.map(w => w.name + ' (' + w.type + ', DMG: ' + w.dmg + ')').join('<br>')}</td>
                </tr>
                <tr>
                    <td><strong>Gegner</strong></td>
                    <td>${sim.enemy.name}</td>
                    <td>${sim.enemy.hp} (${sim.enemy.maxHp})</td>
                    <td>${sim.enemy.arm}</td>
                    <td>${sim.enemy.str}</td>
                    <td>${sim.enemy.dex}</td>
                    <td>${sim.enemy.mov}</td>
                    <td>Passive Fähigkeiten: ${sim.enemy.abilities || 'Keine'}</td>
                </tr>
            </table>

            <div class="section-title">II. Kampf-Performance (Simulation aus ${sim.simsCompleted} Kämpfen)</div>
            <div class="summary-card">
                <div class="summary-grid">
                    <div class="stat-box">
                        <div class="stat-val">${winRate}%</div>
                        <div class="stat-lbl">Siegeswahrscheinlichkeit</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-val">${avgHeroHp} HP</div>
                        <div class="stat-lbl">Durchschn. Leben bei Sieg</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-val">${avgEnemyHp} HP</div>
                        <div class="stat-lbl">Gegner-HP bei Niederlage</div>
                    </div>
                </div>
            </div>

            <script>
                // Auto-open print dialog
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                    }, 500);
                }
            <\/script>
        </body>
        </html>
    `);
    printWin.document.close();
    // Remove the iframe after a delay to ensure print dialog finishes
    setTimeout(() => {
        const iframe = window._lastPdfIframe;
        if (iframe && iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
        }
    }, 5000);
};

window.handleCombatCellClick = function(r, c) {
    const sim = state.combatSimulator;
    if (!sim || sim.mode !== 'moving') return;
    
    const dist = Math.abs(r - sim.hero.pos.r) + Math.abs(c - sim.hero.pos.c);
    const isOccupied = (sim.hero.pos.r === r && sim.hero.pos.c === c) || (sim.enemy.pos.r === r && sim.enemy.pos.c === c);
    
    if (dist > 0 && dist <= sim.hero.remainingMov && !isOccupied) {
        sim.hero.pos = { r, c };
        sim.hero.remainingMov -= dist;
        sim.mode = 'idle';
        sim.log.unshift(`${sim.hero.name} bewegt sich nach (${r}, ${c}).`);
        if (sim.hero.remainingMov === 0) {
            sim.confirmMoveDialog = true;
        }
        render();
    }
};

window.startCombatMovement = function() {
    const sim = state.combatSimulator;
    if (sim.turn !== 'hero') return;
    sim.mode = 'moving';
    sim.log.unshift("Wähle ein Zielquadrat...");
    render();
};

window.executeCombatMeleeAttack = function() {
    const sim = state.combatSimulator;
    const hero = sim.hero;
    const enemy = sim.enemy;
    const activeWeapon = hero.weapons[0];
    if (!activeWeapon) return;
    
    const is2H = activeWeapon.type.toLowerCase().includes('zweihand') || activeWeapon.type.toLowerCase().includes('2h');
    if (is2H && hero.remainingMov < hero.mov && (hero.talents.zweihand || 0) < 1) {
        alert('Du kannst mit einer Zweihandwaffe nach dem Bewegen nicht angreifen, es sei denn, du hast eine Ausbildung (Stufe 1)!');
        return;
    }
    
    const d6 = () => Math.floor(Math.random() * 6) + 1;
    let logs = [];
    
    const schein = window.getAbilityValues(enemy.abilities, 'Scheintreffer');
    if (schein) {
        const sRoll = d6();
        if (sRoll >= schein.x) {
            logs.push(`${enemy.name} weicht mit Scheintreffer aus! (Wurf: ${sRoll} >= ${schein.x})`);
            sim.log.unshift(...logs.reverse());
            sim.hero.remainingMov = 0;
            sim.flashRed = true;
            setTimeout(() => { sim.flashRed = false; render(); }, 600);
            sim.turn = 'enemy';
            render();
            return;
        }
    }
    
    let roll = 0;
    const is1H = activeWeapon.type.toLowerCase().includes('einhand') || activeWeapon.type.toLowerCase().includes('1h');
    
    if (is1H) {
        if (hero.talents.einhand === 0) {
            roll = d6();
            logs.push(`Nahkampf (Einhand) Wurf: ${roll}`);
        } else if (hero.talents.einhand === 1) {
            const r1 = d6();
            const r2 = d6();
            roll = Math.max(r1, r2);
            logs.push(`Nahkampf (Einhand Kämpfer) Wurf: ${r1}, ${r2} (gewertet: ${roll})`);
        } else {
            const r1 = d6();
            const r2 = d6();
            const r3 = d6();
            const rolls = [r1, r2, r3].sort((a,b) => b-a);
            roll = rolls[0] + rolls[1];
            logs.push(`Nahkampf (Einhand Meister) Wurf: ${r1}, ${r2}, ${r3} (zwei höchste addiert: ${roll})`);
        }
    } else if (is2H) {
        const baseRoll = d6();
        if (hero.talents.zweihand === 2) {
            roll = baseRoll * 2;
            logs.push(`Nahkampf (Zweihand Meister) Wurf: ${baseRoll} (verdoppelt: ${roll})`);
        } else {
            roll = baseRoll;
            logs.push(`Nahkampf (Zweihand) Wurf: ${roll}`);
        }
    } else {
        roll = d6();
        logs.push(`Nahkampf Wurf: ${roll}`);
    }
    
    // Spitzhacke ability: ignore 1 armor
    let effEnemyArm = enemy.arm;
    if (activeWeapon.name.toLowerCase() === 'spitzhacke') {
        effEnemyArm = Math.max(0, enemy.arm - 1);
        logs.push(`Spitzhacke ignoriert 1 Rüstungpunkt!`);
    }
    
    // Zweihand level 2 ignore armor on 6
    if (is2H && hero.talents.zweihand === 2 && roll === 12) { // 6 * 2 = 12
        effEnemyArm = 0;
        logs.push(`Meisterhafter Zweihand-Wurf! Rüstung des Gegners wird vollständig ignoriert!`);
    }
    
    const damage = Math.max(1, hero.str + roll + activeWeapon.dmg - effEnemyArm);
    enemy.hp = Math.max(0, enemy.hp - damage);
    logs.push(`Schaden verursacht: ${damage} an ${enemy.name}.`);
    
    // Zweihand level 1 paralyze effect on 5/6
    if (is2H && hero.talents.zweihand >= 1) {
        const paraRoll = d6();
        if (paraRoll >= 5) {
            logs.push(`Zweihand-Treffer betäubt ${enemy.name} für 1 Runde! (Wurf: ${paraRoll})`);
        }
    }
    
    sim.log.unshift(...logs.reverse());
    sim.hero.remainingMov = 0;
    sim.flashRed = true;
    setTimeout(() => { sim.flashRed = false; render(); }, 600);
    
    if (enemy.hp <= 0) {
        sim.endScreen = 'WON';
        if (!sim.isAdmin) sim.rewards = window.calculateCombatRewards(sim.originalEnemy);
    } else {
        sim.turn = 'enemy';
    }
    render();
};

window.executeCombatRangedAttack = function() {
    const sim = state.combatSimulator;
    const hero = sim.hero;
    const enemy = sim.enemy;
    const activeWeapon = hero.weapons[0];
    if (!activeWeapon) return;
    
    const d6 = () => Math.floor(Math.random() * 6) + 1;
    let logs = [];
    
    const isBow = activeWeapon.type.toLowerCase().includes('bogen') || activeWeapon.type.toLowerCase().includes('fk');
    const isXbow = activeWeapon.type.toLowerCase().includes('armbrust');
    
    // Ranged accuracy check
    const rollH = d6();
    const rollE = d6();
    const hit = (hero.dex + rollH) > (enemy.dex + rollE);
    
    logs.push(`Fernkampf-Angriff: Präzision Wurf: ${rollH} (+${hero.dex} DEX) vs Gegner: ${rollE} (+${enemy.dex} DEX)`);
    
    if (hit) {
        let rollD = 0;
        let effEnemyArm = enemy.arm;
        
        if (isBow) {
            if (hero.talents.bogen === 2) {
                const r1 = d6();
                const r2 = d6();
                rollD = r1 + r2;
                logs.push(`Treffer! Schadenswurf (Bogen Meister): ${r1} + ${r2} = ${rollD}`);
            } else {
                rollD = d6();
                logs.push(`Treffer! Schadenswurf (Bogen): ${rollD}`);
            }
        } else if (isXbow) {
            rollD = d6();
            if (hero.talents.armbrust >= 1) {
                effEnemyArm = 0;
                logs.push(`Treffer! Armbrust ignoriert Rüstung des Gegners!`);
            }
            logs.push(`Schadenswurf (Armbrust): ${rollD}`);
        } else {
            rollD = d6();
            logs.push(`Treffer! Schadenswurf: ${rollD}`);
        }
        
        let weaponDmg = activeWeapon.dmg;
        let bonusDmg = 0;
        if (isXbow && hero.talents.armbrust >= 1) {
            bonusDmg = hero.str;
            logs.push(`Armbrust-Ausbildung: Stärke (+${hero.str}) wird auf den Schaden addiert!`);
        }
        
        // Armbrust level 2 double weapon damage on roll >= 4
        if (isXbow && hero.talents.armbrust === 2 && rollD >= 4) {
            weaponDmg = activeWeapon.dmg * 2;
            logs.push(`Meisterhafter Armbrust-Treffer! Waffenschaden verdoppelt: ${weaponDmg}`);
        }
        
        const achillys = window.getAbilityValues(enemy.abilities, 'Achillysferse');
        let achillysDmg = 0;
        if (achillys) {
            achillysDmg = achillys.x;
            logs.push(`Achillysferse ausgelöst! +${achillysDmg} zusätzlicher Fernkampfschaden.`);
        }
        const damage = Math.max(1, rollD + weaponDmg - effEnemyArm + achillysDmg + bonusDmg);
        enemy.hp = Math.max(0, enemy.hp - damage);
        logs.push(`Schaden verursacht: ${damage} an ${enemy.name}.`);
        
        if (isXbow && hero.talents.armbrust === 2) {
            enemy.slowTurns = 1;
            logs.push(`❄️ Eisiger Treffer! Bewegung des Gegners in der nächsten Runde um die Hälfte verringert.`);
        }
        
        sim.flashRed = true;
        setTimeout(() => { sim.flashRed = false; render(); }, 600);
    } else {
        logs.push(`Verfehlt!`);
    }
    
    sim.log.unshift(...logs.reverse());
    
    if (enemy.hp <= 0) {
        sim.endScreen = 'WON';
        if (!sim.isAdmin) sim.rewards = window.calculateCombatRewards(sim.originalEnemy);
        sim.hero.remainingMov = 0;
    } else {
        const hasMoved = sim.hero.remainingMov < sim.hero.mov;
        if (isBow && hero.talents.bogen >= 1 && !hasMoved) {
            sim.heroAttacksThisTurn = (sim.heroAttacksThisTurn || 0) + 1;
            if (sim.heroAttacksThisTurn >= 2) {
                sim.heroAttacksThisTurn = 0;
                sim.turn = 'enemy';
                sim.hero.remainingMov = 0;
            } else {
                sim.hero.remainingMov = 0; // Prevent moving after first attack
                sim.log.unshift(`🏹 Bogenschütze-Effekt: Erste Attacke durchgeführt. Führe die zweite Attacke aus!`);
            }
        } else {
            sim.turn = 'enemy';
            sim.hero.remainingMov = 0;
        }
    }
    render();
};

window.executeCombatWeaponSwap = function() {
    const sim = state.combatSimulator;
    if (!sim || sim.hero.weapons.length < 2) return;
    
    const temp = sim.hero.weapons[0];
    sim.hero.weapons[0] = sim.hero.weapons[1];
    sim.hero.weapons[1] = temp;
    
    sim.hero.remainingMov = Math.max(0, sim.hero.remainingMov - 1);
    sim.log.unshift(`Waffe gewechselt zu: ${sim.hero.weapons[0].name}. (Kostet 1 BWG)`);
    render();
};

window.executeEnemyTurn = async function() {
    const sim = state.combatSimulator;
    if (!sim || sim.turn !== 'enemy') return;
    
    sim.log.unshift(`Der ${sim.enemy.name} lauert...`);
    render();
    
    const d6 = () => Math.floor(Math.random() * 6) + 1;
    
    // Parse Adrenalin for Ork
    const adr = window.getAbilityValues(sim.enemy.abilities, 'Adrenalin');
    let enemyStr = sim.enemy.str;
    let enemyMov = sim.enemy.mov;
    if (adr && sim.enemy.hp <= adr.x) {
        enemyStr += adr.y;
        enemyMov *= 2;
        sim.log.unshift(`${sim.enemy.name} nutzt Adrenalin! Stärke +${adr.y}, doppelte Bewegung.`);
    }
    
    // Apply slow effect (from Level 2 Crossbow talent)
    if (sim.enemy.slowTurns > 0) {
        sim.enemy.slowTurns--;
        enemyMov = Math.max(1, Math.floor(enemyMov / 2));
        sim.log.unshift(`❄️ Verlangsamung aktiv: Bewegung von ${sim.enemy.name} halbiert auf ${enemyMov}!`);
    }
    
    let hasMoved = false;
    for (let i = 0; i < enemyMov; i++) {
        const dr = Math.sign(sim.hero.pos.r - sim.enemy.pos.r);
        const dc = Math.sign(sim.hero.pos.c - sim.enemy.pos.c);
        
        const isAdj = Math.abs(sim.hero.pos.r - sim.enemy.pos.r) + Math.abs(sim.hero.pos.c - sim.enemy.pos.c) === 1;
        if (isAdj) break;
        
        if (dr !== 0) sim.enemy.pos.r += dr;
        else if (dc !== 0) sim.enemy.pos.c += dc;
        hasMoved = true;
        
        render();
        await new Promise(r => setTimeout(r, 200));
    }
    
    const isAdjFinal = Math.abs(sim.hero.pos.r - sim.enemy.pos.r) + Math.abs(sim.hero.pos.c - sim.enemy.pos.c) === 1;
    if (isAdjFinal) {
        // Präzisionsstreich: Roll 2 D6, use highest
        const prez = window.getAbilityValues(sim.enemy.abilities, 'Präzisionsstreich');
        const roll = prez ? Math.max(d6(), d6()) : d6();
        
        let extraDmg = 0;
        if (sim.enemy.name === 'Leichenfresser') extraDmg = 2;
        
        // Sturmangriff: +X Strength after movement
        const sturm = window.getAbilityValues(sim.enemy.abilities, 'Sturmangriff');
        if (hasMoved && sturm) {
            enemyStr += sturm.x;
            sim.log.unshift(`${sim.enemy.name} nutzt Sturmangriff! (+${sturm.x} Stärke nach Bwg)`);
        }
        
        // Panzerbrecher: Roll D6, on X+ ignore armor
        const panzer = window.getAbilityValues(sim.enemy.abilities, 'Panzerbrecher');
        let effHeroArmor = sim.hero.arm;
        if (panzer) {
            const pRoll = d6();
            if (pRoll >= panzer.x) {
                effHeroArmor = 0;
                sim.log.unshift(`${sim.enemy.name} durchbricht Rüstung vollständig! (Panzerbrecher-Wurf: ${pRoll} >= ${panzer.x})`);
            }
        }
        
        const enemyWeaponDmg = sim.enemy.weapon ? sim.enemy.weapon.dmg || 0 : 0;
        const damage = Math.max(0, enemyStr + roll + enemyWeaponDmg - effHeroArmor + extraDmg);
        sim.hero.hp = Math.max(0, sim.hero.hp - damage);
        
        let msg = `${sim.enemy.name} schlägt zu! Schaden: ${damage} HP. (Wurf: ${roll}`;
        if (sim.enemy.weapon) {
            msg += `, mit Waffe: ${sim.enemy.weapon.name}`;
        }
        msg += `)`;
        sim.log.unshift(msg);
        
        // Lähmung: Roll D6, on X+ hero paralyzed for 1 turn
        const laeh = window.getAbilityValues(sim.enemy.abilities, 'Lähmung');
        if (laeh) {
            const lRoll = d6();
            if (lRoll >= laeh.x) {
                sim.heroParalyzed = true;
                sim.log.unshift(`${sim.enemy.name} betäubt dich mit Lähmung! (Lähmung-Wurf: ${lRoll} >= ${laeh.x})`);
            }
        }
        
        sim.flashRed = true;
        setTimeout(() => { sim.flashRed = false; render(); }, 600);
    } else {
        sim.log.unshift(`${sim.enemy.name} kann nicht angreifen.`);
    }
    
    if (sim.hero.hp <= 0) {
        sim.endScreen = 'LOST';
    } else {
        if (sim.heroParalyzed) {
            sim.heroParalyzed = false;
            sim.log.unshift(`Du bist diese Runde betäubt und kannst nicht handeln!`);
            sim.turn = 'enemy';
            render();
            setTimeout(() => { window.executeEnemyTurn(); }, 1500);
            return;
        } else {
            sim.turn = 'hero';
            sim.heroAttacksThisTurn = 0;
            
            let extraMov = 0;
            const activeWeapon = sim.hero.weapons[0];
            if (activeWeapon && activeWeapon.name.toLowerCase().includes('armbrust')) {
                const armbrustLvl = sim.hero.talents.armbrust || 0;
                if (armbrustLvl === 1) extraMov = 1;
                else if (armbrustLvl === 2) extraMov = 2;
            }
            sim.hero.remainingMov = sim.hero.mov + extraMov;
            sim.hero.startPos = { ...sim.hero.pos };
            sim.actionDone = false;
            // If a charging spell was in progress, continue it
            if (sim.chargingSpell) {
                sim.log.unshift(`⚡ Aufladung von "${sim.chargingSpell.name}" bereit! Wähle Aufladungsstufe.`);
            }
        }
    }
    render();
};

window.confirmCombatMoveEnd = function() {
    const sim = state.combatSimulator;
    sim.confirmMoveDialog = false;
    window.endHeroTurn();
};

window.resetCombatMove = function() {
    const sim = state.combatSimulator;
    sim.hero.pos = { ...sim.hero.startPos };
    
    let extraMov = 0;
    const activeWeapon = sim.hero.weapons[0];
    if (activeWeapon && activeWeapon.name.toLowerCase().includes('armbrust')) {
        const armbrustLvl = sim.hero.talents.armbrust || 0;
        if (armbrustLvl === 1) extraMov = 1;
        else if (armbrustLvl === 2) extraMov = 2;
    }
    sim.hero.remainingMov = sim.hero.mov + extraMov;
    
    sim.confirmMoveDialog = false;
    sim.log.unshift("Bewegung zurückgesetzt.");
    render();
};


function renderSavePopup() {
    const slots = Object.keys(state.saveSlots || {});
    const popupHtml = `
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="state.savePopup.active = false; render();"></div>
            <div class="wood-card w-full max-w-md p-8 relative shadow-2xl border-2 border-secondary/30">
                <h3 class="font-headline text-2xl text-primary mb-6">Spiel speichern unter...</h3>
                
                ${slots.length > 0 ? `
                    <div class="mb-6 space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        <p class="text-[10px] uppercase text-on-surface-variant font-bold mb-2">Bestehende Spielstände</p>
                        ${slots.map(name => `
                            <button onclick="document.getElementById('save-name-input').value = '${name}'; state.savePopup.selectedSlot = '${name}'; render();" 
                                    class="w-full text-left p-3 border ${state.savePopup.selectedSlot === name ? 'border-secondary bg-secondary/10' : 'border-outline-variant/30 bg-surface-container'} hover:border-secondary/50 transition-all">
                                <span class="font-bold text-sm">${name}</span>
                            </button>
                        `).join('')}
                    </div>
                ` : ''}

                <div class="space-y-4">
                    <div>
                        <label class="text-[10px] uppercase text-on-surface-variant font-bold block mb-1">Speichername</label>
                        <input id="save-name-input" type="text" placeholder="Name eingeben..." 
                               class="w-full bg-surface-container-highest border border-outline-variant/50 p-3 text-on-surface focus:outline-none focus:border-secondary"
                               value="${state.savePopup.selectedSlot || ''}">
                    </div>
                    
                    <div class="flex gap-4 pt-4">
                        <button onclick="state.savePopup.active = false; render();" 
                                class="flex-1 bg-surface-container-high py-3 font-bold uppercase text-xs">Abbrechen</button>
                        <button onclick="saveGameWithName(document.getElementById('save-name-input').value)" 
                                class="flex-1 bg-secondary text-on-secondary py-3 font-bold uppercase text-xs shadow-lg">Speichern</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('app-content').insertAdjacentHTML('beforeend', popupHtml);
}

function renderLoadPopup() {
    const slots = Object.keys(state.saveSlots || {});
    const popupHtml = `
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="state.loadPopup.active = false; render();"></div>
            <div class="wood-card w-full max-w-md p-8 relative shadow-2xl border-2 border-secondary/30">
                <h3 class="font-headline text-2xl text-primary mb-6">Spiel laden</h3>
                
                <div class="space-y-2 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    ${slots.length > 0 ? slots.map(name => `
                        <button onclick="state.loadPopup.selectedSlot = '${name}'; render();" 
                                class="w-full text-left p-4 border ${state.loadPopup.selectedSlot === name ? 'border-secondary bg-secondary/10' : 'border-outline-variant/30 bg-surface-container'} hover:border-secondary transition-all">
                            <span class="font-bold text-lg">${name}</span>
                        </button>
                    `).join('') : '<p class="text-center py-10 opacity-50">Keine Spielstände gefunden.</p>'}
                </div>
                
                <div class="flex gap-4">
                    <button onclick="state.loadPopup.active = false; render();" 
                            class="flex-1 bg-surface-container-high py-3 font-bold uppercase text-xs">Abbrechen</button>
                    <button onclick="loadGameByName(state.loadPopup.selectedSlot)" 
                            ${!state.loadPopup.selectedSlot ? 'disabled' : ''}
                            class="flex-1 bg-secondary text-on-secondary py-3 font-bold uppercase text-xs shadow-lg disabled:opacity-30">Laden</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('app-content').insertAdjacentHTML('beforeend', popupHtml);
}

function renderDeletePopup() {
    const slots = Object.keys(state.saveSlots || {});
    const popupHtml = `
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="state.deletePopup.active = false; render();"></div>
            
            ${state.deletePopup.confirmActive ? `
                <div class="wood-card w-full max-w-sm p-8 relative shadow-2xl border-2 border-error/30">
                    <h3 class="font-headline text-2xl text-error mb-4">Sicher?</h3>
                    <p class="text-on-surface leading-relaxed mb-8 italic">Bist du dir sicher, dass du den Spielstand <strong>"${state.deletePopup.selectedSlot}"</strong> unwiderruflich löschen willst?</p>
                    <div class="flex gap-4">
                        <button onclick="state.deletePopup.active = false; render();" 
                                class="flex-1 bg-surface-container-high py-3 font-bold uppercase text-xs">Nein</button>
                        <button onclick="deleteGameByName(state.deletePopup.selectedSlot)" 
                                class="flex-1 bg-error text-on-error py-3 font-bold uppercase text-xs shadow-lg">Ja</button>
                    </div>
                </div>
            ` : `
                <div class="wood-card w-full max-w-md p-8 relative shadow-2xl border-2 border-secondary/30">
                    <h3 class="font-headline text-2xl text-primary mb-6">Spielstand löschen</h3>
                    <div class="space-y-2 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        ${slots.map(name => `
                            <button onclick="state.deletePopup.selectedSlot = '${name}'; render();" 
                                    class="w-full text-left p-4 border ${state.deletePopup.selectedSlot === name ? 'border-error bg-error/10' : 'border-outline-variant/30 bg-surface-container'} hover:border-error transition-all">
                                <span class="font-bold text-lg">${name}</span>
                            </button>
                        `).join('')}
                    </div>
                    <div class="flex gap-4">
                        <button onclick="state.deletePopup.active = false; render();" 
                                class="flex-1 bg-surface-container-high py-3 font-bold uppercase text-xs">Abbrechen</button>
                        <button onclick="state.deletePopup.confirmActive = true; render();" 
                                ${!state.deletePopup.selectedSlot ? 'disabled' : ''}
                                class="flex-1 bg-error text-on-error py-3 font-bold uppercase text-xs shadow-lg disabled:opacity-30">Spielstand löschen</button>
                    </div>
                </div>
            `}
        </div>
    `;
    document.getElementById('app-content').insertAdjacentHTML('beforeend', popupHtml);
}

window.renderQuestAcceptancePopup = function() {
    const popup = state.questAcceptancePopup;
    if (!popup || !popup.active) return;
    const questDef = QUESTS_DATA[popup.questId];
    if (!questDef) return;
    
    const popupHtml = `
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="closeQuestAcceptancePopup()"></div>
            <div class="wood-card w-full max-w-lg p-8 relative shadow-2xl border-2 border-secondary/30 flex flex-col gap-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div class="flex items-center gap-4 border-b border-outline-variant/30 pb-4">
                    <img class="w-16 h-16 rounded-sm object-cover border border-secondary/40 shadow-md bg-surface-container" src="${questDef.img}" onerror="this.src='https://lh3.googleusercontent.com/aida-public/AB6AXuBVfWUNF1X6qbXNG7dKPDZlHs8WNE-Y1MA0upTuCjZuB8jmeuqd_wV4Nr8qnTxdWBP8Qtc7Zrx_I9wzM8cZ4ulJ5U0K2odkKjW9NqE7YTfpih6sIZjr9oKQIXqcoUuX5zOPWqnvKI2gwIAgiKkecafAg8GQaXFagBhXQhbC3d9mjQebRQf67_zexYJ1WosWmDOd1Fr3qbSsJsT79VQl9t2ZWwWhYpTDAIjAEaE3SPjGnmXOShnZ6MeasZJXq6iMKg3hgD8YOfJdMb0'"/>
                    <div>
                        <h3 class="font-headline text-2xl text-primary">${questDef.title}</h3>
                        <span class="text-[10px] text-secondary uppercase tracking-[0.15em] font-bold">Questgeber: ${questDef.giver}</span>
                    </div>
                </div>
                
                <div class="space-y-4">
                    <p class="text-on-surface-variant italic text-sm leading-relaxed border-l-2 border-outline-variant/20 pl-4 whitespace-pre-line">
                        "${questDef.firstSpeech}"
                    </p>
                </div>
                
                <div class="flex flex-col gap-3 pt-4">
                    <button onclick="acceptQuest('${popup.npcName}')" 
                            class="w-full bg-secondary text-on-secondary py-3 font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-sm">check_circle</span>
                        Quest annehmen
                    </button>
                    <button onclick="delegateQuest('${popup.npcName}')" 
                            class="w-full bg-surface-container-high text-on-surface-variant py-3 font-bold text-xs uppercase tracking-widest border border-outline-variant/30 hover:bg-error/10 hover:text-error hover:border-error/30 active:scale-95 transition-all flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-sm">remove_circle</span>
                        Quest vergeben
                    </button>
                    <button onclick="closeQuestAcceptancePopup()" 
                            class="w-full bg-surface-container-high py-3 font-bold text-xs uppercase tracking-widest hover:bg-surface-container-highest active:scale-95 transition-all flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-sm">cancel</span>
                        Quest ablehnen
                    </button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('app-content').insertAdjacentHTML('beforeend', popupHtml);
};

window.getNextQuestStepKey = function(questDef, currentStep, allSteps) {
    const currentIdx = allSteps.indexOf(currentStep);
    
    // 1. Prefix-based branch progression:
    // If the currentStep starts with a prefix like optX_ (where X is a number),
    // we search for the next step starting with the same optX_ prefix, or a terminal step.
    const optPrefixMatch = currentStep.match(/^(opt\d+)_/);
    if (optPrefixMatch) {
        const prefix = optPrefixMatch[1];
        for (let i = currentIdx + 1; i < allSteps.length; i++) {
            const step = allSteps[i];
            if (step.startsWith(prefix) || step === 'end' || step.endsWith('_end')) {
                return step;
            }
        }
    }
    
    // 2. Failure retry loop:
    // If the step has no forward progression but is pointed to by an option in a previous step,
    // we can transition back to that step so the player can retry the fight/options.
    // Example: opt3_verloren -> goblins
    let hasForwardProgression = false;
    if (optPrefixMatch) {
        const prefix = optPrefixMatch[1];
        hasForwardProgression = allSteps.slice(currentIdx + 1).some(step => step.startsWith(prefix) || step === 'end' || step.endsWith('_end'));
    } else {
        hasForwardProgression = (currentIdx < allSteps.length - 1);
    }
    
    if (!hasForwardProgression) {
        for (const [stepKey, stepData] of Object.entries(questDef.dialogs)) {
            if (stepData.options) {
                for (const opt of stepData.options) {
                    if (opt.nextStep === currentStep) {
                        return stepKey;
                    }
                }
            }
        }
    }
    
    // 3. Sequential progression:
    // We progress chronologically to the next step that:
    // - Does not contain 'fail' or end with '_fail'
    // - Does not belong to a specific option branch (starts with 'opt') if the currentStep itself is not on that branch.
    for (let i = currentIdx + 1; i < allSteps.length; i++) {
        const step = allSteps[i];
        
        if (step.includes('fail') || step.endsWith('_fail')) {
            continue;
        }
        
        if (step.startsWith('opt') && !currentStep.startsWith('opt')) {
            continue;
        }
        
        return step;
    }
    
    return null;
};

window.renderQuestProgressPopup = function() {
    const popup = state.questProgressPopup;
    if (!popup || !popup.active) return;
    const heroQuest = state.hero.quests.find(q => q.id === popup.questId);
    if (!heroQuest) return;
    const questDef = QUESTS_DATA[popup.questId];
    if (!questDef) return;
    
    const currentStep = heroQuest.currentStep || 'accepted';
    const stepData = questDef.dialogs[currentStep];
    if (!stepData) return;
    
    const options = stepData.options || [];
    let actionsHtml = '';
    
    if (options.length > 0) {
        actionsHtml = options.map((opt, idx) => {
            let clickAction = '';
            const targetStep = questDef.dialogs[opt.nextStep];
            const isFail = opt.nextStep.includes('fail') || opt.nextStep.endsWith('_fail') ||
                           (targetStep && targetStep.text && targetStep.text.toLowerCase().includes('fehlgeschlagen'));
            const isTerminal = opt.nextStep.endsWith('_end') || opt.nextStep === 'end' ||
                               (targetStep && !targetStep.options && !targetStep.condition) ||
                               (targetStep && targetStep.text && (targetStep.text.toLowerCase().includes('quest erfolgreich') || 
                                                                 targetStep.text.toLowerCase().includes('quest beendet') || 
                                                                 targetStep.text.toLowerCase().includes('quest fehlgeschlagen')));
            
            if (isFail) {
                clickAction = `failQuestWithOption('${popup.questId}', '${opt.nextStep}')`;
            } else if (isTerminal) {
                clickAction = `completeQuestWithOption('${popup.questId}', '${opt.nextStep}')`;
            } else {
                clickAction = `progressQuestToNext('${popup.questId}', '${opt.nextStep}')`;
            }
            return `
                <button onclick="${clickAction}" 
                        class="w-full bg-secondary/10 hover:bg-secondary text-secondary hover:text-on-secondary py-3 px-4 text-left font-bold text-xs uppercase border border-secondary/30 hover:border-secondary transition-all rounded-sm shadow-md flex items-center gap-3">
                    <span class="material-symbols-outlined text-sm text-secondary hover:text-on-secondary">chevron_right</span>
                    ${opt.text}
                </button>
            `;
        }).join('');
    } else {
        let clickAction = '';
        let buttonText = 'Fortfahren';
        let buttonIcon = 'arrow_forward';
        
        const isFail = currentStep.includes('fail') || currentStep.endsWith('_fail') ||
                       (stepData.text && stepData.text.toLowerCase().includes('fehlgeschlagen'));
        const isTerminal = currentStep.endsWith('_end') || currentStep === 'end' || 
                           (!stepData.options && !stepData.condition) ||
                           (stepData.text && (stepData.text.toLowerCase().includes('quest erfolgreich') || 
                                             stepData.text.toLowerCase().includes('quest beendet') || 
                                             stepData.text.toLowerCase().includes('quest fehlgeschlagen')));
        
        if (isFail) {
            clickAction = `completeQuestWithOption('${popup.questId}', '${currentStep}', 'Fehlgeschlagen')`;
            buttonText = 'Quest Fehlschlagen lassen';
            buttonIcon = 'cancel';
        } else if (isTerminal) {
            clickAction = `completeQuestWithOption('${popup.questId}', '${currentStep}', 'Erfolgreich')`;
            buttonText = 'Quest Abschließen';
            buttonIcon = 'check_circle';
        } else {
            const allSteps = Object.keys(questDef.dialogs);
            const nextStepKey = window.getNextQuestStepKey(questDef, currentStep, allSteps);
            
            if (nextStepKey) {
                clickAction = `progressQuestToNext('${popup.questId}', '${nextStepKey}')`;
                buttonText = 'Bedingung erfüllen & Fortfahren';
                buttonIcon = 'verified';
            } else {
                clickAction = `completeQuestWithOption('${popup.questId}', '${currentStep}', 'Erfolgreich')`;
                buttonText = 'Quest Abschließen';
                buttonIcon = 'check_circle';
            }
        }
        
        actionsHtml = `
            <button onclick="${clickAction}" 
                    class="w-full bg-secondary text-on-secondary py-3 font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-sm">${buttonIcon}</span>
                ${buttonText}
            </button>
        `;
    }
    
    const popupHtml = `
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="closeQuestProgressPopup()"></div>
            <div class="wood-card w-full max-w-lg p-8 relative shadow-2xl border-2 border-secondary/30 flex flex-col gap-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div class="flex items-center gap-4 border-b border-outline-variant/30 pb-4">
                    <img class="w-16 h-16 rounded-sm object-cover border border-secondary/40 shadow-md bg-surface-container" src="${questDef.img}" onerror="this.src='https://lh3.googleusercontent.com/aida-public/AB6AXuBVfWUNF1X6qbXNG7dKPDZlHs8WNE-Y1MA0upTuCjZuB8jmeuqd_wV4Nr8qnTxdWBP8Qtc7Zrx_I9wzM8cZ4ulJ5U0K2odkKjW9NqE7YTfpih6sIZjr9oKQIXqcoUuX5zOPWqnvKI2gwIAgiKkecafAg8GQaXFagBhXQhbC3d9mjQebRQf67_zexYJ1WosWmDOd1Fr3qbSsJsT79VQl9t2ZWwWhYpTDAIjAEaE3SPjGnmXOShnZ6MeasZJXq6iMKg3hgD8YOfJdMb0'"/>
                    <div>
                        <h3 class="font-headline text-2xl text-primary">${questDef.title}</h3>
                        <span class="text-[10px] text-secondary uppercase tracking-[0.15em] font-bold">Questgeber: ${questDef.giver}</span>
                    </div>
                </div>
                
                <div class="space-y-4">
                    <p class="text-on-surface-variant italic text-sm leading-relaxed border-l-2 border-outline-variant/20 pl-4 whitespace-pre-line">
                        "${stepData.text}"
                    </p>
                    
                    ${stepData.condition ? `
                        <div class="mt-4 bg-secondary/5 p-4 border border-secondary/20 rounded-sm">
                            <span class="text-[9px] text-secondary uppercase font-bold tracking-wider block mb-1">Erforderliche Bedingung</span>
                            <p class="text-xs font-bold text-on-surface">${stepData.condition}</p>
                        </div>
                    ` : ''}
                </div>
                
                <div class="flex flex-col gap-3 pt-4">
                    ${actionsHtml}
                    <button onclick="closeQuestProgressPopup()" 
                            class="w-full bg-surface-container-high py-3 font-bold text-xs uppercase tracking-widest hover:bg-surface-container-highest active:scale-95 transition-all flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-sm">close</span>
                        Schließen
                    </button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('app-content').insertAdjacentHTML('beforeend', popupHtml);
};

// --- Render Logic ---

function render() {
    if (window.syncAuraHp) window.syncAuraHp();
    console.log("Rendering screen:", state.currentScreen, "| Items im Inventar:", state.hero.inventory.length);
    
    // Update background music track based on active screen
    if (window.BGM) window.BGM.update();

    const content = document.getElementById('app-content');
    if (!content) return;

    const templateFn = templates[state.currentScreen];
    
    if (templateFn) {
        try {
            content.innerHTML = templateFn();
        } catch (e) {
            console.error("Render Error:", e);
            content.innerHTML = `<div class="p-10 text-error">Fehler beim Laden der Seite: ${e.message}</div>`;
        }
    }

    // Render Popups if active
    if (state.savePopup.active) renderSavePopup();
    if (state.loadPopup.active) renderLoadPopup();
    if (state.deletePopup.active) renderDeletePopup();
    if (state.questAcceptancePopup && state.questAcceptancePopup.active) window.renderQuestAcceptancePopup();
    if (state.questProgressPopup && state.questProgressPopup.active) window.renderQuestProgressPopup();

    if (state.analyseWindow && !state.analyseWindow.closed) {
        window.renderAnalyseWindow(state.analyseWindow);
    }

    updateUI();
}

window.confirmChapterSelection = function() {
    const sel = document.getElementById('top-chapter-select');
    if (sel && state.hero) {
        state.hero.chapter = parseInt(sel.value) || 1;
        saveGame();
        alert(`Kapitel ${state.hero.chapter} wurde erfolgreich als aktuelles Kapitel übernommen und gespeichert.`);
        render();
    }
};

function updateUI() {
    if (document.getElementById('top-hero-name')) document.getElementById('top-hero-name').innerText = state.hero ? state.hero.name || "Held" : "Held";
    if (document.getElementById('top-hero-level')) document.getElementById('top-hero-level').innerText = state.hero ? `Level ${state.hero.level || 0}` : "Level 0";
    if (document.getElementById('top-ore-display')) document.getElementById('top-ore-display').innerText = state.hero ? `${(state.hero.ore || 0).toLocaleString()} Erz` : "0 Erz";
    if (document.getElementById('top-chapter-select')) document.getElementById('top-chapter-select').value = state.hero ? state.hero.chapter || 1 : 1;

    document.querySelectorAll('.nav-item').forEach(item => {
        const screen = item.id.replace('nav-', '');
        if (screen === state.currentScreen) {
            item.classList.add('bg-secondary-container', 'text-secondary', 'border-t-2', 'border-secondary', 'brightness-125', 'opacity-100');
            item.classList.remove('opacity-60');
            const icon = item.querySelector('.material-symbols-outlined');
            if (icon) icon.style.fontVariationSettings = "'FILL' 1";
        } else {
            item.classList.remove('bg-secondary-container', 'text-secondary', 'border-t-2', 'border-secondary', 'brightness-125', 'opacity-100');
            item.classList.add('opacity-60');
            const icon = item.querySelector('.material-symbols-outlined');
            if (icon) icon.style.fontVariationSettings = "'FILL' 0";
        }
    });

    const topBar = document.querySelector('header');
    const bottomNav = document.querySelector('nav.fixed.bottom-0');
    if (state.currentScreen === 'startseite' || state.currentScreen === 'schlachtfeld') {
        if (topBar) topBar.classList.add('hidden');
        if (bottomNav) bottomNav.classList.add('hidden');
    } else {
        if (topBar) {
            topBar.classList.remove('hidden');
            if (document.getElementById('top-hero-name')) document.getElementById('top-hero-name').innerText = state.hero ? state.hero.name || "Held" : "Held";
            if (document.getElementById('top-hero-level')) document.getElementById('top-hero-level').innerText = state.hero ? `Level ${state.hero.level || 0}` : "Level 0";
            if (document.getElementById('top-ore-display')) document.getElementById('top-ore-display').innerText = state.hero ? `${(state.hero.ore || 0).toLocaleString()} Erz` : "0 Erz";
        }
        if (bottomNav) bottomNav.classList.remove('hidden');
    }
}

const TRADER_SPECS = {
    "Altes Lager": [
        { name: "Cavalorn", spec: "Bogen & Pfeile & Ausrüstung" },
        { name: "Dexter", spec: "Nahrung & Tränke & Sumpfkraut" },
        { name: "Fisk", spec: "Waffen aller Art & Rüstung & Ausrüstung" },
        { name: "Huno", spec: "Nahkampfwaffen" },
        { name: "Scorpio", spec: "Nahkampfwaffen & Fernkampfwaffen" },
        { name: "Skip", spec: "Waffen aller Art" },
        { name: "Torrez", spec: "Magie & Spruchrollen & Runen & Tränke" }
    ],
    "Neues Lager": [
        { name: "Cipher", spec: "Sumpfkraut & Ausrüstung & Waffen" },
        { name: "Cronos", spec: "Magie & Spruchrollen & Runen & Tränke" },
        { name: "Mordrag", spec: "Diebesgut & Ausrüstung & Nahrung" },
        { name: "Riordian", spec: "Magie & Tränke" },
        { name: "Sharky", spec: "Waffen aller Art & Ausrüstung" },
        { name: "Wolf", spec: "Fernkampfwaffen & Rüstung" }
    ],
    "Sektenlager": [
        { name: "Darrion", spec: "Nahkampfwaffen & Fernkampfwaffen" },
        { name: "Fortuno", spec: "Ausrüstung & Nahrung" },
        { name: "Gor Na Toth", spec: "Ausrüstung & Fernkampfwaffen & leichte Rüstung & Schwere Rüstung" },
        { name: "Joru", spec: "Ausrüstung & Nahrung" },
        { name: "Baal Cadar", spec: "Magie & Nahrung" },
        { name: "Cor Kalom", spec: "Ausrüstung & Nahrung" },
        { name: "Baal Namib", spec: "Nahkampfwaffen" }
    ],
    "Ereignis": [
        { name: "Jäger", spec: "Jagdbeute & Felle" },
        { name: "Waffenhändler", spec: "Waffen aller Art" },
        { name: "Novize", spec: "Sumpfkraut & Tränke" },
        { name: "Ausrüstungshändler", spec: "Werkzeuge & Diverses" },
        { name: "Magiehändler", spec: "Spruchrollen & Runen" },
        { name: "Nahrungshändler", spec: "Proviant & Wein" }
    ]
};

// --- Templates ---

const templates = {
    startseite: () => {
        return `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-surface-dim overflow-hidden">
                <!-- Background Layer -->
                <div class="absolute inset-0 z-0">
                    <img alt="Background Texture" class="w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqxI-yrykYy3X0GWlspQWYmusNzv3HdL_OxsLN95_XMyvgRaJO_SA_IYH7aLfia0xQfm3tHArihtO0m-WU4KmZX8P1ffepqRmD1x7Gcst8p1anOCSEwWPaDajTu8SxLHHmOCn5KdbTjQT5f32VolfXGQhjy9sVzFIvMDtLdPdoZe7y-RTDuDTrcwWVusj3dri398qF6B0IqxU1qrR9PZsfuuxwNL3x5HMAqGkAIvymoP1wLiNqbkaUbG_4sXdxE55IFBfjdEwtENQ"/>
                    <div class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background opacity-70"></div>
                    <div class="absolute inset-0 parchment-grain opacity-10"></div>
                </div>
                
                <div class="relative z-10 w-full max-w-md px-10 flex flex-col items-center justify-center min-h-screen">
                    <header class="mb-12 text-center w-full flex flex-col items-center">
                        <img alt="GOTIK" class="w-full h-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] scale-110 max-w-xs" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuap10-C9NOUTlJibr-KJXndt6pgJ5i8fS_7f_K1_3EVz9A1Lx53ShcxETG-9Fv23zEPOR1qjwGSWxuGnS859WWOyfGHBKDht2OJ9RYKqX6oGcMIXh7Xkq2qXFcWfadRac7zTh2vhL-_Fc1LDVZUE9ffGGvrgB2dvpfJeh_xURP3k4waVR5bSzhOCj1ttFCTK4UXkdEe3DUuKWSIoA3wktyY2IGz00AQar26DT-6Vfz79v2yUsgMSnH2BOvhA_7LxquHYeVRtMVIY"/>
                        <div class="h-px w-32 bg-gradient-to-r from-transparent via-secondary to-transparent mx-auto mt-6 opacity-40"></div>
                    </header>

                    <nav class="flex flex-col items-center space-y-8 w-full">
                        ${state.gameStarted ? `
                        <button onclick="navigateTo(state.previousScreen || 'status')" 
                                class="font-headline text-3xl md:text-4xl text-on-surface-variant hover:text-secondary active:scale-95 transition-all duration-300 tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            Weiterspielen
                        </button>
                        ` : ''}
                        <button onclick="startNewGame()" 
                                class="font-headline text-3xl md:text-4xl text-on-surface-variant hover:text-secondary active:scale-95 transition-all duration-300 tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            Neues Spiel
                        </button>
                        <button onclick="openLoadPopup()" 
                                class="font-headline text-3xl md:text-4xl text-on-surface-variant hover:text-secondary active:scale-95 transition-all duration-300 tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            Spiel laden
                        </button>
                        <button onclick="openSavePopup()" 
                                ${!state.gameStarted ? 'disabled' : ''}
                                class="font-headline text-3xl md:text-4xl text-on-surface-variant hover:text-secondary active:scale-95 transition-all duration-300 tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] disabled:opacity-30 disabled:grayscale disabled:pointer-events-none">
                            Spiel speichern unter
                        </button>
                        <button onclick="openDeletePopup()" 
                                ${Object.keys(state.saveSlots || {}).length === 0 ? 'disabled' : ''}
                                class="font-headline text-3xl md:text-4xl text-on-surface-variant hover:text-secondary active:scale-95 transition-all duration-300 tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] disabled:opacity-30 disabled:grayscale disabled:pointer-events-none">
                            Spielstand löschen
                        </button>
                    </nav>
                    
                    <footer class="absolute bottom-10 w-full text-center pointer-events-none">
                        <p class="font-label-sm text-[10px] md:text-xs text-on-surface-variant opacity-60 uppercase tracking-[0.3em] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                            Version ${APP_VERSION}
                        </p>
                    </footer>
                </div>

                <!-- Hero Selection Modal -->
                ${state.heroSelectionPopup.active ? `
                    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div class="modal-overlay absolute inset-0"></div>
                        <div class="wood-card w-full max-w-5xl max-h-[90vh] p-8 relative shadow-2xl border-2 border-secondary/30 flex flex-col overflow-hidden">
                            <h3 class="font-headline text-4xl text-primary mb-8 text-center italic border-b border-outline-variant/20 pb-4">Welchen Helden wählst du?</h3>
                            
                            <div class="grid grid-cols-3 gap-6 overflow-y-auto custom-scrollbar pr-4">
                                ${HEROES.map(hero => `
                                    <button onclick="previewHero('${hero.name}')" class="group flex flex-col items-center">
                                        <div class="w-full aspect-square border-2 border-outline-variant group-hover:border-primary transition-all overflow-hidden relative shadow-lg bg-surface-container-lowest">
                                            <img class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src="${hero.image}">
                                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                            <div class="absolute bottom-2 inset-x-0 text-center">
                                                <span class="font-headline text-xl text-primary italic drop-shadow-md">${hero.name}</span>
                                            </div>
                                        </div>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Hero Detail Modal -->
                ${state.heroSelectionPopup.selectedHero ? (() => {
                    const hero = HEROES.find(h => h.name === state.heroSelectionPopup.selectedHero);
                    return `
                    <div class="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <div class="modal-overlay absolute inset-0"></div>
                        <div class="wood-card w-full max-w-4xl p-8 relative shadow-2xl border-2 border-primary/50 flex flex-col md:flex-row gap-8">
                            <div class="w-full md:w-1/2 aspect-square border-4 border-primary/20 shadow-2xl overflow-hidden">
                                <img src="${hero.image}" class="w-full h-full object-cover">
                            </div>
                            <div class="flex-grow flex flex-col gap-6">
                                <div>
                                    <h3 class="font-headline text-4xl text-primary italic mb-4">${hero.name}</h3>
                                    <div class="space-y-4 text-on-surface-variant">
                                        <div>
                                            <p class="text-[10px] text-secondary uppercase font-bold tracking-widest mb-1">Dein Verbrechen</p>
                                            <p class="text-sm italic leading-relaxed border-l-2 border-secondary/30 pl-4">${hero.crime}</p>
                                        </div>
                                        <div>
                                            <p class="text-[10px] text-primary uppercase font-bold tracking-widest mb-1">Deine Quest</p>
                                            <p class="text-sm leading-relaxed">${hero.quest}</p>
                                        </div>
                                        <div>
                                            <p class="text-[10px] text-secondary uppercase font-bold tracking-widest mb-1">Questbelohnung</p>
                                            <p class="text-sm font-bold text-secondary">${hero.reward}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mt-auto flex gap-4 pt-6 border-t border-outline-variant/20">
                                    <button onclick="state.heroSelectionPopup.selectedHero = null; render();" class="flex-1 border border-outline-variant text-on-surface-variant py-3 font-bold text-xs uppercase tracking-widest hover:bg-surface-container-high transition-all">Anderen Held ansehen</button>
                                    <button onclick="selectHero('${hero.name}')" class="flex-1 bg-primary text-on-primary py-3 font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-lg active:scale-95 transition-all">Held wählen</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                })() : ''}
            </div>
        `;
    },
    status: () => {
        const hero = state.hero;
        return `
            <main class="max-w-screen-xl mx-auto px-6 md:px-10 py-8 flex flex-col gap-8">
                <!-- Verbrechen Section -->
                <div class="wood-card p-4 border-l-4 border-l-error">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-error">gavel</span>
                        <p class="font-body text-on-surface">Dein Verbrechen: <span class="font-bold text-error">${hero.crime}</span></p>
                    </div>
                </div>

                <!-- Gilden Dropdown -->
                <div class="flex flex-col gap-2">
                    <label class="text-[10px] text-on-surface-variant uppercase tracking-widest px-1 font-bold">Gilde</label>
                    <div class="relative w-full max-w-xs">
                        <select class="gilden-select w-full" onchange="state.hero.guild = this.value; render()">
                            <option value="keine" ${hero.guild === 'keine' ? 'selected' : ''}>Keine</option>
                            <option value="schatten" ${hero.guild === 'schatten' ? 'selected' : ''}>Schatten</option>
                            <option value="gardist" ${hero.guild === 'gardist' ? 'selected' : ''}>Gardist</option>
                            <option value="feuermagier" ${hero.guild === 'feuermagier' ? 'selected' : ''}>Feuermagier</option>
                            <option value="novize" ${hero.guild === 'novize' ? 'selected' : ''}>Novize</option>
                            <option value="templer" ${hero.guild === 'templer' ? 'selected' : ''}>Templer</option>
                            <option value="baal" ${hero.guild === 'baal' ? 'selected' : ''}>Baal</option>
                            <option value="bandit" ${hero.guild === 'bandit' ? 'selected' : ''}>Bandit</option>
                            <option value="söldner" ${hero.guild === 'söldner' ? 'selected' : ''}>Söldner</option>
                            <option value="wassermagier" ${hero.guild === 'wassermagier' ? 'selected' : ''}>Wassermagier</option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-secondary">
                            <span class="material-symbols-outlined text-sm">expand_more</span>
                        </div>
                    </div>
                </div>

                <!-- Character Overview Bento Grid -->
                <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <!-- Left Col -->
                    <div class="md:col-span-4 flex flex-col gap-6">
                        <div class="wood-card overflow-hidden border-2 border-outline-variant shadow-2xl group relative bg-black/40">
                            <img src="${hero.image}" class="w-full max-h-[500px] object-contain transition-all duration-700">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                            <div class="absolute bottom-4 left-4 z-10">
                                <p class="font-headline text-3xl text-primary italic drop-shadow-lg">Level ${hero.level}</p>
                                <p class="text-[10px] uppercase text-secondary font-bold tracking-widest drop-shadow-md">${hero.guild}</p>
                            </div>
                        </div>
                        <!-- HP, LP, XP, Learned Effects -->
                        <div class="flex flex-col gap-4 mt-6">
                            <!-- HP -->
                            <div class="wood-card p-4 border-l-4 border-l-primary flex flex-col gap-3">
                                <div class="flex justify-between items-center">
                                    <span class="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Lebenspunkte</span>
                                    <span class="material-symbols-outlined text-primary text-2xl opacity-50">favorite</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <button onclick="updateState(s => s.hero.hp.current = Math.max(0, s.hero.hp.current - 1))" class="w-10 h-10 bg-error/20 hover:bg-error text-error hover:text-on-error flex items-center justify-center rounded-sm transition-colors shadow-sm">
                                        <span class="material-symbols-outlined">remove</span>
                                    </button>
                                    <span class="text-3xl font-headline text-primary">${hero.hp.current} <span class="text-xl text-on-surface-variant opacity-60">/ ${window.getTotalMaxHp()}</span></span>
                                    <button onclick="updateState(s => s.hero.hp.current = Math.min(window.getTotalMaxHp(), s.hero.hp.current + 1))" class="w-10 h-10 bg-primary/20 hover:bg-primary text-primary hover:text-on-primary flex items-center justify-center rounded-sm transition-colors shadow-sm">
                                        <span class="material-symbols-outlined">add</span>
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Rüstung -->
                            <div class="wood-card p-4 border-l-4 border-l-outline-variant flex justify-between items-center bg-surface-container-low/40">
                                <div class="flex flex-col">
                                    <span class="text-[10px] text-on-surface-variant uppercase font-bold">Rüstung (Gesamt)</span>
                                    <span class="text-2xl font-headline text-on-surface">${window.calculateTotalArmor()}</span>
                                </div>
                                <span class="material-symbols-outlined text-on-surface-variant/30 text-3xl">shield</span>
                            </div>

                            <div class="wood-card p-4 border-l-4 border-l-secondary">
                                <div class="flex justify-between items-center">
                                    <div class="flex flex-col">
                                        <span class="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Lernpunkte (LP)</span>
                                        <span class="text-2xl font-headline text-secondary">${hero.lp}</span>
                                    </div>
                                    <span class="material-symbols-outlined text-secondary text-3xl opacity-50">school</span>
                                </div>
                            </div>

                            <div class="wood-card p-4">
                                <div class="flex justify-between text-[10px] uppercase text-on-surface-variant mb-1 font-bold">
                                    <span>Erfahrungsfortschritt</span>
                                    <div class="flex items-center gap-2">
                                        <button onclick="toggleXpPause()" class="w-6 h-6 flex items-center justify-center rounded-full transition-all border ${hero.xpPaused ? 'bg-error/20 hover:bg-error text-error hover:text-on-error border-error/30' : 'bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white border-emerald-500/30'}" title="${hero.xpPaused ? 'Erfahrung pausiert (klicken zum Fortsetzen)' : 'Erfahrung aktiv (klicken zum Pausieren)'}">
                                            <span class="material-symbols-outlined text-[14px]">${hero.xpPaused ? 'play_arrow' : 'pause'}</span>
                                        </button>
                                        <span class="text-secondary">${hero.xp.current.toLocaleString()} / ${hero.xp.next.toLocaleString()}</span>
                                        <button onclick="openResourcePopup('xp_add')" class="w-5 h-5 bg-secondary/20 hover:bg-secondary text-secondary hover:text-on-secondary flex items-center justify-center rounded-full transition-colors shadow-sm"><span class="material-symbols-outlined text-[12px]">add</span></button>
                                    </div>
                                </div>
                                <div class="h-2 w-full bg-surface-container-low border border-outline-variant/20 overflow-hidden mt-2 rounded-full">
                                    <div class="h-full bg-secondary shadow-[0_0_8px_rgba(228,195,117,0.5)]" style="width: ${(hero.xp.current / hero.xp.next) * 100}%"></div>
                                </div>
                            </div>

                            ${(() => {
                                const learnedEffects = [];
                                hero.talents.forEach(t => {
                                    for (let i = 0; i < t.level; i++) {
                                        if (t.descs && t.descs[i]) {
                                            let label = '';
                                            if (t.id === 'magie') label = `Kreis ${i + 1}`;
                                            else if (t.id === 'schloss') label = `Schlösserknacken ${i + 1}`;
                                            else label = i === 0 ? `${t.name.replace('schiessen','schütze').replace('Bogenschiessen','Bogenschütze').replace('Armbrustschiessen','Armbrustschütze')} (Kämpfer)` : `${t.name.replace('schiessen','schütze').replace('Bogenschiessen','Bogenschütze').replace('Armbrustschiessen','Armbrustschütze')} (Meister)`;
                                            learnedEffects.push({ label, desc: t.descs[i], icon: t.icon });
                                        }
                                    }
                                });
                                const questCompleted = !hero.quests || !hero.quests.some(q => q.id === 'hero_quest');
                                if (questCompleted) {
                                    const heroData = HEROES.find(h => h.name === hero.name);
                                    if (heroData) {
                                        learnedEffects.push({
                                            label: "Heldentalent (Passiv)",
                                            desc: heroData.reward,
                                            icon: "auto_awesome"
                                        });
                                    }
                                }
                                if (learnedEffects.length === 0) return '';
                                return `
                                <div class="wood-card p-4 border-l-4 border-l-secondary/50">
                                    <span class="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold block mb-3">Gelernte Fähigkeiten</span>
                                    <div class="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                        ${learnedEffects.map(e => `
                                            <div class="flex gap-3 items-start">
                                                <span class="material-symbols-outlined text-secondary text-base mt-0.5 flex-shrink-0">${e.icon}</span>
                                                <div>
                                                    <span class="text-[10px] text-secondary font-bold uppercase block leading-none mb-1">${e.label}</span>
                                                    <span class="text-[11px] text-on-surface-variant leading-snug">${e.desc}</span>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>`;
                            })()}
                        </div>

                        <div class="mt-2 flex flex-col gap-3">
                            <button onclick="openSavePopup()" class="w-full bg-secondary text-on-secondary font-bold py-3 uppercase tracking-widest hover:brightness-110 shadow-lg active:scale-95 transition-all rounded-sm text-sm">
                                SPIEL SPEICHERN UNTER
                            </button>
                            <button onclick="openLoadPopup()" class="w-full bg-surface-container-high text-primary font-bold py-3 uppercase tracking-widest border border-primary/20 hover:bg-surface-container-highest transition-all rounded-sm text-sm">
                                SPIEL LADEN
                            </button>
                        </div>

                        <!-- Rasten Button -->
                        <button onclick="rastenHero()"
                                class="w-full mt-2 bg-primary/10 hover:bg-primary/30 border border-primary/30 text-primary py-3 font-headline uppercase text-xs tracking-widest font-bold transition-all flex items-center justify-center gap-2">
                            <span class="material-symbols-outlined text-sm">hotel</span>
                            Rasten (HP &amp; Mana voll)
                        </button>
                    </div>

                    <!-- Right Col -->
                    <div class="md:col-span-8 flex flex-col gap-6">
                        <!-- Combat Prep Button -->
                        <div class="flex justify-center w-full my-2">
                            <button onclick="state.combatPopup = { active: true, step: 'mode', passwordInput: '', error: '' }; render();" 
                                    class="bg-error hover:bg-error/95 text-on-error font-headline py-3 px-8 text-sm uppercase tracking-widest border border-error/20 hover:brightness-110 shadow-lg active:scale-95 transition-all rounded-sm flex items-center gap-3">
                                <span class="material-symbols-outlined text-lg animate-pulse">swords</span>
                                Ein Kampf steht bevor
                            </button>
                        </div>

                        <!-- Ausrüstung Display -->
                        ${(() => {
                            const eq = hero.equipment || {};
                            
                            if (!hero.primaryWeapon) {
                                if (eq.melee) hero.primaryWeapon = 'melee';
                                else if (eq.ranged) hero.primaryWeapon = 'ranged';
                            } else {
                                if (hero.primaryWeapon === 'melee' && !eq.melee) hero.primaryWeapon = eq.ranged ? 'ranged' : null;
                                else if (hero.primaryWeapon === 'ranged' && !eq.ranged) hero.primaryWeapon = eq.melee ? 'melee' : null;
                            }

                            const getSlotName = (item) => {
                                if (eq.melee?.name === item.name) return "Nahkampf";
                                if (eq.ranged?.name === item.name) return "Fernkampf";
                                if (eq.armor?.name === item.name) return "Rüstung";
                                if (eq.artifacts?.amulet?.name === item.name) return "Amulett";
                                if (eq.artifacts?.ring1?.name === item.name) return "Ring 1";
                                if (eq.artifacts?.ring2?.name === item.name) return "Ring 2";
                                return "Artefakt";
                            };

                            const row1 = [eq.melee, eq.ranged, eq.armor].filter(Boolean);
                            const row2 = [eq.artifacts?.amulet, eq.artifacts?.ring1, eq.artifacts?.ring2].filter(Boolean);
                            const row3 = (eq.artifacts?.others || []).filter(Boolean);
                            
                            if (row1.length === 0 && row2.length === 0 && row3.length === 0) return '';
                            
                            const renderItem = (item) => `
                                <div class="flex flex-col items-center gap-2 flex-1 min-w-[80px]">
                                    <span class="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider whitespace-nowrap">${getSlotName(item)}</span>
                                    ${(getSlotName(item) === 'Nahkampf' || getSlotName(item) === 'Fernkampf') ? `
                                        <label class="flex items-center gap-1 cursor-pointer group mb-1">
                                            <input type="checkbox" onchange="setPrimaryWeapon('${getSlotName(item) === 'Nahkampf' ? 'melee' : 'ranged'}')" ${hero.primaryWeapon === (getSlotName(item) === 'Nahkampf' ? 'melee' : 'ranged') ? 'checked' : ''} class="w-3 h-3 accent-secondary">
                                            <span class="text-[9px] text-secondary group-hover:text-primary transition-colors">Primär</span>
                                        </label>
                                    ` : '<div class="h-[18px]"></div>'}
                                    <button onclick="zoomImage('${item.image || ''}')" class="w-full aspect-square max-w-[140px] bg-surface-container-lowest border border-outline-variant/20 hover:border-secondary transition-all p-2 shadow-md group relative flex items-center justify-center">
                                        ${item.image ? `<img src="${item.image}" class="w-full h-full object-contain" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                                        <span class="material-symbols-outlined text-4xl text-secondary/40 group-hover:text-secondary" style="display: none;">${item.icon || 'inventory_2'}</span>` : 
                                        `<span class="material-symbols-outlined text-4xl text-secondary/40 group-hover:text-secondary">${item.icon || 'inventory_2'}</span>`}
                                    </button>
                                </div>
                            `;

                            return `
                            <div class="wood-card p-6 flex flex-col gap-4">
                                <div class="flex justify-between items-center border-b border-outline-variant/30 pb-2">
                                    <h3 class="text-secondary uppercase tracking-widest font-bold text-sm">Ausrüstung</h3>
                                </div>
                                
                                ${row1.length > 0 ? `
                                <div class="flex w-full gap-4 justify-between">
                                    ${row1.map(i => renderItem(i)).join('')}
                                </div>
                                ` : ''}

                                ${row2.length > 0 ? `
                                <div class="flex w-full gap-4 justify-center border-t border-outline-variant/10 pt-4 mt-2">
                                    ${row2.map(i => `<div class="w-[120px]">${renderItem(i)}</div>`).join('')}
                                </div>
                                ` : ''}

                                ${row3.length > 0 ? `
                                <div class="flex flex-wrap w-full gap-4 justify-center border-t border-outline-variant/10 pt-4 mt-2">
                                    ${row3.map(i => `<div class="w-[120px]">${renderItem(i)}</div>`).join('')}
                                </div>
                                ` : ''}

                                ${(() => {
                                    if (!hero.equipment) return '';
                                    if (!hero.equipment.spells) hero.equipment.spells = [];
                                    if (!hero.equipment.primarySpell) hero.equipment.primarySpell = 0;
                                    const spells = hero.equipment.spells;
                                    const maxSlots = window.getMaxSpellSlots ? window.getMaxSpellSlots() : 2;
                                    if (spells.length === 0 && maxSlots === 2) return '';
                                    return `
                                    <div class="border-t border-outline-variant/10 pt-4 mt-2">
                                        <div class="flex justify-between items-center mb-3">
                                            <span class="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                                                <span class="material-symbols-outlined text-xs align-middle text-primary">auto_fix_high</span>
                                                Zauber (${spells.length}/${maxSlots} Slots)
                                            </span>
                                        </div>
                                        <div class="flex flex-wrap gap-3">
                                        ${spells.map((s, si) => `
                                            <div class="flex flex-col items-center gap-1 w-[90px]">
                                                <label class="flex items-center gap-1 cursor-pointer group">
                                                    <input type="checkbox" onchange="setPrimarySpell(${si})" ${(hero.equipment.primarySpell||0) === si ? 'checked' : ''} class="w-3 h-3 accent-primary">
                                                    <span class="text-[9px] text-primary">Primär</span>
                                                </label>
                                                <div class="w-16 h-16 bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-center relative">
                                                    ${s.image ? `<img src="${s.image}" class="w-full h-full object-contain" onerror="this.style.display='none'">` : ''}
                                                    <span class="material-symbols-outlined text-2xl text-primary/50">${s.icon||'auto_fix_high'}</span>
                                                </div>
                                                <p class="text-[8px] text-center text-on-surface font-bold leading-tight">${s.name}</p>
                                                <p class="text-[8px] text-center text-on-surface-variant">${s.art==='Spruchrolle' ? (s.currentCharges||0)+'/'+(s.maxCapacity||3) : '\u221e'} \u00b7 ${s.reqMana}M</p>
                                                <button onclick="handleEquipSpell('${s.name.replace(/'/g, "\\'")}')"
                                                        class="text-[8px] text-error/70 hover:text-error uppercase font-bold tracking-wider">Ablegen</button>
                                            </div>
                                        `).join('')}
                                        </div>
                                    </div>
                                    `;
                                })()}
                            </div>
                            `;
                        })()}
                        
                        <!-- Statuswerte -->
                        <div class="wood-card p-6 flex flex-col gap-6">
                            <div class="flex justify-between items-center border-b border-outline-variant/30 pb-4">
                                <h3 class="text-secondary uppercase tracking-widest font-bold text-sm">Statuswerte & Training</h3>
                            </div>
                            
                            <div class="grid grid-cols-1 gap-6">
                                <!-- Erz Section -->
                                <div class="wood-card p-5 border-l-4 border-l-primary bg-primary/5">
                                    <div class="flex flex-col gap-3">
                                        <span class="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Erz im Besitz</span>
                                        <div class="flex items-center justify-between">
                                            <div class="flex items-center gap-4">
                                                <button onclick="openResourcePopup('ore_sub')" class="w-10 h-10 bg-error/20 hover:bg-error text-error hover:text-on-error flex items-center justify-center rounded-sm transition-colors shadow-sm">
                                                    <span class="material-symbols-outlined text-2xl">remove</span>
                                                </button>
                                                <span class="text-4xl font-headline text-primary">${hero.ore.toLocaleString()}</span>
                                                <button onclick="openResourcePopup('ore_add')" class="w-10 h-10 bg-primary/20 hover:bg-primary text-primary hover:text-on-primary flex items-center justify-center rounded-sm transition-colors shadow-sm">
                                                    <span class="material-symbols-outlined text-2xl">add</span>
                                                </button>
                                            </div>
                                            <span class="material-symbols-outlined text-primary/30 text-5xl">payments</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <!-- STR -->
                                    <div class="wood-card p-4 flex justify-between items-center bg-surface-container-low/40">
                                        <div class="flex flex-col">
                                            <span class="text-[10px] text-on-surface-variant uppercase font-bold">Stärke</span>
                                            <span class="text-2xl font-headline text-on-surface">${window.getTotalStat('str')} ${window.getAuraBonus('Stärke') > 0 ? `<span class="text-xs text-primary">(+${window.getAuraBonus('Stärke')})</span>` : ''}</span>
                                        </div>
                                        <button onclick="upgradeStat('str')" 
                                                ${hero.lp < 1 || hero.ore < (hero.attributes.str * 10) ? 'disabled' : ''}
                                                class="bg-secondary/20 hover:bg-secondary text-secondary hover:text-on-secondary px-3 py-1 rounded-sm text-[10px] font-bold uppercase transition-all disabled:opacity-30 disabled:grayscale">
                                            +1 (${hero.attributes.str * 10} Erz)
                                        </button>
                                    </div>

                                    <!-- DEX -->
                                    <div class="wood-card p-4 flex justify-between items-center bg-surface-container-low/40">
                                        <div class="flex flex-col">
                                            <span class="text-[10px] text-on-surface-variant uppercase font-bold">Geschick</span>
                                            <span class="text-2xl font-headline text-on-surface">${window.getTotalStat('dex')} ${window.getAuraBonus('Geschick') > 0 ? `<span class="text-xs text-primary">(+${window.getAuraBonus('Geschick')})</span>` : ''}</span>
                                        </div>
                                        <button onclick="upgradeStat('dex')" 
                                                ${hero.lp < 1 || hero.ore < (hero.attributes.dex * 10) ? 'disabled' : ''}
                                                class="bg-secondary/20 hover:bg-secondary text-secondary hover:text-on-secondary px-3 py-1 rounded-sm text-[10px] font-bold uppercase transition-all disabled:opacity-30 disabled:grayscale">
                                            +1 (${hero.attributes.dex * 10} Erz)
                                        </button>
                                    </div>

                                    <!-- MANA -->
                                    <div class="wood-card p-4 flex justify-between items-center bg-surface-container-low/40">
                                        <div class="flex flex-col">
                                            <span class="text-[10px] text-on-surface-variant uppercase font-bold">Mana</span>
                                            <span class="text-2xl font-headline text-on-surface">${hero.manaCurrent !== undefined ? hero.manaCurrent : window.getTotalStat('mana')} / ${window.getTotalStat('mana')}</span>
                                        </div>
                                        <button onclick="upgradeStat('mana')" 
                                                ${hero.lp < 1 || hero.ore < 10 ? 'disabled' : ''}
                                                class="bg-secondary/20 hover:bg-secondary text-secondary hover:text-on-secondary px-3 py-1 rounded-sm text-[10px] font-bold uppercase transition-all disabled:opacity-30 disabled:grayscale">
                                            +5 (10 Erz)
                                        </button>
                                    </div>

                                    <!-- MOV (static) -->
                                    <div class="wood-card p-4 flex justify-between items-center bg-surface-container-low/40">
                                        <div class="flex flex-col">
                                            <span class="text-[10px] text-on-surface-variant uppercase font-bold">Bewegung</span>
                                            <span class="text-2xl font-headline text-on-surface-variant">${window.getTotalStat('mov')}</span>
                                        </div>
                                        <span class="material-symbols-outlined text-on-surface-variant/30">directions_run</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Resource Adjustment Popup -->
                        ${state.resourcePopup.type ? `
                        <div class="fixed inset-0 z-[150] flex items-center justify-center p-4">
                            <div class="modal-overlay absolute inset-0" onclick="closeResourcePopup()"></div>
                            <div class="wood-card w-full max-w-xs p-6 relative shadow-2xl border-2 border-primary/50 flex flex-col gap-4">
                                <h4 class="font-headline text-xl text-primary text-center">
                                    ${state.resourcePopup.type === 'ore_add' ? 'Erz hinzufügen' : 
                                      state.resourcePopup.type === 'ore_sub' ? 'Erz abziehen' : 'Erfahrung hinzufügen'}
                                </h4>
                                <input type="number" id="resource-amount" class="w-full bg-background border border-outline-variant p-3 text-center text-2xl font-headline text-primary focus:outline-none focus:border-primary" 
                                       placeholder="Wert..." autofocus onkeyup="if(event.key==='Enter') confirmResourceAdjustment()">
                                <div class="flex gap-3">
                                    <button onclick="closeResourcePopup()" class="flex-1 border border-outline-variant py-2 text-[10px] font-bold uppercase">Abbrechen</button>
                                    <button onclick="confirmResourceAdjustment()" class="flex-1 bg-primary text-on-primary py-2 text-[10px] font-bold uppercase shadow-lg">OK</button>
                                </div>
                            </div>
                        </div>
                        ` : ''}

                        <!-- Talents -->
                        <div class="wood-card p-6">
                             <h3 class="text-secondary uppercase tracking-widest font-bold text-sm mb-4">Talente & Kampftechniken</h3>
                             <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${hero.talents.map(t => {
                                    let nextLp = 0;
                                    let nextOre = 0;
                                    if (t.id === 'magie') {
                                        nextLp = 1;
                                        nextOre = (t.level + 1) * 50;
                                    } else if (t.id === 'schloss') {
                                        nextLp = 1;
                                        nextOre = (t.level + 1) * 50;
                                    } else {
                                        nextLp = t.level === 0 ? 2 : 3;
                                        nextOre = t.level === 0 ? 100 : 300;
                                    }
                                    const canAfford = hero.lp >= nextLp && hero.ore >= nextOre;

                                    return `
                                    <div class="flex flex-col gap-2 p-4 bg-background/20 border border-outline-variant/10 rounded-sm">
                                        <div class="flex justify-between items-center">
                                            <div class="flex items-center gap-2">
                                                <span class="material-symbols-outlined text-secondary text-xl">${t.icon}</span>
                                                <span class="font-bold text-xs">${t.name}</span>
                                            </div>
                                            <button onclick="openTalentInfo('${t.id}')" class="text-secondary/60 hover:text-secondary transition-colors">
                                                <span class="material-symbols-outlined text-lg">info</span>
                                            </button>
                                        </div>
                                         <div class="flex gap-1 h-1.5 mt-1">
                                             ${Array.from({length: t.max}).map((_, i) => `<div class="flex-1 ${i < t.level ? "bg-secondary" : "bg-surface-container"}"></div>`).join("")}
                                         </div>
                                         <div class="flex justify-between items-center mt-2 gap-2">
                                             <span class="text-[9px] text-on-surface-variant uppercase font-bold">Stufe ${t.level} / ${t.max}</span>
                                             <div class="flex gap-2">
                                                 ${t.level > 0 ? '<button onclick="window.confirmResetTalent(\'' + t.id + '\')" class="bg-error/15 hover:bg-error/30 text-error px-2 py-1 rounded-sm text-[9px] font-bold transition-all border border-error/20">ZURUECKSETZEN</button>' : ''}
                                                 ${t.level < t.max ? `
                                                     <button onclick="upgradeTalent('${t.id}')" 
                                                             ${!canAfford ? "disabled" : ""}
                                                             class="bg-secondary-container text-secondary px-2 py-1 rounded-sm text-[9px] font-bold hover:brightness-125 disabled:opacity-30">
                                                         ${t.id === "magie" ? `KREIS ${t.level+1}` : t.level === 0 ? "LERNEN" : "MEISTERN"} (${nextLp} LP / ${nextOre} E)
                                                     </button>
                                                 ` : '<span class="text-[10px] text-secondary font-bold self-center">MEISTER</span>'}
                                             </div>
                                         </div>
                                     </div>
                                `}).join('')}
                             </div>
                        </div>

                        <!-- Talent Info Popup -->
                        ${state.talentInfo ? (() => {
                            const ti = state.talentInfo;
                            const nextLevel = ti.level; // descs index = current level (0-based = what they'd unlock next)
                            const nextDesc = (ti.descs && ti.descs[nextLevel]) ? ti.descs[nextLevel] : 'Keine weiteren Informationen verfügbar.';
                            let levelLabel = '';
                            if (ti.id === 'magie') levelLabel = `Kreis ${nextLevel + 1}`;
                            else if (ti.id === 'schloss') levelLabel = `Stufe ${nextLevel + 1}`;
                            else levelLabel = nextLevel === 0 ? 'Kämpfer' : 'Meister';
                            const alreadyMax = ti.level >= ti.max;
                            return `
                        <div class="fixed inset-0 z-[160] flex items-center justify-center p-4">
                            <div class="modal-overlay absolute inset-0" onclick="closeTalentInfo()"></div>
                            <div class="wood-card w-full max-w-md p-8 relative shadow-2xl border-2 border-secondary/30 flex flex-col gap-4">
                                <button onclick="closeTalentInfo()" class="absolute top-4 right-4 text-on-surface-variant hover:text-primary">
                                    <span class="material-symbols-outlined">close</span>
                                </button>
                                <div class="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
                                    <span class="material-symbols-outlined text-secondary text-3xl">${ti.icon}</span>
                                    <div>
                                        <h3 class="font-headline text-2xl text-primary italic leading-none">${ti.name}</h3>
                                        <span class="text-[10px] text-secondary uppercase font-bold tracking-widest">${alreadyMax ? 'GEMEISTERT' : `Nächste Stufe: ${levelLabel}`}</span>
                                    </div>
                                </div>
                                <div class="custom-scrollbar max-h-[50vh] overflow-y-auto pr-2">
                                    <p class="text-sm text-on-surface-variant leading-relaxed">
                                        ${alreadyMax ? 'Du hast dieses Talent vollständig gemeistert!' : nextDesc}
                                    </p>
                                </div>
                            </div>
                        </div>
                        `;
                        })() : ''}
                    </div>
                </div>
            </main>

            <!-- Zoom Popup -->
            ${state.zoomImage ? `
            <div class="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <div class="modal-overlay absolute inset-0" onclick="closeZoom()"></div>
                <div class="relative max-w-full max-h-full flex flex-col items-center">
                    <button onclick="closeZoom()" class="absolute -top-12 right-0 text-white hover:text-primary transition-colors bg-black/50 p-2 rounded-full">
                        <span class="material-symbols-outlined text-3xl">close</span>
                    </button>
                    <img src="${state.zoomImage}" class="max-w-[90vw] max-h-[80vh] object-contain shadow-[0_0_50px_rgba(0,0,0,0.9)] border-2 border-secondary/20">
                </div>
            </div>
            ` : ''}

            <!-- Combat Mode Selection Modal -->
            ${state.combatPopup?.active ? `
                <div class="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-fade-in">
                    <div class="modal-overlay absolute inset-0" onclick="state.combatPopup.active = false; render();"></div>
                    <div class="wood-card w-full max-w-sm p-8 relative shadow-2xl border-2 border-secondary/30 flex flex-col items-center">
                        <button onclick="state.combatPopup.active = false; render();" class="absolute top-4 right-4 text-on-surface-variant hover:text-primary">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                        
                        ${state.combatPopup.step === 'mode' ? `
                            <h3 class="font-headline text-2xl text-primary mb-3 text-center">Kampfvorbereitung</h3>
                            <p class="text-xs text-on-surface-variant text-center mb-6">In welchem Modus soll der Kampf stattfinden?</p>
                            
                            <div class="flex flex-col gap-3 w-full">
                                <button onclick="state.combatPopup.step = 'selectEnemy'; state.combatPopup.selectedEnemy = null; render();" 
                                        class="w-full bg-secondary hover:bg-secondary/90 text-on-secondary font-bold py-3 uppercase tracking-widest transition-all rounded-sm text-sm shadow-md">
                                    Normaler Modus
                                </button>
                                <button onclick="state.combatPopup.step = 'password'; state.combatPopup.passwordInput = ''; state.combatPopup.error = ''; render();" 
                                        class="w-full bg-surface-container-high hover:bg-surface-container-highest text-primary font-bold py-3 uppercase tracking-widest border border-primary/20 transition-all rounded-sm text-sm">
                                    Admin Modus
                                </button>
                            </div>
                        ` : ''}
                        
                        ${state.combatPopup.step === 'password' ? `
                            <h3 class="font-headline text-2xl text-primary mb-3 text-center">Admin-Authentifizierung</h3>
                            <p class="text-xs text-on-surface-variant text-center mb-4">Bitte gib das Admin-Passwort ein:</p>
                            
                            <div class="w-full flex flex-col gap-4">
                                <input type="password" id="combat-pass-input" placeholder="Passwort..." 
                                       class="bg-surface-container border border-outline-variant/30 text-on-surface px-4 py-2 text-center rounded-sm font-sans"
                                       onkeydown="if(event.key === 'Enter') checkCombatPassword(this.value)">
                                       
                                ${state.combatPopup.error ? `
                                    <p class="text-[10px] text-error font-bold uppercase text-center">${state.combatPopup.error}</p>
                                ` : ''}
                                
                                <div class="flex gap-3 mt-2">
                                    <button onclick="state.combatPopup.step = 'mode'; render();" 
                                            class="flex-1 border border-outline-variant text-on-surface-variant py-2 text-[10px] font-bold uppercase rounded-sm">
                                        Zurück
                                    </button>
                                    <button onclick="checkCombatPassword(document.getElementById('combat-pass-input').value)" 
                                            class="flex-1 bg-secondary text-on-secondary py-2 text-[10px] font-bold uppercase shadow-md rounded-sm">
                                        Bestätigen
                                    </button>
                                </div>
                            </div>
                        ` : ''}

                        ${state.combatPopup.step === 'selectEnemy' ? (() => {
                            const currentChapter = state.hero.chapter || 1;
                            let enemies = Object.keys(enemyData).filter(key => enemyData[key].chapter === currentChapter);
                            if (enemies.length === 0) enemies = Object.keys(enemyData).filter(key => enemyData[key].chapter === 1);
                            
                            return `
                                <h3 class="font-headline text-2xl text-primary mb-3 text-center">Gegnerauswahl</h3>
                                <p class="text-xs text-on-surface-variant text-center mb-4">Wähle einen Gegner für Kapitel ${currentChapter}:</p>
                                
                                <div class="grid grid-cols-2 gap-2 w-full max-h-48 overflow-y-auto custom-scrollbar mb-6 pr-1">
                                    ${enemies.map(key => {
                                        const enemy = enemyData[key];
                                        const isSelected = state.combatPopup.selectedEnemy === key;
                                        return `
                                            <button onclick="state.combatPopup.selectedEnemy = '${key}'; render();" 
                                                    class="p-2 border text-xs font-bold uppercase rounded-sm transition-all flex flex-col items-center gap-1
                                                           ${isSelected ? 'border-primary bg-primary/20 text-primary shadow-[0_0_8px_rgba(233,193,118,0.3)]' : 'border-outline-variant/30 bg-surface-container text-on-surface-variant hover:border-primary/50'}">
                                                <span class="font-bold text-center leading-tight">${enemy.name}</span>
                                                <span class="text-[9px] opacity-60">HP: ${enemy.hp} | Rüst: ${enemy.rust}</span>
                                            </button>
                                        `;
                                    }).join('')}
                                </div>
                                
                                <div class="flex gap-3 w-full">
                                    <button onclick="state.combatPopup.step = 'mode'; render();" 
                                            class="flex-1 border border-outline-variant text-on-surface-variant py-2.5 text-[10px] font-bold uppercase rounded-sm">
                                        Zurück
                                    </button>
                                    <button onclick="confirmEnemySelection()" 
                                            ${!state.combatPopup.selectedEnemy ? 'disabled' : ''} 
                                            class="flex-1 bg-secondary text-on-secondary py-2.5 text-[10px] font-bold uppercase shadow-md rounded-sm disabled:opacity-30 disabled:pointer-events-none">
                                        Bestätigen
                                    </button>
                                </div>
                            `;
                        })() : ''}
                    </div>
                </div>
            ` : ''}

            <!-- Tactical Combat Simulator Overlay -->
            ${state.combatSimulator ? `
                <div class="fixed bottom-24 right-6 z-[180] bg-[#1a1a1a]/95 border border-primary/40 p-5 max-w-xs w-64 shadow-2xl rounded-sm backdrop-blur-md flex flex-col gap-2.5 text-center">
                    <div class="flex items-center justify-center gap-2 mb-0.5">
                        <span class="material-symbols-outlined text-primary animate-pulse">swords</span>
                        <p class="font-headline text-sm text-primary uppercase font-bold tracking-wider">Kampf aktiv</p>
                    </div>
                    <p class="text-[10px] text-on-surface-variant leading-relaxed">
                        Das Schlachtfeld wird inline angezeigt. ${state.combatSimulator.isAdmin ? 'Die Analyse läuft im separaten Fenster.' : ''}
                    </p>
                    <div class="flex flex-col gap-2">
                        <button onclick="state.currentScreen = 'schlachtfeld'; render();" class="bg-primary text-on-primary py-1.5 font-headline uppercase text-[9px] tracking-widest font-bold rounded-sm shadow-md hover:brightness-110 active:scale-95 transition-all">
                            Zum Schlachtfeld
                        </button>
                        <button onclick="exitCombatSimulator()" class="bg-red-950/40 border border-red-500/30 text-red-400 py-1.5 font-headline uppercase text-[9px] tracking-widest font-bold rounded-sm hover:bg-red-950/60 transition-all">
                            Kampf beenden
                        </button>
                    </div>
                </div>
            ` : ''}
        `;
    },
    beutel: () => {
        const inventory = state.hero.inventory;
        const categories = ["Waffen", "Rüstungen", "Nahrung", "Ausrüstung", "Magie", "Questgegenstände"];
        return `
            <main class="pt-8 pb-28 px-6 max-w-5xl mx-auto">
                <section class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <span class="text-secondary text-xs uppercase tracking-[0.2em] mb-2 block font-bold">Habseligkeiten</span>
                        <h2 class="font-headline text-4xl text-on-surface italic">Inventar des Helden</h2>
                    </div>
                </section>

                <div class="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                    ${categories.map(cat => `
                        <button onclick="openInventoryCategory('${cat}')" class="group relative flex flex-col justify-between p-4 bg-surface-container border border-outline-variant/30 hover:border-primary/50 transition-all h-32 text-left overflow-hidden">
                            <span class="material-symbols-outlined text-secondary text-2xl">${cat === 'Waffen' ? 'swords' : (cat === 'Rüstungen' || cat === 'Rüstung') ? 'shield' : cat === 'Nahrung' ? 'restaurant' : cat === 'Ausrüstung' ? 'handyman' : cat === 'Magie' ? 'auto_stories' : 'key'}</span>
                            <div>
                                <span class="block text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">${cat}</span>
                            </div>
                        </button>
                    `).join('')}
                </div>

                <!-- Category Popup -->
                ${state.inventoryPopup.category ? `
                    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div class="modal-overlay absolute inset-0" onclick="closeInventoryPopup()"></div>
                        <div class="wood-card w-full max-w-4xl max-h-[80vh] p-8 relative shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-2 border-secondary/30 flex flex-col">
                            <button onclick="closeInventoryPopup()" class="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors">
                                <span class="material-symbols-outlined">close</span>
                            </button>
                            <h3 class="font-headline text-3xl text-primary mb-6 border-b border-outline-variant/30 pb-4 italic">Deine ${state.inventoryPopup.category}</h3>
                            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 overflow-y-auto custom-scrollbar pr-4">
                                ${state.inventoryPopup.items.map(item => `
                                    <div class="flex flex-col items-center gap-2 p-3 bg-surface-container-low/50 border border-outline-variant/10 rounded-sm">
                                        <button onclick="zoomImage('${item.image || ''}')" class="w-full aspect-[2/3] bg-background border border-outline-variant/20 hover:border-secondary transition-all overflow-hidden group">
                                            ${item.image ? `
                                                <img src="${item.image}" class="w-full h-full object-contain p-1" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                                                <span class="material-symbols-outlined text-3xl text-secondary/40 group-hover:text-secondary" style="display: none;">${item.icon || 'inventory_2'}</span>
                                            ` : `
                                                <span class="material-symbols-outlined text-3xl text-secondary/40 group-hover:text-secondary">${item.icon || 'inventory_2'}</span>
                                            `}
                                        </button>
                                        <div class="text-center w-full">
                                            <p class="font-bold text-[11px] leading-tight">${item.name} ${item.count > 1 ? `<span class="text-secondary">x${item.count}</span>` : ''}</p>
                                            <p class="text-[9px] text-secondary mt-1 mb-2">${item.value} Erz ${item.damage ? `| <span class="text-primary">Schaden: ${item.damage}</span>` : ''}</p>
                                            <div class="flex flex-col gap-1 w-full">
                                                ${(item.art === 'Konsum' || item.type === 'Konsum' || item.category === 'Nahrung') ? `
                                                    <button onclick="closeInventoryPopup(); handleConsumeItem('${item.name.replace(/'/g, "\\'")}')" 
                                                            ${(item.name.toLowerCase() === 'starke bogensehne' && !inventory.some(i => i.art === 'Bogen' || i.style === 'Fernkampf')) ? 'disabled' : ''}
                                                            ${(item.name.toLowerCase() === 'wetzstein' && !inventory.some(i => i.type === 'Klingenwaffe')) ? 'disabled' : ''}
                                                            ${(item.name.toLowerCase() === 'zielfernrohr' && !inventory.some(i => i.art === 'Armbrust')) ? 'disabled' : ''}
                                                            class="bg-primary/20 hover:bg-primary text-primary hover:text-on-primary px-3 py-1 rounded-sm text-[10px] font-bold uppercase transition-all shadow-sm disabled:opacity-30 disabled:grayscale w-full text-center">
                                                        Nehmen
                                                    </button>
                                                ` : ''}
                                                ${((['Waffen', 'Rüstung', 'Rüstungen', 'Ausrüstung', 'Magie'].includes(item.category) && item.art !== 'Konsum' && item.type !== 'Konsum') || (item.category === 'Questgegenstände' && (item.art === 'Artefakt' || item.style === 'Nahkampf' || item.style === 'Fernkampf' || ['Einhandwaffe', 'Zweihandwaffe', 'Bogen', 'Armbrust'].includes(item.art) || item.damage !== undefined))) ? (() => {
                                                    let isEquippedOther = false;
                                                    let isEquippedSlot = false;
                                                    const eq = state.hero.equipment;
                                                    if (eq.melee?.name === item.name || eq.ranged?.name === item.name || eq.armor?.name === item.name || eq.artifacts?.amulet?.name === item.name || eq.artifacts?.ring1?.name === item.name || eq.artifacts?.ring2?.name === item.name) {
                                                        isEquippedSlot = true;
                                                    }
                                                    // Magic items: check spells array
                                                    if (item.category === 'Magie' || item.art === 'Spruchrolle' || item.art === 'Rune') {
                                                        const spells = eq.spells || [];
                                                        isEquippedSlot = spells.some(s => s.name === item.name);
                                                        isEquippedOther = false;
                                                        return `
                                                        <button onclick="closeInventoryPopup(); handleEquipSpell('${item.name.replace(/'/g, "\\'")}')" class="${isEquippedSlot ? 'bg-error/20 hover:bg-error text-error hover:text-on-error' : 'bg-secondary/20 hover:bg-secondary text-secondary hover:text-on-secondary'} px-3 py-1 rounded-sm text-[10px] font-bold uppercase transition-all shadow-sm w-full text-center">
                                                            ${isEquippedSlot ? 'Ablegen' : 'Ausrüsten'}
                                                        </button>
                                                        `;
                                                    }
                                                    if (item.art === 'Artefakt' || item.category === 'Ausrüstung') {
                                                        if (!item.name.toLowerCase().includes('amulett') && !item.name.toLowerCase().includes('talisman') && !item.name.toLowerCase().includes('ring')) {
                                                            if (state.hero.equipment.artifacts.others?.find(a => a.name === item.name)) {
                                                                isEquippedOther = true;
                                                            }
                                                        }
                                                    }
                                                    if (isEquippedSlot) {
                                                        return `
                                                        <button disabled class="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-sm text-[10px] font-bold uppercase transition-all shadow-sm w-full text-center opacity-50 cursor-not-allowed">
                                                            Ausgerüstet
                                                        </button>
                                                        `;
                                                    }
                                                    return `
                                                    <button onclick="closeInventoryPopup(); handleEquipItem('${item.name.replace(/'/g, "\\'")}')" class="${isEquippedOther ? 'bg-error/20 hover:bg-error text-error hover:text-on-error' : 'bg-secondary/20 hover:bg-secondary text-secondary hover:text-on-secondary'} px-3 py-1 rounded-sm text-[10px] font-bold uppercase transition-all shadow-sm w-full text-center">
                                                        ${isEquippedOther ? 'In den Beutel' : 'Ausrüsten'}
                                                    </button>
                                                    `;
                                                })() : ''}
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                                ${state.inventoryPopup.items.length === 0 ? `
                                    <div class="col-span-full py-20 text-center italic text-on-surface-variant opacity-50">
                                        Keine Gegenstände in dieser Kategorie vorhanden.
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Zoom Popup -->
                ${state.zoomImage ? `
                    <div class="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <div class="modal-overlay absolute inset-0" onclick="closeZoom()"></div>
                        <div class="relative max-w-full max-h-full flex flex-col items-center">
                            <button onclick="closeZoom()" class="absolute -top-12 right-0 text-white hover:text-primary transition-colors bg-black/50 p-2 rounded-full">
                                <span class="material-symbols-outlined text-3xl">close</span>
                            </button>
                            <img src="${state.zoomImage}" class="max-w-[90vw] max-h-[80vh] object-contain shadow-[0_0_50px_rgba(0,0,0,0.9)] border-2 border-secondary/20">
                        </div>
                    </div>
                ` : ''}

                <div class="bg-[#1a1816] border border-outline-variant/40 rounded-sm shadow-2xl overflow-hidden">
                    <div class="parchment-texture p-6 bg-surface-container-low/30">
                        <div class="flex flex-col gap-1 mb-6 border-b border-outline-variant/20 pb-4">
                            <h3 class="font-headline text-2xl text-primary italic leading-none">Alle Gegenstände</h3>
                            <div class="flex gap-6 mt-2">
                                <span class="text-[10px] text-secondary/50 uppercase font-bold">Gegenstände: ${inventory.length}</span>
                                <span class="text-[10px] text-primary/70 uppercase font-bold">Verkaufswert: ${(() => {
                                    return inventory.reduce((sum, item) => {
                                        const val = (item.category === 'Nahrung') ? item.value : Math.ceil(item.value / 2);
                                        return sum + (val * (item.count || 1));
                                    }, 0).toLocaleString();
                                })()} Erz</span>
                            </div>
                        </div>
                        <div class="space-y-3">
                            ${(() => {
                                // 1. Gruppieren nach Name
                                const groupedMap = new Map();
                                inventory.forEach(item => {
                                    if (groupedMap.has(item.name)) {
                                        groupedMap.get(item.name).count += (item.count || 1);
                                    } else {
                                        groupedMap.set(item.name, { ...item, count: (item.count || 1) });
                                    }
                                });

                                // 2. In Array umwandeln und alphabetisch sortieren
                                const sortedItems = Array.from(groupedMap.values()).sort((a, b) => 
                                    a.name.localeCompare(b.name)
                                );

                                // 3. Rendern
                                return sortedItems.map(item => `
                                    <div class="flex items-center gap-4 p-3 bg-surface-container-low/50 border border-outline-variant/10 hover:bg-surface-container-high/60 transition-colors cursor-pointer group rounded-sm">
                                        <div class="w-16 h-16 bg-surface-container-lowest flex items-center justify-center border border-outline-variant/20 group-hover:border-primary/40 overflow-hidden relative shrink-0">
                                            ${item.image ? `
                                                <img src="${item.image}" class="w-full h-full object-contain p-1" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                                                <span class="material-symbols-outlined text-3xl text-secondary/60 group-hover:text-primary" style="display: none;">${item.icon || 'inventory_2'}</span>
                                            ` : `
                                                <span class="material-symbols-outlined text-3xl text-secondary/60 group-hover:text-primary">${item.icon || 'inventory_2'}</span>
                                            `}
                                        </div>
                                        <div class="flex-grow min-w-0">
                                            <div class="flex items-center gap-2 flex-wrap">
                                                <h4 class="font-headline text-lg ${item.unique ? 'text-primary' : 'text-on-surface'} truncate leading-tight">${item.name} ${item.count > 1 ? `<span class="text-secondary ml-1">x${item.count}</span>` : ''}</h4>
                                                ${item.unique ? '<span class="text-[8px] bg-secondary/10 text-secondary border border-secondary/20 px-1 font-bold">UNIQUE</span>' : ''}
                                            </div>
                                            <p class="text-xs text-on-surface-variant italic">${item.damage ? `<span class="text-primary font-bold">Schaden: ${item.damage}</span><br>` : ''}${item.description || item.effect || item.ability || ''}</p>
                                        </div>
                                        <div class="text-right whitespace-nowrap flex flex-col items-end gap-1">
                                            <span class="block text-[9px] text-secondary/40 font-bold uppercase">${item.detail || item.category || ''}</span>
                                            <span class="block font-headline text-md text-secondary mb-1">${item.value} Erz</span>
                                            ${(item.art === 'Konsum' || item.type === 'Konsum' || item.category === 'Nahrung') ? `
                                                <button onclick="handleConsumeItem('${item.name.replace(/'/g, "\\'")}')" 
                                                        ${(item.name.toLowerCase() === 'starke bogensehne' && !inventory.some(i => i.art === 'Bogen' || i.style === 'Fernkampf')) ? 'disabled' : ''}
                                                        ${(item.name.toLowerCase() === 'wetzstein' && !inventory.some(i => i.type === 'Klingenwaffe')) ? 'disabled' : ''}
                                                        ${(item.name.toLowerCase() === 'zielfernrohr' && !inventory.some(i => i.art === 'Armbrust')) ? 'disabled' : ''}
                                                        class="bg-primary/20 hover:bg-primary text-primary hover:text-on-primary px-3 py-1 rounded-sm text-[10px] font-bold uppercase transition-all shadow-sm disabled:opacity-30 disabled:grayscale w-full text-center">
                                                    Nehmen
                                                </button>
                                            ` : ''}
                                            ${((['Waffen', 'Rüstung', 'Rüstungen', 'Ausrüstung', 'Magie'].includes(item.category) && item.art !== 'Konsum' && item.type !== 'Konsum') || (item.category === 'Questgegenstände' && (item.art === 'Artefakt' || item.style === 'Nahkampf' || item.style === 'Fernkampf' || ['Einhandwaffe', 'Zweihandwaffe', 'Bogen', 'Armbrust'].includes(item.art) || item.damage !== undefined))) ? (() => {
                                                let isEquippedOther = false;
                                                let isEquippedSlot = false;
                                                const eq = state.hero.equipment;
                                                if (eq.melee?.name === item.name || eq.ranged?.name === item.name || eq.armor?.name === item.name || eq.artifacts?.amulet?.name === item.name || eq.artifacts?.ring1?.name === item.name || eq.artifacts?.ring2?.name === item.name) {
                                                    isEquippedSlot = true;
                                                }
                                                // Magic items: check spells array
                                                if (item.category === 'Magie' || item.art === 'Spruchrolle' || item.art === 'Rune') {
                                                    const spells = eq.spells || [];
                                                    isEquippedSlot = spells.some(s => s.name === item.name);
                                                    isEquippedOther = false;
                                                    return `
                                                    <button onclick="handleEquipSpell('${item.name.replace(/'/g, "\\'")}')" class="${isEquippedSlot ? 'bg-error/20 hover:bg-error text-error hover:text-on-error' : 'bg-secondary/20 hover:bg-secondary text-secondary hover:text-on-secondary'} px-3 py-1 rounded-sm text-[10px] font-bold uppercase transition-all shadow-sm w-full text-center">
                                                        ${isEquippedSlot ? 'Ablegen' : 'Ausrüsten'}
                                                    </button>
                                                    `;
                                                }
                                                if (item.art === 'Artefakt' || item.category === 'Ausrüstung') {
                                                    if (!item.name.toLowerCase().includes('amulett') && !item.name.toLowerCase().includes('talisman') && !item.name.toLowerCase().includes('ring')) {
                                                        if (state.hero.equipment.artifacts.others?.find(a => a.name === item.name)) {
                                                            isEquippedOther = true;
                                                        }
                                                    }
                                                }
                                                if (isEquippedSlot) {
                                                    return `
                                                    <button disabled class="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-sm text-[10px] font-bold uppercase transition-all shadow-sm w-full text-center opacity-50 cursor-not-allowed">
                                                        Ausgerüstet
                                                    </button>
                                                    `;
                                                }
                                                return `
                                                <button onclick="handleEquipItem('${item.name.replace(/'/g, "\\'")}')" class="${isEquippedOther ? 'bg-error/20 hover:bg-error text-error hover:text-on-error' : 'bg-secondary/20 hover:bg-secondary text-secondary hover:text-on-secondary'} px-3 py-1 rounded-sm text-[10px] font-bold uppercase transition-all shadow-sm w-full text-center">
                                                    ${isEquippedOther ? 'In den Beutel' : 'Ausrüsten'}
                                                </button>
                                                `;
                                            })() : ''}
                                        </div>
                                    </div>
                                `).join('');
                            })()}
                        </div>
                    </div>
                </div>
            </main>
        `;
    },
    handeln: () => {
        const tr = state.trading || {};
        const hero = state.hero;
        const traderName = tr.selectedTrader;
        
        let traderObj = null;
        Object.values(CAMP_DATA).forEach(camp => {
            const found = camp.npcs.find(t => t.name === traderName);
            if (found) traderObj = found;
        });

        const categories = ["Nahrung", "Ausrüstung", "Waffen", "Magie", "Rüstung"];
        
        // Calculate hero value: Nahrung full, others half (rounded up)
        const heroValue = tr.heroOffer.reduce((sum, i) => {
            if (i.id === 'ore') return sum + (i.value * (i.count || 1));
            const val = (i.category === 'Nahrung') ? i.value : Math.ceil(i.value / 2);
            return sum + (val * (i.count || 1));
        }, 0);
        
        const traderValue = tr.traderOffer.reduce((sum, i) => sum + (i.value * (i.count || 1)), 0);
        
        const diff = Math.abs(heroValue - traderValue);
        const canEqualize = (heroValue > traderValue) || (hero.ore >= diff);

        return `
            <main class="max-w-screen-2xl mx-auto px-6 py-8 flex flex-col gap-6">
                <!-- Top Reset Button -->
                <div class="flex justify-center -mb-2">
                    <button onclick="resetTrade()" class="bg-surface-container-highest text-on-surface-variant px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:text-primary transition-all border border-outline-variant/30">
                        Fertig mit handeln
                    </button>
                </div>

                <!-- Camp Selection -->
                <div class="grid grid-cols-3 gap-4">
                    ${["Altes Lager", "Neues Lager", "Sektenlager"].map(camp => `
                        <button onclick="openTraderPopup('${camp}')" class="wood-card py-4 font-headline text-lg text-primary hover:brightness-110 active:scale-95 transition-all shadow-lg border-2 border-primary/20">
                            ${camp}
                        </button>
                    `).join('')}
                </div>

                ${traderName ? `
                    <!-- Value Display -->
                    <div class="flex flex-col items-center gap-2">
                        <div class="flex gap-12">
                            <div class="text-center">
                                <span class="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Eigener Wert</span>
                                <p class="font-headline text-3xl text-secondary">${heroValue} Erz</p>
                            </div>
                            <div class="text-center">
                                <span class="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Händlerwert</span>
                                <p class="font-headline text-3xl text-primary">${traderValue} Erz</p>
                            </div>
                        </div>
                        <div class="flex gap-4 mt-2">
                            <button onclick="equalizeOre()" ${!canEqualize ? 'disabled' : ''} class="bg-surface-container-high border border-secondary/50 text-secondary px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-secondary/10 disabled:opacity-30 disabled:pointer-events-none">
                                Erzausgleich
                            </button>
                            <button onclick="confirmTrade()" ${heroValue !== traderValue || (heroValue === 0 && traderValue === 0) ? 'disabled' : ''} class="bg-secondary text-on-secondary px-6 py-2 text-xs font-bold uppercase tracking-widest hover:brightness-110 disabled:opacity-30 disabled:pointer-events-none shadow-lg">
                                Handel abschließen
                            </button>
                        </div>
                    </div>

                    <!-- Trader Profile -->
                    <div class="flex flex-col items-center">
                        <div class="relative w-32 h-32 border-2 border-secondary overflow-hidden rounded-sm shadow-xl bg-surface-container-lowest">
                            <img class="w-full h-full object-contain" src="${traderObj ? traderObj.img : ''}" alt="${traderName}">
                        </div>
                        <h2 class="font-headline text-2xl text-primary mt-1 italic">${traderName}</h2>
                    </div>
                ` : `
                    <div class="h-32 flex items-center justify-center border-2 border-dashed border-outline-variant/30 rounded-sm italic text-on-surface-variant">
                        Bitte wähle einen Händler aus...
                    </div>
                `}

                <!-- Trade Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <!-- Left Side: Hero -->
                    <div class="flex flex-col gap-4">
                        <h3 class="font-headline text-2xl text-secondary text-center border-b border-secondary/30 pb-2">${hero.name}</h3>
                        <div class="grid grid-cols-2 gap-4 h-[600px]">
                            <!-- Hero Categories -->
                            <div class="wood-card p-4 flex flex-col gap-3 h-full">
                                <h4 class="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-1">Mein Inventar</h4>
                                ${categories.map(cat => `
                                    <button onclick="openTradeInventoryPopup('${cat}')" class="flex items-center gap-3 p-3 bg-surface-container-low border border-outline-variant/10 hover:border-secondary transition-all group">
                                        <span class="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">${cat === 'Waffen' ? 'swords' : (cat === 'Rüstung' || cat === 'Rüstungen') ? 'shield' : cat === 'Nahrung' ? 'restaurant' : cat === 'Ausrüstung' ? 'handyman' : 'auto_stories'}</span>
                                        <span class="text-[11px] font-bold uppercase tracking-wider">${cat}</span>
                                    </button>
                                `).join('')}
                            </div>
                            <!-- Hero Offer (Waren) -->
                            <div class="wood-card p-4 flex flex-col h-full border-l-4 border-l-secondary">
                                <h4 class="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-3">Waren zum Tausch</h4>
                                <div class="flex-grow overflow-y-auto custom-scrollbar space-y-2 pr-1">
                                    ${tr.heroOffer.map((item, idx) => {
                                        const displayVal = (item.category === 'Nahrung' || item.id === 'ore') ? item.value : Math.ceil(item.value / 2);
                                        return `
                                        <div class="p-3 bg-surface-container-lowest/80 border border-outline-variant/20 flex items-center gap-3 mb-2 last:mb-0 rounded-sm">
                                            <button onclick="zoomImage('${item.image || ''}')" class="w-14 h-14 bg-background border border-outline-variant/20 hover:border-secondary flex-shrink-0 overflow-hidden flex items-center justify-center relative">
                                                ${item.image ? `<img src="${item.image}" class="w-full h-full object-contain p-0.5" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'"><span class="material-symbols-outlined text-2xl text-secondary/40" style="display: none;">${item.icon}</span>` : `<span class="material-symbols-outlined text-2xl text-secondary/40">${item.icon}</span>`}
                                            </button>
                                            <div class="flex-grow min-w-0">
                                                <p class="text-xs font-bold text-on-surface truncate leading-tight">${item.name} ${item.count > 1 ? `<span class="text-secondary">x${item.count}</span>` : ''}</p>
                                                <p class="text-[10px] text-secondary font-headline mt-1">${displayVal * (item.count || 1)} Erz</p>
                                            </div>
                                            <button onclick="removeFromTradeOffer('hero', ${idx})" class="text-on-surface-variant hover:text-error">
                                                <span class="material-symbols-outlined text-sm">remove_circle</span>
                                            </button>
                                        </div>
                                    `;}).join('')}

                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Side: Trader -->
                    <div class="flex flex-col gap-4">
                        <h3 class="font-headline text-2xl text-primary text-center border-b border-primary/30 pb-2">${traderName || 'Händler'}</h3>
                        <div class="grid grid-cols-2 gap-4 h-[600px]">
                            <!-- Trader Offer (Waren) -->
                            <div class="wood-card p-4 flex flex-col h-full border-r-4 border-r-primary">
                                <h4 class="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-3">Waren des Händlers</h4>
                                <div class="flex-grow overflow-y-auto custom-scrollbar space-y-2 pr-1">
                                    ${tr.traderOffer.map((item, idx) => `
                                        <div class="p-3 bg-surface-container-lowest/80 border border-outline-variant/20 flex items-center gap-3 mb-2 last:mb-0 rounded-sm">
                                            <button onclick="zoomImage('${item.image || ''}')" class="w-14 h-14 bg-background border border-outline-variant/20 hover:border-primary flex-shrink-0 overflow-hidden flex items-center justify-center relative">
                                                ${item.image ? `<img src="${item.image}" class="w-full h-full object-contain p-0.5" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'"><span class="material-symbols-outlined text-2xl text-primary/40" style="display: none;">${item.icon}</span>` : `<span class="material-symbols-outlined text-2xl text-primary/40">${item.icon}</span>`}
                                            </button>
                                            <div class="flex-grow min-w-0">
                                                <p class="text-xs font-bold text-on-surface truncate leading-tight">${item.name} ${item.count > 1 ? `<span class="text-primary">x${item.count}</span>` : ''}</p>
                                                <p class="text-[10px] text-primary font-headline mt-1">${item.value * (item.count || 1)} Erz</p>
                                            </div>
                                            <button onclick="removeFromTradeOffer('trader', ${idx})" class="text-on-surface-variant hover:text-error">
                                                <span class="material-symbols-outlined text-sm">remove_circle</span>
                                            </button>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <!-- Trader Inventory -->
                             <div class="wood-card p-4 flex flex-col h-full">
                                 <h4 class="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-3">Händler-Inventar</h4>
                                 <div class="flex-grow overflow-y-auto custom-scrollbar p-1">
                                     ${traderName ? `
                                         <div class="grid grid-cols-2 gap-2">
                                            ${(() => {
                                                let specStr = "";
                                                if (traderObj && traderObj.spec) {
                                                    specStr = traderObj.spec;
                                                } else {
                                                    for (const camp in TRADER_SPECS) {
                                                        const found = TRADER_SPECS[camp].find(t => t.name === traderName);
                                                        if (found) { specStr = found.spec; break; }
                                                    }
                                                }
                                                if (!specStr) return `<div class="p-4 italic opacity-50">Händlerdaten nicht gefunden...</div>`;
                                                const spec = specStr.toLowerCase();
                                                let availableItems = [];
                                                
                                                // Waffen
                                                if (spec.includes("nahkampf") || spec.includes("waffen aller art") || spec.includes("waffen")) {
                                                    availableItems = [...availableItems, ...itemPools.waffen.filter(w => w.style === "Nahkampf" || !w.style)];
                                                }
                                                if (spec.includes("fernkampf") || spec.includes("waffen aller art") || spec.includes("waffen")) {
                                                    availableItems = [...availableItems, ...itemPools.waffen.filter(w => w.style === "Fernkampf")];
                                                }
                                                
                                                // Nahrung
                                                if (spec.includes("nahrung") || spec.includes("proviant") || spec.includes("wein") || spec.includes("tränke")) {
                                                    availableItems = [...availableItems, ...itemPools.nahrung];
                                                }
                                                
                                                // Ausrüstung & Diverses
                                                if (spec.includes("ausrüstung") || spec.includes("diverses") || spec.includes("werkzeuge") || spec.includes("jagdbeute") || spec.includes("felle") || spec.includes("sumpfkraut")) {
                                                    availableItems = [...availableItems, ...itemPools.ausruestung];
                                                }
                                                
                                                // Magie
                                                if (spec.includes("magie") || spec.includes("spruchrollen") || spec.includes("runen")) {
                                                    availableItems = [...availableItems, ...itemPools.magie];
                                                }
                                                
                                                // Rüstung
                                                if (spec.includes("rüstung")) {
                                                    availableItems = [...availableItems, ...itemPools.ruestung];
                                                }
                                                
                                                // Filter by chapter
                                                availableItems = availableItems.filter(i => {
                                                    if (!i.chapter) return true;
                                                    if (typeof i.chapter === 'string' && i.chapter.includes('&')) {
                                                        const chapters = i.chapter.split('&').map(c => parseInt(c.trim()));
                                                        return chapters.some(c => c <= hero.chapter);
                                                    }
                                                    return parseInt(i.chapter) <= hero.chapter;
                                                });

                                                // Sort by name A-Z
                                                availableItems.sort((a, b) => a.name.localeCompare(b.name));

                                                if (availableItems.length === 0) {
                                                    console.warn("No items found for spec:", spec);
                                                    availableItems = [...itemPools.nahrung].slice(0, 5);
                                                }

                                                return availableItems.map(item => `
                                                    <div class="flex flex-col bg-surface-container-low border border-outline-variant/20 rounded-sm overflow-hidden">
                                                        <button onclick="zoomImage('${item.image || ''}')" class="w-full aspect-square bg-background border-b border-outline-variant/20 hover:border-primary transition-all overflow-hidden flex items-center justify-center relative">
                                                            ${item.image ? `<img src="${item.image}" class="w-full h-full object-contain p-1" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'"><span class="material-symbols-outlined text-3xl text-primary/40" style="display: none;">${item.icon || 'inventory_2'}</span>` : `<span class="material-symbols-outlined text-3xl text-primary/40">${item.icon || 'inventory_2'}</span>`}
                                                        </button>
                                                        <div class="p-2 flex flex-col gap-1">
                                                            <span class="text-[11px] font-bold text-on-surface leading-tight line-clamp-2">${item.name}</span>
                                                            <span class="text-[10px] text-primary font-headline">${item.value} Erz</span>
                                                            <button onclick="addToTradeOffer('trader', {name: '${item.name.replace(/\'/g, "\\\'")}', value: ${item.value}, icon: '${item.icon}', image: '${item.image || ''}', category: '${item.category}'})" class="w-full mt-1 bg-primary/20 hover:bg-primary text-primary hover:text-on-primary py-1.5 rounded-sm text-[9px] font-bold uppercase transition-all">KAUFEN</button>
                                                        </div>
                                                    </div>
                                                `).join('');
                                            })()}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modals (Hero Category Inventory) -->
                ${tr.inventoryPopup.category ? `
                    <div class="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <div class="modal-overlay absolute inset-0" onclick="closeTradeInventoryPopup()"></div>
                        <div class="wood-card w-full max-w-4xl max-h-[80vh] p-8 relative shadow-2xl border-2 border-secondary/30 flex flex-col">
                            <button onclick="closeTradeInventoryPopup()" class="absolute top-4 right-4 text-on-surface-variant hover:text-primary">
                                <span class="material-symbols-outlined">close</span>
                            </button>
                            <h3 class="font-headline text-3xl text-secondary mb-6 border-b border-outline-variant/30 pb-4 italic">Mein ${tr.inventoryPopup.category}</h3>
                            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 overflow-y-auto custom-scrollbar pr-4">
                                ${tr.inventoryPopup.items.map(item => `
                                    <div class="flex flex-col items-center gap-2 p-3 bg-surface-container-low/50 border border-outline-variant/10 rounded-sm">
                                        <button onclick="zoomImage('${item.image || ''}')" class="w-full aspect-[2/3] bg-background border border-outline-variant/20 hover:border-secondary transition-all overflow-hidden group flex items-center justify-center relative">
                                            ${item.image ? `<img src="${item.image}" class="w-full h-full object-contain p-1" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'"><span class="material-symbols-outlined text-3xl text-secondary/40 group-hover:text-secondary" style="display: none;">${item.icon || 'inventory_2'}</span>` : `<span class="material-symbols-outlined text-3xl text-secondary/40 group-hover:text-secondary">${item.icon || 'inventory_2'}</span>`}
                                        </button>
                                        <div class="text-center w-full">
                                            <p class="font-bold text-[11px] leading-tight truncate">${item.name} ${item.count > 1 ? `<span class="text-secondary">x${item.count}</span>` : ''}</p>
                                            <p class="text-[9px] text-secondary mt-1">${item.value} Erz</p>
                                            <button onclick="initiateSell('${item.name}')" class="w-full mt-2 bg-secondary/20 hover:bg-secondary text-secondary hover:text-on-secondary py-1 text-[9px] font-bold transition-colors">VERKAUFEN</button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Quantity Selection Modal -->
                ${tr.quantityPopup.item ? `
                    <div class="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <div class="modal-overlay absolute inset-0"></div>
                        <div class="wood-card w-full max-w-xs p-6 relative shadow-2xl border-2 border-secondary/50">
                            <h4 class="font-headline text-xl text-primary mb-4 text-center">${tr.quantityPopup.item.name}</h4>
                            <div class="flex flex-col items-center gap-4">
                                <div class="flex items-center gap-4">
                                    <span class="text-sm font-bold uppercase tracking-widest text-on-surface-variant">${tr.quantityPopup.isScrollChargePurchase ? 'Ladungen:' : 'Menge:'}</span>
                                    <div class="flex items-center gap-2">
                                        <div class="bg-surface-container px-4 py-2 border border-outline-variant/30 text-xl font-headline min-w-[50px] text-center">${tr.quantityPopup.amount}</div>
                                        <span class="text-lg">x</span>
                                        <div class="flex flex-col gap-1">
                                            <button onclick="adjustQuantity(1)" class="w-8 h-8 bg-secondary/20 hover:bg-secondary text-secondary hover:text-on-secondary flex items-center justify-center rounded-sm"><span class="material-symbols-outlined text-sm">add</span></button>
                                            <button onclick="adjustQuantity(-1)" class="w-8 h-8 bg-secondary/20 hover:bg-secondary text-secondary hover:text-on-secondary flex items-center justify-center rounded-sm"><span class="material-symbols-outlined text-sm">remove</span></button>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex gap-4 w-full mt-4">
                                    <button onclick="cancelQuantity()" class="flex-1 border border-outline-variant text-on-surface-variant py-2 text-[10px] font-bold uppercase">Abbruch</button>
                                    <button onclick="confirmQuantity()" class="flex-1 bg-secondary text-on-secondary py-2 text-[10px] font-bold uppercase shadow-lg">OK</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Trader Selection Popup -->
                ${tr.popupCamp ? `
                    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div class="modal-overlay absolute inset-0" onclick="closeTraderPopup()"></div>
                        <div class="wood-card w-full max-w-5xl max-h-[85vh] p-8 relative shadow-2xl border-2 border-secondary/30 flex flex-col">
                            <h3 class="font-headline text-3xl text-primary mb-6 border-b border-outline-variant/30 pb-4">${tr.popupCamp}</h3>
                            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 overflow-y-auto custom-scrollbar pr-4">
                                ${CAMP_DATA[tr.popupCamp].npcs.filter(npc => npc.roles.includes('H')).map(t => `
                                    <button onclick="selectTrader('${t.name}')" class="flex flex-col items-center group">
                                        <div class="w-full aspect-square border-2 border-outline-variant group-hover:border-secondary transition-all overflow-hidden relative shadow-lg bg-surface-container-lowest">
                                            <img class="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" 
                                                 src="${t.img}" 
                                                 onerror="this.src='https://lh3.googleusercontent.com/aida-public/AB6AXuBVfWUNF1X6qbXNG7dKPDZlHs8WNE-Y1MA0upTuCjZuB8jmeuqd_wV4Nr8qnTxdWBP8Qtc7Zrx_I9wzM8cZ4ulJ5U0K2odkKjW9NqE7YTfpih6sIZjr9oKQIXqcoUuX5zOPWqnvKI2gwIAgiKkecafAg8GQaXFagBhXQhbC3d9mjQebRQf67_zexYJ1WosWmDOd1Fr3qbSsJsT79VQl9t2ZWwWhYpTDAIjAEaE3SPjGnmXOShnZ6MeasZJXq6iMKg3hgD8YOfJdMb0'">
                                        </div>
                                        <span class="font-headline text-lg mt-2 group-hover:text-secondary transition-colors text-center">${t.name}</span>
                                        <span class="text-[9px] text-on-surface-variant uppercase font-bold text-center opacity-60 group-hover:opacity-100">Händler</span>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Zoom Popup -->
                ${state.zoomImage ? `
                    <div class="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <div class="modal-overlay absolute inset-0" onclick="closeZoom()"></div>
                        <div class="relative max-w-full max-h-full flex flex-col items-center">
                            <button onclick="closeZoom()" class="absolute -top-12 right-0 text-white hover:text-primary transition-colors bg-black/50 p-2 rounded-full">
                                <span class="material-symbols-outlined text-3xl">close</span>
                            </button>
                            <img src="${state.zoomImage}" class="max-w-[90vw] max-h-[80vh] object-contain shadow-2xl border-2 border-secondary/20">
                        </div>
                    </div>
                ` : ''}
            </main>
        `;
    },
    finden: () => {
        const categories = ["Waffen", "Rüstung", "Nahrung", "Ausrüstung", "Magie"];
        
        return `
            <main class="max-w-screen-xl mx-auto px-6 py-8 flex flex-col gap-8">
                <div class="flex justify-between items-end border-b border-outline-variant/30 pb-4">
                    <div>
                        <span class="text-secondary text-[10px] uppercase tracking-[0.2em] mb-1 block font-bold">Gegenstands-Verwaltung</span>
                        <h2 class="font-headline text-4xl text-on-surface italic">Finden & Verlieren</h2>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Linke Seite: Finden -->
                    <section class="flex flex-col gap-6">
                        <div class="wood-card p-6 border-l-4 border-l-primary bg-primary/5">
                            <h3 class="font-headline text-2xl text-primary mb-4 italic">Gegenstände finden</h3>
                            <p class="text-xs text-on-surface-variant mb-6 leading-relaxed">
                                Wähle eine Kategorie, um Gegenstände zu finden, die bis zum aktuellen Kapitel (${state.hero.chapter}) verfügbar sind.
                            </p>
                            <div class="grid grid-cols-2 gap-3">
                                ${categories.map(cat => `
                                    <button onclick="openFindingCategory('${cat}')" class="flex items-center gap-3 p-3 bg-surface-container-low border border-outline-variant/20 hover:border-primary hover:bg-primary/5 transition-all group">
                                        <span class="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">${cat === 'Waffen' ? 'swords' : cat === 'Rüstung' ? 'shield' : cat === 'Nahrung' ? 'restaurant' : cat === 'Ausrüstung' ? 'handyman' : 'auto_stories'}</span>
                                        <span class="text-[11px] font-bold uppercase tracking-wider">${cat}</span>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </section>

                    <!-- Rechte Seite: Verlieren -->
                    <section class="flex flex-col gap-6">
                        <div class="wood-card p-6 border-l-4 border-l-error bg-error/5">
                            <h3 class="font-headline text-2xl text-error mb-4 italic">Inventar (Verlieren)</h3>
                            <p class="text-xs text-on-surface-variant mb-6 leading-relaxed">
                                Wähle eine Kategorie aus deinem Inventar, um Gegenstände dauerhaft zu entfernen.
                            </p>
                            <div class="grid grid-cols-2 gap-3">
                                ${categories.map(cat => `
                                    <button onclick="openLosingCategory('${cat}')" class="flex items-center gap-3 p-3 bg-surface-container-low border border-outline-variant/20 hover:border-error hover:bg-error/5 transition-all group">
                                        <span class="material-symbols-outlined text-error group-hover:scale-110 transition-transform">${cat === 'Waffen' ? 'swords' : cat === 'Rüstung' ? 'shield' : cat === 'Nahrung' ? 'restaurant' : cat === 'Ausrüstung' ? 'handyman' : 'auto_stories'}</span>
                                        <span class="text-[11px] font-bold uppercase tracking-wider">${cat}</span>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </section>
                </div>

                <!-- Finden Kategorie Popup -->
                ${state.findingPopup.category ? `
                    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div class="modal-overlay absolute inset-0" onclick="closeFindingPopup()"></div>
                        <div class="wood-card w-full max-w-4xl max-h-[80vh] p-8 relative shadow-2xl border-2 border-primary/30 flex flex-col">
                            <button onclick="closeFindingPopup()" class="absolute top-4 right-4 text-on-surface-variant hover:text-primary">
                                <span class="material-symbols-outlined">close</span>
                            </button>
                            <h3 class="font-headline text-3xl text-primary mb-6 border-b border-outline-variant/30 pb-4 italic">Verfügbare ${state.findingPopup.category} (Kapitel ${state.hero.chapter})</h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar pr-4">
                                ${state.findingPopup.items.map(item => `
                                    <div class="flex items-center gap-3 p-3 bg-surface-container-low/50 border border-outline-variant/10 rounded-sm">
                                        <div class="w-12 h-12 bg-background border border-outline-variant/20 flex-shrink-0">
                                            ${item.image ? `<img src="${item.image}" class="w-full h-full object-contain p-1">` : `<span class="material-symbols-outlined text-secondary/40">${item.icon}</span>`}
                                        </div>
                                        <div class="flex-grow min-w-0">
                                            <p class="font-bold text-xs truncate leading-none">${item.name}</p>
                                            <p class="text-[9px] text-secondary mt-1">${item.value} Erz</p>
                                        </div>
                                        <button onclick="initiateFind('${item.name}')" class="bg-primary text-on-primary px-3 py-1.5 text-[10px] font-bold hover:brightness-110 transition-all">FINDEN</button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Verlieren Kategorie Popup -->
                ${state.losingPopup.category ? `
                    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div class="modal-overlay absolute inset-0" onclick="closeLosingPopup()"></div>
                        <div class="wood-card w-full max-w-4xl max-h-[80vh] p-8 relative shadow-2xl border-2 border-error/30 flex flex-col">
                            <button onclick="closeLosingPopup()" class="absolute top-4 right-4 text-on-surface-variant hover:text-error">
                                <span class="material-symbols-outlined">close</span>
                            </button>
                            <h3 class="font-headline text-3xl text-error mb-6 border-b border-outline-variant/30 pb-4 italic">Deine ${state.losingPopup.category} entfernen</h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar pr-4">
                                ${state.losingPopup.items.map(item => `
                                    <div class="flex items-center gap-3 p-3 bg-surface-container-low/50 border border-outline-variant/10 rounded-sm">
                                        <div class="w-12 h-12 bg-background border border-outline-variant/20 flex-shrink-0">
                                            ${item.image ? `<img src="${item.image}" class="w-full h-full object-contain p-1">` : `<span class="material-symbols-outlined text-secondary/40">${item.icon}</span>`}
                                        </div>
                                        <div class="flex-grow min-w-0">
                                            <p class="font-bold text-xs truncate leading-none">${item.name} ${item.count > 1 ? `<span class="text-secondary">x${item.count}</span>` : ''}</p>
                                            <p class="text-[9px] text-secondary mt-1">${item.value} Erz</p>
                                        </div>
                                        <button onclick="initiateRemove('${item.name}')" class="border border-error text-error hover:bg-error hover:text-on-error px-3 py-1.5 text-[10px] font-bold transition-all">ENTFERNEN</button>
                                    </div>
                                `).join('')}
                                ${state.losingPopup.items.length === 0 ? `<p class="col-span-full text-center py-10 italic opacity-50">Keine Gegenstände vorhanden.</p>` : ''}
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Finden Quantity Popup -->
                ${state.findingQuantityPopup.item ? `
                    <div class="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <div class="modal-overlay absolute inset-0"></div>
                        <div class="wood-card w-full max-w-xs p-6 relative shadow-2xl border-2 border-primary/50">
                            <h4 class="font-headline text-xl text-primary mb-4 text-center">${state.findingQuantityPopup.item.name} finden</h4>
                            <div class="flex flex-col items-center gap-4">
                                <div class="flex items-center gap-4">
                                    <span class="text-sm font-bold uppercase tracking-widest text-on-surface-variant">${(state.findingQuantityPopup.item.art === 'Spruchrolle' || (state.findingQuantityPopup.item.category === 'Magie' && state.findingQuantityPopup.item.name.toLowerCase().includes('spruchrolle'))) ? 'Ladungen:' : 'Menge:'}</span>
                                    <div class="flex items-center gap-2">
                                        <div class="bg-surface-container px-4 py-2 border border-outline-variant/30 text-xl font-headline min-w-[50px] text-center">${state.findingQuantityPopup.amount}</div>
                                        <span class="text-lg">x</span>
                                        <div class="flex flex-col gap-1">
                                            <button onclick="adjustFindingQuantity(1)" class="w-8 h-8 bg-primary/20 hover:bg-primary text-primary hover:text-on-primary flex items-center justify-center rounded-sm"><span class="material-symbols-outlined text-sm">add</span></button>
                                            <button onclick="adjustFindingQuantity(-1)" class="w-8 h-8 bg-primary/20 hover:bg-primary text-primary hover:text-on-primary flex items-center justify-center rounded-sm"><span class="material-symbols-outlined text-sm">remove</span></button>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex gap-4 w-full mt-4">
                                    <button onclick="cancelFindingQuantity()" class="flex-1 border border-outline-variant text-on-surface-variant py-2 text-[10px] font-bold uppercase">Abbruch</button>
                                    <button onclick="confirmFindingQuantity()" class="flex-1 bg-primary text-on-primary py-2 text-[10px] font-bold uppercase shadow-lg">OK</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Verlieren Quantity Popup -->
                ${state.losingQuantityPopup.item ? `
                    <div class="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <div class="modal-overlay absolute inset-0"></div>
                        <div class="wood-card w-full max-w-xs p-6 relative shadow-2xl border-2 border-error/50">
                            <h4 class="font-headline text-xl text-error mb-4 text-center">${state.losingQuantityPopup.item.name} entfernen</h4>
                            <div class="flex flex-col items-center gap-4">
                                <div class="flex items-center gap-4">
                                    <span class="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Menge:</span>
                                    <div class="flex items-center gap-2">
                                        <div class="bg-surface-container px-4 py-2 border border-outline-variant/30 text-xl font-headline min-w-[50px] text-center">${state.losingQuantityPopup.amount}</div>
                                        <span class="text-lg">x</span>
                                        <div class="flex flex-col gap-1">
                                            <button onclick="adjustLosingQuantity(1)" class="w-8 h-8 bg-error/20 hover:bg-error text-error hover:text-on-error flex items-center justify-center rounded-sm"><span class="material-symbols-outlined text-sm">add</span></button>
                                            <button onclick="adjustLosingQuantity(-1)" class="w-8 h-8 bg-error/20 hover:bg-error text-error hover:text-on-error flex items-center justify-center rounded-sm"><span class="material-symbols-outlined text-sm">remove</span></button>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex gap-4 w-full mt-4">
                                    <button onclick="cancelLosingQuantity()" class="flex-1 border border-outline-variant text-on-surface-variant py-2 text-[10px] font-bold uppercase">Abbruch</button>
                                    <button onclick="confirmLosingQuantity()" class="flex-1 bg-error text-on-error py-2 text-[10px] font-bold uppercase shadow-lg">OK</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </main>
        `;
    },
    questlog: () => {
        const hero = state.hero;
        if (!hero.campState) initCampState();
        const campNames = ["Altes Lager", "Neues Lager", "Sektenlager"];
        
        return `
            <div class="p-6 max-w-5xl mx-auto space-y-10">
                <!-- Anschlusspunkte Section -->
                ${hero.connectionPoints && hero.connectionPoints.length > 0 ? `
                    <div class="wood-card p-4 border border-secondary/30 flex flex-wrap gap-4 items-center mb-6 shadow-md">
                        <span class="text-xs uppercase text-primary font-bold tracking-widest flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-sm text-secondary">stars</span>
                            Erhaltene Anschlusspunkte:
                        </span>
                        <div class="flex flex-wrap gap-2">
                            ${hero.connectionPoints.map(cp => `
                                <div class="flex items-center gap-1.5 bg-secondary/15 px-3 py-1 border border-secondary/40 rounded-sm">
                                    <span class="text-xs font-bold text-secondary font-headline italic">${cp}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Lager-Übersicht Section -->
                <section>
                    <div class="flex justify-between items-end mb-6 px-1">
                        <h2 class="font-headline text-3xl text-primary italic">Lager-Übersicht</h2>
                        <button onclick="nextRound()" class="bg-secondary text-on-secondary px-4 py-2 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all">
                            <span class="material-symbols-outlined text-sm">refresh</span>
                            Runde
                        </button>
                    </div>
                    <div class="grid grid-cols-3 gap-4">
                        ${campNames.map(campName => {
                            const camp = CAMP_DATA[campName];
                            const activeNpcs = hero.campState[campName].active.map(idx => camp.npcs[idx]);
                            return `
                            <div class="space-y-3">
                                <div class="relative h-16 bg-surface-container overflow-hidden border border-outline-variant/30 shadow-lg">
                                    <div class="absolute inset-0 bg-gradient-to-t from-surface/90 to-transparent z-10"></div>
                                    <div class="absolute bottom-2 inset-x-0 text-center z-20">
                                        <span class="text-[10px] font-bold text-primary uppercase tracking-[0.2em] shadow-black text-shadow-sm">${campName}</span>
                                    </div>
                                </div>
                                ${activeNpcs.map(npc => {
                                    const roleIcons = { 'H': 'shopping_cart', 'L': 'school', 'Q': 'assignment' };
                                    return `
                                    <div class="bg-surface-container-high p-2 border border-outline-variant/20 flex flex-col items-center parchment-glow shadow-md transition-transform hover:scale-[1.02]">
                                        <img class="w-12 h-12 rounded-sm object-cover border border-secondary/40 mb-2 shadow-sm" src="${npc.img}" onerror="this.src='https://lh3.googleusercontent.com/aida-public/AB6AXuBVfWUNF1X6qbXNG7dKPDZlHs8WNE-Y1MA0upTuCjZuB8jmeuqd_wV4Nr8qnTxdWBP8Qtc7Zrx_I9wzM8cZ4ulJ5U0K2odkKjW9NqE7YTfpih6sIZjr9oKQIXqcoUuX5zOPWqnvKI2gwIAgiKkecafAg8GQaXFagBhXQhbC3d9mjQebRQf67_zexYJ1WosWmDOd1Fr3qbSsJsT79VQl9t2ZWwWhYpTDAIjAEaE3SPjGnmXOShnZ6MeasZJXq6iMKg3hgD8YOfJdMb0'"/>
                                        <span class="font-headline text-[11px] text-primary truncate w-full text-center mb-2 font-medium">${npc.name}</span>
                                        <div class="flex justify-center gap-2 w-full px-1">
                                            ${npc.roles.map(role => {
                                                const isHandled = isQuestHandledForNpc(npc.name);
                                                let action = '';
                                                let cursorClass = 'cursor-pointer hover:opacity-100 hover:text-primary transition-all';
                                                
                                                if (role === 'H') {
                                                    action = `onclick="navigateTo('handeln'); selectTrader('${npc.name}')"`;
                                                } else if (role === 'L') {
                                                    action = `onclick="openTeacherPopup('${npc.name}')"`;
                                                } else if (role === 'Q') {
                                                    if (isHandled) {
                                                        action = '';
                                                        cursorClass = 'opacity-25 cursor-not-allowed';
                                                    } else {
                                                        action = `onclick="openQuestAcceptancePopup('${npc.name}')"`;
                                                    }
                                                }
                                                
                                                return `
                                                <div ${action} class="text-on-surface-variant opacity-60 ${cursorClass}" title="${role === 'Q' && isHandled ? 'Quest bereits angenommen oder vergeben' : ''}">
                                                    <span class="material-symbols-outlined text-sm">${roleIcons[role]}</span>
                                                </div>
                                                `;
                                            }).join('')}
                                        </div>
                                    </div>
                                    `;
                                }).join('')}
                            </div>
                            `;
                        }).join('')}
                    </div>
                </section>
 
                <!-- Aktive Quests -->
                <section>
                    <h2 class="font-headline text-3xl text-primary italic mb-6 border-b border-outline-variant/30 pb-4">Aktive Quests</h2>
                    <div class="space-y-6">
                        ${hero.quests.length === 0 ? `
                            <p class="text-center py-10 opacity-50 text-sm italic">Keine aktiven Quests im Tagebuch.</p>
                        ` : hero.quests.map(q => {
                            const isBranching = QUESTS_DATA[q.id] !== undefined;
                            let conditionHtml = '';
                            let clickAction = `openQuestConfirmation('${q.id}')`;
                            
                            if (isBranching) {
                                const qDef = QUESTS_DATA[q.id];
                                const currentStep = q.currentStep || 'accepted';
                                const stepData = qDef.dialogs[currentStep];
                                if (stepData && stepData.condition) {
                                    conditionHtml = `
                                        <div class="mt-4 bg-secondary/5 p-4 border border-secondary/20 rounded-sm">
                                            <span class="text-[9px] text-secondary uppercase font-bold tracking-wider block mb-1">Erforderliche Bedingung</span>
                                            <p class="text-xs font-bold text-on-surface">${stepData.condition}</p>
                                        </div>
                                    `;
                                }
                                clickAction = `openQuestProgressPopup('${q.id}')`;
                            }
                            
                            return `
                            <div class="wood-card border-l-4 border-l-secondary p-6 flex flex-col md:flex-row gap-8 items-start md:items-center shadow-2xl">
                                <div class="relative flex-shrink-0">
                                    <div class="w-24 h-24 border border-outline-variant/40 shadow-inner overflow-hidden rounded-sm bg-surface-container">
                                        <img class="w-full h-full object-cover" src="${q.icon || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVfWUNF1X6qbXNG7dKPDZlHs8WNE-Y1MA0upTuCjZuB8jmeuqd_wV4Nr8qnTxdWBP8Qtc7Zrx_I9wzM8cZ4ulJ5U0K2odkKjW9NqE7YTfpih6sIZjr9oKQIXqcoUuX5zOPWqnvKI2gwIAgiKkecafAg8GQaXFagBhXQhbC3d9mjQebRQf67_zexYJ1WosWmDOd1Fr3qbSsJsT79VQl9t2ZWwWhYpTDAIjAEaE3SPjGnmXOShnZ6MeasZJXq6iMKg3hgD8YOfJdMb0'}" onerror="this.src='https://lh3.googleusercontent.com/aida-public/AB6AXuBVfWUNF1X6qbXNG7dKPDZlHs8WNE-Y1MA0upTuCjZuB8jmeuqd_wV4Nr8qnTxdWBP8Qtc7Zrx_I9wzM8cZ4ulJ5U0K2odkKjW9NqE7YTfpih6sIZjr9oKQIXqcoUuX5zOPWqnvKI2gwIAgiKkecafAg8GQaXFagBhXQhbC3d9mjQebRQf67_zexYJ1WosWmDOd1Fr3qbSsJsT79VQl9t2ZWwWhYpTDAIjAEaE3SPjGnmXOShnZ6MeasZJXq6iMKg3hgD8YOfJdMb0'"/>
                                    </div>
                                    <div class="absolute -bottom-3 -right-3 wax-seal w-10 h-10 rounded-full flex items-center justify-center text-primary font-headline text-xl shadow-lg ring-2 ring-surface">${(q.giver || 'Q').charAt(0)}</div>
                                </div>
                                <div class="flex-grow w-full">
                                    <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                                        <div>
                                            <h4 class="font-headline text-2xl text-primary">${q.name || q.title}</h4>
                                            <span class="text-[10px] text-secondary uppercase tracking-[0.15em] font-bold">Questgeber: ${q.giver || 'Unbekannt'}</span>
                                        </div>
                                        <div class="flex flex-col items-end">
                                            <span class="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Fortschritt</span>
                                            <span class="font-headline text-xl text-secondary">${q.progress || '0%'}</span>
                                        </div>
                                    </div>
                                    <p class="text-on-surface-variant italic mb-4 text-sm leading-relaxed border-l-2 border-outline-variant/20 pl-4 whitespace-pre-line">"${q.description}"</p>
                                    ${conditionHtml}
                                    <div class="flex gap-4 mt-6">
                                        <button onclick="${clickAction}" class="flex-1 bg-secondary text-on-secondary py-3 font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2">
                                            <span class="material-symbols-outlined text-sm">assignment_turned_in</span>
                                            Bedingung erfüllen
                                        </button>
                                        <button onclick="abandonQuest('${q.id}')" class="flex-1 border border-outline-variant text-on-surface-variant py-3 font-bold text-xs uppercase tracking-widest hover:bg-error/10 hover:text-error hover:border-error active:scale-95 transition-all flex items-center justify-center gap-2">
                                            <span class="material-symbols-outlined text-sm">delete</span>
                                            Abbrechen
                                        </button>
                                    </div>
                                </div>
                            </div>
                            `;
                        }).join('')}
                    </div>
                </section>
 
                <!-- Quest Confirmation Modal -->
                ${state.questConfirmationPopup.active ? `
                    <div class="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <div class="modal-overlay absolute inset-0" onclick="closeQuestConfirmation()"></div>
                        <div class="wood-card w-full max-w-md p-8 relative shadow-2xl border-2 border-secondary/50 flex flex-col gap-6">
                            <h4 class="font-headline text-xl text-primary text-center leading-relaxed">
                                ${state.questConfirmationPopup.text}
                            </h4>
                            <div class="flex gap-4">
                                <button onclick="closeQuestConfirmation()" class="flex-1 border border-outline-variant py-3 text-xs font-bold uppercase">Nein</button>
                                <button onclick="confirmQuestCompletion()" class="flex-1 bg-secondary text-on-secondary py-3 text-xs font-bold uppercase shadow-lg">Ja</button>
                            </div>
                        </div>
                    </div>
                ` : ''}
 
                <!-- Teacher Popup -->
                ${state.teacherPopup?.active ? `
                    <div class="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <div class="modal-overlay absolute inset-0" onclick="closeTeacherPopup()"></div>
                        <div class="wood-card w-full max-w-md p-8 relative shadow-2xl border-2 border-secondary/50 flex flex-col gap-6">
                            <h4 class="font-headline text-xl text-primary text-center leading-relaxed">
                                Der Charakter ${state.teacherPopup.name} ist Lehrer für ${state.teacherPopup.skills.join(' und ')}.
                            </h4>
                            <div class="flex gap-4">
                                <button onclick="closeTeacherPopup()" class="flex-1 border border-outline-variant py-3 text-xs font-bold uppercase">Abbruch</button>
                                <button onclick="teacherNavigateToStatus()" class="flex-1 bg-secondary text-on-secondary py-3 text-xs font-bold uppercase shadow-lg">Lernen</button>
                            </div>
                        </div>
                    </div>
                ` : ''}
                </section>
 
                <!-- Chronik -->
                <section>
                    <h2 class="font-headline text-3xl text-primary italic mb-6 border-b border-outline-variant/30 pb-4">Chronik</h2>
                    <div class="grid grid-cols-3 md:grid-cols-6 gap-6">
                        ${(hero.chronik || []).map((item, idx) => {
                            const isFailed = item.status === 'Fehlgeschlagen' || item.status === 'ABBRUCH';
                            const textColor = isFailed ? 'text-error line-through' : 'text-primary';
                            const statusColor = isFailed ? 'text-error' : 'text-on-surface-variant';
                            return `
                            <div onclick="toggleChronikDetail('${item.id || idx}')" class="flex flex-col items-center ${isFailed ? 'opacity-90 hover:opacity-100' : 'opacity-70 group hover:opacity-100'} transition-all cursor-pointer">
                                <div class="relative w-20 h-24 mb-3 border ${isFailed ? 'border-error/40' : 'border-outline-variant/30'} shadow-md group-hover:shadow-xl transition-shadow overflow-hidden">
                                    <img class="w-full h-full object-cover ${!isFailed ? 'grayscale group-hover:grayscale-0' : ''} transition-all" src="${item.icon || item.img || ''}" onerror="this.src='https://lh3.googleusercontent.com/aida-public/AB6AXuBVfWUNF1X6qbXNG7dKPDZlHs8WNE-Y1MA0upTuCjZuB8jmeuqd_wV4Nr8qnTxdWBP8Qtc7Zrx_I9wzM8cZ4ulJ5U0K2odkKjW9NqE7YTfpih6sIZjr9oKQIXqcoUuX5zOPWqnvKI2gwIAgiKkecafAg8GQaXFagBhXQhbC3d9mjQebRQf67_zexYJ1WosWmDOd1Fr3qbSsJsT79VQl9t2ZWwWhYpTDAIjAEaE3SPjGnmXOShnZ6MeasZJXq6iMKg3hgD8YOfJdMb0'"/>
                                    ${isFailed ? `
                                        <div class="absolute inset-0 bg-error/15 flex items-center justify-center pointer-events-none">
                                            <span class="material-symbols-outlined text-error text-4xl opacity-85">cancel</span>
                                        </div>
                                    ` : `<div class="absolute inset-0 border-2 border-primary/10 pointer-events-none group-hover:border-primary/40 transition-colors"></div>`}
                                </div>
                                <span class="text-[10px] text-center ${textColor} uppercase font-bold tracking-wider mb-1 truncate w-full px-1">${item.name || item.title || 'Unbekannt'}</span>
                                <span class="text-[9px] ${statusColor} font-bold">${item.status || ''}</span>
                            </div>
                            `;
                        }).join('')}
                    </div>
                    ${state.expandedChronikId !== undefined && state.expandedChronikId !== null ? (() => {
                        const activeItem = (hero.chronik || []).find((c, i) => (c.id || i).toString() === state.expandedChronikId.toString());
                        if (activeItem && activeItem.description) {
                            return `
                                <div class="wood-card mt-6 p-4 border border-outline-variant/30 rounded-sm shadow-md animate-fade-in relative">
                                    <button onclick="toggleChronikDetail('${activeItem.id}')" class="absolute top-2 right-2 text-on-surface-variant hover:text-primary"><span class="material-symbols-outlined text-sm">close</span></button>
                                    <h4 class="font-headline text-lg text-primary mb-2">${activeItem.name || activeItem.title}</h4>
                                    <p class="text-xs text-on-surface-variant whitespace-pre-wrap">${activeItem.description}</p>
                                </div>
                            `;
                        }
                        return '';
                    })() : ''}
                </section>
            </div>
        `;
    },
    schlachtfeld: () => {
        const sim = state.combatSimulator;
        if (!sim) return '<div class="p-10 text-error">Kein aktiver Kampf simulator</div>';

        const activeWeapon = sim.hero.weapons[0];
        const dist = Math.abs(sim.hero.pos.r - sim.enemy.pos.r) + Math.abs(sim.hero.pos.c - sim.enemy.pos.c);
        let maxMeleeDist = 1;
        if (activeWeapon && (activeWeapon.type === '2H' || activeWeapon.type.toLowerCase().includes('zweihand')) && (sim.hero.talents.zweihand || 0) >= 1) {
            maxMeleeDist = 2;
        }
        const isWithinMeleeRange = dist <= maxMeleeDist;
        
        const isRangedWeapon = activeWeapon && (
            activeWeapon.type.includes('Bogen') || 
            activeWeapon.type.includes('Armbrust') || 
            activeWeapon.type.includes('Fernkampf') || 
            activeWeapon.type.includes('FK')
        );
        
        const activeSpell = sim.hero.spells && sim.hero.spells.length > 0 ? sim.hero.spells[sim.hero.primarySpell || 0] : null;
        const isMagicActive = activeWeapon && activeWeapon.type === 'Magie';
        
        let canMelee = !isRangedWeapon && !isMagicActive && isWithinMeleeRange && sim.hero.remainingMov >= 0;
        if (activeWeapon && (activeWeapon.type === '2H' || activeWeapon.type.toLowerCase().includes('zweihand')) && sim.hero.remainingMov < sim.hero.mov && (sim.hero.talents.zweihand || 0) < 1) {
            canMelee = false;
        }
        const canRanged = isRangedWeapon && !isMagicActive && dist > 1 && sim.hero.remainingMov >= 0;
        const hasMana = activeSpell ? (sim.hero.mana || 0) >= (activeSpell.reqMana || 1) : false;
        const canCastSpell = activeSpell && hasMana && sim.turn === 'hero' && !sim.actionDone && sim.hero.remainingMov === sim.hero.mov;
        const canSwapSpell = sim.hero.spells && sim.hero.spells.length > 0 && sim.turn === 'hero';
        
        let cellsHtml = '';
        for (let r = 1; r <= 15; r++) {
            for (let c = 1; c <= 15; c++) {
                const isHero = sim.hero.pos.r === r && sim.hero.pos.c === c;
                const isEnemy = sim.enemy.pos.r === r && sim.enemy.pos.c === c;
                
                let cellContent = '';
                let cellClass = 'grid-cell';
                
                const key = `${r}-${c}`;
                const markers = {
                    "3-8": "1", "3-3": "2", "3-13": "3",
                    "13-8": "4", "13-3": "5", "13-13": "6"
                };
                
                if (markers[key] && !isHero && !isEnemy) {
                    cellContent = markers[key];
                    cellClass += ' bg-primary/5';
                }
                
                if (isHero) {
                    cellContent = '<span class="material-symbols-outlined text-primary scale-125">person</span>';
                    cellClass += ' bg-primary/20';
                } else if (isEnemy) {
                    cellContent = '<span class="material-symbols-outlined text-error scale-125">skull</span>';
                    cellClass += ' bg-error/20';
                }
                
                if (sim.mode === 'moving') {
                    const dist = Math.abs(r - sim.hero.pos.r) + Math.abs(c - sim.hero.pos.c);
                    const isOccupied = isHero || isEnemy;
                    if (dist > 0 && dist <= sim.hero.remainingMov && !isOccupied) {
                        cellClass += ' highlight';
                    }
                }
                
                cellsHtml += `
                    <div class="${cellClass}" onclick="handleCombatCellClick(${r}, ${c})">
                        ${cellContent}
                    </div>
                `;
            }
        }

        return `
            <style>
                .grid-battlefield { display: grid; grid-template-columns: repeat(15, 1fr); grid-template-rows: repeat(15, 1fr); width: 100%; max-width: 390px; aspect-ratio: 1 / 1; border: 2px solid #e9c176; background-color: #0e0e0e; position: relative; margin: 0 auto; }
                .grid-cell { border: 1px solid rgba(233, 193, 118, 0.1); display: flex; align-items: center; justify-content: center; font-family: 'Newsreader', serif; font-weight: 800; color: #e9c176; font-size: 0.8rem; cursor: pointer; width: 100%; height: 100%; }
                .grid-cell.highlight { background-color: rgba(233, 193, 118, 0.2); }
                .bento-action-button { transition: all 0.2s ease-out; border: 1px solid rgba(233, 193, 118, 0.15); }
                .bento-action-button:disabled { opacity: 0.3; cursor: not-allowed; background-color: #1a1a1a; }
                .flash-red-overlay { pointer-events: none; position: absolute; inset: 0; z-index: 50; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b463c; }
            </style>
            <div class="flex flex-col font-sans select-none pb-24">
                <!-- Header -->
                <header class="bg-[#131313] w-full top-0 sticky flex items-center justify-between px-6 py-4 h-16 z-40 border-b border-[#e9c176]/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-primary text-2xl font-bold">swords</span>
                        <h1 class="text-xl font-headline tracking-[0.2em] text-[#e9c176] uppercase">KAMPFSIMULATION</h1>
                    </div>
                    <button onclick="exitCombatSimulator()" class="text-on-surface-variant hover:text-primary transition-colors bg-white/5 p-2 rounded-sm">
                        <span class="material-symbols-outlined text-lg">close</span>
                    </button>
                </header>
                
                <main class="flex flex-col max-w-[390px] mx-auto w-full pt-4">
                    <!-- Battlefield Grid Section -->
                    <section class="w-full flex justify-center bg-[#0d0d0c] py-3 relative border-b border-primary/10">
                        <div class="flash-red-overlay ${sim.flashRed ? 'animate-flash-red' : ''}"></div>
                        <div class="grid-battlefield">
                            ${cellsHtml}
                        </div>
                    </section>
                    
                    <!-- Action / Favoritensuche Buttons -->
                    ${sim.isAdmin ? `
                        <!-- Admin: Combined Style Selector, Favoritensuche and beautiful inline Analysis Console -->
                        <section class="p-4 bg-surface space-y-4">
                            <div class="flex flex-col space-y-1">
                                <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Kampfstil wählen</label>
                                <select onchange="state.combatSimulator.simStyle = this.value; render();" class="bg-[#201f1f] border border-outline-variant/30 text-primary text-xs py-2 px-3 focus:outline-none focus:border-primary w-full">
                                    <option value="hybrid" ${sim.simStyle === 'hybrid' ? 'selected' : ''}>Hybrid (NK & FK)</option>
                                    <option value="melee" ${sim.simStyle === 'melee' ? 'selected' : ''}>Nur Nahkampf</option>
                                    <option value="ranged" ${sim.simStyle === 'ranged' ? 'selected' : ''}>Nur Fernkampf</option>
                                </select>
                            </div>
                            <button onclick="run100CombatSimulations(state.combatSimulator.simStyle)" 
                                    ${sim.isSimulating ? 'disabled' : ''}
                                    class="w-full bento-action-button bg-primary text-on-primary font-headline tracking-widest text-xs uppercase py-3.5 flex items-center justify-center gap-2 font-bold shadow-md hover:brightness-110 active:scale-95 transition-all">
                                <span class="material-symbols-outlined text-sm ${sim.isSimulating ? 'animate-spin' : ''}">analytics</span>
                                ${sim.isSimulating ? 'SIMULIERE...' : 'FAVORITENSUCHE STARTEN'}
                            </button>
                        </section>

                        <!-- Admin Analysis Console Inline -->
                        <section class="p-4 bg-[#181717] border-t border-primary/20 space-y-4">
                            <!-- Header / Performance Stats -->
                            <div class="wood-card p-4 border border-secondary/30 space-y-2 shadow-md">
                                <h3 class="text-[10px] text-primary uppercase tracking-wider font-bold mb-2 flex items-center gap-2">
                                    <span class="material-symbols-outlined text-xs text-primary">analytics</span>
                                    KAMPF-PERFORMANCE (SIMULATION)
                                </h3>
                                <div class="flex justify-between items-center text-[11px] py-1 border-b border-white/5">
                                    <span class="opacity-70 text-on-surface">Siegeswahrscheinlichkeit:</span>
                                    <span class="text-primary font-bold">${sim.simsCompleted > 0 ? ((sim.simWins / sim.simsCompleted) * 100).toFixed(1) : '0.0'}%</span>
                                </div>
                                <div class="flex justify-between items-center text-[11px] py-1 border-b border-white/5">
                                    <span class="opacity-70 text-on-surface">Avg. Leben bei Sieg:</span>
                                    <span class="text-primary font-bold">${sim.simWins > 0 ? (sim.simHeroHpOnWin / sim.simWins).toFixed(1) : '0.0'} HP</span>
                                </div>
                                <div class="flex justify-between items-center text-[11px] py-1">
                                    <span class="opacity-70 text-on-surface">Avg. Gegner-HP bei Niederlage:</span>
                                    <span class="text-primary font-bold">${sim.simLosses > 0 ? (sim.simEnemyHpOnLoss / sim.simLosses).toFixed(1) : '0.0'} HP</span>
                                </div>
                            </div>

                            <!-- Detailed Last 5 Battles Logs -->
                            <div class="space-y-2">
                                <h3 class="text-[10px] text-primary uppercase tracking-wider font-bold mb-2 flex items-center gap-2">
                                    <span class="material-symbols-outlined text-xs text-primary">list_alt</span>
                                    DETAILLIERTE ANALYSE (LETZTE 5 KÄMPFE)
                                </h3>
                                ${sim.lastFiveSummaries.length === 0 ? `
                                    <div class="p-3 text-[10px] text-on-surface-variant/60 italic bg-surface-container/50 border border-outline-variant/10 text-center">
                                        Keine Daten vorhanden. Starte die Favoritensuche!
                                    </div>
                                ` : sim.lastFiveSummaries.map((summary, index) => {
                                    const reverseIdx = sim.lastFiveSummaries.length - 1 - index;
                                    const sumText = sim.lastFiveSummaries[reverseIdx];
                                    const logList = sim.lastFiveDetailedLogs[reverseIdx];
                                    const logId = `combat-log-detail-${reverseIdx}`;
                                    
                                    return `
                                        <div class="border border-outline-variant/20 rounded-sm overflow-hidden bg-[#131313]">
                                            <button onclick="const el = document.getElementById('${logId}'); el.classList.toggle('hidden');" class="w-full flex justify-between items-center p-3 text-left font-bold text-[10px] hover:bg-white/5 transition-colors text-primary uppercase">
                                                <span>${sumText}</span>
                                                <span class="material-symbols-outlined text-sm">expand_more</span>
                                            </button>
                                            <div id="${logId}" class="hidden p-3 bg-black/40 text-[9px] font-mono border-t border-outline-variant/10 max-h-48 overflow-y-auto space-y-1 custom-scrollbar text-on-surface-variant/80">
                                                ${logList.map(logMsg => `<p class="leading-relaxed border-b border-white/5 pb-0.5 last:border-none">> ${logMsg}</p>`).join('')}
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>

                            <!-- Gegner anpassen -->
                            <div class="bg-surface-container p-4 border border-outline-variant/20 space-y-3 rounded-sm">
                                <h3 class="text-[10px] text-primary uppercase tracking-wider font-bold border-b border-primary/20 pb-1 flex items-center gap-2">
                                    <span class="material-symbols-outlined text-xs text-primary">edit</span>
                                    GEGNER ANPASSEN
                                </h3>
                                <div class="grid grid-cols-2 gap-2.5">
                                    <div class="flex flex-col space-y-0.5">
                                        <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Name</label>
                                        <input type="text" value="${sim.enemy.name}" oninput="state.combatSimulator.enemy.name = this.value; render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                                    </div>
                                    <div class="flex flex-col space-y-0.5">
                                        <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">HP</label>
                                        <input type="number" value="${sim.enemy.hp}" oninput="state.combatSimulator.enemy.hp = parseInt(this.value) || 0; state.combatSimulator.enemy.maxHp = parseInt(this.value) || 0; render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                                    </div>
                                </div>
                                <div class="grid grid-cols-3 gap-2.5">
                                    <div class="flex flex-col space-y-0.5">
                                        <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Rüstung</label>
                                        <input type="number" value="${sim.enemy.arm}" oninput="state.combatSimulator.enemy.arm = parseInt(this.value) || 0; render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                                    </div>
                                    <div class="flex flex-col space-y-0.5">
                                        <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Stärke</label>
                                        <input type="number" value="${sim.enemy.str}" oninput="state.combatSimulator.enemy.str = parseInt(this.value) || 0; render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                                    </div>
                                    <div class="flex flex-col space-y-0.5">
                                        <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Geschick</label>
                                        <input type="number" value="${sim.enemy.dex}" oninput="state.combatSimulator.enemy.dex = parseInt(this.value) || 0; render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                                    </div>
                                </div>
                                <div class="flex flex-col space-y-0.5">
                                    <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Bewegung</label>
                                    <input type="number" value="${sim.enemy.mov}" oninput="state.combatSimulator.enemy.mov = parseInt(this.value) || 0; render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                                </div>
                                <div class="flex flex-col space-y-0.5">
                                    <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Fähigkeiten</label>
                                    <textarea rows="2" oninput="state.combatSimulator.enemy.abilities = this.value; render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary custom-scrollbar resize-none">${sim.enemy.abilities}</textarea>
                                </div>
                            </div>

                            <!-- Waffen anpassen -->
                            <div class="bg-surface-container p-4 border border-outline-variant/20 space-y-3 rounded-sm">
                                <h3 class="text-[10px] text-primary uppercase tracking-wider font-bold border-b border-primary/20 pb-1 flex items-center gap-2">
                                    <span class="material-symbols-outlined text-xs text-primary">swords</span>
                                    NAHKAMPFWAFFE ANPASSEN
                                </h3>
                                <div class="grid grid-cols-2 gap-2.5">
                                    <div class="flex flex-col space-y-0.5">
                                        <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Name</label>
                                        <input type="text" value="${sim.hero.weapons[0].name}" oninput="state.combatSimulator.hero.weapons[0].name = this.value; render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                                    </div>
                                    <div class="flex flex-col space-y-0.5">
                                        <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Schaden (DMG)</label>
                                        <input type="number" value="${sim.hero.weapons[0].dmg}" oninput="state.combatSimulator.hero.weapons[0].dmg = parseInt(this.value) || 0; render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-2.5">
                                    <div class="flex flex-col space-y-0.5">
                                        <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Typ (z.B. 1H oder 2H)</label>
                                        <input type="text" value="${sim.hero.weapons[0].type}" oninput="state.combatSimulator.hero.weapons[0].type = this.value; render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                                    </div>
                                    <div class="flex flex-col space-y-0.5">
                                        <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Effekt</label>
                                        <input type="text" value="${sim.hero.weapons[0].ability}" oninput="state.combatSimulator.hero.weapons[0].ability = this.value; render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                                    </div>
                                </div>
                            </div>

                            ${sim.hero.weapons[1] ? `
                                <div class="bg-surface-container p-4 border border-outline-variant/20 space-y-3 rounded-sm">
                                    <h3 class="text-[10px] text-primary uppercase tracking-wider font-bold border-b border-primary/20 pb-1 flex items-center gap-2">
                                        <span class="material-symbols-outlined text-xs text-primary">arrow_forward</span>
                                        FERNKAMPFWAFFE ANPASSEN
                                    </h3>
                                    <div class="grid grid-cols-2 gap-2.5">
                                        <div class="flex flex-col space-y-0.5">
                                            <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Name</label>
                                            <input type="text" value="${sim.hero.weapons[1].name}" oninput="state.combatSimulator.hero.weapons[1].name = this.value; render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                                        </div>
                                        <div class="flex flex-col space-y-0.5">
                                            <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Schaden (DMG)</label>
                                            <input type="number" value="${sim.hero.weapons[1].dmg}" oninput="state.combatSimulator.hero.weapons[1].dmg = parseInt(this.value) || 0; render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-2 gap-2.5">
                                        <div class="flex flex-col space-y-0.5">
                                            <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Typ (z.B. FK)</label>
                                            <input type="text" value="${sim.hero.weapons[1].type}" oninput="state.combatSimulator.hero.weapons[1].type = this.value; render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                                        </div>
                                        <div class="flex flex-col space-y-0.5">
                                            <label class="text-[8px] text-on-surface-variant/60 uppercase font-bold tracking-wider">Effekt</label>
                                            <input type="text" value="${sim.hero.weapons[1].ability}" oninput="state.combatSimulator.hero.weapons[1].ability = this.value; render();" class="bg-black/30 border border-outline-variant/20 text-xs py-1.5 px-2 rounded-sm text-on-surface focus:outline-none focus:border-primary">
                                        </div>
                                    </div>
                                </div>
                            ` : ''}

                            <!-- Actions -->
                            <div class="flex flex-col gap-2.5 pt-2">
                                <button onclick="printCombatSimulatorPDF()" class="w-full bg-[#1e293b] border border-primary/40 hover:bg-[#334155] text-primary py-2.5 font-headline font-bold text-xs uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-all shadow-md">
                                    <span class="material-symbols-outlined text-sm">picture_as_pdf</span>
                                    Statistik als PDF drucken
                                </button>
                                <div class="flex gap-3">
                                    <button onclick="resetCombatSimulatorToOriginal()" class="flex-1 bg-red-900/30 hover:bg-red-900/50 border border-red-500/40 text-red-400 py-2.5 font-headline font-bold text-xs uppercase tracking-wider rounded-sm transition-colors">
                                        ORIGINAL WERTEN
                                    </button>
                                    <button onclick="saveCombatSimulatorChanges()" class="flex-1 bg-primary text-on-primary py-2.5 font-headline font-bold text-xs uppercase tracking-wider rounded-sm hover:brightness-110 active:scale-95 transition-all shadow-md">
                                        SPEICHERN
                                    </button>
                                </div>
                            </div>
                        </section>
                    ` : `
                        <!-- Normal Mode: Manual Turn Bento Grid -->
                        <section class="p-4 grid grid-cols-2 gap-2.5 bg-surface">
                            <button onclick="startCombatMovement()" 
                                    ${sim.turn !== 'hero' || sim.hero.remainingMov === 0 ? 'disabled' : ''}
                                    class="bento-action-button bg-surface-container-high h-14 font-headline tracking-widest text-primary text-xs uppercase flex items-center justify-center font-bold">
                                BEWEGEN
                            </button>
                            <button onclick="executeCombatRangedAttack()" 
                                    ${sim.turn !== 'hero' || !canRanged ? 'disabled' : ''}
                                    class="bento-action-button bg-surface-container-high h-14 font-headline tracking-widest text-primary text-xs uppercase flex items-center justify-center font-bold">
                                ANGRIFF (FK)
                            </button>
                            <button onclick="executeCombatMeleeAttack()" 
                                    ${sim.turn !== 'hero' || !canMelee ? 'disabled' : ''}
                                    class="bento-action-button bg-surface-container-high h-14 font-headline tracking-widest text-primary text-xs uppercase flex items-center justify-center font-bold">
                                ANGRIFF (NK)
                            </button>
                            <button onclick="if(state.combatSimulator.turn === 'hero') { window.endHeroTurn(); } executeEnemyTurn();" 
                                    ${(sim.turn !== 'hero' && sim.turn !== 'enemy') ? 'disabled' : ''}
                                    class="bento-action-button bg-surface-container-high h-14 font-headline tracking-widest text-primary text-xs uppercase flex items-center justify-center font-bold ${sim.turn === 'enemy' ? 'animate-flash-green' : ''}">
                                GEGNERZUG
                            </button>
                        </section>

                        <!-- Zauber wirken / wechseln Buttons -->
                        <section class="px-4 py-2 bg-surface flex flex-col gap-2">
                            <button onclick="executeCastSpell()"
                                    ${!canCastSpell ? 'disabled' : ''}
                                    class="bento-action-button ${canCastSpell ? 'bg-primary/20 border border-primary/40' : 'bg-surface-container-high opacity-50'} w-full h-10 font-headline tracking-widest text-primary text-[10px] uppercase flex items-center justify-center font-bold gap-2">
                                <span class="material-symbols-outlined text-sm">auto_fix_high</span>
                                ZAUBER WIRKEN ${activeSpell ? `(${activeSpell.reqMana || '?'} Mana)` : '(kein Zauber)'}
                            </button>
                        </section>
                        
                        <!-- Weapon Swap / Spell Swap Buttons -->
                        <section class="px-4 py-2 bg-surface flex flex-col gap-2">
                            <button onclick="executeCombatWeaponSwap()" 
                                    ${sim.turn !== 'hero' || sim.hero.weapons.length < 2 || sim.hero.remainingMov < 1 ? 'disabled' : ''}
                                    class="bento-action-button bg-primary/10 border border-primary/30 w-full h-10 font-headline tracking-widest text-primary text-[10px] uppercase flex items-center justify-center font-bold">
                                WAFFENWECHSEL (-1 BWG)
                            </button>
                            ${canSwapSpell ? `
                            <button onclick="executeCombatSpellSwap()"
                                    class="bento-action-button bg-secondary/10 border border-secondary/30 w-full h-10 font-headline tracking-widest text-secondary text-[10px] uppercase flex items-center justify-center font-bold gap-2">
                                <span class="material-symbols-outlined text-sm">swap_horiz</span>
                                ZAUBER WECHSELN
                            </button>` : ''}
                        </section>
                    `}
                    
                    <!-- Kontrahenten Comparison Area -->
                    <section class="px-4 py-4 bg-surface-container-low border-t border-b border-primary/10 space-y-4">
                        <h2 class="font-headline text-xl text-primary tracking-tighter uppercase mb-4 border-l-4 border-primary pl-3">Kontrahenten</h2>
                        <div class="grid grid-cols-2 gap-4">
                            <!-- HERO Status -->
                            <div class="flex flex-col space-y-3">
                                <div class="flex flex-col">
                                    <span class="font-label text-[9px] text-on-surface-variant uppercase tracking-[0.2em] mb-0.5">Auserwählter</span>
                                    <span class="font-headline text-lg text-on-surface uppercase font-bold">${sim.hero.name}</span>
                                </div>
                                <div class="space-y-1.5 text-xs">
                                    <div class="flex justify-between items-center bg-surface-container p-2 border-l-2 border-secondary">
                                        <span class="font-label opacity-60">HP</span>
                                        <span class="font-headline text-secondary font-bold">${sim.hero.hp} / ${sim.hero.maxHp}</span>
                                    </div>
                                    <div class="flex justify-between items-center bg-surface-container p-2">
                                        <span class="font-label opacity-60">Rüstung</span>
                                        <span class="font-headline font-bold">${sim.hero.arm}</span>
                                    </div>
                                    <div class="flex justify-between items-center bg-surface-container p-2">
                                        <span class="font-label opacity-60">Stärke</span>
                                        <span class="font-headline font-bold">${sim.hero.str}</span>
                                    </div>
                                    <div class="flex justify-between items-center bg-surface-container p-2">
                                        <span class="font-label opacity-60">Geschick</span>
                                        <span class="font-headline font-bold">${sim.hero.dex}</span>
                                    </div>
                                    <div class="flex justify-between items-center bg-surface-container p-2">
                                        <span class="font-label opacity-60">Bewegung</span>
                                        <span class="font-headline text-[10px] text-primary font-bold">${sim.hero.remainingMov} / ${sim.hero.mov} BWG</span>
                                    </div>
                                </div>
                                
                                <div class="mt-2 space-y-1.5">
                                    <div class="bg-primary-container/20 p-2 border border-primary/20">
                                        <div class="flex justify-between items-center mb-0.5">
                                            <span class="font-label text-[8px] uppercase tracking-widest text-primary">Aktiv</span>
                                            <span class="font-label text-[7px] uppercase bg-primary text-on-primary px-1">AKTIV</span>
                                        </div>
                                        <p class="font-headline text-xs font-bold text-[#e9c176]">${sim.hero.weapons[0].name}</p>
                                        <p class="font-label text-[8px] text-primary/60">${sim.hero.weapons[0].type} • Schaden: ${sim.hero.weapons[0].dmg}</p>
                                    </div>
                                    
                                    ${sim.hero.weapons[1] ? `
                                        <div class="bg-surface-container-highest p-2 opacity-50">
                                            <span class="font-label text-[8px] uppercase tracking-widest font-bold">Reserve</span>
                                            <p class="font-headline text-xs font-bold">${sim.hero.weapons[1].name}</p>
                                            <p class="font-label text-[8px] opacity-60">${sim.hero.weapons[1].type} • Schaden: ${sim.hero.weapons[1].dmg}</p>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                            
                            <!-- OPPONENT Status -->
                            <div class="flex flex-col space-y-3">
                                <div class="flex flex-col items-end">
                                    <span class="font-label text-[9px] text-error uppercase tracking-[0.2em] mb-0.5">Ungetüm</span>
                                    <span class="font-headline text-lg text-on-surface uppercase font-bold">${sim.enemy.name}</span>
                                </div>
                                <div class="space-y-1.5 text-xs">
                                    <div class="flex justify-between items-center bg-error-container/10 p-2 border-r-2 border-error">
                                        <span class="font-headline text-error font-bold">${sim.enemy.hp} / ${sim.enemy.maxHp}</span>
                                        <span class="font-label opacity-60">HP</span>
                                    </div>
                                    <div class="flex justify-between items-center bg-surface-container p-2">
                                        <span class="font-headline font-bold">${sim.enemy.arm}</span>
                                        <span class="font-label opacity-60">Rüstung</span>
                                    </div>
                                    <div class="flex justify-between items-center bg-surface-container p-2">
                                        <span class="font-headline font-bold">${sim.enemy.str}</span>
                                        <span class="font-label opacity-60">Stärke</span>
                                    </div>
                                    <div class="flex justify-between items-center bg-surface-container p-2">
                                        <span class="font-headline font-bold">${sim.enemy.dex}</span>
                                        <span class="font-label opacity-60">Geschick</span>
                                    </div>
                                    <div class="flex justify-between items-center bg-surface-container p-2">
                                        <span class="font-headline font-bold">${sim.enemy.mov}</span>
                                        <span class="font-label opacity-60">Bewegung</span>
                                    </div>
                                </div>
                                
                                ${sim.enemy.abilities ? `
                                    <div class="mt-2 bg-secondary-container/10 p-2.5 border border-[#e7bdb1]/15">
                                        <span class="font-label text-[8px] uppercase tracking-widest text-[#e7bdb1] block mb-1 underline decoration-primary/20">Passive Fähigkeiten</span>
                                        <p class="text-[9px] font-label leading-relaxed opacity-80">${sim.enemy.abilities}</p>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </section>
                    
                    <!-- Battle Log -->
                    <section class="px-4 py-3 bg-[#0e0e0e] border-b border-primary/10">
                        <h3 class="font-headline text-[10px] text-primary uppercase tracking-widest mb-1.5 font-bold">Kampfprotokoll</h3>
                        <div class="text-[10px] font-mono h-24 overflow-y-auto space-y-1 text-on-surface/75 bg-black/30 p-2 custom-scrollbar border border-outline-variant/15 rounded-sm">
                            ${sim.log.map(msg => `<p class="leading-relaxed border-b border-white/5 pb-0.5 last:border-none">> ${msg}</p>`).join('')}
                        </div>
                    </section>
                </main>
                
                <!-- Dialog for Confirming Move End -->
                ${sim.confirmMoveDialog ? `
                    <div class="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-6">
                        <div class="bg-surface-container-high border border-primary/40 p-6 max-w-xs w-full text-center shadow-2xl rounded-sm">
                            <p class="font-headline text-lg text-primary mb-2 uppercase font-bold tracking-wider">KEINE BEWEGUNGSPUNKTE</p>
                            <p class="font-label text-xs mb-6 text-on-surface-variant">Dein Zug hat keine weiteren Bewegungspunkte mehr übrig.</p>
                            <div class="flex flex-col gap-2">
                                <button onclick="confirmCombatMoveEnd()" class="bg-primary text-on-primary py-2.5 font-headline uppercase text-xs tracking-wider font-bold rounded-sm shadow-md">Zug beenden</button>
                                <button onclick="resetCombatMove()" class="border border-primary/40 text-primary py-2.5 font-headline uppercase text-xs tracking-wider font-bold rounded-sm hover:bg-white/5 transition-all">Ändern (Reset)</button>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <!-- Victory/Defeat Overlay -->
                ${sim.endScreen ? `
                    <div class="fixed inset-0 z-[250] bg-black/95 flex flex-col items-center justify-center p-4 overflow-y-auto">
                        <h2 class="font-headline text-5xl uppercase tracking-widest mb-2 font-bold ${sim.endScreen === 'WON' ? 'text-primary' : 'text-error'}">
                            ${sim.endScreen === 'WON' ? 'SIEG!' : 'NIEDERLAGE!'}
                        </h2>
                        <p class="text-xs text-on-surface-variant max-w-xs mb-6 text-center">
                            ${sim.endScreen === 'WON' ? `Der ${sim.enemy.name} wurde bezwungen! Dein Held geht siegreich hervor.` : `Dein Held ist im Kampf gegen ${sim.enemy.name} gefallen.`}
                        </p>

                        ${sim.endScreen === 'WON' && sim.rewards ? `
                        <div class="wood-card w-full max-w-sm p-6 mb-6 border-2 border-primary/40 text-center">
                            <h3 class="font-headline text-2xl text-primary mb-4 italic border-b border-primary/20 pb-2">Beute erhalten</h3>
                            <div class="space-y-3 text-left">
                                ${sim.rewards.xp > 0 ? `
                                <div class="flex items-center gap-3 p-2 bg-primary/10 rounded-sm">
                                    <span class="material-symbols-outlined text-primary">military_tech</span>
                                    <span class="text-on-surface font-bold">+${sim.rewards.xp} Erfahrungspunkte</span>
                                </div>` : ''}
                                ${(sim.rewards.items || []).map(item => `
                                <div class="flex items-center gap-3 p-2 bg-secondary/10 rounded-sm">
                                    <span class="material-symbols-outlined text-secondary">${item.icon || 'inventory_2'}</span>
                                    <div>
                                        <span class="text-on-surface font-bold block text-sm">${item.name}</span>
                                        ${item.effect ? `<span class="text-xs text-on-surface-variant">${item.effect}</span>` : ''}
                                    </div>
                                </div>`).join('')}
                            </div>
                        </div>
                        ` : ''}

                        <button onclick="window.collectCombatRewards()" 
                                class="border-2 border-primary text-primary px-8 py-3 font-headline uppercase tracking-widest font-bold rounded-sm hover:bg-primary hover:text-on-primary transition-all">
                            ${sim.endScreen === 'WON' ? 'Beute einsammeln' : 'Schließen'}
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }
};

// --- Startseite & Helden Handlers ---

function startNewGame() {
    state.heroSelectionPopup.active = true;
    render();
}

function previewHero(name) {
    state.heroSelectionPopup.selectedHero = name;
    render();
}

function selectHero(heroName) {
    const heroData = HEROES.find(h => h.name === heroName);
    if (!heroData) return;

    // Reset Game State
    state.hero = JSON.parse(JSON.stringify(DEFAULT_STATE.hero));
    state.hero.name = heroData.name;
    state.hero.crime = heroData.crime;
    state.hero.image = heroData.image;
    state.hero.level = 0;
    state.hero.xp = { current: 0, next: 100 };
    state.hero.hp = { current: 10, max: 10 };
    state.hero.ore = 0;
    state.hero.lp = 0;
    state.hero.chapter = 1;
    state.hero.attributes = { str: 1, dex: 1, mana: 5, mov: 5 };
    const starterArmor = { id: Date.now(), name: "Sträflingsklamotten", value: 0, chapter: 0, effect: "Aura +3 Rüstung", category: "Rüstung", icon: "shield", image: "Bilder Karten/Rüstungen/Kapitel 1 & 2/Sträflingsklamotten.png" };
    state.hero.inventory = [starterArmor];
    state.hero.equipment = {
        melee: null,
        ranged: null,
        armor: starterArmor,
        spells: [],
        primarySpell: 0,
        artifacts: { amulet: null, ring1: null, ring2: null }
    };
    state.hero.campState = null;
    initCampState();
    
    // Set Quests
    state.hero.quests = [
        {
            id: 'main_quest',
            name: 'Willkommen in der Kolonie!',
            giver: 'Das Minental',
            status: 'Laufend',
            progress: '0%',
            description: 'Angekommen als Neuling in der Kolonie, musst du zunächst das Minental und seine Bewohner kennen lernen! Im Zuge dessen musst du Erfahrung sammeln und deine Talente wieder erlernen, die du vor deiner Gefangenschaft hattest. Hierfür musst du deine eigene Quest zum Erlangen deiner passiven Fähigkeit erfüllen! Hast du die Quest erfüllt, erhältst du 100 Erfahrungspunkte und die für den weiteren Verlauf des Spiels entscheidende Heldenfähigkeit. Zusätzlich dazu muss man zwei Quests aus den Lagern absolviert haben, welche man sich frei aussuchen kann!',
            icon: '../../Bilder Karten/Barriere außen.jfif'
        },
        {
            id: 'hero_quest',
            name: 'Jeder hat seine eigenen Stärken!',
            giver: heroData.name,
            status: 'Laufend',
            progress: '0%',
            description: heroData.quest,
            icon: heroData.image
        }
    ];

    state.heroSelectionPopup = { active: false, selectedHero: null };
    state.gameStarted = true;
    state.currentScreen = 'status';
    
    render();
    saveGame();
}

function openQuestConfirmation(questId) {
    let text = "";
    if (questId === 'main_quest') {
        text = "Sind folgende Bedingungen erfüllt:<br><br>Passive Heldenfähigkeit freigeschaltet<br>2 Quests aus beliebigen Lagern erfüllt?";
    } else if (questId === 'hero_quest') {
        text = "Sind alle Bedingungen zum erlangen deiner passiven Fähigkeit erfüllt?";
    } else {
        text = "Hast du alle Bedingungen für diese Quest erfüllt?";
    }
    
    state.questConfirmationPopup = { active: true, questId: questId, text: text };
    render();
}

function closeQuestConfirmation() {
    state.questConfirmationPopup = { active: false, questId: null, text: "" };
    render();
}

window.toggleChronikDetail = function(id) {
    if (state.expandedChronikId === id) {
        state.expandedChronikId = null;
    } else {
        state.expandedChronikId = id;
    }
    render();
};

function confirmQuestCompletion() {
    const qId = state.questConfirmationPopup.questId;
    const quest = state.hero.quests.find(q => q.id === qId);
    
    if (quest) {
        if (!state.hero.chronik) state.hero.chronik = [];
        state.hero.chronik.push({
            id: quest.id,
            name: quest.name,
            status: "ERFOLGREICH",
            icon: quest.icon,
            description: quest.description
        });
    }

    state.hero.quests = state.hero.quests.filter(q => q.id !== qId);
    
    if (qId === 'hero_quest') {
        window.gainXp(100);
    }
    
    closeQuestConfirmation();
    saveGame();
}

function abandonQuest(questId) {
    const quest = state.hero.quests.find(q => q.id === questId);
    if (quest) {
        if (!state.hero.chronik) state.hero.chronik = [];
        state.hero.chronik.push({
            id: quest.id,
            name: quest.name,
            status: "ABBRUCH",
            icon: quest.icon,
            description: quest.description
        });
    }
    state.hero.quests = state.hero.quests.filter(q => q.id !== questId);
    render();
    saveGame();
}

// --- New Quest System Helpers ---
window.isQuestHandledForNpc = function(npcName) {
    const accepted = state.hero.quests && state.hero.quests.some(q => q.giver === npcName);
    const delegated = state.hero.deactivatedQuests && state.hero.deactivatedQuests.includes(npcName);
    const chronik = state.hero.chronik && state.hero.chronik.some(c => c.giver === npcName);
    return accepted || delegated || chronik;
};

window.openQuestAcceptancePopup = function(npcName) {
    const questId = Object.keys(QUESTS_DATA).find(qId => QUESTS_DATA[qId].giver === npcName);
    if (!questId) {
        console.warn("No quest found for NPC:", npcName);
        return;
    }
    state.questAcceptancePopup = { active: true, npcName, questId };
    render();
};

window.closeQuestAcceptancePopup = function() {
    state.questAcceptancePopup = { active: false, npcName: '', questId: '' };
    render();
};

window.acceptQuest = function(npcName) {
    const questId = Object.keys(QUESTS_DATA).find(qId => QUESTS_DATA[qId].giver === npcName);
    if (!questId) return;
    const questDef = QUESTS_DATA[questId];
    
    if (!state.hero.quests) state.hero.quests = [];
    if (!state.hero.quests.some(q => q.id === questId)) {
        state.hero.quests.push({
            id: questId,
            name: questDef.title,
            title: questDef.title,
            giver: questDef.giver,
            currentStep: 'accepted',
            icon: questDef.img,
            description: questDef.dialogs.accepted.text,
            progress: '0%'
        });
        
        if (questDef.dialogs.accepted && typeof questDef.dialogs.accepted.onEnter === 'function') {
            try {
                questDef.dialogs.accepted.onEnter(state.hero);
            } catch(e) {
                console.error("Error in accepted onEnter handler:", e);
            }
        }
    }
    
    window.checkCampActiveReplacements();
    window.closeQuestAcceptancePopup();
    saveGame();
    render();
};

window.delegateQuest = function(npcName) {
    if (!state.hero.deactivatedQuests) state.hero.deactivatedQuests = [];
    if (!state.hero.deactivatedQuests.includes(npcName)) {
        state.hero.deactivatedQuests.push(npcName);
    }
    
    window.checkCampActiveReplacements();
    window.closeQuestAcceptancePopup();
    saveGame();
    render();
};

window.openQuestProgressPopup = function(questId) {
    state.questProgressPopup = { active: true, questId };
    render();
};

window.closeQuestProgressPopup = function() {
    state.questProgressPopup = { active: false, questId: '', currentStep: '' };
    render();
};

window.getQuestEnterRequirements = function(onEnterFn, hero) {
    if (!onEnterFn) return { items: [], ore: 0 };
    const str = onEnterFn.toString();
    const requirements = { items: [], ore: 0 };
    
    const itemRegex = /(?:window\.)?loseQuestItem\(\s*['"`]([^'"`]+)['"`]\s*(?:,\s*(\d+))?\s*\)/g;
    let match;
    while ((match = itemRegex.exec(str)) !== null) {
        const itemName = match[1];
        const count = match[2] ? parseInt(match[2], 10) : 1;
        requirements.items.push({ name: itemName, count });
    }
    
    const oreRegex = /(?:window\.)?loseOre\(\s*(\d+)\s*\)/g;
    while ((match = oreRegex.exec(str)) !== null) {
        const amount = parseInt(match[1], 10);
        requirements.ore += amount;
    }
    
    return requirements;
};

window.checkHeroMeetsRequirements = function(hero, reqs) {
    if (reqs.ore > 0 && (hero.ore || 0) < reqs.ore) {
        return { success: false, reason: 'Erz', missing: `${reqs.ore} Erz` };
    }
    
    for (const reqItem of reqs.items) {
        const totalOwned = hero.inventory
            .filter(i => i.name.toLowerCase() === reqItem.name.toLowerCase())
            .reduce((sum, i) => sum + (i.count || 1), 0);
        
        if (totalOwned < reqItem.count) {
            return { success: false, reason: 'Item', missing: reqItem.name };
        }
    }
    
    return { success: true };
};

window.showMissingQuestRequirementsPopup = function(questId, missingName, currentStep) {
    const questDef = QUESTS_DATA[questId];
    
    const existing = document.getElementById('quest-warning-popup');
    if (existing) existing.remove();
    
    const popupHtml = `
        <div id="quest-warning-popup" class="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/90 backdrop-blur-sm" onclick="document.getElementById('quest-warning-popup').remove()"></div>
            <div class="wood-card w-full max-w-md p-8 relative shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-2 border-error/40 text-center flex flex-col gap-6 animate-fade-in">
                <span class="material-symbols-outlined text-5xl text-error animate-pulse">warning</span>
                <h3 class="font-headline text-2xl text-error italic">Besitzprüfung fehlgeschlagen</h3>
                <p class="text-on-surface leading-relaxed text-sm">
                    Der Gegenstand bzw. das Erz <b>"${missingName}"</b> befindet sich nicht mehr in deinem Besitz!
                </p>
                <div class="flex flex-col sm:flex-row gap-4 mt-2">
                    <button onclick="document.getElementById('quest-warning-popup').remove(); window.completeQuestWithOption('${questId}', '${currentStep}', 'Fehlgeschlagen')" 
                            class="flex-1 bg-error/20 hover:bg-error text-error hover:text-on-error border border-error/40 py-3 font-bold uppercase text-xs transition-all rounded-sm shadow-md">
                        Quest abbrechen
                    </button>
                    <button onclick="document.getElementById('quest-warning-popup').remove()" 
                            class="flex-1 bg-secondary text-on-secondary py-3 font-bold uppercase text-xs transition-all shadow-md">
                        Später beschaffen
                    </button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('app-content').insertAdjacentHTML('beforeend', popupHtml);
};

window.progressQuestToNext = function(questId, nextStepKey) {
    const heroQuest = state.hero.quests.find(q => q.id === questId);
    if (!heroQuest) return;
    const questDef = QUESTS_DATA[questId];
    
    const newStep = nextStepKey || 'accepted';
    const stepData = questDef.dialogs[newStep];
    
    if (stepData && typeof stepData.onEnter === 'function') {
        const reqs = window.getQuestEnterRequirements(stepData.onEnter, state.hero);
        const checkResult = window.checkHeroMeetsRequirements(state.hero, reqs);
        if (!checkResult.success) {
            window.showMissingQuestRequirementsPopup(questId, checkResult.missing, heroQuest.currentStep || 'accepted');
            return;
        }
    }
    
    heroQuest.currentStep = newStep;
    
    if (stepData) {
        heroQuest.description = stepData.text;
        if (stepData.progress) {
            heroQuest.progress = stepData.progress;
        }
        if (typeof stepData.onEnter === 'function') {
            try {
                stepData.onEnter(state.hero);
            } catch(e) {
                console.error("Error in step onEnter handler:", e);
            }
        }
    }
    
    saveGame();
    render();
};

window.selectQuestProgressOption = function(questId, optionStepKey) {
    window.progressQuestToNext(questId, optionStepKey);
};

window.completeQuestWithOption = function(questId, finalStepKey, status = 'Erfolgreich') {
    const heroQuestIdx = state.hero.quests.findIndex(q => q.id === questId);
    if (heroQuestIdx === -1) return;
    const heroQuest = state.hero.quests[heroQuestIdx];
    const questDef = QUESTS_DATA[questId];
    
    const stepData = questDef.dialogs[finalStepKey];
    
    if (status !== 'Fehlgeschlagen' && stepData && typeof stepData.onEnter === 'function') {
        const reqs = window.getQuestEnterRequirements(stepData.onEnter, state.hero);
        const checkResult = window.checkHeroMeetsRequirements(state.hero, reqs);
        if (!checkResult.success) {
            window.showMissingQuestRequirementsPopup(questId, checkResult.missing, heroQuest.currentStep || 'accepted');
            return;
        }
    }
    
    heroQuest.currentStep = finalStepKey;
    if (stepData && typeof stepData.onEnter === 'function') {
        try {
            stepData.onEnter(state.hero);
        } catch(e) {
            console.error("Error in final step onEnter handler:", e);
        }
    }
    
    state.hero.quests.splice(heroQuestIdx, 1);
    
    if (!state.hero.chronik) state.hero.chronik = [];
    state.hero.chronik.push({
        id: questId,
        name: questDef.title,
        title: questDef.title,
        giver: questDef.giver,
        status: status === 'Erfolgreich' ? 'ERFOLGREICH' : 'Fehlgeschlagen',
        icon: questDef.img,
        img: questDef.img,
        description: stepData ? stepData.text : `Quest abgeschlossen (${status}).`
    });
    
    window.checkCampActiveReplacements();
    window.closeQuestProgressPopup();
    saveGame();
    render();
};

window.failQuestWithOption = function(questId, finalStepKey) {
    window.completeQuestWithOption(questId, finalStepKey, 'Fehlgeschlagen');
};

// --- Action Handlers ---

function openTraderPopup(camp) {
    state.trading.popupCamp = camp;
    render();
}

function closeTraderPopup() {
    state.trading.popupCamp = null;
    render();
}

function selectTrader(name) {
    resetTrade(); // Ensure any pending items are returned to inventory
    state.trading.selectedTrader = name;
    state.trading.popupCamp = null;
    render();
}

function addToOffer(side, data) {
    if (side === 'hero') {
        const item = state.hero.inventory.find(i => i.id === data);
        if (item) {
            state.trading.heroOffer.push(item);
            state.hero.inventory = state.hero.inventory.filter(i => i.id !== data);
        }
    } else {
        state.trading.traderOffer.push(data);
    }
    render();
}

// --- New Trading Handlers ---

function resetTrade(isCompletion = false) {
    // Return items to inventory only if it's NOT a completion (i.e., it's a cancellation or trader change)
    if (!isCompletion && state.trading && state.trading.heroOffer) {
        state.trading.heroOffer.forEach(item => {
            if (item.id !== 'ore') {
                for (let i = 0; i < (item.count || 1); i++) {
                    state.hero.inventory.push({ ...item, count: 1, id: Date.now() + Math.random() });
                }
            }
        });
    }

    state.trading = {
        selectedTrader: null,
        popupCamp: null,
        heroOffer: [],
        traderOffer: [],
        inventoryPopup: { category: null, items: [] },
        quantityPopup: { item: null, amount: 1 },
        oreDiff: 0,
        oreSide: null
    };
    render();
}

function openTradeInventoryPopup(category) {
    state.trading.inventoryPopup.category = category;
    
    // Normalisierung: Kleinschreibung, Trimmen und Rüstungen-Fix
    const searchCat = (category || "").toLowerCase().trim();
    const targetCat = (searchCat === 'rüstungen') ? 'rüstung' : searchCat;
    
    console.log("Händler-Inventar Filter für:", targetCat);
    
    const items = state.hero.inventory.filter(i => {
        const itemCat = (i.category || "").toLowerCase().trim();
        return itemCat === targetCat;
    });
    
    console.log("Items gefunden:", items.length);
    
    const grouped = [];
    
    items.forEach(item => {
        if (!item.image) item.image = getItemImage(item.name, item.category);
        const existing = grouped.find(g => g.name === item.name);
        if (existing) {
            existing.count++;
        } else {
            grouped.push({ ...item, count: 1 });
        }
    });
    
    state.trading.inventoryPopup.items = grouped;
    render();
}

function closeTradeInventoryPopup() {
    state.trading.inventoryPopup.category = null;
    state.trading.inventoryPopup.items = [];
    render();
}

function initiateSell(name) {
    const item = state.trading.inventoryPopup.items.find(i => i.name === name);
    if (item.count > 1) {
        state.trading.quantityPopup = { item: { ...item }, amount: 1 };
        render();
    } else {
        // Single item, move directly
        moveItemToOffer('hero', item, 1);
        openTradeInventoryPopup(state.trading.inventoryPopup.category); // Refresh list but don't close
    }
}

function adjustQuantity(val) {
    const qp = state.trading.quantityPopup;
    const newAmount = qp.amount + val;
    if (newAmount >= 1 && newAmount <= qp.item.count) {
        qp.amount = newAmount;
        render();
    }
}

function cancelQuantity() {
    state.trading.quantityPopup = { item: null, amount: 1 };
    render();
}

function confirmQuantity() {
    const qp = state.trading.quantityPopup;
    if (qp.isScrollChargePurchase) {
        const finalValue = qp.item.value * qp.amount;
        const newItem = {
            ...qp.item,
            value: finalValue,
            baseValue: qp.item.value,
            count: 1,
            currentCharges: qp.amount,
            maxCapacity: qp.amount,
            id: Date.now()
        };
        state.trading.traderOffer.push(newItem);
    } else {
        moveItemToOffer('hero', qp.item, qp.amount);
    }
    state.trading.quantityPopup = { item: null, amount: 1 };
    if (state.trading.inventoryPopup.category) {
        openTradeInventoryPopup(state.trading.inventoryPopup.category);
    } else {
        render();
    }
}

function moveItemToOffer(side, itemTemplate, amount) {
    if (side === 'hero') {
        // Find actual items in inventory to remove
        let removedCount = 0;
        const remainingInventory = [];
        state.hero.inventory.forEach(i => {
            if (i.name === itemTemplate.name && removedCount < amount) {
                removedCount++;
            } else {
                remainingInventory.push(i);
            }
        });
        state.hero.inventory = remainingInventory;
        
        // Add to offer (grouped)
        const existing = state.trading.heroOffer.find(o => o.name === itemTemplate.name && o.id !== 'ore');
        if (existing) {
            existing.count += amount;
        } else {
            state.trading.heroOffer.push({ ...itemTemplate, count: amount, id: Date.now() });
        }
    }
    render();
}

function addToTradeOffer(side, data) {
    if (side === 'trader') {
        const isScroll = data.art === 'Spruchrolle' || (data.category === 'Magie' && data.name.toLowerCase().includes('spruchrolle'));
        if (isScroll) {
            state.trading.quantityPopup = { 
                item: { ...data, count: 99 }, 
                amount: 1, 
                isScrollChargePurchase: true 
            };
            render();
            return;
        }
        const existing = state.trading.traderOffer.find(o => o.name === data.name && o.id !== 'ore');
        if (existing) {
            existing.count = (existing.count || 1) + 1;
        } else {
            state.trading.traderOffer.push({ ...data, count: 1, id: Date.now() });
        }
    }
    render();
}

function removeFromTradeOffer(side, index) {
    const offer = (side === 'hero') ? state.trading.heroOffer : state.trading.traderOffer;
    const item = offer[index];
    
    if (item.id === 'ore') {
        offer.splice(index, 1);
    } else {
        if (side === 'hero') {
            // Return to inventory
            for (let i = 0; i < (item.count || 1); i++) {
                state.hero.inventory.push({ ...item, count: 1, id: Date.now() + i });
            }
        }
        offer.splice(index, 1);
    }
    render();
}

function equalizeOre() {
    const heroValue = state.trading.heroOffer.reduce((sum, i) => {
        if (i.id === 'ore') return sum + (i.value * (i.count || 1));
        const val = (i.category === 'Nahrung') ? i.value : Math.ceil(i.value / 2);
        return sum + (val * (i.count || 1));
    }, 0);
    
    const traderValue = state.trading.traderOffer.reduce((sum, i) => sum + (i.value * (i.count || 1)), 0);
    
    const diff = Math.abs(heroValue - traderValue);
    if (diff === 0) return;

    // Remove existing ore from both sides first
    state.trading.heroOffer = state.trading.heroOffer.filter(i => i.id !== 'ore');
    state.trading.traderOffer = state.trading.traderOffer.filter(i => i.id !== 'ore');

    const oreItem = {
        id: 'ore',
        name: 'Erz',
        value: 1,
        count: diff,
        image: `${basePath}/MagsichesErz.webp`,
        icon: 'diamond'
    };

    if (heroValue < traderValue) {
        state.trading.heroOffer.push(oreItem);
    } else {
        state.trading.traderOffer.push(oreItem);
    }
    render();
}


function confirmTrade() {
    if (!state.trading.selectedTrader) return; // Verhindert Doppelklicks
    
    console.log("Handel wird abgeschlossen...");
    console.log("Inventar vorher:", state.hero.inventory.length);
    
    const tr = state.trading;
    const itemsToAdd = [...tr.traderOffer]; 
    console.log(itemsToAdd.length + " Gegenstände aus Händler-Angebot erkannt.");
    
    // Add trader offer items to hero inventory
    itemsToAdd.forEach(item => {
        if (item.id === 'ore') {
            let finalCount = item.count || 0;
            const questCompleted = state.hero.quests && !state.hero.quests.some(q => q.id === 'hero_quest');
            if (state.hero.name === 'Nathan der Reiche' && questCompleted) {
                const hasFood = tr.heroOffer.some(i => i.category === 'Nahrung' || i.category === 'Nahrungsmilch') ||
                                tr.traderOffer.some(i => i.category === 'Nahrung' || i.category === 'Nahrungsmilch');
                if (!hasFood) {
                    finalCount *= 2;
                }
            }
            state.hero.ore += finalCount;
            console.log("Erz hinzugefügt:", finalCount);
        } else {
            const count = item.count || 1;
            for (let i = 0; i < count; i++) {
                const newItem = { 
                    ...item, 
                    count: 1, 
                    id: Date.now() + Math.random() + i 
                };
                fixItemImage(newItem);
                state.hero.inventory.push(newItem);
                console.log("Item hinzugefügt:", newItem.name);
            }
        }
    });

    // Handle hero offer ore (if hero paid with ore)
    const heroOrePayment = tr.heroOffer.find(i => i.id === 'ore');
    if (heroOrePayment) {
        state.hero.ore -= heroOrePayment.count;
        console.log("Erz abgezogen (Zahlung):", heroOrePayment.count);
    }

    console.log("Inventar nachher (Zahl):", state.hero.inventory.length);
    console.log("INHALT DES BEUTELS NACH HANDEL:");
    console.table(state.hero.inventory.slice(-10)); // Zeige die letzten 10 Items
    
    resetTrade(true); 
    state.currentScreen = 'beutel'; 
    render(); 
    saveGame(); 
    
    console.log("Handel abgeschlossen um " + new Date().toLocaleTimeString());
}

function removeFromOffer(side, indexOrId) {
    if (side === 'hero') {
        const item = state.trading.heroOffer.find(i => i.id === indexOrId);
        if (item) {
            state.hero.inventory.push(item);
            state.trading.heroOffer = state.trading.heroOffer.filter(i => i.id !== indexOrId);
        }
    } else {
        state.trading.traderOffer.splice(indexOrId, 1);
    }
    render();
}

// --- Inventory Handlers ---

function openInventoryCategory(category) {
    state.inventoryPopup.category = category;
    
    // Normalisierung: Kleinschreibung, Trimmen und Rüstungen-Fix
    const searchCat = (category || "").toLowerCase().trim();
    const targetCat = (searchCat === 'rüstungen') ? 'rüstung' : searchCat;
    
    console.log("Beutel Filter für:", targetCat);
    
    const items = state.hero.inventory.filter(i => {
        const itemCat = (i.category || "").toLowerCase().trim();
        return itemCat === targetCat;
    });
    
    console.log("Items gefunden:", items.length);
    const grouped = [];
    
    items.forEach(item => {
        // Ensure item has an image if it's missing
        if (!item.image) {
            item.image = getItemImage(item.name, item.category);
        }

        const existing = grouped.find(g => g.name === item.name);
        if (existing) {
            existing.count++;
        } else {
            grouped.push({ ...item, count: 1 });
        }
    });
    
    state.inventoryPopup.items = grouped;
    render();
}

function getItemImage(name, category) {
    const basePath = "Bilder Karten";
    
    // Normalize name for searching
    const normName = name.toLowerCase().replace(/[-`']/g, ' ');
    
    // First, try to find in QUEST_ITEMS_DB
    if (typeof QUEST_ITEMS_DB !== 'undefined') {
        const questItem = Object.values(QUEST_ITEMS_DB).find(i => i.name.toLowerCase().replace(/[-`']/g, ' ') === normName);
        if (questItem && questItem.image) return questItem.image;
    }
    
    // Second, try to find it in the item pools to get the precise path (with chapter)
    const allPools = Object.values(itemPools).flat();
    const poolItem = allPools.find(i => i.name.toLowerCase().replace(/[-`']/g, ' ') === normName);
    if (poolItem && poolItem.image) return poolItem.image;

    // Fallback logic if not in pools
    const fileName = name.replace(/-/g, ' ');
    let path = "";
    if (category === "Waffen") path = `${basePath}/Waffen/Kapitel 1/${fileName}.png`;
    else if (category === "Rüstung") path = `${basePath}/Rüstungen/Kapitel 1 & 2/${fileName}.png`;
    else if (category === "Magie") path = `${basePath}/Magie/Kapitel 1/${fileName}.png`;
    else if (category === "Nahrung") path = `${basePath}/Nahrung/${fileName}.png`;
    else if (category === "Ausrüstung") path = `${basePath}/Ausrüstung/Kapitel 1 & 2/${fileName}.png`;
    
    return path || null;
}

function closeInventoryPopup() {
    state.inventoryPopup.category = null;
    state.inventoryPopup.items = [];
    render();
}

function zoomImage(imagePath) {
    if (!imagePath) return;
    state.zoomImage = imagePath;
    render();
}

function closeZoom() {
    state.zoomImage = null;
    render();
}

function openTalentModal(name, level) {
    const talent = state.hero.talents.find(t => t.name === name);
    if (document.getElementById('modal-talent-name')) document.getElementById('modal-talent-name').innerText = name;
    if (document.getElementById('modal-talent-level')) document.getElementById('modal-talent-level').innerText = `STUFE ${level}`;
    if (document.getElementById('modal-talent-explanation')) document.getElementById('modal-talent-explanation').innerText = `Ermöglicht den Einsatz von ${name} auf Stufe ${level}. Erhöht deine Effektivität in diesem Bereich deutlich.`;
    if (document.getElementById('talent-modal')) document.getElementById('talent-modal').classList.remove('hidden');
    
    if (document.getElementById('modal-confirm-btn')) {
        document.getElementById('modal-confirm-btn').onclick = () => {
            if (state.hero.lp >= 1) {
                state.hero.lp -= 1;
                talent.level = level;
                closeTalentModal();
                render();
                alert(`${name} auf Stufe ${level} gelernt!`);
            } else {
                alert('Nicht genügend Lernpunkte!');
            }
        };
    }
}

function closeTalentModal() {
    if (document.getElementById('talent-modal')) document.getElementById('talent-modal').classList.add('hidden');
}

function sellItem(itemId) {
    const index = state.hero.inventory.findIndex(i => i.id === itemId);
    if (index !== -1) {
        state.hero.ore += state.hero.inventory[index].value;
        state.hero.inventory.splice(index, 1);
        render();
        saveGame();
    }
}

// --- Finden & Verlieren Logic ---

function openFindingCategory(category) {
    state.findingPopup.category = category;
    const poolKey = category.toLowerCase().replace('ü', 'ue');
    let items = itemPools[poolKey] || [];
    
    // Filter by chapter
    items = items.filter(item => {
        if (!item.chapter) return true;
        if (typeof item.chapter === 'string' && item.chapter.includes('&')) {
            const chapters = item.chapter.split('&').map(c => parseInt(c.trim()));
            return chapters.some(c => c <= state.hero.chapter);
        }
        return parseInt(item.chapter) <= state.hero.chapter;
    });

    // Sort alphabetically
    items.sort((a, b) => a.name.localeCompare(b.name));
    
    state.findingPopup.items = items;
    render();
}

function closeFindingPopup() {
    state.findingPopup.category = null;
    state.findingPopup.items = [];
    render();
}

function openLosingCategory(category) {
    state.losingPopup.category = category;
    
    const searchCat = (category || "").toLowerCase().trim();
    const targetCat = (searchCat === 'rüstungen') ? 'rüstung' : searchCat;
    
    const items = state.hero.inventory.filter(i => {
        const itemCat = (i.category || "").toLowerCase().trim();
        return itemCat === targetCat;
    });
    
    const grouped = [];
    items.forEach(item => {
        const existing = grouped.find(g => g.name === item.name);
        if (existing) {
            existing.count++;
        } else {
            grouped.push({ ...item, count: 1 });
        }
    });

    // Sort alphabetically
    grouped.sort((a, b) => a.name.localeCompare(b.name));
    
    state.losingPopup.items = grouped;
    render();
}

function closeLosingPopup() {
    state.losingPopup.category = null;
    state.losingPopup.items = [];
    render();
}

function initiateFind(name) {
    const item = state.findingPopup.items.find(i => i.name === name);
    if (item) {
        state.findingQuantityPopup = { item: { ...item }, amount: 1 };
        render();
    }
}

function adjustFindingQuantity(val) {
    const qp = state.findingQuantityPopup;
    const newAmount = qp.amount + val;
    if (newAmount >= 1) { // No max limit as requested
        qp.amount = newAmount;
        render();
    }
}

function cancelFindingQuantity() {
    state.findingQuantityPopup = { item: null, amount: 1 };
    render();
}

function confirmFindingQuantity() {
    const qp = state.findingQuantityPopup;
    const item = qp.item;
    const amount = qp.amount;

    const isScroll = item.art === 'Spruchrolle' || (item.category === 'Magie' && item.name.toLowerCase().includes('spruchrolle'));
    if (isScroll) {
        const newItem = { 
            ...item, 
            currentCharges: amount,
            maxCapacity: amount,
            id: Date.now() + Math.random()
        };
        fixItemImage(newItem);
        state.hero.inventory.push(newItem);
    } else {
        for (let i = 0; i < amount; i++) {
            const newItem = { 
                ...item, 
                id: Date.now() + Math.random() + i 
            };
            fixItemImage(newItem);
            state.hero.inventory.push(newItem);
        }
    }
    
    state.findingQuantityPopup = { item: null, amount: 1 };
    render();
    saveGame();
}

function initiateRemove(name) {
    const item = state.losingPopup.items.find(i => i.name === name);
    if (item) {
        if (item.count > 1) {
            state.losingQuantityPopup = { item: { ...item }, amount: 1 };
        } else {
            // Only one, remove directly
            removeItemsFromInventory(item.name, 1);
            openLosingCategory(state.losingPopup.category); // Refresh
        }
        render();
    }
}

function adjustLosingQuantity(val) {
    const qp = state.losingQuantityPopup;
    const newAmount = qp.amount + val;
    if (newAmount >= 1 && newAmount <= qp.item.count) {
        qp.amount = newAmount;
        render();
    }
}

function cancelLosingQuantity() {
    state.losingQuantityPopup = { item: null, amount: 1 };
    render();
}

function confirmLosingQuantity() {
    const qp = state.losingQuantityPopup;
    removeItemsFromInventory(qp.item.name, qp.amount);
    state.losingQuantityPopup = { item: null, amount: 1 };
    openLosingCategory(state.losingPopup.category); // Refresh
    render();
    saveGame();
}

function removeItemsFromInventory(name, amount) {
    let removedCount = 0;
    const remainingInventory = [];
    state.hero.inventory.forEach(i => {
        if (i.name === name && removedCount < amount) {
            removedCount++;
        } else {
            remainingInventory.push(i);
        }
    });
    state.hero.inventory = remainingInventory;
}

function buyItem(name, price) {
    if (state.hero.ore >= price) {
        state.hero.ore -= price;
        state.hero.inventory.push({
            id: Date.now(),
            name: name,
            category: "Gekauft",
            value: Math.floor(price * 0.5),
            detail: "Händlerware",
            icon: "shopping_bag",
            description: "Ein beim Händler erworbener Gegenstand."
        });
        render();
        alert(`${name} gekauft!`);
    } else {
        alert('Nicht genügend Erz!');
    }
}

function lootItem(name, category, icon, value, image) {
    const newItem = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        name: name,
        category: category,
        value: value || 10,
        detail: category === 'Waffen' ? 'Kampfbereit' : 'Gebrauchsgegenstand',
        icon: icon || 'inventory_2',
        image: image || null,
        description: `Ein Gegenstand aus der Welt von Stitch.`
    };
    state.hero.inventory.push(newItem);
    render();
}

function loseItem(itemId) {
    state.hero.inventory = state.hero.inventory.filter(i => i.id !== itemId);
    render();
}

// Initial Render
function openResourcePopup(type) {
    state.resourcePopup.type = type;
    render();
}

function closeResourcePopup() {
    state.resourcePopup.type = null;
    render();
}

function confirmResourceAdjustment() {
    const input = document.getElementById('resource-amount');
    const amount = parseInt(input.value);
    if (!isNaN(amount) && amount > 0) {
        if (state.resourcePopup.type === 'ore_add') {
            let finalAmount = amount;
            const questCompleted = state.hero.quests && !state.hero.quests.some(q => q.id === 'hero_quest');
            if (state.hero.name === 'Nathan der Reiche' && questCompleted) {
                finalAmount *= 2;
            }
            state.hero.ore += finalAmount;
        } else if (state.resourcePopup.type === 'ore_sub') {
            state.hero.ore = Math.max(0, state.hero.ore - amount);
        } else if (state.resourcePopup.type === 'xp_add') {
            window.gainXp(amount);
        }
    }
    closeResourcePopup();
    saveGame();
}

window.toggleXpPause = function() {
    state.hero.xpPaused = !state.hero.xpPaused;
    saveGame();
    render();
};

window.gainXp = function(amount) {
    if (state.hero.xpPaused) {
        console.log("XP-Zuwachs ist pausiert. Keine XP hinzugewonnen.");
        return;
    }
    state.hero.xp.current += amount;
    checkLevelUp();
};

function checkLevelUp() {
    const hero = state.hero;
    while (hero.xp.current >= hero.xp.next) {
        hero.xp.current -= hero.xp.next;
        hero.level++;
        hero.xp.next += 100;
        // Manfred bekommt +4 HP pro Level NUR wenn seine hero_quest abgeschlossen ist
        const manfredQuestDone = hero.quests && !hero.quests.some(q => q.id === 'hero_quest');
        if (hero.name === 'Manfred der Stämmige' && manfredQuestDone) {
            hero.hp.max += 4;
        } else {
            hero.hp.max += 2;
        }
        hero.hp.current = window.getTotalMaxHp();
        hero.lp += 2;
        console.log(`LEVEL UP! Level ${hero.level} erreicht.`);
    }
}

function openTalentInfo(id) {
    // Store the live talent object (includes current level for desc lookup)
    state.talentInfo = state.hero.talents.find(t => t.id === id) || null;
    render();
}

function closeTalentInfo() {
    state.talentInfo = null;
    render();
}

function upgradeTalent(id) {
    const hero = state.hero;
    const talent = hero.talents.find(t => t.id === id);
    if (!talent || talent.level >= talent.max) return;

    let lpCost = 0;
    let oreCost = 0;

    if (id === 'magie') {
        lpCost = 1;
        oreCost = (talent.level + 1) * 50;
    } else if (id === 'schloss') {
        lpCost = 1;
        oreCost = (talent.level + 1) * 50;
    } else {
        lpCost = talent.level === 0 ? 2 : 3;
        oreCost = talent.level === 0 ? 100 : 300;
    }

    if (hero.lp >= lpCost && hero.ore >= oreCost) {
        hero.lp -= lpCost;
        hero.ore -= oreCost;
        talent.level++;
        render();
        saveGame();
        alert(`${talent.name} auf Stufe ${talent.level} verbessert!`);
    } else {
        alert("Nicht genügend Ressourcen!");
    }
}

function upgradeStat(stat) {
    const hero = state.hero;
    if (stat === 'mana') {
        const cost = 10;
        if (hero.lp >= 1 && hero.ore >= cost) {
            hero.attributes.mana += 5;
            if (hero.manaCurrent !== undefined) hero.manaCurrent += 5;
            hero.lp--;
            hero.ore -= cost;
        }
    } else {
        const cost = hero.attributes[stat] * 10;
        if (hero.lp >= 1 && hero.ore >= cost) {
            hero.attributes[stat]++;
            hero.lp--;
            hero.ore -= cost;
        }
    }
    render();
    saveGame();
}

window.confirmResetTalent = function(id) {
    const existing = document.getElementById('reset-talent-popup');
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.id = 'reset-talent-popup';
    popup.className = 'fixed inset-0 z-[150] flex items-center justify-center p-4';
    popup.innerHTML = `
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="document.getElementById('reset-talent-popup').remove()"></div>
        <div class="wood-card w-full max-w-sm p-8 relative shadow-2xl border-2 border-primary/40 text-center animate-fade-in">
            <span class="material-symbols-outlined text-5xl text-primary mb-4 block">history</span>
            <h3 class="font-headline text-2xl text-primary mb-4 italic text-center uppercase tracking-wider">Talent zurücksetzen</h3>
            <p class="text-on-surface leading-relaxed mb-6 text-sm">
                Bist du sicher, dass du eine Talente zurücksetzen möchtest?
            </p>
            <div class="flex gap-4">
                <button onclick="const el = document.getElementById('reset-talent-popup'); if (el) el.remove(); window.executeResetTalent('${id}');" class="flex-1 bg-primary text-on-primary py-3 font-bold uppercase text-xs transition-all hover:brightness-110 shadow-lg">Ja</button>
                <button onclick="document.getElementById('reset-talent-popup').remove()" class="flex-1 bg-surface-container-high border border-outline-variant/30 text-on-surface py-3 font-bold uppercase text-xs transition-all hover:bg-surface-container-highest">Nein</button>
            </div>
        </div>
    `;
    (document.getElementById('app-content') || document.body).appendChild(popup);
};

window.executeResetTalent = function(id) {
    const hero = state.hero;
    const talent = hero.talents.find(t => t.id === id);
    if (!talent || talent.level === 0) return;

    let refundedLp = 0;
    let refundedOre = 0;

    for (let lvl = 0; lvl < talent.level; lvl++) {
        if (id === 'magie') {
            refundedLp += 1;
            const questCompleted = hero.quests && !hero.quests.some(q => q.id === 'hero_quest');
            if (hero.name === 'Ludwig der Präsente' && questCompleted) {
                refundedOre += 0;
            } else {
                refundedOre += (lvl + 1) * 50;
            }
        } else if (id === 'schloss') {
            refundedLp += 1;
            refundedOre += (lvl + 1) * 50;
        } else {
            refundedLp += lvl === 0 ? 2 : 3;
            refundedOre += lvl === 0 ? 100 : 300;
        }
    }

    // Refund resources
    hero.lp += refundedLp;
    hero.ore += refundedOre;
    talent.level = 0;

    // Save and render
    saveGame();
    render();

    alert(`${talent.name} wurde zurückgesetzt! Erhalten: ${refundedLp} LP und ${refundedOre} Erz.`);
};

window.getAuraBonus = function(statName) {
    let bonus = 0;
    const eq = state.hero.equipment;
    if (!eq) return 0;
    let items = [eq.melee, eq.ranged, eq.armor, eq.artifacts?.amulet, eq.artifacts?.ring1, eq.artifacts?.ring2].filter(Boolean);
    if (eq.artifacts && eq.artifacts.others) {
        items = items.concat(eq.artifacts.others);
    }
    items.forEach(item => {
        const effectText = (item.effect || '') + ' ' + (item.ability || '');
        if (effectText.toLowerCase().includes('aura')) {
            const regex = new RegExp(`\\+\\s*(\\d+)\\s*${statName}\\b`, 'i');
            const match = effectText.match(regex);
            if (match && match[1]) {
                bonus += parseInt(match[1]);
            }
        }
    });
    return bonus;
};

window.getTotalMaxHp = function() {
    if (!state.hero) return 10;
    let base = state.hero.hp.max;
    let bonus = window.getAuraBonus('Leben') + window.getAuraBonus('Lebenspunkte');
    return base + bonus;
};

window.syncAuraHp = function() {
    if (!state || !state.hero) return;
    const currentMaxHp = window.getTotalMaxHp();
    const lastMax = state.hero.lastKnownMaxHp !== undefined ? state.hero.lastKnownMaxHp : currentMaxHp;
    if (currentMaxHp !== lastMax) {
        const diff = currentMaxHp - lastMax;
        state.hero.hp.current = Math.min(currentMaxHp, Math.max(1, state.hero.hp.current + diff));
        state.hero.lastKnownMaxHp = currentMaxHp;
    } else {
        state.hero.lastKnownMaxHp = currentMaxHp;
    }
    if (state.hero.hp.current > currentMaxHp) {
        state.hero.hp.current = currentMaxHp;
    }
};

window.endHeroTurn = function() {
    const sim = state.combatSimulator;
    if (!sim) return;
    
    // Magic Circle 3 & 5 mana regeneration
    const magieLvl = sim.hero.talents?.magie || 0;
    if (magieLvl >= 3 && sim.hero.remainingMov > 0) {
        let regenPerPoint = 1;
        if (magieLvl >= 5) regenPerPoint = 3;
        const regen = sim.hero.remainingMov * regenPerPoint;
        const oldMana = sim.hero.mana || 0;
        sim.hero.mana = Math.min(sim.hero.maxMana, oldMana + regen);
        state.hero.manaCurrent = Math.min(window.getTotalStat('mana'), (state.hero.manaCurrent || 0) + regen);
        sim.log.unshift(`🔮 Kreis ${magieLvl} Passiv: ${sim.hero.mana - oldMana} Mana regeneriert (${sim.hero.remainingMov} ungenutzte BWG).`);
    }
    
    sim.turn = 'enemy';
    render();
};

window.applySpellPushEffect = function(spell, chargeLevel = 1) {
    const sim = state.combatSimulator;
    if (!sim || !spell || !spell.effect) return;
    
    let pushDist = 0;
    const eff = spell.effect.toLowerCase();
    if (eff.includes('schleudern')) {
        let baseDist = 2;
        const match = eff.match(/schleudern\s*(\d+)/);
        if (match && match[1]) {
            baseDist = parseInt(match[1]);
        } else if (eff.includes('wuchtschleudern')) {
            baseDist = 4;
        }
        pushDist = baseDist * chargeLevel;
    }
    
    if (pushDist > 0) {
        const dr = sim.enemy.pos.r - sim.hero.pos.r;
        const dc = sim.enemy.pos.c - sim.hero.pos.c;
        if (dr !== 0 || dc !== 0) {
            const stepR = dr === 0 ? 0 : (dr > 0 ? 1 : -1);
            const stepC = dc === 0 ? 0 : (dc > 0 ? 1 : -1);
            let targetR = sim.enemy.pos.r + stepR * pushDist;
            let targetC = sim.enemy.pos.c + stepC * pushDist;
            targetR = Math.max(0, Math.min(14, targetR));
            targetC = Math.max(0, Math.min(14, targetC));
            sim.enemy.pos.r = targetR;
            sim.enemy.pos.c = targetC;
            sim.log.unshift(`🌪️ Wind-Effekt: Gegner wurde um ${pushDist} Felder weggeschleudert!`);
        }
    }
};

window.getAbilityValues = function(abilitiesStr, name) {
    if (!abilitiesStr) return null;
    const regex = new RegExp(name + '\\s*(\\d+)(?:\\s*[/|\\s]\\s*(\\d+))?', 'i');
    const match = abilitiesStr.match(regex);
    if (match) {
        return {
            x: parseInt(match[1]),
            y: match[2] ? parseInt(match[2]) : null
        };
    }
    return null;
};

window.getTotalStat = function(stat) {
    if (state.hero.manaCurrent === undefined) {
        state.hero.manaCurrent = state.hero.attributes.mana || 5;
    }
    let base = stat === 'armor' ? 0 : (state.hero.attributes[stat] || 0);
    let statNames = [];
    if (stat === 'str') statNames = ['Stärke'];
    if (stat === 'dex') statNames = ['Geschick', 'Geschicklichkeit'];
    if (stat === 'mana') statNames = ['Mana', 'maximale Mana'];
    if (stat === 'mov') statNames = ['Bewegung'];
    if (stat === 'armor') statNames = ['Rüstung'];
    
    let bonus = 0;
    statNames.forEach(name => bonus += window.getAuraBonus(name));
    
    let val = base + bonus;
    if (stat === 'mov') {
        const questCompleted = state.hero.quests && !state.hero.quests.some(q => q.id === 'hero_quest');
        if (state.hero.name === 'Manfred der Stämmige' && questCompleted) {
            val -= 2;
        }
        if (state.hero.name === 'Ingo der Flotte' && questCompleted) {
            val += 2;
        }
        val = Math.max(1, val);
    }
    return val;
};

window.calculateTotalArmor = function() {
    return window.getTotalStat('armor');
};

window.handleConsumeItem = function(itemName) {
    const hero = state.hero;
    const item = hero.inventory.find(i => i.name === itemName);
    if (!item) return;

    const popupHtml = `
        <div id="consume-popup" class="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="document.getElementById('consume-popup').remove()"></div>
            <div class="wood-card w-full max-w-sm p-8 relative shadow-2xl border-2 border-secondary/30 text-center">
                <h3 class="font-headline text-2xl text-primary mb-4">Gegenstand nehmen</h3>
                <p class="text-on-surface mb-8">Möchtest du <b>${item.name}</b> wirklich verwenden?</p>
                <div class="flex gap-4">
                    <button onclick="document.getElementById('consume-popup').remove()" class="flex-1 bg-surface-container-high py-3 font-bold uppercase text-xs">Abbrechen</button>
                    <button onclick="executeConsume('${item.name.replace(/'/g, "\\'")}'); const _cp=document.getElementById('consume-popup'); if(_cp) _cp.remove();" class="flex-1 bg-secondary text-on-secondary py-3 font-bold uppercase text-xs shadow-lg">Ja, nehmen</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('app-content').insertAdjacentHTML('beforeend', popupHtml);
};

window.executeConsume = function(itemName) {
    const hero = state.hero;
    const invIndex = hero.inventory.findIndex(i => i.name === itemName);
    if (invIndex === -1) return;

    let targetSelectionRequired = false;
    let targets = [];

    if (itemName.toLowerCase() === 'starke bogensehne') {
        targets = hero.inventory.filter(i => i.art === 'Bogen' || i.style === 'Fernkampf');
        targetSelectionRequired = true;
    } else if (itemName.toLowerCase() === 'wetzstein') {
        targets = hero.inventory.filter(i => i.type === 'Klingenwaffe');
        targetSelectionRequired = true;
    } else if (itemName.toLowerCase() === 'zielfernrohr') {
        targets = hero.inventory.filter(i => i.art === 'Armbrust');
        targetSelectionRequired = true;
    }

    if (targetSelectionRequired) {
        const popupHtml = `
            <div id="target-popup" class="fixed inset-0 z-[130] flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="document.getElementById('target-popup').remove()"></div>
                <div class="wood-card w-full max-w-md p-8 relative shadow-2xl border-2 border-secondary/30">
                    <h3 class="font-headline text-xl text-primary mb-4 italic text-center">Wähle einen Gegenstand</h3>
                    <div class="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        ${targets.map(t => `
                            <button onclick="applyTargetConsume('${itemName.replace(/'/g, "\\'")}', '${t.id || t.name.replace(/'/g, "\\'")}'); document.getElementById('target-popup').remove(); render();" 
                                    class="w-full text-left p-4 border border-outline-variant/30 bg-surface-container hover:border-secondary transition-all">
                                <span class="font-bold text-sm block">${t.name}</span>
                                <span class="text-[10px] text-on-surface-variant">Schaden: ${t.damage || '?'}</span>
                            </button>
                        `).join('')}
                    </div>
                    <button onclick="document.getElementById('target-popup').remove()" class="w-full bg-surface-container-high py-3 font-bold uppercase text-xs">Abbrechen</button>
                </div>
            </div>
        `;
        document.getElementById('app-content').insertAdjacentHTML('beforeend', popupHtml);
        return; 
    }

    window.applyConsumeEffects(itemName);
    
    // Consume item
    if (hero.inventory[invIndex].count > 1) {
        hero.inventory[invIndex].count--;
    } else {
        hero.inventory.splice(invIndex, 1);
    }
    saveGame();
    render();
};

window.applyTargetConsume = function(consumeName, targetId) {
    const hero = state.hero;
    const target = hero.inventory.find(i => (i.id == targetId || i.name == targetId));
    if (!target) return;

    if (consumeName.toLowerCase() === 'starke bogensehne' || consumeName.toLowerCase() === 'wetzstein' || consumeName.toLowerCase() === 'zielfernrohr') {
        target.damage = (parseInt(target.damage) || 0) + 1;
    }

    const invIndex = hero.inventory.findIndex(i => i.name.toLowerCase() === consumeName.toLowerCase());
    if (invIndex !== -1) {
        if (hero.inventory[invIndex].count > 1) {
            hero.inventory[invIndex].count--;
        } else {
            hero.inventory.splice(invIndex, 1);
        }
    }
    saveGame();
};

window.applyConsumeEffects = function(itemName) {
    const hero = state.hero;
    if (hero.manaCurrent === undefined) hero.manaCurrent = window.getTotalStat('mana');

    switch(itemName) {
        case 'Waldbeere': hero.hp.current = Math.min(window.getTotalMaxHp(), hero.hp.current + 1); break;
        case 'Heilkraut': hero.hp.current = Math.min(window.getTotalMaxHp(), hero.hp.current + 2); break;
        case 'Seraphis': hero.hp.current = Math.min(window.getTotalMaxHp(), hero.hp.current + 3); break;
        case 'Schinken': hero.hp.current = Math.min(window.getTotalMaxHp(), hero.hp.current + 4); break;
        case 'Orkblatt': hero.hp.current = Math.min(window.getTotalMaxHp(), hero.hp.current + 5); break;
        case 'Heiltrank klein': hero.hp.current = Math.min(window.getTotalMaxHp(), hero.hp.current + 8); break;
        
        case 'Turmeichensamen': hero.manaCurrent = Math.min(window.getTotalStat('mana'), hero.manaCurrent + 5); break;
        case 'Rabenkraut': hero.manaCurrent = Math.min(window.getTotalStat('mana'), hero.manaCurrent + 10); break;
        case 'Dunkelkraut': hero.manaCurrent = Math.min(window.getTotalStat('mana'), hero.manaCurrent + 15); break;
        case 'Drachenwurzel': hero.manaCurrent = Math.min(window.getTotalStat('mana'), hero.manaCurrent + 20); break;
        case 'kleine Essenz der Magie': 
        case 'Kleine Essenz der Magie': hero.manaCurrent = Math.min(window.getTotalStat('mana'), hero.manaCurrent + 30); break;

        case 'Schwarzer Weiser':
            hero.attributes.mana += 1;
            hero.manaCurrent = Math.min(window.getTotalStat('mana'), hero.manaCurrent + 1);
            break;

        case 'Ration Traumruf':
            hero.attributes.mana += 10;
            hero.manaCurrent = Math.min(window.getTotalStat('mana'), hero.manaCurrent + 10);
            break;

        case 'Reste Ration Traumruf':
            hero.attributes.mana += 6;
            hero.manaCurrent = Math.min(window.getTotalStat('mana'), hero.manaCurrent + 6);
            break;

        case 'Jorus Traumruf':
            hero.attributes.mana += 3;
            hero.manaCurrent = Math.min(window.getTotalStat('mana'), hero.manaCurrent + 3);
            break;

        case 'Extrakt reiner Magie':
            hero.attributes.mana += 5;
            hero.manaCurrent = Math.min(window.getTotalStat('mana'), hero.manaCurrent + 5);
            break;

        case 'Trank des puren Lebens':
            hero.hp.max += 1;
            hero.hp.current = Math.min(window.getTotalMaxHp(), hero.hp.current + 1);
            break;

        case 'Grüner Novize':
            window.gainXp((hero.chapter || 1) * 30);
            break;

        case 'Bierchen':
            setTimeout(() => alert("Bierchen getrunken: Im nächsten Kampf erhältst du +1 Stärke, aber -1 Geschick und Bewegung!"), 100);
            break;

        case 'Trank der Geschwindigkeit':
            setTimeout(() => alert("Die Gesamtbewegung jeder Aktionskarte im nächsten Zug wird verdoppelt!"), 100);
            break;
    }
};

window.handleEquipItem = function(itemName) {
    const hero = state.hero;
    const item = hero.inventory.find(i => i.name === itemName);
    if (!item) return;

    let slot = null;
    let isRing = false;

    if (item.style === 'Nahkampf' || (item.category === 'Waffen' && !item.style && !item.art?.toLowerCase().includes('bogen'))) {
        slot = 'melee';
    } else if (item.art === 'Bogen' || item.art === 'Armbrust' || item.style === 'Fernkampf') {
        slot = 'ranged';
    } else if (item.category === 'Rüstung' || item.category === 'Rüstungen') {
        slot = 'armor';
    } else if (item.category === 'Magie' || item.art === 'Spruchrolle' || item.art === 'Rune') {
        window.handleEquipSpell(itemName);
        return;
    } else if (item.art === 'Artefakt' || item.category === 'Ausrüstung') {
        if (item.name.toLowerCase().includes('amulett') || item.name.toLowerCase().includes('talisman')) {
            slot = 'amulet';
        } else if (item.name.toLowerCase().includes('ring')) {
            isRing = true;
        } else {
            slot = 'other_artifact';
        }
    }

    // --- Weapon req guard for melee/ranged ---
    if ((slot === 'melee' || slot === 'ranged') && !window.canEquipWeapon(item)) {
        window.showWeaponBlockedPopup(item.name, window._parseReq(item.req), item);
        return;
    }

    if (slot === 'other_artifact') {
        if (!hero.equipment.artifacts.others) hero.equipment.artifacts.others = [];
        
        const existingIndex = hero.equipment.artifacts.others.findIndex(a => a.name === item.name);
        if (existingIndex !== -1) {
            // Trying to unequip — check if it would leave a weapon unsupported
            const check = window.checkArtifactUnequipSafe(item);
            if (check.blocked) {
                window.showArtifactBlockedPopup(item.name, check.weaponName, check.statLabel, check.needed);
                return;
            }
            hero.equipment.artifacts.others.splice(existingIndex, 1);
            saveGame();
            render();
            return;
        } else {
            hero.equipment.artifacts.others.push(item);
            saveGame();
            render();
            return;
        }
    }

    if (isRing) {
        if (!hero.equipment.artifacts.ring1) {
            hero.equipment.artifacts.ring1 = item;
            render();
            return;
        } else if (!hero.equipment.artifacts.ring2) {
            hero.equipment.artifacts.ring2 = item;
            render();
            return;
        } else {
            const r1 = hero.equipment.artifacts.ring1;
            const r2 = hero.equipment.artifacts.ring2;
            const popupHtml = `
                <div id="equip-popup" class="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="document.getElementById('equip-popup').remove()"></div>
                    <div class="wood-card w-full max-w-md p-8 relative shadow-2xl border-2 border-secondary/30 text-center">
                        <h3 class="font-headline text-xl text-primary mb-4">Welcher Ring soll abgelegt werden?</h3>
                        <div class="flex flex-col gap-4 mb-6">
                            <button onclick="confirmRingSwap('ring1', '${item.name.replace(/'/g, "\\'")}'); document.getElementById('equip-popup').remove();" class="p-4 border border-outline-variant/30 bg-surface-container hover:border-secondary transition-all">
                                <span class="font-bold block">${r1.name}</span>
                                <span class="text-xs text-on-surface-variant">${r1.effect || ''}</span>
                            </button>
                            <button onclick="confirmRingSwap('ring2', '${item.name.replace(/'/g, "\\'")}'); document.getElementById('equip-popup').remove();" class="p-4 border border-outline-variant/30 bg-surface-container hover:border-secondary transition-all">
                                <span class="font-bold block">${r2.name}</span>
                                <span class="text-xs text-on-surface-variant">${r2.effect || ''}</span>
                            </button>
                        </div>
                        <button onclick="document.getElementById('equip-popup').remove()" class="w-full bg-surface-container-high py-3 font-bold uppercase text-xs">Abbrechen</button>
                    </div>
                </div>
            `;
            document.getElementById('app-content').insertAdjacentHTML('beforeend', popupHtml);
            return;
        }
    } else if (slot) {
        let currentEquip = null;
        if (slot === 'amulet') currentEquip = hero.equipment.artifacts.amulet;
        else currentEquip = hero.equipment[slot];

        if (currentEquip) {
            const popupHtml = `
                <div id="equip-popup" class="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="document.getElementById('equip-popup').remove()"></div>
                    <div class="wood-card w-full max-w-lg p-8 relative shadow-2xl border-2 border-secondary/30 text-center">
                        <h3 class="font-headline text-2xl text-primary mb-6">Soll gewechselt werden?</h3>
                        
                        <div class="grid grid-cols-2 gap-6 mb-8">
                            <div class="p-4 border border-error/50 bg-error/5 flex flex-col items-center justify-center min-h-[120px]">
                                <span class="text-[10px] text-error uppercase font-bold mb-2">Bisher angelegt</span>
                                <span class="font-bold text-on-surface text-lg text-center leading-tight mb-1">${currentEquip.name}</span>
                                <span class="text-xs text-on-surface-variant italic text-center">${currentEquip.damage ? `Schaden: ${currentEquip.damage}` : currentEquip.effect || ''}</span>
                            </div>
                            <div class="p-4 border border-primary/50 bg-primary/5 flex flex-col items-center justify-center min-h-[120px]">
                                <span class="text-[10px] text-primary uppercase font-bold mb-2">Neu</span>
                                <span class="font-bold text-on-surface text-lg text-center leading-tight mb-1">${item.name}</span>
                                <span class="text-xs text-on-surface-variant italic text-center">${item.damage ? `Schaden: ${item.damage}` : item.effect || ''}</span>
                            </div>
                        </div>

                        <div class="flex gap-4">
                            <button onclick="document.getElementById('equip-popup').remove()" class="flex-1 bg-surface-container-high py-3 font-bold uppercase text-xs">Nein</button>
                            <button onclick="executeEquip('${slot}', '${item.name.replace(/'/g, "\\'")}'); document.getElementById('equip-popup').remove(); render();" class="flex-1 bg-secondary text-on-secondary py-3 font-bold uppercase text-xs shadow-lg">Ja</button>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('app-content').insertAdjacentHTML('beforeend', popupHtml);
            return;
        } else {
            window.executeEquip(slot, item.name);
            render();
        }
    }
};

window.confirmRingSwap = function(ringSlot, newItemName) {
    const hero = state.hero;
    const oldRing = hero.equipment.artifacts[ringSlot];
    const newItem = hero.inventory.find(i => i.name === newItemName);
    
    const popupHtml = `
        <div id="equip-confirm-popup" class="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="document.getElementById('equip-confirm-popup').remove()"></div>
            <div class="wood-card w-full max-w-lg p-8 relative shadow-2xl border-2 border-secondary/30 text-center">
                <h3 class="font-headline text-2xl text-primary mb-6">Soll wirklich getauscht werden?</h3>
                
                <div class="grid grid-cols-2 gap-6 mb-8">
                    <div class="p-4 border border-error/50 bg-error/5 flex flex-col items-center justify-center min-h-[120px]">
                        <span class="text-[10px] text-error uppercase font-bold mb-2">Wird abgelegt</span>
                        <span class="font-bold text-on-surface text-lg text-center leading-tight mb-1">${oldRing.name}</span>
                        <span class="text-xs text-on-surface-variant italic text-center">${oldRing.effect || ''}</span>
                    </div>
                    <div class="p-4 border border-primary/50 bg-primary/5 flex flex-col items-center justify-center min-h-[120px]">
                        <span class="text-[10px] text-primary uppercase font-bold mb-2">Neu</span>
                        <span class="font-bold text-on-surface text-lg text-center leading-tight mb-1">${newItem.name}</span>
                        <span class="text-xs text-on-surface-variant italic text-center">${newItem.effect || ''}</span>
                    </div>
                </div>

                <div class="flex gap-4">
                    <button onclick="document.getElementById('equip-confirm-popup').remove()" class="flex-1 bg-surface-container-high py-3 font-bold uppercase text-xs">Nein</button>
                    <button onclick="executeEquip('${ringSlot}', '${newItem.name.replace(/'/g, "\\'")}'); document.getElementById('equip-confirm-popup').remove(); render();" class="flex-1 bg-secondary text-on-secondary py-3 font-bold uppercase text-xs shadow-lg">Ja</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('app-content').insertAdjacentHTML('beforeend', popupHtml);
};

// ============================================================
// MAGIC SYSTEM
// ============================================================

window.getMaxSpellSlots = function() {
    return 2 + getTalentLevel('magie');
};

window.getMagieKreis = function() {
    return getTalentLevel('magie');
};

window.handleEquipSpell = function(itemName) {
    const hero = state.hero;
    if (!hero.equipment.spells) hero.equipment.spells = [];
    if (hero.equipment.primarySpell === undefined) hero.equipment.primarySpell = 0;
    const item = hero.inventory.find(i => i.name === itemName);
    if (!item) return;
    if (item.art === 'Rune') {
        const requiredCircle = item.circle || 1;
        const heroCircle = window.getMagieKreis();
        if (heroCircle < requiredCircle) {
            const ep = document.getElementById('spell-blocked-popup'); if (ep) ep.remove();
            const pop = document.createElement('div'); pop.id = 'spell-blocked-popup';
            pop.className = 'fixed inset-0 z-[150] flex items-center justify-center p-4';
            pop.innerHTML = `<div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="document.getElementById('spell-blocked-popup').remove()"></div><div class="wood-card w-full max-w-sm p-8 relative shadow-2xl border-2 border-error/50 text-center"><span class="material-symbols-outlined text-5xl text-error mb-4 block">auto_fix_off</span><h3 class="font-headline text-2xl text-error mb-4 italic">Kreiswissen fehlt!</h3><p class="text-on-surface leading-relaxed mb-6">Du ben\u00f6tigst <strong class="text-secondary">Kreis ${requiredCircle}</strong> der Magie, um <strong class="text-primary italic">${item.name}</strong> einzusetzen.<br><span class="text-xs text-on-surface-variant mt-2 block">(Dein aktueller Kreis: ${heroCircle})</span></p><button onclick="document.getElementById('spell-blocked-popup').remove()" class="w-full bg-error/20 hover:bg-error text-error hover:text-on-error py-3 font-bold uppercase text-xs transition-all">Verstanden</button></div>`;
            (document.getElementById('app-content') || document.body).appendChild(pop); return;
        }
    }
    const idx = hero.equipment.spells.findIndex(s => s.name === itemName);
    if (idx !== -1) {
        hero.equipment.spells.splice(idx, 1);
        if (hero.equipment.primarySpell >= hero.equipment.spells.length) hero.equipment.primarySpell = Math.max(0, hero.equipment.spells.length - 1);
        saveGame(); render(); return;
    }
    const maxSlots = window.getMaxSpellSlots();
    if (hero.equipment.spells.length >= maxSlots) {
        const fp = document.getElementById('spell-full-popup'); if (fp) fp.remove();
        const pop2 = document.createElement('div'); pop2.id = 'spell-full-popup';
        pop2.className = 'fixed inset-0 z-[150] flex items-center justify-center p-4';
        pop2.innerHTML = `<div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="document.getElementById('spell-full-popup').remove()"></div><div class="wood-card w-full max-w-sm p-8 relative shadow-2xl border-2 border-secondary/40 text-center"><span class="material-symbols-outlined text-5xl text-secondary mb-4 block">library_books</span><h3 class="font-headline text-2xl text-primary mb-4 italic">Keine freien Slots!</h3><p class="text-on-surface leading-relaxed mb-6">Du hast bereits alle <strong class="text-secondary">${maxSlots}</strong> Slots belegt. Lege zuerst einen Zauber ab!</p><button onclick="document.getElementById('spell-full-popup').remove()" class="w-full bg-secondary/20 hover:bg-secondary text-secondary hover:text-on-secondary py-3 font-bold uppercase text-xs transition-all">OK</button></div>`;
        (document.getElementById('app-content') || document.body).appendChild(pop2); return;
    }
    hero.equipment.spells.push({ ...item, currentCharges: item.maxCapacity || 3 });
    saveGame(); render();
};

window.setPrimarySpell = function(index) {
    if (!state.hero.equipment) return;
    state.hero.equipment.primarySpell = index;
    saveGame(); render();
};

window.executeCastSpell = function() {
    const sim = state.combatSimulator;
    if (!sim || sim.turn !== 'hero' || sim.actionDone) return;
    if (sim.chargingSpell) { window.showChargingLevelPopup(); return; }
    const spell = sim.hero.spells && sim.hero.spells.length > 0 ? sim.hero.spells[sim.hero.primarySpell || 0] : null;
    if (!spell) { sim.log.unshift('Kein Zauber ausger\u00fcstet!'); render(); return; }
    
    const kreis = sim.hero.talents.magie || 0;
    let req = spell.reqMana || 1;
    if (kreis >= 2) req = Math.max(1, req - 1);
    
    if ((sim.hero.mana || 0) < req) { sim.log.unshift('\u26a1 Nicht gen\u00fcgend Mana!'); render(); return; }
    sim.hero.remainingMov = 0; sim.actionDone = true;
    const rolls = Array.from({ length: 1 + kreis }, () => Math.floor(Math.random() * 6) + 1);
    const best = Math.max(...rolls); const ok = best >= 4;
    sim.log.unshift(`\u{1F3B2} Kanalisierung [${rolls.join(', ')}] \u2192 ${best} \u2192 ${ok ? '\u2705 Erfolg!' : '\u274c Misslungen!'}`);
    if (!ok) { sim.log.unshift('Kein Manaverbrauch. Zug wechselt.'); sim.turn = 'enemy'; render(); return; }
    if (spell.style === 'Aufladbar') {
        const cp = document.getElementById('spell-charge-popup'); if (cp) cp.remove();
        let doubleReq = req * 2;
        if ((sim.hero.mana || 0) < doubleReq) {
            const pop3 = document.createElement('div'); pop3.id = 'spell-charge-popup';
            pop3.className = 'fixed inset-0 z-[160] flex items-center justify-center p-4';
            pop3.innerHTML = `<div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="const el = document.getElementById('spell-charge-popup'); if(el) el.remove(); window._fireChargingSpell(1);"></div><div class="wood-card w-full max-w-sm p-8 relative shadow-2xl border-2 border-primary/50 text-center"><span class="material-symbols-outlined text-5xl text-primary mb-4 block">info</span><h3 class="font-headline text-2xl text-primary mb-2 italic">Hinweis</h3><p class="text-on-surface text-sm mb-6">Dein Mana reicht nur f\u00fcr eine Aufladung!<br>Der Zauber <strong class="text-secondary">${spell.name}</strong> wird direkt mit einer Aufladung gewirkt.</p><button onclick="const el = document.getElementById('spell-charge-popup'); if(el) el.remove(); window._fireChargingSpell(1);" class="w-full bg-primary/20 hover:bg-primary text-primary hover:text-on-primary py-3 font-bold text-xs border border-primary/40">OK</button></div>`;
            (document.getElementById('app-content') || document.body).appendChild(pop3);
        } else {
            const pop3 = document.createElement('div'); pop3.id = 'spell-charge-popup';
            pop3.className = 'fixed inset-0 z-[160] flex items-center justify-center p-4';
            pop3.innerHTML = `<div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div><div class="wood-card w-full max-w-sm p-8 relative shadow-2xl border-2 border-primary/50 text-center"><span class="material-symbols-outlined text-5xl text-primary mb-4 block">bolt</span><h3 class="font-headline text-2xl text-primary mb-2 italic">Kanalisiert!</h3><p class="text-on-surface text-sm mb-6"><strong class="text-secondary">${spell.name}</strong><br>Min. Schaden: ${spell.damage} | Min. Mana: ${req} | Max. Mana: ${spell.maxMana || spell.reqMana}</p><div class="flex gap-3"><button onclick="const el = document.getElementById('spell-charge-popup'); if(el) el.remove(); window._fireChargingSpell(1);" class="flex-1 bg-primary/20 hover:bg-primary text-primary hover:text-on-primary py-3 font-bold text-xs border border-primary/40">Jetzt (${req} Mana)</button><button onclick="const el = document.getElementById('spell-charge-popup'); if(el) el.remove(); window._continueCharging();" class="flex-1 bg-secondary/20 hover:bg-secondary text-secondary hover:text-on-secondary py-3 font-bold text-xs">Weiter aufladen</button></div></div>`;
            (document.getElementById('app-content') || document.body).appendChild(pop3);
        }
    } else {
        window._fireInstantSpell(spell);
    }
};

window._fireInstantSpell = function(spell) {
    const sim = state.combatSimulator;
    const kreis = sim.hero.talents.magie || 0;
    
    let cost = spell.reqMana || 1;
    if (kreis >= 2) cost = Math.max(1, cost - 1);
    
    sim.hero.mana = Math.max(0, (sim.hero.mana || 0) - cost);
    state.hero.manaCurrent = Math.max(0, (state.hero.manaCurrent || 0) - cost);
    if (spell.art === 'Spruchrolle') {
        [(state.hero.equipment.spells || []), (sim.hero.spells || [])].forEach(arr => { const s = arr.find(x => x.name === spell.name); if (s) s.currentCharges = Math.max(0, (s.currentCharges || 1) - 1); });
    }
    const isFire = spell.element === 'Feuer' || spell.name.toLowerCase().includes('feuer');
    const isInsect = sim.enemy.type === 'insekt' || (sim.originalEnemy && sim.originalEnemy.type === 'insekt');
    const bonusDmg = (isFire && isInsect) ? 2 : 0;
    
    let rawDmg = (spell.damage || 0) + bonusDmg;
    if (kreis >= 1) rawDmg += 1;
    
    const mArm = sim.enemy.magicArm || 0;
    const dmg = Math.max(0, rawDmg - mArm);
    sim.enemy.hp = Math.max(0, sim.enemy.hp - dmg);
    const logBonusStr = bonusDmg > 0 ? ` (+2 Feuerschaden gegen Insekt)` : '';
    sim.log.unshift(`\u2728 ${spell.name}: ${rawDmg}${logBonusStr}-${mArm}=${dmg} Schaden! Mana -${cost} (noch: ${sim.hero.mana})`);
    if (spell.effect && spell.effect !== 'Keine' && spell.effect !== 'Keiner') sim.log.unshift(`\u{1F52E} ${spell.effect}`);
    
    if (window.applySpellPushEffect) window.applySpellPushEffect(spell);
    
    if (sim.enemy.hp <= 0) { sim.endScreen = 'WON'; if (!sim.isAdmin) sim.rewards = window.calculateCombatRewards(sim.originalEnemy); } else { sim.turn = 'enemy'; }
    render();
};

window._fireChargingSpell = function(level) {
    const sim = state.combatSimulator;
    const spell = sim.chargingSpell || (sim.hero.spells ? sim.hero.spells[sim.hero.primarySpell || 0] : null);
    if (!spell) return;
    const kreis = sim.hero.talents.magie || 0;
    const min = spell.reqMana || 1; const max = spell.maxMana || min; const maxLvl = Math.max(1, Math.floor(max / min));
    const lvl = Math.max(1, Math.min(level, maxLvl));
    
    let cost = min * lvl;
    if (kreis >= 2) cost = Math.max(1, cost - 1);
    
    if ((sim.hero.mana || 0) < cost) { sim.log.unshift(`Nicht gen\u00fcgend Mana! Ben\u00f6tigt: ${cost}`); sim.chargingSpell = null; render(); return; }
    sim.hero.mana = Math.max(0, sim.hero.mana - cost);
    state.hero.manaCurrent = Math.max(0, (state.hero.manaCurrent || 0) - cost);
    if (spell.art === 'Spruchrolle') { [(state.hero.equipment.spells || []), (sim.hero.spells || [])].forEach(arr => { const s = arr.find(x => x.name === spell.name); if (s) s.currentCharges = Math.max(0, (s.currentCharges || 1) - 1); }); }
    const isFire = spell.element === 'Feuer' || spell.name.toLowerCase().includes('feuer');
    const isInsect = sim.enemy.type === 'insekt' || (sim.originalEnemy && sim.originalEnemy.type === 'insekt');
    const bonusDmg = (isFire && isInsect) ? 2 : 0;
    
    let raw = (spell.damage || 0) * lvl + bonusDmg;
    if (kreis >= 1) raw += 1;
    if (kreis >= 4) raw += cost;
    
    const mArm = sim.enemy.magicArm || 0; const dmg = Math.max(0, raw - mArm);
    sim.enemy.hp = Math.max(0, sim.enemy.hp - dmg); sim.chargingSpell = null;
    const logBonusStr = bonusDmg > 0 ? ` (+2 Feuerschaden gegen Insekt)` : '';
    sim.log.unshift(`\u26a1 ${spell.name} Stufe ${lvl}: ${spell.damage}\u00d7${lvl}${logBonusStr}=${raw}-${mArm}=${dmg} Schaden! Mana -${cost}`);
    if (spell.effect && spell.effect !== 'Keine' && spell.effect !== 'Keiner') sim.log.unshift(`\u{1F52E} ${spell.effect}`);
    
    if (window.applySpellPushEffect) window.applySpellPushEffect(spell, lvl);
    
    if (sim.enemy.hp <= 0) { sim.endScreen = 'WON'; if (!sim.isAdmin) sim.rewards = window.calculateCombatRewards(sim.originalEnemy); } else { sim.turn = 'enemy'; }
    render();
};

window._continueCharging = function() {
    const sim = state.combatSimulator;
    const spell = sim.hero.spells ? sim.hero.spells[sim.hero.primarySpell || 0] : null;
    if (!spell) return;
    sim.chargingSpell = { ...spell };
    sim.log.unshift(`\u23f3 "${spell.name}" wird aufgeladen... n\u00e4chste Runde Stufe w\u00e4hlen.`);
    sim.turn = 'enemy'; render();
};

window.showChargingLevelPopup = function() {
    const sim = state.combatSimulator; const spell = sim.chargingSpell; if (!spell) return;
    const min = spell.reqMana || 1; const max = spell.maxMana || min;
    const kreis = sim.hero.talents.magie || 0;
    const maxSpellLvl = Math.max(1, Math.floor(max / min));
    
    let maxAffordableLvl = 0;
    for (let l = 1; l <= maxSpellLvl; l++) {
        let c = min * l;
        if (kreis >= 2) c = Math.max(1, c - 1);
        if ((sim.hero.mana || 0) >= c) {
            maxAffordableLvl = l;
        }
    }
    
    const maxLvl = Math.max(1, Math.min(maxSpellLvl, maxAffordableLvl));
    const opts = Array.from({ length: maxLvl }, (_, i) => i + 1).map(lvl => {
        let cost = min * lvl;
        if (kreis >= 2) cost = Math.max(1, cost - 1);
        let dmg = (spell.damage || 0) * lvl;
        if (kreis >= 1) dmg += 1;
        if (kreis >= 4) dmg += cost;
        return `<button onclick="const el = document.getElementById('charge-lvl-popup'); if (el) el.remove(); window._fireChargingSpell(${lvl});" class="w-full p-3 text-left border border-primary/30 bg-primary/10 hover:bg-primary hover:text-on-primary mb-1 text-xs font-bold transition-all">Stufe ${lvl} \u2014 ${dmg} Schaden | ${cost} Mana</button>`;
    }).join('');
    const ex = document.getElementById('charge-lvl-popup'); if (ex) ex.remove();
    const p = document.createElement('div'); p.id = 'charge-lvl-popup'; p.className = 'fixed inset-0 z-[160] flex items-center justify-center p-4';
    p.innerHTML = `<div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="const el = document.getElementById('charge-lvl-popup'); if (el) el.remove();"></div><div class="wood-card w-full max-w-sm p-8 relative shadow-2xl border-2 border-primary/50"><h3 class="font-headline text-2xl text-primary mb-2 italic text-center">Aufladungsstufe</h3><p class="text-xs text-on-surface-variant text-center mb-6">${spell.name}</p>${opts}</div>`;
    (document.getElementById('app-content') || document.body).appendChild(p);
};

window.executeCombatSpellSwap = function() {
    const sim = state.combatSimulator; if (!sim || sim.turn !== 'hero') return;
    if (!sim.hero.spells || sim.hero.spells.length < 2) return;
    const ex = document.getElementById('spell-swap-popup'); if (ex) ex.remove();
    const pop4 = document.createElement('div'); pop4.id = 'spell-swap-popup'; pop4.className = 'fixed inset-0 z-[160] flex items-center justify-center p-4';
    const opts2 = sim.hero.spells.map((s, i) => `<button onclick="state.combatSimulator.hero.primarySpell=${i};document.getElementById('spell-swap-popup').remove();render();" class="w-full p-3 text-left border ${i===(sim.hero.primarySpell||0)?'border-primary bg-primary/20':'border-outline-variant/30 bg-surface-container'} mb-2 flex items-center gap-3"><span class="material-symbols-outlined text-primary">${s.icon||'auto_fix_high'}</span><div><p class="font-headline text-sm font-bold">${s.name}</p><p class="text-xs text-on-surface-variant">${s.art} \u2022 ${s.reqMana} Mana \u2022 ${s.art==='Spruchrolle'?`${s.currentCharges||0} Ladungen`:'\u221e'}</p></div>${i===(sim.hero.primarySpell||0)?'<span class="ml-auto text-primary text-xs font-bold">AKTIV</span>':''}</button>`).join('');
    pop4.innerHTML = `<div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="document.getElementById('spell-swap-popup').remove()"></div><div class="wood-card w-full max-w-sm p-8 relative shadow-2xl border-2 border-primary/40"><h3 class="font-headline text-2xl text-primary mb-6 italic text-center">Zauber w\u00e4hlen</h3>${opts2}<button onclick="document.getElementById('spell-swap-popup').remove()" class="w-full mt-2 border border-outline-variant/30 text-on-surface-variant py-2 text-xs uppercase font-bold">Abbrechen</button></div>`;
    (document.getElementById('app-content') || document.body).appendChild(pop4);
};

window.rastenHero = function() {
    const hero = state.hero;
    hero.hp.current = window.getTotalMaxHp();
    hero.manaCurrent = window.getTotalStat('mana') || hero.attributes.mana || 5;
    saveGame(); render();
    const ex = document.getElementById('rasten-popup'); if (ex) ex.remove();
    const rp = document.createElement('div'); rp.id = 'rasten-popup'; rp.className = 'fixed inset-0 z-[150] flex items-center justify-center p-4';
    rp.innerHTML = `<div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="document.getElementById('rasten-popup').remove()"></div><div class="wood-card w-full max-w-sm p-8 relative shadow-2xl border-2 border-primary/40 text-center"><span class="material-symbols-outlined text-5xl text-primary mb-4 block">hotel</span><h3 class="font-headline text-2xl text-primary mb-4 italic">Gerastet!</h3><p class="text-on-surface leading-relaxed mb-6">Leben und Mana vollst\u00e4ndig wiederhergestellt!<br><span class="text-sm text-secondary font-bold">HP: ${window.getTotalMaxHp()} | Mana: ${hero.manaCurrent}</span></p><button onclick="document.getElementById('rasten-popup').remove()" class="w-full bg-primary/20 hover:bg-primary text-primary hover:text-on-primary py-3 font-bold uppercase text-xs transition-all">Weiter</button></div>`;
    (document.getElementById('app-content') || document.body).appendChild(rp);
};

// ============================================================
// WEAPON REQUIREMENT SYSTEM
// ============================================================

// Parse "3 STR" or "2 DEX" from item.req into {amount, stat}
window._parseReq = function(req) {
    if (!req) return null;
    const m = String(req).match(/(\d+)\s*(STR|DEX)/i);
    if (!m) return null;
    return { amount: parseInt(m[1]), stat: m[2].toUpperCase() };
};

// ============================================================
// COMBAT REWARDS SYSTEM
// ============================================================

// XP table: { chapter, class } → xp
const _XP_TABLE = {
    '1_1': 20, '1_2': 30, '1_3': 40,
    '2_1': 40, '2_2': 50, '2_3': 60,
    '3_1': 60, '3_2': 70, '3_3': 80
};

window.calculateCombatRewards = function(enemy) {
    const rewards = { xp: 0, items: [] };

    // XP from table
    const chap = enemy.chapter || 1;
    const cls  = enemy.class  || 1;
    rewards.xp = _XP_TABLE[`${chap}_${cls}`] || 20;

    // Allesfresser → random food card
    if (enemy.type === 'allesfresser') {
        const pool = (typeof itemPools !== 'undefined' && itemPools.nahrung) ? itemPools.nahrung : [];
        if (pool.length > 0) {
            const food = pool[Math.floor(Math.random() * pool.length)];
            rewards.items.push({ ...food, type: 'Konsum' });
        }
    }

    // Enemy with loot entries → draw from specified pool or fixed item
    if (enemy.loot && Array.isArray(enemy.loot)) {
        enemy.loot.forEach(lootSpec => {
            if (lootSpec.type === 'fixed' && typeof itemPools !== 'undefined') {
                // Fixed named item – search all item pools
                const allItems = [
                    ...(itemPools.waffen || []),
                    ...(itemPools.ausruestung || []),
                    ...(itemPools.nahrung || []),
                    ...(itemPools.ruestung || []),
                    ...(itemPools.magie || [])
                ];
                const found = allItems.find(i => i.name === lootSpec.name);
                if (found) rewards.items.push({ ...found });
            } else if (lootSpec.type === 'weapon' && typeof itemPools !== 'undefined') {
                const pool = itemPools[lootSpec.pool] || itemPools.waffen || [];
                const eligibleHero = state.hero.chapter || 1;
                const filtered = pool.filter(i => !i.chapter || parseInt(i.chapter) <= eligibleHero);
                if (filtered.length > 0) {
                    const w = filtered[Math.floor(Math.random() * filtered.length)];
                    rewards.items.push({ ...w });
                }
            }
        });
    }

    return rewards;
};

// Apply rewards to hero state and exit combat
window.collectCombatRewards = function() {
    const sim = state.combatSimulator;
    if (!sim) { window.exitCombatSimulator(); return; }

    if (sim.rewards) {
        const hero = state.hero;

        // Apply XP
        if (sim.rewards.xp > 0) {
            window.gainXp(sim.rewards.xp);
        }

        // Add items to inventory
        (sim.rewards.items || []).forEach(item => {
            const existing = hero.inventory.find(i => i.name === item.name);
            if (existing) {
                existing.count = (existing.count || 1) + 1;
            } else {
                hero.inventory.push({ ...item, count: 1 });
            }
        });
    }

    window.exitCombatSimulator();
};


window.canEquipWeapon = function(item) {
    const req = window._parseReq(item.req);
    if (!req) return true; // No requirement → always allowed
    
    let needed = req.amount;
    const questCompleted = state.hero.quests && !state.hero.quests.some(q => q.id === 'hero_quest');
    
    if (req.stat === 'STR') {
        if (state.hero.name === 'Konrad der Raufbold' && questCompleted) {
            needed = Math.ceil(needed / 2);
        }
        return window.getTotalStat('str') >= needed;
    }
    if (req.stat === 'DEX') {
        if (state.hero.name === 'Alwin der Jäger' && questCompleted) {
            const isBow = item && item.type && (item.type.toLowerCase().includes('bogen') || item.type.toLowerCase() === 'fk');
            if (isBow) {
                needed = Math.ceil(needed / 2);
            }
        }
        return window.getTotalStat('dex') >= needed;
    }
    return true;
};

// Show a styled medieval popup blocking equip
window.showWeaponBlockedPopup = function(weaponName, req, item) {
    const existing = document.getElementById('weapon-blocked-popup');
    if (existing) existing.remove();
    const statLabel = req.stat === 'STR' ? 'Stärke' : 'Geschick';
    
    let needed = req.amount;
    const questCompleted = state.hero.quests && !state.hero.quests.some(q => q.id === 'hero_quest');
    if (req.stat === 'STR' && state.hero.name === 'Konrad der Raufbold' && questCompleted) {
        needed = Math.ceil(needed / 2);
    } else if (req.stat === 'DEX' && state.hero.name === 'Alwin der Jäger' && questCompleted) {
        const isBow = item && item.type && (item.type.toLowerCase().includes('bogen') || item.type.toLowerCase() === 'fk');
        if (isBow) {
            needed = Math.ceil(needed / 2);
        }
    }

    const popup = document.createElement('div');
    popup.id = 'weapon-blocked-popup';
    popup.className = 'fixed inset-0 z-[150] flex items-center justify-center p-4';
    popup.innerHTML = `
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="document.getElementById('weapon-blocked-popup').remove()"></div>
        <div class="wood-card w-full max-w-sm p-8 relative shadow-2xl border-2 border-error/50 text-center">
            <span class="material-symbols-outlined text-5xl text-error mb-4 block">block</span>
            <h3 class="font-headline text-2xl text-error mb-4 italic">Zu schwach!</h3>
            <p class="text-on-surface leading-relaxed mb-6">
                Du hast nicht genügend <strong class="text-secondary">${statLabel}</strong>,
                um die Waffe <strong class="text-primary italic">${weaponName}</strong> anzulegen.
                <br><span class="text-xs text-on-surface-variant mt-2 block">(Benötigt: ${needed} ${statLabel})</span>
            </p>
            <button onclick="document.getElementById('weapon-blocked-popup').remove()" class="w-full bg-error/20 hover:bg-error text-error hover:text-on-error py-3 font-bold uppercase text-xs transition-all border border-error/30">Verstanden</button>
        </div>
    `;
    (document.getElementById('app-content') || document.body).appendChild(popup);
};

// Show popup when an artifact would be removed but that leaves a weapon the hero can't carry
window.showArtifactBlockedPopup = function(artifactName, weaponName, statLabel, needed) {
    const existing = document.getElementById('artifact-blocked-popup');
    if (existing) existing.remove();
    const popup = document.createElement('div');
    popup.id = 'artifact-blocked-popup';
    popup.className = 'fixed inset-0 z-[150] flex items-center justify-center p-4';
    popup.innerHTML = `
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="document.getElementById('artifact-blocked-popup').remove()"></div>
        <div class="wood-card w-full max-w-sm p-8 relative shadow-2xl border-2 border-error/50 text-center">
            <span class="material-symbols-outlined text-5xl text-secondary mb-4 block">warning</span>
            <h3 class="font-headline text-2xl text-primary mb-4 italic">Nicht möglich!</h3>
            <p class="text-on-surface leading-relaxed mb-6">
                Wenn du <strong class="text-secondary italic">${artifactName}</strong> ablegst,
                hast du nicht mehr genug <strong class="text-primary">${statLabel}</strong>,
                um <strong class="text-secondary italic">${weaponName}</strong> weiter zu tragen.
                <br><span class="text-xs text-on-surface-variant mt-2 block">(Benötigt: ${needed} ${statLabel})</span>
            </p>
            <button onclick="document.getElementById('artifact-blocked-popup').remove()" class="w-full bg-secondary/20 hover:bg-secondary text-secondary hover:text-on-secondary py-3 font-bold uppercase text-xs transition-all">Verstanden</button>
        </div>
    `;
    (document.getElementById('app-content') || document.body).appendChild(popup);
};

// Checks if removing an artifact would make an equipped weapon un-carriable.
// Returns {blocked: true, weaponName, statLabel, needed} if blocked, else {blocked: false}
window.checkArtifactUnequipSafe = function(artifactItem) {
    const hero = state.hero;
    const eq = hero.equipment || {};
    const weapons = [];
    if (eq.melee) weapons.push(eq.melee);
    if (eq.ranged) weapons.push(eq.ranged);

    // Simulate what stats would be WITHOUT the artifact's aura bonus
    for (const weapon of weapons) {
        const req = window._parseReq(weapon.req);
        if (!req) continue;

        // Compute what the relevant stat would be without this artifact's bonus
        const auraEffect = artifactItem.effect || '';
        let bonusLost = 0;
        if (req.stat === 'STR' && /\+\s*(\d+)\s*St[äa]rke/i.test(auraEffect)) {
            bonusLost = parseInt(auraEffect.match(/\+\s*(\d+)/)[1]);
        } else if (req.stat === 'DEX' && /\+\s*(\d+)\s*Geschick/i.test(auraEffect)) {
            bonusLost = parseInt(auraEffect.match(/\+\s*(\d+)/)[1]);
        }

        if (bonusLost > 0) {
            const currentStat = req.stat === 'STR' ? window.getTotalStat('str') : window.getTotalStat('dex');
            const statAfterRemove = currentStat - bonusLost;
            if (statAfterRemove < req.amount) {
                return {
                    blocked: true,
                    weaponName: weapon.name,
                    statLabel: req.stat === 'STR' ? 'Stärke' : 'Geschick',
                    needed: req.amount
                };
            }
        }
    }
    return { blocked: false };
};

// Checks all equipped weapons and forcibly unequips any the hero can no longer carry.
// Shows a "Schwächling" popup for each.
window.checkAllEquippedWeapons = function() {
    const hero = state.hero;
    const eq = hero.equipment || {};
    const slots = ['melee', 'ranged'];
    let any = false;
    for (const slot of slots) {
        if (!eq[slot]) continue;
        if (!window.canEquipWeapon(eq[slot])) {
            const w = eq[slot];
            eq[slot] = null;
            any = true;
            // Show Schwächling popup
            const existing = document.getElementById('weapon-unequipped-popup');
            if (existing) existing.remove();
            const popup = document.createElement('div');
            popup.id = 'weapon-unequipped-popup';
            popup.className = 'fixed inset-0 z-[150] flex items-center justify-center p-4';
            popup.innerHTML = `
                <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="document.getElementById('weapon-unequipped-popup').remove()"></div>
                <div class="wood-card w-full max-w-sm p-8 relative shadow-2xl border-2 border-secondary/40 text-center">
                    <span class="material-symbols-outlined text-5xl text-secondary mb-4 block">fitness_center</span>
                    <h3 class="font-headline text-3xl text-primary mb-4 italic">Schwächling!</h3>
                    <p class="text-on-surface leading-relaxed mb-6">
                        Deine Waffe <strong class="text-secondary italic">${w.name}</strong> musste abgelegt werden Schwächling.
                        <br><br>
                        <span class="text-on-surface-variant text-sm italic">Trainiere weiter, wenn du cool genug sein willst, sie wieder zu führen.</span>
                    </p>
                    <button onclick="document.getElementById('weapon-unequipped-popup').remove()" class="w-full bg-secondary/20 hover:bg-secondary text-secondary hover:text-on-secondary py-3 font-bold uppercase text-xs transition-all">Schade...</button>
                </div>
            `;
            (document.getElementById('app-content') || document.body).appendChild(popup);
        }
    }
    if (any) { saveGame(); render(); }
};

window.executeEquip = function(slot, itemName) {
    const hero = state.hero;
    const item = hero.inventory.find(i => i.name === itemName);
    if (!item) return;

    if (slot === 'ring1' || slot === 'ring2' || slot === 'amulet') {
        hero.equipment.artifacts[slot] = item;
    } else {
        hero.equipment[slot] = item;
    }
};

window.setPrimaryWeapon = function(type) {
    if (state.hero.equipment[type]) {
        state.hero.primaryWeapon = type;
        render();
        saveGame();
    }
};

window.exitCombatSimulator = function() {
    if (state.combatSimulator && state.combatSimulator.hero) {
        const finalHp = Math.max(0, state.combatSimulator.hero.hp);
        state.hero.hp.current = finalHp;
        // Sync mana back if tracked
        if (state.combatSimulator.hero.mana !== undefined) {
            state.hero.manaCurrent = Math.max(0, state.combatSimulator.hero.mana);
        }
        // Ensure equipment.spells exists on older saves
        if (!state.hero.equipment.spells) state.hero.equipment.spells = [];
        if (state.hero.equipment.primarySpell === undefined) state.hero.equipment.primarySpell = 0;
        saveGame();
    }
    if (state.analyseWindow) {
        try { state.analyseWindow.close(); } catch(e){}
        state.analyseWindow = null;
    }
    state.combatSimulator = null;
    state.currentScreen = 'status';
    render();
};

// ============================================================
// GLOBAL EXPORTS – expose ALL functions to window scope
// Required because Android WebView runs file:// in module-like
// scope where plain function declarations are not visible to
// inline onclick="" handlers in dynamically injected HTML.
// ============================================================
const _localFunctions = {
    shuffleArray, initCampState, drawCampCharacters, nextRound,
    updateState, saveGameWithName, loadGameByName, deleteGameByName,
    openSavePopup, openLoadPopup, openDeletePopup,
    saveGame, loadGame, fixItemImage, getTalentLevel,
    render, updateUI,
    startNewGame, previewHero, selectHero,
    openQuestConfirmation, closeQuestConfirmation, confirmQuestCompletion, abandonQuest,
    openTraderPopup, closeTraderPopup, selectTrader,
    addToOffer, resetTrade, openTradeInventoryPopup, closeTradeInventoryPopup,
    initiateSell, adjustQuantity, cancelQuantity, confirmQuantity,
    moveItemToOffer, addToTradeOffer, removeFromTradeOffer,
    equalizeOre, confirmTrade, removeFromOffer,
    openInventoryCategory, getItemImage, closeInventoryPopup,
    zoomImage, closeZoom,
    openTalentModal, closeTalentModal, openTalentInfo, closeTalentInfo, upgradeTalent,
    sellItem, upgradeStat,
    openFindingCategory, closeFindingPopup,
    openLosingCategory, closeLosingPopup,
    initiateFind, adjustFindingQuantity, cancelFindingQuantity, confirmFindingQuantity,
    initiateRemove, adjustLosingQuantity, cancelLosingQuantity, confirmLosingQuantity,
    removeItemsFromInventory, buyItem, lootItem, loseItem,
    openResourcePopup, closeResourcePopup, confirmResourceAdjustment,
    checkLevelUp,
    canEquipWeapon, checkAllEquippedWeapons,
};
Object.entries(_localFunctions).forEach(([name, fn]) => {
    if (typeof fn === 'function') window[name] = fn;
});

window.playIntroVideo = function() {
    const overlay = document.getElementById('intro-overlay');
    const video = document.getElementById('intro-video');
    const spinner = document.getElementById('intro-spinner');
    if (!overlay || !video) return;

    // Show the video only when it's actively playing/rendering frames to prevent play button glitches
    const showVideo = () => {
        if (spinner) spinner.style.display = 'none';
        video.classList.remove('opacity-0');
        video.classList.add('opacity-100');
        video.removeEventListener('playing', showVideo);
        video.removeEventListener('timeupdate', showVideo);
    };

    video.addEventListener('playing', showVideo);
    video.addEventListener('timeupdate', showVideo);

    // Start video playback
    video.play().catch(err => {
        console.log("Video playback blocked or failed, bypassing intro:", err);
        if (spinner) spinner.style.display = 'none';
        overlay.remove();
    });

    // After 5 seconds, fade the video to black
    setTimeout(() => {
        video.style.transition = 'opacity 1000ms ease';
        video.style.opacity = '0';
    }, 5000);

    // After 6 seconds, remove the overlay completely
    setTimeout(() => {
        overlay.remove();
    }, 6000);
};

window.onload = () => {
    loadGame(true); // Load saved game but stay on startseite
    state.currentScreen = "startseite";
    render();
    window.playIntroVideo();

    // Wire up all static HTML nav buttons safely after all JS is loaded
    document.querySelectorAll('[data-nav]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            window.navigateTo(this.getAttribute('data-nav'));
        });
    });

    // Wire talent modal overlay close button
    const talentOverlay = document.getElementById('talent-modal-overlay');
    if (talentOverlay) {
        talentOverlay.addEventListener('click', function() {
            if (typeof window.closeTalentModal === 'function') window.closeTalentModal();
        });
    }
};

