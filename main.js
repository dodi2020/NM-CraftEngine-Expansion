module.exports.init = async () => {
  const nm = api.nexomaker;

  // SIMPLIFIED API - No more normalization needed!
  // The system auto-normalizes items for you, giving you:
  // - item.id, item.name, item.type, item.namespace
  // - item.modules (flat object of all module values)
  // - item.textures, item.models (arrays)

  nm.registerExportFormat({
    id: 'CraftEngine',
    name: 'CraftEngine Format',
    
    // Simple transform function - receives normalized item, returns your format
    transform: (item) => {
      const ItemKey = `${item.namespace}:${item.id}`;
      
      return {

        [ItemKey]: {

          material: (item.modules?.baseMaterial || `PAPER`).toLowerCase(),
          settings: {
            //I need a lot of custom modules later.
            //https://xiao-momi.github.io/craft-engine-wiki/configuration/item/settings
            unbreakable: item.modules?.unbreakable,
            enchanenchantable: item.modules?.disableEnchanting === true ? false : true,

            food: {
              nutrition: item.modules?.nutrition,
              saturation: item.modules?.saturation,
            }
          
          },
          data: {
            "item-name": item.name,
            lore: item.modules?.lore,
          },


      },
      };
    },
    
    // Simplified file structure
    files: {
      perNamespace: true,
      output: 'resources/{projectId}/configuration/{folder}/{namespace}.yml',
      assets: 'resources/{projectId}/resourcepack/assets/{namespace}/{asset}',
    },
    
    // Optional: Custom export logic
    hooks: {
      canExport: (item) => true,
      
      finalize: (allTransformedItems) => {
        const finalOutput = {
          items: {}
        };

        return finalOutput;
      },
      
      beforeExport: (item, transformed) => {
        api.console.log(`Exporting ${item.name}`);
        return transformed;
      },
    },
  });

  api.console.log('✅ CraftEngine format registered (Simple API)');
};

module.exports.metadata = {
  id: 'craftengine_expansion',
  version: '0.0.1-Alpha',
  author: 'TamashiiMon',
};