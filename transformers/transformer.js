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
