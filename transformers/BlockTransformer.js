/**
 * Block Transformer for CraftEngine Format
 */

module.exports.transform = (item, context) => {
    const BlockKey = `${item.namespace}:${item.id}`;
    const assetsPath = `${item.namespace}:${item.type}/${item.id}`;


    // Helper to process lore string with line breaks
    const getLore = () => {
        const loreModule = item.modules?.craftengine_lore;
        if (typeof loreModule === 'string') {
            return loreModule.split('|').map(line => line.trim());
        }
        return loreModule;
    };

    // Clean up null/undefined values from an object
    const cleanObject = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;

        const cleaned = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value !== undefined && value !== null && value !== '') {
                if (typeof value === 'object' && !Array.isArray(value)) {
                    const cleanedNested = cleanObject(value);
                    if (Object.keys(cleanedNested).length > 0) {
                        cleaned[key] = cleanedNested;
                    }
                } else if (Array.isArray(value) && value.length > 0) {
                    cleaned[key] = value;
                } else if (typeof value !== 'object') {
                    cleaned[key] = value;
                }
            }
        }
        return cleaned;
    };

    // Helper to parse PDC data (YAML string to object)
    const getPdcData = () => {
        const pdcModule = item.modules?.craftengine_pdc;
        if (pdcModule && typeof pdcModule === 'string') {
            return pdcModule;
        }
        return null;
    };

    // Helper to parse custom components (YAML string)
    const getCustomComponents = () => {
        const componentsModule = item.modules?.craftengine_customComponents;
        if (componentsModule && typeof componentsModule === 'string') {
            return componentsModule;
        }
        return null;
    };

    // Helper to parse remove-components list
    const getRemoveComponents = () => {
        const removeModule = item.modules?.craftengine_removeComponents;
        if (removeModule && typeof removeModule === 'string') {
            return removeModule.split(/[,\n]/).map(c => c.trim()).filter(c => c);
        }
        return null;
    };

    const transformer = {
        // Material for blocks (what vanilla block to use as base)
        material: (item.modules?.baseMaterial || 'note_block').toLowerCase(),

        // Data components
        data: cleanObject({
            'item-name': item.modules?.craftengine_itemName || item.name,
            'custom-name': item.modules?.craftengine_customName,
            'lore': getLore(),
            'overwritable-lore': item.modules?.craftengine_overwritableLore,
            'overwritable-item-name': item.modules?.craftengine_overwritableItemName,
            'custom-model-data': item.modules?.craftengine_customModelData || item.modules?.customModelData,
            'hide-tooltip': item.modules?.craftengine_hideTooltip,
            'block-state': item.modules?.craftengine_blockState,
            'pdc': getPdcData(),
            'nbt': item.modules?.craftengine_nbt,
            'components': getCustomComponents(),
            'remove-components': getRemoveComponents(),
        }),

        // Block-specific settings
        settings: cleanObject({
            // Block properties
            'hardness': item.modules?.craftengine_hardness || item.modules?.['block-hardness'],
            'resistance': item.modules?.craftengine_resistance || item.modules?.['block-explosion-resistance'],
            'is-randomly-ticking': item.modules?.craftengine_isRandomlyTicking,
            'push-reaction': item.modules?.craftengine_pushReaction,
            'map-color': item.modules?.craftengine_mapColor,
            'burnable': item.modules?.craftengine_burnable || item.modules?.['block-flammable'],
            'fire-spread-chance': item.modules?.craftengine_fireSpreadChance,
            'burn-chance': item.modules?.craftengine_burnChance,
            'item': item.modules?.craftengine_item,
            'replaceable': item.modules?.craftengine_replaceable,
            'is-redstone-conductor': item.modules?.craftengine_isRedstoneConductor,
            'is-suffocating': item.modules?.craftengine_isSuffocating,
            'is-view-blocking': item.modules?.craftengine_isViewBlocking,
            'sounds': item.modules?.craftengine_sounds || item.modules?.['block-sounds'],
            'require-correct-tools': item.modules?.craftengine_requireCorrectTools,
            'respect-tool-component': item.modules?.craftengine_respectToolComponent,
            'correct-tools': item.modules?.craftengine_correctTools || item.modules?.['block-mining-tool'],
            'incorrect-tool-dig-speed': item.modules?.craftengine_incorrectToolDigSpeed,
            'tags': item.modules?.craftengine_tags,
            'client-bound-tags': item.modules?.craftengine_clientBoundTags,
            'instrument': item.modules?.craftengine_instrument,
            'fluid-state': item.modules?.craftengine_fluidState || item.modules?.['block-waterloggable'],
            'support-shape': item.modules?.craftengine_supportShape,
            'friction': item.modules?.craftengine_friction,
            'jump-factor': item.modules?.craftengine_jumpFactor,
            'speed-factor': item.modules?.craftengine_speedFactor,
            'luminance': item.modules?.craftengine_luminance || item.modules?.['block-light-emission'],
            'can-occlude': item.modules?.craftengine_canOcclude,
            'block-light': item.modules?.craftengine_blockLight,
            'propagate-skylight': item.modules?.craftengine_propagateSkylight,
            'client-bound-material': item.modules?.craftengine_clientBoundMaterial,
            'client-bound-data-components': item.modules?.craftengine_clientBoundDataComponents,
        }),

        // Model configuration for blocks
        model: {
            type: 'minecraft:model',
            path: assetsPath,
            generation: {
                parent: 'block/cube_all',
                textures: {
                    'all': assetsPath,
                }
            }
        }
    };

    // Clean up empty sections
    if (Object.keys(transformer.data).length === 0) {
        delete transformer.data;
    }
    if (Object.keys(transformer.settings).length === 0) {
        delete transformer.settings;
    }

    // Wrap in "blocks:" category
    return {
        blocks: {
            [BlockKey]: transformer
        }
    };
};
