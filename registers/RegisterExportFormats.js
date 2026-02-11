module.exports = (nm, itemTransformer) => {
  nm.registerExportFormat({
    id: 'craftengine',
    name: 'CraftEngine Format',

    // Transform function - handles all item types
    transform: (item, context) => {
      // Let the transformer handle all types
      return itemTransformer.transform(item, context);
    },

    // File structure configuration
    files: {
      perNamespace: true,
      output: 'resources/{projectId}/configuration/{namespace}.yml',

      // Assets organized by item type
      assets: ({ item, assetType, assetName, projectId, namespace, folder }) => {
        // assetType is either 'texture' or 'model'
        if (assetType === 'texture') {
          return `resources/${projectId}/resourcepack/assets/${namespace}/textures/${item.type}/${assetName}`;
        } else if (assetType === 'model') {
          return `resources/${projectId}/resourcepack/assets/${namespace}/models/${item.type}/${assetName}`;
        }

        // Fallback
        return `resources/${projectId}/resourcepack/assets/${namespace}/${assetType}s/${item.type}/${assetName}`;
      },
    },

    // Lifecycle hooks
    hooks: {
      // No filtering - export everything
      canExport: () => true,

      // Finalize hook - reorganize by category
      finalize: (allTransformedItems) => {
        const result = {};
        
        // allTransformedItems is a flat object with item ids as keys
        // Each item has _category, _namespace, _id metadata
        if (allTransformedItems && typeof allTransformedItems === 'object') {
          for (const [itemId, itemData] of Object.entries(allTransformedItems)) {
            if (!itemData || typeof itemData !== 'object') continue;
            
            // Get metadata
            const category = itemData._category || 'items';
            const namespace = itemData._namespace || 'unknown';
            const id = itemData._id || itemId;
            
            // Remove all metadata before writing
            const cleanData = { ...itemData };
            delete cleanData._category;
            delete cleanData._namespace;
            delete cleanData._id;
            delete cleanData._type;
            delete cleanData._subtype;
            
            // Initialize category if needed
            if (!result[category]) {
              result[category] = {};
            }
            
            // Add item with namespace:id key
            const fullKey = `${namespace}:${id}`;
            result[category][fullKey] = cleanData;
          }
        }
        
        return result;
      },
    },
  });
};
