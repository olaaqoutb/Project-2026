import { ApiPersonenvermerkTyp } from './ApiPersonenvermerkTyp';
import { ApiGetItEntitaet } from './ApiGetItEntitaet';

export interface ApiPersonenvermerk extends ApiGetItEntitaet {
  datum?: string;
  vermerkTyp?: ApiPersonenvermerkTyp;
  anmerkung?: string;
}
