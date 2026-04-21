// http-error.model.ts
export class HttpError extends Error {
    constructor(
      public status: number,
      public statusText: string,
      public body?: any,
      public url?: string
    ) {
      super(`HTTP ${status}: ${statusText}`);
      Object.setPrototypeOf(this, HttpError.prototype);
    }
  }