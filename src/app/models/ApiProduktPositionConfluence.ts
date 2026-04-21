import { ApiPersonConfluence } from './ApiPersonConfluence';

export interface ApiProduktPositionConfluence {
  aktiv?: boolean;
  bezeichnung?: string;
  durchfuehrungsverantwortlicher?: ApiPersonConfluence;
  servicemanager?: ApiPersonConfluence;
}
