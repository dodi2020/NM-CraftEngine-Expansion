module.exports.init = async () => {
  const nm = api.nexomaker;
  const itemTransformer = api.require("./transformers/item.js");
  require('./registers/RegisterCreators.js')(nm);
  require('./registers/RegisterEditors.js')(nm);
  require('./registers/RegisterExportFormats.js')(nm, itemTransformer);

  api.nexomaker.postCreatorTypeCompatibilities({
    item: ['craftengine'],
    block: ['craftengine'],
    furniture: ['craftengine'],
    weapon: ['craftengine'],

    armor: ['craftengine'],
    food: ['craftengine'],
  });

  api.console.log('✅ CraftEngine expansion loaded.');
};

module.exports.metadata = {
  id: 'craftengine_expansion',
  version: '0.0.1-Alpha',
  author: 'TamashiiMon, DeonixxStudio',
};
