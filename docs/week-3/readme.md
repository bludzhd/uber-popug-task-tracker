# Неделя 3

Я ничего не сделала из третьей недели, доделываю вторую, долго все делаю - въезжаю и пишу код. Я еще в материал второй 
недели до конца не врубилась. Долго поднимала кафку с зукипером.

Пока что я добилась того чтобы событие отправилось и прочиталось

```shell
popug-task-tracker                  | Consumer | Message received: {
popug-task-tracker                  |   topic: 'user-topic',
popug-task-tracker                  |   value: '065eee4c9be78235150b3d3a8(regenerate@gmail.com\x04',
popug-task-tracker                  |   offset: 2,
popug-task-tracker                  |   partition: 0,
popug-task-tracker                  |   highWaterOffset: 3,
popug-task-tracker                  |   key: null,
popug-task-tracker                  |   timestamp: 2024-03-11T11:02:33.488Z
popug-task-tracker                  | }
popug-task-tracker                  | Consumer | Decoded Message: object V1 {
popug-task-tracker                  |   id: '65eee4c9be78235150b3d3a8',
popug-task-tracker                  |   email: 'regenerate@gmail.com',
popug-task-tracker                  |   role: 'EMPLOYEE'
popug-task-tracker                  | }
```

- [x] Формат сериализации данных и схемы - выбрала avro, сделала пока сериализацию в месте отправки события, но в формате не учитывающем версионирование, просто чтобы проверить связку (данные пока не проходят валидацию)
