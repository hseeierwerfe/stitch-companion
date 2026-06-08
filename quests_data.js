window.QUESTS_DATA = {
  "Thorus": {
    id: "Thorus",
    title: "Gefälschte Siegelringe!",
    giver: "Thorus",
    img: "Bilder Karten/Personen/Lehrer/Thorus.png",
    firstSpeech: "Thorus: „Seit neustem treibt sich ein Händler in der Nähe des Lagers rum. Sein Name ist Cavalorn. Ich glaube, dass er mit den Spinnern des neuen Lagers unter einer Decke steckt. Hier tauchen immer mehr Leute mit gefälschten Siegelringen der Wassermagier auf und wollen in die Stadt. Ich möchte, dass du rausfindest, was dahinter steckt. Und ich will, dass dieser Scheiß mit den Siegelringen ein Ende hat.“",
    dialogs: {
      accepted: {
        text: "Thorus: „Seit neustem treibt sich ein Händler in der Nähe des Lagers rum. Sein Name ist Cavalorn. Ich glaube, dass er mit den Spinnern des neuen Lagers unter einer Decke steckt. Hier tauchen immer mehr Leute mit gefälschten Siegelringen der Wassermagier auf und wollen in die Stadt. Ich möchte, dass du rausfindest, was dahinter steckt. Und ich will, dass dieser Scheiß mit den Siegelringen ein Ende hat.“",
        condition: "Gehe zu Feld 37."
      },
      cavalorn_trifft: {
        text: "Cavalorn: „Hallo Fremder! Kann ich dir was von meinen Waren anbieten oder suchst du etwas anderes. Ich habe die besten Bögen des alten Lagers.“\n\nSträfling: „Ich will eigentlich nur in die Burg. Man sagte mir du kannst dabei behilflich sein.“\n\nCavalorn: „Von wem hast du das gehört? ...Naja das spielt ja erstmal keine Rolle. Was hätte ich davon dir zu helfen?“",
        options: [
          { text: "[Sträfling: Thorus ist dir auf die Schliche gekommen. Ich könnte für dich die Siegelringe an den Mann bringen. Ich würde ihm einfach sagen es sei ein Hehlerring aus dem Neuen Lager.]", nextStep: "opt1_cavalorn" },
          { text: "[Sträfling: Ich hab gehört in der Burg gibts was zu holen. Wir könnten Halbe-Halbe machen wenn du mir hilfst in die Burg zu kommen.]", nextStep: "opt2_cavalorn" }
        ]
      },
      opt1_cavalorn: {
        text: "Cavalorn: „Scheiße ich hab schon befürchtet dass es soweit kommt... Na schön. Aber ich werde keine neuen Ringe mehr anfertigen. Das Risiko ist zu groß. Du kannst die Ringe haben und verticken die ich noch habe... Danke dass du mich gewarnt hast.“\n\nDu erhältst 4 gefälschte Siegelringe!",
        condition: "Gehe zurück ins alte Lager!",
        onEnter: function(h) { window.gainQuestItem('Siegelring der Wassermagier', 4); }
      },
      opt1_end: {
        text: "Thorus: „Was hast du herausgefunden?“\n\nSträfling: „Ich hab aus Cavalorn keine Information herausbekommen. Auf dem Rückweg zum alten Lager hat mich ein Bandit angesprochen ob ich nicht Interesse an einem Siegelring hätte. Ich habe einen gekauft und dann den Banditen heimlich zu einem Hehlerversteck verfolgt wo sie die Dinger fälschen. Du scheinst Cavalorn zu Unrecht verdächtigt zu haben.“\n\nThorus: „Ach du Scheiße! Dann ist das ja ne größere Nummer als ich dachte. Gut dass ich Bloodwyn nicht auf den Penner gehetzt habe. Hier für deine Mühen.“\n\nDu verlierst 4 Siegelringe. Du erhältst 20 Erz und 30*Kapitel Erfahrung.",
        onEnter: function(h) { window.loseQuestItem('Siegelring der Wassermagier', 4); window.gainOre(20); window.gainXp(30 * (h.chapter||1)); }
      },
      opt2_cavalorn: {
        text: "Cavalorn: „Hmmm.... Scheint so als könnte ich nicht ablehnen da du das Risiko trägst. Hier nimm diesen Siegelring. Die Wachen werden glauben du seist ein Bote der Wassermagier.“\n\nDu erhältst einen gefälschten Siegelring.",
        condition: "Gehe zurück ins alte Lager.",
        onEnter: function(h) { window.gainQuestItem('Siegelring der Wassermagier', 1); }
      },
      opt2_end: {
        text: "Sträfling: „Ich habe ihn überlistet und er hat mir tatsächlich einen Ring geschenkt damit ich für ihn in der Burg klaue. Hier ist der Ring!“\n\nThorus: „WAS! Dieser Mistkerl! Wenn er sich hier noch einmal blicken lässt hacke ihm persönlich alle Finger ab dann kann er mal sehen wo er sich seine Ringe hinsteckt! Ehrliche Leute wie dich können wir hier im Lager brauchen. Pass auf dich auf! Hier für deine Mühen.“\n\nDu verlierst einen Siegelring. Du erhältst eine zufällige Waffe und 60*Kapitel Erfahrung.",
        onEnter: function(h) { window.loseQuestItem('Siegelring der Wassermagier', 1); window.gainQuestItem('Schartige Buddlerzucht', 1); window.gainXp(60 * (h.chapter||1)); window.gainConnectionPoint('Altes Lager'); }
      }
    }
  },
  "Scar": {
    id: "Scar",
    title: "Schmieriger Erzbaron",
    giver: "Scar",
    img: "Bilder Karten/Personen/Quest/Scar.png",
    firstSpeech: "Scar: „Ich habe die Frauen im Lager mittlerweile satt. Wir haben schon seit Tagen kein Frischfleisch mehr gekriegt, wenn du verstehst was ich meine. Erst letztens haben wir ne neue gekriegt, die hab ich direkt markiert für mich, aber Gomez dieser Penner hat sie ans Sektenlager für die letzte Fuhre Kraut verscherbelt. Ich will sie wieder haben! Wenn du es schaffst sie denen abzuluchsen, wartet eine fette Belohnung auf dich. Und du darfst auch mal ran. Natürlich als zweiter...“",
    dialogs: {
      accepted: {
        text: "Scar: „Ich habe die Frauen im Lager mittlerweile satt. Wir haben schon seit Tagen kein Frischfleisch mehr gekriegt, wenn du verstehst was ich meine. Erst letztens haben wir ne neue gekriegt, die hab ich direkt markiert für mich, aber Gomez dieser Penner hat sie ans Sektenlager für die letzte Fuhre Kraut verscherbelt. Ich will sie wieder haben! Wenn du es schaffst sie denen abzuluchsen, wartet eine fette Belohnung auf dich. Und du darfst auch mal ran. Natürlich als zweiter...“\n\nSträfling: „Alles klar ich werde sehen was ich tun kann.“",
        condition: "Gehe ins Sektenlager!"
      },
      yberion_trifft: {
        text: "Du gehst zu Y´Berion. Die Templer lassen dich durch, weil du behauptest dich der Sekte anschließen zu wollen.\n\nY´Berion: „Erwache! Der Schläfer hat mir mitgeteilt dass du kommen würdest dich uns anzuschließen. Immer sind wir auf der Suche nach neuen Seelen, also trage nun dein Anliegen vor!“",
        options: [
          { text: "[Sträfling: Der Schläfer hat mich in einer Vision zu euch entsandt. Er sprach von einem Opfer. Ein Menschenopfer! Er braucht eine Jungfrau! Er zeigte mir eine Frau die ihr erst kürzlich von den Schuften des alten Lagers befreien konntet. Sie ist noch jungfräulichen Blutes.]", nextStep: "opt1_yberion" },
          { text: "[Sträfling: Meister Y´Berion! Der Erzbaron Scar schickt mich mit dem Auftrag die kürzlich angekommene Frau zu ihm zurück zu bringen, doch bevor ihr mich abstechen lasst, so hört mich an! Scar hält zusammen mit Gomez Rat und hat sicherlich nützliche Informationen. Mein Vorschlag: gebt der Frau einen Teleportzauber.]", nextStep: "opt2_yberion" },
          { text: "[Sträfling: Meister Y´Berion! Gomez schickt mich. Er will die Frau zurück die er versehentlich gegen eine Fuhre Sumpfkraut eintauschte. Er bietet euch 500 Erz.]", nextStep: "opt3_yberion" }
        ]
      },
      opt1_yberion: {
        text: "Y´Berion: „...Jungfrau... Nun... Ja... Die Jungfrau, sie ist dahinten in meinem Gemach. Ich werde gleich nach ihr schicken lassen. Opfert ihr reines Blut. Der Schläfer wird mehr als zufrieden mit ihrer ... Unbeflecktheit.... sein! Sie wird sich wohlmöglich dem Opfer entziehen wollen und lügen über mich verbreiten. Hier nehmt diese Spruchrolle und beruhigt sie im Namen unseres Erlösers.“\n\nDu erhältst 1x Nyras Spruchrolle und 30*Kapitel Erfahrung.",
        condition: "Gehe ins alte Lager. Die Frau wird nicht mit dir kämpfen!",
        onEnter: function(h) { window.gainQuestItem('Nyras Spruchrolle', 1); window.gainXp(30 * (h.chapter||1)); }
      },
      opt1_end: {
        text: "Du bringst Scar die Frau und er freut sich sichtlich sie wiederzusehen. Für deine Mühen dankt er dir. Du bringst mit Scar die Sache zu Ende.... Natürlich als Zweiter. Setze eine Runde aus! Du fühlst dich erleichtert.\n\nDu erhältst 50 Erz und 10*Kapitel Erfahrung. Dein Leben und dein Mana sind vollständig regeneriert.",
        onEnter: function(h) { window.gainOre(50); window.gainXp(10 * (h.chapter||1)); h.hp.current = h.hp.max; if(h.mana) h.mana.current = h.mana.max; }
      },
      opt2_yberion: {
        text: "Y´Berion: „Du sprichst weise Worte. Tatsächlich sorgen wir uns lange vor einem Überfall des alten Lagers auf unsere Plantagen. Hier nimm sie mit! Ich hoffe für dich sie kehrt heile zurück!“\n\nDu bringst Scar die Frau. Für deine Mühen dankt er dir. Er bietet dir an nach ihm sich zu erleichtern. Du lehnst dankend ab.\n\nDu erhältst 50 Erz.",
        condition: "Lege Aktionskarten ab um das Lager zu verlassen.",
        onEnter: function(h) { window.gainOre(50); }
      },
      opt2_scar_weg: {
        text: "Du willst gerade das alte Lager verlassen, da stürmt ein halbnackter Scar auf dich zu...\n\nScar: „Diese Schlampe! Kaum war ich fertig mit ihr da schnappt sie sich mein Zeug und verschwindet wie von Geisterhand! In meiner Rüstung waren wichtige Pergamente! Du bist doch daran schuld! Du wusstest doch davon!“\n\nSträfling: „Was ist passiert?! ....Ich?... Nein... Was hätte ich denn davon außer Probleme mit dem alten Lager. Das kann ich mir wohl absolut nicht leisten.“\n\nScar: „Da hast du recht! ...von einer Frau gedemütigt... Wenn du irgendetwas davon erzählst bring ich dich um. Ist das klar!?“\n\nSträfling: „Klar!“\n\nDu erhältst 20*Kapitel Erfahrung.",
        condition: "Gehe ins Sektenlager.",
        onEnter: function(h) { window.gainXp(20 * (h.chapter||1)); }
      },
      opt2_end: {
        text: "Y´Berion: „Vielen Dank, junger Schüler. Deine Hilfe kam gerade noch rechtzeitig. Tatsächlich hat das alte Lager vorgehabt, über einen versteckten Pfad im Wasser unsere Plantagen zu überfallen. Dieser Pfad wird nun von unseren stärksten Brüdern bewacht. Hier als Zeichen unserer Dankbarkeit!“\n\nDu erhältst 2 Nyras Spruchrollen und 40*Kapitel Erfahrung.",
        onEnter: function(h) { window.gainQuestItem('Nyras Spruchrolle', 2); window.gainXp(40 * (h.chapter||1)); }
      },
      opt3_yberion: {
        text: "Y´Berion: „Das sieht Gomez ähnlich! Einen ungewaschenen Schergen hier anlaufen zu lassen und einem Erz zu bieten. Sein stinkendes Erz kann er behalten. Unsere Interessen gelten allein dem Ruhm des Schläfers! Und jetzt verschwinde! Richte Gomez aus dass die Frau nun mir dient!“",
        condition: "Gehe ins alte Lager."
      },
      opt3_end: {
        text: "Du kehrst ohne Frau zu Scar zurück. Ohne dich eines Wortes zu würdigen ruft er zwei Wachen heran die dich aus dem Lager begleiten. Du kommst auf Feld 11 wieder zu dir.\n\nQuest fehlgeschlagen!",
        onEnter: function(h) { h.hp.current = 1; }
      }
    }
  },
  "Dexter": {
    id: "Dexter",
    title: "Hinterlistige Goblins",
    giver: "Dexter",
    img: "Bilder Karten/Personen/Händler/Dexter.png",
    firstSpeech: "Dexter: „Hei du ich sehe du bist neu hier. Ich habe hier eine Kleinigkeit für dich. Nimm diese Waffe. Dafür musst du nur eine Kleinigkeit für mich tun. Ich habe unglücklicherweise an der Brücke hinter dem Lager meinen Beutel Erz verloren. So ein dreckiger Goblin hat mich nachts erwischt. Ich habe mich fast eingeschissen das kannst du mir glauben. Jetzt trau ich mich aber nicht mehr zurück. Wenn du mir den Beutel bringst kannst du die Waffe behalten. Und ich gebe dir einen Teil meines Erzes ab.“",
    dialogs: {
      accepted: {
        text: "Dexter: „Hei du ich sehe du bist neu hier. Ich habe hier eine Kleinigkeit für dich. Nimm diese Waffe. Dafür musst du nur eine Kleinigkeit für mich tun. Ich habe unglücklicherweise an der Brücke hinter dem Lager meinen Beutel Erz verloren. So ein dreckiger Goblin hat mich nachts erwischt. Ich habe mich fast eingeschissen das kannst du mir glauben. Jetzt trau ich mich aber nicht mehr zurück. Wenn du mir den Beutel bringst kannst du die Waffe behalten. Und ich gebe dir einen Teil meines Erzes ab.“\n\nDu erhältst die Waffe Schartige Buddlerzucht!",
        condition: "Gehe zu Feld 97!",
        onEnter: function(h) { window.gainQuestItem('Schartige Buddlerzucht', 1); }
      },
      goblins: {
        text: "Es erscheinen 2 Goblins. Ein Kampf beginnt!",
        options: [
          { text: "[Du gewinnst den Kampf! Das Erz sieht zu verlockend aus und du steckst es ein!]", nextStep: "opt1_end" },
          { text: "[Du gewinnst den Kampf! Du entschließt dich Dexter den Beutel zurückzubringen.]", nextStep: "opt2_dexter" },
          { text: "[Du verlierst den Kampf!]", nextStep: "opt3_verloren" }
        ]
      },
      opt1_end: {
        text: "Du erhältst 60 Erz. Wenn du einen Anschlusspunkt im alten Lager hast verlierst du diesen. Zusätzlich ist von nun an jede Interaktion mit Dexter im Lager unmöglich!\n\nQuest beendet.",
        onEnter: function(h) { window.gainOre(60); window.loseConnectionPoint('Altes Lager'); }
      },
      opt2_dexter: {
        text: "Du erhältst 60 Erz!",
        condition: "Gehe ins Alte Lager.",
        onEnter: function(h) { window.gainOre(60); }
      },
      opt2_end: {
        text: "Sträfling: „Hei ich konnte deinen Kram tatsächlich zurückkriegen. Hier ist er!“\n\nDu verlierst 60 Erz!\n\nDexter: „Danke man auf dich ist Verlass. Ich werde ein gutes Wort bei Diego für dich einlegen. Und jetzt gib mir meine Waffe wieder!“\n\nSträfling: „Aber du hast gesagt ich kann sie behalten!“\n\nDexter: „Ja du hast sie lange genug behalten. Oder willst du dass ich Diego sage dass du mein Schwert gestohlen hast?“\n\nDu verlierst eine Schartige Buddlerzucht. Du erhältst 1 Anschlusspunkt im Alten Lager, 30 Erz und 30*Kapitel Erfahrung.",
        onEnter: function(h) { window.loseOre(60); window.loseQuestItem('Schartige Buddlerzucht', 1); window.gainOre(30); window.gainXp(30 * (h.chapter||1)); window.gainConnectionPoint('Altes Lager'); }
      },
      opt3_verloren: {
        text: "Du kommst auf Feld 96 wieder zu dir ohne Erz und Nahrung. Die Quest kann erst fortgesetzt werden wenn die Goblins besiegt sind!",
        condition: "Gewinne den Kampf!",
        onEnter: function(h) { h.hp.current = 1; }
      }
    }
  },
  "Cor Angar": {
    id: "Cor Angar",
    title: "Das Artefakt der Erleuchtung",
    giver: "Cor Angar",
    img: "Bilder Karten/Personen/Lehrer/Cor Angar.png",
    firstSpeech: "Cor Angar: „Sag nichts junger Wanderer. Wie wir alle bist du auf der Suche nach einer Erleuchtung und Hoffnung. Wir von der Bruderschaft können dir vielleicht helfen. Ich kann dir etwas beibringen doch du musst mir zeigen dass du bereit bist ein Opfer für die Bruderschaft zu bringen. Wir suchen einen magischen Gegenstand. Es ist eine Brosche mit dem Heiligen Symbol des Schläfers. Sie soll sich an einem alten Schiffswrack befinden welches nördlich von hier liegt. Wenn du sie mir besorgst werde ich dich unterrichten.“",
    dialogs: {
      accepted: {
        text: "Cor Angar: „Sag nichts junger Wanderer. Wie wir alle bist du auf der Suche nach einer Erleuchtung und Hoffnung. Wir von der Bruderschaft können dir vielleicht helfen. Ich kann dir etwas beibringen doch du musst mir zeigen dass du bereit bist ein Opfer für die Bruderschaft zu bringen. Wir suchen einen magischen Gegenstand. Es ist eine Brosche mit dem Heiligen Symbol des Schläfers. Sie soll sich an einem alten Schiffswrack befinden welches nördlich von hier liegt. Wenn du sie mir besorgst werde ich dich unterrichten. Und selbstverständlich sollst du auch einen Lohn erhalten.“",
        condition: "Gehe zu Feld 148!"
      },
      wrack: {
        text: "Vor dem Schiffswrack steht ein Novize. Er spricht dich an.\n\nNovize: „Du kommst zu spät! Der Schläfer hat mich auserwählt seine Brosche zu finden. Er möchte dass ich den Weg in die Freiheit als Erster nehme. DU musst mein Zeuge sein und den Leuten versichern dass ich durch die Macht des Schläfers die Barriere verlassen habe.“\n\nWie besessen stürzt sich der Novize auf die Barriere hinter ihm zu. Du staunst weil du glaubst dass er es tatsächlich geschafft hat doch dann plötzlich KRACH!!!!!!! Ein Blitz fährt auf den Novizen hernieder und schleudert ihn zurück an den Strand. Ohne eine Miene zu verziehen nimmst du ihm die Brosche ab und drehst dich um.\n\nDu erhältst eine Schläferbrosche!",
        condition: "Gehe zurück ins Sektenlager!",
        onEnter: function(h) { window.gainQuestItem('Schläferbrosche', 1); }
      },
      end: {
        text: "Du kommst im Lager an und triffst auf Cor Angar.\n\nCor Angar: „Wie ich sehe seid Ihr von eurer Mission zurückgekehrt. Habt ihr die Brosche finden können?“\n\nSträfling: „Ja das war nicht besonders schwierig.“\n\nCor Angar: „Nun denn können wir endlich die Barriere verlassen...“\n\nSträfling: „Nun was das betrifft.... Der Novize der die Brosche vor mir gefunden hat liegt jetzt verkohlt am Strand.“\n\nCor Angar: „Nein! Ich kann es nicht glauben... Danke. Leider waren deine Mühen umsonst. Doch sollst du nicht unbelohnt bleiben. Hier hast du etwas Erz für deine Mühen. Möge der Schläfer dich behüten.“\n\nDu erhältst 30*Kapitel Erfahrung, 20 Erz und du darfst die Brosche behalten. (Die Schläferbrosche bleibt im Inventar!)",
        onEnter: function(h) { window.gainXp(30 * (h.chapter||1)); window.gainOre(20); window.gainConnectionPoint('Sektenlager'); }
      }
    }
  },
  "Diego": {
    id: "Diego",
    title: "Das Paket des Vertrauens",
    giver: "Diego",
    img: "Bilder Karten/Personen/Lehrer/Diego.png",
    firstSpeech: "Diego: „Hei Neuer. Du siehst aus, als suchst du etwas. Einen Ort an dem du gut aufgehoben bist. Das alte Lager wäre sicher ein solcher Ort. Wir suchen immer Leute wie dich. Wenn du mir einen Gefallen tust, werde ich ein gutes Wort für dich bei den Erzbaronen einlegen. Du musst nur etwas für mich holen. Ein Freund von mir aus dem Sumpflager namens Lester hat ein Paket für mich. Wenn du es für mich holst, werde ich dich angemessen belohnen.“",
    dialogs: {
      accepted: {
        text: "Diego: „Hei Neuer. Du siehst aus, als suchst du etwas. Einen Ort an dem du gut aufgehoben bist. Das alte Lager wäre sicher ein solcher Ort. Wir suchen immer Leute wie dich. Wenn du mir einen Gefallen tust, werde ich ein gutes Wort für dich bei den Erzbaronen einlegen. Du musst nur etwas für mich holen. Ein Freund von mir aus dem Sumpflager namens Lester hat ein Paket für mich. Der Inhalt spielt keine Rolle für dich. Wenn du es für mich holst, werde ich dich angemessen belohnen.“",
        condition: "Gehe in das Sumpflager, während Lester aufgedeckt ist!"
      },
      lester_trifft: {
        text: "Lester: „Erwache! Was führt dich zu der erwählten Bruderschaft. Hier ein Willkommensgeschenk! Du bist sicher hier um dich uns anzuschließen.“\n\nDu erhältst einen grünen Novizen.\n\nSträfling: „Eigentlich... hat Diego mich geschickt. Ich soll irgendein Paket abholen.“\n\nLester: „So, Diego hat dich also geschickt. Das kann ja jeder behaupten. Ich hätte eine Aufgabe für dich. Wenn du sie erfüllst, werde ich dir Diegos Paket geben! Einer meiner Brüder hat Schulden bei mir! Schrat der Penner, er gammelt irgendwo im Sumpf herum. Hol mir meine Rationen zurück, die ich ihm die letzten zwei Tage geliehen hatte. Es waren immerhin 5 Traumruf!“",
        condition: "Gehe zu Feld 135!",
        onEnter: function(h) { window.gainQuestItem('Grüner Novize', 1); }
      },
      schrat_trifft: {
        text: "Schrat: „Wooooow, bist du echt? Hier im Sumpf kann man sich nie so sicher sein.“ Schrat berührt dein Gesicht. „Deine Haut ist mit einem wirklich weichen Flaum bedeckt.“\n\nSträfling (flüstert): „Oh man ist der Typ dicht... Buuuh!... Ich bin ein Geist und du hast mir fünf Stängel Traumruf gestohlen... und 30 Erz! Gib sie mir wieder oder ich werde dich auf ewig heimsuchen!“\n\nSchrat: „Beim Schläfer! Nicht schon wieder! Ich bin völlig fertig... Hier nobler Geist nehmt alles was ich hab, aber bitte lasst mich in Ruhe.“\n\nDu erhältst eine Ration Traumruf und 30 Erz!",
        condition: "Wirf all deine Aktionskarten ab!",
        onEnter: function(h) { window.gainQuestItem('Ration Traumruf', 1); window.gainOre(30); }
      },
      lester_rueck: {
        text: "Lester: „Du warst ja richtig schnell, hast du ihn gefunden?“",
        options: [
          { text: "[Sträfling: Ja, ich habe ihn gefunden, hier ist dein Zeug.]", nextStep: "opt1_lester" },
          { text: "[Sträfling: Ja aber nur seine Überreste, irgendetwas Großes hat ihn zerpülöckt.]", nextStep: "opt2_fail" },
          { text: "[Sträfling: Ja ich habe ihn gefunden, er hatte aber nur noch zwei Stängel über. Er war ziemlich breit..]", nextStep: "opt3_lester" }
        ]
      },
      opt1_lester: {
        text: "Lester: „Schön man kann dir also vertrauen! Wunderbar, und hier ist dein Paket und jetzt lauf schnell zu Diego!“\n\nDu verlierst eine Ration Traumruf! Du erhältst 40*Kapitel Erfahrung und Diegos Paket.",
        condition: "Gehe zurück ins Alte Lager!",
        onEnter: function(h) { window.loseQuestItem('Ration Traumruf', 1); window.gainXp(40*(h.chapter||1)); window.gainQuestItem('Diegos Paket', 1); }
      },
      opt1_end: {
        text: "Diego: „Und hast du mein Paket?“\n\nSträfling: „Ja hier ist es. Lester wollte...“\n\nDiego: „Das ist mir egal! Gib mir das Paket, ich möchte damit allein sein! DU hast dich damit auf jeden Fall nützlich für das Lager gemacht! Hier für deine Mühen!“\n\nDu erhältst 20 Erz, 30*Kapitel Erfahrung und 1 Anschlusspunkt im alten Lager.",
        onEnter: function(h) { window.loseQuestItem('Diegos Paket', 1); window.gainOre(20); window.gainXp(30*(h.chapter||1)); window.gainConnectionPoint('Altes Lager'); }
      },
      opt2_fail: {
        text: "Lester: „Soso, dabei weiß ich doch, dass er ein absoluter Feigling ist. Er rennt schneller als ein Snapper, wenn er nur eine Fleischwanze sieht. Ich glaube nicht, dass er erwischt wurde. Du willst mich doch übers Ohr hauen! Ich werde Diego das Paket bei nächster Gelegenheit selber bringen.“\n\nQuest fehlgeschlagen!"
      },
      opt3_lester: {
        text: "Lester: „Dieser Mistkerl hat sich schon wieder so viel reingezogen, naja immerhin hast du nun mein Vertrauen. Hier nimm das Paket! Wenn du ihn nochmal siehst, sag ihm, er soll sich erst wieder blicken lassen, wenn er meine Traumruf hat!“\n\nDu verlierst eine Ration Traumruf! Du erhältst 20*Kapitel Erfahrung, eine Reste Ration Traumruf und Diegos Paket.",
        condition: "Gehe ins alte Lager!",
        onEnter: function(h) { window.loseQuestItem('Ration Traumruf', 1); window.gainXp(20*(h.chapter||1)); window.gainQuestItem('Reste Ration Traumruf', 1); window.gainQuestItem('Diegos Paket', 1); }
      },
      opt3_end: {
        text: "Diego: „Und hast du mein Paket?“\n\nSträfling: „Ja hier ist es. Lester wollte...“\n\nDiego: „Das ist mir egal! Gib mir das Paket, ich möchte damit allein sein! DU hast dich damit auf jeden Fall nützlich für das Lager gemacht! Hier für deine Mühen!“\n\nDu erhältst 20 Erz, 30*Kapitel Erfahrung und 1 Anschlusspunkt im alten Lager.",
        onEnter: function(h) { window.loseQuestItem('Diegos Paket', 1); window.gainOre(20); window.gainXp(30*(h.chapter||1)); window.gainConnectionPoint('Altes Lager'); }
      }
    }
  },
  "Gorn": {
    id: "Gorn",
    title: "Snapperjagd",
    giver: "Gorn",
    img: "Bilder Karten/Personen/Quest/Gorn.png",
    firstSpeech: "Gorn: „Hei Neuer. Dich habe ich hier noch nie gesehen. Du siehst aus, als gehst du gerne jagen. Was sagst du, gehen wir zusammen ein wenig jagen? Wenn du dich gut anstellst, kannst du auch die ganze Beute behalten. Ich will eigentlich nur aus diesem verdammten Lager raus und trainieren, aber diese Viecher sind gewiefter als man glaubt. Allein ist man ruckzuck umkreist. Zusammen machen wir sicher eine bessere Figur.“",
    dialogs: {
      accepted: {
        text: "Gorn: „Hei Neuer. Dich habe ich hier noch nie gesehen. Du siehst aus, als gehst du gerne jagen. Was sagst du, gehen wir zusammen ein wenig jagen? Wenn du dich gut anstellst, kannst du auch die ganze Beute behalten. Ich will eigentlich nur aus diesem verdammten Lager raus und trainieren, aber diese Viecher sind gewiefter als man glaubt. Allein ist man ruckzuck umkreist. Zusammen machen wir sicher eine bessere Figur.“",
        condition: "Gehe zu Feld 35!"
      },
      snapper_kampf: {
        text: "Gorn: „Ja hier lauern immer wieder welche rum.“ Drei Snapper erscheinen.\n\nGorn: „Da ist wieder eins von diesen Mistviechern! Ich gehe vor, halt du mir einfach den Rücken frei!“\n\nDer Kampf beginnt! Du kannst nicht fliehen!",
        options: [
          { text: "[Ihr gewinnt den Kampf!]", nextStep: "opt1_gorn" },
          { text: "[Ihr verliert den Kampf bzw. dein Leben geht auf 0!]", nextStep: "opt2_fail" }
        ]
      },
      opt1_gorn: {
        text: "Gorn: „Guter Kampf! Danke für deine Hilfe! Ohne dich wären sie sicher mir in den Rücken gefallen!“\n\nSträfling: „Wenn du meinst.“\n\nGorn: „Hier da ist der Gefahrenbonus schon inbegriffen.“\n\nDu erhältst 20 Erfahrung, 30 Erz und 1 Anschlusspunkt im neuen Lager!\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainXp(20); window.gainOre(30); window.gainConnectionPoint('Neues Lager'); }
      },
      opt2_fail: {
        text: "Du kommst im Neuen Lager vollständig regeneriert zu dir.\n\nGorn: „Schwache Leistung da draußen! Ein kleiner Windstoß und du wärst auch umgefallen. Dich nehm ich nicht nochmal mit auf die Jagd!“\n\nQuest fehlgeschlagen!",
        onEnter: function(h) { h.hp.current = h.hp.max; }
      }
    }
  },
  "Whistler": {
    id: "Whistler",
    title: "Der Friseur",
    giver: "Whistler",
    img: "Bilder Karten/Personen/Quest/Whistler.png",
    firstSpeech: "Whistler: „Hei, hör mal kleiner. Willst du dir ein bisschen Erz verdienen? Letzte Nacht als ich geschlafen habe, hat sich einer dieser feigen Buddler in meine Hütte geschlichen und mir „einfach aus Spaß“, den Kopf kahlgeschoren. Ich bin mir sicher, dass sich der Feigling draußen vorm Lager aufhält. Er hat sich sicher im Wald versteckt und wartet, bis Gras über die Sache gewachsen ist. Ich möchte, dass du diesem miesen Schwein die Fresse polierst. Wenn du das machst, springt auch ein ordentliches Sümmchen für dich raus. Ich kann das leider nicht machen. Wenn die Gardisten spitz kriegen, dass ich als Schatten einfach einen Buddler verdresche krieg ich selber Prügel. Bei dir ist das anders, von dir erwartet man, dass du Streit mit Buddlern hast, Neuer.“",
    dialogs: {
      accepted: {
        text: "Whistler: „Hei, hör mal kleiner. Willst du dir ein bisschen Erz verdienen? Letzte Nacht als ich geschlafen habe, hat sich einer dieser feigen Buddler in meine Hütte geschlichen und mir „einfach aus Spaß“, den Kopf kahlgeschoren. Ich bin mir sicher, dass sich der Feigling draußen vorm Lager aufhält. Er hat sich sicher im Wald versteckt und wartet, bis Gras über die Sache gewachsen ist. Ich möchte, dass du diesem miesen Schwein die Fresse polierst. Wenn du das machst, springt auch ein ordentliches Sümmchen für dich raus. Ich kann das leider nicht machen. Wenn die Gardisten spitz kriegen, dass ich als Schatten einfach einen Buddler verdresche krieg ich selber Prügel. Bei dir ist das anders, von dir erwartet man, dass du Streit mit Buddlern hast, Neuer.“",
        condition: "Gehe zu Feld 89!"
      },
      buddler_treffen: {
        text: "Buddler: „Hey Mann das ist mein Wald. Verschwinde hier oder ICH RASIER DICH; DU PENNER!“\n\nSträfling: „Immer mit der Ruhe ich bin erst neu hier! Ich sehe ich bin hier an der richtigen Adresse. Whistler sucht dich!“\n\nBuddler: „Was Whistler hat was über mich gesagt. Ich will kein Stress mit dem Typen… (stotternd) Ich… das war nurn Witz… Man… ich war vollkommen zu und dachte so sehe er besser aus.“\n\nSträfling: „Du hast trotzdem jetzt Ärger. Whistler ist außer sich! Er will, dass ich dich umniete.“\n\nBuddler: „Scheiße man lass mich einfach in Ruhe. Hier ich schneid mir ein paar Haare ab. Behaupte bitte du hast mich skalpiert!“",
        options: [
          { text: "[Sträfling: „Was hätte ich davon, wenn ich dir helfe?“]", nextStep: "opt1_haare" },
          { text: "[Sträfling: „Ich glaube Whistler will dich einfach leiden sehen. Ich mach dich fertig.“]", nextStep: "opt2_kampf" },
          { text: "[Sträfling: „Man Whistler will dich sehen. Er fand das alles witzig. Komm wieder ins Lager. Er will jetzt, dass du ihm jeden Monat die Haare scherst.“]", nextStep: "opt3_vermitteln" }
        ]
      },
      opt1_haare: {
        text: "Buddler: „Man ich hab nichts da! Ich kann dir irgendwas beibringen. Ich kann dir beibringen wie man Schlösser knackt.“\n\nPlatziere auf Feld 89 den Whistler-Chip, um zu markieren, dass du dort einen Lehrer für Schlösser 1 hast, dies kostet dich 50 Erz.\n\nSträfling: „In Ordnung ich werde Whistler deine Haare zeigen.“\n\nBuddler: „Danke man“",
        condition: "Gehe zurück ins Alte Lager!"
      },
      opt1_end: {
        text: "Sträfling: „Auge um Auge, Zahn um Zahn. Der Mistkerl hat gepennt. Da hab ich die Gelegenheit beim Schopfe gepackt. Hier sind seine Haare!“\n\nWhistler: „Du solltest ihm doch eine rein hauen und ihm nicht die Haare schneiden. Naja, eigentlich bin ich mit der Frisur mittlerweile zufrieden. Ich werde Diego sagen, dass du zu gebrauchen bist. Hier, mach dass du wegkommst.“\n\nDu erhältst 20 Erz und 10*Kapitel Erfahrung.\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainOre(20); window.gainXp(10 * (h.chapter||1)); }
      },
      opt2_kampf: {
        text: "Ein Kampf gegen „Der Friseur“ beginnt!\n\nWenn du den Kampf gewinnst gehe zu Whistler. Wenn du verlierst wachst du auf einem der nebenliegenden Felder wieder auf, ohne Erz und aktive Waffe. Die Quest kann erst fortgesetzt werden, wenn der Friseur besiegt ist!",
        options: [
          { text: "[Gewinne den Kampf und gehe zurück ins alte Lager]", nextStep: "opt2_end" }
        ]
      },
      opt2_end: {
        text: "Whistler: „Gut, dass ich dich treffe. Ich hoffe du hast den Buddler noch nicht alle gemacht. Nun. Ich bin ganz zufrieden mit meiner neuen Frisur. Ich habe noch nie so viele Komplimente in meinem Leben bekommen.“\n\nSträfling: „Nun, ja. Dann brauchst du jetzt wohl einen neuen Friseur!“\n\nWhistler: „Soll das heißen..“\n\nSträfling: „Jetzt frisiert er Innos!“\n\nWhistler: „NEEEINNN! Naja, immerhin hast du getan was ich dir gesagt habe. Ich werde vor Diego für dich sprechen.“\n\nDu erhältst 1 Anschlusspunkt im alten Lager und 10 Erz.\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainConnectionPoint('Altes Lager'); window.gainOre(10); }
      },
      opt3_vermitteln: {
        text: "Buddler: „Wirklich man, danke. Ich hatte schon Schiss vor den Lurkern da hinten am Fluss.“",
        condition: "Gehe zurück ins Alte Lager!"
      },
      opt3_end: {
        text: "Whistler: „Aaah da bist du ja… Danke… Man!... Alle finden die Glatze steht mir richtig gut. Die Gardisten sagen die Frauen bei Gomez stehen auf Typen mit Glatzen. Ich schulde dir was! Eigentlich solltest du ihm ja die Fresse polieren, das war doch dein Auftrag, aber gut, dass du es nicht gemacht hast. Hier für deine Mühen.“\n\nDu erhältst 20 Erz, 30*Kapitel Erfahrung und 1 Anschlusspunkt im alten Lager.\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainOre(20); window.gainXp(30 * (h.chapter||1)); window.gainConnectionPoint('Altes Lager'); }
      }
    }
  },
  "Caine": {
    id: "Caine",
    title: "Das Übermächtige Käfer",
    giver: "Caine",
    img: "Bilder Karten/Personen/Quest/Caine.png",
    firstSpeech: "Caine: „Na neu hier? Ich bin Caine. Ich versuche hier Fuß zu fassen. Ich will bei Meister Kalom in die Lehre, aber er will mich nicht annehmen, wenn ich mich nicht als würdig erweise. Er will doch tatsächlich von mir Minecrawlerzangen haben. Diese Biester sind verdammt stark. Ich habe schon mal gegen einen gekämpft und ihm auch ganz schön zugesetzt. Aber dann kamen mehrere von diesen Biestern und haben mich fast umgebracht. Das verletzte Mistvieh hat mich aus der Mine verfolgt und läuft jetzt irgendwo im Wald vor dem Lager rum. Wenn du das Vieh zur Strecke bringst und mir seine Klauen bringst, werde ich dir alles geben, was ich habe.“",
    dialogs: {
      accepted: {
        text: "Caine: „Na neu hier? Ich bin Caine. Ich versuche hier Fuß zu fassen. Ich will bei Meister Kalom in die Lehre, aber er will mich nicht annehmen, wenn ich mich nicht als würdig erweise. Er will doch tatsächlich von mir Minecrawlerzangen haben. Diese Biester sind verdammt stark. Ich habe schon mal gegen einen gekämpft und ihm auch ganz schön zugesetzt. Aber dann kamen mehrere von diesen Biestern und haben mich fast umgebracht. Das verletzte Mistvieh hat mich aus der Mine verfolgt und läuft jetzt irgendwo im Wald vor dem Lager rum. Wenn du das Vieh zur Strecke bringst und mir seine Klauen bringst, werde ich dir alles geben, was ich habe.“",
        condition: "Gehe zu Feld 140!"
      },
      crawler_kampf: {
        text: "Dort begegnet dir ein „Verwundeter Crawler“. Der Kampf beginnt!\n\nWenn du verlierst wachst du auf einem der nebenliegenden Felder wieder auf, ohne Erz und aktive Waffe. Die Quest kann erst fortgesetzt werden, wenn der verwundete Minecrawler besiegt ist!",
        options: [
          { text: "[Gewinne den Kampf und nimm die Zangen]", nextStep: "crawler_besiegt" }
        ]
      },
      crawler_besiegt: {
        text: "Du erhältst Minecrawlerzangen!",
        condition: "Gehe zurück ins Sektenlager!",
        onEnter: function(h) { window.gainQuestItem('Minecrawlerzangen', 1); }
      },
      end: {
        text: "Caine: „Erwache! Hast du sie? Ich brauche die Zangen dringend!“\n\nSträfling: „Ja aber das Mistvieh hat mir ganz schön zugesetzt! Ich möchte keinen gesunden Crawler treffen! Hier hast du deine Zange!“\n\nDu verlierst Minecrawlerzangen!\n\nCaine: „Danke man, ich werde Meister Kalom mitteilen, dass du nützlich bist.“\n\nDu erhältst 40 Erfahrung und 1 Anschlusspunkt im Sektenlager.\n\nQuest erfolgreich!",
        onEnter: function(h) { window.loseQuestItem('Minecrawlerzangen', 1); window.gainXp(40); window.gainConnectionPoint('Sektenlager'); }
      }
    }
  },
  "Homer": {
    id: "Homer",
    title: "Die Frau am Teich",
    giver: "Homer",
    img: "Bilder Karten/Personen/Quest/Homer.png",
    firstSpeech: "Homer: „Hei Neuer. Ich habe dich hier noch nie gesehen. Ich bin Homer. Das hier ist meine Taverne. Hmmm. Ich glaube du kannst mir helfen. Die Reisbauern besaufen sich hier gerne mal und erzählen sich so allerlei Scheiß. Aber eine Geschichte habe ich hier schon öfter gehört und ich fange langsam an selbst dran zu glauben. Vor dem Lager am alten Fischerteich soll sich eine hübsche junge Frau versteckt halten, die aus dem alten Lager geflohen sein soll. Einer meiner Freunde, der aufgebrochen ist, sie zu suchen kam einfach nicht wieder. Am nächsten Tag hat einer der Reisbauern behauptet gesehen zu haben, wie eine Frau am Fischerteich einen Mann ertränkt haben soll. Sieh du für mich nach was da dran ist. Ich habe gehört es soll dort irgendwo eine versteckte Höhle geben wo sie sich aufhält.“",
    dialogs: {
      accepted: {
        text: "Homer: „Hei Neuer. Ich habe dich hier noch nie gesehen. Ich bin Homer. Das hier ist meine Taverne. Hmmm. Ich glaube du kannst mir helfen. Die Reisbauern besaufen sich hier gerne mal und erzählen sich so allerlei Scheiß. Aber eine Geschichte habe ich hier schon öfter gehört und ich fange langsam an selbst dran zu glauben. Vor dem Lager am alten Fischerteich soll sich eine hübsche junge Frau versteckt halten, die aus dem alten Lager geflohen sein soll. Einer meiner Freunde, der aufgebrochen ist, sie zu suchen kam einfach nicht wieder. Am nächsten Tag hat einer der Reisbauern behauptet gesehen zu haben, wie eine Frau am Fischerteich einen Mann ertränkt haben soll. Sieh du für mich nach was da dran ist. Ich habe gehört es soll dort irgendwo eine versteckte Höhle geben wo sie sich aufhält.“",
        condition: "Gehe zu Feld 158!"
      },
      fischerteich: {
        text: "Am See angekommen, siehst du dich erstmal um. Du gehst in die Fischerhütte, dort findest du nichts. Als du aus dem Fenster blickst siehst du eine Höhle an der Felswand. Du gehst zur Höhle. Aus der Höhle erklingt eine weibliche Stimme. Du lugst vorsichtig um die Ecke.\n\nFrau: „Nur nicht so schüchtern! Komm herein, leiste mir Gesellschaft!“\n\nSträfling: „Wer bist du? Was machst du hier… Ich habe hier noch nie eine Frau gesehen…“\n\nFrau: „Ja die meisten hat Gomez auch in seinen Gemächern eingesperrt, aber ich konnte fliehen. Jetzt vertreib ich mir die Zeit hier am See, da kann ich immerhin nen paar Fische rausholen. Ins Neue Lager traue ich mich nicht. Die Vergewaltiger kann ich bis hier hin riechen!“\n\nSträfling: „Du scheinst aber den Leuten aufgefallen zu sein. Es gibt Gerüchte du hättest einen Mann im See ertränkt.“\n\nFrau: „Wie kannst du es wagen mich des Mordes zu bezichtigen. Ich versuche doch nur hier zu überleben! Hier draußen ist es so kalt und ich bin so einsam. Ich sehne mich nach einem starken Mann an meiner Seite, der mir diese ganzen Suffköpfe vom Leib hält.“\n\nSie rückt dir auf die Pelle. Erregt und verwirrt zugleich beginnst du zu stammeln.\n\nSträfling: „Ähm…Ähm… Im Neuen Lager gibt es auch viele starke Söldner … die scheinen nicht so …“\n\nPlötzlich hörst du wie sie hinter ihrem Rücken ein Messer aus der Scheide zieht. Du weichst erschrocken zurück. Sie springt wahnsinnig mit dem Messer auf dich zu!\n\nFrau: „Ich gehöre Niemandem!!“\n\nKampf gegen „Die Frau am See“ beginnt!",
        options: [
          { text: "[Gewinne den Kampf]", nextStep: "natalia_gerettet" }
        ]
      },
      natalia_gerettet: {
        text: "Es war nicht einfach die Frau kampfunfähig zu machen. Du wartest bis sie wieder zu sich kommt.\n\nSträfling: „Hier trink erstmal etwas! Ich hatte nicht vor dich zu töten, was anscheinend nicht auf Gegenseitigkeit beruht.“\n\nFrau: „Naja was würdest du tun, wenn irgendein verranzter Penner wie du hier hereinmaschiert und meint mir was erzählen zu müssen?“\n\nSträfling: „Wie und wenn ich nicht verranzt wäre, wärst du mir in die arme gefallen und hättest mich nicht attackiert?“\n\nFrau: „Zu einem Ritter in schimmernder Rüstung kann doch keine holde Maid Nein sagen. Aber darum geht es jetzt nicht. Warum hast du mich nicht umgebracht? Ich habe eigentlich gehofft hier zu sterben. Kurz und schmerzlos!“\n\nSträfling: „In der Kolonie sterben ständig genug Leute, aber Frauen wie dich, die hier an uns Ganoven verkauft werden, sollten nicht auch noch hier enden müssen. Ich verspreche dir, dass ich einen Weg hier rausfinde.“\n\nFrau: „Und was mach ich dann in der Zwischenzeit, ach du strahlender Held?“\n\nSträfling: „Du solltest nicht hier in der Wildnis dein Dasein fristen! Ich könnte dich zu Y´Berion bringen. Er ist wahrscheinlich nicht so wie Gomez…“\n\nFrau: „Ja, ist wahrscheinlich besser. Die Sektenspinner kriegen bei dem ganzen Gekiffe bestimmt eh keinen mehr hoch um mich zu vergewaltigen. Da bin ich sicherlich besser aufgehoben. Ich bin übrigens Natalia.“\n\nSie schließt sich dir an. Sie ist wieder vollständig regeneriert.",
        condition: "Bringe sie lebend ins Sektenlager! Sie kämpft mit dir!"
      },
      sektenlager_tempel: {
        text: "Im Sektenlager wird die Frau direkt von den Sektenleuten begafft. Aber du führst sie schnurstracks zu Y´Berions Tempel.\n\nWache: „Was willst du? Niemandem ist es einfach so gestattet zu dem Meister vorzudringen.“\n\nSträfling: „Nun ja, sagen wir mal, ich will ihm ein Angebot machen, dass er nicht ausschlagen kann.“ Natalia erscheint neben dir, sodass der Templer sie sehen kann.\n\nWache: „AHHH! Der Meister wird hocherfreut sein. Kommt herein!“\n\nSträfling: „Meister Y´Berion, ich bringe dir etwas Besonderes!“\n\nY´Berion: (heftiges schniefen) „Na wunderbar. Der Schläfer wird sich an dieser Schönheit erfreuen. Sie wird ihm gute Dienste verrichten. Wo du sie her hast, will ich gar nicht wissen. Nimm einfach diese Belohnung!“\n\nDu erhältst 100 Erz, 50*Kapitel Erfahrung, einen Ring der Präsenz. Nach 3-mal Klicken auf den Button neue Runde spürst du eine Präsenz!",
        condition: "Gehe zurück ins Neue Lager!",
        onEnter: function(h) { window.gainOre(100); window.gainXp(50 * (h.chapter || 1)); window.gainQuestItem('Ring der Präsenz', 1); }
      },
      end: {
        text: "Du sprichst mit Homer.\n\nHomer: „Und, lebt an dem See wirklich eine schöne Frau?“\n\nSträfling: „Nein!“\n\nHomer: „Schade, naja immerhin weiß ich jetzt, dass der Bauer nen Suffkopp und notgeil ist. Danke.“\n\nDu erhältst 20 Erz und 30*Kapitel Erfahrung.\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainOre(20); window.gainXp(30 * (h.chapter || 1)); }
      }
    }
  },
  "Fletcher": {
    id: "Fletcher",
    title: "Ablösung gesucht!",
    giver: "Fletcher",
    img: "Bilder Karten/Personen/Quest/Fletcher.png",
    firstSpeech: "Fletcher: „Hei du. Komm mal her. Ich habe gehört, dass du hier arbeiten willst. Ich hätte da eine Kleinigkeit für dich zu tun. Draußen vor dem Lager Richtung Süden hält sich ein Typ namens Pacho auf. Der pennt den ganzen Tag unter so ‘nem schimmligen Baum. Der faule Schweinehund soll zu seinem Dienst antreten. Und tauch hier bloß nicht wieder auf, bis sich der Kerl hier blicken lässt.“",
    dialogs: {
      accepted: {
        text: "Fletcher: „Hei du. Komm mal her. Ich habe gehört, dass du hier arbeiten willst. Ich hätte da eine Kleinigkeit für dich zu tun. Draußen vor dem Lager Richtung Süden hält sich ein Typ namens Pacho auf. Der pennt den ganzen Tag unter so ‘nem schimmligen Baum. Der faule Schweinehund soll zu seinem Dienst antreten. Und tauch hier bloß nicht wieder auf, bis sich der Kerl hier blicken lässt.“",
        condition: "Gehe zu Feld 78!"
      },
      pacho_treffen: {
        text: "Pacho: „Kleiner! Pass auf, wo du lang gehst, folgst du dem Pfad hier, kommst du ins Orkgebiet. Mit den Viechern willst du dich nicht anlegen!“\n\nSträfling: „Will ich auch nicht! Ich suche eigentlich dich! Fletcher will dich beim Dienst sehen. Er hat kein Bock mehr den Ersatzmann für eure Viertel zu spielen.“\n\nPacho: „Neee, Mann! Ich zieh lieber noch einen durch… (er raucht einen Stängel Traumruf und schläft ein)“\n\nSträfling: „Ahh, Mist! Gut dass ich für solche Fälle immer einen Plan habe…“\n\nDu hackst ihm 2 Finger ab, Pacho wacht wieder auf, ist aber immer noch sehr drauf. Du packst dir die abgehackten Finger und rennst zurück ins Lager. Du erhältst Pachos Finger.",
        condition: "Wirf alle deine Aktionskarten ab.",
        onEnter: function(h) { window.gainQuestItem('Pachos Finger', 1); }
      },
      end: {
        text: "Du bist wieder im Alten Lager und begegnest Fletcher.\n\nSträfling: „Ey, hör mal! Ich glaube Pacho gibt es nicht mehr. Ich habe unter dem Baum nur zwei Finger gefunden!“\n\nFletcher: „Nicht schon wieder so ein Versager. Dann muss ich wohl Nek suchen gehen. Irgendwer muss hier diese Scheiße übernehmen. Hier für deine Mühen!“\n\nDu erhältst 10 Erz und 20*Kapitel Erfahrung. Für dich bleibt Feld 78 gesperrt, es sei denn, man will mit Pacho kämpfen. Platziere hierfür den Fletcher-Chip auf Feld 78!\n\nQuest erfolgreich!",
        onEnter: function(h) { window.loseQuestItem('Pachos Finger', 1); window.gainOre(10); window.gainXp(20 * (h.chapter || 1)); }
      }
    }
  },
  "Mordrag": {
    id: "Mordrag",
    title: "Ein Glücksgriff?!",
    giver: "Mordrag",
    img: "Bilder Karten/Personen/Händler/Mordrag.png",
    firstSpeech: "Mordrag: „Psst. Komm mal rüber hier. Ich habe gesehen wie du dich hier umsiehst. Du scheinst etwas vorzuhaben. Ich kann dich nur warnen. Wenn du hier was stehlen willst, bist du an der falschen Adresse. Die Typen hier stehlen dir deine Hose ohne, dass du es merkst. Sogar noch bevor du nur daran denken kannst sie auszurauben. Ganz anders als die Schwachmaten im Sektenlager. Denen etwas zu stehlen ist einfacher als es nicht zu machen. Ich hätte da einen Auftrag für dich. Wenn du eine Sache für mich besorgst, kriegst du eine schöne Waffe von mir was sagst du? Einer der Sektenspinner soll irgendwie in den Besitz eines besonders seltenen Schriftstückes gekommen sein. Der Kerl heißt Nyras. Wenn du mir das Ding bringst, kriegst du auch ´ne Waffe von mir.“",
    dialogs: {
      accepted: {
        text: "Mordrag: „Psst. Komm mal rüber hier. Ich habe gesehen wie du dich hier umsiehst. Du scheinst etwas vorzuhaben. Ich kann dich nur warnen. Wenn du hier was stehlen willst, bist du an der falschen Adresse. Die Typen hier stehlen dir deine Hose ohne, dass du es merkst. Sogar noch bevor du nur daran denken kannst sie auszurauben. Ganz anders als die Schwachmaten im Sektenlager. Denen etwas zu stehlen ist einfacher als es nicht zu machen. Ich hätte da einen Auftrag für dich. Wenn du eine Sache für mich besorgst, kriegst du eine schöne Waffe von mir was sagst du? Einer der Sektenspinner soll irgendwie in den Besitz eines besonders seltenen Schriftstückes gekommen sein. Der Kerl heißt Nyras. Wenn du mir das Ding bringst, kriegst du auch ´ne Waffe von mir.“",
        condition: "Gehe zu Feld 136!"
      },
      nyras_treffen: {
        text: "Nyras: „Hey was machst du hier im Sumpf? Du willst uns doch wohl nicht das Sumpfkraut wegnehmen?!“\n\nSträfling: „Ich bin im Sumpf!? Ich wollte hier nicht hin... ich hab mich verlaufen. Hast du zufällig ne Karte für mich?“\n\nNyras wühlt in seiner Tasche rum. Er zerrt drei Pergamentrollen heraus.\n\nNyras: „(murmelnd) Eine von den muss doch die Karte sein.“\n\nDu greifst so schnell wie möglich nach den Zetteln. Du erhältst so viele wie du Geschick hast.",
        options: [
          { text: "[Option 1: Du hast 1 Geschick]", nextStep: "opt1_geschick" },
          { text: "[Option 2: Du hast 2 Geschick]", nextStep: "opt2_geschick" },
          { text: "[Option 3: Du hast 3 oder mehr Geschick]", nextStep: "opt3_geschick" }
        ]
      },
      opt1_geschick: {
        text: "Du erhältst zufällig eins von 3 Schriftstücken (Nyras Bild, Nyras Karte oder Nyras Spruchrolle). Du rennst so schnell wie möglich weg.\n\nDu rennst aus dem Sumpflager und findest dich auf Feld 131 wieder.\n\nNyras: „Bleib stehen, du Lump!“ Du kannst bei Nyras keine Quests mehr annehmen.",
        condition: "Lege deine Aktionskarten ab und gehe zurück ins Neue Lager!",
        onEnter: function(h) {
          const items = ['Nyras Bild', 'Nyras Karte', 'Nyras Spruchrolle'];
          const rand = items[Math.floor(Math.random() * items.length)];
          window.gainQuestItem(rand, 1);
        }
      },
      opt1_end: {
        text: "Du übergibst Mordrag deine Beute.\n\nNyras Spruchrolle: Du erhältst einen Schmiedehammer, 30*Kapitel Erfahrung und 1 Anschlusspunkt im neuen Lager!\n\nNyras Bild: Du erhältst einen Schmiedehammer, 30*Kapitel Erfahrung, 20 Erz und 1 Anschlusspunkt im neuen Lager!\n\nNyras Karte: Du erhältst einen Schmiedehammer und 10*Kapitel Erfahrung.",
        onEnter: function(h) {
          const hasScroll = h.inventory.some(i => i.name === 'Nyras Spruchrolle');
          const hasImage = h.inventory.some(i => i.name === 'Nyras Bild');
          const hasMap = h.inventory.some(i => i.name === 'Nyras Karte');
          if (hasScroll) {
            window.loseQuestItem('Nyras Spruchrolle', 1);
            window.lootItem('Schmiedehammer', 'Waffen', 'swords', 10, 'Bilder Karten/Waffen/Kapitel 1/Schmiedehammer.png');
            window.gainXp(30 * (h.chapter||1));
            window.gainConnectionPoint('Neues Lager');
          } else if (hasImage) {
            window.loseQuestItem('Nyras Bild', 1);
            window.lootItem('Schmiedehammer', 'Waffen', 'swords', 10, 'Bilder Karten/Waffen/Kapitel 1/Schmiedehammer.png');
            window.gainXp(30 * (h.chapter||1));
            window.gainOre(20);
            window.gainConnectionPoint('Neues Lager');
          } else if (hasMap) {
            window.loseQuestItem('Nyras Karte', 1);
            window.lootItem('Schmiedehammer', 'Waffen', 'swords', 10, 'Bilder Karten/Waffen/Kapitel 1/Schmiedehammer.png');
            window.gainXp(10 * (h.chapter||1));
          }
        }
      },
      opt2_geschick: {
        text: "Du erhältst zufällig 2 von 3 Schriftstücken (Nyras Bild, Nyras Karte oder Nyras Spruchrolle). Du rennst so schnell wie möglich weg.\n\nDu rennst aus dem Sumpflager und findest dich auf Feld 131 wieder.\n\nNyras: „Bleib stehen, du Lump!“ Du kannst bei Nyras keine Quests mehr annehmen.",
        condition: "Lege deine Aktionskarten ab und gehe zurück ins Neue Lager!",
        onEnter: function(h) {
          const items = ['Nyras Bild', 'Nyras Karte', 'Nyras Spruchrolle'];
          // Shuffle and pick 2
          items.sort(() => Math.random() - 0.5);
          window.gainQuestItem(items[0], 1);
          window.gainQuestItem(items[1], 1);
        }
      },
      opt2_end: {
        text: "Du übergibst Mordrag einen Gegenstand deiner Wahl.\n\nNyras Spruchrolle: Du erhältst einen Schmiedehammer, 30*Kapitel Erfahrung und 1 Anschlusspunkt im neuen Lager!\n\nNyras Bild: Du erhältst einen Schmiedehammer, 30*Kapitel Erfahrung, 20 Erz und 1 Anschlusspunkt im neuen Lager!\n\nNyras Karte: Du erhältst einen Schmiedehammer und 10*Kapitel Erfahrung.",
        onEnter: function(h) {
          // Remove the first matching one found in inventory
          let removed = false;
          if (h.inventory.some(i => i.name === 'Nyras Bild')) {
            window.loseQuestItem('Nyras Bild', 1);
            window.lootItem('Schmiedehammer', 'Waffen', 'swords', 10, 'Bilder Karten/Waffen/Kapitel 1/Schmiedehammer.png');
            window.gainXp(30 * (h.chapter||1));
            window.gainOre(20);
            window.gainConnectionPoint('Neues Lager');
            removed = true;
          } else if (h.inventory.some(i => i.name === 'Nyras Spruchrolle')) {
            window.loseQuestItem('Nyras Spruchrolle', 1);
            window.lootItem('Schmiedehammer', 'Waffen', 'swords', 10, 'Bilder Karten/Waffen/Kapitel 1/Schmiedehammer.png');
            window.gainXp(30 * (h.chapter||1));
            window.gainConnectionPoint('Neues Lager');
            removed = true;
          } else if (h.inventory.some(i => i.name === 'Nyras Karte')) {
            window.loseQuestItem('Nyras Karte', 1);
            window.lootItem('Schmiedehammer', 'Waffen', 'swords', 10, 'Bilder Karten/Waffen/Kapitel 1/Schmiedehammer.png');
            window.gainXp(10 * (h.chapter||1));
            removed = true;
          }
        }
      },
      opt3_geschick: {
        text: "Du erhältst alle 3 Schriftstücke (Nyras Bild, Nyras Karte und Nyras Spruchrolle). Du rennst so schnell wie möglich weg.\n\nDu rennst aus dem Sumpflager und findest dich auf Feld 131 wieder.\n\nNyras: „Bleib stehen, du Lump!“ Du kannst bei Nyras keine Quests mehr annehmen.",
        condition: "Lege deine Aktionskarten ab und gehe zurück ins Neue Lager!",
        onEnter: function(h) {
          window.gainQuestItem('Nyras Bild', 1);
          window.gainQuestItem('Nyras Karte', 1);
          window.gainQuestItem('Nyras Spruchrolle', 1);
        }
      },
      opt3_end: {
        text: "Du übergibst Mordrag einen Gegenstand deiner Wahl.\n\nNyras Spruchrolle: Du erhältst einen Schmiedehammer, 30*Kapitel Erfahrung und 1 Anschlusspunkt im neuen Lager!\n\nNyras Bild: Du erhältst einen Schmiedehammer, 30*Kapitel Erfahrung, 20 Erz und 1 Anschlusspunkt im neuen Lager!\n\nNyras Karte: Du erhältst einen Schmiedehammer und 10*Kapitel Erfahrung.",
        onEnter: function(h) {
          if (h.inventory.some(i => i.name === 'Nyras Bild')) {
            window.loseQuestItem('Nyras Bild', 1);
            window.lootItem('Schmiedehammer', 'Waffen', 'swords', 10, 'Bilder Karten/Waffen/Kapitel 1/Schmiedehammer.png');
            window.gainXp(30 * (h.chapter||1));
            window.gainOre(20);
            window.gainConnectionPoint('Neues Lager');
          } else if (h.inventory.some(i => i.name === 'Nyras Spruchrolle')) {
            window.loseQuestItem('Nyras Spruchrolle', 1);
            window.lootItem('Schmiedehammer', 'Waffen', 'swords', 10, 'Bilder Karten/Waffen/Kapitel 1/Schmiedehammer.png');
            window.gainXp(30 * (h.chapter||1));
            window.gainConnectionPoint('Neues Lager');
          } else if (h.inventory.some(i => i.name === 'Nyras Karte')) {
            window.loseQuestItem('Nyras Karte', 1);
            window.lootItem('Schmiedehammer', 'Waffen', 'swords', 10, 'Bilder Karten/Waffen/Kapitel 1/Schmiedehammer.png');
            window.gainXp(10 * (h.chapter||1));
          }
        }
      }
    }
  },
  "Sly": {
    id: "Sly",
    title: "Der Vielfraß",
    giver: "Sly",
    img: "Bilder Karten/Personen/Quest/Sly.png",
    firstSpeech: "Sly: „Hei du, siehst aus als könntest du Arbeit gebrauchen. Ich habe schon seit Ewigkeiten nichts ordentliches mehr zwischen die Zähne gekriegt. Wenn du mir eine ordentliche Mahlzeit bringst, werde ich dich belohnen.“",
    dialogs: {
      accepted: {
        text: "Sly: „Hei du, siehst aus als könntest du Arbeit gebrauchen. Ich habe schon seit Ewigkeiten nichts ordentliches mehr zwischen die Zähne gekriegt. Wenn du mir eine ordentliche Mahlzeit bringst, werde ich dich belohnen.“\n\nSträfling: „Möchtest du was bestimmtes?“\n\nSly: „Nein ich hab so Kohldampf! Ich hau mir alles rein!“",
        condition: "Bringe Sly Nahrung im Wert von 10 Heilung!"
      },
      end: {
        text: "Sly: „Das ist genau, was ich brauchte. Danke man! Falls Diego mich fragt werde ich ein gutes Wort bei ihm einlegen.“\n\nDu erhältst 30*Kapitel Erfahrung und 1 Anschlusspunkt im alten Lager.\n\nQuest erfolgreich!",
        onEnter: function(h) {
          // Remove various foodstuffs worth at least 10 healing
          let healingRemoved = 0;
          h.inventory = h.inventory.filter(item => {
            if (item.category === 'Nahrung' && healingRemoved < 10) {
              const val = item.effect.includes('1 Leben') ? 1 :
                          item.effect.includes('2 Leben') ? 2 :
                          item.effect.includes('3 Leben') ? 3 :
                          item.effect.includes('5 Leben') ? 5 : 5;
              healingRemoved += val;
              return false;
            }
            return true;
          });
          window.gainXp(30 * (h.chapter||1));
          window.gainConnectionPoint('Altes Lager');
        }
      }
    }
  },
  "Joru": {
    id: "Joru",
    title: "Der Höhlen...Gänger",
    giver: "Joru",
    img: "Bilder Karten/Personen/Händler/Joru.png",
    firstSpeech: "Joru: „Na Kleiner, hast du die Scheiße hier auch satt? Ich muss hier raus. Ich habe schon ewig keine Frau mehr gehabt. Alles was hier gibt sind Kerle. Und Sumpfkraut. Und Viecher. Vor allem Molerats hasse ich am meisten. Da wollte ich mir mal außerhalb des Lagers etwas Spaß allein gönnen, und dann tauchen da diese Mistviecher auf. Ich habe meinen Scheiß Novizenrock in der Höhle zurückgelassen und bin vor Schreck nackt zurück ins Lager gerannt. Ich habe zwar von Bruder Lester einen Ersatzrock gekriegt, nur liegt mein ganzes Zeug jetzt in dieser Höhle. Wenn du mir meine Sachen zurückholst, kriegst du auch eine Belohnung von mir.“",
    dialogs: {
      accepted: {
        text: "Joru: „Na Kleiner, hast du die Scheiße hier auch satt? Ich muss hier raus. Ich habe schon ewig keine Frau mehr gehabt. Alles was hier gibt sind Kerle. Und Sumpfkraut. Und Viecher. Vor allem Molerats hasse ich am meisten. Da wollte ich mir mal außerhalb des Lagers etwas Spaß allein gönnen, und dann tauchen da diese Mistviecher auf. Ich habe meinen Scheiß Novizenrock in der Höhle zurückgelassen und bin vor Schreck nackt zurück ins Lager gerannt. Ich habe zwar von Bruder Lester einen Ersatzrock gekriegt, nur liegt mein ganzes Zeug jetzt in dieser Höhle. Wenn du mir meine Sachen zurückholst, kriegst du auch eine Belohnung von mir.“",
        condition: "Gehe zu Feld 133!"
      },
      molerat_kampf: {
        text: "Dort erscheinen zwei junge Molerats! Der Kampf beginnt!\n\nWenn du verlierst wachst du auf einem der nebenliegenden Felder wieder auf, ohne Erz und aktive Waffe. Die Quest kann erst fortgesetzt werden, wenn die Molerats besiegt sind!",
        options: [
          { text: "[Du gewinnst den Kampf!]", nextStep: "molerat_besiegt" }
        ]
      },
      molerat_besiegt: {
        text: "Du erhältst Jorus Rock, Jorus Traumruf und Jorus Zettel!",
        condition: "Gehe ins Sektenlager.",
        onEnter: function(h) {
          window.gainQuestItem('Jorus Rock', 1);
          window.gainQuestItem('Jorus Traumruf', 1);
          window.gainQuestItem('Jorus Zettel', 1);
        }
      },
      opt_auswahl: {
        text: "Was möchtest du tun?",
        options: [
          { text: "[Sträfling: „Hei man, ich hab deinen Kram gefunden... Bitte...schön...“]", nextStep: "opt1_abgeben" },
          { text: "[Du siehst den ganzen Kram genauer an und entscheidest, dass er bei dir besser aufgehoben ist!]", nextStep: "opt2_behalten" }
        ]
      },
      opt1_abgeben: {
        text: "Joru: „Hey da bist du ja wieder. Hast du mein Zeug gefunden?“\n\nSträfling: „Ja hier, ich geh mich jetzt erstmal waschen, gib mir aber wenigstens meine Belohnung!“\n\nJoru: „Ja natürlich. Vielen Dank. Möge der Schläfer dir Kraft verleihen!“\n\nDu verlierst Jorus Rock, Jorus Traumruf und Jorus Zettel!\n\nDu erhältst einen Ring der Schläferfaust (Ring der Präsenz), 15 Erz und 40*Kapitel Erfahrung!\n\nQuest erfolgreich!",
        onEnter: function(h) {
          window.loseQuestItem('Jorus Rock', 1);
          window.loseQuestItem('Jorus Traumruf', 1);
          window.loseQuestItem('Jorus Zettel', 1);
          window.gainQuestItem('Ring der Präsenz', 1);
          window.gainOre(15);
          window.gainXp(40 * (h.chapter||1));
        }
      },
      opt2_behalten: {
        text: "Du entscheidest dich, Jorus Sachen zu behalten. Du kannst nicht mehr mit Joru interagieren.\n\nQuest fehlgeschlagen!",
        onEnter: function(h) {}
      }
    }
  },
  "Nek": {
    id: "Nek",
    title: "Der lebende Gardist!",
    giver: "Nek",
    img: "Bilder Karten/Personen/Quest/Nek.png",
    firstSpeech: "Nek: „Hei du, hilf mir. Ich glaube ich werde verfolgt. Ständig, wenn ich mich umsehe ist da ein Schatten. Ich glaube irgendwer ist hinter mir her. Du musst mir helfen. Ganz in der Nähe des Lagers soll es eine Höhle geben. Da will ich mich verstecken. Vielleicht zeigt sich ja irgendwann dort mein Verfolger. Gehst du mit mir zur Höhle und hältst mir den Rücken frei?“",
    dialogs: {
      accepted: {
        text: "Nek: „Hei du, hilf mir. Ich glaube ich werde verfolgt. Ständig, wenn ich mich umsehe ist da ein Schatten. Ich glaube irgendwer ist hinter mir her. Du musst mir helfen. Ganz in der Nähe des Lagers soll es eine Höhle geben. Da will ich mich verstecken. Vielleicht zeigt sich ja irgendwann dort mein Verfolger. Gehst du mit mir zur Höhle und hältst mir den Rücken frei?“",
        condition: "Gehe zu Feld 86!"
      },
      hoehle_ankunft: {
        text: "Nek: „Hier sollte es sein. Hier wird mich keiner finden....“ (Ein Quieken erklingt aus der Höhle!)\n\nNek: „Geh mal rein und guck was da los ist!“\n\nSträfling: „Du bist hier der Gardist. Geh du vor!“\n\nNek: „Deswegen gebe ich hier die Befehle und ich gehe nach dir in die Höhle.“\n\nZögernd betritt man die Höhle. In der Ecke quieken 6 Babymolerats ängstlich vor sich rum.\n\nSträfling: „Die Höhle ist leider von einer Moleratfamilie belegt!“\n\nNek: „Die Biester geben einfach nicht auf!“\n\nNek stürzt wie ein Wahnsinniger in die Höhle! Du beobachtest ihn, wie er die Babys brutal abschlachtet.\n\nDu flüsterst vor der Höhle vor dich hin: „Was für ein brutaler Kerl.“\n\nNach einiger Zeit kommt Nek aus der Höhle... blutverschmiert...\n\nNek: „Ich habs immer noch drauf!“\n\nSträfling: „Wenn du meinst!“",
        condition: "Sprich Nek an."
      },
      end: {
        text: "Nek: „So, jetzt wär hier alles sauber und hier wird mich auch keiner finden. Ich bleibe erstmal hier. Danke für deine Hilfe! Hier ist etwas Erz.“\n\nDu erhältst 10 Erz und 40*Kapitel Erfahrung.\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainOre(10); window.gainXp(40 * (h.chapter||1)); }
      }
    }
  },
  "Nyras": {
    id: "Nyras",
    title: "In die Pilze gehen",
    giver: "Nyras",
    img: "Bilder Karten/Personen/Quest/Nyras.png",
    firstSpeech: "Nyras: „Hei Neuer. Meister Lukor und ich suchen etwas. Etwas ganz Bestimmtes. Einen Pilz, der einen so high macht, dass man mit den Geistern sprechen kann. Wir wollen wissen, ob es Geister in der Barriere gibt, die uns einen Weg heraus weisen können. Der Pilz soll hier ganz in der Nähe wachsen, beim alten Orkfriedhof. Wenn du mir diesen Pilz bringst, kriegst du von mir ein seltenes Artefakt.“",
    dialogs: {
      accepted: {
        text: "Nyras: „Hei Neuer. Meister Lukor und ich suchen etwas. Etwas ganz Bestimmtes. Einen Pilz, der einen so high macht, dass man mit den Geistern sprechen kann. Wir wollen wissen, ob es Geister in der Barriere gibt, die uns einen Weg heraus weisen können. Der Pilz soll hier ganz in der Nähe wachsen, beim alten Orkfriedhof. Wenn du mir diesen Pilz bringst, kriegst du von mir ein seltenes Artefakt.“",
        condition: "Gehe zu Feld 105!"
      },
      pilz_gefunden: {
        text: "Am Eingang des Orkfriedhofes findest du einen seltsamen Pilz und steckst ihn in deine Tasche. Du erhältst einen Schläferpilz.",
        condition: "Gehe ins Sektenlager!",
        onEnter: function(h) { window.gainQuestItem('Schläferpilz', 1); }
      },
      end: {
        text: "Wenn du zurück im Sumpflager bist, spricht dich Nyras an.\n\nNyras: „Hey man, ich hatte schon Muffe, dass du dir den Pilz alleine reingezogen hast. Aber jetzt gib schon her. Ich muss den Baal´Lukor bringen. Er sagt, wenn man sich damit ein Omelett macht, dann komme man dem Schläfer besonders nahe. Hier man, nimm auch noch dieses Erz!“\n\nDu verlierst einen Schläferpilz.\n\nDu erhältst ein Amulett der Weisheit (Eisenamulett), 10 Erz und 30*Kapitel Erfahrung.\n\nQuest erfolgreich!",
        onEnter: function(h) { window.loseQuestItem('Schläferpilz', 1); window.gainQuestItem('Eisenamulett', 1); window.gainOre(10); window.gainXp(30 * (h.chapter||1)); }
      }
    }
  },
  "Jarvis": {
    id: "Jarvis",
    title: "Pass auf deinen Rücken auf!",
    giver: "Jarvis",
    img: "Bilder Karten/Personen/Quest/Jarvis.png",
    firstSpeech: "Jarvis: „Hei du. Neu hier was? Siehst aus als könntest du einen Freund gebrauchen. Zufälligerweise bin ich auf der Suche nach einem Waffenkumpanen. Ganz in der Nähe des Lagers soll es ein Stonehenge geben, in dem es eine Menge zu holen geben soll. Ich würde mir das Stonehenge mal genauer angucken, nur allein möchte ich da nicht hingehen. Wenn du mir den Rücken freihältst kann ich mich dort ungestört umsehen. Was sagst du? Ich hätte auch eine besondere Belohnung für dich. Eine Information, die dir sehr nützlich sein kann.“",
    dialogs: {
      accepted: {
        text: "Jarvis: „Hei du. Neu hier was? Siehst aus als könntest du einen Freund gebrauchen. Zufälligerweise bin ich auf der Suche nach einem Waffenkumpanen. Ganz in der Nähe des Lagers soll es ein Stonehenge geben, in dem es eine Menge zu holen geben soll. Ich würde mir das Stonehenge mal genauer angucken, nur allein möchte ich da nicht hingehen. Wenn du mir den Rücken freihältst kann ich mich dort ungestört umsehen. Was sagst du? Ich hätte auch eine besondere Belohnung für dich. Eine Information, die dir sehr nützlich sein kann.“",
        condition: "Gehe zu Feld 50!"
      },
      skelett_kampf: {
        text: "Jarvis: „Ja hier muss es sein. Ich gehe vor! Pass auf meinen Rücken auf!“\n\nVor dem Stonehenge stürmen 2 „Skelette aus dem Stonehenge“ auf euch zu! Kampf beginnt! Aus diesem Kampf kannst du nicht fliehen!",
        options: [
          { text: "[Ihr gewinnt den Kampf!]", nextStep: "opt1_sieg" },
          { text: "[Ihr verliert oder nur dein Leben fällt auf 0!]", nextStep: "opt2_fail" }
        ]
      },
      opt1_sieg: {
        text: "Jarvis: „Oh man, wer hätte gedacht, dass hier Untote rumfleuchen. Da sollten wir uns lieber von fernhalten. Naja immerhin hast du Mumm bewiesen und hast nicht einfach die Beine in die Hand genommen. Hier in der Nähe gibt es ne Höhle mit ner Truhe drin, da ist noch ein altes Artefakt drin, du kannst es haben ich brauche es nicht mehr! Hier nimm den Schlüssel!“",
        condition: "Gehe zu Feld 46!"
      },
      opt1_end: {
        text: "Du gelangst zur Truhe und schließt sie auf. Du findest ein seltenes Amulett!\n\nDu erhältst das Amulett des freien Rückens!\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainQuestItem('Amulett des freien Rückens', 1); }
      },
      opt2_fail: {
        text: "Du kommst im Neuen Lager ohne aktive Waffe und Erz auf einem Bett zu dir. In einem Bett neben dir liegt Jarvis.\n\nJarvis: „Das nennst du Rücken freihalten? Ich nenne das peinlich! Deine Belohnung kannst du knicken!“\n\nQuest fehlgeschlagen!",
        onEnter: function(h) {}
      }
    }
  },
  "Torlorf": {
    id: "Torlorf",
    title: "Das Trinkfest!",
    giver: "Torlorf",
    img: "Bilder Karten/Personen/Quest/Torlorf.png",
    firstSpeech: "Torlorf: „Hei Neuer. Hast du Durst? Siehst aus als könntest du ganz schön was vertragen. Wie wäre es, wenn wir zusammen was trinken gehen. Wenn du mich unter den Tisch trinken kannst, geht nicht nur die Zeche auf mich, ich kann dir außerdem noch beibringen, wie man mehr aus abgeschlachteten Viechern rausholen kann.“",
    dialogs: {
      accepted: {
        text: "Torlorf: „Hei Neuer. Hast du Durst? Siehst aus als könntest du ganz schön was vertragen. Wie wäre es, wenn wir zusammen was trinken gehen. Wenn du mich unter den Tisch trinken kannst, geht nicht nur die Zeche auf mich, ich kann dir außerdem noch beibringen, wie man mehr aus abgeschlachteten Viechern rausholen kann.“",
        condition: "Gehe in die Taverne! Du hast den Wetteinsatz von 20 Erz."
      },
      taverne_duell: {
        text: "Ein Würfelduell beginnt! Es wird ein W6 geworfen. Der Held tritt gegen Torlorf an. Wer zuerst 3 mal das höhere Ergebnis hat gewinnt.",
        options: [
          { text: "[Du gewinnst das Würfelduell!]", nextStep: "opt1_sieg" },
          { text: "[Du verlierst das Duell und wirst bewusstlos!]", nextStep: "opt2_bewusstlos" }
        ]
      },
      opt1_sieg: {
        text: "Torlorf: „Man … kann… das … hier…. Sss ss…. Nur.. VERSTEHST DU!.....Mnmnmsdf…. wo issen der korn?..... wenn … sman… amn sööööft.“\n\nDu erhältst 1 maximales Leben permanent hinzu und 10*Kapitel Erfahrung. Im nächsten Kampf hast du +1S, -1G, -1 Bewegungspunkte. Torlorf zählt für dich nun als Lehrer für die Jagd.\n\nQuest erfolgreich!",
        onEnter: function(h) {
          h.hp.max += 1;
          h.hp.current += 1;
          window.gainXp(10 * (h.chapter||1));
        }
      },
      opt2_bewusstlos: {
        text: "Torlorf: „Du musst dich wohl mehr anstrengen. Auf hoher See nennt man solche Leute wie dich Landlurker, Minjung!“\n\nDu wirst ohnmächtig und musst eine Runde aussetzen.",
        options: [
          { text: "[Noch einmal versuchen (Kostet 20 Erz)]", nextStep: "taverne_duell" },
          { text: "[Aufgeben / Kein Erz mehr]", nextStep: "duell_fail" }
        ],
        onEnter: function(h) { window.loseOre(20); }
      },
      duell_fail: {
        text: "Du hast nicht mehr genug Erz um zu wetten oder hast das Duell aufgegeben. Quest fehlgeschlagen!",
        onEnter: function(h) {}
      }
    }
  },
  "Lester": {
    id: "Lester",
    title: "Eine Waffe auf Umwegen",
    giver: "Lester",
    img: "Bilder Karten/Personen/Lehrer/Lester.png",
    firstSpeech: "Lester: „Hallo Bruder. Ich bin Lester. Du bist neu hier oder? Ich habe eine Bitte an dich. Ich habe mit sonem Typen mit nem Zopf gemeinsam in der alten Bergfestung Nachforschungen zur Entstehung magischer Wesen angestellt, als uns plötzlich eine Horde riesiger Vogelartiger Kreaturen angriff. Wir waren nicht darauf gefasst und sind geflohen. Leider habe ich auf der Flucht meine Waffe verloren. Wenn du mit mir gemeinsam hingehst, kann ich sie mir sicher zurückholen. Was sagst du, hilfst du mir meine Waffe zurückzuholen?“",
    dialogs: {
      accepted: {
        text: "Lester: „Hallo Bruder. Ich bin Lester. Du bist neu hier oder? Ich habe eine Bitte an dich. Ich habe mit sonem Typen mit nem Zopf gemeinsam in der alten Bergfestung Nachforschungen zur Entstehung magischer Wesen angestellt, als uns plötzlich eine Horde riesiger Vogelartiger Kreaturen angriff. Wir waren nicht darauf gefasst und sind geflohen. Leider habe ich auf der Flucht meine Waffe verloren. Wenn du mit mir gemeinsam hingehst, kann ich sie mir sicher zurückholen. Was sagst du, hilfst du mir meine Waffe zurückzuholen?“",
        condition: "Gehe zu Feld 112!"
      },
      bergfestung_leer: {
        text: "Du suchst die Festung sorgfältig ab, findest jedoch absolut nichts!",
        condition: "Gehe zum Sektenlager!"
      },
      end: {
        text: "Sträfling: „Da war nichts Lester! Willst du mich verarschen?“\n\nLester: „Ja grade als du los bist, ist mir eingefallen, dass ich das nur geträumt habe.“\n\nSträfling: „Warum hast du mich nicht aufgehalten?“\n\nLester: „Naja… Du warst schon so weit weg, und ich dachte erstmal noch einen durchziehen, kann nicht schaden, und dann wollte ich dir direkt hinterher, aber du bist so flink man. Aber du scheinst ja wirklich deine Aufträge ernst zu nehmen, hier ist wie vereinbart meine Waffe (Oruns Keule)!“\n\nSträfling: „Ja sicher! Du kannst mich mal!“\n\nDu erhältst 50*Kapitel Erfahrung, eine Oruns Keule und 1 Anschlusspunkt im Sektenlager.\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainXp(50 * (h.chapter||1)); window.gainQuestItem('Oruns Keule', 1); window.gainConnectionPoint('Sektenlager'); }
      }
    }
  },
  "Lares": {
    id: "Lares",
    title: "Es juckt an Gomez Finger",
    giver: "Lares",
    img: "Bilder Karten/Personen/Lehrer/Lares.png",
    firstSpeech: "Lares: „Hei kleiner. Wie ich sehe bist du keiner von Gomez Schergen, zumindest noch nicht. Das ist gut. Bevor du auf dumme Ideen kommst, hör mir kurz zu. Ich bin Lares. Ich bin hier sozusagen der 2. Chef. Wir im Neuen Lager können Leute wie dich sehr gut gebrauchen. Was sagst du, willst du bei uns mitmachen? Dazu musst du uns allerdings deine Loyalität beweisen. Und ich weiß auch schon genau wie. Gomez scharrt ständig Frauen um sich herum. Was nur Wenige wissen ist, dass er sie, sobald er sich vergnügt hat, im Keller einsperrt. Scheinbar hält er es nicht für nötig, diesen Keller zu bewachen, da eine Frau in der Barriere ohne Schutz nicht überleben wird, wenn sie abhaut. Auch eine Entführung scheint ausgeschlossen, da man an Gomez Schergen vorbeikommen müsste. Deine Aufgabe ist jedoch eine andere. Ich gebe dir meinen Siegelring und du schleichst dich in den Keller der Burg. Dort wirst du eine der Frauen verführen und heimlich hiermit infizieren. Da sind Filzläuse drin. Ich will, dass sie an Gomez gehen, wenn du verstehst was ich meine, sozusagen ein Geschenk des Neuen Lagers. Hier mit diesem Ring lässt dich Thorus in die Burg!“",
    dialogs: {
      accepted: {
        text: "Lares: „Hier ist mein Siegelring der Wassermagier und die Filzläuse. Geh damit in die Burg und infiziere heimlich eine der schlafenden Frauen!“",
        condition: "Gehe ins Alte Lager!",
        onEnter: function(h) { window.gainQuestItem('Siegelring der Wassermagier', 1); window.gainQuestItem('Lares Filzläuse', 1); }
      },
      thorus_tor: {
        text: "Thorus hält dich am Burgtor auf.\n\nThorus: „Na, wo wollen wir denn hin Kleiner?“\n\nSträfling: „Na da rein! Hier, ich bin im Auftrag der Wassermagier hier!“ (Du zeigst den Ring)\n\nThorus: „Ist ja schon gut!“",
        condition: "Warte eine Runde bis es nachts ist!"
      },
      nacht_wache: {
        text: "Du beobachtest einen Wachpostenwechsel. Während sich die Wachen unterhalten, gelingt es dir, dich an ihnen vorbei in den Kerkerbereich zu schleichen.",
        options: [
          { text: "[Wirf einen W6, um das Schloss der Kerkertür zu knacken]", nextStep: "w6_kerker" }
        ]
      },
      w6_kerker: {
        text: "Du wirfst den Würfel.",
        options: [
          { text: "[Erfolgreich: W6 + G >= 3]", nextStep: "kerker_drinnen" },
          { text: "[Fehlgeschlagen: W6 + G < 3]", nextStep: "erwischt_fail" }
        ]
      },
      kerker_drinnen: {
        text: "Du knackst das Schloss der Kerkertür und schlüpfst hindurch. Plötzlich hörst du Schritte!",
        options: [
          { text: "[Wirf einen W6, um dich vor der Wache zu verstecken]", nextStep: "w6_verstecken" }
        ]
      },
      w6_verstecken: {
        text: "Du wirfst den Würfel.",
        options: [
          { text: "[Erfolgreich: W6 + G >= 4]", nextStep: "frau_infizieren" },
          { text: "[Fehlgeschlagen: W6 + G < 4]", nextStep: "erwischt_fail" }
        ]
      },
      frau_infizieren: {
        text: "Du kannst dich gerade noch vor einer Wache verstecken, die eine der Frauen hoch in Gomez Gemächer bringen möchte. Du wartest, bis sie verschwunden sind. In einer der Zellen schläft eine Frau. Du schleichst dich an sie heran und schüttest die Filzläuse von Lares auf sie.\n\nLeise schleichst du zurück zur Kerkertür, doch verdammt - sie ist verschlossen!",
        options: [
          { text: "[Versuche das Schloss der Kerkertür in den nächsten 3 Runden zu knacken! W6 + G >= 6]", nextStep: "kerker_ausbruch" },
          { text: "[Du scheiterst beim Knacken des Schlosses]", nextStep: "erwischt_fail" }
        ]
      },
      kerker_ausbruch: {
        text: "Die Tür öffnet sich geräuschlos! Du sprintest unauffällig aus dem Kerker und verlässt die Burg ohne Aufsehen.",
        condition: "Wirf alle Aktionskarten ab und laufe zur Brücke auf Feld 36!",
        onEnter: function(h) { window.loseQuestItem('Lares Filzläuse', 1); window.loseQuestItem('Siegelring der Wassermagier', 1); }
      },
      lares_rueckkehr: {
        text: "Du schnaufst auf Feld 36 durch und läufst direkt zu Lares.",
        condition: "Gehe ins Neue Lager!"
      },
      end: {
        text: "Sträfling: „Hei, das war überhaupt kein Zuckerschlecken, die hätten mich um ein Haar kalt gemacht! Aber siehe da, hier bin ich!“\n\nLares: „Ich hab eigentlich nicht erwartet dich nochmal zu sehen, aber wo du schonmal da bist, kannst du mir ja berichten wie es gelaufen ist.“\n\nSträfling: „Danke! Ich bin halt rein in Kerker geschlichen und hab die Alte die da schlief mit deinen Läusen überschüttet. Gomez wird sich sicher freuen.“\n\nLares: „Das gibt es doch nicht! Du bist ein richtiger Schweinehund! Solche Leute können wir brauchen! Hier!“\n\nDu erhältst 80*Kapitel Erfahrung, 50 Erz und 1 Anschlusspunkt im neuen Lager!\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainXp(80 * (h.chapter||1)); window.gainOre(50); window.gainConnectionPoint('Neues Lager'); }
      },
      erwischt_fail: {
        text: "Du wirst von den Gardisten erwischt und brutal zusammengeschlagen. Du wirst nackt aus der Burg geworfen.\n\nDu landest auf Feld 11 ohne aktive Waffe, ohne Erz und mit nur 1 HP!\n\nQuest fehlgeschlagen!",
        onEnter: function(h) { h.hp.current = 1; window.loseOre(h.ore || 0); if (h.equipment && h.equipment.melee) h.equipment.melee = null; if (h.equipment && h.equipment.ranged) h.equipment.ranged = null; }
      }
    }
  },
  "Y´Berion": {
    id: "Y´Berion",
    title: "Ein schicker Hut!",
    giver: "Y´Berion",
    img: "Bilder Karten/Personen/Quest/Y´Berion.png",
    firstSpeech: "Y´Berion: „Der Schläfer… Er ist mit dir. Ich kann es sehen. Er hat dich auserwählt. Auserwählt mir zu helfen. Mir zu helfen, meiner Bestimmung nachzukommen. Du wurdest für eine ganz besondere Aufgabe ausgewählt. Der Schläfer hat mir dein Gesicht gezeigt und mir gesagt, was du für unsere Bruderschaft tun wirst. Nimm diese Spruchrolle von mir! Du sollst dich bei den Erzbaronen in die Schatzkammer schleichen und mir etwas besorgen. Etwas, das den Kontakt zum Schläfer stärken soll. Es ist ein Helm mit merkwürdigen Ornamenten. Wenn du ihn hast verwende diese Spruchrolle, um zu mir zurückzukehren! Und pass auf, dass dich niemand bemerkt!“",
    dialogs: {
      accepted: {
        text: "Y´Berion: „Hier, nimm diese Zauber: Teleport Tempelplatz und Verwandlung Fleischwanze! Schleich dich damit in die Schatzkammer von Gomez!“",
        condition: "Gehe ins Alte Lager!",
        onEnter: function(h) { window.gainQuestItem('Teleport Tempelplatz', 1); window.gainQuestItem('Verwandlung Fleischwanze', 1); }
      },
      schatzkammer_einbruch: {
        text: "Du benutzt die Spruchrolle Verwandlung Fleischwanze. Du krabbelst unbemerkt an den Wachen vorbei und durch ein kleines Loch direkt in die Schatzkammer der Burg. Dort siehst du eine prächtige Truhe und daneben einen prunkvollen Helm mit seltsamen Ornamenten.\n\nDu erhältst einen prunkvollen Helm!",
        condition: "Drücke den neue Runde Button (Warte 1 Runde in der Schatzkammer!)",
        onEnter: function(h) { window.loseQuestItem('Verwandlung Fleischwanze', 1); window.gainQuestItem('Prunkvoller Helm', 1); }
      },
      teleport_wahl: {
        text: "Du stehst mit dem Helm in der Kammer. Wie willst du entkommen?",
        options: [
          { text: "[Benutze erfolgreich den Teleport Tempelplatz]", nextStep: "teleport_erfolg" },
          { text: "[Du hast nicht genug Mana für den Teleportzauber oder scheiterst]", nextStep: "erwischt_fail" }
        ]
      },
      teleport_erfolg: {
        text: "Du verlierst den Teleport Tempelplatz. Ein magisches Licht umhüllt dich. Einen Moment später stehst du auf dem Tempelplatz des Sektenlagers und gehst direkt zu Y´Berion.\n\nSträfling: „Hier Meister Y´Berion! Ich biete dir den Helm im Namen des Schläfers dar!“",
        options: [
          { text: "[Wähle Belohnung: Schlafspruchrolle]", nextStep: "belohnung_schlaf" },
          { text: "[Wähle Belohnung: 100 Erz]", nextStep: "belohnung_erz" },
          { text: "[Wähle Belohnung: Extrakt reiner Magie]", nextStep: "belohnung_magie" }
        ],
        onEnter: function(h) { window.loseQuestItem('Teleport Tempelplatz', 1); window.loseQuestItem('Prunkvoller Helm', 1); }
      },
      belohnung_schlaf: {
        text: "Y´Berion: „Ich sehe du bist ein bescheidener Schüler des Schläfers. Es ehrt dich als besonders demütig.“\n\nDu erhältst eine Schlaf Spruchrolle (Schlaf Spruchrolle), 1 Anschlusspunkt im Sektenlager und 30*Kapitel Erfahrung.\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainQuestItem('Schlaf Spruchrolle', 1); window.gainConnectionPoint('Sektenlager'); window.gainXp(30 * (h.chapter||1)); }
      },
      belohnung_erz: {
        text: "Y´Berion: „Du bist gierig, gewiss einer von Gomez Schergen und mit dem Diebstahl hast du sie verraten, ich kann so einem doch nicht vertrauen und zum Mitglied unserer Bruderschaft machen. Aber nimm ruhig, wenn es dich glücklich macht.“\n\nDu erhältst 100 Erz und 20*Kapitel Erfahrung.\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainOre(100); window.gainXp(20 * (h.chapter||1)); }
      },
      belohnung_magie: {
        text: "Y´Berion: „Eine weise Wahl! Der Schläfer wird sich dir gewiss bald offenbaren und in unsere Fittiche leiten.“\n\nDu erhältst ein Extrakt reiner Magie und 30*Kapitel Erfahrung.\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainQuestItem('Extrakt reiner Magie', 1); window.gainXp(30 * (h.chapter||1)); }
      },
      erwischt_fail: {
        text: "Zwei Gardisten erwischen dich beim Herumschleichen! Sie nehmen dir deine gesamte Beute ab und werfen dich halbtot aus dem Lager.\n\nDu verlierst deine gesamte Ausrüstung außer deine Rüstung und (falls vorhanden) deinen Anschlusspunkt im Alten Lager. Du wachst auf Feld 11 mit nur 1 HP auf!\n\nQuest fehlgeschlagen!",
        onEnter: function(h) {
          h.hp.current = 1;
          window.loseConnectionPoint('Altes Lager');
          // Strip inventory of all non-armor items
          h.inventory = h.inventory.filter(item => item.category === 'Rüstung');
          if (h.equipment) {
            h.equipment.melee = null;
            h.equipment.ranged = null;
            h.equipment.artifacts = { amulet: null, ring1: null, ring2: null };
          }
        }
      }
    }
  },
  "Wolf": {
    id: "Wolf",
    title: "Der Rüstungsbastler",
    giver: "Wolf",
    img: "Bilder Karten/Personen/Händler/Wolf.png",
    firstSpeech: "Wolf: „Hei Neuling. Willst du was kaufen? Oder bist du auf der Suche nach Arbeit. Ja, ich sehe doch, dass du was Besonderes suchst. Und ich glaube, dass ich genau das richtige für dich habe. Ich forsche gerade an einer neuen Art Rüstung. Einen Helm aus Scavenger Schädeln. Ich schätze ich benötige 3 Stück für einen soliden Helm. Wenn du sie mir besorgst, mache ich dir einen Prototypen daraus. Du musst halt mit dem Gestank klarkommen. Dagegen habe ich noch kein Mittel gefunden.“",
    dialogs: {
      accepted: {
        text: "Wolf: „Hei Neuling. Ich brauche genau 3 Scavengerköpfe für meinen neuen Helm. Geh zum Feld 21, dort lauern 3 Scavenger auf einmal, oder suche sie zufällig!“",
        condition: "Kämpfe gegen 3 Scavenger und sammle 3 Köpfe!",
        onEnter: function(h) {}
      },
      koepfe_gesammelt: {
        text: "Du hast 3 Scavengerköpfe erbeutet!",
        condition: "Gehe zum neuen Lager!",
        onEnter: function(h) {
          window.gainQuestItem('Scavengerkopf', 3);
        }
      },
      wolf_abgabe: {
        text: "Wolf: „Hervorragend! Warte noch einen Tag (eine Runde rasten), dann ist der Helm fertig.“\n\nDu verlierst 3 Scavengerköpfe. Du erhältst 30*Kapitel Erfahrung.",
        condition: "Raste einmal im neuen Lager!",
        onEnter: function(h) {
          window.loseQuestItem('Scavengerkopf', 3);
          window.gainXp(30 * (h.chapter||1));
        }
      },
      end: {
        text: "Wolf: „Hier ist er, ich hoffe er passt.“\n\nDu erhältst einen Scavengerhelm!\n\nQuest erfolgreich!",
        onEnter: function(h) {
          window.gainQuestItem('Scavengerhelm', 1);
        }
      }
    }
  },
  "Saturas": {
    id: "Saturas",
    title: "Xardas Brief",
    giver: "Saturas",
    img: "Bilder Karten/Personen/Quest/Saturas.png",
    firstSpeech: "Saturas: „Magie zu Ehren. Was führt dich zu mir, junger Suchender? Du siehst rastlos aus. Es scheint als wärst du verloren, auf der Suche nach einem Ausweg. So wie wir alle. Wir, die Wassermagier, sind ebenfalls auf der Suche nach einem Ausbruchsplan. Kurz bevor die Wassermagier und die Feuermagier sich zerstritten haben hatte ich einen alten Freund namens Xardas. Er war nicht so verblendet von Gomez Luxus wie die anderen Feuermagier. Er muss unbedingt diese Nachricht erhalten. Bring sie so schnell wie möglich zu ihm. Du wirst auch reich belohnt werden.“",
    dialogs: {
      accepted: {
        text: "Saturas: „Bring diese Botschaft zu Xardas, er muss sie unbedingt erhalten!“",
        condition: "Gehe ins Alte Lager!",
        onEnter: function(h) { window.gainQuestItem('Xardas Botschaft', 1); }
      },
      thorus_burgtor: {
        text: "Vor der Burg triffst du Thorus.\n\nSträfling: „Ich soll eine Nachricht für den Magier Xardas überbringen! Lass mich in die Burg!“\n\nThorus: „Nein, das werde ich nicht. Ich würde, aber es ist nutzlos. Xardas ist schon lange nicht mehr im Lager gesehen worden. Niemand weiß wo er sich aufhält. Wahrscheinlich hat er sich irgendeinen abgelegenen Ort gesucht und betreibt da seine Experimente. An deiner Stelle würde ich ihn nicht suchen, selbst die anderen Feuermagier fürchten ihn.“",
        condition: "Gehe ins Neue Lager."
      },
      end: {
        text: "Sträfling: „Der Magier … ist mittlerweile weg. Er wurde schon lange nicht mehr im Alten Lager gesehen.“\n\nSaturas: „Nun… Das ist schlecht… Er wird schon wieder auftauchen. Xardas war immer auf der Suche nach hohem Wissen. Für das Alte Lager sehe ich jedoch schwarz. Xardas war doch der einzig vernünftige in der Bande. Nun will ich mal nicht so sein. Die Information könnte dennoch nützlich gewesen sein. Falls du ihn dennoch mal finden solltest, erstatte mir Bericht! Hier nimm erstmal dieses Erz!“\n\nDu verlierst Xardas Botschaft. Du erhältst 40 Erz und 30*Kapitel Erfahrung.\n\nQuest erfolgreich!",
        onEnter: function(h) { window.loseQuestItem('Xardas Botschaft', 1); window.gainOre(40); window.gainXp(30 * (h.chapter||1)); }
      }
    }
  },
  "Baal Tyon": {
    id: "Baal Tyon",
    title: "Seelenwanderung",
    giver: "Baal Tyon",
    img: "Bilder Karten/Personen/Lehrer/Baal Tyon.png",
    firstSpeech: "Baal Tyon: „Höre mir zu junger Reisender. Der Schläfer sucht Leute wie dich. Die Gurus in diesem Lager haben dich beobachtet und festgestellt, dass du nicht bist wie die anderen hier. Du scheinst etwas zu wissen, was du selbst noch nicht weißt. Nur der Schläfer weiß es. Er will sich dir offenbaren. Hier nimm etwas davon.“ (Du rauchst einen grünen Baal)",
    dialogs: {
      accepted: {
        text: "(Du bist völlig bekifft und kannst nur die Hälfte deiner Bewegungspunkte der Aktionskarten (min. 1) gehen! Kreaturen nehmen dich nicht als Bedrohung wahr und kämpfen nicht gegen dich!)",
        condition: "Gehe zu Feld 101!"
      },
      wasserfall_vision: {
        text: "Das Geräusch des Wasserfalls wird durch die Wirkung des Grünen Baals intensiviert. Du nimmst deine Umgebung mit allen Sinnen wahr. Plötzlich erscheint ein durchsichtiger Wolf in der Höhle.",
        options: [
          { text: "[Wirf einen W6: Ergebnis 1 oder 2]", nextStep: "opt1_streicheln" },
          { text: "[Wirf einen W6: Ergebnis 3 oder 4]", nextStep: "opt2_fuettern" },
          { text: "[Wirf einen W6: Ergebnis 5 oder 6]", nextStep: "opt3_angreifen" }
        ]
      },
      opt1_streicheln: {
        text: "Du streichelst den Wolfschemen… Ein vorbeikommender Buddler sieht wie du einen Stein streichelst und fragt nach Erz. Du legst bis zu 20 Erz auf den Stein. Der Buddler nimmt sie mit.",
        condition: "Gehe ins Sektenlager! (Deine Bewegung ist wieder normal und Gegner greifen dich wieder an!)",
        onEnter: function(h) { window.loseOre(20); }
      },
      opt1_end: {
        text: "Sträfling: „Meister ich glaube der Schläfer hat zu mir gesprochen! Er kam zu mir in Form eines Geisterwolfes und verlangte ein Erzopfer! Ich habe ihm natürlich so viel gegeben wie ich konnte.“\n\nBaal Tyon: „Nicht vielen ist es vergönnt die heilige Präsenz des Schläfers so nah zu erfahren. Ich bin schon fast etwas neidisch. Aber jemandem, dem der Schläfer sich so früh zeigt, kann ich nicht böse sein. Erzähl wie war seine Gegenwart!“\n\nSträfling: „Ich habe mich noch nie so frei gefühlt. Ich konnte schon ahnen wie wir dieses Gefängnis mit seiner Hilfe verlassen können. Es war als würde ich bald lernen zu fliegen.“\n\nBaal Tyon: „Das hab ich mir doch gleich gedacht. Durch seine unermessliche Macht werden wir bald in der Lage sein, diese Ödnis hier zu verlassen und uns in der Anwesenheit unseres Erlösers an seiner Glückseligkeit erfreuen! Hier nimm reichlich junger Schüler!“\n\nDu erhältst 1 Anschlusspunkt im Sektenlager, 50 Erz und 30*Kapitel Erfahrung.\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainConnectionPoint('Sektenlager'); window.gainOre(50); window.gainXp(30 * (h.chapter||1)); }
      },
      opt2_fuettern: {
        text: "Du wirfst dem Wolf 2 Nahrung oder einen Köder hin. Er ist sichtlich erfreut und verschlingt gierig sein Futter. (Hast du nichts davon, wirfst du ihm einen Stock zu, mit dem er schwanzwedelnd zu spielen beginnt.)",
        condition: "Gehe ins Sektenlager! (Deine Bewegung ist wieder normal.)",
        onEnter: function(h) {
          // Try to remove nahrung or koeder
          let removed = false;
          h.inventory = h.inventory.filter(item => {
            if (!removed && (item.category === 'Nahrung' || item.name === 'Köder')) {
              removed = true;
              return false;
            }
            return true;
          });
        }
      },
      opt2_end: {
        text: "Sträfling: „Meister Tyon… Mir ist ein Wolf erschienen. Ich konnte nicht anders… ich musste ihm einfach was zu futtern / ein Stöckchen hinwerfen. Er hat sich darüber gefreut und es vertilgt. Dann verschwand er.“\n\nBaal Tyon: „MMMMMhhhh… Das mein junger Schüler kann nur der Schläfer gewesen sein. Du solltest dich als glücklich erachten, dass er sich dir offenbart hat. Aber anscheinend hat dein Verstand nicht ausgereicht, um ihn zu erkennen. Also hat er sich von dir abgewandt… Welch eine Schande. Du hättest ihn so vieles fragen müssen! Immerhin habe ich wohl nun herausgefunden, wie viel Kraut es benötigt, damit man mit ihm Kontakt herstellen kann.“\n\nDu erhältst 1 Anschlusspunkt, 30 Erz und 20*Kapitel Erfahrung.\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainConnectionPoint('Sektenlager'); window.gainOre(30); window.gainXp(20 * (h.chapter||1)); }
      },
      opt3_angreifen: {
        text: "Du erschrickst und schlägst nach ihm… Der Schemen verschwindet und hinter dir steht ein richtiger Wolf, der dich angreift! Du kommst ganz plötzlich wieder klar! Kämpfe gegen den Wolf!",
        options: [
          { text: "[Gewinne den Kampf gegen den Wolf!]", nextStep: "wolf_besiegt" }
        ]
      },
      wolf_besiegt: {
        text: "Du hast den Wolf im Kampf bezwungen!",
        condition: "Gehe ins Sektenlager! (Deine Bewegung ist wieder normal.)"
      },
      opt3_end: {
        text: "Sträfling: „Ich war in einer Höhle und sah erst einen Geisterwolf, dann plötzlich einen echten, der mich unvermittelt attackierte. Nur mit Mühe und Not hab ich es in einem Stück da wieder raus geschafft.“\n\nBaal Tyon: „Sowas hab ich mir schon gedacht du Narr. Du hast sie nicht erkannt… es war eine Vergenz des Schläfers, du hast sie nicht gewürdigt und er hat sich dir nicht offenbart und dir aus Rache einen Wolf auf den Hals gehetzt. Das ist ein böses Omen! Wir müssen auf der Stelle den Schläfer wieder besänftigen.“\n\nDu erhältst 30*Kapitel Erfahrung.\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainXp(30 * (h.chapter||1)); }
      }
    }
  },
  "Cor Kalom": {
    id: "Cor Kalom",
    title: "Der störende Faktor!",
    giver: "Cor Kalom",
    img: "Bilder Karten/Personen/Händler/Cor Kalom.png",
    firstSpeech: "Cor Kalom: „Hei du. Ja du. Ich bin mir sicher, dass du mir helfen kannst. Ich bin Cor Kalom. Ich forsche an neuen Methoden Kontakt zum Schläfer aufzubauen. Er ist unser Weg aus der Barriere. Leider habe ich in letzter Zeit immer weniger Visionen vom Schläfer erhalten. Irgendetwas scheint den Kontakt zu stören. Mir ist aufgefallen, dass die Visionen nachgelassen haben, seitdem Baal Isidro im Lager zum Guru aufgestiegen ist. Hilf mir ihn loszuwerden und ich werde dich belohnen.“",
    dialogs: {
      accepted: {
        text: "Cor Kalom: „Finde Baal Isidro und schaffe ihn mir aus dem Weg! Seine Hütte steht unten neben dem Tempelplatz.“",
        condition: "Gehe zu Baal Isidros Hütte!"
      },
      isidro_hütte: {
        text: "Baal Isidro: „Erwache! Was führt dich zu mir? Ich bin noch nicht lange Baal. Du kannst mich gerne ansprechen.“",
        options: [
          { text: "[Sträfling: „Hey, ich soll dir von Cor Kalom ausrichten, dass du im Neuen Lager gebraucht wirst. Er will dort einen Mann haben auf den Verlass ist.“]", nextStep: "opt1_neueslager" },
          { text: "[Sträfling: „Kalom möchte dich aus dem Weg haben. Er will dich töten lassen. Du solltest aus dem Lager verschwinden. Ich kenn da ein ruhiges Plätzchen.“]", nextStep: "opt2_waldrand" }
        ]
      },
      opt1_neueslager: {
        text: "Baal Isidro: „Meister Kalom hat mich ausgewählt? Ich will sofort los, aber der Weg ist gefährlich! Begleite mich!“",
        condition: "Bringe Baal Isidro zum Neuen Lager! Er kämpft mit dir!",
        onEnter: function(h) { window.gainQuestItem('Siegelring der Wassermagier', 1); } // represents his deal
      },
      opt1_ankunft: {
        text: "Baal Isidro: „Danke Mann, hast was gut bei mir! Hier nimm diesen Stängel Sumpfkraut!“ Du erhältst 1 grünen Novizen und 40*Kapitel Erfahrung.",
        condition: "Gehe zurück zum Sektenlager!",
        onEnter: function(h) { window.loseQuestItem('Siegelring der Wassermagier', 1); window.gainQuestItem('Grüner Novize', 1); window.gainXp(40 * (h.chapter||1)); }
      },
      opt1_end: {
        text: "Cor Kalom: „MMmmh… Baal Isidros unheilige Präsenz scheint fort zu sein. Ich spüre schon wie die Macht des Schläfers mich wieder durchdringt. Mir wäre es dennoch lieber gewesen, du hättest diesen Frevler umgelegt. Naja, Danke.“\n\nDu erhältst 50*Kapitel Erfahrung und 40 Erz.\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainXp(50 * (h.chapter||1)); window.gainOre(40); }
      },
      opt2_waldrand: {
        text: "Baal Isidro: „Was?! Das kann ich gar nicht glauben! Aber Kalom ist undurchschaubar. Ich komm lieber mal mit.“",
        condition: "Gehe mit Baal Isidro zu Feld 98! Er kämpft mit dir!"
      },
      opt2_schattenlaeufer: {
        text: "Am Waldrand angekommen.\n\nSträfling: „Warte kurz hier!“\n\nDu rennst in den Wald hinein und weckst einen Schattenläufer auf. Du rennst sofort zurück. Der Schattenläufer holt euch am Flussufer ein. Ein Kampf beginnt!\n\nHinweis: Du kannst aus diesem Kampf fliehen, sobald Baal Isidro tot ist!",
        options: [
          { text: "[Kampf gewonnen oder geflohen, nachdem Baal Isidro getötet wurde]", nextStep: "opt2_isidro_tot" }
        ]
      },
      opt2_isidro_tot: {
        text: "Baal Isidro wurde vom Schattenläufer zerrissen. Du konntest entkommen!",
        condition: "Gehe zurück zum Sektenlager:"
      },
      opt2_end: {
        text: "Cor Kalom: „Ausgezeichnet… Ich spüre seine verunreinigte Aura nicht mehr. Er muss tot sein. Danke mein lieber Schüler. Der Schläfer ist wieder mit uns ich kann es spüren. Hier nimm diesen Ring!“\n\nDu erhältst 1 Anschlusspunkt im Sektenlager, einen Ring des Schlafes (Ring der Geistesratsamkeit) und 50*Kapitel Erfahrung.\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainConnectionPoint('Sektenlager'); window.gainQuestItem('Ring der Geistesratsamkeit', 1); window.gainXp(50 * (h.chapter||1)); }
      }
    }
  },
  "Gor Na Drak": {
    id: "Gor Na Drak",
    title: "Die Spirituelle Reinigung!",
    giver: "Gor Na Drak",
    img: "Bilder Karten/Personen/Lehrer/Gor Na Drak.png",
    firstSpeech: "Gor Na Drak: „Der Schläfer sei mit dir junger Reisender. Ich spüre, dass du seinen heiligen Schutz mehr brauchst als jeder andere hier im Lager. Etwas scheint dich zu bedrücken. Ich kenne einen Weg, wie du diese Last abwerfen kannst. Gleich hier in der Nähe gibt ein altes Kastell. Es dient den Templern schon länger als ein Ort spiritueller Reinigung. Nimm diese Spruchrolle hier und lies sie am höchsten Punkt des Kastells laut vor, um deinen Geist zu befreien. Dies soll ein Geschenk der Bruderschaft sein!“",
    dialogs: {
      accepted: {
        text: "Gor Na Drak: „Lies diese magische Reinigung am höchsten Punkt des Kastells laut vor!“",
        condition: "Gehe zum Kastell!",
        onEnter: function(h) { window.gainQuestItem('Magische Reinigung', 1); }
      },
      kastell_mauer: {
        text: "Oben auf den Resten der Kastellmauer liest du die Spruchrolle vor: „Krushakshaknoshaknoragat“!\n\nDu verlierst eine magische Reinigung.",
        options: [
          { text: "[Wirf einen W6: Ergebnis 1]", nextStep: "opt1_sturz" },
          { text: "[Wirf einen W6: Ergebnis 2 oder 3]", nextStep: "opt2_heilung" },
          { text: "[Wirf einen W6: Ergebnis 4 oder 5]", nextStep: "opt3_staerke" },
          { text: "[Wirf einen W6: Ergebnis 6]", nextStep: "opt4_artefakt" }
        ],
        onEnter: function(h) { window.loseQuestItem('Magische Reinigung', 1); }
      },
      opt1_sturz: {
        text: "Du fällst in die Tiefe auf Feld 77 und verlierst dein halbes Leben! Das Zufallsereignis wird aktiviert.\n\nQuest erfolgreich!",
        onEnter: function(h) { h.hp.current = Math.max(1, Math.floor(h.hp.current / 2)); }
      },
      opt2_heilung: {
        text: "Du spürst eine tiefe Ruhe. Du heilst dich vollständig und erhältst 30*Kapitel Erfahrung!\n\nQuest erfolgreich!",
        onEnter: function(h) { h.hp.current = h.hp.max; window.gainXp(30 * (h.chapter||1)); }
      },
      opt3_staerke: {
        text: "Du hörst Stimmen aus dem Nichts. Sie reden auf dich ein und du fühlst eine wachsende Macht! Du erhältst permanent +1 Stärke!\n\nQuest erfolgreich!",
        onEnter: function(h) { h.attributes.str += 1; }
      },
      opt4_artefakt: {
        text: "Ein wunderschönes Artefakt materialisiert sich direkt in deinen Händen!\n\nDu erhältst ein Amulett der Überdauerung!\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainQuestItem('Amulett der Überdauerung', 1); }
      }
    }
  },
  "Drax": {
    id: "Drax",
    title: "Ein fähiger Jäger",
    giver: "Drax",
    img: "Bilder Karten/Personen/Lehrer/Drax.png",
    firstSpeech: "Drax: „Neu hier, was kleiner? Ich bin Drax. Ich jage gerne, hauptsächlich Scavenger wegen ihres Fleisches. Ich sehe du gehörst noch keinem Lager an. Ich kann dir nur sagen, dass das neue Lager ein guter Ort für dich ist. Ich habe hier viel gelernt. Wir können erfahrene Leute gut gebrauchen. Ich sag dir was, wenn du mir zeigst, dass du willig bist etwas zu lernen, leg ich ein gutes Wort für dich bei Lares ein. Außerdem kann ich dir selbst ein paar Tricks beibringen. Ich schenke dir diesen Bogen (Drax Bogen). Wenn du lernst damit umzugehen, komm wieder und ich werde dir helfen.“",
    dialogs: {
      accepted: {
        text: "Drax: „Lerne genügend Geschick, um meinen Bogen (Drax Bogen) anzulegen!“",
        condition: "Erfülle das Attributserfordernis und lege Drax Bogen an!",
        onEnter: function(h) { window.gainQuestItem('Drax Bogen', 1); }
      },
      end: {
        text: "Drax: „Ja mit dem Bogen über der Schulter siehst du schon ganz schön gefährlich aus. Ich kann dir beibringen wie man mehr aus toten Viechern herausbekommt. Für nur 30 Erz.“\n\nDu erhältst 30*Kapitel Erfahrung. Drax zählt nun als Jagdlehrer für dich!\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainXp(30 * (h.chapter||1)); }
      }
    }
  },
  "Shrike": {
    id: "Shrike",
    title: "Das ist der Hammer!",
    giver: "Shrike",
    img: "Bilder Karten/Personen/Quest/Shrike.png",
    firstSpeech: "Shrike: „Hei neu hier, was? Ich kenne das. Mein Name ist Shrike und ich bin auch erst vor ein paar Monaten gekommen. Ich hab’s geschafft im Lager aufgenommen zu werden. Jetzt wollte ich mir grad eine Hütte bauen und hab mir schon alles gekauft was ich brauch. Aber als ich anfangen wollte habe ich gemerkt, dass mir einer der Scherzkekse hier meinen Hammer geklaut hat. Jetzt tut hier jeder so als würde es im gesamten Lager nicht einen Hammer geben. Kannst du mir einen Gefallen tun? Besorge mir einen vernünftigen Hammer. Der letzte den ich losgeschickt habe, hat mir einen Hammer mit morschem Griff gegeben. Als ich loshämmern wollte ist mir der Griff abgebrochen und der Scheiß Hammerkopf voll gegen den Kopf geflogen. Der Scherzkeks fand das auch noch witzig. Bitte hilf mir und besorge mir einen richtigen Hammer.“",
    dialogs: {
      accepted: {
        text: "Shrike: „Bitte besorge mir einen richtigen Schmiedehammer, damit ich endlich hämmern kann!“",
        condition: "Finde einen Schmiedehammer und bringe ihn zu Shrike!"
      },
      schmiedehammer_abgabe: {
        text: "Sträfling: „Hier ist dein Hammer.“\n\nShrike: „Jetzt kann ich den ganzen Tag hämmern! Das werde ich dir nie vergessen!”\n\nDu verlierst einen Schmiedehammer. Du erhältst 20 Erz und 40*Kapitel Erfahrung.",
        condition: "Betrete das Neue Lager innerhalb der nächsten 4 Züge erneut!",
        onEnter: function(h) { window.loseQuestItem('Schmiedehammer', 1); window.gainOre(20); window.gainXp(40 * (h.chapter||1)); }
      },
      end: {
        text: "Blade: „Man, wenn ich herausfinde, wer dem Penner den Hammer wiedergegeben hat, mach ich Orik fertig!“\n\nSträfling: „Warum Orik?“\n\nBlade: „Keine Ahnung! Ich weiß nicht mehr was ich rede… Ich habe ewig kein Auge mehr zugekriegt.“\n\nDu erhältst 10*Kapitel Erfahrung.\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainXp(10 * (h.chapter||1)); }
      }
    }
  },
  "Baal Tondral": {
    id: "Baal Tondral",
    title: "Der Türsteher des Schläfers",
    giver: "Baal Tondral",
    img: "Bilder Karten/Personen/Quest/Baal Tondral.png",
    firstSpeech: "Baal Tondral: „Ein neues Gesicht. Ich bin Baal Tondral. Erst vor kurzem hat mich der Schläfer auserwählt ihm als Guru zu dienen. Als neuster Guru ist es meine Aufgabe, neue Novizen für das Lager zu finden. Ich sehe in dir den Willen uns beizutreten. Nur scheint der Schläfer einen Beweis für deine Loyalität zu fordern. Jeder Anwärter erhält eine Aufgabe, die er erfüllen muss, um die Zustimmung der Gurus zu erhalten. Einen Moment…. Der Schläfer…. Er spricht zu mir…. Er sagt… Bald wird er kommen…. Er wird großes Unheil bringen…. Er muss aufgehalten werden…. Wie war das?... Ja Meister… Ich verstehe… Der Schläfer hat mir eine Aufgabe mitgeteilt. Schon bald soll ein sehr gefährlicher Mann in die Kolonie geschickt werden. Einer, der unser ganzes Schicksal zerstören wird. Und du hast die Aufgabe, ihn aufzuhalten. Er wird etwas brauchen. Und du sollst ihn daran hindern es zu bekommen. Nimm diese mächtige Spruchrolle und setze sie in der Schlucht im Norden ein. Wenn dies erledigt ist, kehre zu mir zurück und du erhältst eine großzügige Belohnung.“",
    dialogs: {
      accepted: {
        text: "Baal Tondral: „Wirke erfolgreich den Zauberspruch Troll beschwören in der Schlucht im Norden auf Feld 20!“",
        condition: "Gehe auf Feld 20!",
        onEnter: function(h) { window.gainQuestItem('Troll beschwören', 1); }
      },
      troll_beschworen: {
        text: "Du wirkst erfolgreich Troll beschwören. Du verlierst Troll beschwören!\n\nPolternd erscheint ein riesiger Troll. Der Lärm macht 3 Snapper auf dich aufmerksam! Sie rennen zähnefletschend auf dich zu, doch hinter dir ragt die riesige Felswand auf - du bist eingekesselt!\n\nBereits mit dem Tod abgefunden sprichst du ein letztes Gebet, als plötzlich die gigantische Faust des Trolls über deinen Kopf hinwegsaust und die Snapper mit einem einzigen Schlag in den Erdboden stampft. Völlig verängstigt siehst du den Troll an, welcher jedoch nur gähnt und beginnt, sich zum Schlafen einzurollen.\n\nDu erhältst 200 Erfahrung!",
        condition: "Gehe zurück ins Sektenlager!",
        onEnter: function(h) { window.loseQuestItem('Troll beschwören', 1); window.gainXp(200); }
      },
      end: {
        text: "Sträfling: „Ich habe diese Bestie beschworen!“\n\nBaal Tondral: „Ja Gut! So wie der Schläfer es wollte! Seine Feinde werden dort nicht vorbeikönnen! Hier nimm dieses Erz und ich werde Kalom ausrichten, dass wir einen wahren Gläubigen unter uns haben.“\n\nDu erhältst 1 Anschlusspunkt im Sektenlager und 30 Erz.\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainConnectionPoint('Sektenlager'); window.gainOre(30); }
      }
    }
  },
  "Baal Orun": {
    id: "Baal Orun",
    title: "Eine merkwürdige Milchkuh",
    giver: "Baal Orun",
    img: "Bilder Karten/Personen/Quest/Baal Orun.png",
    firstSpeech: "Baal Orun: „Der Schläfer möge dich behüten unerfahrener Reisender. Auf allen Wegen soll er dir zur Seite stehen, stehen dir doch schwere Zeiten bevor. Warum fragst du? Nun diese Antwort hat einzig und allein der Schläfer für dich. Um mit ihm sprechen zu können, muss er dich auserwählen. Oder…. Ach vergiss es…. Nun gut. Es gibt noch eine andere Möglichkeit, wie du Kontakt zum Schläfer aufbauen kannst. Nimm diese Nagelkeule (Oruns Keule). Die Nägel dieser Keule sind mit einem Gift getränkt. Es ist speziell für die Blutfliegen im Sumpf gemacht. Wenn du sie damit schwer genug verwundest, werden sie willenlos und folgen dir. Die Blutfliegen im Sumpf ernähren sich hauptsächlich von Sumpfhaikadavern. Diese enthalten durch den ständigen Kontakt mit dem Sumpfkraut ein spezielles Serum. Wenn du mir eine lebendige Blutfliege bringst, kann ich ihr spezielles Gift entnehmen. Mit einer geringen Dosis dieses Giftes, kann ich möglicherweise einen Trank herstellen, mit dem man Kontakt zum Schläfer herstellen kann.“",
    dialogs: {
      accepted: {
        text: "Baal Orun: „Gehe zu Feld 136 und bringe mir eine lebendige, betäubte Blutfliege!“",
        condition: "Gehe auf Feld 136!",
        onEnter: function(h) { window.gainQuestItem('Oruns Keule', 1); }
      },
      fliege_kampf: {
        text: "Eine Blutfliege erscheint! Der Kampf beginnt. (Die Blutfliege wird betäubt, wenn sie 2 oder weniger Leben hat.)",
        options: [
          { text: "[Erfolgreich betäubt und eingefangen!]", nextStep: "fliege_gefangen" }
        ]
      },
      fliege_gefangen: {
        text: "Du hast die Blutfliege erfolgreich betäubt und eingepackt!",
        condition: "Bringe sie zurück zu Baal Orun!"
      },
      end: {
        text: "Baal Orun: „Ausgezeichnet, über diesen neuen Weg wird Meister Kalom hocherfreut sein. Man kann nie genug Möglichkeiten haben mit dem Schläfer Kontakt aufzunehmen. Und nun geh deines Weges!“\n\nDu erhältst 40*Kapitel Erfahrung, 1 Anschlusspunkt im Sektenlager und 30 Erz.\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainXp(40 * (h.chapter||1)); window.gainConnectionPoint('Sektenlager'); window.gainOre(30); }
      }
    }
  },
  "Baal Parvez": {
    id: "Baal Parvez",
    title: "Mit einem Guru stimmt sicher was nicht!",
    giver: "Baal Parvez",
    img: "Bilder Karten/Personen/Quest/Baal Parvez.png",
    firstSpeech: "Baal Parvez: „Neu hier was kleiner? Ich bin Baal Parvez aus dem Lager am Sumpf. Ich bin hier, um Handel mit den Leuten aus dem alten Lager zu treiben. Um ehrlich zu sein ist es auch mal ganz schön neue Gesichter zu sehen. Versteh mich nicht falsch, die Brüder aus dem Sumpf sind wie eine Familie für mich. Außer …. Naja, das interessiert dich sicher nicht. Oder? …. Nun, wenn das so ist. Es gibt einen unter uns, der kürzlich zum Guru aufgestiegen ist. Sein Name ist Baal Lukor. Irgendetwas stimmt mit ihm nicht. Ich muss nur rausfinden was. Hilfst du mir? In seiner Hütte muss es irgendwelche Hinweise geben. Bitte sieh nach, ob du irgendetwas finden kannst und bring es mir. Ich werde dich auch bezahlen.“",
    dialogs: {
      accepted: {
        text: "Baal Parvez: „Ich suche was Belastendes für Baal Lukor aus dem Sumpflager. Finde seine Hütte im Sumpf und durchsuche sie!“",
        condition: "Gehe auf Feld 136."
      },
      hütte_durchsuchung: {
        text: "Du begibst dich in das Haus von Baal Lukor im Sumpf. Es scheint leer zu sein. Du betrittst den Raum und stellst an einer Stelle fest, dass sich der Boden hohl anhört. Unter einem Teppich findest du eine abgeschlossene Falltür!",
        options: [
          { text: "[Wirf einen W6, um das Schloss zu knacken]", nextStep: "w6_falltuer" }
        ]
      },
      w6_falltuer: {
        text: "Du versuchst, die Falltür aufzubekommen.",
        options: [
          { text: "[Option 1: Innerhalb der nächsten 3 Runden ist dein W6 + G >= 6]", nextStep: "brief_gefunden" },
          { text: "[Option 2: Innerhalb der nächsten 3 Runden ist dein W6 + G < 6]", nextStep: "erwischt_fail" }
        ]
      },
      brief_gefunden: {
        text: "Das hörte sich gut an! Du knackst das Schloss der Falltür und findest auf einem Alchemietisch einen Brief von einem gewissen Lares, der von Baal Lukor verlangt, dass dieser mehr Sumpfkrautsamen zur Hütte beim Fischerteich vor dem Neuen Lager bringt. Du schnappst den Brief und rennst los.\n\nDu erhältst Lukors Brief!",
        condition: "Gehe zurück zum Alten Lager!",
        onEnter: function(h) { window.gainQuestItem('Lukors Brief', 1); }
      },
      opt1_end: {
        text: "Du triffst Baal Parvez im Alten Lager.\n\nSträfling: „Hei, du. Ich habe mich mal in Baal Lukors Hütte umgesehen. Er hatte einen geheimen Keller und treibt zwielichtige Machenschaften mit dem Neuen Lager und untergräbt das Krautmonopol.“\n\nBaal Parvez: „Hey Neuer! Ich suche was Belastendes...“\n\nSträfling: „Was redest du da? Ich habe hier so einen Brief bei mir.“\n\nBaal Parvez: „woooow wie schnell du bist. Hier man pack den Brief wieder zurück! Nimm dieses Erz als Zeichen meiner Dankbarkeit.“\n\nDu verlierst Lukors Brief. Du erhältst 30 Erz und 30*Kapitel Erfahrung.\n\nQuest erfolgreich!",
        onEnter: function(h) { window.loseQuestItem('Lukors Brief', 1); window.gainOre(30); window.gainXp(30 * (h.chapter||1)); }
      },
      erwischt_fail: {
        text: "Du hörst Baal Lukor hinter dem Haus mit einem Novizen reden. Du verlässt das Haus so heimlich es geht und beobachtest ihn. Er scheint gemerkt zu haben, dass jemand da war und betritt den geheimen Keller. Kurz danach kommt er wieder hinaus und steckt gerade einen Zettel ein.\n\nQuest fehlgeschlagen!",
        onEnter: function(h) {}
      }
    }
  },
  "Buster": {
    id: "Buster",
    title: "Rares für Buster",
    giver: "Buster",
    img: "Bilder Karten/Personen/Quest/Buster.png",
    firstSpeech: "Buster: „Hallo. Ich bin Buster. Ich arbeite für Lares. Und wenn ich du wäre, würde ich mich ebenfalls Lares Leuten anschließen. Wenn du das nicht machst, läufst du sonst nämlich ganz schnell Gefahr, um dein Erz schneller erleichtert zu werden als du gucken kannst. Wir haben gelernt uns zu nehmen, was wir wollen, wenn du verstehst was ich meine. Du scheinst mir ein sehr ordentlicher Kämpfer zu sein. Du fehlst uns noch in unseren Reihen. Ich schätze Lares würde dich aufnehmen, wenn du dich als nützlich erweist. Was meinst du? Alles klar. Ich hätte auch schon gleich eine Aufgabe für dich. Besorge mir etwas außergewöhnliches, ein Artefakt oder eine besondere Waffe. Irgendetwas, wo man nicht so leicht herankommt. Wenn du mich beeindrucken kannst, lege ich bei Lares ein gutes Wort für dich ein. Und biete dir einen guten Preis für deine Rarität.“",
    dialogs: {
      accepted: {
        text: "Buster: „Besorge mir etwas Außergewöhnliches - ein Artefakt oder eine besondere Waffe im Wert von über 49 Erz!“",
        condition: "Bringe Buster ein wertvolles Artefakt!"
      },
      end: {
        text: "Sträfling: „Ich hab hier etwas für dich!“ (Du zeigst ihm eine deiner wertvollen Raritäten)\n\nBuster: „So was hab ich wirklich noch nie gesehen!!! Ich will gar nicht wissen, wie du da herangekommen bist! Ich gebe dir 30 Erz dafür!“\n\nSträfling: „Für 25 kannst du es haben, aber denk daran Lares meine Grüße auszurichten!“\n\nBuster: „Jaja und jetzt gib schon her!“\n\nDu verlierst das wertvolle Artefakt.\n\nDu erhältst 25 Erz, 30 Erfahrung und einen Anschlusspunkt im Neuen Lager.\n\nQuest erfolgreich!",
        onEnter: function(h) {
          // Remove a highly valued item (e.g. Amulett or Ring with value > 49)
          let removed = false;
          h.inventory = h.inventory.filter(item => {
            if (!removed && item.value > 49) {
              removed = true;
              return false;
            }
            return true;
          });
          window.gainOre(25);
          window.gainXp(30);
          window.gainConnectionPoint('Neues Lager');
        }
      }
    }
  },
  "Milten": {
    id: "Milten",
    title: "Gefährliches Schicksal",
    giver: "Milten",
    img: "Bilder Karten/Personen/Quest/Milten.png",
    firstSpeech: "Milten: „Hei du, Reisender. Du trägst etwas Besonderes an dir. Nein, nicht deine Kleidung. Innos wacht über dich. Ich kann es spüren. Er hat einen Plan. Etwas Großes. Ich glaube, du bist derjenige, der hierfür auserwählt wurde (Schriftstücke erhalten). Ich fand diese Schriftstücke ganz in der Nähe in einer Schlucht. Ich habe sie mitgenommen und wollte ihre Herkunft erfahren, doch irgendetwas war seltsam. Ich zeigte diese Stücke Meister Corristo und als er sie las, eilte er erstaunt aus dem Raum. Als er kurze Zeit später wiederkam, hielt er weitere Schriftstücke in der Hand, die identisch waren. Er fand sie westlich der alten Mine. Als er sie einsammelte hörte er ein lautes Brüllen und entdeckte in der Entfernung einen Troll. Er floh, doch als er sich später die Schriftstücke genauer ansah, stellte er fest, dass sie ihm geholfen hätten den Troll zu vernichten. Innos sprach dann eines Nachts zu ihm und offenbarte ihm, dass er die Schriftstücke wieder dahin bringen sollte, wo er sie herhatte. Innos sprach von einem höheren Zweck und dem Schicksal der Kolonie. Ich hatte letzte Nacht ebenfalls so eine Vision. Also bitte, nimm die Schriftstücke und bringe sie dahin zurück, wo sie herkamen. Du sollst auch einen entsprechenden Lohn erhalten.“",
    dialogs: {
      accepted: {
        text: "Milten: „Nimm meine Schriftstücke und lege sie an den beschriebenen Orten ab!“",
        condition: "Gehe zu Feld 18!",
        onEnter: function(h) { window.gainQuestItem('Miltens Zettel', 1); }
      },
      feld18_abgelegt: {
        text: "Du legst 2 der 4 Schriftstücke an Feld 18 ab.",
        condition: "Gehe zu Feld 29!"
      },
      feld29_überraschung: {
        text: "Dich packt die Neugier und du möchtest wissen, was du für Milten verteilst. Du liest die Schriftstücke. Das eine ist eine Spruchrolle Monster schrumpfen, das andere das Tagebuch eines Trolljägers...\n\nPlötzlich vibriert die Felswand neben dir! Ein gigantischer Troll springt herab! Ein Kampf beginnt!\n\nPanisch verwendest du die magische Spruchrolle Monster schrumpfen!\n\nDu verlierst Miltens Schriftstücke und dein Mana sinkt auf 0! Es beginnt der Kampf gegen den geschrumpften Troll!",
        options: [
          { text: "[Gewinne den Kampf gegen den geschrumpften Troll!]", nextStep: "troll_besiegt" }
        ],
        onEnter: function(h) { window.loseQuestItem('Miltens Zettel', 1); if (h.mana) h.mana.current = 0; }
      },
      troll_besiegt: {
        text: "Du hast den geschrumpften Troll erlegt!",
        condition: "Kehre zurück ins Alte Lager!"
      },
      end: {
        text: "Milten: „Wie ich sehe führst du die Schriften nicht mehr bei dir. Das ist gut, dann kann ich dir ja die Belohnung geben….“\n\nSträfling: „Nun ja, ich musste oben neben der alten Mine schon Gebrauch machen von der einen Schriftrolle. Ein Troll hat mich unvermittelt angegriffen. Die Dinger sind ziemlich groß. Ich hab mich fast eingeschissen. Was für ein Glück, dass du mir diese Spruchrolle mitgegeben hast.“\n\nMilten: „Das ist unglaublich... Das kann kein Zufall gewesen sein! Innos war wahrlich mit dir. Er scheint einen Plan mit dir zu haben. Du warst immerhin geistig nicht völlig abgewandt und hast den Zauber benutzt. Dann wissen wir schonmal, dass er funktioniert. Ich bin froh über deine Leistung. Hier, mögest du damit sicher sein!“\n\nDu erhältst 50 Erfahrung, 30 Erz und einen Trank des Lebens (Trank des puren Lebens).\n\nQuest erfolgreich!",
        onEnter: function(h) { window.gainXp(50); window.gainOre(30); window.gainQuestItem('Trank des puren Lebens', 1); }
      }
    }
  },
  "Bloodwyn": {
    id: "Bloodwyn",
    title: "Der Schutzengel?",
    giver: "Bloodwyn",
    img: "Bilder Karten/Personen/Quest/Bloodwyn.png",
    firstSpeech: "Bloodwyn: „Hey Neuer. Es ist ganz schön gefährlich hier allein herum zu laufen. Du hast nicht zufällig etwas Erz übrig. Ich könnte dich dafür ja dann beschützen, falls dir wer an den Kragen will. Sagen wir einfach, ich bräuchte nur 10 Erz.“",
    dialogs: {
      accepted: {
        text: "Bloodwyn: „Gib mir 10 Erz oder sieh selbst zu wie du hier überlebst!“",
        options: [
          { text: "[Sträfling: „Ja, dann nimm doch die 10 Erz.“]", nextStep: "opt1_zahlen" },
          { text: "[Sträfling: „Nein, Danke, aber sehr freundlich von dir!“]", nextStep: "opt2_verweigern" }
        ]
      },
      opt1_zahlen: {
        text: "Du zahlst Bloodwyn 10 Erz.\n\nBloodwyn: „Gute Entscheidung! Du könntest auch gleich noch was für mich erledigen. Da ist son Buddler gerade aus der Mine gekommen, der trieft vor Erz, aber er drückt sich davor herum ins Lager zu kommen. Er will wohl seine Erzsteuer nicht entrichten. Gehe zu ihm und richte ihm schöne Grüße aus, wenn du verstehst, was ich meine!“",
        condition: "Gehe zu Feld 81.",
        onEnter: function(h) { window.loseOre(10); }
      },
      buddler_treffen: {
        text: "Buddler: „Hey Mann, auch hier. Ich entspann mich hier erstmal von dem Stress im Lager.“\n\nSträfling: „Bloodwyn schickt mich.“\n\nBuddler: „Wie bitte was… Bloodwyn?“\n\nSträfling: „Ich soll dir schöne Grüße von Bloodwyn bestellen!“",
        options: [
          { text: "[Ein Kampf gegen den „schwächlichen Buddler“ beginnt!]", nextStep: "buddler_besiegt" }
        ]
      },
      buddler_besiegt: {
        text: "Du hast den Buddler besiegt!",
        condition: "Gehe zurück zu Bloodwyn!"
      },
      opt1_end: {
        text: "Bloodwyn: „Na? Haste ihm gezeigt, wer das Sagen im Lager hat?“\n\nSträfling: „Er schien nicht erfreut zu sein von dir zu hören.“\n\nBloodwyn: „Ja, das hab ich mir gedacht und wo ist mein Erz?“\n\nSträfling: „Hier ist es! Wir machen wohl Halbe-Halbe!“\n\nBloodwyn: „Halbe-Halbe mit einem Penner wie dir. Ich nehme mir das restliche Erz von dir als Vorkasse für Morgen, da bist du ja auch wieder fällig!“\n\nDu verlierst 20 Erz (oder alles was du hast). Du erhältst 40 Erfahrung.\n\nQuest erfolgreich!",
        onEnter: function(h) { const amt = Math.min(20, h.ore || 0); window.loseOre(amt); window.gainXp(40); }
      },
      opt2_verweigern: {
        text: "Bloodwyn: „Du wirst schon sehen, was du davon hast!“\n\nNachdem der neue Runde Button 3 mal angeklickt wurde, wirst du von Bloodwyns Schlägern abgefangen!\n\nBuddler: „Ich soll dir schöne Grüße von Bloodwyn bestellen!“\n\nDu kämpfst jetzt gegen 3 von „Bloodwyns Schlägern“!\n\nQuest fehlgeschlagen!",
        onEnter: function(h) {}
      }
    }
  }
};
