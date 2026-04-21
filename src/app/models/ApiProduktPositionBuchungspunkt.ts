import { ApiProduktPosition } from './ApiProduktPosition';
import { ApiTaetigkeitsbuchung } from './ApiTaetigkeitsbuchung';
import { ApiGetItEntitaet } from './ApiGetItEntitaet';

export interface ApiProduktPositionBuchungspunkt extends ApiGetItEntitaet {
  aktiv?: boolean;
  buchungspunkt?: string;
  produktPosition?: ApiProduktPosition;
  taetigkeitsbuchung?: ApiTaetigkeitsbuchung[];
}
