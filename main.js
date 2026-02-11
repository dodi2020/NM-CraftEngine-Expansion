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
  const fs = require("fs");
  const path = require("path");
  const os = require("os");

  // ============================================================================
  // ASSET WRITING BRIDGE - TEMPORARILY DISABLED
  // ============================================================================
  // This function provides a bridge for the browser-based import wizard to write
  // binary asset files (PNG textures, JSON models) to the file system using
  // Node.js fs APIs.
  //
  // HOW IT WORKS:
  // 1. Browser uploads files and converts them to base64 data URLs
  // 2. ImportWizard calls this function with projectId, path, and base64 data
  // 3. Function decodes base64 and writes binary data using Node.js fs.writeFileSync
  //
  // CURRENT STATUS: This function exists but cannot be called from browser context
  // because:
  // - Expansion APIs don't allow adding custom methods to the api object
  // - Browser security prevents direct Node.js fs access
  // - No official NexoMaker API exists for binary file writing
  //
  // SOLUTION NEEDED: NexoMaker needs to add an official API like:
  //   api.nexomaker.writeBinaryFile({ projectId, fileName, base64Data })
  //
  // Once that API exists, the import wizard can use it directly instead of this
  // bridge function.
  //
  // This code is kept here as reference for when proper binary writing is added:
  /*
  api.craftengine = api.craftengine || {};
  api.craftengine.writeAssetFile = async (projectId, relativePath, base64Data) => {
    try {
      const projectsDir = path.join(os.homedir(), 'Documents', 'NexoMaker', 'Projects');
      const fullPath = path.join(projectsDir, projectId, relativePath);
      const dir = path.dirname(fullPath);
      
      // Create directory if it doesn't exist
      fs.mkdirSync(dir, { recursive: true });
      
      // Write file (decode base64 for images, write as-is for text)
      if (base64Data.startsWith('data:')) {
        // Data URL - extract base64 and decode
        const base64Content = base64Data.split(',')[1];
        const buffer = Buffer.from(base64Content, 'base64');
        fs.writeFileSync(fullPath, buffer);
      } else {
        // Plain text content
        fs.writeFileSync(fullPath, base64Data, 'utf8');
      }
      
      return { success: true, path: fullPath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  */
  // ============================================================================

  // Load transformers and expose to the browser UI
  api.transformers = {
    ItemTransformer: require("./transformers/ItemTransformer.js"),
    BlockTransformer: require("./transformers/BlockTransformer.js"),
    ArmorTransformer: require("./transformers/ArmorTransformer.js"),
    FurnitureTransformer: require("./transformers/FurnitureTransformer.js")
  };

  // Register builder button components for editor modules
  nm.registerModularPage("AttributeBuilderButton", __dirname + "/elements/AttributeBuilderButton.jsx");
  nm.registerModularPage("ComponentsBuilderButton", __dirname + "/elements/ComponentsBuilderButton.jsx");
  nm.registerModularPage("BehaviorBuilderButton", __dirname + "/elements/BehaviorBuilderButton.jsx");
  nm.registerModularPage("EnchantmentBuilderButton", __dirname + "/elements/EnchantmentBuilderButton.jsx");
  nm.registerModularPage("CraftingOverlay", __dirname + "/elements/CraftingOverlay.jsx");
  nm.registerModularPage("InlineYamlEditor", __dirname + "/elements/InlineYamlEditor.jsx");
  nm.registerModularPage("EventsConditionsBuilder", __dirname + "/elements/EventsConditionsBuilder.jsx");
  nm.registerModularPage("BlockStateEditor", __dirname + "/elements/BlockStateEditor.jsx");
  
  // ============================================================================
  // IMPORT WIZARD - TEMPORARILY DISABLED
  // ============================================================================
  // The import wizard allows importing CraftEngine resources/configurations into
  // NexoMaker format. It parses YAML files, detects assets, transforms module data,
  // and creates the proper folder structure.
  //
  // CURRENT LIMITATION: Browser context cannot write binary PNG files properly.
  // The api.nexomaker.yaml.writeFile() method is designed for text/YAML content
  // and corrupts binary image data even when base64-encoded.
  //
  // SOLUTION NEEDED: NexoMaker needs to add a proper binary file writing API
  // (e.g., api.nexomaker.writeFile() with binary support) before the import
  // wizard can automatically copy texture/model assets.
  //
  // TEMPORARY WORKAROUND: Users must manually copy PNG/JSON files from their
  // CraftEngine resourcepack to match the folder structure created by the importer.
  //
  // Uncomment these lines once binary file writing is supported:
  // nm.registerModularPage("ImportWizard", __dirname + "/elements/ImportWizard.jsx");
  // nm.regRoute('CraftEngineImport', __dirname + '/elements/ImportWizard.jsx');
  // ============================================================================

  // Register compatibility for built-in creators
  require('./registers/RegisterCreators.js')(nm);

  // Register editor modules
  require('./registers/RegisterEditorModules.js')(nm, api);
  
  // Register behavior modules
  await require('./registers/RegisterBehaviorModules.js')(nm, api);

  // Register export formats
  require('./registers/RegisterExportFormats.js')(nm, itemTransformer);

  // ============================================================================
  // IMPORT WIZARD SIDEBAR BUTTON - TEMPORARILY DISABLED
  // ============================================================================
  // This sidebar button provides quick access to the CraftEngine import wizard.
  // Users can click it to open the import interface and upload their CraftEngine
  // resources folder for automatic parsing and conversion.
  //
  // DISABLED REASON: Import wizard is temporarily disabled (see above) due to
  // browser limitations with binary file writing. Once NexoMaker adds proper
  // binary file APIs, uncomment this section along with the import wizard
  // registration above.
  //
  // Uncomment this entire try-catch block once binary file writing is supported:
  /*
  try {
    const importIcon = await api.nexomaker.loadAsset(__dirname + "/assets/import.png");
    api.nexomaker.postSidebarIcon({
      button: "Import CraftEngine",
      key: "craftengine-import-wizard",
      icon: importIcon,
      route: "/CraftEngineImport",
      page: "ImportWizard"
    });
  } catch (e) {
    api.console.log('Import sidebar icon not registered:', e.message);
  }
  */
  // ============================================================================

  api.console.log('✓ CraftEngine expansion loaded.');
}

module.exports.metadata = {
  id: 'craftengine_expansion',
  version: '1.8.0',
  author: 'dodi2020',
  apiKey: 'nmk_dN4cTbjm9TNdRjqyg1NYjcGGwc6L67JH_FgDBWXdRn8'
};
