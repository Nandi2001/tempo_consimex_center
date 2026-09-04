import { Chapter } from '../types/project';

// -------------------------------------------------------------
// CHAPTER 1 PAGES
// -------------------------------------------------------------
const CH1_PAGE_1_COVER = `
<div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0f172a; min-height: 960px; display: flex; flex-direction: column; justify-content: space-between; text-align: center; padding: 16px 12px;">
  <!-- Title Header -->
  <div>
    <div style="border-bottom: 3px solid #0f172a; padding-bottom: 12px; margin: 0 auto 10px auto; width: 85%;">
      <h1 style="font-size: 28px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; color: #0f172a; margin: 0 0 6px 0; line-height: 1.2;">
        CARTE TEHNICĂ
      </h1>
      <h2 style="font-size: 20px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #0267c8; margin: 0; line-height: 1.2;">
        STAȚIE DE POMPARE
      </h2>
    </div>
    <div style="font-size: 14px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
      {{TIP_SP}}
    </div>

    <!-- Center Key Parameters -->
    <div style="margin-bottom: 8px;">
      <div style="font-size: 20px; font-weight: 900; color: #0f172a; line-height: 1.3; margin-bottom: 2px;">
        {{DENUMIRE_LOCATIE}}
      </div>
      <div style="font-size: 14.5px; font-weight: 700; color: #334155; margin-bottom: 4px;">
        {{LOCALITATE}}, jud. {{JUDET}}
      </div>
      <div style="font-size: 13.5px; font-weight: 800; color: #0267c8;">
        SP cu {{NR_POMPE}} pompe {{DEBIT_POMPARE}} / {{INALTIME_POMPARE}}
      </div>
    </div>
  </div>

  <!-- Picture Container in the Middle -->
  <div style="margin: 8px auto; width: 100%; max-width: 540px; display: flex; justify-content: center; align-items: center;">
    {{IMAGINE_COPERTA}}
  </div>

  <!-- Investment & Contractor Metadata -->
  <div>
    <div style="max-width: 560px; margin: 0 auto; text-align: left; font-size: 12.5px; color: #334155; line-height: 1.7; padding-top: 8px; width: 100%; border-top: 1.5px solid #e2e8f0;">
      <div><strong style="color: #0f172a;">Investiția:</strong> {{BENEFICIAR}}</div>
      <div><strong style="color: #0f172a;">Antreprenor:</strong> {{ANTREPRENOR}}</div>
      <div><strong style="color: #0f172a;">Furnizor:</strong> {{FURNIZOR}}</div>
    </div>

    <!-- Year -->
    <div style="font-size: 15px; font-weight: 800; color: #1e293b; margin-top: 10px;">
      - {{AN_FABRICATIE}} -
    </div>
  </div>
</div>
`;

const CH1_PAGE_2_LETTER = `
<div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0f172a; font-size: 13.5px; line-height: 1.8; text-align: justify; padding: 20px 16px;">
  <!-- Left-aligned Header Title -->
  <div style="border-bottom: 2px solid #0267c8; padding-bottom: 10px; margin-bottom: 24px; text-align: left;">
    <h3 style="font-size: 18px; font-weight: 800; text-transform: uppercase; color: #0f172a; margin: 0; letter-spacing: 0.5px;">
      Cuvânt Înainte & Recomandări de Exploatare
    </h3>
  </div>

  <p style="margin-bottom: 16px;">
    Vă mulțumim că ați achiziționat produsul firmei noastre și avem convingerea că veți fi pe deplin satisfăcuți prin utilizarea acestui produs.
  </p>

  <p style="margin-bottom: 16px;">
    Prezenta <strong>carte tehnică</strong> conține informații indispensabile pentru cei care exploatează stația de pompare. Din acest motiv recomandăm ca prezenta carte să ajungă la serviciul care se ocupă direct de exploatarea stației.
  </p>

  <p style="margin-bottom: 16px;">
    Având în vedere că firma noastră acordă după expirarea perioadei de garanție asistență de exploatare vă rugăm a ne contacta cu problemele Dvs. la numerele de telefon:
  </p>

  <div style="background-color: #f8fafc; border: 1.5px solid #cbd5e1; border-left: 5px solid #0267c8; border-radius: 8px; padding: 18px 24px; margin: 24px 0; font-size: 14px;">
    <div style="font-weight: 800; color: #0f172a; margin-bottom: 4px;">Asistență tehnică:</div>
    <div style="font-family: monospace; font-weight: bold; font-size: 15px; color: #0267c8;">{{TELEFON_SERVICE}}</div>
  </div>

  <p style="margin-bottom: 16px;">
    și să ne prezentați problema ivită. Chiar dacă nu pe moment, dar în scurt timp veți fi contactat de personalul firmei noastre și veți fi îndrumat cu soluția optimă.
  </p>

  <div style="margin-top: 80px; text-align: right;">
    <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 1px; margin-bottom: 4px;">
      FURNIZOR,
    </div>
    <div style="font-size: 17px; font-weight: 800; color: #0267c8;">
      {{FURNIZOR}}
    </div>
  </div>
</div>
`;

// -------------------------------------------------------------
// CHAPTER 3 PAGES: DESCRIERE SP (2 PAGES)
// -------------------------------------------------------------
// CHAPTER 3 PAGES: DESCRIERE SP (2 PAGES)
// -------------------------------------------------------------
const CH3_PAGE_1 = `
<div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0f172a; font-size: 13px; line-height: 1.7; text-align: justify; padding: 16px;">
  <!-- Left-aligned Chapter Header -->
  <div style="border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 18px; text-align: left;">
    <h2 style="font-size: 18px; font-weight: 900; text-transform: uppercase; color: #0f172a; margin: 0 0 6px 0;">
      DESCRIERE STAȚIE DE POMPARE
    </h2>
    <div style="font-size: 13px; font-weight: 700; color: #0267c8;">
      Debitul stației de pompare: <span style="color: #0f172a;">{{DEBIT_POMPARE}}</span> &nbsp;|&nbsp; Înălțimea de pompare: <span style="color: #0f172a;">{{INALTIME_POMPARE}}</span>
    </div>
  </div>

  <h3 style="font-size: 14.5px; font-weight: 800; color: #0f172a; margin: 16px 0 8px 0; text-transform: uppercase;">
    1. DESCRIERE CONSTRUCTIVĂ
  </h3>
  <p style="margin-bottom: 10px;">
    {{BAZIN_CONSTRUCTIV_DESCRIERE}}
  </p>
  <ul style="margin: 0 0 14px 20px; padding: 0;">
    <li style="margin-bottom: 6px;">{{NR_POMPE}} goluri tehnologice {{DIAMETRU_GOLURI_POMPE}} mm supraînălțate și acoperite cu capace de fontă pentru lansarea/scoaterea pompelor submersibile</li>
    <li style="margin-bottom: 6px;">un gol de acces {{DIAMETRU_GOL_ACCES}} mm supraînălțat și dotat cu scară și acoperit cu capac de fontă pentru vizitarea interiorului bazinului</li>
    <li style="margin-bottom: 6px;">bazinul are rol de retenție</li>
    <li style="margin-bottom: 6px;">refularea se face pe o conductă {{DIAMETRU_REFULARE}}</li>
  </ul>
  <p style="margin-bottom: 14px; font-weight: 600;">
    Accesul în stația de pompare este asigurată cu o scară fixă.
  </p>

  <h3 style="font-size: 14.5px; font-weight: 800; color: #0f172a; margin: 16px 0 8px 0; text-transform: uppercase;">
    2. DESCRIERE HIDRAULICĂ
  </h3>
  <p style="margin-bottom: 14px;">
    Stația de pompare asigură golirea apei meteorice provenite din rețeaua de canalizare de pe suprafața <strong>{{DENUMIRE_LOCATIE}}</strong>, localitatea <strong>{{LOCALITATE}}</strong>, jud. <strong>{{JUDET}}</strong>. Aceasta este pompată prin intermediul a <strong>{{NR_POMPE}} pompe submersibile</strong> la o înălțime echivalentă de <strong>{{INALTIME_POMPARE}}</strong> la debitul solicitat de beneficiar de <strong>{{DEBIT_POMPARE}}</strong>.
  </p>

  <h3 style="font-size: 14.5px; font-weight: 800; color: #0f172a; margin: 16px 0 8px 0; text-transform: uppercase;">
    3. DESCRIEREA ECHIPAMENTELOR
  </h3>

  <div style="font-weight: 700; color: #1e293b; margin: 8px 0 4px 0;">3.1. Descrierea pompelor</div>
  <p style="margin-bottom: 10px;">
    În stația de pompare s-au montat <strong>{{NR_POMPE}} pompe submersibile</strong> tip <strong>{{TIP_POMPE}}</strong> conform anexelor. Permite trecerea particulelor cu diametrul de până la <strong>{{DIMENSIUNE_PARTICULA}}</strong>. Ele vor funcționa alternativ și se vor monta pe elemente de cuplare prin intermediul unor ghidaje ce permit îndepărtarea lor prin simpla ridicare prin fantele de vizitare din placa necarosabilă.
  </p>
  <p style="margin-bottom: 10px;">
    Lanțurile zincate se verifică periodic și în caz de erodare se înlocuiesc.
  </p>

  <div style="font-weight: 700; color: #1e293b; margin: 10px 0 4px 0;">3.2. Controlul nivelului de apă</div>
  <p style="margin-bottom: 10px;">
    Nivelul apei din stația de pompare este controlat prin intermediul a <strong>{{NR_COMUTATOARE}} comutatoare de nivel</strong> așezate în ordinea crescătoare după cum urmează:
  </p>
  {{COMUTATOARE_NIVEL_LISTA}}
</div>
`;

const CH3_PAGE_2 = `
<div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0f172a; font-size: 13px; line-height: 1.7; text-align: justify; padding: 16px;">
  <div style="font-weight: 700; color: #1e293b; margin: 0 0 4px 0;">3.3. Tablou de automatizări</div>
  <p style="margin-bottom: 16px;">
    Tabloul de automatizări coordonează toată stația de pompare. Se va studia descrierea acesteia la capitolul <strong>Electrice și Tabloul de comandă</strong>.
  </p>

  <h3 style="font-size: 14.5px; font-weight: 800; color: #0f172a; margin: 16px 0 8px 0; text-transform: uppercase;">
    4. ÎNTREȚINERE
  </h3>
  <p style="margin-bottom: 12px;">
    Stația de pompare nu necesită întreținere specială. Se va verifica starea acesteia lunar printr-o inspecție și se va consemna în jurnalul de întreținere. Se va urmări depunerea de nămol pe partea inferioară a stației de pompare. Se curăță prin vidanjare la fiecare 12 luni în vederea decolmatării acesteia, dacă este cazul.
  </p>

  <p style="margin-bottom: 10px; font-weight: 700;">
    Având în vedere situațiile apărute la alte stații de pompare recomandăm următoarele:
  </p>
  <div style="margin: 0 0 12px 0;">
    <p style="margin-bottom: 8px;">Întocmirea unui jurnal al stației de pompare.</p>
    <p style="margin-bottom: 8px;">La început verificarea zilnică / săptămânală / lunară a stației de pompare și golirea acesteia prin vidanjare dacă este necesar. Pe baza datelor înregistrate ulterior se poate stabili un program de întreținere adaptat la necesitățile reale.</p>
  </div>

  <p style="margin-bottom: 20px;">
    Aceste măsuri vor reduce semnificativ costurile de exploatare.
  </p>

  <div style="margin-top: 80px; text-align: right;">
    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b;">FURNIZOR,</div>
    <div style="font-size: 16px; font-weight: 800; color: #0267c8;">{{FURNIZOR}}</div>
  </div>
</div>
`;

// -------------------------------------------------------------
// CHAPTER 4 PAGES: POMPE SP (1 PAGE)
// -------------------------------------------------------------
const CH4_PAGE_1 = `
<div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0f172a; font-size: 13px; line-height: 1.7; text-align: justify; padding: 16px;">
  <!-- Left-aligned Chapter Header -->
  <div style="border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 18px; text-align: left;">
    <h2 style="font-size: 18px; font-weight: 900; text-transform: uppercase; color: #0f172a; margin: 0 0 6px 0;">
      POMPE SP
    </h2>
    <div style="font-size: 13px; font-weight: 700; color: #0267c8;">
      Debitul stației de pompare: <span style="color: #0f172a;">{{DEBIT_POMPARE}}</span> &nbsp;|&nbsp; Înălțimea de pompare: <span style="color: #0f172a;">{{INALTIME_POMPARE}}</span>
    </div>
  </div>

  <h3 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 16px 0 8px 0; text-transform: uppercase;">
    DESCRIEREA POMPELOR
  </h3>
  <p style="margin-bottom: 12px;">
    În stația de pompare s-au montat <strong>{{NR_POMPE}} pompe submersibile</strong> tip <strong>{{TIP_POMPE}}</strong> conform anexelor. Ele vor funcționa alternativ și se vor monta pe elemente de cuplare prin intermediul unor ghidaje ce permit îndepărtarea lor prin simpla ridicare prin fantele de vizitare din placa necarosabilă. Lanțurile zincate se verifică periodic și în caz de erodare se înlocuiesc.
  </p>

  <p style="margin-bottom: 16px;">
    În paginile următoare veți găsi caracteristicile pompelor.
  </p>

  <!-- Blue Information Box -->
  <div style="background-color: #eff6ff; border: 1.5px solid #bfdbfe; border-left: 5px solid #0267c8; padding: 14px 18px; border-radius: 6px; font-size: 13px; color: #1e3a8a; margin: 20px 0;">
    Pentru informații suplimentare studiați cărțile tehnice ale producătorului atașate, respectiv pe site-ul <strong>www.grundfos.com</strong>
  </div>

  <!-- Serial Numbers Box -->
  <div style="background-color: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 20px; margin: 24px 0;">
    <h4 style="font-size: 13px; font-weight: 900; text-transform: uppercase; text-align: center; color: #0f172a; margin: 0 0 14px 0; letter-spacing: 0.5px;">
      PRODUSELE MONTATE AU NUMERELE DE SERIE:
    </h4>
    <div style="margin: 0 auto; max-width: 500px;">
      {{SERII_POMPE_LISTA}}
    </div>
  </div>

  <div style="margin-top: 80px; text-align: right;">
    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b;">FURNIZOR,</div>
    <div style="font-size: 16px; font-weight: 800; color: #0267c8;">{{FURNIZOR}}</div>
  </div>
</div>
`;

// -------------------------------------------------------------
// CHAPTER 9 PAGES: JURNAL INTRETINERE (4 PAGES)
// -------------------------------------------------------------
const makeJurnalPage = () => `
<div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0f172a; padding: 16px;">
  <!-- Centered Title for Jurnal -->
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="font-size: 22px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; color: #0f172a; margin: 0;">
      JURNAL ÎNTREȚINERE
    </h2>
  </div>

  <!-- Full Height Blank Table Structure -->
  <table style="width: 100%; border-collapse: collapse; border: 2px solid #0f172a; font-size: 11px; height: 860px;">
    <thead>
      <tr style="background-color: #f1f5f9; font-weight: bold; color: #0f172a; text-align: center; border-bottom: 2px solid #0f172a; height: 36px;">
        <th style="border: 1px solid #64748b; padding: 8px 4px; width: 10%; text-transform: uppercase;">Nr. crt.</th>
        <th style="border: 1px solid #64748b; padding: 8px 6px; width: 16%; text-transform: uppercase;">Data</th>
        <th style="border: 1px solid #64748b; padding: 8px 8px; width: 40%; text-transform: uppercase;">Denumirea operației</th>
        <th style="border: 1px solid #64748b; padding: 8px 6px; width: 20%; text-transform: uppercase;">Nume / prenume / calitate</th>
        <th style="border: 1px solid #64748b; padding: 8px 6px; width: 14%; text-transform: uppercase;">Semnătura</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #94a3b8; height: 820px; vertical-align: top;"></td>
        <td style="border: 1px solid #94a3b8; height: 820px; vertical-align: top;"></td>
        <td style="border: 1px solid #94a3b8; height: 820px; vertical-align: top;"></td>
        <td style="border: 1px solid #94a3b8; height: 820px; vertical-align: top;"></td>
        <td style="border: 1px solid #94a3b8; height: 820px; vertical-align: top;"></td>
      </tr>
    </tbody>
  </table>
</div>
`;

// -------------------------------------------------------------
// CHAPTER 10 PAGES: SSM (2 PAGES - FORMATTED EXACTLY LIKE 11_SECURITATEA MUNCII.pdf)
// -------------------------------------------------------------
const CH10_PAGE_1_SSM = `
<div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0f172a; font-size: 12.5px; line-height: 1.6; text-align: justify; padding: 16px;">
  <!-- Left-aligned Header Title -->
  <div style="border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 16px; text-align: left;">
    <h2 style="font-size: 18px; font-weight: 900; text-transform: uppercase; color: #0f172a; margin: 0;">
      SĂNĂTATEA ȘI SECURITATEA MUNCII
    </h2>
  </div>

  <p style="font-weight: 700; margin-bottom: 12px;">
    Pentru reducerea riscului de accidentare și de îmbolnăvire a personalului de exploatare și întreținere a stației de pompare se vor respecta următoarele:
  </p>

  <p style="margin-bottom: 8px;">
    <strong>1.</strong> Capacele fantelor de vizitare vor fi închise permanent.
  </p>

  <p style="margin-bottom: 8px;">
    <strong>2.</strong> În cazul efectuării operațiilor de întreținere când capacele se deschid zona se va asigura împotriva accesului persoanelor neautorizate prin delimitare și inscripționare corespunzătoare.
  </p>

  <p style="margin-bottom: 8px;">
    <strong>3.</strong> Operațiile de întreținere a stației de pompare nu necesită accesul în stația de pompare. Pompele se pot ridica și evacua din stația de pompare cu ajutorul lanțului cu care sunt dotați, comutatoarele de nivel se ridică de la cablurile de alimentare iar coșurile de reținere impurități se ridică de la lanțul de care sunt atârnate.
  </p>

  <p style="margin-bottom: 8px;">
    <strong>4.</strong> Operațiile de întreținere se vor efectua în echipe formate din 2 persoane, niciodată de o singură persoană. Unul va efectua operațiunile de întreținere iar celălalt va supraveghea.
  </p>

  <p style="margin-bottom: 8px;">
    <strong>5.</strong> Intrarea echipelor de lucru în rețeaua de canalizare (cămine, camere de deversare, stații de pompare, etc.) se va face numai după aerisirea spațiilor respective cel puțin o jumătate de oră. Aerisirea se va face prin ridicarea capacelor deasupra zonei de lucru și a celor din amonte pentru a crea curentul de aer necesar aerisirii. Stațiile de pompare se vor aerisi cel puțin 4 ore dacă nu sunt dotate cu instalații de aerisire artificiale. Se verifică aerisirea spațiului de lucru, lipsa gazelor nocive și abia după aceea se intră în ea.
  </p>

  <p style="margin-bottom: 8px;">
    <strong>6.</strong> Intrarea în aceste zone de lucru se va face cu masca de gaze, lucrătorii vor purta centuri de siguranță pentru a putea fi evacuați de urgență în caz de necesitate.
  </p>

  <p style="margin-bottom: 8px;">
    <strong>7.</strong> Intrarea în spațiile de lucru se va face după verificarea stării scărilor de acces.
  </p>

  <p style="margin-bottom: 8px;">
    <strong>8.</strong> În cazul în care construcțiile respective nu sunt dotate cu scări de acces se vor folosi scări ale căror lungime va depăși cu cel puțin 1.00 m adâncimea la care se coboară.
  </p>

  <p style="margin-bottom: 4px;">
    <strong>9.</strong> Pentru a nu fi expuși pericolului contactării unor boli infecțioase se iau următoarele măsuri:
  </p>
  <ul style="margin: 0 0 8px 24px; padding: 0; list-style-type: disc;">
    <li style="margin-bottom: 3px;">vaccinarea anti-paratifică și antitetanică la intervale stabilite de medic;</li>
    <li style="margin-bottom: 3px;">curățirea echipamentului și sculelor imediat după terminarea lucrului;</li>
    <li style="margin-bottom: 3px;">păstrarea separată a hainelor de lucru și a celor de stradă;</li>
    <li style="margin-bottom: 3px;">spălarea după ieșirea din spațiul de lucru;</li>
    <li style="margin-bottom: 3px;">echipamentul odată folosit nu se va utiliza la alte lucrări;</li>
    <li style="margin-bottom: 3px;">interzicerea servirii mesei cu mâinile nespălate sau în hainele de lucru;</li>
    <li style="margin-bottom: 3px;">mâinile murdare nu se vor duce la ochi sau la gură;</li>
    <li style="margin-bottom: 3px;">existența trusei sanitare la locul de muncă în vederea dezinfectării mâinilor cu spirt sanitar.</li>
  </ul>

  <p style="margin-bottom: 8px;">
    <strong>10.</strong> Având în vedere că efectuarea lucrărilor de acest gen se efectuează rar, hainele de lucru vor fi spălate după executarea lucrărilor de acest gen. Pentru evitarea murdăririi hainelor de lucru lucrătorii vor fi dotați cu combinezoane de rafie de unică folosință.
  </p>
</div>
`;

const CH10_PAGE_2_SSM = `
<div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0f172a; font-size: 12.5px; line-height: 1.6; text-align: justify; padding: 16px;">
  <p style="margin-bottom: 12px;">
    <strong>11.</strong> Lucrările în interiorul obiectelor vizitabile se vor efectua în așa fel încât lucrătorii să nu fie surprinși de creșterea bruscă a debitului. În cazul în care apare un curent de aer cu miros de hidrogen sulfurat lucrătorii vor ieși la suprafață. Reluarea lucrului se va face după ce s-a constatat că nu mai există niciun pericol.
  </p>

  <p style="margin-bottom: 12px;">
    <strong>12.</strong> În timpul lucrului în canalizare sau la obiectele acesteia se interzice fumatul, iluminatul cu flacără deschisă. Pentru iluminat se vor utiliza lămpi cu tensiuni nepericuloase.
  </p>

  <p style="margin-bottom: 12px;">
    <strong>13.</strong> În cazul executării lucrărilor de altă natură în interiorul acestor obiecte sunt valabile instrucțiunile specifice activității desfășurate (ex. sudură, tăiere, etc.) cu condiția ca obiectele în care se execută aceste lucrări să fie scoase din funcțiune.
  </p>

  <p style="margin-bottom: 12px;">
    <strong>14.</strong> Pentru evitarea oricărui pericol de accidentare sau îmbolnăvire recomandăm apelarea la un service de specialitate pentru efectuarea lucrărilor de întreținere, curățire și/sau reparație.
  </p>

  <div style="margin-top: 80px; text-align: right;">
    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b;">FURNIZOR,</div>
    <div style="font-size: 16px; font-weight: 800; color: #0267c8;">{{FURNIZOR}}</div>
  </div>
</div>
`;

// -------------------------------------------------------------
// CHAPTER 11 PAGES: DEFECTIUNI (1 PAGE)
// -------------------------------------------------------------
const CH11_PAGE_1 = `
<div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0f172a; font-size: 11.5px; line-height: 1.5; padding: 16px;">
  <!-- Left-aligned Header Title -->
  <div style="border-bottom: 2px solid #0f172a; padding-bottom: 6px; margin-bottom: 14px; text-align: left;">
    <h2 style="font-size: 16px; font-weight: 900; text-transform: uppercase; color: #0f172a; margin: 0 0 4px 0;">
      LISTA DEFECȚIUNILOR FRECVENTE ȘI REMEDIEREA ACESTORA
    </h2>
  </div>

  <table style="width: 100%; border-collapse: collapse; border: 1.5px solid #0f172a; font-size: 11px; margin-bottom: 16px; background-color: #ffffff;">
    <thead>
      <tr style="background-color: #f1f5f9; font-weight: 800; color: #0f172a; border-bottom: 1.5px solid #0f172a;">
        <th style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; width: 18%;">Avaria</th>
        <th style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; width: 20%;">Defecțiune</th>
        <th style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; width: 18%;">Efect</th>
        <th style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; width: 21%;">Cauza</th>
        <th style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; width: 23%;">Remediere</th>
      </tr>
    </thead>
    <tbody>
      <!-- Block 1: Statia de pompare este plina -->
      <tr>
        <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold; background-color: #f8fafc; vertical-align: top;">
          Stația de pompare este plină
        </td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; vertical-align: top;">
          Nu se golește stația de pompare
        </td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; vertical-align: top;">
          Refulare pe conducta de canalizare
        </td>
        <td style="border: 1px solid #cbd5e1; padding: 0; vertical-align: top;">
          <div style="padding: 6px 8px; border-bottom: 1px solid #cbd5e1;">Comutatoare de nivel defecte</div>
          <div style="padding: 6px 8px; border-bottom: 1px solid #cbd5e1;">Pompă defectă</div>
          <div style="padding: 6px 8px;">Debit afluent prea mare</div>
        </td>
        <td style="border: 1px solid #cbd5e1; padding: 0; vertical-align: top;">
          <div style="padding: 6px 8px; border-bottom: 1px solid #cbd5e1;">Se verifică și se curăță sau se înlocuiesc</div>
          <div style="padding: 6px 8px; border-bottom: 1px solid #cbd5e1;">Se repară</div>
          <div style="padding: 6px 8px;">Se corectează</div>
        </td>
      </tr>

      <!-- Block 2: Pompa defecta -->
      <tr style="background-color: #fafbfc;">
        <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold; background-color: #f8fafc; vertical-align: top;">
          Pompa defectă
        </td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; vertical-align: top;">
          Pompă nefuncțională
        </td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; vertical-align: top;">
          Nu descarcă
        </td>
        <td style="border: 1px solid #cbd5e1; padding: 0; vertical-align: top;">
          <div style="padding: 6px 8px; border-bottom: 1px solid #cbd5e1;">Pompa blocată</div>
          <div style="padding: 6px 8px;">Pompa defectă</div>
        </td>
        <td style="border: 1px solid #cbd5e1; padding: 0; vertical-align: top;">
          <div style="padding: 6px 8px; border-bottom: 1px solid #cbd5e1;">Se deblochează</div>
          <div style="padding: 6px 8px;">Se repară sau se înlocuiește</div>
        </td>
      </tr>

      <!-- Block 3: Lipsa semnal -->
      <tr>
        <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold; background-color: #f8fafc; vertical-align: top;">
          Lipsă semnal
        </td>
        <td style="border: 1px solid #cbd5e1; padding: 0; vertical-align: top;">
          <div style="padding: 6px 8px; border-bottom: 1px solid #cbd5e1;">Stație de pompare nefuncțională</div>
          <div style="padding: 6px 8px;">Nu se descarcă stația de pompare deși pompele funcționează</div>
        </td>
        <td style="border: 1px solid #cbd5e1; padding: 0; vertical-align: top;">
          <div style="padding: 6px 8px; border-bottom: 1px solid #cbd5e1;">Nu funcționează stația</div>
          <div style="padding: 6px 8px;">Crește nivelul apei</div>
        </td>
        <td style="border: 1px solid #cbd5e1; padding: 0; vertical-align: top;">
          <div style="padding: 6px 8px; border-bottom: 1px solid #cbd5e1;">Tensiune de alimentare necorespunzătoare</div>
          <div style="padding: 6px 8px;">Supapă sens blocată</div>
        </td>
        <td style="border: 1px solid #cbd5e1; padding: 0; vertical-align: top;">
          <div style="padding: 6px 8px; border-bottom: 1px solid #cbd5e1;">Se verifică și se corectează</div>
          <div style="padding: 6px 8px;">Se demontează și se curăță</div>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- 3 Yellow Boxes One After Another -->
  <div style="background-color: #fffbeb; border: 1.5px solid #fef3c7; border-left: 5px solid #f59e0b; padding: 10px 14px; border-radius: 6px; margin-bottom: 10px; font-size: 11.5px; color: #92400e;">
    <strong>Mod de intervenție:</strong> În cazul nefuncționării în mod automat a stației de pompare se trece în mod de lucru <strong>MANUAL</strong> pentru a trage concluziile.
  </div>

  <div style="background-color: #fffbeb; border: 1.5px solid #fef3c7; border-left: 5px solid #f59e0b; padding: 10px 14px; border-radius: 6px; margin-bottom: 10px; font-size: 11.5px; color: #92400e;">
    <strong>Atenție!</strong> Practic este exclus ca ambele pompe să se defecteze simultan. Pompa blocată din cauza înfundării rotorului sau blocării cuțitelor tocătoare nu este defecțiune garanțională și se va remedia contra cost de service.
  </div>

  <div style="background-color: #fffbeb; border: 1.5px solid #fef3c7; border-left: 5px solid #f59e0b; padding: 10px 14px; border-radius: 6px; margin-bottom: 14px; font-size: 11.5px; color: #92400e;">
    În cazul în care nu reușiți să remediați defecțiunea vă rugăm a solicita suport tehnic la numerele de telefon: <strong>{{TELEFON_SERVICE}}</strong> sau a apela la service.
  </div>
</div>
`;

// -------------------------------------------------------------
// CHAPTER 12 PAGES: ELECTRICE (1 PAGE)
// -------------------------------------------------------------
const CH12_PAGE_1 = `
<div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0f172a; font-size: 13px; line-height: 1.7; text-align: justify; padding: 16px;">
  <!-- Left-aligned Header Title -->
  <div style="border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 20px; text-align: left;">
    <h2 style="font-size: 18px; font-weight: 900; text-transform: uppercase; color: #0f172a; margin: 0;">
      TABLOUL DE COMANDĂ
    </h2>
  </div>

  <p style="margin-bottom: 14px;">
    Un exemplar din schema tabloului de comandă este amplasat în tablou. Vă rugăm a păstra acest exemplar la îndemâna electricianului de serviciu.
  </p>

  <!-- Yellow Warning Box -->
  <div style="background-color: #fffbeb; border: 1.5px solid #fef3c7; border-left: 5px solid #f59e0b; padding: 14px 18px; border-radius: 6px; margin: 20px 0; color: #92400e;">
    <strong>Atenție:</strong> Este interzisă orice modificare a tabloului de comandă în perioada de garanție. Orice intervenție neavizată de furnizor duce automat la pierderea garanției.
  </div>

  <p style="margin-bottom: 14px;">
    Suportul tabloului de comandă va fi obligatoriu racordat la rețeaua de împământare. Verificați existența acestor conexiuni ori de câte ori inspectați stația de pompare!
  </p>

  <p style="margin-bottom: 20px;">
    În cazul în care executați intervenții la părți componente cu acționare/alimentare cu energie electrică acestea se vor scoate obligatoriu de sub tensiune prin intermediul întrerupătorului general amplasat pe partea laterală a tabloului de comandă.
  </p>

  <div style="margin-top: 80px; text-align: right;">
    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b;">FURNIZOR,</div>
    <div style="font-size: 16px; font-weight: 800; color: #0267c8;">{{FURNIZOR}}</div>
  </div>
</div>
`;

// Helper to join page array into combined HTML
const joinPages = (pages: string[]) =>
  pages.join('\n<div class="a4-page-break" style="page-break-before: always; border-top: 2px dashed #cbd5e1; margin: 40px 0; padding-top: 30px;"></div>\n');

export const INITIAL_CHAPTERS: Chapter[] = [
  {
    id: 'ch-1',
    order: 1,
    number: 1,
    title: '1. Prima pagină',
    type: 'text',
    isActive: true,
    isFixed: true,
    estimatedPageCount: 2,
    pages: [CH1_PAGE_1_COVER, CH1_PAGE_2_LETTER],
    contentHtml: joinPages([CH1_PAGE_1_COVER, CH1_PAGE_2_LETTER]),
  },
  {
    id: 'ch-2',
    order: 2,
    number: 2,
    title: '2. Conținut',
    type: 'text',
    isActive: true,
    isFixed: true,
    estimatedPageCount: 1,
    pages: [
      `<div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0f172a; padding: 16px;">
        <h2 style="font-size: 22px; font-weight: 900; text-align: center; text-transform: uppercase; letter-spacing: 4px; color: #0f172a; margin: 0 0 32px 0; padding-bottom: 12px; border-bottom: 2.5px solid #0f172a;">
          C O N Ț I N U T
        </h2>
        <div class="toc-dynamic-placeholder"></div>
      </div>`
    ],
    contentHtml: `<div>Cuprins generat dinamic</div>`,
  },
  {
    id: 'ch-3',
    order: 3,
    number: 3,
    title: '3. Descriere SP',
    type: 'text',
    isActive: true,
    isFixed: true,
    estimatedPageCount: 2,
    pages: [CH3_PAGE_1, CH3_PAGE_2],
    contentHtml: joinPages([CH3_PAGE_1, CH3_PAGE_2]),
  },
  {
    id: 'ch-4',
    order: 4,
    number: 4,
    title: '4. Pompe SP',
    type: 'text',
    isActive: true,
    isFixed: true,
    estimatedPageCount: 1,
    pages: [CH4_PAGE_1],
    contentHtml: CH4_PAGE_1,
  },
  {
    id: 'ch-5',
    order: 5,
    number: 5,
    title: '5. Fișa Pompe',
    type: 'attachment',
    isActive: true,
    isFixed: true,
    attachmentKey: 'fisa_pompa',
  },
  {
    id: 'ch-6',
    order: 6,
    number: 6,
    title: '6. Test Pompă 1',
    type: 'attachment',
    isActive: true,
    isFixed: true,
    attachmentKey: 'test_pompa_1',
  },
  {
    id: 'ch-7',
    order: 7,
    number: 7,
    title: '7. Test Pompă 2',
    type: 'attachment',
    isActive: true,
    isFixed: true,
    attachmentKey: 'test_pompa_2',
  },
  {
    id: 'ch-8',
    order: 8,
    number: 8,
    title: '8. Scheme Instalație',
    type: 'attachment',
    isActive: true,
    isFixed: true,
    attachmentKey: 'schema_instalatie',
  },
  {
    id: 'ch-9',
    order: 9,
    number: 9,
    title: '9. Jurnal de Întreținere',
    type: 'text',
    isActive: true,
    isFixed: true,
    estimatedPageCount: 4,
    pages: [makeJurnalPage(), makeJurnalPage(), makeJurnalPage(), makeJurnalPage()],
    contentHtml: joinPages([makeJurnalPage(), makeJurnalPage(), makeJurnalPage(), makeJurnalPage()]),
  },
  {
    id: 'ch-10',
    order: 10,
    number: 10,
    title: '10. Securitatea și Sănătatea Muncii (SSM)',
    type: 'text',
    isActive: true,
    isFixed: true,
    estimatedPageCount: 2,
    pages: [CH10_PAGE_1_SSM, CH10_PAGE_2_SSM],
    contentHtml: joinPages([CH10_PAGE_1_SSM, CH10_PAGE_2_SSM]),
  },
  {
    id: 'ch-11',
    order: 11,
    number: 11,
    title: '11. Defecțiuni și Remediere',
    type: 'text',
    isActive: true,
    isFixed: true,
    estimatedPageCount: 1,
    pages: [CH11_PAGE_1],
    contentHtml: CH11_PAGE_1,
  },
  {
    id: 'ch-12',
    order: 12,
    number: 12,
    title: '12. Instalații Electrice & Tablou',
    type: 'text',
    isActive: true,
    isFixed: true,
    estimatedPageCount: 1,
    pages: [CH12_PAGE_1],
    contentHtml: CH12_PAGE_1,
  }
];

/**
 * Returns a pristine clone of a default chapter template by its ID
 */
export const getDefaultChapterTemplate = (chapterId: string): Chapter | undefined => {
  const found = INITIAL_CHAPTERS.find((c) => c.id === chapterId);
  if (!found) return undefined;
  return JSON.parse(JSON.stringify(found));
};

/**
 * Checks if a chapter's HTML has lost its structural layout (e.g. stripped by editor)
 */
export const isChapterFormattingDamaged = (chapter: Chapter): boolean => {
  if (chapter.type !== 'text') return false;
  const def = getDefaultChapterTemplate(chapter.id);
  if (!def) return false;

  const rawPages = chapter.pages && chapter.pages.length > 0 ? chapter.pages : [chapter.contentHtml || ''];
  const combined = rawPages.join(' ');
  
  // All default formatted templates have styled headers (border-bottom, #0267c8, inline CSS)
  const hasStyledStructure = (combined.includes('border-bottom') || combined.includes('#0267c8')) && combined.includes('style=');
  return !hasStyledStructure;
};
