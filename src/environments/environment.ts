import {EnvironmentConfig} from './environment.model';

export const environment = {
  production: false,
  apiUrl: 'https://test-api.yourcompany.com/api',
  environment: 'test',
  debugMode: false,

  // When true the MockBackendInterceptor serves in-memory data instead of
  // calling a real backend. This lets the UI run stand-alone with `ng serve`.
  useMockBackend: true,

  applicationLevel: 'd', // Default environment level

  appPrefix: 'com.getit3-',
  guiPath: '/gui',
   backendUrl: 'http://localhost:29200/at.com.getit3-xxd/srv'
};


