module.exports.init = async () => {
  const nm = api.nexomaker;
  const itemTransformer = require("./transformers/transformer.js");

  // Register compatibility for built-in creators
  require('./registers/RegisterCreators.js')(nm);

  // Register editor modules
  require('./registers/RegisterEditorModules.js')(nm, api);

  // Register export formats
  require('./registers/RegisterExportFormats.js')(nm, itemTransformer);

  // Register Attribute Modifier Builder as a background module (overlay)
  nm.registerBackgroundModule(
    'craftengine-attribute-builder',
    __dirname + '/pages/AttributeModifierBuilder.jsx',
    { zIndex: 2000 }
  );



  nm.regRoute('attributeBuilderVisible', __dirname + '/pages/AttributeModifierBuilder.jsx');



  // Add sidebar icon to toggle the builder
  nm.postSidebarIcon({
    id: 'craftengine-attribute-builder-btn',
    key: 'craftengine_attribute_builder_key',
    icon: 'assets/icons8-strength.png', // Attribute/strength icon
    tooltip: 'Attribute Modifier Builder',
    route: '/pages',
    page: 'attributeBuilderVisible',
});


  api.console.log('✓ CraftEngine expansion loaded.');
}

module.exports.metadata = {
  id: 'craftengine_expansion',
  version: '0.0.5-Alpha',
  author: 'dodi2020, TamashiiMon, DeonixxStudio',
};
