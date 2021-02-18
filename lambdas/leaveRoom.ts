import { APIGatewayProxyHandler, APIGatewayEvent } from 'aws-lambda'
import Responses from './common/Responses'
import Dynamo from './common/Dynamo'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  const { connectedAt, connectionId } = event.requestContext
  const { ROOM_ID } = JSON.parse(event.body as string)

  try {
    await Dynamo.delete({
      ROOM_ID,
      connectionId: connectionId as string,
      TableName: process.env.tableName as string,
    })

    return Responses({
      statusCode: 200,
      body: { message: `left the room ${ROOM_ID}`, connectedAt, connectionId },
    })
  } catch (err) {
    return Responses({ statusCode: 400, body: { message: 'there was an error leaving the room' } })
  }
}
