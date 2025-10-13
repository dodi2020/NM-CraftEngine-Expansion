module.exports.init = async () => {
  const nm = api.nexomaker;


  const itemTransformer = api.require("./transformers/item.js");
  
  // TODO: Add all needed modules for CraftEngine.
  // const itemModules = api.require("./modules/item.js")

  // itemModules.regiter(nm);

  nm.registerExportFormat({
    id: 'CraftEngine',
    name: 'CraftEngine Format',
    
    transform: (item, context) => {
      if (item.type === 'item') {
        return itemTransformer.transform(item, context);
      }
      return null;
    },

    files: {
      perNamespace: true,
      output: 'resources/{projectId}/configuration/{folder}/{namespace}.yml',

      assets: (context) => {
        const { item, assetType, assetName, projectId, namespace, folder } = context;

        if (item.type === 'item') {
          if (assetType === 'model') {
            return `resources/${projectId}/resourcepack/assets/${projectId}/models/item/${folder}/${assetName}`;
          } else if (assetType === 'texture') {
            return `resources/${projectId}/resourcepack/assets/${projectId}/texture/item/${folder}/${assetName}`;
          }
        }

        if (item.type === 'block') {
          if (assetType === 'model') {
            return `resources/${projectId}/resourcepack/assets/${projectId}/models/block/${folder}/${assetName}`;
          } else if (assetType === 'texture') {
            return `resources/${projectId}/resourcepack/assets/${projectId}/texture/block/${folder}/${assetName}`;
          }
        }
        return null;

      }
    },
    
    hooks: {
      canExport: (item) => true,
      
      finalize: (allTransformedItems) => {
        return {
          items: allTransformedItems
        };
      },
      
    },
  });

  api.console.log('✅ CraftEngine format registered.');
};

module.exports.metadata = {
  id: 'craftengine_expansion',
  version: '0.0.1-Alpha',
  author: 'TamashiiMon, DeonixxStudio',
};