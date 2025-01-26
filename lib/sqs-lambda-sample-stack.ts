import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';

export class SqsLambdaSampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here


    const queue = new sqs.Queue(this, 'SqsLambdaQueue', {
      visibilityTimeout: cdk.Duration.seconds(300),
      queueName: 'sql-sample-sample-queue'
    });

    //------------------------------
    const func_sendLambda = new lambda.Function(this, 'sqsSendLambda', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/sqssend'),
      timeout: cdk.Duration.seconds(5),
      functionName: 'sqsSendLambda',
      environment: {
        'QUEUE_URL': queue.queueUrl,
      }
    });

    //func_sendLambda.role?.addManagedPolicy(
    //  iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSQSFull")
    //)
    const func_sendLambda_Role = func_sendLambda.role as iam.Role;
    func_sendLambda_Role.addToPolicy( // 自分で作ったポリシーを追加
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['sqs:*'],
        resources: [
          queue.queueArn
        ]
      })
    )

    //------------------------------
    const func_recvLambda = new lambda.Function(this, 'sqsREcvLambda', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/sqsrecv'),
      timeout: cdk.Duration.seconds(10),
      functionName: 'sqsRecvLambda',
      environment: {
        'QUEUE_URL': queue.queueUrl,
      }
    });

    //func_sendLambda.role?.addManagedPolicy(
    //  iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSQSFull")
    //)
    const func_recvLambda_Role = func_recvLambda.role as iam.Role;
    func_recvLambda_Role.addToPolicy( // 自分で作ったポリシーを追加
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['sqs:*'],
        resources: [
          queue.queueArn
        ]
      })
    )



  }

}

