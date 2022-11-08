import { Stack, StackProps } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import * as path from 'path'
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';

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