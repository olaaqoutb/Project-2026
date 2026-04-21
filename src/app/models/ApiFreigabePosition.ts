import { ApiFreigabeStatus } from './ApiFreigabeStatus';
import { ApiPerson } from './ApiPerson';
import { ApiProduktPosition } from './ApiProduktPosition';
import { ApiFreigabePositionMetaDaten } from './ApiFreigabePositionMetaDaten';
import { ApiGetItEntitaet } from './ApiGetItEntitaet';

export interface ApiFreigabePosition extends ApiGetItEntitaet {
  anmerkung?: string;
  freigabeStatus?: ApiFreigabeStatus;
  minutenDauer?: number;
  buchungsZeitraum?: string;
  produktPosition?: ApiProduktPosition;
  bucher?: ApiPerson;
  metadaten?: ApiFreigabePositionMetaDaten;
  letzteAenderungUser?: ApiPerson;
}
