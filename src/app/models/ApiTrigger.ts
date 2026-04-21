import { ApiTriggerMetaDaten } from './ApiTriggerMetaDaten';
import { ApiTriggerAktion } from './ApiTriggerAktion';
import { ApiTriggerStatus } from './ApiTriggerStatus';
import { ApiGetItEntitaet } from './ApiGetItEntitaet';

export interface ApiTrigger extends ApiGetItEntitaet {
  aktion?: ApiTriggerAktion;
  aktionStatus?: ApiTriggerStatus;
  aktionTime?: string;
  aktionMetaDaten?: ApiTriggerMetaDaten;
}
