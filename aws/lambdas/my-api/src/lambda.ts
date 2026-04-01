import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { getDayOfWeek } from './utils/getDayOfWeek.js';
import { SQSWrapper } from './utils/SQSWrapper.js';

const queueUrl = process.env.MY_QUEUE_URL;

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  const dayOfWeek = getDayOfWeek(new Date());
  
  if (!queueUrl) {
    console.error('MY_QUEUE_URL environment variable is not set');
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error: Queue URL not configured' }),
    }
  }

  const sqsWrapper = new SQSWrapper(queueUrl);
  const messageSent = await sqsWrapper.sendMessage(`Hello from Lambda! Today is ${dayOfWeek}`);
  
  if (!messageSent) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error: Failed to send message to SQS' }),
    }
  }


  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Hello from Lambda! Today is ${dayOfWeek}` }),
  }
}