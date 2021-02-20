import { APIGatewayEvent } from 'aws-lambda'
import Dynamo from './common/Dynamo'
import { handlerWrapper } from './common/handlerWrapper'

export const handler = handlerWrapper(async (event: APIGatewayEvent) => {
  const { connectedAt, connectionId } = event.requestContext
  const { ROOM_ID } = JSON.parse(event.body as string)

  await Dynamo.write({
    ROOM_ID,
    TableName: process.env.tableName as string,
    connectionId: connectionId as string,
    connectedAt: new Date(connectedAt as number).toISOString(),
  })

  return {
    statusCode: 200,
    body: { message: `entered the room ${ROOM_ID}`, connectedAt, connectionId },
  }
})
