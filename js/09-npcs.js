// --- GOLDEN EGG ---
const GOLDEN_EGG_POS = { x: 15, y: 37 };

// --- NPC DEFINITIONS ---
const npcs = [
  {
    id: 'bakker', name: 'Bakker Piet', x: 24*T+16, y: 10*T+16,
    dir: 2, dialog: [], marker: null,
    defaultDialog: [
      { speaker: 'Bakker Piet', text: 'Welkom bij de bakkerij! Vandaag verse broodjes!' },
      { speaker: 'Bakker Piet', text: 'Heb je al gehoord van die vreemde lichten in het bos vannacht?' }
    ],
    missionDialog: {
      'golden_omelet_investigate': [
        { speaker: 'Noedels', text: 'Bakker Piet, heb je misschien een gouden ei gezien?' },
        { speaker: 'Bakker Piet', text: 'Een gouden ei?! Nee jansen... maar ik hoorde de Boer gisteren mompelen over iets glinsterends bij het bos.' },
        { speaker: 'Bakker Piet', text: 'En die rare uitvinder was hier ook, vroeg om "materiaal voor een experiment"... verdacht als je het mij vraagt!' },
        { speaker: 'De Kip', text: '*tok tok*' },
      ],
      'recipe_search': [
        { speaker: 'Noedels', text: 'Bakker Piet! Ik heb het recept gevonden!' },
        { speaker: 'Bakker Piet', text: 'WERKELIJK?! Het Geheime Noedelbrood Recept! Geweldig!' },
        { speaker: 'Bakker Piet', text: 'Laat me eens kijken... "meel, water, gouden noodlekruiden, en een vleugje kippenliefde"...' },
        { speaker: 'De Kip', text: '*TOK!*' },
        { speaker: 'Bakker Piet', text: 'Dankjewel Noedels! Hier, een vers Noedelbrood als beloning!' },
      ]
    },
    moveRadius: 2, homeX: 24*T+16, homeY: 10*T+16, moveTimer: 0
  },
  {
    id: 'boer', name: 'Boer Henk', x: 8*T+16, y: 22*T+16,
    dir: 2, dialog: [], marker: null,
    defaultDialog: [
      { speaker: 'Boer Henk', text: 'Mooie dag voor het land, niet?' },
      { speaker: 'Boer Henk', text: 'M\'n koeien zijn rustig vandaag. Dat is altijd een goed teken.' }
    ],
    missionDialog: {
      'golden_omelet_investigate': [
        { speaker: 'Noedels', text: 'Boer Henk! Weet jij iets over een verdwenen gouden ei?' },
        { speaker: 'Boer Henk', text: 'Een gouden ei... Hmm. Ik zag gisteravond wel iets glinsterends richting het bos rollen.' },
        { speaker: 'Boer Henk', text: 'Het leek alsof iemand het probeerde te verbergen in het hoge gras, voorbij het kruispunt.' },
        { speaker: 'Noedels', text: 'In het bos! Bedankt Boer Henk!' },
        { speaker: 'De Kip', text: '*TOK!*' },
      ]
    },
    moveRadius: 3, homeX: 8*T+16, homeY: 22*T+16, moveTimer: 0
  },
  {
    id: 'uitvinder', name: 'Professor Kansen', x: 32*T+16, y: 10*T+16,
    dir: 2, dialog: [], marker: null,
    defaultDialog: [
      { speaker: 'Professor Kansen', text: 'Ah! Perfecte timing! Ik ben bezig met mijn nieuwste uitvinding!' },
      { speaker: 'Professor Kansen', text: 'Een machine die van gewone eieren GOUDEN eieren maakt! ...In theorie.' },
      { speaker: 'Noedels', text: '...Gouden eieren?' },
      { speaker: 'Professor Kansen', text: 'Ja! Maar eh... ik heb nog wat kalibratie-problemen. Kleine explosie gisteren. Heel klein. Nauwelijks merkbaar.' },
    ],
    missionDialog: {
      'golden_omelet_investigate': [
        { speaker: 'Noedels', text: 'Professor, u maakt gouden eieren? Er is er eentje verdwenen uit het kippenhok!' },
        { speaker: 'Professor Kansen', text: 'V-verdwenen?! Mijn prototype! Het moet weggerold zijn bij de explosie!' },
        { speaker: 'Professor Kansen', text: 'Het rolde richting het bos! Zoek in het HOGE GRAS, voorbij het pad naar het zuiden!' },
        { speaker: 'Professor Kansen', text: 'Wees voorzichtig, het ei kan een beetje... gloeien.' },
        { speaker: 'De Kip', text: '*tok tok tok tok!*' },
      ],
      'fix_invention': [
        { speaker: 'Noedels', text: 'Professor! Ik heb de 3 tandwielen gevonden!' },
        { speaker: 'Professor Kansen', text: 'FANTASTISCH! Met deze tandwielen kan ik de Ei-O-Matic 3000 repareren!' },
        { speaker: 'Professor Kansen', text: '*rommelt en sleutelt*' },
        { speaker: 'Professor Kansen', text: 'HA! Hij werkt! Nou ja, min of meer. Hier, als dank: mijn experimentele Snelheids-Schoenen!' },
        { speaker: 'Noedels', text: 'Ehm... zijn deze veilig?' },
        { speaker: 'Professor Kansen', text: '...Waarschijnlijk!' },
      ]
    },
    moveRadius: 1, homeX: 32*T+16, homeY: 10*T+16, moveTimer: 0
  },
  {
    id: 'visser', name: 'Visser Jan', x: 29*T+16, y: 22*T+16,
    dir: 0, dialog: [], marker: null,
    defaultDialog: [
      { speaker: 'Visser Jan', text: '...Ssst. De vissen bijten vandaag niet.' },
      { speaker: 'Visser Jan', text: 'Misschien morgen. Of overmorgen. Een visser heeft geduld nodig.' },
    ],
    missionDialog: {
      'catch_fish': [
        { speaker: 'Noedels', text: 'Visser Jan! Ik heb 3 vissen gevangen bij de vijver in het bos!' },
        { speaker: 'Visser Jan', text: '...Drie vissen? Van de bosvijver? Die zijn zeldzaam!' },
        { speaker: 'Visser Jan', text: 'Dankjewel, jansen. Hier, neem mijn oude vishengel. Misschien heb je er meer aan dan ik.' },
        { speaker: 'De Kip', text: '*tok*' },
      ],
      'catch_fish_start': [
        { speaker: 'Visser Jan', text: '...Luister. Ik heb een probleem.' },
        { speaker: 'Visser Jan', text: 'Er zwemmen zeldzame Goud-Baarzen in de bosvijver. Maar mijn rug...' },
        { speaker: 'Visser Jan', text: 'Kun jij 3 stuks voor me vangen? Loop naar de grote vijver in het bos, ten oosten van het bospad.' },
        { speaker: 'Visser Jan', text: 'Je ziet rode dobbers in het water. Loop ernaartoe en druk op de actieknop om te vissen!' },
        { speaker: 'Noedels', text: 'Vis vangen? Klinkt ontspannend!' },
        { speaker: 'De Kip', text: '*tok tok*' },
      ]
    },
    moveRadius: 1, homeX: 29*T+16, homeY: 22*T+16, moveTimer: 0
  }
];