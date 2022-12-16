
export class InvalidEnvException extends Error {
  constructor(message = "Invalid env file") {
    super();
    this.message = message;
  }
}
