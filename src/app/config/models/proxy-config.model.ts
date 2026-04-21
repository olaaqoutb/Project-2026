// app/core/config/models/proxy-config.model.ts
export type ApplicationLevel = 'd' | 'e' | 't' | 'p';

export interface ProxyConfig {
  /** Application environment level */
  applicationLevel: ApplicationLevel;

  /** Backend base URL (computed or overridden) */
  backendUrl: string;

  /** API path prefix to proxy */
  apiPath: string;

  /** Production flag */
  production: boolean;
}

/**
 * Compute backend URL like Java's getUrl() method
 */
export function computeBackendUrl(level: ApplicationLevel): string {
  if (['e', 't', 'p'].includes(level)) {
    return `http://lh${level}3int.at/at.getit3-${level}/srv`;
  }
  return 'http://localhost:19000/at.getit3-d/srv';
}
