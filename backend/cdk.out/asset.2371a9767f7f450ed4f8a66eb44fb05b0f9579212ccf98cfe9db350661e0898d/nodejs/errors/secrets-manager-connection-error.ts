import { CustomError } from './custom-error';

export class SecretsManagerConnectionError extends CustomError {
  statusCode = 500;
  reason = 'Error connecting to Secrets Manager';

  constructor() {
    super('Error connecting to Secrets Manager');

    Object.setPrototypeOf(this, SecretsManagerConnectionError.prototype);
  }

  serializeErrors() {
    return {
        statusCode: this.statusCode, 
        errorMessage: this.reason
    };
  }
}