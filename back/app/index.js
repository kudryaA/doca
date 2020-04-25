const Hapi = require('@hapi/hapi');
const amqp = require('amqplib/callback_api');
const elasticsearch = require('elasticsearch');
const initialDocument = require('./document/edit/initial');
const analyzeText = require('./document/edit/analyze_text');
const analyzeImage = require('./document/edit/analyze_image');


const init = async () => {

  const server = Hapi.server({
    port: 6002,
    host: 'localhost'
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);

  amqp.connect(`amqp://localhost`,
    async (error0, connection) => {
      if (error0) {
        throw error0;
      }
      connection.createChannel(async (error1, channel) => {
        if (error1) {
          throw error1;
        }
        const client = new elasticsearch.Client({
          host: 'https://admin:admin@0.0.0.0:9200',
          port: 9200,
          protocol: 'https',
          username: 'admin:admin',
          log: 'trace',
          apiVersion: '7.6'
        });
        await initialDocument.createConsumer(client, channel);
        await analyzeImage.createConsumer(client, channel);
        await analyzeText.createConsumer(client, channel);
      });
    });
};

init();