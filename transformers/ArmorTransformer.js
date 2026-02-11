/**
 * Armor Transformer for CraftEngine Format
 */

module.exports.transform = (item, context) => {
    const ArmorKey = `${item.namespace}:${item.id}`;
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
            if ((key === 'recipe' || key === 'components') && value) {
                cleaned[key] = value;
                continue;
            }

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
                const lines = enchModule.split('\n');
                const enchantments = [];
                let currentEnchantment = null;

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || trimmed.startsWith('#')) continue;

                    if (trimmed.startsWith('- enchantment:')) {
                        if (currentEnchantment) enchantments.push(currentEnchantment);
                        currentEnchantment = { enchantment: trimmed.split('enchantment:')[1].trim() };
                    } else if (currentEnchantment) {
                        if (trimmed.startsWith('level:')) {
                            currentEnchantment.level = parseInt(trimmed.split('level:')[1].trim());
                        }
                    }
                }

                if (currentEnchantment) enchantments.push(currentEnchantment);
                return enchantments.length > 0 ? enchantments : null;
            } catch (e) {
                console.error('Failed to parse enchantments:', e);
                return null;
            }
        }
        return null;
    };

    // Helper to build all components (minecraft: prefixed structure)
    const getAllComponents = () => {
        const components = {};
        
        // External plugin data
        const external = getExternalData();
        if (external) components['minecraft:external'] = external;
        
        // Item name
        const itemName = item.modules?.craftengine_itemName || item.name;
        if (itemName) components['minecraft:item_name'] = itemName;
        
        // Custom name
        if (item.modules?.craftengine_customName) {
            components['minecraft:custom_name'] = item.modules?.craftengine_customName;
        }
        
        // Lore
        const lore = getLore();
        if (lore) components['minecraft:lore'] = lore;
        
        // Boolean flags
        if (item.modules?.craftengine_overwritableLore !== undefined) {
            components['minecraft:overwritable_lore'] = item.modules?.craftengine_overwritableLore;
        }
        if (item.modules?.craftengine_overwritableItemName !== undefined) {
            components['minecraft:overwritable_item_name'] = item.modules?.craftengine_overwritableItemName;
        }
        if (item.modules?.craftengine_unbreakable !== undefined) {
            components['minecraft:unbreakable'] = item.modules?.craftengine_unbreakable;
        }
        if (item.modules?.craftengine_hideTooltip !== undefined) {
            components['minecraft:hide_tooltip'] = item.modules?.craftengine_hideTooltip;
        }
        
        // Enchantments
        const enchantments = getEnchantments();
        if (enchantments) components['minecraft:enchantment'] = enchantments;
        
        // Dyed color
        if (item.modules?.craftengine_dyedColor) {
            components['minecraft:dyed_color'] = item.modules?.craftengine_dyedColor;
        }
        
        // Custom model data
        if (item.modules?.craftengine_customModelData || item.modules?.customModelData) {
            components['minecraft:custom_model_data'] = item.modules?.craftengine_customModelData || item.modules?.customModelData;
        }
        
        // Attribute modifiers - include armor-specific attributes
        const attributeModifiers = getAttributeModifiers();
        let finalAttributeModifiers = attributeModifiers ? [...attributeModifiers] : [];
        
        // Add armor defense attribute
        if (item.modules?.craftengine_defense !== undefined && item.modules?.craftengine_defense !== null) {
            finalAttributeModifiers.push({
                type: 'minecraft:generic.armor',
                amount: item.modules.craftengine_defense
            });
        }
        
        // Add armor toughness attribute
        if (item.modules?.craftengine_toughness !== undefined && item.modules?.craftengine_toughness !== null) {
            finalAttributeModifiers.push({
                type: 'minecraft:generic.armor_toughness',
                amount: item.modules.craftengine_toughness
            });
        }
        
        if (finalAttributeModifiers.length > 0) {
            components['minecraft:attribute_modifiers'] = finalAttributeModifiers;
        }
        
        // Max damage/durability
        if (item.modules?.craftengine_maxDamage || item.modules?.durability) {
            components['minecraft:max_damage'] = item.modules?.craftengine_maxDamage || item.modules?.durability;
        }
        
        // Trim
        if (item.modules?.craftengine_trim) {
            components['minecraft:trim'] = item.modules?.craftengine_trim;
        }
        
        // Equippable
        if (item.modules?.craftengine_equippable || item.modules?.equippable) {
            components['minecraft:equippable'] = item.modules?.craftengine_equippable || item.modules?.equippable;
        }
        
        // PDC
        const pdc = getPdcData();
        if (pdc) components['minecraft:pdc'] = pdc;
        
        // NBT (legacy)
        if (item.modules?.craftengine_nbt) {
            components['minecraft:nbt'] = item.modules?.craftengine_nbt;
        }
        
        // Parse custom components from craftengine_customComponents module
        const componentsModule = item.modules?.craftengine_customComponents;
        if (componentsModule && typeof componentsModule === 'string') {
            try {
                const lines = componentsModule.split('\n');
                let currentComponent = null;
                let componentValue = '';
                let isMultiline = false;

                for (const line of lines) {
                    if (!line.trim() || line.trim().startsWith('#')) continue;

                    const indent = line.search(/\S/);
                    const trimmed = line.trim();

                    if (indent === 0 && trimmed.endsWith(':')) {
                        if (currentComponent) {
                            components[currentComponent] = parseComponentValue(componentValue.trim(), isMultiline);
                        }
                        currentComponent = trimmed.slice(0, -1);
                        componentValue = '';
                        isMultiline = false;
                    } else if (currentComponent && indent > 0) {
                        if (componentValue) {
                            componentValue += '\n' + trimmed;
                            isMultiline = true;
                        } else {
                            componentValue = trimmed;
                        }
                    }
                }

                if (currentComponent) {
                    components[currentComponent] = parseComponentValue(componentValue.trim(), isMultiline);
                }

                function parseComponentValue(val, isMultiline) {
                    if (!val || val === '{}') return {};
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
                    return parseSimpleValue(val);
                }

                function parseSimpleValue(val) {
                    if (val === 'true') return true;
                    if (val === 'false') return false;
                    const num = Number(val);
                    if (!isNaN(num)) return num;
                    return val;
                }
            } catch (e) {
                console.error('Failed to parse custom components:', e);
            }
        }
        
        return Object.keys(components).length > 0 ? components : null;
    };

    // Helper to transform shapeless recipe from Nexo Maker format to CraftEngine format
    const getShapelessRecipe = () => {
        const recipeModule = item.modules?.['shapeless-recipe'];
        if (!recipeModule || !Array.isArray(recipeModule)) return null;

        try {
            console.log('[CraftEngine Armor Shapeless Recipe Input]', JSON.stringify(recipeModule, null, 2));

            // Flatten nested arrays - sometimes YAML parser creates nested structure
            let flattenedRecipe = [];
            for (let row of recipeModule) {
                if (Array.isArray(row)) {
                    let hasNestedArrays = row.some(item => Array.isArray(item));

                    if (hasNestedArrays) {
                        let currentRow = row.filter(item => !Array.isArray(item));
                        if (currentRow.length > 0) {
                            flattenedRecipe.push(currentRow);
                        }

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

            // Collect all ingredients (ignoring position)
            const ingredientsList = [];

            for (let row of flattenedRecipe) {
                if (Array.isArray(row)) {
                    for (let ingredient of row) {
                        if (ingredient && ingredient !== '' && ingredient !== null && ingredient !== undefined) {
                            ingredientsList.push(ingredient);
                        }
                    }
                }
            }

            // Return shapeless recipe format only if we have ingredients
            if (ingredientsList.length === 0) {
                console.warn('[CraftEngine Armor Shapeless Recipe] No ingredients found');
                return null;
            }

            const recipe = {
                type: 'shapeless',
                ingredients: ingredientsList
            };

            console.log('[CraftEngine Armor Shapeless Recipe Transform]', JSON.stringify(recipe, null, 2));
            return recipe;
        } catch (e) {
            console.error('Failed to parse armor shapeless recipe:', e);
            return null;
        }
    };

    // Helper to transform recipe from Nexo Maker format to CraftEngine format
    const getRecipe = () => {
        const recipeModule = item.modules?.recipe;
        if (!recipeModule || !Array.isArray(recipeModule)) return null;

        try {
            console.log('[CraftEngine Armor Recipe Input]', JSON.stringify(recipeModule, null, 2));

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

            console.log('[CraftEngine Armor Recipe Flattened]', JSON.stringify(flattenedRecipe, null, 2));

            // Build pattern array and ingredients map
            const pattern = [];
            const ingredients = {};
            let keyCounter = 65; // ASCII code for 'A'

            // Process each row - should be 3 rows for shaped recipe
            for (let i = 0; i < flattenedRecipe.length; i++) {
                let row = flattenedRecipe[i];

                if (!Array.isArray(row)) {
                    console.warn('[CraftEngine Armor Recipe] Row', i, 'is not an array:', row);
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

                console.log('[CraftEngine Armor Recipe] Row', i, 'pattern:', rowPattern);
                pattern.push(rowPattern);
            }

            // Return shaped recipe format only if we have ingredients
            if (Object.keys(ingredients).length === 0) {
                console.warn('[CraftEngine Armor Recipe] No ingredients found');
                return null;
            }

            const recipe = {
                type: 'shaped',
                pattern: pattern,
                ingredients: ingredients
            };

            console.log('[CraftEngine Armor Recipe Transform]', JSON.stringify(recipe, null, 2));
            return recipe;
        } catch (e) {
            console.error('Failed to parse armor recipe:', e);
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
        // Material - construct from material + armor_type (e.g., diamond_chestplate)
        material: 'paper', // default, will be overridden below

        // Model configuration - use simplified texture format or custom model/texture
        ...getModelConfig(),

        // Data components
        data: {
            'components': getAllComponents(),
            'remove-components': getRemoveComponents(),
        },

        // Settings
        settings: cleanObject({
            'recipe': getShapelessRecipe() || getRecipe(),
            'repairable': item.modules?.craftengine_repairable || item.modules?.repairable,
            'anvil-repair-item': item.modules?.craftengine_anvilRepairItem,
            'renameable': item.modules?.craftengine_renameable,
            'dyeable': item.modules?.craftengine_dyeable,
            'invulnerable': item.modules?.craftengine_invulnerable,
            'enchantable': item.modules?.craftengine_enchantable || item.modules?.enchantable,
            'respect-repairable-component': item.modules?.craftengine_respectRepairableComponent,
            'hat-height': item.modules?.craftengine_hatHeight,
            'keep-on-death-chance': item.modules?.craftengine_keepOnDeathChance,
            'destroy-on-death-chance': item.modules?.craftengine_destroyOnDeathChance,
            'drop-display': item.modules?.craftengine_dropDisplay,
            'glow-color': item.modules?.craftengine_glowColor,
            'client-bound-data-components': item.modules?.craftengine_clientBoundDataComponents,
        }),
    };

    // Set material based on armor type and material
    if (item.material && item.material.toLowerCase() !== 'material' && item.armor_type) {
        transformer.material = `${item.material.toLowerCase()}_${item.armor_type}`;
    } else if (item.armor_type) {
        // Default to leather if no material specified
        transformer.material = `leather_${item.armor_type}`;
    }

    // Clean up data section
    transformer.data = cleanObject(transformer.data);
    
    // Clean up empty sections
    if (Object.keys(transformer.data).length === 0) {
        delete transformer.data;
    }

    // Store recipe before cleaning since cleanObject might affect it
    const recipeData = transformer.settings.recipe;
    console.log('[CraftEngine Armor] Recipe before cleaning:', JSON.stringify(recipeData, null, 2));
    const cleanedSettings = cleanObject(transformer.settings);
    console.log('[CraftEngine Armor] Recipe after cleaning:', JSON.stringify(cleanedSettings.recipe, null, 2));

    // Restore recipe if it was removed during cleaning but exists
    if (recipeData && !cleanedSettings.recipe) {
        console.log('[CraftEngine Armor] Restoring recipe that was removed during cleaning');
        cleanedSettings.recipe = recipeData;
    }

    transformer.settings = cleanedSettings;
    console.log('[CraftEngine Armor] Final settings:', JSON.stringify(transformer.settings, null, 2));

    if (Object.keys(transformer.settings).length === 0) {
        delete transformer.settings;
    }

    // Wrap in "items:" category (armor are items)
    return {
        items: {
            [ArmorKey]: transformer
        }
    };
};

/**
 * Untransform function - converts exported CraftEngine armor YAML back to internal modules
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
    
    // Map data section (similar to items but includes armor-specific fields)
    if (exportedData.data) {
        const data = exportedData.data;
        
        // All components are now under data.components with minecraft: prefixes
        if (data.components && typeof data.components === 'object') {
            for (const [key, value] of Object.entries(data.components)) {
                // Handle each component type
                switch (key) {
                    case 'minecraft:external':
                        if (value.plugin) modules.craftengine_externalPlugin = value.plugin;
                        if (value.id) modules.craftengine_externalId = value.id;
                        break;
                    
                    case 'minecraft:item_name':
                        modules.craftengine_itemName = value;
                        break;
                    
                    case 'minecraft:custom_name':
                        modules.craftengine_customName = value;
                        break;
                    
                    case 'minecraft:lore':
                        modules.craftengine_lore = Array.isArray(value) ? value.join('|') : value;
                        break;
                    
                    case 'minecraft:overwritable_lore':
                        modules.craftengine_overwritableLore = value;
                        break;
                    
                    case 'minecraft:overwritable_item_name':
                        modules.craftengine_overwritableItemName = value;
                        break;
                    
                    case 'minecraft:unbreakable':
                        modules.unbreakable = (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) ? true : value;
                        break;
                    
                    case 'minecraft:hide_tooltip':
                        modules.craftengine_hideTooltip = (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) ? true : value;
                        break;
                    
                    case 'minecraft:enchantment':
                        if (Array.isArray(value)) {
                            const enchLines = [];
                            value.forEach(ench => {
                                enchLines.push(`- enchantment: ${ench.enchantment}`);
                                if (ench.level) enchLines.push(`  level: ${ench.level}`);
                            });
                            modules.craftengine_enchantment = enchLines.join('\n');
                        }
                        break;
                    
                    case 'minecraft:dyed_color':
                        modules.craftengine_dyedColor = value;
                        break;
                    
                    case 'minecraft:custom_model_data':
                        modules.craftengine_customModelData = value;
                        break;
                    
                    case 'minecraft:attribute_modifiers':
                        if (Array.isArray(value)) {
                            const attrLines = [];
                            value.forEach(attr => {
                                // Separate armor-specific attributes from general ones
                                if (attr.type === 'minecraft:generic.armor') {
                                    modules.craftengine_defense = attr.amount;
                                } else if (attr.type === 'minecraft:generic.armor_toughness') {
                                    modules.craftengine_toughness = attr.amount;
                                } else {
                                    attrLines.push(`- type: ${attr.type}`);
                                    if (attr.amount !== undefined) attrLines.push(`  amount: ${attr.amount}`);
                                    if (attr.operation) attrLines.push(`  operation: ${attr.operation}`);
                                    if (attr.slot) attrLines.push(`  slot: ${attr.slot}`);
                                }
                            });
                            if (attrLines.length > 0) {
                                modules.craftengine_attributeModifiers = attrLines.join('\n');
                            }
                        }
                        break;
                    
                    case 'minecraft:max_damage':
                        modules.durability = value;
                        break;
                    
                    case 'minecraft:trim':
                        modules.craftengine_trim = value;
                        break;
                    
                    case 'minecraft:equippable':
                        modules.equippable = (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) ? true : value;
                        break;
                    
                    case 'minecraft:pdc':
                        modules.craftengine_pdc = value;
                        break;
                    
                    case 'minecraft:nbt':
                        modules.craftengine_nbt = value;
                        break;
                    
                    default:
                        // For any other custom components, store as YAML.
                        // If the component is an empty object (i.e. "set" flag), emit `key: {}`
                        if (!modules.craftengine_customComponents) {
                            modules.craftengine_customComponents = '';
                        }
                        if (modules.craftengine_customComponents) {
                            modules.craftengine_customComponents += '\n';
                        }
                        if (typeof value === 'object' && !Array.isArray(value)) {
                            if (Object.keys(value).length === 0) {
                                modules.craftengine_customComponents += `${key}: {}` + '\n';
                            } else {
                                modules.craftengine_customComponents += `${key}:\n`;
                                for (const [k, v] of Object.entries(value)) {
                                    modules.craftengine_customComponents += `  ${k}: ${v}\n`;
                                }
                            }
                        } else {
                            modules.craftengine_customComponents += `${key}: ${value}\n`;
                        }
                        break;
                }
            }
        }
        
        // Remove components list
        if (data['remove-components'] && Array.isArray(data['remove-components'])) {
            modules.craftengine_removeComponents = data['remove-components'].join(', ');
        }
    }
    
    // Map settings section
    if (exportedData.settings) {
        const settings = exportedData.settings;
        
        if (settings.recipe) modules.recipe = settings.recipe;
        if (settings.repairable) modules.repairable = settings.repairable;
        if (settings['anvil-repair-item']) modules.craftengine_anvilRepairItem = settings['anvil-repair-item'];
        if (settings.renameable !== undefined) modules.craftengine_renameable = settings.renameable;
        if (settings.dyeable !== undefined) modules.craftengine_dyeable = settings.dyeable;
        if (settings.invulnerable !== undefined) modules.craftengine_invulnerable = settings.invulnerable;
        if (settings.enchantable) modules.enchantable = settings.enchantable;
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
    }
    
    return modules;
};
