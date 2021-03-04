import { ApiGatewayManagementApi } from 'aws-sdk'

interface SendToClientInput {
  domainName: string
  stage: string
  ConnectionId: string
  message: string
  messageType: string
}

export default class SocketHandler {
  static sendToClient(input: SendToClientInput) {
    const { domainName, stage, ConnectionId, message, messageType } = input

    const endpoint = `${domainName}/${stage}`
    const apiGatewayManager = new ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint,
    })

    return apiGatewayManager
      .postToConnection({ Data: JSON.stringify({ message, messageType }), ConnectionId })
      .promise()
  }
}
