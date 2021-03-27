import { APIGatewayEvent } from 'aws-lambda'
import Dynamo from './common/Dynamo'
import { handlerWrapper } from './common/handlerWrapper'

export const handler = handlerWrapper(async (event: APIGatewayEvent) => {
  const { connectedAt, connectionId } = event.requestContext
  const TableName = process.env.tableName as string

  const sessions = await Dynamo.getUsersByClientId({
    connectionId: connectionId as string,
    TableName,
  })

  const thisDevice = sessions.find(
    ({ connectionId: thisConnectionId }) => thisConnectionId === connectionId
  )!

  await Dynamo.delete({
    TableName,
    connectionId: thisDevice.connectionId,
    ROOM_ID: thisDevice.ROOM_ID,
  })

  return { statusCode: 200, body: { message: 'deleted', connectedAt, connectionId } }
})
