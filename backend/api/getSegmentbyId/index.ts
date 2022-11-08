import "reflect-metadata"
import { database } from "../../layers/typeorm/nodejs/data_connection/data_connection";
import { Segment } from "../../layers/typeorm/nodejs/entity/Segment"
import { APIGatewayProxyEventV2,Context,APIGatewayProxyResultV2 } from "aws-lambda";
import { S3} from 'aws-sdk';
import { errorHandler } from "../../layers/error/nodejs/handler/error-handler";
import { ParametersValidator } from "../../layers/error/nodejs/errors/parameters-validation-error";
import { DataSource } from "typeorm";

const bucketName = process.env.IMAGE_BUCKET_NAME!;
const s3 = new S3();

function generateSignedUrl(key: string){
    const url = s3.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: key!,
        Expires: (24 * 60 * 60)
    });

    return url;
}

async function getSegmentbyId(event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2>{
    try{
        // get input parameters of the API
        var segmentId = event.queryStringParameters!.id;

        // Validate Parameters
        var parametersValidationError = ParametersValidator([
            {name: 'id', value: segmentId!, nullable: false, isNumber: true}
        ])
        if (parametersValidationError.invalidParameters.length > 0){
            throw parametersValidationError;
        }
        console.log("segmentId: " + segmentId);
        
        // Get connection to DB
        const DataSource: DataSource = await database.getConnection()
        
        // Build up and run query
        const segment = await DataSource.getRepository(Segment)
            .createQueryBuilder("Segment")
            .where('Segment.segment_id = :id', { id: segmentId})
            .getRawOne()


        // Get images and signed url fomr S3     
        const signedUrl = generateSignedUrl(segment.Segment_url);
        
        // define TYPEs for outputs
        type Segment_ = {
            id: number;
            url: string;
        }     
        type Res = {         
            segment: Segment_;
            message: "success"
        }

        // Assemble json objects
        var jsonResults: Res = {
            segment: {
                id: segment.Segment_segment_id,
                url: signedUrl,
            },
            message: "success"
        };
        
        // Return the results
        console.log("successfully returned response: " + jsonResults);
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
              },
            body: JSON.stringify(jsonResults),
        };
    } 
    catch (error){
        var errorObj = errorHandler(error as any);
        return errorObj;     
    }   
}

export {getSegmentbyId}