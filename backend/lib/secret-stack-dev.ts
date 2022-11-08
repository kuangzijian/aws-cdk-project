import {CfnOutput, Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

export const cfnExports = {environmentSecretsArn: "environmentSecretsArn"};

export class SecretStackDev extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        //Define AWS Secret manager configurations
        const environmentSecrets = new secretsmanager.Secret(this,
            'environmentSecretsDev2',
            {description: 'secrets dev',
            secretName: 'environmentSecretsDev2'});

        new CfnOutput(this, cfnExports.environmentSecretsArn, {
            value: environmentSecrets.secretArn,
            exportName: cfnExports.environmentSecretsArn,
        })
    }
}