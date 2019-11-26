export interface Message {
  currentArea: string;
  time: string;
  totalDps: string;
  youDps: string;
}
export interface CountUpType {
  startVal: number;
  duration: number;
  useGrouping: boolean;
}
export interface CountObject {
  update: (value: number) => void;
  start: () => void;
}
export interface Encounter {
  CurrentZoneName: string;
  duration: string;
  ENCDPS: string;
}
export interface Detail {
  Encounter: Encounter;
  Combatant: Combatants;
  isActive: boolean;
}
export interface ActDetail {
  detail: Detail;
}
export interface People {
  name?: string;
  ENCDPS?: string;
  maxhit?: string;
  deaths?: string;
  damageP?: string;
  crithitP?: string;
  DirectHitPct?: string;
  CritDirectHitPct?: string;
  'crithit%'?: string;
  'damage%': string;
}
export interface Combatants {
  [key: string]: People;
}
