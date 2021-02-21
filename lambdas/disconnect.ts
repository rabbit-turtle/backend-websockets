import { APIGatewayProxyHandler, APIGatewayEvent } from 'aws-lambda'
import Dynamo from './common/Dynamo'
import { handlerWrapper } from './common/handlerWrapper'

export const handler = handlerWrapper(async (event: APIGatewayEvent) => {
  const { connectedAt, connectionId } = event.requestContext
  const TableName = process.env.tableName as string

  const sessions = await Dynamo.getUsersByClientId({
    connectionId: connectionId as string,
    TableName,
  })

  await Promise.all(
    sessions.map(({ connectionId, ROOM_ID }) =>
      Dynamo.delete({
        TableName,
        connectionId,
        ROOM_ID,
      })
    )
  )

  return { statusCode: 200, body: { message: 'deleted', connectedAt, connectionId } }
})
