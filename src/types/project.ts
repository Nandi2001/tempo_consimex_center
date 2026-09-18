export interface ProjectInfo {
  cdaNr: string;                  // CDA nr. (Order Number)
  denumireLocatie: string;        // Denumire locatie (Location Name)
  localitate: string;             // Localitate (City/Town)
  judet: string;                  // Judet (County)
  tipSP: string;                  // Tip SP: "Ape Meteorice", "Ape Uzate", "Ape Uzate si Menajer", "Ape Uzate si Meteorice", or custom
  tipBazin: string;               // "Bazin Otel" | "Bazin Beton"
  diametruBazinOtel: string;      // Diametru Bazin Otel (e.g. "3.00 m" or "fi3000")
  dimensiuneParticula: string;    // Dimensiune particule trecere (e.g. "80 mm")
  debitPompare: string;           // Debit pompare (e.g. "2 x 10 l/s" or "20 l/s")
  inaltimePompare: string;        // Inaltime pompare (e.g. "15 mcA")
  nrPompe: number;                // Nr. pompe (Number of Pumps) - Integer
  tipPompe: string;               // Tip pompe (Pump Type, e.g. "SLV.80.80.92.2.51D.C")
  seriiPompe: string[];           // Seria pompa 1..n
  nrComutatoare: number;          // Nr. comutatoare (plutitori) (Number of Float Switches)
  diametruGoluriPompe: string;    // Diametru Goluri pompe (Format: fiXXX, e.g. "fi800")
  diametruGolAcces: string;       // Diametru Gol de acces (Format: fiXXX, e.g. "fi800")
  diametruRefulare: string;       // Diametru Refulare (Dropdown populated with standard DN values, e.g. "DN100")
  anFabricatie: string;           // An fabricatie (e.g. "2026")
  furnizor: string;               // Furnizor (e.g. "PURECO ENVIRONMENT SRL" / "TEMPO CONSIMEX")
  beneficiar: string;             // Beneficiar / Investitia
  antreprenor: string;            // Antreprenor
  telefonService: string;         // Telefon service / contact (e.g. "021-330 02 36 / 0725-922 944")
  emailService: string;           // Email service / contact
  coverImage?: string;            // Base64 Data URL for cover photo (middle of Page 1)
  panelImage?: string;            // Base64 Data URL for control panel photo (Electrice / Tablou)
}

export type ChapterType = 'text' | 'attachment';

export interface Chapter {
  id: string;
  order: number;
  number: number;                 // e.g. 1, 2, 3...
  title: string;                  // e.g. "1. Prima pagina", "2. Continut", "5. Fisa Pompe"
  type: ChapterType;
  isActive: boolean;              // Toggle "Activ?"
  // For text chapters:
  contentHtml?: string;           // Rich text HTML (for single page or fallback)
  pages?: string[];               // Explicit discrete A4 pages (HTML array)
  estimatedPageCount?: number;    // Estimated or calculated pages for text
  // For attachment chapters:
  attachmentKey?: string;         // Link to an attachment (e.g. "fisa_pompe", "test_pompa_1", "custom_xyz")
  isCustom?: boolean;             // Whether created by user
  isFixed?: boolean;              // Default fixed structure
}

export interface AttachmentFile {
  id: string;
  name: string;                   // Display name, e.g. "Imagine Copertă", "Fisa pompa", "Test pompe 1"
  fileName?: string;              // Original file name
  fileData?: string;              // Base64 encoded file string (PDF or Image Data URI)
  pageCount: number;              // Detected number of pages in the PDF (0 for image)
  uploadedAt?: string;
  sizeBytes?: number;
  chapterId?: string;             // Attached chapter reference
  isActive: boolean;
  type: 'cover_image' | 'panel_image' | 'fisa_pompa' | 'test_pompa' | 'schema_instalatie' | 'custom';
  pumpIndex?: number;             // For test_pompa_1, test_pompa_2, etc.
}

export interface CalculatedPaginationItem {
  chapterId: string;
  title: string;
  type: ChapterType;
  startPage: number;
  endPage: number;
  pageCount: number;
  isActive: boolean;
}

export interface PaginationResult {
  items: CalculatedPaginationItem[];
  totalPages: number;
  totalActiveChapters: number;
}
