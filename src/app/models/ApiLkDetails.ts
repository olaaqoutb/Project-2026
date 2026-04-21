import { ApiGetItEntitaet } from './ApiGetItEntitaet';

export interface ApiLkDetails extends ApiGetItEntitaet {
  lkKategorie?: string;
  lkBezeichnung?: string;
  lkFaktor?: string;
}
