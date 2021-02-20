import { APIGatewayEvent } from 'aws-lambda'
import Dynamo from './common/Dynamo'
import { handlerWrapper } from './common/handlerWrapper'

export const handler = handlerWrapper(async (event: APIGatewayEvent) => {
  const { connectedAt, connectionId } = event.requestContext
  const { ROOM_ID } = JSON.parse(event.body as string)

  await Dynamo.delete({
    ROOM_ID,
    connectionId: connectionId as string,
    TableName: process.env.tableName as string,
  })

  return {
    statusCode: 200,
    body: { message: `left the room ${ROOM_ID}`, connectedAt, connectionId },
  }
})
