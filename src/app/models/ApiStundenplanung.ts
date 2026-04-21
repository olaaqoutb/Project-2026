import { ApiVertragPositionVerbraucher } from './ApiVertragPositionVerbraucher';
import { ApiProdukt } from './ApiProdukt';
import { ApiProduktPosition } from './ApiProduktPosition';
import { ApiGetItEntitaet } from './ApiGetItEntitaet';

export interface ApiStundenplanung extends ApiGetItEntitaet {
  anmerkung?: string;
  stundenGeplant?: string;
  vertragPositionVerbraucher?: ApiVertragPositionVerbraucher;
  produktPosition?: ApiProduktPosition;
  produkt?: ApiProdukt;
}
