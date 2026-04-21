 import { Injectable } from '@angular/core';
 import {environment} from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class ProxyConfigService {
  private basePath: string | null = null;
  private apiPrefix: string | null = null;     // e.g., /at.get-e/gui/getitgui/proxy/v1
  private env: string | null = null;

  loadConfig_(): Promise<void> {
    const hostname = window.location.hostname;
    const origin = window.location.origin;           // https://localhost:9000
    const pathname = window.location.pathname;       // /at.get-e/gui/

    //console.log('URL Debug:', { hostname, origin, pathname });

    // Extract environment code from pathname: /at.get-{env}/gui/
    const envMatch = pathname.match(/\/at\.get-([etpd])\//i);
    const env = envMatch?.[1]?.toLowerCase() || 'e';  // Default to 'd'
    this.env = env;

    //console.log(`Extracted environment: ${env}`);

    // Determine basePath (origin for localhost, or origin for production)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      this.basePath = 'http://localhost:29200'; // origin;  // http://localhost:9000
    } else {
      this.basePath = origin;  // https://portal.at
    }

   // console.log(`Extracted basePath: ${this.basePath}`);

    // Build dynamic apiPrefix: /at.get-{env}/gui/getitgui/proxy/v1
    this.apiPrefix = `/at.gv.bmi.getit3-${env}/gui/getitgui/proxy/v1`;

   // console.log(`basePath: ${this.basePath}`);
   // console.log(`apiPrefix: ${this.apiPrefix}`);

    return Promise.resolve();
  }



  loadConfig(): Promise<void> {
    const hostname = window.location.hostname;
    const origin   = window.location.origin;
    const pathname = window.location.pathname;
    const port     = window.location.port;

    // ← ng serve (any port except 29200) → direct backend call
    if (hostname === 'localhost' && port !== '29200') {
      this.basePath  = 'http://localhost:29200';
      this.apiPrefix = '/at.gv.bmi.getit3-d/srv/v1';
      this.env       = 'd';
      console.log('ng serve config:', { basePath: this.basePath, apiPrefix: this.apiPrefix });
      return Promise.resolve();
    }

    // ← localhost:29200 (forwarding proxy) OR real server (dev/test/prod)
    // both use the same apiPrefix — just different origin
    this.env       = environment.applicationLevel ?? 'e';
    this.basePath  = origin;  // localhost:29200 OR https://my-portal.at
    this.apiPrefix = `/at.gv.bmi.getit3-${this.env}/gui/getitgui/proxy/v1`;

    console.log('SERVER/PROXY config:', { basePath: this.basePath, apiPrefix: this.apiPrefix });
    return Promise.resolve();
  }


  /**
   * Get base path (origin)
   */
  getBasePath(): string {
    if (!this.basePath) {
      // Fallback if not loaded yet
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:29200';
      }
      return window.location.origin;
    }
    return this.basePath;
  }

  /**
   * Get dynamic apiPrefix with environment
   */
  getApiPrefix_(): string {
    if (!this.apiPrefix) {
      // Fallback: extract env and build prefix
      const pathname = window.location.pathname;
      const envMatch = pathname.match(/\/at\.get-([etpd])\//i);
      const env = envMatch?.[1]?.toLowerCase() || 'e';
      //console.log('AAA-env-config', env);
      return `/at.gv.bmi.getit3-${env}/gui/getitgui/proxy/v1`;
    }
    return this.apiPrefix;
  }

  getApiPrefix(): string {
    if (!this.apiPrefix) {
   //   console.warn(' apiPrefix not set — loadConfig() may not have run yet XXXX');

      const hostname = window.location.hostname;
      const port     = window.location.port;

    //  console.log('getApiPrefix-hostname', hostname );
    //  console.log('getApiPrefix-port', port );

      // ng serve — direct backend
      if (hostname === 'localhost' && port !== '29200') {
      //  console.log('localhost && 29200')
        return '/at.gv.bmi.getit3-d/srv/v1';
      }

      // forwarding proxy or real server — use environment level
      const env = environment.applicationLevel ?? 'e';

      //console.log('env', env);
      //console.log(`/at.gv.bmi.getit3-${env}/gui/getitgui/proxy/v1`);
      return `/at.gv.bmi.getit3-${env}/gui/getitgui/proxy/v1`;
    }

    return this.apiPrefix;
  }
  /**
   * Get current environment code
   */
  getEnv(): string {
    return this.env || 'e';
  }

  /**
   * Build full API URL for an endpoint
   * Example: buildApiUrl('personen') → https://localhost:9000/at.get-e/gui/getitgui/proxy/v1/personen
   */
  buildApiUrl(endpoint: string): string {
    const basePath = this.getBasePath().replace(/\/$/, '');
    const apiPrefix = this.getApiPrefix();
    const cleanEndpoint = endpoint.replace(/^\//, '');

    return `${basePath}${apiPrefix}/${cleanEndpoint}`;
  }

  /**
   * Check if running on localhost
   */
  isLocalhost(): boolean {
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1';
  }
}
