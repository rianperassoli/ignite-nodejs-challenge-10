import { APIGatewayProxyHandler } from "aws-lambda"
import { document } from "../utils/dynamoDBClient"

export const handler: APIGatewayProxyHandler = async (event) => {

  const { userid: user_id } = event.pathParameters

  const response = await document.scan({
    TableName: 'todos',
    FilterExpression: ':user_id = user_id',
    ExpressionAttributeValues: { ':user_id': user_id },
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(response.Items)
  }
}