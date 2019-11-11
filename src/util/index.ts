const Dps = [
  'acn',
  'arc',
  'blm',
  'brd',
  'drg',
  'lnc',
  'mch',
  'mnk',
  'mnk',
  'min',
  'pgl',
  'pug',
  'rdm',
  'rog',
  'sam',
  'smn',
  'nin',
  'dnc',
  'bum',
];
const Tank = [
  'drk',
  'gla',
  'gld',
  'mrd',
  'pld',
  'war',
  'gnb',
];
const Heal = [
  'ast',
  'cnj',
  'sch',
  'whm',
];
const Prd = [
  'alc',
  'arm',
  'bot',
  'bsm',
  'crp',
  'cul',
  'fsh',
  'gsm',
  'ltw',
  'min',
  'wvr',
];

export function isDps(job: string): boolean {
  return Dps.includes(job.toLowerCase());
}
export function isTank(job: string): boolean {
  return Tank.includes(job.toLowerCase());
}
export function isHeal(job: string): boolean {
  return Heal.includes(job.toLowerCase());
}
