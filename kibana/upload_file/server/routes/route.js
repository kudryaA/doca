import fetch from 'node-fetch';
import FormData from 'form-data';
import amqp from 'amqplib/callback_api';
import fs from 'fs';

export default function (server) {
  amqp.connect('amqp://rabbitmq', function (error0, connection) {
    connection.createChannel(function (error1, channel) {
      const queue = 'create_document';
      channel.assertQueue(queue, {
        durable: true
      });
      server.route({
        path: '/api/upload_file/upload',
        method: 'POST',
        handler: async (request) => {
          const json = request.payload;
          const formDataStorage = new FormData();
          formDataStorage.append('file', json.file);
          const uploadResult = await ((await fetch('http://storage:6001/storage/file?password=skhgdkhethwekdbdsgbbdg', {
            method: 'POST',
            body: formDataStorage
          })).json());
          if (uploadResult.path) {
            const id = new Date().getTime();
            const obj = {
              id,
              name: json.name,
              about: json.about,
              url: `http://localhost:6001/download${uploadResult.path}`
            }
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(obj)));
            const path = `${new Date().getTime()}.tmp`;
            fs.writeFile(path, json.file, "binary", async (err) => {
              if (err) {
                console.log(err);
              } else {
                const formAnalyze = new FormData();
                formAnalyze.append('value', fs.createReadStream(path));
                const analyzeResult = await((await fetch(`http://analyze_docx:7001/analyze?id=${id}`, {
                  method: 'POST',
                  body: formAnalyze
                })).json());
                console.log(analyzeResult);
                fs.unlinkSync(path);
              }
            });
          }
          return { time: new Date().toISOString() };
        }
      });
    });
  });
}
