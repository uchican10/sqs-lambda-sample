import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as eventsources from 'aws-cdk-lib/aws-lambda-event-sources';

export class SqsLambdaSampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);



    const dl_queue1 = new sqs.Queue(this, 'dl_SqsLambdaQueue', {
      visibilityTimeout: cdk.Duration.seconds(300),
      queueName: 'dl_sqs-sample-queue'
    });
   
    const queue1 = new sqs.Queue(this, 'SqsLambdaQueue', {
      visibilityTimeout: cdk.Duration.seconds(300),
      retentionPeriod: cdk.Duration.minutes(5),
      queueName: 'sqs-sample-queue',
      deadLetterQueue :{queue: dl_queue1 , maxReceiveCount: 500}
    });


    //------------------------------
    const func_sendLambda = new lambda.Function(this, 'sqsSendLambda', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/sqssend'),
      timeout: cdk.Duration.seconds(5),
      functionName: 'sqsSendLambda',
      environment: {
        'QUEUE_URL': queue1.queueUrl,
      }
    });

    const func_sendLambda_Role = func_sendLambda.role as iam.Role;
    func_sendLambda_Role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSQSFullAccess")
    )

    //------------------------------
    const func_recvLambda = new lambda.Function(this, 'sqsREcvLambda', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/sqsrecv'),
      timeout: cdk.Duration.seconds(10),
      functionName: 'sqsRecvLambda',
      environment: {
        'QUEUE_URL': queue1.queueUrl,
      }
    });

    const func_recvLambda_Role = func_recvLambda.role as iam.Role;
    func_recvLambda_Role.addToPolicy( // 自分で作ったポリシーを追加
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['sqs:*'],
        resources: [
          queue1.queueArn
        ]
      })
    )

    //------------------------------
    const func_trigger_recvLambda = new lambda.Function(this, 'sqsTriggerRecvLambda', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/sqstriggerrecv'),
      timeout: cdk.Duration.seconds(10),
      functionName: 'sqsTrigerRecvLambda',
      environment: {
        'QUEUE_URL': queue1.queueUrl,
      }
    });

    const func_trigger_recvLambda_Role = func_trigger_recvLambda.role as iam.Role;
    func_trigger_recvLambda_Role.addToPolicy( // 自分で作ったポリシーを追加
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['sqs:*'],
        resources: [
          queue1.queueArn
        ]
      })
    )

    // lambdaのトリガーにSQSイベントを割り付ける
    func_trigger_recvLambda.addEventSource(new eventsources.SqsEventSource(queue1))


  }

}

