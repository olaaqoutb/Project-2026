import { ApiUeberfaelligeStunden } from './ApiUeberfaelligeStunden';

export interface ApiAuswertungUeberfaelligeStunden {
  personEntityid?: number;
  ueberfaelligeStunden?: ApiUeberfaelligeStunden[];
}
