/**
 * Item Transformer for CraftEngine Format
 * Handles: items, weapons, tools, food
 */

module.exports.transform = (item, context) => {
    const ItemKey = `${item.namespace}:${item.id}`;
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
            // Skip cleaning for specific keys - preserve them as-is if they exist
            if ((key === 'recipe' || key === 'food' || key === 'consumable' || key === 'equipment') && value) {
                cleaned[key] = value;
                continue;
            }

            if (value !== undefined && value !== null && value !== '') {
                // Recursively clean nested objects
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
            // User should provide YAML format, we'll pass it through
            return pdcModule;
        }
        return null;
    };

    // Helper to parse custom components (YAML string to object)
    const getCustomComponents = () => {
        const componentsModule = item.modules?.craftengine_customComponents;
        if (componentsModule && typeof componentsModule === 'string') {
            try {
                // Parse YAML string to JavaScript object
                const lines = componentsModule.split('\n');
                const components = {};
                let currentComponent = null;
                let componentValue = '';
                let isMultiline = false;

                for (const line of lines) {
                    if (!line.trim() || line.trim().startsWith('#')) continue;

                    const indent = line.search(/\S/);
                    const trimmed = line.trim();

                    // Check if this is a component key (at indent 0 and ends with :)
                    if (indent === 0 && trimmed.endsWith(':')) {
                        // Save previous component if exists
                        if (currentComponent) {
                            components[currentComponent] = parseComponentValue(componentValue.trim(), isMultiline);
                        }

                        // Start new component - keep full namespace:component format
                        currentComponent = trimmed.slice(0, -1); // Remove trailing :
                        componentValue = '';
                        isMultiline = false;
                    } else if (currentComponent && indent > 0) {
                        // Multi-line component value
                        if (componentValue) {
                            componentValue += '\n' + trimmed;
                            isMultiline = true;
                        } else {
                            componentValue = trimmed;
                        }
                    }
                }

                // Save last component
                if (currentComponent) {
                    components[currentComponent] = parseComponentValue(componentValue.trim(), isMultiline);
                }

                // Helper to parse component values
                function parseComponentValue(val, isMultiline) {
                    if (!val || val === '{}') return {};

                    // If it's multiline, parse as YAML-like key: value pairs
                    if (isMultiline) {
                        const obj = {};
                        const subLines = val.split('\n');
                        for (const subLine of subLines) {
                            const colonIndex = subLine.indexOf(':');
                            if (colonIndex > 0) {
                                const key = subLine.substring(0, colonIndex).trim();
                                const value = subLine.substring(colonIndex + 1).trim();
                                obj[key] = parseSimpleValue(value);
                            }
                        }
                        return Object.keys(obj).length > 0 ? obj : val;
                    }

                    // Single line value
                    return parseSimpleValue(val);
                }

                // Helper to parse simple values (numbers, booleans)
                function parseSimpleValue(val) {
                    if (val === 'true') return true;
                    if (val === 'false') return false;
                    const num = Number(val);
                    if (!isNaN(num)) return num;
                    return val; // Return as string if not a special type
                }

                return Object.keys(components).length > 0 ? components : null;
            } catch (e) {
                console.error('Failed to parse custom components:', e);
                return null;
            }
        }
        return null;
    };

    // Helper to parse remove-components list
    const getRemoveComponents = () => {
        const removeModule = item.modules?.craftengine_removeComponents;
        if (removeModule && typeof removeModule === 'string') {
            // Split by comma or newline
            return removeModule.split(/[,\n]/).map(c => c.trim()).filter(c => c);
        }
        return null;
    };

    // Helper to parse attribute modifiers (YAML string to array)
    const getAttributeModifiers = () => {
        const attrModule = item.modules?.craftengine_attributeModifiers;
        if (attrModule && typeof attrModule === 'string') {
            try {
                // Parse YAML string manually (simple parser for our specific format)
                const lines = attrModule.split('\n');
                const modifiers = [];
                let currentModifier = null;

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || trimmed.startsWith('#')) continue;

                    if (trimmed.startsWith('- type:')) {
                        // New modifier entry
                        if (currentModifier) modifiers.push(currentModifier);
                        currentModifier = { type: trimmed.split('type:')[1].trim() };
                    } else if (currentModifier) {
                        // Parse properties of current modifier
                        if (trimmed.startsWith('amount:')) {
                            currentModifier.amount = parseFloat(trimmed.split('amount:')[1].trim());
                        } else if (trimmed.startsWith('operation:')) {
                            currentModifier.operation = trimmed.split('operation:')[1].trim();
                        } else if (trimmed.startsWith('slot:')) {
                            currentModifier.slot = trimmed.split('slot:')[1].trim();
                        }
                    }
                }

                // Add the last modifier
                if (currentModifier) modifiers.push(currentModifier);

                return modifiers.length > 0 ? modifiers : null;
            } catch (e) {
                console.error('Failed to parse attribute modifiers:', e);
                return null;
            }
        }
        return null;
    };

    // Helper to parse enchantments (YAML string to array)
    const getEnchantments = () => {
        const enchModule = item.modules?.craftengine_enchantment;
        if (enchModule && typeof enchModule === 'string') {
            try {
                // Parse YAML string manually (simple parser for our specific format)
                const lines = enchModule.split('\n');
                const enchantments = [];
                let currentEnchantment = null;

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || trimmed.startsWith('#')) continue;

                    if (trimmed.startsWith('- enchantment:')) {
                        // New enchantment entry
                        if (currentEnchantment) enchantments.push(currentEnchantment);
                        currentEnchantment = { enchantment: trimmed.split('enchantment:')[1].trim() };
                    } else if (currentEnchantment) {
                        // Parse properties of current enchantment
                        if (trimmed.startsWith('level:')) {
                            currentEnchantment.level = parseInt(trimmed.split('level:')[1].trim());
                        }
                    }
                }

                // Add the last enchantment
                if (currentEnchantment) enchantments.push(currentEnchantment);

                return enchantments.length > 0 ? enchantments : null;
            } catch (e) {
                console.error('Failed to parse enchantments:', e);
                return null;
            }
        }
        return null;
    };

    // Helper to transform recipe from Nexo Maker format to CraftEngine format
    const getRecipe = () => {
        const recipeModule = item.modules?.recipe;
        if (!recipeModule || !Array.isArray(recipeModule)) return null;

        try {
            console.log('[CraftEngine Recipe Input]', JSON.stringify(recipeModule, null, 2));

            // Flatten nested arrays - sometimes YAML parser creates nested structure
            let flattenedRecipe = [];
            for (let row of recipeModule) {
                if (Array.isArray(row)) {
                    // Check if this row contains nested arrays
                    let hasNestedArrays = row.some(item => Array.isArray(item));

                    if (hasNestedArrays) {
                        // Extract non-array items as one row
                        let currentRow = row.filter(item => !Array.isArray(item));
                        if (currentRow.length > 0) {
                            flattenedRecipe.push(currentRow);
                        }

                        // Add nested arrays as separate rows
                        for (let item of row) {
                            if (Array.isArray(item)) {
                                flattenedRecipe.push(item);
                            }
                        }
                    } else {
                        flattenedRecipe.push(row);
                    }
                }
            }

            console.log('[CraftEngine Recipe Flattened]', JSON.stringify(flattenedRecipe, null, 2));

            // Build pattern array and ingredients map
            const pattern = [];
            const ingredients = {};
            let keyCounter = 65; // ASCII code for 'A'

            // Process each row - should be 3 rows for shaped recipe
            for (let i = 0; i < flattenedRecipe.length; i++) {
                let row = flattenedRecipe[i];

                if (!Array.isArray(row)) {
                    console.warn('[CraftEngine Recipe] Row', i, 'is not an array:', row);
                    continue;
                }

                let rowPattern = '';

                // Process exactly 3 columns per row
                for (let j = 0; j < 3; j++) {
                    const ingredient = row[j];

                    // Check for empty/null/undefined
                    if (!ingredient || ingredient === '' || ingredient === null || ingredient === undefined) {
                        rowPattern += ' '; // Empty slot
                    } else {
                        // Check if we already have a key for this ingredient
                        let ingredientKey = null;
                        for (let [key, value] of Object.entries(ingredients)) {
                            if (value === ingredient) {
                                ingredientKey = key;
                                break;
                            }
                        }

                        // If not, create a new key
                        if (!ingredientKey) {
                            ingredientKey = String.fromCharCode(keyCounter++);
                            ingredients[ingredientKey] = ingredient;
                        }

                        rowPattern += ingredientKey;
                    }
                }

                console.log('[CraftEngine Recipe] Row', i, 'pattern:', rowPattern);
                pattern.push(rowPattern);
            }

            // Return shaped recipe format only if we have ingredients
            if (Object.keys(ingredients).length === 0) {
                console.warn('[CraftEngine Recipe] No ingredients found');
                return null;
            }

            const recipe = {
                type: 'shaped',
                pattern: pattern,
                ingredients: ingredients
            };

            console.log('[CraftEngine Recipe Transform]', JSON.stringify(recipe, null, 2));
            return recipe;
        } catch (e) {
            console.error('Failed to parse recipe:', e);
            return null;
        }
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
        // Material - use baseMaterial module or default to paper
        material: (item.modules?.baseMaterial || 'paper').toLowerCase(),

        // Model configuration - use simplified texture format or custom model/texture
        ...getModelConfig(),

        // Data components
        data: {
            'external': getExternalData(),
            'item-name': item.modules?.craftengine_itemName || item.name,
            'custom-name': item.modules?.craftengine_customName,
            'lore': getLore(),
            'overwritable-lore': item.modules?.craftengine_overwritableLore,
            'overwritable-item-name': item.modules?.craftengine_overwritableItemName,
            'unbreakable': item.modules?.craftengine_unbreakable,
            'enchantment': getEnchantments(),
            'dyed-color': item.modules?.craftengine_dyedColor,
            'custom-model-data': item.modules?.craftengine_customModelData || item.modules?.customModelData,
            'hide-tooltip': item.modules?.craftengine_hideTooltip,
            'attribute-modifiers': getAttributeModifiers(),
            'max-damage': item.modules?.craftengine_maxDamage || item.modules?.durability,
            'jukebox-playable': item.modules?.craftengine_jukeboxPlayable,
            'item-model': item.modules?.craftengine_itemModel,
            'tooltip-style': item.modules?.craftengine_tooltipStyle,
            'trim': item.modules?.craftengine_trim,
            'equippable': item.modules?.craftengine_equippable || item.modules?.equippable,
            'pdc': getPdcData(),
            'nbt': item.modules?.craftengine_nbt,
            'components': getCustomComponents(),
            'remove-components': getRemoveComponents(),
        },

        // Settings
        settings: (() => {
            const recipe = getRecipe();
            console.log('[CraftEngine Item] Recipe result:', JSON.stringify(recipe, null, 2));
            return {
                'recipe': recipe,
                'fuel-time': item.modules?.craftengine_fuelTime,
                'repairable': item.modules?.craftengine_repairable || item.modules?.repairable,
                'anvil-repair-item': item.modules?.craftengine_anvilRepairItem,
                'renameable': item.modules?.craftengine_renameable,
                'projectile': item.modules?.craftengine_projectile,
                'dyeable': item.modules?.craftengine_dyeable,
                'consume-replacement': item.modules?.craftengine_consumeReplacement,
                'craft-remainder': item.modules?.craftengine_craftRemainder,
                'invulnerable': item.modules?.craftengine_invulnerable,
                'enchantable': item.modules?.craftengine_enchantable || item.modules?.enchantable,
                'compost-probability': item.modules?.craftengine_compostProbability,
                'respect-repairable-component': item.modules?.craftengine_respectRepairableComponent,
                'dye-color': item.modules?.craftengine_dyeColor,
                'firework-color': item.modules?.craftengine_fireworkColor,
                'ingredient-substitute': item.modules?.craftengine_ingredientSubstitute,
                'hat-height': item.modules?.craftengine_hatHeight,
                'keep-on-death-chance': item.modules?.craftengine_keepOnDeathChance,
                'destroy-on-death-chance': item.modules?.craftengine_destroyOnDeathChance,
                'drop-display': item.modules?.craftengine_dropDisplay,
                'glow-color': item.modules?.craftengine_glowColor,
                equipment: {
                    'asset-id': item.modules?.craftengine_equipmentAssetId,
                    'client-bound-model': item.modules?.craftengine_equipmentClientBoundModel,
                    'slot': item.modules?.craftengine_equipmentSlot,
                    'camera-overlay': item.modules?.craftengine_equipmentCameraOverlay,
                    'dispensable': item.modules?.craftengine_equipmentDispensable,
                    'damage-on-hurt': item.modules?.craftengine_equipmentDamageOnHurt,
                    'swappable': item.modules?.craftengine_equipmentSwappable,
                    'equip-on-interact': item.modules?.craftengine_equipmentEquipOnInteract,
                },
                food: {
                    'nutrition': item.modules?.nutrition || item.modules?.craftengine_nutrition,
                    'saturation': item.modules?.saturation || item.modules?.craftengine_saturation,
                    'can-always-eat': item.modules?.craftengine_canAlwaysEat,
                },
                consumable: {
                    'consume-seconds': item.modules?.craftengine_consumeSeconds,
                    'animation': item.modules?.craftengine_consumeAnimation,
                    'sound': item.modules?.craftengine_consumeSound,
                    'has-consume-particles': item.modules?.craftengine_hasConsumeParticles,
                    'on-consume-effects': item.modules?.craftengine_onConsumeEffects,
                },
            };
        })(),
    };

    // Subtype-specific logic for weapons
    if (item.subtype === 'weapon') {
        if (item.material && item.material.toLowerCase() !== 'material' && item.weapon_type) {
            transformer.material = `${item.material.toLowerCase()}_${item.weapon_type}`;
        }
    }

    // Subtype-specific logic for tools
    if (item.subtype === 'tool') {
        if (item.material && item.material.toLowerCase() !== 'material' && item.tool_type) {
            transformer.material = `${item.material.toLowerCase()}_${item.tool_type}`;
        }
    }

    // Clean up empty nested objects and null values
    transformer.data = cleanObject(transformer.data);

    // Store recipe before cleaning since cleanObject might affect it
    const recipeData = transformer.settings.recipe;
    console.log('[CraftEngine Item] Recipe before cleaning:', JSON.stringify(recipeData, null, 2));
    transformer.settings = cleanObject(transformer.settings);
    console.log('[CraftEngine Item] Recipe after cleaning:', JSON.stringify(transformer.settings.recipe, null, 2));

    // Restore recipe if it was removed during cleaning but exists
    if (recipeData && !transformer.settings.recipe) {
        console.log('[CraftEngine Item] Restoring recipe that was removed during cleaning');
        transformer.settings.recipe = recipeData;
    }

    console.log('[CraftEngine Item] Final settings:', JSON.stringify(transformer.settings, null, 2));

    // Remove data/settings if completely empty after cleaning
    if (!transformer.data || Object.keys(transformer.data).length === 0) {
        delete transformer.data;
    }
    if (!transformer.settings || Object.keys(transformer.settings).length === 0) {
        delete transformer.settings;
    }

    // Wrap in "items:" category
    return {
        items: {
            [ItemKey]: transformer
        }
    };
};

/**
 * Untransform function - converts exported CraftEngine YAML back to internal modules
 */
module.exports.untransform = (exportedData) => {
    const modules = {};
    
    if (!exportedData) return modules;
    
    // Map material
    if (exportedData.material) {
        modules.baseMaterial = exportedData.material;
    }
    
    // Map model/texture
    if (exportedData.model) modules.craftengine_model = exportedData.model;
    if (exportedData.models) modules.craftengine_models = exportedData.models;
    if (exportedData.texture) modules.craftengine_texture = exportedData.texture;
    if (exportedData.textures) modules.craftengine_textures = exportedData.textures;
    
    // Map data section
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
        
        // Enchantments - convert array back to YAML string
        if (data.enchantment && Array.isArray(data.enchantment)) {
            const enchLines = [];
            data.enchantment.forEach(ench => {
                enchLines.push(`- enchantment: ${ench.enchantment}`);
                if (ench.level) enchLines.push(`  level: ${ench.level}`);
            });
            modules.craftengine_enchantment = enchLines.join('\n');
        }
        
        if (data['dyed-color']) modules.craftengine_dyedColor = data['dyed-color'];
        if (data['custom-model-data']) modules.craftengine_customModelData = data['custom-model-data'];
        if (data['hide-tooltip'] !== undefined) modules.craftengine_hideTooltip = data['hide-tooltip'];
        
        // Attribute modifiers - convert array back to YAML string
        if (data['attribute-modifiers'] && Array.isArray(data['attribute-modifiers'])) {
            const attrLines = [];
            data['attribute-modifiers'].forEach(attr => {
                attrLines.push(`- type: ${attr.type}`);
                if (attr.amount !== undefined) attrLines.push(`  amount: ${attr.amount}`);
                if (attr.operation) attrLines.push(`  operation: ${attr.operation}`);
                if (attr.slot) attrLines.push(`  slot: ${attr.slot}`);
            });
            modules.craftengine_attributeModifiers = attrLines.join('\n');
        }
        
        if (data['max-damage']) modules.durability = data['max-damage'];
        if (data['jukebox-playable']) modules.craftengine_jukeboxPlayable = data['jukebox-playable'];
        if (data['item-model']) modules.craftengine_itemModel = data['item-model'];
        if (data['tooltip-style']) modules.craftengine_tooltipStyle = data['tooltip-style'];
        if (data.trim) modules.craftengine_trim = data.trim;
        if (data.equippable) modules.equippable = data.equippable;
        
        if (data.pdc) modules.craftengine_pdc = data.pdc;
        if (data.nbt) modules.craftengine_nbt = data.nbt;
        
        // Custom components - convert object back to YAML string
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
        
        // Remove components
        if (data['remove-components'] && Array.isArray(data['remove-components'])) {
            modules.craftengine_removeComponents = data['remove-components'].join(', ');
        }
    }
    
    // Map settings section
    if (exportedData.settings) {
        const settings = exportedData.settings;
        
        if (settings.recipe) modules.recipe = settings.recipe;
        if (settings['fuel-time']) modules.craftengine_fuelTime = settings['fuel-time'];
        if (settings.repairable) modules.repairable = settings.repairable;
        if (settings['anvil-repair-item']) modules.craftengine_anvilRepairItem = settings['anvil-repair-item'];
        if (settings.renameable !== undefined) modules.craftengine_renameable = settings.renameable;
        if (settings.projectile) modules.craftengine_projectile = settings.projectile;
        if (settings.dyeable !== undefined) modules.craftengine_dyeable = settings.dyeable;
        if (settings['consume-replacement']) modules.craftengine_consumeReplacement = settings['consume-replacement'];
        if (settings['craft-remainder']) modules.craftengine_craftRemainder = settings['craft-remainder'];
        if (settings.invulnerable !== undefined) modules.craftengine_invulnerable = settings.invulnerable;
        if (settings.enchantable) modules.enchantable = settings.enchantable;
        if (settings['compost-probability']) modules.craftengine_compostProbability = settings['compost-probability'];
        if (settings['respect-repairable-component'] !== undefined) modules.craftengine_respectRepairableComponent = settings['respect-repairable-component'];
        if (settings['dye-color']) modules.craftengine_dyeColor = settings['dye-color'];
        if (settings['firework-color']) modules.craftengine_fireworkColor = settings['firework-color'];
        if (settings['ingredient-substitute']) modules.craftengine_ingredientSubstitute = settings['ingredient-substitute'];
        if (settings['hat-height']) modules.craftengine_hatHeight = settings['hat-height'];
        if (settings['keep-on-death-chance']) modules.craftengine_keepOnDeathChance = settings['keep-on-death-chance'];
        if (settings['destroy-on-death-chance']) modules.craftengine_destroyOnDeathChance = settings['destroy-on-death-chance'];
        if (settings['drop-display']) modules.craftengine_dropDisplay = settings['drop-display'];
        if (settings['glow-color']) modules.craftengine_glowColor = settings['glow-color'];
        
        // Equipment sub-section
        if (settings.equipment) {
            const eq = settings.equipment;
            if (eq['asset-id']) modules.craftengine_equipmentAssetId = eq['asset-id'];
            if (eq['client-bound-model'] !== undefined) modules.craftengine_equipmentClientBoundModel = eq['client-bound-model'];
            if (eq.slot) modules.craftengine_equipmentSlot = eq.slot;
            if (eq['camera-overlay']) modules.craftengine_equipmentCameraOverlay = eq['camera-overlay'];
            if (eq.dispensable !== undefined) modules.craftengine_equipmentDispensable = eq.dispensable;
            if (eq['damage-on-hurt'] !== undefined) modules.craftengine_equipmentDamageOnHurt = eq['damage-on-hurt'];
            if (eq.swappable !== undefined) modules.craftengine_equipmentSwappable = eq.swappable;
            if (eq['equip-on-interact'] !== undefined) modules.craftengine_equipmentEquipOnInteract = eq['equip-on-interact'];
        }
        
        // Food sub-section
        if (settings.food) {
            const food = settings.food;
            if (food.nutrition) modules.nutrition = food.nutrition;
            if (food.saturation) modules.saturation = food.saturation;
            if (food['can-always-eat'] !== undefined) modules.craftengine_canAlwaysEat = food['can-always-eat'];
        }
        
        // Consumable sub-section
        if (settings.consumable) {
            const cons = settings.consumable;
            if (cons['consume-seconds']) modules.craftengine_consumeSeconds = cons['consume-seconds'];
            if (cons.animation) modules.craftengine_consumeAnimation = cons.animation;
            if (cons.sound) modules.craftengine_consumeSound = cons.sound;
            if (cons['has-consume-particles'] !== undefined) modules.craftengine_hasConsumeParticles = cons['has-consume-particles'];
            if (cons['on-consume-effects']) modules.craftengine_onConsumeEffects = cons['on-consume-effects'];
        }
    }
    
    return modules;
};
