/**
 * Armor Transformer for CraftEngine Format
 */

module.exports.transform = (item, context) => {
    const ArmorKey = `${item.namespace}:${item.id}`;
    const assetsPathTexture = `${item.namespace}:${item.type}/${item.id}`;
    const assetsPathModel = `${item.namespace}:${item.type}/${item.id}`;

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

    const transformer = {
        // Material - construct from material + armor_type (e.g., diamond_chestplate)
        material: 'paper', // default, will be overridden below

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

        // Model configuration
        model: {
            type: 'minecraft:model',
            path: assetsPathModel,
            generation: {
                parent: 'item/generated',
                textures: {
                    'layer0': assetsPathTexture,
                }
            }
        }
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
