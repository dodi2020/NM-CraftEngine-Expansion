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
        // Organize by item.type first, then by subtype for better structure

        // Block assets
        if (item.type === 'block' || item.subtype === 'block') {
          return `resources/${projectId}/assets/${namespace}/${assetType}s/blocks/${assetName}`;
        }

        // Furniture assets
        if (item.type === 'furniture' || item.subtype === 'furniture') {
          return `resources/${projectId}/assets/${namespace}/${assetType}s/furniture/${assetName}`;
        }

        // Item assets organized by subtype
        if (item.subtype === 'weapon') {
          return `resources/${projectId}/assets/${namespace}/${assetType}s/weapons/${assetName}`;
        }

        if (item.subtype === 'tool') {
          return `resources/${projectId}/assets/${namespace}/${assetType}s/tools/${assetName}`;
        }

        if (item.subtype === 'armor') {
          return `resources/${projectId}/assets/${namespace}/${assetType}s/armor/${assetName}`;
        }

        if (item.subtype === 'food') {
          return `resources/${projectId}/assets/${namespace}/${assetType}s/food/${assetName}`;
        }

        // Default: general items
        return `resources/${projectId}/assets/${namespace}/${assetType}s/items/${assetName}`;
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
