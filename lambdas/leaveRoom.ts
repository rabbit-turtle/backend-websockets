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

    return Responses._200({ message: `left the room ${ROOM_ID}`, connectedAt, connectionId })
  } catch (err) {
    return Responses._400({ message: 'there was an error leaving the room' })
  }
}
