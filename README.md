# Frontend

Angular 19 application (GETIT UI) reconstructed from the code fragments in
`original-code/` and wired up with a mock backend for local development.

## Getting started

```bash
npm install
npm start          # equivalent to `ng serve`
```

Open http://localhost:4200/ in your browser.

## Mock backend

The app ships with an in-memory mock backend so that `ng serve` works without
any real API. It is implemented as a lightweight HTTP interceptor
(`src/app/mock/mock-backend.interceptor.ts`) that is registered ahead of the
existing `ProxyInterceptor` and short-circuits matching requests with data
from `src/app/mock/mock-data.ts`.

Enable / disable it with the flag in `src/environments/environment.ts`:

```ts
export const environment = {
  // ...
  useMockBackend: true,  // set to false to hit the real backend
};
```

Endpoints that are mocked include:

* `GET  personen`, `GET personen:anwesend`, `GET personen/{id}`, `GET personen/me`
* `GET  stempelzeiten`, `POST stempelzeiten/{id}`
* `GET  organisationseinheiten`
* `GET  vertraege`, `GET vertraege/{id}`, `vertrag-positionen/*`, `lkdetails/*`
* `GET  produkte`, `GET produkte/{id}`, `produkt-positionen/*`
* `GET  freigabePositionen`, `GET freigabePositionen/{id}/taetigkeitsbuchungen`
* `GET  trigger/{id}`, `POST trigger`
* `GET  infopdf/musslesen`, `POST infopdf/hatgelesen`
* `GET  feiertage`

Any unmocked endpoint falls through to the real network pipeline.

To add more mock data, extend `mock-data.ts` and add a matching route in the
`handle()` method of `mock-backend.interceptor.ts`.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
