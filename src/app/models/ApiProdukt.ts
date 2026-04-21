import { ApiStundenplanung } from './ApiStundenplanung';
import { ApiPerson } from './ApiPerson';
import { ApiProduktPosition } from './ApiProduktPosition';
import { ApiProduktTyp } from './ApiProduktTyp';
import { ApiGetItEntitaet } from './ApiGetItEntitaet';

export interface ApiProdukt extends ApiGetItEntitaet {
  produktname?: string;
  start?: string;
  ende?: string;
  aktiv?: boolean;
  kurzName?: string;
  anmerkung?: string;
  auftraggeber?: string;
  auftraggeberOrganisation?: string;
  ergebnisverantwortlicher?: ApiPerson;
  produktTyp?: ApiProduktTyp;
  produktPosition?: ApiProduktPosition[];
  stundenplanung?: ApiStundenplanung[];
}
