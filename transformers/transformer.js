/**
 * Main Transformer - Routes items to specialized transformers based on type
 */

const ItemTransformer = require('./ItemTransformer.js');
const BlockTransformer = require('./BlockTransformer.js');
const ArmorTransformer = require('./ArmorTransformer.js');
const FurnitureTransformer = require('./FurnitureTransformer.js');

module.exports.transform = (item, context) => {
    // Route to appropriate transformer based on item type and subtype

    // Block items
    if (item.type === 'block' || item.subtype === 'block') {
        return BlockTransformer.transform(item, context);
    }

    // Armor items
    if (item.type === 'armor' || item.subtype === 'armor') {
        return ArmorTransformer.transform(item, context);
    }

    // Furniture items
    if (item.type === 'furniture' || item.subtype === 'furniture') {
        return FurnitureTransformer.transform(item, context);
    }

    // Default to item transformer for: items, weapons, tools, food
    // Handles: item, weapon, tool, food types
    return ItemTransformer.transform(item, context);
};

/**
 * Untransform - Routes exported data to specialized untransformers based on category
 */
module.exports.untransform = (exportedData, category) => {
    // Route to appropriate untransformer based on the category in the exported YAML
    // category should be one of: 'items', 'blocks', 'armor', 'furniture'
    
    if (category === 'blocks') {
        return BlockTransformer.untransform(exportedData);
    }
    
    if (category === 'armor') {
        return ArmorTransformer.untransform(exportedData);
    }
    
    if (category === 'furniture') {
        return FurnitureTransformer.untransform(exportedData);
    }
    
    // Default to item untransformer (includes armor since armor exports to items category)
    return ItemTransformer.untransform(exportedData);
};
