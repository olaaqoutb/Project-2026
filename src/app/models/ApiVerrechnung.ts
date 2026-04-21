import { ApiTaetigkeitsbuchung } from './ApiTaetigkeitsbuchung';
import { ApiGetItEntitaet } from './ApiGetItEntitaet';

export interface ApiVerrechnung extends ApiGetItEntitaet {
  taetigkeitsbuchung?: ApiTaetigkeitsbuchung;
  minutenDauer?: string;
  stundensatz?: string;
  lkPunkte?: string;
}
