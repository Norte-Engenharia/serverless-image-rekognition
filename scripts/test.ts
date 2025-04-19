import "dotenv/config";
import { SQSClient, SendMessageCommand, SendMessageCommandInput } from "@aws-sdk/client-sqs";

const REGION = process.env.REGION || "us-east-1";
const SQS_IMAGE_ANALYSIS_URL = process.env.SQS_IMAGE_ANALYSIS_URL;

if (!SQS_IMAGE_ANALYSIS_URL) {
    throw new Error("SQS_IMAGE_ANALYSIS_URL is not defined in the environment variables.");
}

const sqs = new SQSClient({ region: REGION });

const imageUrl = "https://global-norte.s3.amazonaws.com/dashboard/6495dabc599fea2ab32ff48b/images/29202da1bf58c6b9b2d1379b8463f0b1-GSAI4554.JPG";


async function publishToSQS() {
    const params: SendMessageCommandInput = {
        MessageBody: JSON.stringify({ imageUrl }),
        QueueUrl: SQS_IMAGE_ANALYSIS_URL,
    };
    try {
        const command = new SendMessageCommand(params);
        const response = await sqs.send(command);
        console.log("Message sent successfully:", response.MessageId);
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

publishToSQS();
