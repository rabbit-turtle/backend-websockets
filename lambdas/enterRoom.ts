import { APIGatewayProxyHandler, APIGatewayEvent } from 'aws-lambda'
import Responses from './common/Responses'
import Dynamo from './common/Dynamo'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  const { connectedAt, connectionId } = event.requestContext
  const { ROOM_ID } = JSON.parse(event.body as string)

  try {
    await Dynamo.write({
      ROOM_ID,
      TableName: process.env.tableName as string,
      connectionId: connectionId as string,
      connectedAt: new Date(connectedAt as number).toISOString(),
    })

    return Responses({
      statusCode: 200,
      body: { message: `entered the room ${ROOM_ID}`, connectedAt, connectionId },
    })
  } catch (err) {
    return Responses({ statusCode: 400, body: { message: 'there was an error entering the room' } })
  }
}
