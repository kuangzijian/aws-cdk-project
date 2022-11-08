import { CustomError } from '../errors/custom-error';

export const errorHandler = (
  error: Error
) => {
  if (error instanceof CustomError) {
    console.error("error: " + error);
    return{
      statusCode: error.statusCode,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify(error.serializeErrors())
    }
  }
  else if (error instanceof Error) {
      console.error("error: " + error);
      return{                
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify(
          {
              statusCode: 400,
              errorMessage: "Something went wrong"
          })
      }
  }        
    else {
        return{
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
          },
          body: "Something went wrong"
        }
    } 
};