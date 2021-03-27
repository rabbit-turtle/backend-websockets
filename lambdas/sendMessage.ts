import { APIGatewayEvent } from 'aws-lambda'
import Dynamo from './common/Dynamo'
import SocketHandler from './common/SocketHandler'
import { handlerWrapper } from './common/handlerWrapper'

interface ICoords {
  latitude: number
  longitude: number
}

export interface sendMessageInput {
  id: string
  user_id: string
  ROOM_ID: string
  message: string | ICoords
  messageType: string
  created_at: string
}

export const handler = handlerWrapper(async (event: APIGatewayEvent) => {
  const { connectedAt, connectionId, stage, domainName } = event.requestContext
  const { id, user_id, ROOM_ID, message, messageType, created_at }: sendMessageInput = JSON.parse(
    event.body as string
  )

  const connectedDevices = await Dynamo.getUsersByRoomID({
    ROOM_ID,
    TableName: process.env.tableName as string,
  })

  const devices = connectedDevices.filter(
    ({ connectionId: foundUserId }) => foundUserId !== connectionId
  )

  await Promise.all(
    devices.map(({ connectionId }) =>
      SocketHandler.sendToClient({
        payload: { id, user_id, ROOM_ID, message, messageType, created_at },
        ConnectionId: connectionId,
        stage,
        domainName: domainName as string,
      })
    )
  )

  return { statusCode: 200, body: { message: 'sent', connectedAt, connectionId } }
})
