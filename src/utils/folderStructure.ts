import { ProjectFullState } from '../services/storageService';

export interface ProjectFolderInfo {
  yearFolder: string;    // e.g. "CDA-2025", "CDA-2026"
  cdaFolder: string;     // e.g. "CDA-2025-046", "CDA-2026-007"
  subStation: string;    // e.g. "BR1", "01", "BR2"
}

export interface CdaFolderGroup {
  cdaFolderKey: string;    // e.g. "CDA-2025-046"
  yearKey: string;         // e.g. "CDA-2025"
  cdaDisplay: string;      // e.g. "CDA-2025-046"
  locationSummary: string; // e.g. "Canalizare stradală str. Emil Racovița"
  localitySummary: string; // e.g. "Alba Iulia, jud. Alba"
  projects: ProjectFullState[];
}

export interface YearFolderGroup {
  yearKey: string;         // e.g. "CDA-2026"
  yearDisplay: string;     // e.g. "CDA-2026"
  cdaFolders: CdaFolderGroup[];
  totalProjects: number;
}

/**
 * Parses a project's CDA number and year into hierarchical folder keys
 */
export function parseProjectFolder(cdaNrRaw?: string, anFabricatie?: string): ProjectFolderInfo {
  const cda = (cdaNrRaw || '').trim();
  const an = (anFabricatie || '').trim();

  // 1. Try to extract 4-digit year (e.g. 2025, 2026) from cda or anFabricatie
  let year = '';
  const yearInCdaMatch = cda.match(/\b(20\d{2})\b/);
  if (yearInCdaMatch) {
    year = yearInCdaMatch[1];
  } else if (an && /\b(20\d{2})\b/.test(an)) {
    year = an.match(/\b(20\d{2})\b/)![1];
  } else {
    year = new Date().getFullYear().toString();
  }

  const yearFolder = `CDA-${year}`;

  // 2. Extract CDA group/folder
  // Format 1: Standard "CDA-2025-046-BR1" or "CDA-2025-046" or "CDA_2025_046_BR1"
  const standardMatch = cda.match(/^CDA[-_](\d{4})[-_](\d+)(?:[-_](.+))?$/i);
  if (standardMatch) {
    const yr = standardMatch[1];
    const num = standardMatch[2].padStart(3, '0');
    const sub = standardMatch[3] || '';
    return {
      yearFolder: `CDA-${yr}`,
      cdaFolder: `CDA-${yr}-${num}`,
      subStation: sub,
    };
  }

  // Format 2: Short "CDA_46-BR1" or "CDA-46-BR1" or "CDA-46"
  const shortMatch = cda.match(/^CDA[-_](\d+)(?:[-_](.+))?$/i);
  if (shortMatch) {
    const num = shortMatch[1].padStart(3, '0');
    const sub = shortMatch[2] || '';
    return {
      yearFolder,
      cdaFolder: `CDA-${year}-${num}`,
      subStation: sub,
    };
  }

  // Format 3: Generic with year prefix "CDA-2026-LIDL-01"
  const genericYearMatch = cda.match(/^CDA[-_](\d{4})[-_](.+)$/i);
  if (genericYearMatch) {
    const yr = genericYearMatch[1];
    const rest = genericYearMatch[2];
    const parts = rest.split(/[-_]/);
    const folderPart = parts[0];
    const sub = parts.slice(1).join('-');
    return {
      yearFolder: `CDA-${yr}`,
      cdaFolder: `CDA-${yr}-${folderPart}`,
      subStation: sub,
    };
  }

  // Fallback: clean CDA or default
  const cleanCda = cda.replace(/[^a-zA-Z0-9_-]/g, '') || 'Nedefinit';
  return {
    yearFolder,
    cdaFolder: `${yearFolder}-${cleanCda}`,
    subStation: '',
  };
}

export interface ProjectCdaSortData {
  yearNum: number;
  cdaNum: number;
  subStationNum: number;
  subStationStr: string;
  rawCda: string;
}

/**
 * Extracts structured numeric and textual sort components from CDA and year
 */
export function parseCdaSortData(cdaNrRaw?: string, anFabricatie?: string): ProjectCdaSortData {
  const cda = (cdaNrRaw || '').trim();
  const an = (anFabricatie || '').trim();

  // 1. Extract 4-digit year
  let yearNum = 0;
  const yearInCda = cda.match(/\b(20\d{2})\b/);
  if (yearInCda) {
    yearNum = parseInt(yearInCda[1], 10);
  } else if (an && /\b(20\d{2})\b/.test(an)) {
    yearNum = parseInt(an.match(/\b(20\d{2})\b/)![1], 10);
  } else {
    yearNum = new Date().getFullYear();
  }

  // 2. Extract CDA number and sub-station
  let cdaNum = 0;
  let subStationStr = '';
  let subStationNum = 0;

  // Pattern A: Standard "CDA-2025-046-BR1" or "CDA_2025_046_BR1"
  const standardMatch = cda.match(/^CDA[-_](\d{4})[-_](\d+)(?:[-_](.+))?$/i);
  if (standardMatch) {
    cdaNum = parseInt(standardMatch[2], 10);
    subStationStr = standardMatch[3] || '';
  } else {
    // Pattern B: Short "CDA-46-BR1" or "CDA_46" or "CDA-46"
    const shortMatch = cda.match(/^CDA[-_](\d+)(?:[-_](.+))?$/i);
    if (shortMatch) {
      cdaNum = parseInt(shortMatch[1], 10);
      subStationStr = shortMatch[2] || '';
    } else {
      // Pattern C: "CDA-2026-LIDL-01" or other generic with year
      const genericYearMatch = cda.match(/^CDA[-_](\d{4})[-_](.+)$/i);
      if (genericYearMatch) {
        const rest = genericYearMatch[2];
        const numMatch = rest.match(/(\d+)/);
        if (numMatch) {
          cdaNum = parseInt(numMatch[1], 10);
        }
        subStationStr = rest;
      } else {
        // Fallback: extract any digits
        const anyNumMatch = cda.match(/(\d+)/);
        if (anyNumMatch) {
          cdaNum = parseInt(anyNumMatch[1], 10);
        }
      }
    }
  }

  // Extract numeric part from sub-station if present (e.g. BR1 -> 1, BR2 -> 2, 01 -> 1)
  if (subStationStr) {
    const subDigits = subStationStr.match(/(\d+)/);
    if (subDigits) {
      subStationNum = parseInt(subDigits[1], 10);
    }
  }

  return {
    yearNum,
    cdaNum,
    subStationNum,
    subStationStr,
    rawCda: cda,
  };
}

/**
 * Extracts numeric CDA value from a CDA folder key (e.g. "CDA-2026-084" -> 84, "CDA-2025-046" -> 46)
 */
export function extractCdaNumberFromKey(key: string): number {
  const match = key.match(/CDA[-_](?:\d{4}[-_])?(\d+)/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  const anyDigits = key.match(/\d+/g);
  if (anyDigits && anyDigits.length > 0) {
    return parseInt(anyDigits[anyDigits.length - 1], 10);
  }
  return 0;
}

/**
 * Compares two projects by CDA number and year.
 * When direction is 'desc' (default): the bigger the number, the higher on the list.
 */
export function compareProjectsByCdaAndYear(
  a: ProjectFullState,
  b: ProjectFullState,
  direction: 'desc' | 'asc' = 'desc'
): number {
  const sortA = parseCdaSortData(a.projectInfo?.cdaNr, a.projectInfo?.anFabricatie);
  const sortB = parseCdaSortData(b.projectInfo?.cdaNr, b.projectInfo?.anFabricatie);

  // 1. Year: bigger year higher on list (descending: 2026 > 2025)
  if (sortA.yearNum !== sortB.yearNum) {
    return direction === 'desc'
      ? sortB.yearNum - sortA.yearNum
      : sortA.yearNum - sortB.yearNum;
  }

  // 2. CDA number: bigger number higher on list (descending: 84 > 46 > 7)
  if (sortA.cdaNum !== sortB.cdaNum) {
    return direction === 'desc'
      ? sortB.cdaNum - sortA.cdaNum
      : sortA.cdaNum - sortB.cdaNum;
  }

  // 3. Sub-station within same CDA: keep natural station sequence (BR1, BR2, BR3 / 01, 02)
  if (sortA.subStationNum !== sortB.subStationNum) {
    return sortA.subStationNum - sortB.subStationNum;
  }

  return (sortA.subStationStr || '').localeCompare(sortB.subStationStr || '');
}

/**
 * Groups an array of projects into a 2-level folder structure:
 * Year (CDA-YYYY) -> CDA Folder (CDA-YYYY-NNN) -> Projects List
 * Folders and years are sorted with the biggest number first (descending).
 */
export function groupProjectsByFolder(
  projects: ProjectFullState[],
  sortDirection: 'desc' | 'asc' = 'desc'
): YearFolderGroup[] {
  const yearMap = new Map<string, Map<string, ProjectFullState[]>>();

  for (const project of projects) {
    const { yearFolder, cdaFolder } = parseProjectFolder(
      project.projectInfo?.cdaNr,
      project.projectInfo?.anFabricatie
    );

    if (!yearMap.has(yearFolder)) {
      yearMap.set(yearFolder, new Map<string, ProjectFullState[]>());
    }

    const cdaMap = yearMap.get(yearFolder)!;
    if (!cdaMap.has(cdaFolder)) {
      cdaMap.set(cdaFolder, []);
    }

    cdaMap.get(cdaFolder)!.push(project);
  }

  // Convert to sorted array structure
  const result: YearFolderGroup[] = [];

  // 1. Sort years numerically (e.g. CDA-2026 before CDA-2025 in desc)
  const sortedYears = Array.from(yearMap.keys()).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
    return sortDirection === 'desc' ? numB - numA : numA - numB;
  });

  for (const yearKey of sortedYears) {
    const cdaMap = yearMap.get(yearKey)!;
    const cdaFolders: CdaFolderGroup[] = [];
    let yearTotalProjects = 0;

    // 2. Sort CDA folders numerically by CDA number (e.g. CDA-2026-084 before CDA-2026-007 in desc)
    const sortedCdaKeys = Array.from(cdaMap.keys()).sort((a, b) => {
      const numA = extractCdaNumberFromKey(a);
      const numB = extractCdaNumberFromKey(b);
      if (numA !== numB) {
        return sortDirection === 'desc' ? numB - numA : numA - numB;
      }
      return sortDirection === 'desc' ? b.localeCompare(a) : a.localeCompare(b);
    });

    for (const cdaKey of sortedCdaKeys) {
      const projList = cdaMap.get(cdaKey)!;
      yearTotalProjects += projList.length;

      // 3. Sort projects within each folder (Station 1, 2, 3 in natural order)
      projList.sort((a, b) => compareProjectsByCdaAndYear(a, b, sortDirection));

      // Extract a common location name and locality for the folder header
      const firstProj = projList[0];
      const locationSummary = firstProj.projectInfo?.denumireLocatie
        ? firstProj.projectInfo.denumireLocatie.replace(/\s+BR\d+.*$/i, '').trim()
        : 'Proiect fără titlu';
      const localitySummary = firstProj.projectInfo?.localitate
        ? `${firstProj.projectInfo.localitate}${firstProj.projectInfo.judet ? ', jud. ' + firstProj.projectInfo.judet : ''}`
        : '';

      cdaFolders.push({
        cdaFolderKey: cdaKey,
        yearKey,
        cdaDisplay: cdaKey,
        locationSummary,
        localitySummary,
        projects: projList,
      });
    }

    result.push({
      yearKey,
      yearDisplay: yearKey,
      cdaFolders,
      totalProjects: yearTotalProjects,
    });
  }

  return result;
}
