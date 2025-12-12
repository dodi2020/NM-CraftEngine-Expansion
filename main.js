module.exports.init = async () => {
  const nm = api.nexomaker;
  const itemTransformer = require("./transformers/item.js");
  
  // Register compatibility for built-in creators
  require('./registers/RegisterCreators.js')(nm);

  // Register export formats
  require('./registers/RegisterExportFormats.js')(nm, itemTransformer);

  api.console.log(' CraftEngine expansion loaded.');
};

module.exports.metadata = {
  id: 'craftengine_expansion',
  version: '0.0.2-Alpha',
  author: 'TamashiiMon, DeonixxStudio, dodi2020',
};