import { ApiVertragPositionVerbraucher } from './ApiVertragPositionVerbraucher';
import { ApiGetItEntitaet } from './ApiGetItEntitaet';

export interface ApiVertragPosition extends ApiGetItEntitaet {
  position?: string;
  volumenStunden?: string;
  volumenEuro?: string;
  anmerkung?: string;
  aktiv?: boolean;
  vertragPositionVerbraucher?: ApiVertragPositionVerbraucher[];
  planungsjahr?: string;
  jahresuebertrag?: boolean;
  rollenbezeichnungRahmenvertrag?: string;
  stundenGeplant?: string;
  stundenGebucht?: string;
}
