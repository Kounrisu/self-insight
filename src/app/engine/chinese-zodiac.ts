// Chinese zodiac: the 60-year sexagenary cycle (10 Heavenly Stems x 12
// Earthly Branches), resolved from a real Chinese New Year date table
// rather than a naive "birth year mod 12" (which is wrong for anyone born
// in the Jan 21-Feb 20 window before that year's actual CNY).

export const CHINESE_BRANCHES: { animal: string; element: string }[] = [
  { animal: 'Rat', element: 'Water' },
  { animal: 'Ox', element: 'Earth' },
  { animal: 'Tiger', element: 'Wood' },
  { animal: 'Rabbit', element: 'Wood' },
  { animal: 'Dragon', element: 'Earth' },
  { animal: 'Snake', element: 'Fire' },
  { animal: 'Horse', element: 'Fire' },
  { animal: 'Goat', element: 'Earth' },
  { animal: 'Monkey', element: 'Metal' },
  { animal: 'Rooster', element: 'Metal' },
  { animal: 'Dog', element: 'Earth' },
  { animal: 'Pig', element: 'Water' },
];

export const CHINESE_STEMS: { element: string; yinYang: 'yin' | 'yang' }[] = [
  { element: 'Wood', yinYang: 'yang' }, // Jia
  { element: 'Wood', yinYang: 'yin' }, // Yi
  { element: 'Fire', yinYang: 'yang' }, // Bing
  { element: 'Fire', yinYang: 'yin' }, // Ding
  { element: 'Earth', yinYang: 'yang' }, // Wu
  { element: 'Earth', yinYang: 'yin' }, // Ji
  { element: 'Metal', yinYang: 'yang' }, // Geng
  { element: 'Metal', yinYang: 'yin' }, // Xin
  { element: 'Water', yinYang: 'yang' }, // Ren
  { element: 'Water', yinYang: 'yin' }, // Gui
];

// Every entry is a real published Chinese New Year date, not an estimate or
// interpolation. 'MM-DD' format.
// - 1920-2025: bulk-sourced from pinyin.info's "Chinese New Year" tables
//   (https://pinyin.info/chinese_new_year/cny1900-1999.html and
//   .../cny2000-2099.html), which are derived (with permission) from Helmer
//   Aslaksen's (NUS) Chinese calendar reference site. Cross-checked against
//   the Hong Kong Observatory's official per-year conversion PDFs
//   (https://www.hko.gov.hk/en/gts/time/calendar/pdf/files/<year>e.pdf) for
//   1920 and 1966, against chinahighlights.com for 1950 and 1984, and against
//   chinesefortunecalendar.com for every year 2000-2025 — all matched exactly.
// - 2026-2035: verified against Wikipedia's "Chinese New Year" article
//   (Task 4) and must not be changed.
export const CNY_DATES: Record<number, string> = {
  1920: '02-20',
  1921: '02-08',
  1922: '01-28',
  1923: '02-16',
  1924: '02-05',
  1925: '01-24',
  1926: '02-13',
  1927: '02-02',
  1928: '01-23',
  1929: '02-10',
  1930: '01-30',
  1931: '02-17',
  1932: '02-06',
  1933: '01-26',
  1934: '02-14',
  1935: '02-04',
  1936: '01-24',
  1937: '02-11',
  1938: '01-31',
  1939: '02-19',
  1940: '02-08',
  1941: '01-27',
  1942: '02-15',
  1943: '02-05',
  1944: '01-25',
  1945: '02-13',
  1946: '02-02',
  1947: '01-22',
  1948: '02-10',
  1949: '01-29',
  1950: '02-17',
  1951: '02-06',
  1952: '01-27',
  1953: '02-14',
  1954: '02-03',
  1955: '01-24',
  1956: '02-12',
  1957: '01-31',
  1958: '02-18',
  1959: '02-08',
  1960: '01-28',
  1961: '02-15',
  1962: '02-05',
  1963: '01-25',
  1964: '02-13',
  1965: '02-02',
  1966: '01-21',
  1967: '02-09',
  1968: '01-30',
  1969: '02-17',
  1970: '02-06',
  1971: '01-27',
  1972: '02-15',
  1973: '02-03',
  1974: '01-23',
  1975: '02-11',
  1976: '01-31',
  1977: '02-18',
  1978: '02-07',
  1979: '01-28',
  1980: '02-16',
  1981: '02-05',
  1982: '01-25',
  1983: '02-13',
  1984: '02-02',
  1985: '02-20',
  1986: '02-09',
  1987: '01-29',
  1988: '02-17',
  1989: '02-06',
  1990: '01-27',
  1991: '02-15',
  1992: '02-04',
  1993: '01-23',
  1994: '02-10',
  1995: '01-31',
  1996: '02-19',
  1997: '02-07',
  1998: '01-28',
  1999: '02-16',
  2000: '02-05',
  2001: '01-24',
  2002: '02-12',
  2003: '02-01',
  2004: '01-22',
  2005: '02-09',
  2006: '01-29',
  2007: '02-18',
  2008: '02-07',
  2009: '01-26',
  2010: '02-14',
  2011: '02-03',
  2012: '01-23',
  2013: '02-10',
  2014: '01-31',
  2015: '02-19',
  2016: '02-08',
  2017: '01-28',
  2018: '02-16',
  2019: '02-05',
  2020: '01-25',
  2021: '02-12',
  2022: '02-01',
  2023: '01-22',
  2024: '02-10',
  2025: '01-29',
  2026: '02-17',
  2027: '02-06',
  2028: '01-26',
  2029: '02-13',
  2030: '02-03',
  2031: '01-23',
  2032: '02-11',
  2033: '01-31',
  2034: '02-19',
  2035: '02-08',
};

const FALLBACK_CNY_MONTH_DAY = '02-04'; // median CNY date; only used outside the CNY_DATES table

function lunarYearFor(date: Date): number {
  const year = date.getUTCFullYear();
  const monthDay = `${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
  const cnyThisYear = CNY_DATES[year] ?? FALLBACK_CNY_MONTH_DAY;
  return monthDay >= cnyThisYear ? year : year - 1;
}

export interface ChineseZodiacSign {
  branchIndex: number;
  animal: string;
  branchElement: string;
  stemIndex: number;
  stemElement: string;
  yinYang: 'yin' | 'yang';
}

export function chineseZodiacFromDate(date: Date): ChineseZodiacSign {
  // Defensive validity guard: if date is null, undefined, or an invalid Date object,
  // fall back to treating it as 1984 (Jiazi/Rat, cycleIndex 0). This should never occur
  // in this plan's actual call chain (every real caller validates birthDate is present
  // before constructing a Date), but we degrade gracefully rather than throwing.
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    // Fallback to 1984 (Jiazi anchor) for malformed input
    const branch = CHINESE_BRANCHES[0];
    const stem = CHINESE_STEMS[0];
    return {
      branchIndex: 0,
      animal: branch.animal,
      branchElement: branch.element,
      stemIndex: 0,
      stemElement: stem.element,
      yinYang: stem.yinYang,
    };
  }

  const lunarYear = lunarYearFor(date);
  const cycleIndex = (((lunarYear - 1984) % 60) + 60) % 60; // 1984 = Jiazi (stem 0, branch 0)
  const stemIndex = cycleIndex % 10;
  const branchIndex = cycleIndex % 12;

  const branch = CHINESE_BRANCHES[branchIndex];
  const stem = CHINESE_STEMS[stemIndex];

  return {
    branchIndex,
    animal: branch.animal,
    branchElement: branch.element,
    stemIndex,
    stemElement: stem.element,
    yinYang: stem.yinYang,
  };
}

/** The traditionally "clashing" (opposing) branch — exactly 6 positions away in the 12-cycle. */
export function clashingBranchIndex(branchIndex: number): number {
  return (branchIndex + 6) % 12;
}
