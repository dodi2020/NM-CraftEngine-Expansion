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

      // Assets organized by item type and subtype
      assets: ({ item, assetType, assetName, projectId, namespace }) => {
        // assetType is either 'texture' or 'model'
        // Organize by item.type first, then by subtype for better structure

        // Block assets
        if (item.type === 'block' || item.subtype === 'block') {
          if (assetType === 'texture') {
            return `resources/${projectId}/resourcepack/assets/${namespace}/textures/${item.type}/${assetName}`;
          } else if (assetType === 'model') {
            return `resources/${projectId}/resourcepack/assets/${namespace}/models/${item.type}/${assetName}`;
          }
        }

        // Furniture assets
        if (item.type === 'furniture' || item.subtype === 'furniture') {
          if (assetType === 'texture') {
            return `resources/${projectId}/resourcepack/assets/${namespace}/textures/${item.type}/${assetName}`;
          } else if (assetType === 'model') {
            return `resources/${projectId}/resourcepack/assets/${namespace}/models/${item.type}/${assetName}`;
          }
        }

        // Item assets organized by subtype
        if (item.subtype === 'armor') {
          if (assetType === 'texture') {
            return `resources/${projectId}/resourcepack/assets/${namespace}/textures/${item.type}/${assetName}`;
          } else if (assetType === 'model') {
            return `resources/${projectId}/resourcepack/assets/${namespace}/models/${item.type}/${assetName}`;
          }
        }

        if (item.subtype === 'food') {
          if (assetType === 'texture') {
            return `resources/${projectId}/resourcepack/assets/${namespace}/textures/${item.type}/${assetName}`;
          } else if (assetType === 'model') {
            return `resources/${projectId}/resourcepack/assets/${namespace}/models/${item.type}/${assetName}`;
          }
        }

        // Default: general items
        if (assetType === 'texture') {
          return `resources/${projectId}/resourcepack/assets/${namespace}/textures/${item.type}/${assetName}`;
        } else if (assetType === 'model') {
          return `resources/${projectId}/resourcepack/assets/${namespace}/models/${item.type}/${assetName}`;
        }

        // Fallback for any edge cases
        return `resources/${projectId}/resourcepack/assets/${namespace}/${assetType}/${item.type}/${assetName}`;
      },
    },

    // Lifecycle hooks
    hooks: {
      // Filter function - return false to skip items
      canExport: (item) => {
        // Export all items by default
        // You can add filtering logic here if needed
        return true;
      },

      // beforeExport: can be used to modify data before writing
      // afterExport: can be used for logging or post-processing
    },
  });
};
