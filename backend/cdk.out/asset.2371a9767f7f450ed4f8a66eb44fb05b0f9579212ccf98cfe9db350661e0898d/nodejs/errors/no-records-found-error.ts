import { CustomError } from './custom-error';

export class NoRecordsFoundError extends CustomError {
  statusCode = 200;
  entity = '';

  constructor() {
    super('No records found');

    Object.setPrototypeOf(this, NoRecordsFoundError.prototype);
  }

  serializeErrors() {
    return {
      statusCode: this.statusCode, 
      errorMessage: 'No records found', 
      entity: this.entity
    };
  }
}