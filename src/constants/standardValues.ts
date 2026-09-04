import { ProjectInfo } from '../types/project';
import { SAMPLE_COVER_IMAGE } from './sampleCoverImage';

export const STANDARD_DN_VALUES = [
  'DN32',
  'DN40',
  'DN50',
  'DN65',
  'DN80',
  'DN100',
  'DN125',
  'DN150',
  'DN200',
  'DN250',
  'DN300',
  'DN350',
  'DN400',
  'DN500',
  'DN600',
];

export const ROMANIAN_COUNTIES = [
  'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani', 'Brașov', 'Brăila',
  'București', 'Buzău', 'Caraș-Severin', 'Călărași', 'Cluj', 'Constanța', 'Covasna', 'Dâmbovița',
  'Dolj', 'Galați', 'Giurgiu', 'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov',
  'Maramureș', 'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Satu Mare', 'Sălaj', 'Sibiu',
  'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vaslui', 'Vâlcea', 'Vrancea'
];

export const DEFAULT_PROJECT_INFO: ProjectInfo = {
  cdaNr: 'CDA-2026-084',
  denumireLocatie: 'supermarket PENNY',
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
  anFabricatie: new Date().getFullYear().toString(),
  furnizor: 'PURECO ENVIRONMENT SRL',
  beneficiar: 'Supermarket Penny, com. Sâncraiu de Mureș, jud. Mureș',
  antreprenor: '-',
  telefonService: '021-330 02 36 / 0725-922 944',
  emailService: 'office@tempoconsimex.ro',
  coverImage: SAMPLE_COVER_IMAGE,
};

export const TIP_SP_OPTIONS = [
  'Ape meteorice',
  'Ape uzate',
  'Ape uzate și menajer',
  'Ape uzate și meteorice',
];

export const AVAILABLE_VARIABLES = [
  { key: '{{CDA_NR}}', label: 'CDA nr.', description: 'Numărul comenzii / proiectului' },
  { key: '{{DENUMIRE_LOCATIE}}', label: 'Denumire locație', description: 'Numele obiectivului / locației' },
  { key: '{{LOCALITATE}}', label: 'Localitate', description: 'Orașul sau comuna' },
  { key: '{{JUDET}}', label: 'Județ', description: 'Județul amplasamentului' },
  { key: '{{TIP_SP}}', label: 'Tip SP (Ape)', description: 'Tipul apei vehiculate (ex: Ape meteorice, Ape uzate)' },
  { key: '{{TIP_BAZIN}}', label: 'Tip Bazin', description: 'Bazin Oțel sau Bazin Beton' },
  { key: '{{DIAMETRU_BAZIN_OTEL}}', label: 'Diametru Bazin Oțel', description: 'Diametrul bazinului metalic (ex: 3.00 m)' },
  { key: '{{DIMENSIUNE_PARTICULA}}', label: 'Diametru particulă', description: 'Trecere liberă particule (ex: 80 mm)' },
  { key: '{{DEBIT_POMPARE}}', label: 'Debit pompare', description: 'Debitul de lucru al stației' },
  { key: '{{INALTIME_POMPARE}}', label: 'Înălțime pompare', description: 'Înălțimea manometrică de pompare' },
  { key: '{{NR_POMPE}}', label: 'Nr. pompe', description: 'Numărul total de pompe instalate' },
  { key: '{{TIP_POMPE}}', label: 'Tip pompe', description: 'Modelul / tipul pompelor submersibile' },
  { key: '{{SERII_POMPE_LISTA}}', label: 'Tabel serii pompe', description: 'Tabel sau listă formatată cu seriile pompelor' },
  { key: '{{NR_COMUTATOARE}}', label: 'Nr. comutatoare (plutitori)', description: 'Numărul plutitorilor de nivel' },
  { key: '{{DIAMETRU_GOLURI_POMPE}}', label: 'Diametru goluri pompe', description: 'Format fiXXX (ex: fi800)' },
  { key: '{{DIAMETRU_GOL_ACCES}}', label: 'Diametru gol acces', description: 'Format fiXXX (ex: fi800)' },
  { key: '{{DIAMETRU_REFULARE}}', label: 'Diametru refulare', description: 'Dimensiune conductă (ex: DN100)' },
  { key: '{{AN_FABRICATIE}}', label: 'An fabricație', description: 'Anul curent sau selectat' },
  { key: '{{FURNIZOR}}', label: 'Furnizor', description: 'Compania furnizoare' },
  { key: '{{BENEFICIAR}}', label: 'Beneficiar', description: 'Numele investiției / beneficiarul' },
  { key: '{{ANTREPRENOR}}', label: 'Antreprenor', description: 'Constructorul / antreprenorul general' },
  { key: '{{TELEFON_SERVICE}}', label: 'Telefon service', description: 'Contact asistență tehnică' },
  { key: '{{IMAGINE_COPERTA}}', label: 'Imagine Copertă', description: 'Fotografia stației de pompare din centrul coperții' },
];
