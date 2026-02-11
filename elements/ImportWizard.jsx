/**
 * Import Wizard (File-upload based)
 * Allows users to upload a CraftEngine `resources/` folder via directory upload
 * and import items/blocks/armor/furniture into the current project.
 */

module.exports = ({ useState, useEffect, api, usePlaceholders }) => {
  const [filesMap, setFilesMap] = useState({});
  const placeholders = usePlaceholders();
  
  // Untransform function for items (converts CraftEngine format to NexoMaker modules)
  const untransformItem = (exportedData) => {
    const modules = {};
    
    // Don't set baseMaterial - NexoMaker uses top-level material field
    
    if (exportedData.behavior && typeof exportedData.behavior === 'object') {
      const behaviorYaml = [];
      for (const [key, value] of Object.entries(exportedData.behavior)) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          behaviorYaml.push(`${key}:`);
          for (const [k, v] of Object.entries(value)) {
            if (typeof v === 'object' && !Array.isArray(v)) {
              behaviorYaml.push(`  ${k}:`);
              for (const [k2, v2] of Object.entries(v)) {
                behaviorYaml.push(`    ${k2}: ${v2}`);
              }
            } else {
              behaviorYaml.push(`  ${k}: ${v}`);
            }
          }
        } else {
          behaviorYaml.push(`${key}: ${value}`);
        }
      }
      modules.craftengine_behavior = behaviorYaml.join('\n');
    }
    
    // Don't store asset paths in modules - NexoMaker auto-detects from assets/ folder
    
    if (exportedData.data) {
      const data = exportedData.data;
      
      // Keep components in original CraftEngine format
      if (data.components && typeof data.components === 'object') {
        const componentLines = [];
        for (const [key, value] of Object.entries(data.components)) {
          // Remove minecraft: prefix for the YAML output
          const cleanKey = key.replace(/^minecraft:/, '');
          componentLines.push(`${key}:`);
          if (typeof value === 'object' && !Array.isArray(value)) {
            for (const [k, v] of Object.entries(value)) {
              componentLines.push(`${k}: ${v}`);
            }
          } else {
            componentLines.push(`${value}`);
          }
        }
        if (componentLines.length > 0) {
          modules.craftengine_customComponents = componentLines.join('\n');
        }
      }
      
      if (data['item-name']) modules.craftengine_itemName = data['item-name'];
    }
    
    if (exportedData.settings) {
      const settings = exportedData.settings;
      if (settings.recipe) modules.recipe = settings.recipe;
      if (settings['fuel-time']) modules.craftengine_fuelTime = settings['fuel-time'];
      if (settings.repairable) modules.repairable = settings.repairable;
      if (settings['consume-replacement']) modules.craftengine_consumeReplacement = settings['consume-replacement'];
      if (settings['craft-remainder']) modules.craftengine_craftRemainder = settings['craft-remainder'];
    }
    
    return modules;
  };
  
  // Untransform function for blocks
  const untransformBlock = (exportedData) => {
    const modules = {};
    
    if (exportedData.material) {
      modules.baseMaterial = exportedData.material.toUpperCase();
    }
    
    if (exportedData.behavior && typeof exportedData.behavior === 'object') {
      const behaviorYaml = [];
      for (const [key, value] of Object.entries(exportedData.behavior)) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          behaviorYaml.push(`${key}:`);
          for (const [k, v] of Object.entries(value)) {
            behaviorYaml.push(`  ${k}: ${v}`);
          }
        } else {
          behaviorYaml.push(`${key}: ${value}`);
        }
      }
      modules.craftengine_behavior = behaviorYaml.join('\n');
    }
    
    if (exportedData.behaviors && Array.isArray(exportedData.behaviors)) {
      const behaviorsYaml = exportedData.behaviors.map(b => {
        const lines = [];
        for (const [key, value] of Object.entries(b)) {
          if (typeof value === 'object' && !Array.isArray(value)) {
            lines.push(`${key}:`);
            for (const [k, v] of Object.entries(value)) {
              lines.push(`  ${k}: ${v}`);
            }
          } else {
            lines.push(`${key}: ${value}`);
          }
        }
        return lines.join('\n');
      });
      modules.craftengine_behaviors = behaviorsYaml.join('\n---\n');
    }
    
    // Don't store asset paths in modules - NexoMaker auto-detects from assets/ folder
    
    return modules;
  };
  
  // Untransform function for furniture
  const untransformFurniture = (exportedData) => {
    const modules = {};
    
    if (exportedData.material) {
      modules.baseMaterial = exportedData.material.toUpperCase();
    }
    
    if (exportedData.behavior && typeof exportedData.behavior === 'object') {
      const behaviorYaml = [];
      for (const [key, value] of Object.entries(exportedData.behavior)) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          behaviorYaml.push(`${key}:`);
          for (const [k, v] of Object.entries(value)) {
            behaviorYaml.push(`  ${k}: ${v}`);
          }
        } else {
          behaviorYaml.push(`${key}: ${value}`);
        }
      }
      modules.craftengine_behavior = behaviorYaml.join('\n');
    }
    
    // Don't store asset paths in modules - NexoMaker auto-detects from assets/ folder
    
    return modules;
  };
  
  // Helper to download a file from base64/data URL
  const downloadFile = (dataUrl, filename) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const [discovered, setDiscovered] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [namespaceOverride, setNamespaceOverride] = useState('');
  const [selectedIds, setSelectedIds] = useState({});
  const [itemTypeFilter, setItemTypeFilter] = useState({ items: true, blocks: true, armor: true, furniture: true });
  const [expandedItems, setExpandedItems] = useState({});
  const [showInstructions, setShowInstructions] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [lastClickedItem, setLastClickedItem] = useState(null);
  const [itemListHeight, setItemListHeight] = useState(400);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, status: '' });
  const [conflicts, setConflicts] = useState([]);
  const [conflictResolutions, setConflictResolutions] = useState({});
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const fileInputRef = { current: null };

  const handleFilesSelected = async (e) => {
    const list = e.target.files;
    if (!list || list.length === 0) return;
    setScanning(true);
    try {
      const entries = Array.from(list);
      const map = {};
      await Promise.all(entries.map(file => new Promise((res) => {
        const path = (file.webkitRelativePath || file.name).replace(/\\/g, '/');
        const ext = path.split('.').pop().toLowerCase();
        
        // Read binary files (images) as data URLs, text files as text
        const isBinary = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext);
        const reader = new FileReader();
        
        reader.onload = () => {
          map[path] = reader.result;
          res();
        };
        reader.onerror = () => res();
        
        if (isBinary) {
          reader.readAsDataURL(file); // Base64 data URL for images
        } else {
          reader.readAsText(file); // Text for YAML/JSON
        }
      })));
      setFilesMap(map);
      scanFiles(map);
    } catch (err) {
      console.error('ImportWizard: file read failed', err);
    } finally {
      setScanning(false);
    }
  };

  const validateItem = (parsed, type) => {
    const errors = [];
    
    // Basic YAML structure validation - just ensure we have a valid object
    if (!parsed || typeof parsed !== 'object') {
      errors.push('Invalid YAML structure');
      return errors;
    }
    
    // Only check for material field - everything else is optional
    // Items can be vanilla (no custom assets) or fully custom
    if (!parsed.material && !parsed.Material) {
      errors.push('Missing required field: material');
    }
    
    // For blocks, state configuration is recommended but not required
    // User might add it later in NexoMaker
    
    return errors;
  };

  const parseYamlSimple = (text) => {
    const lines = text.split('\n');
    const obj = {};
    const stack = [{ indent: -1, obj, isArray: false }];
    
    for (let raw of lines) {
      const line = raw.replace(/\r$/, '');
      if (!line.trim() || line.trim().startsWith('#')) continue;
      
      const indent = line.search(/\S/);
      const trimmed = line.trim();
      
      // Handle array items (lines starting with -)
      if (trimmed.startsWith('-')) {
        const rest = trimmed.slice(1).trim();
        
        // Pop stack until we find the right parent
        while (stack.length > 1 && indent <= stack[stack.length-1].indent) stack.pop();
        
        const parent = stack[stack.length-1].obj;
        
        if (!Array.isArray(parent.__array)) {
          parent.__array = [];
        }
        
        if (rest.includes(':')) {
          // Array item with key-value (e.g., "- on: right_click")
          const colonIdx = rest.indexOf(':');
          const key = rest.slice(0, colonIdx).trim();
          let val = rest.slice(colonIdx + 1).trim();
          
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
          if (val === 'true') val = true;
          else if (val === 'false') val = false;
          else if (!isNaN(Number(val)) && val !== '') val = Number(val);
          
          const itemObj = { [key]: val };
          parent.__array.push(itemObj);
          stack.push({ indent, obj: itemObj, isArray: false });
        } else if (rest) {
          // Simple array item (e.g., "- item1")
          parent.__array.push(rest);
        } else {
          // Array item without inline value, next lines define object
          const itemObj = {};
          parent.__array.push(itemObj);
          stack.push({ indent, obj: itemObj, isArray: false });
        }
        continue;
      }
      
      // Handle key-value or object definitions
      if (trimmed.endsWith(':')) {
        const key = trimmed.slice(0, -1);
        
        // Pop stack to correct level
        while (stack.length > 1 && indent <= stack[stack.length-1].indent) stack.pop();
        
        const node = {};
        stack[stack.length-1].obj[key] = node;
        stack.push({ indent, obj: node, isArray: false });
      } else {
        const colon = trimmed.indexOf(':');
        if (colon !== -1) {
          const key = trimmed.slice(0, colon).trim();
          let val = trimmed.slice(colon + 1).trim();
          
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
          if (val === 'true') val = true;
          else if (val === 'false') val = false;
          else if (!isNaN(Number(val)) && val !== '') val = Number(val);
          
          // Pop stack to correct level
          while (stack.length > 1 && indent <= stack[stack.length-1].indent) stack.pop();
          
          stack[stack.length-1].obj[key] = val;
        }
      }
    }
    
    // Convert __array markers to actual arrays
    const cleanArrays = (obj) => {
      if (typeof obj !== 'object' || obj === null) return obj;
      if (Array.isArray(obj)) return obj.map(cleanArrays);
      
      const cleaned = {};
      for (const key in obj) {
        if (key === '__array') {
          return obj.__array.map(cleanArrays);
        }
        cleaned[key] = cleanArrays(obj[key]);
      }
      return cleaned;
    };
    
    return cleanArrays(obj);
  };

  const extractYamlSegment = (fullYaml, itemKey) => {
    // Extract just the YAML segment for this specific item
    const lines = fullYaml.split('\n');
    const result = [];
    let capturing = false;
    let baseIndent = -1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Find the start of this item
      if (trimmed.startsWith(itemKey + ':') || trimmed === itemKey + ':') {
        capturing = true;
        baseIndent = line.search(/\S/);
        result.push(line);
        continue;
      }
      
      if (capturing) {
        const indent = line.search(/\S/);
        
        // Stop if we hit another item at the same or lower indent level
        if (trimmed && indent <= baseIndent && !line.startsWith(' ')) {
          break;
        }
        
        // Stop if we hit another top-level key at same indent
        if (indent === baseIndent && trimmed.endsWith(':') && i > 0) {
          break;
        }
        
        result.push(line);
      }
    }
    
    return result.join('\n');
  };

  const scanFiles = (map) => {
    const results = [];
    
    // Scan ALL YAML files under resources/ folder, regardless of subfolder structure
    Object.keys(map).forEach(path => {
      // Skip if not under resources/ or not a YAML file
      if (!path.includes('resources/') || !path.match(/\.(ya?ml)$/i)) return;
      
      // Skip resourcepack files (only scan configuration files)
      if (path.includes('/resourcepack/')) return;
      
      try {
        const raw = map[path];
        const parsed = parseYamlSimple(raw);
        
        // Try to extract namespace from path (first folder after resources/)
        const pathMatch = path.match(/resources\/([^\/]+)\//);
        const defaultNamespace = pathMatch ? pathMatch[1] : 'unknown';
        
        // Get filename without extension
        const filenameParts = path.split('/');
        const filename = filenameParts[filenameParts.length - 1].replace(/\.(ya?ml)$/i, '');
        
        // Check if this file has a top-level items/blocks/armor key with multiple items
        const itemTypeKeys = ['items', 'blocks', 'armor'];
        
        for (const typeKey of itemTypeKeys) {
          if (parsed[typeKey] && typeof parsed[typeKey] === 'object') {
            // Multi-item file
            Object.keys(parsed[typeKey]).forEach(itemId => {
              const itemConfig = parsed[typeKey][itemId];
              if (typeof itemConfig === 'object') {
                // Extract namespace from itemId if it contains a colon
                let finalId = itemId;
                let finalNamespace = defaultNamespace;
                
                if (itemId.includes(':')) {
                  const parts = itemId.split(':');
                  finalNamespace = parts[0];
                  finalId = parts.slice(1).join(':');
                }
                
                const assets = detectAssetsForId(map, finalNamespace, typeKey, finalId, itemConfig);
                const validationErrors = validateItem(itemConfig, typeKey);
                const itemYaml = extractYamlSegment(raw, itemId);
                
                results.push({ 
                  id: finalId, 
                  namespace: finalNamespace, 
                  type: typeKey, 
                  path: `${path}#${itemId}`, 
                  raw: itemYaml || JSON.stringify(itemConfig, null, 2),
                  parsed: itemConfig, 
                  assets, 
                  validationErrors, 
                  valid: validationErrors.length === 0 
                });
              }
            });
            return; // Skip single-item processing for this file
          }
        }
        
        // Single item file - try to detect type from content or path
        let detectedType = 'items'; // default
        
        // Try to detect type from path
        if (path.includes('/blocks/')) detectedType = 'blocks';
        else if (path.includes('/armor/')) detectedType = 'armor';
        else if (path.includes('/furniture/')) detectedType = 'furniture';
        
        // Or detect from content
        if (parsed.behavior?.type === 'furniture_item') detectedType = 'furniture';
        else if (parsed.behavior?.type === 'block') detectedType = 'blocks';
        else if (parsed.armor_type || parsed.material?.includes('_HELMET') || parsed.material?.includes('_CHESTPLATE')) detectedType = 'armor';
        
        // Extract ID from filename or parsed data
        const id = parsed.id || filename;
        const namespace = parsed.namespace || defaultNamespace;
        
        const assets = detectAssetsForId(map, namespace, detectedType, id, parsed);
        const validationErrors = validateItem(parsed, detectedType);
        
        results.push({ 
          id, 
          namespace, 
          type: detectedType, 
          path, 
          raw, 
          parsed, 
          assets, 
          validationErrors, 
          valid: validationErrors.length === 0 
        });
      } catch (e) {
        console.warn('Failed to parse', path, ':', e.message);
      }
    });
    
    setDiscovered(results);
    const sel = {};
    results.forEach(r => { sel[`${r.namespace}:${r.id}`] = true; });
    setSelectedIds(sel);
  };

  const detectAssetsForId = (map, namespace, type, id, parsedData) => {
    const textures = [];
    const models = [];
    const allTextures = [];
    const allModels = [];
    
    // Build list of ALL texture and model files in resourcepack
    Object.keys(map).forEach(p => {
      if (p.includes('/resourcepack/')) {
        if (p.endsWith('.png') || p.endsWith('.jpg') || p.endsWith('.jpeg')) {
          allTextures.push(p);
        } else if (p.endsWith('.json')) {
          allModels.push(p);
        }
      }
    });
    
    // Extract exact asset references from the parsed YAML
    if (parsedData) {
      // Collect all texture references
      const textureRefs = [];
      if (parsedData.texture) {
        if (typeof parsedData.texture === 'string') {
          textureRefs.push(parsedData.texture);
        } else if (parsedData.texture.path) {
          textureRefs.push(parsedData.texture.path);
        }
      }
      if (parsedData.textures) {
        if (Array.isArray(parsedData.textures)) {
          textureRefs.push(...parsedData.textures);
        } else if (typeof parsedData.textures === 'object') {
          Object.values(parsedData.textures).forEach(t => {
            if (typeof t === 'string') textureRefs.push(t);
          });
        }
      }
      if (parsedData.data?.texture) textureRefs.push(parsedData.data.texture);
      
      console.log('[detectAssets]', id, 'texture refs:', textureRefs);
      
      // Collect all model references
      const modelRefs = [];
      if (parsedData.model) {
        if (typeof parsedData.model === 'string') {
          modelRefs.push(parsedData.model);
        } else if (parsedData.model.path) {
          modelRefs.push(parsedData.model.path);
        }
      }
      if (parsedData.models) {
        if (Array.isArray(parsedData.models)) {
          modelRefs.push(...parsedData.models);
        } else if (typeof parsedData.models === 'object') {
          Object.values(parsedData.models).forEach(m => {
            if (typeof m === 'string') modelRefs.push(m);
          });
        }
      }
      if (parsedData.states?.model?.path) modelRefs.push(parsedData.states.model.path);
      
      console.log('[detectAssets]', id, 'model refs:', modelRefs);
      
      // Match textures by exact filename from references
      for (const ref of textureRefs) {
        // Convert "dodi_craftengine_pack:item/cheese" to "cheese"
        const parts = ref.split(':');
        const pathPart = parts.length > 1 ? parts[1] : parts[0];
        const filename = pathPart.split('/').pop();
        
        console.log('[detectAssets] Looking for texture:', filename);
        
        // Find exact match (case-insensitive)
        for (const p of allTextures) {
          const assetFilename = p.split('/').pop().replace(/\.(png|jpg|jpeg)$/i, '');
          if (assetFilename.toLowerCase() === filename.toLowerCase() && !textures.includes(p)) {
            textures.push(p);
            console.log('[detectAssets] Matched texture:', p);
          }
        }
      }
      
      // Match models by exact filename from references
      for (const ref of modelRefs) {
        // Convert "minecraft:block/voltanium_crucible/crucible_level_0" to "crucible_level_0"
        const parts = ref.split(':');
        const pathPart = parts.length > 1 ? parts[1] : parts[0];
        const filename = pathPart.split('/').pop();
        
        console.log('[detectAssets] Looking for model:', filename);
        
        // Find exact match (case-insensitive)
        for (const p of allModels) {
          const assetFilename = p.split('/').pop().replace(/\.json$/i, '');
          if (assetFilename.toLowerCase() === filename.toLowerCase() && !models.includes(p)) {
            models.push(p);
            console.log('[detectAssets] Matched model:', p);
          }
        }
      }
    }
    
    console.log('[detectAssets]', id, 'final textures:', textures, 'final models:', models);
    return { textures, models, texture: textures[0], model: models[0] };
  };

  const toggleSelect = (key) => {
    const s = { ...selectedIds };
    s[key] = !s[key];
    setSelectedIds(s);
  };

  const handleItemClick = (key, item, event) => {
    if (event.shiftKey && lastClickedItem) {
      // Shift+click: select range
      const allItems = filteredDiscovered;
      const startIdx = allItems.findIndex(d => `${d.namespace}:${d.id}` === lastClickedItem);
      const endIdx = allItems.findIndex(d => `${d.namespace}:${d.id}` === key);
      
      if (startIdx !== -1 && endIdx !== -1) {
        const [start, end] = startIdx < endIdx ? [startIdx, endIdx] : [endIdx, startIdx];
        const newSel = { ...selectedIds };
        for (let i = start; i <= end; i++) {
          const item = allItems[i];
          if (item.valid) {
            newSel[`${item.namespace}:${item.id}`] = true;
          }
        }
        setSelectedIds(newSel);
      }
    } else if (event.ctrlKey || event.metaKey) {
      // Ctrl+click: toggle individual
      toggleSelect(key);
      setLastClickedItem(key);
    } else {
      // Normal click: toggle
      toggleSelect(key);
      setLastClickedItem(key);
    }
  };

  const toggleExpanded = (key) => {
    const e = { ...expandedItems };
    e[key] = !e[key];
    setExpandedItems(e);
  };

  const checkConflicts = async (projectId) => {
    try {
      const response = await api.nexomaker.item.readAll(projectId);
      const existingItems = response?.data?.contents || [];
      const existingMap = {};
      existingItems.forEach(item => {
        const id = item.data?.id;
        const ns = item.data?.namespace || 'default';
        if (id) existingMap[`${ns}:${id}`] = item.data;
      });
      
      const toImport = discovered.filter(d => selectedIds[`${d.namespace}:${d.id}`]);
      const conflictList = [];
      toImport.forEach(item => {
        const finalNs = namespaceOverride || item.namespace;
        const key = `${finalNs}:${item.id}`;
        if (existingMap[key]) {
          conflictList.push({
            key,
            importItem: item,
            existingItem: existingMap[key],
            resolution: 'skip'
          });
        }
      });
      
      setConflicts(conflictList);
      const resolutions = {};
      conflictList.forEach(c => { resolutions[c.key] = 'skip'; });
      setConflictResolutions(resolutions);
      
      return conflictList;
    } catch (e) {
      console.error('Conflict check failed', e);
      return [];
    }
  };

  const handleStartImport = async () => {
    const route = window.location.hash || window.location.pathname;
    const projectIdMatch = route.match(/\/project\/([^\/]+)/);
    if (!projectIdMatch) return alert('Cannot determine project id from route');
    const projectId = projectIdMatch[1];

    const toImport = discovered.filter(d => selectedIds[`${d.namespace}:${d.id}`]);
    if (toImport.length === 0) return alert('No items selected');
    
    // Check for conflicts first
    const conflictList = await checkConflicts(projectId);
    if (conflictList.length > 0) {
      setShowConflictModal(true);
      return;
    }
    
    // No conflicts, proceed
    await doImport(projectId);
  };

  const handleImport = async () => {
    const route = window.location.hash || window.location.pathname;
    const projectIdMatch = route.match(/\/project\/([^\/]+)/);
    if (!projectIdMatch) return;
    const projectId = projectIdMatch[1];
    setShowConflictModal(false);
    await doImport(projectId);
  };

  const doImport = async (projectId) => {
    const toImport = discovered.filter(d => selectedIds[`${d.namespace}:${d.id}`]);
    setImporting(true);
    setProgress({ current: 0, total: toImport.length, status: 'Starting' });
    const results = { imported: [], skipped: [], errors: [] };
    
    // Track which meta.yml files we've already created
    const createdMetas = new Set();
    
    for (let i = 0; i < toImport.length; i++) {
      const item = toImport[i];
      const finalNs = namespaceOverride || item.namespace;
      const key = `${finalNs}:${item.id}`;
      
      setProgress({ current: i + 1, total: toImport.length, status: key });
      
      // Check if this item has a conflict resolution
      const resolution = conflictResolutions[key];
      if (resolution === 'skip') {
        results.skipped.push({ id: item.id, reason: 'Conflict - skipped by user' });
        continue;
      }
      
      // Skip invalid items
      if (!item.valid) {
        results.skipped.push({ id: item.id, reason: `Validation errors: ${item.validationErrors.join(', ')}` });
        continue;
      }
      
      try {
        console.log(`[ImportWizard] Processing ${item.id} (${item.type})`);
        console.log('[ImportWizard] Input data:', item.parsed);
        
        let modules = {};
        try {
          if (item.type === 'items') {
            modules = untransformItem(item.parsed || {});
          } else if (item.type === 'blocks') {
            modules = untransformBlock(item.parsed || {});
          } else if (item.type === 'furniture') {
            modules = untransformFurniture(item.parsed || {});
          } else if (item.type === 'armor') {
            modules = untransformItem(item.parsed || {}); // Use item transformer for armor
          }
          console.log('[ImportWizard] Output modules:', modules);
        } catch (e) {
          console.warn('[ImportWizard] Untransform failed for', item.id, ':', e.message, e.stack);
          modules = {};
        }
        
        // Don't add asset path modules - NexoMaker auto-detects from assets/ folder
        
        let finalId = item.id;
        let finalNamespace = namespaceOverride || item.namespace;
        
        // Handle rename resolution
        if (resolution && resolution.startsWith('rename:')) {
          finalId = resolution.split(':')[1];
        }
        
        // Detect subtype based on modules
        let subtype = 'item';
        if (modules.nutrition || modules.saturation) {
          subtype = 'food';
        } else if (modules.craftengine_behavior && modules.craftengine_behavior.includes('block_item')) {
          subtype = 'block';
        } else if (modules.craftengine_behavior && modules.craftengine_behavior.includes('furniture_item')) {
          subtype = 'furniture';
        } else if (item.type === 'blocks') {
          subtype = 'block';
        } else if (item.type === 'furniture') {
          subtype = 'furniture';
        } else if (item.type === 'armor') {
          subtype = 'armor';
        }
        
        const newItem = {
          id: finalId,
          namespace: finalNamespace,
          display: modules.craftengine_itemName || finalId,
          material: (item.parsed.material || 'PAPER').toUpperCase(),
          parent: 'item/generated',
          type: 'item',
          subtype: subtype,
          modules: modules,
          assets: [] // Will be populated as we add asset references
        };
        
        // Get pack name for proper folder structure
        // NexoMaker requires: Data/{PackName}/{namespace}/{item_id}/item.yml
        const packName = finalNamespace.charAt(0).toUpperCase() + finalNamespace.slice(1) + '_Pack';
        
        // Create meta.yml for pack folder (only once per pack)
        const packMetaKey = `${packName}`;
        if (!createdMetas.has(packMetaKey)) {
          try {
            await api.nexomaker.yaml.writeFile({
              projectId,
              fileName: `ImportedItems/${packName}/meta.yml`,
              content: { id: packName, name: packName }
            });
            createdMetas.add(packMetaKey);
            console.log(`✓ Created pack meta: ${packName}`);
          } catch (e) {
            console.warn(`Failed to create pack meta for ${packName}:`, e.message);
          }
        }
        
        // Create meta.yml for namespace folder (only once per namespace)
        const namespaceMetaKey = `${packName}/${finalNamespace}`;
        if (!createdMetas.has(namespaceMetaKey)) {
          try {
            await api.nexomaker.yaml.writeFile({
              projectId,
              fileName: `ImportedItems/${packName}/${finalNamespace}/meta.yml`,
              content: { id: finalNamespace, name: finalNamespace }
            });
            createdMetas.add(namespaceMetaKey);
            console.log(`✓ Created namespace meta: ${finalNamespace}`);
          } catch (e) {
            console.warn(`Failed to create namespace meta for ${finalNamespace}:`, e.message);
          }
        }
        
        // Write to ImportedItems staging folder for manual copying
        // Path structure: ImportedItems/{PackName}/{namespace}/{item_id}/item.yml
        const fileName = `ImportedItems/${packName}/${finalNamespace}/${finalId}/item.yml`;
        
        // Browser cannot write binary PNG files properly - just track asset references
        if (item.assets.textures && item.assets.textures.length > 0) {
          for (const texturePath of item.assets.textures) {
            const textureName = texturePath.split('/').pop();
            newItem.assets.push(`textures:${textureName}`);
          }
        }
        
        if (item.assets.models && item.assets.models.length > 0) {
          for (const modelPath of item.assets.models) {
            const modelName = modelPath.split('/').pop();
            newItem.assets.push(`models:${modelName}`);
          }
        }
        
        // Write the item.yml
        await api.nexomaker.yaml.writeFile({
          projectId,
          fileName,
          content: newItem
        });
        
        results.imported.push({ key: `${finalNamespace}:${finalId}`, item: newItem });
      } catch (e) {
        console.error('Import failed for', item.id, e);
        results.errors.push({ id: item.id, error: e.message || String(e) });
      }
    }
    
    setImporting(false);
    setProgress({ current: 0, total: 0, status: 'Done' });
    setImportResult(results);
    setShowSummary(true);
  };
  
  const handleReloadProject = () => {
    // Extract project ID from current URL
    const route = window.location.hash || window.location.pathname;
    const projectIdMatch = route.match(/\/project\/([^\/]+)/);
    
    if (projectIdMatch) {
      const projectId = projectIdMatch[1];
      const targetRoute = `#/project/${projectId}`;
      
      // Navigate away to trigger reload
      window.location.hash = '#/';
      setTimeout(() => {
        // Then navigate to project home page
        window.location.hash = targetRoute;
      }, 100);
    }
  };

  const toggleFolder = (key) => {
    const e = { ...expandedFolders };
    e[key] = !e[key];
    setExpandedFolders(e);
  };

  const handleInverseSelection = () => {
    const newSel = { ...selectedIds };
    filteredDiscovered.forEach(d => {
      const key = `${d.namespace}:${d.id}`;
      newSel[key] = !newSel[key];
    });
    setSelectedIds(newSel);
  };

  const filteredDiscovered = discovered.filter(d => itemTypeFilter[d.type]);
  const selectedCount = Object.keys(selectedIds).filter(k => selectedIds[k] && filteredDiscovered.some(d => `${d.namespace}:${d.id}` === k)).length;

  return React.createElement('div', { style: { height: '100vh', overflow: 'auto' } },
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 12, padding: '20px 20px 80px 20px', maxWidth: 1200, margin: '0 auto', width: '100%' } },
      // Title
      React.createElement('h2', { style: { margin: 0 } }, 'CraftEngine Import Wizard'),
    
    // Instructions (collapsible)
    React.createElement('div', { style: { border: '1px solid var(--col-ouliner-default)', borderRadius: 6, padding: 12, background: 'var(--col-input-default)' } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }, onClick: () => setShowInstructions(!showInstructions) },
        React.createElement('h3', { style: { margin: 0 } }, 'How to Use'),
        React.createElement('span', null, showInstructions ? '▼' : '▶')
      ),
      showInstructions && React.createElement('div', { style: { marginTop: 12, fontSize: 14, lineHeight: 1.6 } },
        React.createElement('ol', { style: { margin: '8px 0', paddingLeft: 20 } },
          React.createElement('li', null, 'Click "Browse" and select your CraftEngine ', React.createElement('code', null, 'resources/'), ' folder'),
          React.createElement('li', null, 'Wait for scanning to complete'),
          React.createElement('li', null, 'Review discovered items and select which to import'),
          React.createElement('li', null, 'Optionally override namespace for all imported items'),
          React.createElement('li', null, 'Click "Import Selected" — conflicts will be detected automatically'),
          React.createElement('li', null, 'Review summary and verify items in your project')
        ),
        React.createElement('div', { style: { fontSize: 12, color: 'var(--col-txt-secondary)', marginTop: 8 } },
          React.createElement('strong', null, 'Expected folder structure:'),
          React.createElement('pre', { style: { background: 'rgba(0,0,0,0.1)', padding: 8, borderRadius: 4, marginTop: 4, fontSize: 11 } },
`resources/
  {namespace}/
    configuration/
      items/     (*.yml)
      blocks/
      armor/
      furniture/
    resourcepack/
      items/     (*.png, *.json)
      blocks/
      ...`
          )
        )
      )
    ),
    // Folder Upload
    React.createElement('div', { style: { display: 'flex', gap: 8, alignItems: 'center', padding: 12, border: '2px dashed var(--col-ouliner-default)', borderRadius: 6, background: 'var(--col-input-default)' } },
      React.createElement('label', { style: { fontWeight: 600, flex: 1 } }, '📁 Select CraftEngine resources folder:'),
      React.createElement('input', {
        type: 'file',
        webkitdirectory: '',
        mozdirectory: '',
        directory: '',
        multiple: true,
        onChange: handleFilesSelected,
        ref: (r) => fileInputRef.current = r,
        style: { display: 'none' },
        accept: ''
      }),
      React.createElement('button', { 
        onClick: () => { if (fileInputRef.current) fileInputRef.current.click(); }, 
        style: { padding: '8px 16px', background: 'var(--col-primary-form)', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 } 
      }, '📂 Select Folder'),
      scanning && React.createElement('span', { style: { marginLeft: 8 } }, '⏳ Scanning...')
    ),

    // Scan Results Summary
    discovered.length > 0 && React.createElement('div', { style: { padding: 12, background: 'var(--col-input-default)', borderRadius: 6, border: '1px solid var(--col-ouliner-default)' } },
      React.createElement('div', { style: { fontWeight: 600, marginBottom: 8 } }, `📦 Discovered ${discovered.length} items`),
      React.createElement('div', { style: { display: 'flex', gap: 16, fontSize: 14 } },
        React.createElement('div', null, `Items: ${discovered.filter(d => d.type === 'items').length}`),
        React.createElement('div', null, `Blocks: ${discovered.filter(d => d.type === 'blocks').length}`),
        React.createElement('div', null, `Armor: ${discovered.filter(d => d.type === 'armor').length}`),
        React.createElement('div', null, `Furniture: ${discovered.filter(d => d.type === 'furniture').length}`),
        React.createElement('div', { style: { color: 'var(--col-error)', marginLeft: 'auto' } }, `Invalid: ${discovered.filter(d => !d.valid).length}`)
      )
    ),

    // Item Type Filter & Controls
    discovered.length > 0 && React.createElement('div', { style: { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' } },
      React.createElement('div', { style: { fontWeight: 600 } }, 'Show:'),
      ['items', 'blocks', 'armor', 'furniture'].map(type => 
        React.createElement('label', { key: type, style: { display: 'flex', gap: 4, alignItems: 'center' } },
          React.createElement('input', { 
            type: 'checkbox', 
            checked: itemTypeFilter[type], 
            onChange: (e) => setItemTypeFilter({ ...itemTypeFilter, [type]: e.target.checked }) 
          }),
          type.charAt(0).toUpperCase() + type.slice(1)
        )
      ),
      React.createElement('div', { style: { marginLeft: 'auto', display: 'flex', gap: 8 } },
        React.createElement('button', { 
          onClick: () => { const sel = {}; filteredDiscovered.forEach(d => sel[`${d.namespace}:${d.id}`] = true); setSelectedIds(sel); }, 
          style: { padding: '6px 10px', fontSize: 13 } 
        }, 'Select All'),
        React.createElement('button', { 
          onClick: () => setSelectedIds({}), 
          style: { padding: '6px 10px', fontSize: 13 } 
        }, 'Deselect All'),
        React.createElement('button', { 
          onClick: handleInverseSelection, 
          style: { padding: '6px 10px', fontSize: 13 } 
        }, 'Inverse Selection')
      )
    ),

    // Namespace Override
    discovered.length > 0 && React.createElement('div', { style: { display: 'flex', gap: 8, alignItems: 'center' } },
      React.createElement('label', { style: { fontWeight: 600, minWidth: 180 } }, 'Namespace override:'),
      React.createElement('input', { 
        type: 'text', 
        value: namespaceOverride, 
        onChange: (e) => setNamespaceOverride(e.target.value), 
        placeholder: 'Leave blank to keep original namespaces', 
        style: { flex: 1, padding: '8px', borderRadius: 4, border: '1px solid var(--col-ouliner-default)', background: 'var(--col-input-default)' } 
      }),
      namespaceOverride && React.createElement('button', { onClick: () => setNamespaceOverride(''), style: { padding: '6px 10px' } }, '✕ Clear')
    ),

    // Discovered Items List
    React.createElement('div', { style: { position: 'relative' } },
      React.createElement('div', { 
        style: { 
          height: itemListHeight, 
          minHeight: 200,
          maxHeight: 800,
          overflow: 'auto', 
          border: '1px solid var(--col-ouliner-default)', 
          borderRadius: 6, 
          background: 'var(--col-input-default)',
          resize: 'vertical'
        } 
      },
      filteredDiscovered.length === 0 && React.createElement('div', { style: { padding: 20, textAlign: 'center', color: 'var(--col-txt-secondary)' } }, 
        discovered.length === 0 ? 'No items discovered yet. Upload a resources folder to begin.' : 'No items match the selected filters.'
      ),
      (() => {
        // Group items by namespace and type for folder structure
        const grouped = {};
        filteredDiscovered.forEach(d => {
          if (!grouped[d.namespace]) grouped[d.namespace] = {};
          if (!grouped[d.namespace][d.type]) grouped[d.namespace][d.type] = [];
          grouped[d.namespace][d.type].push(d);
        });
        
        return Object.keys(grouped).sort().map(namespace => 
          React.createElement('div', { key: namespace, style: { borderBottom: '1px solid var(--col-ouliner-default)' } },
            // Namespace folder header
            React.createElement('div', { 
              style: { 
                padding: '8px 12px', 
                background: 'rgba(0,0,0,0.05)', 
                fontWeight: 600, 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              },
              onClick: () => toggleFolder(namespace)
            },
              React.createElement('span', null, expandedFolders[namespace] ? '▼' : '▶'),
              React.createElement('span', null, expandedFolders[namespace] ? '📂' : '📁'),
              React.createElement('span', { style: { flex: 1 } }, namespace),
              React.createElement('span', { style: { fontSize: 12, fontWeight: 400, color: 'var(--col-txt-secondary)', marginRight: 8 } },
                `${Object.values(grouped[namespace]).flat().length} items`
              )
            ),
            
            // Show type folders if namespace is expanded
            expandedFolders[namespace] && Object.keys(grouped[namespace]).sort().map(type =>
              React.createElement('div', { key: `${namespace}-${type}` },
                // Type folder header
                React.createElement('div', { 
                  style: { 
                    padding: '6px 12px 6px 30px', 
                    background: 'rgba(0,0,0,0.03)', 
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 14
                  },
                  onClick: () => toggleFolder(`${namespace}-${type}`)
                },
                  React.createElement('span', null, expandedFolders[`${namespace}-${type}`] ? '▼' : '▶'),
                  React.createElement('span', { style: { flex: 1 } }, type),
                  React.createElement('span', { 
                    style: { 
                      fontSize: 11, 
                      padding: '1px 5px', 
                      borderRadius: 3, 
                      background: 'var(--col-primary-form)', 
                      color: 'white',
                      marginRight: 8
                    } 
                  }, grouped[namespace][type].length)
                ),
                
                // Show items if type folder is expanded
                expandedFolders[`${namespace}-${type}`] && grouped[namespace][type].map(d => {
                  const key = `${d.namespace}:${d.id}`;
                  const expanded = expandedItems[key];
                  return React.createElement('div', { 
                    key, 
                    style: { 
                      padding: '8px 12px 8px 50px', 
                      borderBottom: '1px solid rgba(0,0,0,0.03)',
                      background: !d.valid ? 'rgba(255,0,0,0.05)' : undefined
                    } 
                  },
                    React.createElement('div', { style: { display: 'flex', gap: 12, alignItems: 'center' } },
                      // Item data (left)
                      React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                        React.createElement('div', { style: { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 } },
                          React.createElement('span', { style: { fontWeight: 600, fontSize: 14 } }, d.id),
                          React.createElement('span', { style: { fontSize: 11, color: 'var(--col-txt-secondary)' } }, `${d.namespace}:${d.id}`)
                        ),
                        React.createElement('div', { style: { display: 'flex', gap: 12, fontSize: 12, color: 'var(--col-txt-secondary)' } },
                          d.assets.textures && d.assets.textures.length > 0 && React.createElement('span', { style: { color: 'green' } }, `✓ ${d.assets.textures.length} Texture${d.assets.textures.length > 1 ? 's' : ''}`),
                          d.assets.models && d.assets.models.length > 0 && React.createElement('span', { style: { color: 'green' } }, `✓ ${d.assets.models.length} Model${d.assets.models.length > 1 ? 's' : ''}`),
                          (!d.assets.textures || d.assets.textures.length === 0) && (!d.assets.models || d.assets.models.length === 0) && React.createElement('span', { style: { color: 'gray' } }, '○ Vanilla')
                        ),
                        !d.valid && React.createElement('div', { style: { color: 'var(--col-error)', fontSize: 12, marginTop: 2 } },
                          '⚠ ', d.validationErrors.join(', ')
                        )
                      ),
                      // YAML button
                      React.createElement('button', { 
                        onClick: () => toggleExpanded(key), 
                        style: { 
                          padding: '4px 10px', 
                          fontSize: 12, 
                          background: 'transparent', 
                          border: '1px solid var(--col-ouliner-default)', 
                          borderRadius: 4, 
                          cursor: 'pointer', 
                          flexShrink: 0,
                          whiteSpace: 'nowrap'
                        } 
                      }, expanded ? 'Hide' : 'YAML'),
                      // Checkbox (right)
                      React.createElement('label', { 
                        style: { 
                          display: 'flex', 
                          alignItems: 'center', 
                          cursor: d.valid ? 'pointer' : 'not-allowed',
                          margin: 0,
                          padding: 0,
                          flexShrink: 0
                        }
                      },
                        React.createElement('input', { 
                          type: 'checkbox', 
                          checked: !!selectedIds[key], 
                          onChange: (e) => handleItemClick(key, d, e),
                          disabled: !d.valid,
                          style: { 
                            width: 18,
                            height: 18,
                            margin: 0,
                            cursor: d.valid ? 'pointer' : 'not-allowed',
                            accentColor: 'var(--col-primary-form)',
                            borderRadius: 4
                          }
                        })
                      )
                    ),
                    expanded && React.createElement('pre', { 
                      style: { 
                        marginTop: 8, 
                        padding: 10, 
                        background: 'rgba(0,0,0,0.1)', 
                        borderRadius: 4, 
                        fontSize: 11, 
                        overflow: 'auto', 
                        maxHeight: 200,
                        fontFamily: 'monospace'
                      } 
                    }, d.raw)
                  );
                })
              )
            )
          )
        );
      })()
      ),
      // Resize handle indicator
      React.createElement('div', { 
        style: { 
          position: 'absolute', 
          bottom: 0, 
          right: 8, 
          fontSize: 10, 
          color: 'var(--col-txt-secondary)', 
          pointerEvents: 'none',
          padding: 2
        } 
      }, '⋮⋮')
    ),

    // Import Actions
    discovered.length > 0 && React.createElement('div', { style: { display: 'flex', gap: 12, alignItems: 'center', padding: 12, background: 'var(--col-input-default)', borderRadius: 6 } },
      React.createElement('button', { 
        onClick: handleStartImport, 
        disabled: importing || selectedCount === 0, 
        style: { 
          padding: '10px 20px', 
          background: importing ? 'gray' : 'var(--col-primary-form)', 
          color: 'white', 
          border: 'none', 
          borderRadius: 6, 
          cursor: importing || selectedCount === 0 ? 'not-allowed' : 'pointer',
          fontWeight: 600,
          fontSize: 14
        } 
      }, importing ? `Importing ${progress.current}/${progress.total}...` : `Import Selected (${selectedCount})`),
      importing && React.createElement('div', { style: { flex: 1 } },
        React.createElement('div', { style: { fontSize: 13, marginBottom: 4 } }, progress.status),
        React.createElement('div', { 
          style: { 
            width: '100%', 
            height: 6, 
            background: 'rgba(0,0,0,0.1)', 
            borderRadius: 3, 
            overflow: 'hidden' 
          } 
        },
          React.createElement('div', { 
            style: { 
              width: `${progress.total > 0 ? (progress.current / progress.total * 100) : 0}%`, 
              height: '100%', 
              background: 'var(--col-primary-form)', 
              transition: 'width 0.3s' 
            } 
          })
        )
      )
    ),

    // Conflict Modal
    showConflictModal && React.createElement('div', { 
      style: { 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: 'rgba(0,0,0,0.5)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 9999
      } 
    },
      React.createElement('div', { 
        style: { 
          background: 'var(--col-input-default)', 
          borderRadius: 8, 
          padding: 24, 
          maxWidth: 600, 
          maxHeight: '80vh', 
          overflow: 'auto',
          border: '2px solid var(--col-ouliner-default)'
        } 
      },
        React.createElement('h3', { style: { marginTop: 0 } }, `⚠️ Conflicts Detected (${conflicts.length})`),
        React.createElement('div', { style: { marginBottom: 16, color: 'var(--col-txt-secondary)' } }, 
          'The following items already exist in your project. Choose how to handle each conflict:'
        ),
        conflicts.map(c => React.createElement('div', { 
          key: c.key, 
          style: { 
            padding: 12, 
            marginBottom: 8, 
            border: '1px solid var(--col-ouliner-default)', 
            borderRadius: 6,
            background: 'rgba(255, 165, 0, 0.1)'
          } 
        },
          React.createElement('div', { style: { fontWeight: 600, marginBottom: 8 } }, c.key),
          React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } },
            React.createElement('button', { 
              onClick: () => setConflictResolutions({ ...conflictResolutions, [c.key]: 'skip' }),
              style: { 
                padding: '4px 10px', 
                background: conflictResolutions[c.key] === 'skip' ? 'var(--col-primary-form)' : 'transparent',
                color: conflictResolutions[c.key] === 'skip' ? 'white' : 'inherit',
                border: '1px solid var(--col-ouliner-default)',
                borderRadius: 4,
                cursor: 'pointer'
              }
            }, 'Skip'),
            React.createElement('button', { 
              onClick: () => setConflictResolutions({ ...conflictResolutions, [c.key]: 'overwrite' }),
              style: { 
                padding: '4px 10px', 
                background: conflictResolutions[c.key] === 'overwrite' ? 'var(--col-primary-form)' : 'transparent',
                color: conflictResolutions[c.key] === 'overwrite' ? 'white' : 'inherit',
                border: '1px solid var(--col-ouliner-default)',
                borderRadius: 4,
                cursor: 'pointer'
              }
            }, 'Overwrite'),
            React.createElement('input', {
              type: 'text',
              placeholder: 'New ID for rename',
              onBlur: (e) => { if (e.target.value) setConflictResolutions({ ...conflictResolutions, [c.key]: `rename:${e.target.value}` }); },
              style: { padding: '4px 8px', flex: 1, minWidth: 150, borderRadius: 4, border: '1px solid var(--col-ouliner-default)' }
            })
          )
        )),
        React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 16 } },
          React.createElement('button', { 
            onClick: handleImport,
            style: { 
              padding: '8px 16px', 
              background: 'var(--col-primary-form)', 
              color: 'white', 
              border: 'none', 
              borderRadius: 6, 
              cursor: 'pointer',
              fontWeight: 600
            } 
          }, 'Proceed with Import'),
          React.createElement('button', { 
            onClick: () => setShowConflictModal(false),
            style: { padding: '8px 16px', background: 'transparent', border: '1px solid var(--col-ouliner-default)', borderRadius: 6, cursor: 'pointer' } 
          }, 'Cancel')
        )
      )
    ),

    // Summary Modal
    showSummary && importResult && React.createElement('div', { 
      style: { 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: 'rgba(0,0,0,0.5)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 9999
      } 
    },
      React.createElement('div', { 
        style: { 
          background: 'var(--col-input-default)', 
          borderRadius: 8, 
          padding: 24, 
          maxWidth: 600, 
          maxHeight: '80vh', 
          overflow: 'auto',
          border: '2px solid var(--col-ouliner-default)'
        } 
      },
        React.createElement('h3', { style: { marginTop: 0 } }, '✅ Import Complete'),
        React.createElement('div', { style: { display: 'flex', gap: 20, marginBottom: 20, fontSize: 16 } },
          React.createElement('div', null, 
            React.createElement('div', { style: { fontWeight: 600, color: 'green' } }, importResult.imported.length),
            React.createElement('div', { style: { fontSize: 13, color: 'var(--col-txt-secondary)' } }, 'Imported')
          ),
          React.createElement('div', null, 
            React.createElement('div', { style: { fontWeight: 600, color: 'orange' } }, importResult.skipped.length),
            React.createElement('div', { style: { fontSize: 13, color: 'var(--col-txt-secondary)' } }, 'Skipped')
          ),
          React.createElement('div', null, 
            React.createElement('div', { style: { fontWeight: 600, color: 'red' } }, importResult.errors.length),
            React.createElement('div', { style: { fontSize: 13, color: 'var(--col-txt-secondary)' } }, 'Errors')
          )
        ),
        importResult.imported.length > 0 && React.createElement('div', { style: { marginBottom: 16 } },
          React.createElement('h4', { style: { margin: '8px 0' } }, 'Imported Items:'),
          React.createElement('div', { style: { maxHeight: 150, overflow: 'auto', fontSize: 13, padding: 8, background: 'rgba(0,255,0,0.05)', borderRadius: 4 } },
            importResult.imported.map(i => React.createElement('div', { key: i.key }, `✓ ${i.key}`))
          )
        ),
        importResult.skipped.length > 0 && React.createElement('div', { style: { marginBottom: 16 } },
          React.createElement('h4', { style: { margin: '8px 0' } }, 'Skipped Items:'),
          React.createElement('div', { style: { maxHeight: 150, overflow: 'auto', fontSize: 13, padding: 8, background: 'rgba(255,165,0,0.05)', borderRadius: 4 } },
            importResult.skipped.map((s, i) => React.createElement('div', { key: i }, `⊘ ${s.id}: ${s.reason}`))
          )
        ),
        importResult.errors.length > 0 && React.createElement('div', { style: { marginBottom: 16 } },
          React.createElement('h4', { style: { margin: '8px 0' } }, 'Errors:'),
          React.createElement('div', { style: { maxHeight: 150, overflow: 'auto', fontSize: 13, padding: 8, background: 'rgba(255,0,0,0.05)', borderRadius: 4 } },
            importResult.errors.map((e, i) => React.createElement('div', { key: i }, `✗ ${e.id}: ${e.error}`))
          )
        ),
        importResult.imported.length > 0 && React.createElement('div', { style: { marginTop: 16, padding: 16, background: 'rgba(33,150,243,0.1)', borderRadius: 6, border: '1px solid rgba(33,150,243,0.3)' } },
          React.createElement('h4', { style: { margin: '0 0 8px 0', color: 'var(--col-primary-form)' } }, '📁 Next Steps'),
          React.createElement('div', { style: { fontSize: 13, lineHeight: 1.6 } },
            React.createElement('p', { style: { margin: '0 0 8px 0' } }, 'Items have been saved to the ', React.createElement('strong', null, 'ImportedItems'), ' folder in your project directory.'),
            React.createElement('ol', { style: { margin: '8px 0', paddingLeft: 20 } },
              React.createElement('li', null, 'Navigate to ImportedItems folder (use Copy Path button below)'),
              React.createElement('li', null, 'Copy the Pack folder(s) inside (e.g., ', React.createElement('code', null, 'Namespace_Pack'), ')'),
              React.createElement('li', null, React.createElement('strong', null, 'Paste INTO your project\'s Data folder'), ' - do NOT copy ImportedItems itself'),
              React.createElement('li', null, React.createElement('strong', null, 'Manually copy texture/model files'), ' from your CraftEngine resourcepack to each item\'s assets folder'),
              React.createElement('li', null, 'Reload the project to see imported items')
            ),
            React.createElement('div', { style: { fontSize: 12, color: 'var(--col-txt-secondary)', marginTop: 8, padding: 8, background: 'rgba(255,193,7,0.1)', borderRadius: 4 } },
              React.createElement('strong', null, '⚠️ Assets: '), 'Browser cannot write binary PNG files. You must manually copy textures/models from your CraftEngine resourcepack\'s assets folder to match the folder structure in ImportedItems (each item has an assets/textures and assets/models folder).'
            ),
            React.createElement('div', { style: { marginTop: 12, padding: 10, background: 'rgba(0,0,0,0.2)', borderRadius: 4, fontFamily: 'monospace', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
              React.createElement('code', { style: { flex: 1, color: 'var(--col-txt-primary)' } }, 
                `Documents\\NexoMaker\\Projects\\{YourProject}\\ImportedItems`
              ),
              React.createElement('button', {
                onClick: () => {
                  const pathText = 'Documents\\NexoMaker\\Projects\\{YourProject}\\ImportedItems';
                  navigator.clipboard.writeText(pathText).then(() => {
                    alert('Path template copied! Replace {YourProject} with your actual project name.');
                  }).catch(err => {
                    console.error('Failed to copy:', err);
                    alert('Path: ' + pathText);
                  });
                },
                style: { padding: '4px 8px', fontSize: 11, background: 'var(--col-primary-form)', color: 'white', border: 'none', borderRadius: 3, cursor: 'pointer' }
              }, 'Copy Path')
            )
          )
        ),
        React.createElement('div', { style: { display: 'flex', gap: 10, marginTop: 16 } },
          importResult.imported.length > 0 && React.createElement('button', { 
            onClick: handleReloadProject,
            style: { 
              padding: '10px 20px', 
              background: 'transparent', 
              color: 'var(--col-txt-primary)', 
              border: '1px solid var(--col-ouliner-default)', 
              borderRadius: 6, 
              cursor: 'pointer',
              fontWeight: 600,
              flex: 1
            } 
          }, '🔄 Reload Project'),
          React.createElement('button', { 
            onClick: () => { setShowSummary(false); setImportResult(null); },
            style: { 
              padding: '10px 20px', 
              background: 'transparent', 
              color: 'var(--col-txt-primary)', 
              border: '1px solid var(--col-ouliner-default)', 
              borderRadius: 6, 
              cursor: 'pointer',
              fontWeight: 600,
              flex: importResult.imported.length > 0 ? 0 : 1,
              minWidth: importResult.imported.length > 0 ? '100px' : 'auto'
            } 
          }, 'Close')
        )
      )
    )
    )
  );
};
