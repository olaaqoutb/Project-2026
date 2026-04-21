import { ApiState } from './ApiState';

export interface ApiGetItEntitaet {
  id?: string;
  version?: number;
  deleted?: boolean;
  state?: ApiState;
}
