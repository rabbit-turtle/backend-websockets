import { APIGatewayProxyHandler, APIGatewayEvent } from 'aws-lambda'
import Responses from './common/Responses'
import Dynamo from './common/Dynamo'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  const { connectedAt, connectionId } = event.requestContext
  const TableName = process.env.tableName as string

  try {
    const sessions = await Dynamo.getUsersByClientId({
      connectionId: connectionId as string,
      TableName,
    })

    console.log(sessions)

    await Promise.all(
      sessions.map(({ connectionId, ROOM_ID }) =>
        Dynamo.delete({
          TableName,
          connectionId,
          ROOM_ID,
        })
      )
    )

    return Responses({ statusCode: 200, body: { message: 'deleted', connectedAt, connectionId } })
  } catch (err) {
    console.log(err)
    return Responses({
      statusCode: 400,
      body: { message: 'disconnect failed', connectedAt, connectionId },
    })
  }
}
