import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdatePhotoRequest } from '../../requests/UpdatePhotoRequest'
import { updatePhoto } from '../../businessLogic/Photos';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("Processing Event ", event);
  const photoId = event.pathParameters.photoId
  const updatedPhoto: UpdatePhotoRequest = JSON.parse(event.body)
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];
  const photoItem = await updatePhoto(updatedPhoto, photoId, jwtToken);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      "item": photoItem
    }),
  }
}
