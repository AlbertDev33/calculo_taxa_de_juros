export class InternalError extends Error {
  constructor(public message: string, protected statusCode = 500) {
    super(message);
  }
}
