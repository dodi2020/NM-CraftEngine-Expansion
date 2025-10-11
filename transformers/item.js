module.exports.transform = (item) => {

    const ItemKey = `${item.namespace}:${item.id}`;
      
    return {

    [ItemKey]: {

      material: (item.modules?.baseMaterial || `PAPER`).toLowerCase(),
      settings: {
        //I need a lot of custom modules later.
        //https://xiao-momi.github.io/craft-engine-wiki/configuration/item/settings
        unbreakable: item.modules?.unbreakable,
        enchanenchantable: item.modules?.disableEnchanting === true ? false : true,

        food: {
          nutrition: item.modules?.nutrition,
          saturation: item.modules?.saturation,
        }
          
      },

      data: {
        "item-name": item.name,
        lore: item.modules?.lore,
      },


    },
  };
}