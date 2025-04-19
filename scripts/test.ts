import "dotenv/config";
import { SQSClient, SendMessageCommand, SendMessageCommandInput } from "@aws-sdk/client-sqs";

const REGION= process.env.REGION || "us-east-1";

const sqs = new SQSClient({ region: REGION });

const imageUrl = "https://global-norte.s3.amazonaws.com/dashboard/6495dabc599fea2ab32ff48b/images/29202da1bf58c6b9b2d1379b8463f0b1-GSAI4554.JPG";

import axios from "axios";

async function getImageBuffer(imageUrl: string): Promise<Buffer> {
    console.log('Downloading image...');
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    console.log('Buffering image...');
    const buffer = Buffer.from(response.data, 'base64');
    return buffer;
}

async function publishToSQS() {

    const imageBuffer = await getImageBuffer(imageUrl);

    const imageBase64 = imageBuffer.toString('base64');

    const params:SendMessageCommandInput = {
        MessageBody: JSON.stringify({ imageBase64 }),
        QueueUrl: process.env.SQS_IMAGE_ANALYSIS_URL,
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
