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
      output: 'resources/{projectId}/configuration/{folder}/{namespace}.yml',

      // Assets organized by item type and subtype
      assets: ({ item, assetType, assetName, projectId, namespace }) => {
        // assetType is either 'texture' or 'model'
        // Organize by item.type first, then by subtype for better structure

        // Block assets
        if (item.type === 'block' || item.subtype === 'block') {
          if (assetType === 'texture') {
            return `resources/${projectId}/assets/${namespace}/textures/blocks/${assetName}`;
          } else if (assetType === 'model') {
            return `resources/${projectId}/assets/${namespace}/models/blocks/${assetName}`;
          }
        }

        // Furniture assets
        if (item.type === 'furniture' || item.subtype === 'furniture') {
          if (assetType === 'texture') {
            return `resources/${projectId}/assets/${namespace}/textures/furniture/${assetName}`;
          } else if (assetType === 'model') {
            return `resources/${projectId}/assets/${namespace}/models/furniture/${assetName}`;
          }
        }

        // Item assets organized by subtype
        if (item.subtype === 'weapon') {
          if (assetType === 'texture') {
            return `resources/${projectId}/assets/${namespace}/textures/weapons/${assetName}`;
          } else if (assetType === 'model') {
            return `resources/${projectId}/assets/${namespace}/models/weapons/${assetName}`;
          }
        }

        if (item.subtype === 'tool') {
          if (assetType === 'texture') {
            return `resources/${projectId}/assets/${namespace}/textures/tools/${assetName}`;
          } else if (assetType === 'model') {
            return `resources/${projectId}/assets/${namespace}/models/tools/${assetName}`;
          }
        }

        if (item.subtype === 'armor') {
          if (assetType === 'texture') {
            return `resources/${projectId}/assets/${namespace}/textures/armor/${assetName}`;
          } else if (assetType === 'model') {
            return `resources/${projectId}/assets/${namespace}/models/armor/${assetName}`;
          }
        }

        if (item.subtype === 'food') {
          if (assetType === 'texture') {
            return `resources/${projectId}/assets/${namespace}/textures/food/${assetName}`;
          } else if (assetType === 'model') {
            return `resources/${projectId}/assets/${namespace}/models/food/${assetName}`;
          }
        }

        // Default: general items
        if (assetType === 'texture') {
          return `resources/${projectId}/assets/${namespace}/textures/items/${assetName}`;
        } else if (assetType === 'model') {
          return `resources/${projectId}/assets/${namespace}/models/items/${assetName}`;
        }

        // Fallback for any edge cases
        return `resources/${projectId}/assets/${namespace}/${assetType}s/${assetName}`;
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
