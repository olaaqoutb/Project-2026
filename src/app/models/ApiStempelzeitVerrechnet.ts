import { ApiZeitTyp } from './ApiZeitTyp';
import { ApiPerson } from './ApiPerson';
import { ApiGetItEntitaet } from './ApiGetItEntitaet';

export interface ApiStempelzeitVerrechnet extends ApiGetItEntitaet {
  portalUser?: string;
  person?: ApiPerson;
  loginSystem?: string;
  logoffSystem?: string;
  login?: string;
  logoff?: string;
  anmerkung?: string;
  zeitTyp?: ApiZeitTyp;
}
