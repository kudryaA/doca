exports.createConsumer = (client, channel) => {
  const queue = 'analyze_text_result';
  channel.assertQueue(queue, {
    durable: true
  });
  channel.consume(queue, async (msg) => {
    const textMessage = msg.content.toString();
    try {
      const message = JSON.parse(textMessage);
      const { id, value } = message;
      setTimeout(async () => {
        const doc = (await client.get({
          index: 'documents',
          id
        }))._source; 
        let text_tags = doc.text_tags;
        if (!text_tags) {
          text_tags = value;
        } else {
          text_tags = Array.from(new Set(text_tags.concat(value)));
        }
        await client.update({
          index: 'documents',
          id,
          body: {
            doc: { text_tags }
          }
        });
      }, 10000);
    } catch (e) {
      console.log(`Error in mdb consumer with detail ${e}`);
    }
  }, {
    noAck: true
  });
}

/*
 
        
*/