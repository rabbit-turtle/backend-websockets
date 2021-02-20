import { ApiGatewayManagementApi } from 'aws-sdk'

interface SendToClientInput {
  domainName: string
  stage: string
  ConnectionId: string
  message: string
}

export default class SocketHandler {
  static sendToClient(input: SendToClientInput) {
    const { domainName, stage, ConnectionId, message } = input

    const endpoint = `${domainName}/${stage}`
    const apiGatewayManager = new ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint,
    })

    return apiGatewayManager.postToConnection({ Data: message, ConnectionId }).promise()
  }
}
