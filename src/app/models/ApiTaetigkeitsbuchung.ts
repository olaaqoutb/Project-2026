import { ApiStempelzeit } from './ApiStempelzeit';
import { ApiZeitTyp } from './ApiZeitTyp';
import { ApiTaetigkeitTyp } from './ApiTaetigkeitTyp';
import { ApiProduktPositionBuchungspunkt } from './ApiProduktPositionBuchungspunkt';
import { ApiBuchungsart } from './ApiBuchungsart';
import { ApiGetItEntitaet } from './ApiGetItEntitaet';

export interface ApiTaetigkeitsbuchung extends ApiGetItEntitaet {
  minutenDauer?: number;
  taetigkeit?: ApiTaetigkeitTyp;
  buchungspunkt?: ApiProduktPositionBuchungspunkt;
  jiraTicket?: string;
  anmerkung?: string;
  datum?: string;
  zeitTyp?: ApiZeitTyp;
  tagesabschluss?: boolean;
  tagesabschlussAufgehoben?: boolean;
  monatsabschluss?: boolean;
  verrechnetZeitraum?: string;
  buchungsart?: ApiBuchungsart;
  freigabepositionVorhanden?: boolean;
  stempelzeit?: ApiStempelzeit;
}
