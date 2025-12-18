/*
    CraftEngine Support Expansion for Nexo Maker - Adding Support for the CraftEngine Minecraft Plugin to the Nexo Maker Application
    Copyright (C) 2025  Ido Ariel aka dodi2020

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
module.exports.init = async () => {
  const nm = api.nexomaker;
  const itemTransformer = require("./transformers/transformer.js");
  const strengthicon = await api.nexomaker.loadAsset(__dirname + "/assets/strength.png");
  const componenticon = await api.nexomaker.loadAsset(__dirname + "/assets/component.png");

  // Register compatibility for built-in creators
  require('./registers/RegisterCreators.js')(nm);

  // Register editor modules
  require('./registers/RegisterEditorModules.js')(nm, api);

  // Register export formats
  require('./registers/RegisterExportFormats.js')(nm, itemTransformer);

  // Register Attribute Modifier Builder Page
  nm.registerModularPage("craftengine-attribute-builder", __dirname + "/pages/AttributeModifierBuilder.jsx");
  nm.regRoute('AttributeBuilder', __dirname + '/pages/AttributeModifierBuilder.jsx');

  // Register Components Builder Page
  nm.registerModularPage("craftengine-components-builder", __dirname + "/pages/ComponentsBuilder.jsx");
  nm.regRoute('ComponentsBuilder', __dirname + '/pages/ComponentsBuilder.jsx');

  // Add sidebar icon for attribute builder
  nm.postSidebarIcon({
    id: 'craftengine-attribute-builder-btn',
    key: 'craftengine_attribute_builder_key',
    icon: strengthicon,
    button: "Attribute Builder",
    route: "/AttributeBuilder",
    page: "craftengine-attribute-builder"
  });

  // Add sidebar icon for components builder
  nm.postSidebarIcon({
    id: 'craftengine-components-builder-btn',
    key: 'craftengine_components_builder_key',
    icon: componenticon,
    button: "Component Builder",
    route: "/ComponentsBuilder",
    page: "craftengine-components-builder"
  });

//  // TEST BUTTONS - Remove these later
//  for (let i = 1; i <= 10; i++) {
//    nm.postSidebarIcon({
//      id: `craftengine-test-btn-${i}`,
//      key: `craftengine_test_key_${i}`,
//      icon: i % 2 === 0 ? componenticon : strengthicon,
//      button: `Test Button ${i}`,
//      route: `/Test${i}`,
//      page: "craftengine-attribute-builder"
//    });
//  }

  // Register Attribute Builder Overlay
  nm.registerBackgroundModule("craftengine-attribute-overlay", __dirname + "/overlays/AttributeBuilderOverlay.jsx", {
    zIndex: 2000
  });

  // Register Components Builder Overlay (for future use when NexoMaker adds functionality)
  nm.registerBackgroundModule("craftengine-components-overlay", __dirname + "/overlays/ComponentsBuilderOverlay.jsx", {
    zIndex: 2000
  });

  api.console.log('✓ CraftEngine expansion loaded.');
}

module.exports.metadata = {
  id: 'craftengine_expansion',
  version: '1.0.0',
  author: 'dodi2020',
};
