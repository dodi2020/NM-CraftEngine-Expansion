module.exports = (nm) => {
  nm.registerModularCreator(
    'create_armor',
    __dirname + '/../creators/ArmorCreator.jsx',
    {
      label: 'Armor',
      description: 'Create an armor piece',
      compatibility: ['craftengine']
    }
  );
  nm.registerModularCreator(
    'create_weapon',
    __dirname + '/../creators/WeaponCreator.jsx',
    {
      label: 'Weapon',
      description: 'Create a weapon',
      compatibility: ['craftengine']
    }
  );
  nm.registerModularCreator(
    'create_tool',
    __dirname + '/../creators/ToolCreator.jsx',
    {
      label: 'Tool',
      description: 'Create a tool',
      compatibility: ['craftengine']
    }
  );
  nm.registerModularCreator(
    'create_food',
    __dirname + '/../creators/FoodCreator.jsx',
    {
      label: 'Food',
      description: 'Create a food item',
      compatibility: ['craftengine']
    }
  );
  nm.registerModularCreator(
    'create_item',
    __dirname + '/../creators/ItemCreator.jsx',
    {
      label: 'Item',
      description: 'Create an item',
      compatibility: ['craftengine']
    }
  );
  nm.registerModularCreator(
    'create_block',
    __dirname + '/../creators/BlockCreator.jsx',
    {
      label: 'Block',
      description: 'Create a block',
      compatibility: ['craftengine']
    }
  );
  nm.registerModularCreator(
    'create_furniture',
    __dirname + '/../creators/FurnitureCreator.jsx',
    {
      label: 'Furniture',
      description: 'Create a furniture piece',
      compatibility: ['craftengine']
    }
  );
};