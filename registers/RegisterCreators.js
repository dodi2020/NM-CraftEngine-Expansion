module.exports = (nm) => {
  // Enable built-in creators for CraftEngine projects
  nm.postCreatorTypeCompatibilities({
<<<<<<< HEAD
    'create_item': ['craftengine'],
    'create_weapon': ['craftengine'],
    'create_tool': ['craftengine'],
    'create_armor': ['craftengine'],
    'create_food': ['craftengine'],
    'create_block': ['craftengine'],
=======
    'create_weapon': ['craftengine'],
    'create_block': ['craftengine'],
    'create_tool': ['craftengine'],
    'create_food': ['craftengine'],
    'create_item': ['craftengine'],
>>>>>>> 63ce9621209cb61262383f9443d1024bdf884edd
    'create_furniture': ['craftengine']
  }, { merge: true });
};