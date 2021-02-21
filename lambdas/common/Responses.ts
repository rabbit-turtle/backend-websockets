export interface CustomResponse {
  statusCode: number
  body: string | object
}

export const Responses = ({ statusCode, body }: CustomResponse) => {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Origin': '*',
    },
    statusCode,
    body: JSON.stringify(body),
  }
}
