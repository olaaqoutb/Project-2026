import { ApiPerson } from './ApiPerson';
 import { ApiGetItEntitaet } from './ApiGetItEntitaet';

export interface ApiOrganisationseinheit extends ApiGetItEntitaet {
  bezeichnung?: string;
  kurzBezeichnung?: string;
  gueltigVon?: string;
  gueltigBis?: string;
  email?: string[];
  leiter?: ApiPerson;
  parent?: ApiOrganisationseinheit;
}
