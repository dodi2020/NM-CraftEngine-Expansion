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

  // Make transformer globally available using globalThis (works in both Node and browser)
  if (!globalThis.craftengine) {
    globalThis.craftengine = {};
  }
  globalThis.craftengine.transformer = itemTransformer;
  api.console.log('[CraftEngine] Transformer set on globalThis.craftengine');

  // Register builder button components for editor modules
  nm.registerModularPage("AttributeBuilderButton", __dirname + "/elements/AttributeBuilderButton.jsx");
  nm.registerModularPage("ComponentsBuilderButton", __dirname + "/elements/ComponentsBuilderButton.jsx");
  nm.registerModularPage("EnchantmentBuilderButton", __dirname + "/elements/EnchantmentBuilderButton.jsx");
  nm.registerModularPage("CraftingOverlay", __dirname + "/elements/CraftingOverlay.jsx");
  nm.registerModularPage("InlineYamlEditor", __dirname + "/elements/InlineYamlEditor.jsx");

  // Register compatibility for built-in creators
  require('./registers/RegisterCreators.js')(nm);

  // Register editor modules
  require('./registers/RegisterEditorModules.js')(nm, api);

  // Register export formats
  require('./registers/RegisterExportFormats.js')(nm, itemTransformer);



  api.console.log('✓ CraftEngine expansion loaded.');
}

module.exports.metadata = {
  id: 'craftengine_expansion',
  version: '1.8.0',
  author: 'dodi2020',
};
