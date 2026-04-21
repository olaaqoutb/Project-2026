
export type ApplicationLevel = 'd' | 'e' | 't' | 'p';

export interface EnvironmentConfig {
  production: boolean;
  applicationLevel: ApplicationLevel;
}



