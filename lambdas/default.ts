import { APIGatewayProxyHandler, APIGatewayEvent } from 'aws-lambda'
import { Responses } from './common/Responses'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  const { connectedAt, connectionId } = event.requestContext
  return Responses({
    statusCode: 200,
    body: { message: 'default socket handler', connectedAt, connectionId },
  })
}
