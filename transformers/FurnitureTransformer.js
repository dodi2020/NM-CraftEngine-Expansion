/**
 * Furniture Transformer for CraftEngine Format
 */

module.exports.transform = (item, context) => {
    const FurnitureKey = `${item.namespace}:${item.id}`;
    const assetsPath = `${item.namespace}:furniture/${context.folder}/${item.id}`;

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

    // Helper to parse external plugin data
    const getExternalData = () => {
        if (item.modules?.craftengine_externalPlugin && item.modules?.craftengine_externalId) {
            return {
                plugin: item.modules.craftengine_externalPlugin,
                id: item.modules.craftengine_externalId
            };
        }
        return null;
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
        // Material for furniture items
        material: (item.modules?.baseMaterial || 'paper').toLowerCase(),

        // Data components (for the item representation)
        data: cleanObject({
            'external': getExternalData(),
            'item-name': item.modules?.craftengine_itemName || item.name,
            'custom-name': item.modules?.craftengine_customName,
            'lore': getLore(),
            'overwritable-lore': item.modules?.craftengine_overwritableLore,
            'overwritable-item-name': item.modules?.craftengine_overwritableItemName,
            'custom-model-data': item.modules?.craftengine_customModelData || item.modules?.customModelData,
            'hide-tooltip': item.modules?.craftengine_hideTooltip,
            'pdc': getPdcData(),
            'nbt': item.modules?.craftengine_nbt,
            'components': getCustomComponents(),
            'remove-components': getRemoveComponents(),
        }),

        // Furniture-specific settings
        settings: cleanObject({
            // Display and rendering
            'display-transform': item.modules?.['furniture-display-transform'],

            // Lighting
            'block-light': item.modules?.['furniture-block_light'],
            'sky-light': item.modules?.['furniture-sky_light'],

            // Furniture item reference for creative mode
            'item': item.modules?.craftengine_furnitureItem,

            // Sounds - support both old and new modules
            'sounds': cleanObject({
                'break-sound': item.modules?.craftengine_furnitureSoundBreak || item.modules?.['furniture-block_sounds-break_sound'],
                'place-sound': item.modules?.craftengine_furnitureSoundPlace || item.modules?.['furniture-block_sounds-place_sound'],
                'fall-sound': item.modules?.['furniture-block_sounds-fall_sound'],
                'hit-sound': item.modules?.['furniture-block_sounds-hit_sound'],
                'step-sound': item.modules?.['furniture-block_sounds-step_sound'],
            }),

            // Drops and loot
            'drop-silktouch': item.modules?.['furniture-drop-silktouch'],
            'loot': item.modules?.['furniture-loot'],

            // Hitbox settings
            'hitbox': cleanObject({
                'barrier': item.modules?.['furniture-hitbox-barrier'],
                'interactions': item.modules?.['furniture-hitbox-interactions'],
                'shulkers': item.modules?.['furniture-hitbox-shulkers'],
            }),

            // Placement limitations
            'limited-placing': cleanObject({
                'floor': item.modules?.['furniture-limited_placing-floor'],
                'roof': item.modules?.['furniture-limited_placing-roof'],
                'wall': item.modules?.['furniture-limited_placing-wall'],
                'type': item.modules?.['furniture-limited_placing-type'],
            }),

            // Rotation settings
            'rotatable': item.modules?.['furniture-rotatable'],
            'restricted-rotation': item.modules?.['furniture-restricted-rotation'],
            'tracking-rotation': item.modules?.['furniture-tracking-rotation'],

            // General item settings
            'renameable': item.modules?.craftengine_renameable,
            'keep-on-death-chance': item.modules?.craftengine_keepOnDeathChance,
            'destroy-on-death-chance': item.modules?.craftengine_destroyOnDeathChance,
            'drop-display': item.modules?.craftengine_dropDisplay,
            'glow-color': item.modules?.craftengine_glowColor,
            'client-bound-data-components': item.modules?.craftengine_clientBoundDataComponents,
        }),

        // Model configuration
        model: {
            type: 'minecraft:model',
            path: assetsPath,
            generation: {
                parent: 'item/generated',
                textures: {
                    'layer0': assetsPath,
                }
            }
        }
    };

    // Clean up empty sections
    if (transformer.settings.sounds && Object.keys(transformer.settings.sounds).length === 0) {
        delete transformer.settings.sounds;
    }
    if (transformer.settings.hitbox && Object.keys(transformer.settings.hitbox).length === 0) {
        delete transformer.settings.hitbox;
    }
    if (transformer.settings['limited-placing'] && Object.keys(transformer.settings['limited-placing']).length === 0) {
        delete transformer.settings['limited-placing'];
    }

    if (Object.keys(transformer.data).length === 0) {
        delete transformer.data;
    }
    if (Object.keys(transformer.settings).length === 0) {
        delete transformer.settings;
    }

    // Wrap in "furniture:" category
    return {
        furniture: {
            [FurnitureKey]: transformer
        }
    };
};
