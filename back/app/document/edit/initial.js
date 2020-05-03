exports.createConsumer = (client, channel) => {
  const queue = 'create_document';
  channel.assertQueue(queue, {
    durable: true
  });
  channel.consume(queue, async (msg) => {
    const textMessage = msg.content.toString();
    try {
      const message = JSON.parse(textMessage);
      const { id, name, url, about } = message;
      const findExists = (await client.search({
        index: 'documents',
        body: {
          query: {
            term: {
              'id.keyword': {
                value: id
              }
            }
          }
        }
      })).hits.total.value;
      if (findExists == 0){
        await client.index({
          index: 'documents',
          type: '_doc',
          id,
          body: {
            id, url, about, name,
            time: new Date()
          }
        });
      } 
    } catch (e) {
      console.log(`Error in mdb consumer with detail ${e}`);
    }
  }, {
    noAck: true
  });
}
