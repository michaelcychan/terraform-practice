import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { getDayOfWeek } from './utils/getDayOfWeek.js';

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  const dayOfWeek = getDayOfWeek(new Date());
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Hello from Lambda! Today is ${dayOfWeek}` }),
  }
}