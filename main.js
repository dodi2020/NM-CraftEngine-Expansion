module.exports.init = async () => {
  const nm = api.nexomaker;

  // SIMPLIFIED API - No more normalization needed!
  // The system auto-normalizes items for you, giving you:
  // - item.id, item.name, item.type, item.namespace
  // - item.modules (flat object of all module values)
  // - item.textures, item.models (arrays)

  const itemTransformer = api.require("./transformers/item.js");
  
  // TODO: Add all needed modules for CraftEngine.
  // const itemModules = api.require("./modules/item.js")

  // itemModules.regiter(nm);

  nm.registerExportFormat({
    id: 'CraftEngine',
    name: 'CraftEngine Format',
    
    // Simple transform function - receives normalized item, returns your format
    transform: (item, context) => {
      if (item.type === 'entity') {
        return null;
      }
      if (item.type === 'block') {
        return null;
      }
      if (item.type === 'furniture') {
        return null;
      }
      return itemTransformer.transform(item, context);
    },
        
    // Simplified file structure
    files: {
      perNamespace: true,
      output: 'resources/{projectId}/configuration/{folder}/{namespace}.yml',

      assets: (context) => {
        const { item, assetType, assetName, projectId, namespace, folder } = context;

        // Example: Organize blocks and items differently
        if (item.type === 'item') {
          if (assetType === 'model') {
            return 'resources/${projectId}/resourcepack/assets/${projectId}/models/item/${folder}/${assetName}';
          } else if (assetType === 'texture') {
            return 'resources/${projectId}/resourcepack/assets/${projectId}/texture/item/${folder}/${assetName}';
          }
        }

        if (item.type === 'block') {
          if (assetType === 'model') {
            return 'resources/${projectId}/resourcepack/assets/${projectId}/models/block/${folder}/${assetName}';
          } else if (assetType === 'texture') {
            return 'resources/${projectId}/resourcepack/assets/${projectId}/texture/block/${folder}/${assetName}';
          }
        }

        if (item.type === "entity") {
          return null;  // Entities don't have assets in this example
        }
        return 'resources/${projectId}/resourcepack/assets/${projectId}/${assetType}/${assetName}';

      }
    },
    
    // Optional: Custom export logic
    hooks: {
      canExport: (item) => true,
      
      finalize: (allTransformedItems) => {
        // Wrap all items under "items" key
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