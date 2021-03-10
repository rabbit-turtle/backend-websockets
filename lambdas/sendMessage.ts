import { APIGatewayEvent } from 'aws-lambda'
import Dynamo from './common/Dynamo'
import SocketHandler from './common/SocketHandler'
import { handlerWrapper } from './common/handlerWrapper'

export const handler = handlerWrapper(async (event: APIGatewayEvent) => {
  const { connectedAt, connectionId, stage, domainName } = event.requestContext
  const { id, ROOM_ID, message, messageType, created_at } = JSON.parse(event.body as string)

  const users = await Dynamo.getUsersByRoomID({
    ROOM_ID,
    TableName: process.env.tableName as string,
  })

  const [peerUser] = users.filter(({ connectionId: foundUserId }) => foundUserId !== connectionId)

  await SocketHandler.sendToClient({
    payload: { id, ROOM_ID, message, messageType, created_at },
    ConnectionId: peerUser.connectionId,
    stage,
    domainName: domainName as string,
  })

  return { statusCode: 200, body: { message: 'sent', connectedAt, connectionId } }
})
