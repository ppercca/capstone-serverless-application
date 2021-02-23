import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { generateUploadUrl } from '../../businessLogic/Photos';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("Processing Event ", event);
  const photoId = event.pathParameters.photoId
  const URL = await generateUploadUrl(photoId);

  return {
    statusCode: 202,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      uploadUrl: URL,
    })
  }
}
