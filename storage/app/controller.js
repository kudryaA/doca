const fs = require('fs');
const { generate } = require('./path_generator');
const { Authorization } = require('./authorization');

exports.createController = (app, configuration) => {

  app.post('/storage/file', (req, res) => {
    const password = req.query.password;
    new Authorization(password, configuration).auth()
      .then(() => {
        const file = req.files.file;
        if (file) {
          const path = generate('files', configuration);
          file.mv(path.pathAbsolute, (err) => {
            if (err) {
              const comment = `error in storage file ${err}`;
              res.send({ status: false, comment });
            } else {
              res.send({ status: true, path: path.pathRelative });
            }
          });
        } else {
          res.send({ status: false, comment: 'File is empty' });
        }
      }, () => {
        res.send({ status: false, comment: 'Authorization error' });
      });
  });

  app.all('/download/:date/:type/:id', (req, res) => {
    const url = `/${req.params.date}/${req.params.type}/${req.params.id}`;
    const path = `${__dirname}/storage${url}`;
    res.sendFile(path);
  });

}