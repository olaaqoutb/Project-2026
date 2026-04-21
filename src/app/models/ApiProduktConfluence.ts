import { ApiProduktPositionConfluence } from './ApiProduktPositionConfluence';

export interface ApiProduktConfluence {
  aktiv?: boolean;
  kurzbezeichnung?: string;
  langbezeichnung?: string;
  produktPosition?: ApiProduktPositionConfluence[];
}
