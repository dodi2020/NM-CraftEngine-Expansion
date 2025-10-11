module.exports.transform = (item) => {

    const ItemKey = `${item.namespace}:${item.id}`;
      
    return {

    [ItemKey]: {

      material: (item.modules?.baseMaterial || `PAPER`).toLowerCase(),


      data: {
        "item-name": item.name,
        "custom-model-data": item.modules?.customModelData,
        lore: item.modules?.lore,
        unbreakable: item.modules?.unbreakable,

        food: {
            nutrition: item.modules?.nutrition,
            saturation: item.modules?.saturation,
        },

        components: {
            "minecraft:max_damage": item.modules?.damage,
            "minecraft:enchantment_glint_override": item.modules?.enchantmentGlintOverride,
            "minecraft:max_stack_size": item.modules?.maxStackSize,   
        }
      },

      settings: {
        //I need a lot of custom modules later.
        //https://xiao-momi.github.io/craft-engine-wiki/configuration/item/settings
        enchanenchantable: item.modules?.disableEnchanting === true ? false : true,
          
      },

    },
  };
}