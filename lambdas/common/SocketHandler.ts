import { ApiGatewayManagementApi } from 'aws-sdk'

interface SendToClientInput {
  domainName: string
  stage: string
  ConnectionId: string
  payload: { message: string; messageType: string; createdAt: string }
}

export default class SocketHandler {
  static sendToClient(sendToClientData: SendToClientInput) {
    const { domainName, stage, ConnectionId, payload } = sendToClientData

    const endpoint = `${domainName}/${stage}`
    const apiGatewayManager = new ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint,
    })

    return apiGatewayManager
      .postToConnection({ Data: JSON.stringify(payload), ConnectionId })
      .promise()
  }
}
