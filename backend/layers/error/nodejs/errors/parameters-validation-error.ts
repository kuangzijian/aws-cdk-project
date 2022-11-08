import { CustomError } from './custom-error';

export class ParametersValidationError extends CustomError {
  statusCode = 400;
  invalidParameters = [''];

  constructor() {
    super('Invalid request parameters');

    Object.setPrototypeOf(this, ParametersValidationError.prototype);
  }

  serializeErrors() {
    return {
      statusCode: this.statusCode, 
      errorMessage: 'Invalid request parameters', 
      InvalidParameters: this.invalidParameters
    };
  }
}

export const ParametersValidator = (
  params: {name: string; value: string; nullable: boolean; isNumber: boolean}[]
) => {
  var parametersValidationError = new ParametersValidationError();
  parametersValidationError.invalidParameters = [];
  
  for( var i=0; i < params.length; i++ ) {
    if (params[i].nullable && params[i].value == null){
      continue;
    }

    if ((params[i].value == "" || params[i].value == null) && !params[i].nullable){
      parametersValidationError.invalidParameters.push(params[i].name);
      continue;
    }

    if (isNaN(params[i].value as any) && params[i].isNumber)
    {
      parametersValidationError.invalidParameters.push(params[i].name);
      continue;
    }
  }
  
  return parametersValidationError;
};