import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreatePhotoRequest } from '../../requests/CreatePhotoRequest'
import { createPhoto } from '../../businessLogic/Photos';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("Processing Event ", event);
  const newPhoto: CreatePhotoRequest = JSON.parse(event.body)
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];

  if (newPhoto.name) {
    const toDoItem = await createPhoto(newPhoto, jwtToken);
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        "item": toDoItem
      }),
    }
  } else {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        "message": "Please fill all the fields"
      }),
    }
  }
}
