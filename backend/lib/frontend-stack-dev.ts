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


export class FrontEndStackDev extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        //Define the react app S3 bucket
        const websiteBucket = new Bucket(this, 'segment-app-dev-bucket', {
            websiteIndexDocument: 'index.html',
            publicReadAccess:true,
            bucketName: 'segment-react-app-dev'
        })

        //Define the react app bucket deployment
        new BucketDeployment(this, 'segment-app-deploy-dev-deploy', {
        sources: [
            Source.asset(path.join(__dirname, '../../', 'frontend','build'))
        ],
        destinationBucket: websiteBucket
        });
    }
}