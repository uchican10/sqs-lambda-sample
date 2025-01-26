import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { SqsSendMessageProps } from "aws-cdk-lib/aws-stepfunctions-tasks";

const config = {}
const sqsclient = new SQSClient(config)


export const handler = async (evenr: any) => {
    const Qurl = process.env["QUEUE_URL"] ?? ""

    const ret1 = await sendMes(Qurl)
}


const sendMes = async (Qurl: string) => {

    for (let i = 0; i < 10; i++) {
        const input = {
            QueueUrl: Qurl,
            MessageBody: `message-${i}`,
        }

        const resp = await sqsclient.send(new SendMessageCommand(input))
    }
    return "OK"
}