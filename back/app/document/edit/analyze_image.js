exports.createConsumer = (client, channel) => {
  const queue = 'analyze_image_result';
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
        let image_tags = doc.image_tags;
        if (!image_tags) {
          image_tags = value;
        } else {
          image_tags = Array.from(new Set(image_tags.concat(value)));
        }
        await client.update({
          index: 'documents',
          id,
          body: {
            doc: { image_tags }
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