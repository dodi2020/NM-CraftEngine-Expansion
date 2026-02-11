/**
 * Furniture Transformer for CraftEngine Format
 */

module.exports.transform = (item, context) => {
    const FurnitureKey = `${item.namespace}:${item.id}`;
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

    // Helper to parse entity culling (can be boolean or YAML object)
    const getEntityCulling = () => {
        const cullingModule = item.modules?.craftengine_furnitureVariantEntityCulling;
        if (!cullingModule) return null;
        if (typeof cullingModule === 'string') {
            const trimmed = cullingModule.trim().toLowerCase();
            if (trimmed === 'true') return true;
            if (trimmed === 'false') return false;
            // Return as string for YAML parsing by CraftEngine
            return cullingModule;
        }
        return cullingModule;
    };

    // Helper to build model/texture configuration
    const getModelConfig = () => {
        const config = {};

        // Check if user provided custom model(s)
        const customModel = item.modules?.craftengine_model;
        const customModels = item.modules?.craftengine_models;

        if (customModels && Array.isArray(customModels) && customModels.length > 0) {
            // Multiple models provided
            config.models = customModels;
        } else if (customModel && typeof customModel === 'string') {
            // Single model provided
            config.model = customModel;
        }

        // Check if user provided custom texture(s)
        const customTexture = item.modules?.craftengine_texture;
        const customTextures = item.modules?.craftengine_textures;

        if (customTextures && Array.isArray(customTextures) && customTextures.length > 0) {
            // Multiple textures provided
            config.textures = customTextures;
        } else if (customTexture && typeof customTexture === 'string') {
            // Single texture provided
            config.texture = customTexture;
        } else if (!customModel && !customModels) {
            // No custom model or texture, use simplified default texture
            config.texture = `${item.namespace}:${item.type}/${item.id}`;
        }

        return config;
    };

    const transformer = {
        // Material for furniture items
        material: (item.modules?.baseMaterial || 'paper').toLowerCase(),

        // Model configuration - use simplified texture format or custom model/texture
        ...getModelConfig(),

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

        // Furniture variant settings
        variants: cleanObject({
            'default': cleanObject({
                'loot-spawn-offset': item.modules?.craftengine_furnitureVariantLootSpawnOffset,
                'elements': item.modules?.craftengine_furnitureVariantElements,
                'hitboxes': item.modules?.craftengine_furnitureVariantHitboxes,
                'entity-culling': getEntityCulling(),
                'model-engine': item.modules?.craftengine_furnitureVariantModelEngine,
                'better-model': item.modules?.craftengine_furnitureVariantBetterModel,
            })
        }),
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

    // Clean up empty variant default section
    if (transformer.variants && transformer.variants.default && Object.keys(transformer.variants.default).length === 0) {
        delete transformer.variants.default;
    }
    if (transformer.variants && Object.keys(transformer.variants).length === 0) {
        delete transformer.variants;
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

/**
 * Untransform function - converts exported CraftEngine furniture YAML back to internal modules
 */
module.exports.untransform = (exportedData) => {
    const modules = {};
    
    if (!exportedData) return modules;
    
    // Map material
    if (exportedData.material) {
        modules.baseMaterial = exportedData.material;
    }
    
    // Map behavior field (furniture behaviors)
    if (exportedData.behavior && typeof exportedData.behavior === 'object') {
        const behaviorYaml = [];
        for (const [key, value] of Object.entries(exportedData.behavior)) {
            if (typeof value === 'object' && !Array.isArray(value)) {
                behaviorYaml.push(`${key}:`);
                for (const [k, v] of Object.entries(value)) {
                    if (typeof v === 'object' && !Array.isArray(v)) {
                        behaviorYaml.push(`  ${k}:`);
                        for (const [k2, v2] of Object.entries(v)) {
                            behaviorYaml.push(`    ${k2}: ${v2}`);
                        }
                    } else {
                        behaviorYaml.push(`  ${k}: ${v}`);
                    }
                }
            } else {
                behaviorYaml.push(`${key}: ${value}`);
            }
        }
        modules.craftengine_behavior = behaviorYaml.join('\\n');
    }
    
    // Map behaviors field (multiple behaviors array)
    if (exportedData.behaviors && Array.isArray(exportedData.behaviors)) {
        const behaviorsYaml = [];
        exportedData.behaviors.forEach(behavior => {
            behaviorsYaml.push('- type: ' + (behavior.type || 'unknown'));
            for (const [key, value] of Object.entries(behavior)) {
                if (key === 'type') continue;
                if (typeof value === 'object' && !Array.isArray(value)) {
                    behaviorsYaml.push(`  ${key}:`);
                    for (const [k, v] of Object.entries(value)) {
                        behaviorsYaml.push(`    ${k}: ${v}`);
                    }
                } else if (Array.isArray(value)) {
                    behaviorsYaml.push(`  ${key}:`);
                    value.forEach(item => behaviorsYaml.push(`    - ${item}`));
                } else {
                    behaviorsYaml.push(`  ${key}: ${value}`);
                }
            }
        });
        modules.craftengine_behaviors = behaviorsYaml.join('\\n');
    }
    
    // Map model/texture
    if (exportedData.model) modules.craftengine_model = exportedData.model;
    if (exportedData.models) modules.craftengine_models = exportedData.models;
    if (exportedData.texture) modules.craftengine_texture = exportedData.texture;
    if (exportedData.textures) modules.craftengine_textures = exportedData.textures;
    
    // Map furniture data
    if (exportedData.data) {
        const data = exportedData.data;
        
        if (data.external) {
            if (data.external.plugin) modules.craftengine_externalPlugin = data.external.plugin;
            if (data.external.id) modules.craftengine_externalId = data.external.id;
        }
        
        if (data['item-name']) modules.craftengine_itemName = data['item-name'];
        if (data['custom-name']) modules.craftengine_customName = data['custom-name'];
        
        if (data.lore) {
            modules.craftengine_lore = Array.isArray(data.lore) ? data.lore.join('|') : data.lore;
        }
        
        if (data['overwritable-lore'] !== undefined) modules.craftengine_overwritableLore = data['overwritable-lore'];
        if (data['overwritable-item-name'] !== undefined) modules.craftengine_overwritableItemName = data['overwritable-item-name'];
        if (data.unbreakable !== undefined) modules.unbreakable = data.unbreakable;
        if (data['custom-model-data']) modules.craftengine_customModelData = data['custom-model-data'];
        if (data.pdc) modules.craftengine_pdc = data.pdc;
        if (data.nbt) modules.craftengine_nbt = data.nbt;
        
        // Custom components
        if (data.components && typeof data.components === 'object') {
            const compLines = [];
            for (const [key, val] of Object.entries(data.components)) {
                compLines.push(`${key}:`);
                if (typeof val === 'object' && !Array.isArray(val)) {
                    for (const [k, v] of Object.entries(val)) {
                        compLines.push(`  ${k}: ${v}`);
                    }
                } else {
                    compLines.push(`  ${val}`);
                }
            }
            modules.craftengine_customComponents = compLines.join('\n');
        }
        
        if (data['remove-components'] && Array.isArray(data['remove-components'])) {
            modules.craftengine_removeComponents = data['remove-components'].join(', ');
        }
    }
    
    // Map furniture settings
    if (exportedData.settings) {
        const settings = exportedData.settings;
        
        if (settings.recipe) modules.recipe = settings.recipe;
        if (settings['display-transform']) modules['furniture-display-transform'] = settings['display-transform'];
        if (settings.rotatable !== undefined) modules['furniture-rotatable'] = settings.rotatable;
        if (settings['restricted-rotation']) modules['furniture-restricted-rotation'] = settings['restricted-rotation'];
        if (settings['block-light'] !== undefined) modules['furniture-block_light'] = settings['block-light'];
        if (settings['sky-light'] !== undefined) modules['furniture-sky_light'] = settings['sky-light'];
        
        // Hitbox
        if (settings.hitbox) {
            const hb = settings.hitbox;
            if (hb.barrier !== undefined) modules['furniture-hitbox-barrier'] = hb.barrier;
            if (hb.interactions !== undefined) modules['furniture-hitbox-interactions'] = hb.interactions;
            if (hb.shulkers !== undefined) modules['furniture-hitbox-shulkers'] = hb.shulkers;
        }
        
        // Limited placing
        if (settings['limited-placing']) {
            const lp = settings['limited-placing'];
            if (lp.floor !== undefined) modules['furniture-limited_placing-floor'] = lp.floor;
            if (lp.roof !== undefined) modules['furniture-limited_placing-roof'] = lp.roof;
            if (lp.wall !== undefined) modules['furniture-limited_placing-wall'] = lp.wall;
            if (lp.type) modules['furniture-limited_placing-type'] = lp.type;
        }
        
        // Drop settings
        if (settings.drop) {
            const drop = settings.drop;
            if (drop.silktouch !== undefined) modules['furniture-drop-silktouch'] = drop.silktouch;
        }
        
        // Loot
        if (settings.loot) {
            modules['furniture-loot'] = settings.loot;
        }
        
        // Tracking
        if (settings.tracking) {
            const tr = settings.tracking;
            if (tr.rotation !== undefined) modules['furniture-tracking-rotation'] = tr.rotation;
        }
        
        // Block sounds
        if (settings['block-sounds']) {
            const snd = settings['block-sounds'];
            if (snd['break-sound']) modules['furniture-block_sounds-break_sound'] = snd['break-sound'];
            if (snd['place-sound']) modules['furniture-block_sounds-place_sound'] = snd['place-sound'];
            if (snd['fall-sound']) modules['furniture-block_sounds-fall_sound'] = snd['fall-sound'];
            if (snd['hit-sound']) modules['furniture-block_sounds-hit_sound'] = snd['hit-sound'];
            if (snd['step-sound']) modules['furniture-block_sounds-step_sound'] = snd['step-sound'];
        }
    }
    
    // Map variants if present
    if (exportedData.variants && typeof exportedData.variants === 'object') {
        // Convert variants back to module format
        // Furniture variants are complex - store as JSON for now
        modules.craftengine_furnitureVariants = JSON.stringify(exportedData.variants);
    }
    
    return modules;
};
