import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as cdk from 'aws-cdk-lib';


export class RdsStackDev extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create the VPC
    const vpc = new ec2.Vpc(this, 'my-cdk-vpc', {
      subnetConfiguration: [{
        cidrMask: 24,
        name: 'ingress',
        subnetType: ec2.SubnetType.PUBLIC,
      },{
        cidrMask: 24,
        name: 'compute',
        subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
      },{
        cidrMask: 28,
        name: 'rds',
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      }]
    })

    const creds = new rds.DatabaseSecret(this, 
      'environmentSecretsDev1', {
      secretName: "environmentSecretsDev1",
      username: "techdev"
    })

    // 👇 create RDS instance
    const dbInstance = new rds.DatabaseInstance(this, 'db-instance', {
      vpc: vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0
      }),
      port: 3306,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3, 
        ec2.InstanceSize.MICRO
      ),
      credentials: rds.Credentials.fromSecret(creds),
      databaseName: 'segment',
      allocatedStorage: 20,
      backupRetention: cdk.Duration.days(7),
      publiclyAccessible: true
    });

    new cdk.CfnOutput(this, 'dbEndpoint', {
      value: dbInstance.instanceEndpoint.hostname,
    });

    new cdk.CfnOutput(this, 'secretArn', {
      value: dbInstance.secret?.secretArn!,
      exportName: 'secretArn',
    });
  }
}