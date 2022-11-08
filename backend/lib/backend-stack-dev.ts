import { Fn, Stack, StackProps } from 'aws-cdk-lib';
import { Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { Code, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as path from 'path'
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from "aws-cdk-lib/aws-iam"
import {cfnExports} from "./secret-stack-dev"
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BackendStackDev extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
    
    
    //Define the image S3 bucket
    const bucket = new Bucket(this, 'imgs-dev', {
      encryption: BucketEncryption.S3_MANAGED,
      bucketName: 'segment-imgs-dev'
    });

    //Define the image S3 bucket deployment
    new BucketDeployment(this, 'segment-imgs-deploy-dev', {
      sources: [
        Source.asset(path.join(__dirname, '..', 'images'))
      ],
      destinationBucket: bucket
    });

    //Define lambda layers
    const errorLayer = new LayerVersion(this, 'error-layer', {
      compatibleRuntimes: [
        Runtime.NODEJS_16_X,
      ],
      code: Code.fromAsset('./layers/error'),
      description: 'error handling',
    });

    //Define lambda layers
    const typeormLayer = new LayerVersion(this, 'typeorm-layer', {
      compatibleRuntimes: [
        Runtime.NODEJS_16_X,
      ],
      code: Code.fromAsset('./layers/typeorm'),
      description: 'typeorm',
    });

    //Define the Lambda functions
    const getSegmentbyIdLambda = new lambda.NodejsFunction(this, 'GetSegmentByIdLambda', {
      runtime: Runtime.NODEJS_16_X,
      functionName: 'GetSegmentbyIdLambda',
      entry: path.join(__dirname, '..', 'api', 'getSegmentbyId', 'index.ts'),
      handler: 'getSegmentbyId',
      environment: {
        IMAGE_BUCKET_NAME: bucket.bucketName,
        SECRET_ARN: Fn.importValue(cfnExports.environmentSecretsArn),
      },
      layers: [errorLayer, typeormLayer]
    });

    //Define the IAM policy statements and assign roles/policies to lambda functions
    const bucketContainerPermissions = new PolicyStatement();
    bucketContainerPermissions.addResources(bucket.bucketArn);
    bucketContainerPermissions.addActions('s3:ListBucket');

    const bucketPermissions = new PolicyStatement();
    bucketPermissions.addResources(`${bucket.bucketArn}/*`);
    bucketPermissions.addActions('s3:GetObject', 's3:PutObject');
    getSegmentbyIdLambda.addToRolePolicy(bucketPermissions);
    getSegmentbyIdLambda.addToRolePolicy(bucketContainerPermissions);


    const readSecretsPolicy = new iam.Policy(this, "readSecretsPolicy", {
      document: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            actions: ["secretsmanager:GetSecretValue"],
            resources: [Fn.importValue(cfnExports.environmentSecretsArn)]
          })
        ]
      })
    })

    const getSegmentbyIdLambdaRole = getSegmentbyIdLambda.role;
    getSegmentbyIdLambdaRole?.attachInlinePolicy(readSecretsPolicy)

    //Define the APIgateway
    const api = new apigateway.RestApi(this, "segment-api-dev", {
      restApiName: "segment-api-dev",
      description: "This service serves segment apis.",
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['*'],
      },
      deployOptions: {
        stageName: 'dev'
      }
    });

    //APIgateway integration with Lambda functions
    // getSegmentbyId
    const getSegmentbyIdIntegration = new apigateway.LambdaIntegration(getSegmentbyIdLambda, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }, requestParameters: {
        "integration.request.querystring.id": "method.request.querystring.id", 
      }
    });
    const segment = api.root.addResource("getSegmentbyId")
    segment.addMethod("GET", getSegmentbyIdIntegration, {
      requestParameters: {
        'method.request.querystring.id': true
      },});
  }
}
