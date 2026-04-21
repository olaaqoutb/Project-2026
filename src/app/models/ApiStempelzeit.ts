import { ApiZeitTyp } from './ApiZeitTyp';
import { ApiStempelzeitMarker } from './ApiStempelzeitMarker';
import { ApiPerson } from './ApiPerson';
import { ApiStempelzeitEintragungsart } from './ApiStempelzeitEintragungsart';
import { ApiGetItEntitaet } from './ApiGetItEntitaet';

export interface ApiStempelzeit extends ApiGetItEntitaet {
  person?: ApiPerson;
  loginSystem?: string;
  logoffSystem?: string;
  login?: string;
  logoff?: string;
  anmerkung?: string;
  zeitTyp?: ApiZeitTyp;
  poKorrektur?: boolean;
  marker?: ApiStempelzeitMarker[];
  eintragungsart?: ApiStempelzeitEintragungsart;
}
