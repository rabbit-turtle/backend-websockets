const Responses = ({ statusCode, body }: { statusCode: number; body: object }) => {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: statusCode,
    body: JSON.stringify(body),
  }
}

export default Responses
