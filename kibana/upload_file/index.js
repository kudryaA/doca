import { i18n } from '@kbn/i18n';

import route from './server/routes/route';

export default function(kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'upload_file',
    uiExports: {
      app: {
        title: 'Upload File',
        description: 'Upload file',
        main: 'plugins/upload_file/app',
      },
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    // eslint-disable-next-line no-unused-vars
    init(server, options) {
      const xpackMainPlugin = server.plugins.xpack_main;
      if (xpackMainPlugin) {
        const featureId = 'upload_file';

        xpackMainPlugin.registerFeature({
          id: featureId,
          name: i18n.translate('uploadFile.featureRegistry.featureName', {
            defaultMessage: 'upload_file',
          }),
          navLinkId: featureId,
          icon: 'questionInCircle',
          app: [featureId, 'kibana'],
          catalogue: [],
          privileges: {
            all: {
              api: [],
              savedObject: {
                all: [],
                read: [],
              },
              ui: ['show'],
            },
            read: {
              api: [],
              savedObject: {
                all: [],
                read: [],
              },
              ui: ['show'],
            },
          },
        });
      }

      // Add server routes and initialize the plugin here
      route(server);
    },
  });
}
