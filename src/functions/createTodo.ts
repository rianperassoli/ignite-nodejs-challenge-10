import { APIGatewayProxyHandler } from "aws-lambda"
import { v4 as uuidV4 } from 'uuid'
import { document } from "../utils/dynamoDBClient";

interface ICreateTodo {
  title: string;
  deadline: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {

  const { userid: user_id } = event.pathParameters
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo

  const newTodo = {
    id: uuidV4(),
    user_id,
    title,
    deadline: new Date(deadline).toUTCString(),
    done: false
  }

  await document.put({
    TableName: 'todos',
    Item: newTodo
  }).promise()

  const response = await document.query({
    TableName: "todos",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": newTodo.id
    }
  }).promise()

  const inserted = response.Items[0]

  if (inserted) {
    return {
      statusCode: 201,
      body: JSON.stringify(inserted)
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: 'Todo not inserted' })
  }
}