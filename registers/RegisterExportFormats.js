module.exports = (nm, itemTransformer) => {
  // Create a cache to accumulate items per namespace
  const accumulators = new Map();

  nm.registerExportFormat({
    id: 'craftengine',
    name: 'CraftEngine Format',
    includeAssets: true,

    // Transform function - handles all item types
    transform: (item, context) => {
      // Get the namespace key for this export batch
      const namespaceKey = `${context.projectId}-${item.namespace}`;

      // Initialize accumulator for this namespace if it doesn't exist
      if (!accumulators.has(namespaceKey)) {
        accumulators.set(namespaceKey, {
          items: {},
          furniture: {},
          blocks: {},
          armor: {}
        });
      }

      const accumulator = accumulators.get(namespaceKey);

      // Transform the item
      const transformed = itemTransformer.transform(item, context);

      // Merge the transformed result into our accumulator
      if (transformed.items) {
        Object.assign(accumulator.items, transformed.items);
      }
      if (transformed.furniture) {
        Object.assign(accumulator.furniture, transformed.furniture);
      }
      if (transformed.blocks) {
        Object.assign(accumulator.blocks, transformed.blocks);
      }
      if (transformed.armor) {
        Object.assign(accumulator.armor, transformed.armor);
      }

      // Return the accumulated result (this will be the final output)
      const result = { ...accumulator };

      // Remove empty categories
      if (Object.keys(result.items).length === 0) delete result.items;
      if (Object.keys(result.furniture).length === 0) delete result.furniture;
      if (Object.keys(result.blocks).length === 0) delete result.blocks;
      if (Object.keys(result.armor).length === 0) delete result.armor;

      return result;
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
      canExport: (item) => {
        return true;
      },

      // This is what transforms the texture paths
      modelProcessor: (modelData, item, context) => {
        const { projectId, namespace } = context;
        
        // Update texture references in the model to match CraftEngine paths
        if (modelData.textures && typeof modelData.textures === 'object') {
          for (const [key, texturePath] of Object.entries(modelData.textures)) {
            // Skip texture references (e.g., "#layer0")
            if (typeof texturePath === 'string' && !texturePath.startsWith('#')) {
              let textureName;
              
              // Check if this is a multi-texture reference (_texture_N suffix)
              const multiTextureMatch = texturePath.match(/_texture_(\d+)$/);
              
              if (multiTextureMatch) {
                // Multi-texture: preserve the _texture_N suffix
                textureName = `${item.id}_texture_${multiTextureMatch[1]}`;
              } else {
                // Single texture: use the item ID
                textureName = item.id;
              }
              
              // Update to CraftEngine format: namespace:type/texture_name
              modelData.textures[key] = `${namespace}:${item.type}/${textureName}`;
            }
          }
        }
        
        return modelData;
      }
    }
  });
};
