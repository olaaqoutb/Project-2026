import { ApiEnvironment } from './ApiEnvironment';

export interface ApiInfo {
  version?: string;
  buildTime?: string;
  environment?: ApiEnvironment;
}
