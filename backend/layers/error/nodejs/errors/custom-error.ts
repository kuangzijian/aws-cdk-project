import { int } from "aws-sdk/clients/datapipeline";

export abstract class CustomError extends Error {
    abstract statusCode: number;
  
    constructor(message: string) {
      super(message);
  
      Object.setPrototypeOf(this, CustomError.prototype);
    }
  
    abstract serializeErrors(): {statusCode: int; errorMessage: string; field?: string; fields?: string[];};
  }
