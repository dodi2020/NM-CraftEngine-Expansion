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
            // Skip cleaning 'recipe' key - preserve it as-is if it exists
            if (key === 'recipe' && value) {
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
        data: cleanObject({
            'external': getExternalData(),
            'item-name': item.modules?.craftengine_itemName || item.name,
            'custom-name': item.modules?.craftengine_customName,
            'lore': getLore(),
            'overwritable-lore': item.modules?.craftengine_overwritableLore,
            'overwritable-item-name': item.modules?.craftengine_overwritableItemName,
            'unbreakable': item.modules?.craftengine_unbreakable,
            'enchantment': item.modules?.craftengine_enchantment,
            'dyed-color': item.modules?.craftengine_dyedColor,
            'custom-model-data': item.modules?.craftengine_customModelData || item.modules?.customModelData,
            'hide-tooltip': item.modules?.craftengine_hideTooltip,
            'attribute-modifiers': getAttributeModifiers(),
            'max-damage': item.modules?.craftengine_maxDamage || item.modules?.durability,
            'trim': item.modules?.craftengine_trim,
            'equippable': item.modules?.craftengine_equippable || item.modules?.equippable,
            'pdc': getPdcData(),
            'nbt': item.modules?.craftengine_nbt,
            'components': getCustomComponents(),
            'remove-components': getRemoveComponents(),
        }),

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

    // Add armor-specific attributes if provided
    if (item.modules?.craftengine_defense !== undefined && item.modules?.craftengine_defense !== null) {
        if (!transformer.data['attribute-modifiers']) {
            transformer.data['attribute-modifiers'] = {};
        }
        if (typeof transformer.data['attribute-modifiers'] === 'string') {
            // If it's a string, parse it or leave it as is
        } else {
            transformer.data['attribute-modifiers']['minecraft:generic.armor'] = item.modules.craftengine_defense;
        }
    }

    if (item.modules?.craftengine_toughness !== undefined && item.modules?.craftengine_toughness !== null) {
        if (!transformer.data['attribute-modifiers']) {
            transformer.data['attribute-modifiers'] = {};
        }
        if (typeof transformer.data['attribute-modifiers'] === 'object') {
            transformer.data['attribute-modifiers']['minecraft:generic.armor_toughness'] = item.modules.craftengine_toughness;
        }
    }

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
