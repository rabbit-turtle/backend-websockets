# Websocket Server (AWS Serverless)

앱의 확장성을 고려해서 소켓통신을 위한 웹소켓 서버를 AWS Serverless 서비스를 사용해서 구현

## Technical Stacks

- AWS API Gateway (Websocket API)
- AWS Lambda
- DynamoDB
- TypeScript
- Serverless Framework

## Lambda Functions

- 1:1 채팅 기능을 위한 함수들
- 각각의 함수는 연결된 소켓에 대해 payload(JSON Type)의 **action** 키 값으로 인해 라우팅 됨
- 아래 예시와 같이 JSON 형태에 정해진 Key 값들을 보내야 Lambda 함수가 정상적으로 호출 됨
- 하드코딩 된 **action** 키 값은 그대로 사용하면 되고, 나머지 키 값들은 변하는 값을 ($type) 으로 기록 해 둠

### enterRoom

- 채팅 방 입장

> payload: JSON

```js
{
  "ROOM_ID": $string
  "action": "enterRoom"
}
```

### leaveRoom

- 채팅 방 나가기

> payload: JSON

```js
{
  "ROOM_ID": $string
  "action": "leaveRoom"
}
```

### sendMessage

- 같은 채팅방에 1:1 로 연결되어 있는 유저에게 메세지 보내기

> payload: JSON

```js
{
  "ROOM_ID": $string
  "message": $string
  "action": "sendMessage"
}
```
