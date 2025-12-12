module.exports = (nm, itemTransformer) => {
  nm.registerExportFormat({
    id: 'craftengine',
    name: 'CraftEngine Format',
    
    transform: (item, context) => {
      if (['item', 'weapon', 'food'].includes(item.type)) {
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
};
