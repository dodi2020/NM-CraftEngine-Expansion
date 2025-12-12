module.exports.transform = (item, context) => {

    const ItemKey = `${item.namespace}:${item.id}`;
    const assetsPath = `${context.namespace}:item/${context.folder}/${item.id}`

    // Helper to process lore string with line breaks
    const getLore = () => {
        const loreModule = item.modules?.craftengine_lore;
        if (typeof loreModule === 'string') {
            return loreModule.split('|').map(line => line.trim());
        }
        return loreModule;
    }

    const transformer = {
      // Default material, will be overridden by subtypes
      material: (item.modules?.baseMaterial || `paper`).toLowerCase(),
      data: {
        "item-name": item.display,
        "custom-model-data": item.modules?.craftengine_custom_model_data,
        lore: getLore(),
        unbreakable: item.modules?.craftengine_unbreakable,

        food: {
            nutrition: item.modules?.craftengine_nutrition,
            saturation: item.modules?.craftengine_saturation,
        },

        components: {
            "minecraft:attack_damage": item.modules?.craftengine_damage,
            "minecraft:enchantment_glint_override": item.modules?.enchantmentGlintOverride,
            "minecraft:max_stack_size": item.modules?.craftengine_max_stack_size,
        }
      },
      model: {
        type: 'minecraft:model',
        path: assetsPath,
        generation: {
            parent: 'item/handheld',
            textures: {
                "laylayer0": assetsPath,
            }
        }
      },
      settings: {
        "fuel-time": item.modules?.craftengine_fuel_time,
        renameable: item.modules?.craftengine_renameable,
        dyeable: item.modules?.craftengine_dyeable,
        enchantable: item.modules?.craftengine_enchantable,
        "compost-probability": item.modules?.craftengine_compost_probability,
        "dye-color": item.modules?.craftengine_dye_color,
        "glow-color": item.modules?.craftengine_glow_color,
      },
    }

    // Subtype-specific logic
    if (item.subtype === 'armor') {
        if (item.material.toLowerCase() !== 'material') {
            transformer.material = `${item.material.toLowerCase()}_${item.armor_type}`;
        }
        transformer.data.components['minecraft:generic.armor'] = item.modules?.craftengine_defense;
        transformer.data.components['minecraft:generic.armor_toughness'] = item.modules?.craftengine_toughness;
    }

    if (item.subtype === 'weapon') {
        if (item.material.toLowerCase() !== 'material') {
            transformer.material = `${item.material.toLowerCase()}_${item.weapon_type}`;
        }
    }

    return { [ItemKey]: transformer };
}