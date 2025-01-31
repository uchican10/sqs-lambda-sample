
import * as sqs from "@aws-sdk/client-sqs"
import * as awslambda from "aws-lambda"

const config: sqs.SQSClientConfig = {}
const client = new sqs.SQSClient(config);
export const handler: awslambda.Handler = async (event: any, context: awslambda.Context): Promise<any> => {

  const Qurl: string = process.env["QUEUE_URL"] ?? ''

  const input_recv: sqs.ReceiveMessageCommandInput = { // ReceiveMessageRequest
    QueueUrl: Qurl,
    MaxNumberOfMessages: 1,
    VisibilityTimeout: context.getRemainingTimeInMillis() * 6,// queueの設定に関係なくここで指定できるってことですかね？ 
  };
  // QUEUEから受信
  const command: sqs.ReceiveMessageCommand = new sqs.ReceiveMessageCommand(input_recv);
  const response_recv: sqs.ReceiveMessageCommandOutput = await client.send(command);

  console.log('ReceiveMessageCommandOutput', "\n", JSON.stringify(response_recv, null, 2))


  // QUEUEから明示的に削除
  const input_delete: sqs.DeleteMessageCommandInput = {
    QueueUrl: Qurl,
    ReceiptHandle: response_recv?.Messages?.[0]?.ReceiptHandle
  }
  const response_delete: sqs.DeleteMessageCommandOutput = await client.send(new sqs.DeleteMessageCommand(input_delete))
  console.log('ReceiveMessageCommandOutput', "\n", JSON.stringify(response_delete, null, 2))


  return {
    statusCode: 200,
    body: JSON.stringify('success'),
  }
}