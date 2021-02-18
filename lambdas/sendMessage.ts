import { APIGatewayProxyHandler, APIGatewayEvent } from 'aws-lambda'
import Responses from './common/Responses'
import Dynamo from './common/Dynamo'
import SocketHandler from './common/SocketHandler'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  const { connectedAt, connectionId, stage, domainName } = event.requestContext
  const { ROOM_ID, message } = JSON.parse(event.body as string)

  try {
    const users = await Dynamo.getUsersByRoomID({
      ROOM_ID,
      TableName: process.env.tableName as string,
    })

    const [peerUser] = users.filter(({ connectionId: foundUserId }) => foundUserId !== connectionId)

    await SocketHandler.sendToClient({
      message: message as string,
      ConnectionId: peerUser.connectionId,
      stage,
      domainName: domainName as string,
    })

    return Responses({ statusCode: 200, body: { message: 'sent', connectedAt, connectionId } })
  } catch (err) {
    console.log(err)
    return Responses({ statusCode: 400, body: { message: 'sendMessage failed', connectedAt } })
  }
}
