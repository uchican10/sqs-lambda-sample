import { SQSClient, ReceiveMessageCommand ,DeleteMessageCommand } from "@aws-sdk/client-sqs"; // ES Modules import
const config = {}
const client = new SQSClient(config);


export const handler = async (event: any) => {

    const Qurl = process.env["QUEUE_URL"]

    const input_recv = { // ReceiveMessageRequest
        QueueUrl: Qurl,
        MaxNumberOfMessages: 1,

        /*
          AttributeNames: [ // AttributeNameList
            "All" || "Policy" || "VisibilityTimeout" || "MaximumMessageSize" || "MessageRetentionPeriod" || "ApproximateNumberOfMessages" || "ApproximateNumberOfMessagesNotVisible" || "CreatedTimestamp" || "LastModifiedTimestamp" || "QueueArn" || "ApproximateNumberOfMessagesDelayed" || "DelaySeconds" || "ReceiveMessageWaitTimeSeconds" || "RedrivePolicy" || "FifoQueue" || "ContentBasedDeduplication" || "KmsMasterKeyId" || "KmsDataKeyReusePeriodSeconds" || "DeduplicationScope" || "FifoThroughputLimit" || "RedriveAllowPolicy" || "SqsManagedSseEnabled",
          ],
          MessageSystemAttributeNames: [ // MessageSystemAttributeList
            "All" || "SenderId" || "SentTimestamp" || "ApproximateReceiveCount" || "ApproximateFirstReceiveTimestamp" || "SequenceNumber" || "MessageDeduplicationId" || "MessageGroupId" || "AWSTraceHeader" || "DeadLetterQueueSourceArn",
          ],
          MessageAttributeNames: [ // MessageAttributeNameList
            "STRING_VALUE",
          ],
          VisibilityTimeout: Number("int"),
          WaitTimeSeconds: Number("int"),
          ReceiveRequestAttemptId: "STRING_VALUE",
        */

    };
    // QUEUEから受信
    const command = new ReceiveMessageCommand(input_recv);
    const response_recv = await client.send(command);

    console.log(JSON.stringify(response_recv, null, 2))


    // QUEUEから明示的に削除
    const input_delete={
        QueueUrl: Qurl,
        ReceiptHandle : response_recv?.Messages?.[0]?.ReceiptHandle
    }
    const response_delete=await client.send(new DeleteMessageCommand(input_delete))

    return {
        statusCode: 200,
        body: JSON.stringify('success'),
    }
}