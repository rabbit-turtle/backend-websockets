import { APIGatewayProxyHandler, APIGatewayEvent, Context } from 'aws-lambda'
import { Responses, CustomResponse } from './Responses'

export type CustomLambdaHandler<TResult = CustomResponse> = (
  event: APIGatewayEvent
) => Promise<TResult>

export const handlerWrapper = (handler: CustomLambdaHandler): APIGatewayProxyHandler => async (
  event: APIGatewayEvent,
  context: Context
) => {
  try {
    const { statusCode, body } = await handler(event)
    return Responses({ statusCode, body })
  } catch (err) {
    console.log(err)
    return Responses({ statusCode: 400, body: err })
  }
}
