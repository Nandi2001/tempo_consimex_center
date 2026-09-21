import { ProjectFullState } from '../services/storageService';
import { ProjectInfo, Chapter, AttachmentFile } from '../types/project';
import { INITIAL_CHAPTERS } from './defaultChapters';
import { SAMPLE_COVER_IMAGE } from './sampleCoverImage';
import { SAMPLE_PANEL_IMAGE } from './samplePanelImage';
import { SAMPLE_PDFS } from './samplePdfs';

// Helper to renumber chapters consecutively
const renumber = (chaptersList: Chapter[]): Chapter[] => {
  let activeIndex = 1;
  return chaptersList.map((ch, originalIdx) => {
    const cleanTitle = ch.title.replace(/^\d+[\.\)\-:]\s*/, '').trim();
    if (ch.isActive) {
      const num = activeIndex++;
      return {
        ...ch,
        order: originalIdx + 1,
        number: num,
        title: `${num}. ${cleanTitle}`,
      };
    } else {
      return {
        ...ch,
        order: originalIdx + 1,
        number: 0,
        title: cleanTitle,
      };
    }
  });
};

// Create the exact 10-chapter structure matching the 24-page Alba Iulia PDFs
const createAlbaIuliaChapters = (): Chapter[] => {
  const chapterOrderIds = [
    'ch-1',  // 1. Prima pagină (2 pag)
    'ch-2',  // 2. Conținut (1 pag)
    'ch-3',  // 3. Descriere SP (2 pag)
    'ch-4',  // 4. Pompe SP (1 pag)
    'ch-5',  // 5. Fișa Pompe (9 pag)
    'ch-8',  // 6. Scheme Instalație (1 pag)
    'ch-11', // 7. Defecțiuni și Remediere (1 pag)
    'ch-10', // 8. Securitatea și Sănătatea Muncii (SSM) (2 pag)
    'ch-9',  // 9. Jurnal de Întreținere (4 pag)
    'ch-12', // 10. Instalații Electrice & Tablou (1 pag)
  ];

  const orderedChapters: Chapter[] = [];
  chapterOrderIds.forEach((id) => {
    const found = INITIAL_CHAPTERS.find((c) => c.id === id);
    if (found) {
      orderedChapters.push({ ...found, isActive: true });
    }
  });

  return renumber(orderedChapters);
};

const createAttachmentsForAlbaIulia = (schemaFileName: string): AttachmentFile[] => {
  return [
    {
      id: 'att-imagine-coperta',
      name: 'Imagine Copertă (Poză Stație de Pompare)',
      fileName: 'Fotografie_statie_coperta.jpg',
      fileData: SAMPLE_COVER_IMAGE,
      pageCount: 0,
      isActive: true,
      type: 'cover_image',
    },
    {
      id: 'att-imagine-tablou',
      name: 'Imagine Tablou de Comandă (Panou Electric)',
      fileName: 'Picture3.jpg',
      fileData: SAMPLE_PANEL_IMAGE,
      pageCount: 0,
      isActive: true,
      type: 'panel_image',
    },
    {
      id: 'att-fisa-pompa',
      name: 'Fișa pompă',
      fileName: '5_98626047_SLV808092251DC.pdf',
      fileData: SAMPLE_PDFS.fisaPompa,
      pageCount: 9, // Exactly 9 pages (pag. 7 - 15 in PDF)
      isActive: true,
      type: 'fisa_pompa',
      chapterId: 'ch-5',
    },
    {
      id: 'att-schema-instalatie',
      name: 'Scheme instalație',
      fileName: schemaFileName,
      fileData: SAMPLE_PDFS.schemaInstalatie,
      pageCount: 1, // Exactly 1 page (pag. 16 in PDF)
      isActive: true,
      type: 'schema_instalatie',
      chapterId: 'ch-8',
    },
  ];
};

const createSinglePumpChapters = (): Chapter[] => {
  const chapterOrderIds = [
    'ch-1',  // 1. Prima pagină (2 pag)
    'ch-2',  // 2. Conținut (1 pag)
    'ch-3',  // 3. Descriere SP (2 pag)
    'ch-4',  // 4. Pompe SP (1 pag)
    'ch-5',  // 5. Fișa Pompe (10 pag)
    'ch-6',  // 6. Test Pompă 1 (2 pag)
    'ch-8',  // 7. Scheme Instalație (1 pag)
    'ch-9',  // 8. Jurnal de Întreținere (4 pag)
    'ch-10', // 9. Securitatea și Sănătatea Muncii (SSM) (2 pag)
    'ch-11', // 10. Defecțiuni și Remediere (1 pag)
    'ch-12', // 11. Instalații Electrice & Tablou (1 pag)
  ];

  const orderedChapters: Chapter[] = [];
  chapterOrderIds.forEach((id) => {
    const found = INITIAL_CHAPTERS.find((c) => c.id === id);
    if (found) {
      orderedChapters.push({ ...found, isActive: true });
    }
  });

  return renumber(orderedChapters);
};

const createSinglePumpAttachments = (): AttachmentFile[] => {
  return [
    {
      id: 'att-imagine-coperta',
      name: 'Imagine Copertă (Poză Stație de Pompare)',
      fileName: 'Fotografie_statie_coperta.jpg',
      fileData: SAMPLE_COVER_IMAGE,
      pageCount: 0,
      isActive: true,
      type: 'cover_image',
    },
    {
      id: 'att-imagine-tablou',
      name: 'Imagine Tablou de Comandă (Panou Electric)',
      fileName: 'Picture3.jpg',
      fileData: SAMPLE_PANEL_IMAGE,
      pageCount: 0,
      isActive: true,
      type: 'panel_image',
    },
    {
      id: 'att-fisa-pompa',
      name: 'Fișa pompă',
      fileName: '5_98626047_SLV808092251DC.pdf',
      fileData: SAMPLE_PDFS.fisaPompa,
      pageCount: 10,
      isActive: true,
      type: 'fisa_pompa',
      chapterId: 'ch-5',
    },
    {
      id: 'att-test-pompa-1',
      name: 'Test pompe 1',
      fileName: '6_TEST_POMPA_770_000062.pdf',
      fileData: SAMPLE_PDFS.testPompa1,
      pageCount: 2,
      isActive: true,
      type: 'test_pompa',
      pumpIndex: 1,
      chapterId: 'ch-6',
    },
    {
      id: 'att-schema-instalatie',
      name: 'Scheme instalație',
      fileName: '8_INSTA_SPP_PENNY_SANCRAIU_MS.pdf',
      fileData: SAMPLE_PDFS.schemaInstalatie,
      pageCount: 1,
      isActive: true,
      type: 'schema_instalatie',
      chapterId: 'ch-8',
    },
  ];
};

export const getStandardInitialProjects = (): ProjectFullState[] => {
  // -------------------------------------------------------------
  // 1. CDA-2026-012: IGSU-Băilești (1 Pompă, 2 Comutatoare de Nivel)
  // -------------------------------------------------------------
  const igsuBailestiInfo: ProjectInfo = {
    cdaNr: 'CDA-2026-012',
    denumireLocatie: 'IGSU-Băilești',
    localitate: 'Băilești',
    judet: 'Dolj',
    tipSP: 'Ape meteorice',
    tipBazin: 'Bazin Oțel',
    diametruBazinOtel: '2.00 m',
    dimensiuneParticula: '80 mm',
    debitPompare: '1 x 15 l/s',
    inaltimePompare: '12 mcA',
    nrPompe: 1,
    tipPompe: 'SLV.80.80.92.2.51D.C',
    seriiPompe: ['9862604710001770'],
    nrComutatoare: 2,
    diametruGoluriPompe: 'fi800',
    diametruGolAcces: 'fi800',
    diametruRefulare: 'DN80',
    anFabricatie: '2026',
    furnizor: 'PURECO ENVIRONMENT SRL',
    beneficiar: 'Inspectoratul General pentru Situații de Urgență - Stația Băilești',
    antreprenor: '-',
    telefonService: '021-330 02 36 / 0725-922 944',
    emailService: 'office@tempoconsimex.ro',
    coverImage: SAMPLE_COVER_IMAGE,
    panelImage: SAMPLE_PANEL_IMAGE,
  };

  // -------------------------------------------------------------
  // 2. CDA_46 BR1: Canalizare stradală str. Emil Racovița BR1 (Alba Iulia)
  // -------------------------------------------------------------
  const br1Info: ProjectInfo = {
    cdaNr: 'CDA-2025-046-BR1',
    denumireLocatie: 'Canalizare stradală str. Emil Racovița BR1',
    localitate: 'Alba Iulia',
    judet: 'Alba',
    tipSP: 'Ape meteorice',
    tipBazin: 'Bazin Oțel',
    diametruBazinOtel: '2.40 m',
    dimensiuneParticula: '80 mm',
    debitPompare: '3 x 23 l/s',
    inaltimePompare: '34 mcA',
    nrPompe: 3,
    tipPompe: 'SL.100.185.2.52S.N.51D.A',
    seriiPompe: ['999653971310000057', '999653971310000058', '999653971310000059'],
    nrComutatoare: 4,
    diametruGoluriPompe: '800 x 500 mm',
    diametruGolAcces: 'fi800 mm',
    diametruRefulare: 'DN150',
    anFabricatie: '2025',
    furnizor: 'PURECO ENVIRONMENT SRL',
    beneficiar: 'Canalizare Stradală str. Racovița BR1, Alba Iulia, jud. Alba',
    antreprenor: '-',
    telefonService: '021-330 02 36 / 0725-922 944',
    emailService: 'office@tempoconsimex.ro',
    coverImage: SAMPLE_COVER_IMAGE,
    panelImage: SAMPLE_PANEL_IMAGE,
  };

  // -------------------------------------------------------------
  // 3. CDA_46 BR2: Canalizare stradală str. Emil Racovița BR2 (Alba Iulia)
  // -------------------------------------------------------------
  const br2Info: ProjectInfo = {
    cdaNr: 'CDA-2025-046-BR2',
    denumireLocatie: 'Canalizare stradală str. Emil Racovița BR2',
    localitate: 'Alba Iulia',
    judet: 'Alba',
    tipSP: 'Ape meteorice',
    tipBazin: 'Bazin Oțel',
    diametruBazinOtel: '2.40 m',
    dimensiuneParticula: '80 mm',
    debitPompare: '3 x 20 l/s',
    inaltimePompare: '31 mcA',
    nrPompe: 3,
    tipPompe: 'SL.100.150.2.52S.N.51D',
    seriiPompe: ['99965227410000113', '99965227410000114', '99965227410000115'],
    nrComutatoare: 4,
    diametruGoluriPompe: '800 x 500 mm',
    diametruGolAcces: 'fi800 mm',
    diametruRefulare: 'DN150',
    anFabricatie: '2025',
    furnizor: 'PURECO ENVIRONMENT SRL',
    beneficiar: 'Canalizare Stradală str. Racovița BR2, Alba Iulia, jud. Alba',
    antreprenor: '-',
    telefonService: '021-330 02 36 / 0725-922 944',
    emailService: 'office@tempoconsimex.ro',
    coverImage: SAMPLE_COVER_IMAGE,
    panelImage: SAMPLE_PANEL_IMAGE,
  };

  // -------------------------------------------------------------
  // 4. CDA_46 BR3: Canalizare stradală str. Emil Racovița BR3 (Alba Iulia)
  // -------------------------------------------------------------
  const br3Info: ProjectInfo = {
    cdaNr: 'CDA-2025-046-BR3',
    denumireLocatie: 'Canalizare stradală str. Emil Racovița BR3',
    localitate: 'Alba Iulia',
    judet: 'Alba',
    tipSP: 'Ape meteorice',
    tipBazin: 'Bazin Oțel',
    diametruBazinOtel: '2.40 m',
    dimensiuneParticula: '80 mm',
    debitPompare: '3 x 21 l/s',
    inaltimePompare: '26 mcA',
    nrPompe: 3,
    tipPompe: 'SL.100.130.2.S52.N.51D.A',
    seriiPompe: ['9976939710000230', '9976939710000229', '9976939710000232'],
    nrComutatoare: 4,
    diametruGoluriPompe: '800 x 500 mm',
    diametruGolAcces: 'fi800 mm',
    diametruRefulare: 'DN150',
    anFabricatie: '2025',
    furnizor: 'PURECO ENVIRONMENT SRL',
    beneficiar: 'Canalizare Stradală str. Racovița BR3, Alba Iulia, jud. Alba',
    antreprenor: '-',
    telefonService: '021-330 02 36 / 0725-922 944',
    emailService: 'office@tempoconsimex.ro',
    coverImage: SAMPLE_COVER_IMAGE,
    panelImage: SAMPLE_PANEL_IMAGE,
  };

  // -------------------------------------------------------------
  // 5. Reference Penny Sancraiu de Mures
  // -------------------------------------------------------------
  const pennyInfo: ProjectInfo = {
    cdaNr: 'CDA-2026-084',
    denumireLocatie: 'Supermarket PENNY Sâncraiu de Mureș',
    localitate: 'Sâncraiu de Mureș',
    judet: 'Mureș',
    tipSP: 'Ape meteorice',
    tipBazin: 'Bazin Oțel',
    diametruBazinOtel: '3.00 m',
    dimensiuneParticula: '80 mm',
    debitPompare: '2 x 20 l/s',
    inaltimePompare: '15 mcA',
    nrPompe: 2,
    tipPompe: 'SLV.80.80.92.2.51D.C',
    seriiPompe: ['9862604710001772', '9862604710001770'],
    nrComutatoare: 3,
    diametruGoluriPompe: 'fi800',
    diametruGolAcces: 'fi800',
    diametruRefulare: 'DN100',
    anFabricatie: '2026',
    furnizor: 'PURECO ENVIRONMENT SRL',
    beneficiar: 'Supermarket Penny, com. Sâncraiu de Mureș, jud. Mureș',
    antreprenor: 'REWE ROMÂNIA SRL',
    telefonService: '021-330 02 36 / 0725-922 944',
    emailService: 'office@tempoconsimex.ro',
    coverImage: SAMPLE_COVER_IMAGE,
    panelImage: SAMPLE_PANEL_IMAGE,
  };

  return [
    {
      id: 'proj_igsu_bailesti',
      version: '1.0.0',
      createdAt: '2026-08-30T10:00:00.000Z',
      savedAt: new Date().toISOString(),
      projectInfo: igsuBailestiInfo,
      chapters: createSinglePumpChapters(),
      attachments: createSinglePumpAttachments(),
      activeStep: 0,
    },
    {
      id: 'proj_cda46_alba_iulia_br1',
      version: '1.0.0',
      createdAt: '2026-08-25T08:00:00.000Z',
      savedAt: new Date().toISOString(),
      projectInfo: br1Info,
      chapters: createAlbaIuliaChapters(),
      attachments: createAttachmentsForAlbaIulia('8_INSTA_SPP_BR1_ALBA_IULIA.pdf'),
      activeStep: 0,
    },
    {
      id: 'proj_cda46_alba_iulia_br2',
      version: '1.0.0',
      createdAt: '2026-08-25T09:30:00.000Z',
      savedAt: new Date().toISOString(),
      projectInfo: br2Info,
      chapters: createAlbaIuliaChapters(),
      attachments: createAttachmentsForAlbaIulia('8_INSTA_SPP_BR2_ALBA_IULIA.pdf'),
      activeStep: 0,
    },
    {
      id: 'proj_cda46_alba_iulia_br3',
      version: '1.0.0',
      createdAt: '2026-08-25T11:00:00.000Z',
      savedAt: new Date().toISOString(),
      projectInfo: br3Info,
      chapters: createAlbaIuliaChapters(),
      attachments: createAttachmentsForAlbaIulia('8_INSTA_SPP_BR3_ALBA_IULIA.pdf'),
      activeStep: 0,
    },
    {
      id: 'proj_penny_sancraiu_084',
      version: '1.0.0',
      createdAt: '2026-08-20T10:00:00.000Z',
      savedAt: new Date().toISOString(),
      projectInfo: pennyInfo,
      chapters: renumber([...INITIAL_CHAPTERS]),
      attachments: [
        {
          id: 'att-imagine-coperta',
          name: 'Imagine Copertă (Poză Stație de Pompare)',
          fileName: 'Fotografie_statie_coperta.jpg',
          fileData: SAMPLE_COVER_IMAGE,
          pageCount: 0,
          isActive: true,
          type: 'cover_image',
        },
        {
          id: 'att-imagine-tablou',
          name: 'Imagine Tablou de Comandă (Panou Electric)',
          fileName: 'Picture3.jpg',
          fileData: SAMPLE_PANEL_IMAGE,
          pageCount: 0,
          isActive: true,
          type: 'panel_image',
        },
        {
          id: 'att-fisa-pompa',
          name: 'Fișa pompă',
          fileName: '5_98626047_SLV808092251DC.pdf',
          fileData: SAMPLE_PDFS.fisaPompa,
          pageCount: 10,
          isActive: true,
          type: 'fisa_pompa',
          chapterId: 'ch-5',
        },
        {
          id: 'att-test-pompa-1',
          name: 'Test pompe 1',
          fileName: '6_TEST_POMPA_770_000062.pdf',
          fileData: SAMPLE_PDFS.testPompa1,
          pageCount: 2,
          isActive: true,
          type: 'test_pompa',
          pumpIndex: 1,
          chapterId: 'ch-6',
        },
        {
          id: 'att-test-pompa-2',
          name: 'Test pompe 2',
          fileName: '7_TEST_POMPA_772_000063.pdf',
          fileData: SAMPLE_PDFS.testPompa2,
          pageCount: 2,
          isActive: true,
          type: 'test_pompa',
          pumpIndex: 2,
          chapterId: 'ch-7',
        },
        {
          id: 'att-schema-instalatie',
          name: 'Scheme instalație',
          fileName: '8_INSTA_SPP_PENNY_SANCRAIU_MS.pdf',
          fileData: SAMPLE_PDFS.schemaInstalatie,
          pageCount: 1,
          isActive: true,
          type: 'schema_instalatie',
          chapterId: 'ch-8',
        },
      ],
      activeStep: 0,
    },
  ];
};
