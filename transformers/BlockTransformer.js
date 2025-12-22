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

    // Helper to transform shapeless recipe from Nexo Maker format to CraftEngine format
    const getShapelessRecipe = () => {
        const recipeModule = item.modules?.['shapeless-recipe'];
        if (!recipeModule || !Array.isArray(recipeModule)) return null;

        try {
            console.log('[CraftEngine Block Shapeless Recipe Input]', JSON.stringify(recipeModule, null, 2));

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
                console.warn('[CraftEngine Block Shapeless Recipe] No ingredients found');
                return null;
            }

            const recipe = {
                type: 'shapeless',
                ingredients: ingredientsList
            };

            console.log('[CraftEngine Block Shapeless Recipe Transform]', JSON.stringify(recipe, null, 2));
            return recipe;
        } catch (e) {
            console.error('Failed to parse block shapeless recipe:', e);
            return null;
        }
    };

    // Helper to transform recipe from Nexo Maker format to CraftEngine format
    const getRecipe = () => {
        const recipeModule = item.modules?.recipe;
        if (!recipeModule || !Array.isArray(recipeModule)) return null;

        try {
            console.log('[CraftEngine Block Recipe Input]', JSON.stringify(recipeModule, null, 2));

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

            console.log('[CraftEngine Block Recipe Flattened]', JSON.stringify(flattenedRecipe, null, 2));

            // Build pattern array and ingredients map
            const pattern = [];
            const ingredients = {};
            let keyCounter = 65; // ASCII code for 'A'

            // Process each row - should be 3 rows for shaped recipe
            for (let i = 0; i < flattenedRecipe.length; i++) {
                let row = flattenedRecipe[i];

                if (!Array.isArray(row)) {
                    console.warn('[CraftEngine Block Recipe] Row', i, 'is not an array:', row);
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

                console.log('[CraftEngine Block Recipe] Row', i, 'pattern:', rowPattern);
                pattern.push(rowPattern);
            }

            // Return shaped recipe format only if we have ingredients
            if (Object.keys(ingredients).length === 0) {
                console.warn('[CraftEngine Block Recipe] No ingredients found');
                return null;
            }

            const recipe = {
                type: 'shaped',
                pattern: pattern,
                ingredients: ingredients
            };

            console.log('[CraftEngine Block Recipe Transform]', JSON.stringify(recipe, null, 2));
            return recipe;
        } catch (e) {
            console.error('Failed to parse block recipe:', e);
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
        // Material for blocks (what vanilla block to use as base)
        material: (item.modules?.baseMaterial || 'note_block').toLowerCase(),

        // Model configuration - use simplified texture format or custom model/texture
        ...getModelConfig(),

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
            'recipe': getShapelessRecipe() || getRecipe(),
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
    };

    // Clean up empty sections
    if (Object.keys(transformer.data).length === 0) {
        delete transformer.data;
    }

    // Store recipe before cleaning since cleanObject might affect it
    const recipeData = transformer.settings.recipe;
    console.log('[CraftEngine Block] Recipe before cleaning:', JSON.stringify(recipeData, null, 2));
    const cleanedSettings = cleanObject(transformer.settings);
    console.log('[CraftEngine Block] Recipe after cleaning:', JSON.stringify(cleanedSettings.recipe, null, 2));

    // Restore recipe if it was removed during cleaning but exists
    if (recipeData && !cleanedSettings.recipe) {
        console.log('[CraftEngine Block] Restoring recipe that was removed during cleaning');
        cleanedSettings.recipe = recipeData;
    }

    transformer.settings = cleanedSettings;
    console.log('[CraftEngine Block] Final settings:', JSON.stringify(transformer.settings, null, 2));

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
