exports.createConsumer = (client, channel) => {
  const queue = 'analyze_docx_result';
  channel.assertQueue(queue, {
    durable: true
  });
  channel.consume(queue, async (msg) => {
    const textMessage = msg.content.toString();
    try {
      const message = JSON.parse(textMessage);
      const { id } = message;
      setTimeout(async () => {
        await client.update({
          index: 'documents',
          id,
          body: {
            doc: message
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