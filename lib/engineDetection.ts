import AdmZip from 'adm-zip';

const signatures: Record<string, string[]> = {
  psych: ['mods/', 'pack.json', 'weeks/'],
  codename: ['source/funkin/', 'codename/', 'mod.json'],
  leather: ['leather/', 'content/', 'ui skins/'],
  js_engine: ['assets/preload', 'songs/', 'characters/']
};

export function detectEngineFromZipBuffer(buffer: Buffer): string {
  const zip = new AdmZip(buffer);
  const entries = zip.getEntries().map((e) => e.entryName.toLowerCase());

  const score = Object.entries(signatures).map(([engine, pats]) => ({
    engine,
    hits: pats.reduce((acc, p) => (entries.some((e) => e.includes(p)) ? acc + 1 : acc), 0)
  }));

  score.sort((a, b) => b.hits - a.hits);
  return score[0].hits > 0 ? score[0].engine : 'psych';
}
