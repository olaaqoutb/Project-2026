import { ApiInfo } from './ApiInfo';

export interface ApiTest {
  info?: ApiInfo;
  server?: string;
  database?: string;
  amtssignatur?: string;
  mail?: string;
  pruefer?: string;
}
