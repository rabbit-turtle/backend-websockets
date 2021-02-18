import { DynamoDB } from 'aws-sdk'

const dynamoClient = new DynamoDB.DocumentClient()

interface DynamoDefaultInfo {
  ROOM_ID: string
  TableName: string
  connectedAt?: string
}

interface UserConnectionInfo {
  TableName: string
  connectionId: string
}

interface UserInput extends DynamoDefaultInfo {
  connectionId: string
}

interface UserSession {
  ROOM_ID: string
  connectionId: string
  createdAt: string
}

export default class Dynamo {
  static async getUsersByRoomID(dynamoInfo: DynamoDefaultInfo) {
    const { ROOM_ID, TableName } = dynamoInfo

    const queried = await dynamoClient
      .query({
        TableName,
        KeyConditionExpression: '#ROOM_ID = :ROOM_ID',
        ExpressionAttributeNames: {
          '#ROOM_ID': 'ROOM_ID',
        },
        ExpressionAttributeValues: {
          ':ROOM_ID': ROOM_ID,
        },
      })
      .promise()

    if (!queried || !queried.Items?.length) {
      throw Error('ROOM ID DOES NOT EXIST')
    }

    return queried.Items as UserSession[]
  }

  static async getUsersByClientId(connectionInfo: UserConnectionInfo) {
    const { TableName, connectionId } = connectionInfo

    const quried = await dynamoClient
      .query({
        TableName,
        IndexName: 'ConnectionIdIndex',
        KeyConditionExpression: '#connectionId = :connectionId',
        ExpressionAttributeNames: {
          '#connectionId': 'connectionId',
        },
        ExpressionAttributeValues: {
          ':connectionId': connectionId,
        },
      })
      .promise()

    if (!quried || !quried.Items?.length) {
      throw Error('connectionId DOES NOT EXIST')
    }

    return quried.Items as UserSession[]
  }

  static async write(writeInput: UserInput) {
    const { ROOM_ID, TableName, connectionId, connectedAt } = writeInput

    const res = await dynamoClient
      .put({ TableName, Item: { ROOM_ID, connectionId, connectedAt } })
      .promise()

    if (!res) {
      throw Error(`Error occurred during writing ${ROOM_ID} in table ${TableName}`)
    }

    return writeInput
  }

  static async delete(deleteInput: UserInput) {
    const { ROOM_ID, connectionId, TableName } = deleteInput

    const res = await dynamoClient.delete({ TableName, Key: { ROOM_ID, connectionId } }).promise()

    if (!res) {
      throw Error(`Error occurred during deleting ${ROOM_ID} in table ${TableName}`)
    }

    return `${ROOM_ID} deleted`
  }
}
