module.exports = (nm) => {
  // Enable built-in creators for CraftEngine projects
  nm.postCreatorTypeCompatibilities({
    'create_item': ['craftengine'],
    'create_weapon': ['craftengine'],
    'create_tool': ['craftengine'],
    'create_armor': ['craftengine'],
    'create_food': ['craftengine'],
    'create_block': ['craftengine'],
    'create_furniture': ['craftengine']
  }, { merge: true });
};