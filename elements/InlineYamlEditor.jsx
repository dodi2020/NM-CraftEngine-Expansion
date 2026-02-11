/**
 * Inline YAML Editor Module
 * Edit the raw YAML for the current item's modules directly
 */

module.exports = ({ useState, useEffect, value, onChange, api, useProjectState }) => {
    // Mapping of module IDs to friendly display names
    const MODULE_DISPLAY_NAMES = {
        // Basic Info
        'craftengine_itemName': 'Item Name',
        'craftengine_customName': 'Custom Name',
        'craftengine_lore': 'Lore',
        'craftengine_overwritableLore': 'Overwritable Lore',
        'craftengine_overwritableItemName': 'Overwritable Item Name',
        'baseMaterial': 'Base Material',
        
        // Model & Texture
        'craftengine_customModelData': 'Custom Model Data',
        'craftengine_itemModel': 'Item Model',
        'craftengine_dyedColor': 'Dyed Color',
        'craftengine_hideTooltip': 'Hide Tooltip',
        'craftengine_tooltipStyle': 'Tooltip Style',
        
        // Durability & Damage
        'durability': 'Max Durability',
        'unbreakable': 'Unbreakable',
        'repairable': 'Repairable',
        'craftengine_anvilRepairItem': 'Anvil Repair Item',
        'craftengine_respectRepairableComponent': 'Respect Repairable Component',
        
        // Enchantments & Attributes
        'craftengine_enchantment': 'Enchantments',
        'enchantable': 'Enchantable',
        'craftengine_attributeModifiers': 'Attribute Modifiers',
        
        // Components
        'craftengine_customComponents': 'Custom Components',
        'craftengine_removeComponents': 'Remove Components',
        
        // Equipment
        'equippable': 'Equippable',
        'craftengine_equipmentAssetId': 'Equipment Asset ID',
        'craftengine_equipmentSlot': 'Equipment Slot',
        'craftengine_equipmentClientBoundModel': 'Equipment Client Bound Model',
        'craftengine_equipmentCameraOverlay': 'Equipment Camera Overlay',
        'craftengine_equipmentDispensable': 'Equipment Dispensable',
        'craftengine_equipmentDamageOnHurt': 'Equipment Damage On Hurt',
        'craftengine_equipmentSwappable': 'Equipment Swappable',
        'craftengine_equipmentEquipOnInteract': 'Equipment Equip On Interact',
        
        // Armor
        'craftengine_trim': 'Armor Trim',
        
        // Food & Consumable
        'nutrition': 'Nutrition',
        'saturation': 'Saturation',
        'craftengine_canAlwaysEat': 'Can Always Eat',
        'craftengine_consumeSeconds': 'Consume Seconds',
        'craftengine_consumeAnimation': 'Consume Animation',
        'craftengine_consumeSound': 'Consume Sound',
        'craftengine_hasConsumeParticles': 'Has Consume Particles',
        'craftengine_onConsumeEffects': 'On Consume Effects',
        
        // Crafting & Usage
        'recipe': 'Recipe',
        'craftengine_fuelTime': 'Fuel Time',
        'craftengine_consumeReplacement': 'Consume Replacement',
        'craftengine_craftRemainder': 'Craft Remainder',
        
        // Misc Settings
        'craftengine_renameable': 'Renameable',
        'craftengine_projectile': 'Projectile',
        'craftengine_dyeable': 'Dyeable',
        'craftengine_invulnerable': 'Invulnerable',
        'craftengine_compostProbability': 'Compost Probability',
        'craftengine_dyeColor': 'Dye Color',
        'craftengine_fireworkColor': 'Firework Color',
        'craftengine_ingredientSubstitute': 'Ingredient Substitute',
        'craftengine_hatHeight': 'Hat Height',
        'craftengine_keepOnDeathChance': 'Keep On Death Chance',
        'craftengine_destroyOnDeathChance': 'Destroy On Death Chance',
        'craftengine_dropDisplay': 'Drop Display',
        'craftengine_glowColor': 'Glow Color',
        'craftengine_jukeboxPlayable': 'Jukebox Playable',
        
        // PDC & NBT
        'craftengine_pdc': 'Persistent Data Container',
        'craftengine_nbt': 'NBT Data',
    };

    // Reverse mapping for parsing
    const DISPLAY_NAME_TO_MODULE = Object.fromEntries(
        Object.entries(MODULE_DISPLAY_NAMES).map(([key, value]) => [value, key])
    );
    
    const [yamlContent, setYamlContent] = useState('');
    const [hasChanges, setHasChanges] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    // Inject custom scrollbar styles
    useEffect(() => {
        const styleId = 'yaml-editor-scrollbar-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                /* Custom scrollbar for YAML Editor */
                .yaml-editor-scroll::-webkit-scrollbar {
                    width: 12px;
                    height: 12px;
                }
                .yaml-editor-scroll::-webkit-scrollbar-track {
                    background: var(--col-input-default);
                    border-radius: 6px;
                }
                .yaml-editor-scroll::-webkit-scrollbar-thumb {
                    background: #8b7bb8;
                    border-radius: 6px;
                    border: 2px solid var(--col-input-default);
                }
                .yaml-editor-scroll::-webkit-scrollbar-thumb:hover {
                    background: #9d8dc9;
                }
                .yaml-editor-scroll::-webkit-scrollbar-corner {
                    background: var(--col-input-default);
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    // Get current item data from API
    useEffect(() => {
        const fetchItemData = async () => {
            try {
                // Get the current route/context to find the item
                const route = window.location.hash || window.location.pathname;
                
                // Extract project ID and item ID from route (format: #/project/{projectId}/itemseditor/{itemId})
                const projectIdMatch = route.match(/\/project\/([^\/]+)/);
                const itemIdMatch = route.match(/\/itemseditor\/([^\/]+)/);
                
                if (!projectIdMatch || !itemIdMatch) {
                    console.error('Could not extract IDs from route:', route);
                    return;
                }
                
                const projectId = projectIdMatch[1];
                const itemId = itemIdMatch[1];
                
                // Get all items from project
                const response = await api.nexomaker.item.readAll(projectId);
                
                // Extract items array from response - it's in data.contents
                const items = response?.data?.contents || [];
                
                console.log('Found items:', items.length);
                
                // Find our item - items have a 'data' property with the actual item data
                const itemWrapper = items.find(i => i.data?.id === itemId);
                if (itemWrapper) {
                    // Store the complete item object with path and data
                    setCurrentItem({
                        ...itemWrapper.data,
                        path: itemWrapper.path
                    });
                    console.log('Loaded item:', itemWrapper.data.id);
                } else {
                    console.error('Item not found:', itemId, 'Available items:', items.map(i => i.data?.id));
                }
            } catch (e) {
                console.error('Failed to fetch item data:', e);
            }
        };

        fetchItemData();
    }, []);

    // Generate YAML from the item's modules
    useEffect(() => {
        if (!currentItem) return;
        
        try {
            // Generate YAML from modules directly
            // Note: Transformers can't be used in browser context due to require() limitations
            // Users will edit the raw module format, which is then used during export
            const yaml = generateYamlFromModules(currentItem);
            setYamlContent(yaml);
        } catch (e) {
            console.error('Failed to build YAML for item:', e);
        }
    }, [currentItem]);

    const generateYamlFromModules = (data) => {
        const lines = [];

        lines.push(`# ${data.display || data.id}`);
        lines.push(`# Type: ${data.type}${data.subtype ? ` (${data.subtype})` : ''}`);
        lines.push(`# ID: ${data.id}`);
        lines.push('');

        lines.push(`type: ${data.type}`);
        if (data.subtype) lines.push(`subtype: ${data.subtype}`);
        if (data.namespace) lines.push(`namespace: ${data.namespace}`);
        lines.push('');

        lines.push('modules:');

        if (data.modules && Object.keys(data.modules).length > 0) {
            for (const [key, value] of Object.entries(data.modules)) {
                // Skip internal modules
                if (key === 'craftengine_yaml_editor' || key === 'craftengine_yaml_sync') continue;
                if (value === null || value === undefined) continue;

                // Use display name if available, otherwise use actual key
                const displayKey = MODULE_DISPLAY_NAMES[key] || key;

                if (typeof value === 'object' && !Array.isArray(value)) {
                    lines.push(`  ${displayKey}:`);
                    const objStr = JSON.stringify(value, null, 2);
                    objStr.split('\n').forEach(line => {
                        lines.push(`    ${line}`);
                    });
                } else if (Array.isArray(value)) {
                    lines.push(`  ${displayKey}:`);
                    value.forEach(item => {
                        if (typeof item === 'object' && item !== null) {
                            lines.push('    -');
                            const objStr = JSON.stringify(item, null, 2);
                            objStr.split('\n').forEach(line => {
                                lines.push(`      ${line}`);
                            });
                        } else {
                            const strItem = item === null ? 'null' : (typeof item === 'string' ? item : JSON.stringify(item));
                            lines.push(`    - ${strItem}`);
                        }
                    });
                } else if (typeof value === 'string' && value.includes('\n')) {
                    lines.push(`  ${displayKey}:`);
                    value.split('\n').forEach(line => {
                        lines.push(`    ${line}`);
                    });
                } else {
                    const strValue = typeof value === 'string' ? value : JSON.stringify(value);
                    lines.push(`  ${displayKey}: ${strValue}`);
                }
            }
        } else {
            lines.push('  # No modules defined');
        }

        return lines.join('\n');
    };

    const parseModulesFromYaml = (yamlText) => {
        const lines = yamlText.split('\n');
        const modulesIndex = lines.findIndex(line => line.trim() === 'modules:');

        if (modulesIndex === -1) {
            throw new Error('Could not find modules section');
        }

        const modules = {};
        let currentKey = null;
        let currentValue = [];
        let baseIndent = 0;

        for (let i = modulesIndex + 1; i < lines.length; i++) {
            const line = lines[i];
            if (line.trim() === '' || line.trim().startsWith('#')) continue;

            const lineIndent = line.search(/\S/);

            if (line.includes(':') && lineIndent === 2) {
                if (currentKey) {
                    const valueText = currentValue.join('\n').trim();
                    try {
                        if (valueText.startsWith('{') || valueText.startsWith('[')) {
                            modules[currentKey] = JSON.parse(valueText);
                        } else if (valueText) {
                            modules[currentKey] = valueText;
                        } else {
                            modules[currentKey] = '';
                        }
                    } catch {
                        modules[currentKey] = valueText;
                    }
                }

                const parts = line.split(':');
                const displayKey = parts[0].trim();
                // Convert display name back to actual module ID
                currentKey = DISPLAY_NAME_TO_MODULE[displayKey] || displayKey;
                
                // Skip internal modules
                if (currentKey === 'craftengine_yaml_editor' || currentKey === 'craftengine_yaml_sync') {
                    currentKey = null;
                    currentValue = [];
                    continue;
                }
                
                const restOfLine = parts.slice(1).join(':').trim();
                currentValue = (restOfLine && restOfLine !== '|') ? [restOfLine] : [];
                baseIndent = lineIndent;
            } else if (currentKey && lineIndent > baseIndent) {
                currentValue.push(line.substring(baseIndent + 2));
            }
        }

        if (currentKey) {
            const valueText = currentValue.join('\n').trim();
            try {
                if (valueText.startsWith('{') || valueText.startsWith('[')) {
                    modules[currentKey] = JSON.parse(valueText);
                } else if (valueText) {
                    modules[currentKey] = valueText;
                } else {
                    modules[currentKey] = '';
                }
            } catch {
                modules[currentKey] = valueText;
            }
        }

        return modules;
    };

    // Convert transformed export object to YAML string for single-item view
    const generateYamlFromTransformed = (transformed) => {
        // transformed may contain items/furniture/blocks/armor - find the matching item entry
        const sections = ['items', 'furniture', 'blocks', 'armor'];
        let entry = null;
        for (const sec of sections) {
            if (transformed[sec]) {
                const keys = Object.keys(transformed[sec]);
                if (keys.length === 1) {
                    entry = { key: keys[0], value: transformed[sec][keys[0]] };
                    break;
                } else if (keys.length > 1 && currentItem) {
                    // Try to find matching namespace:id key
                    const matchKey = `${currentItem.namespace}:${currentItem.id}`;
                    if (transformed[sec][matchKey]) {
                        entry = { key: matchKey, value: transformed[sec][matchKey] };
                        break;
                    }
                }
            }
        }

        if (!entry) {
            // Fallback to modules view
            return generateYamlFromModules(currentItem || {});
        }

        // Build a YAML-like representation for the entry
        const lines = [];
        lines.push(`# ${currentItem.display || currentItem.id}`);
        lines.push(`# Type: ${currentItem.type}${currentItem.subtype ? ` (${currentItem.subtype})` : ''}`);
        lines.push(`# ID: ${currentItem.id}`);
        lines.push('');

        // Include the item's exported transformer content
        const obj = entry.value;
        const pushObj = (obj, indent = 0) => {
            const pad = ' '.repeat(indent);
            for (const [k, v] of Object.entries(obj)) {
                if (v === null || v === undefined) continue;
                if (typeof v === 'object' && !Array.isArray(v)) {
                    lines.push(`${pad}${k}:`);
                    pushObj(v, indent + 2);
                } else if (Array.isArray(v)) {
                    lines.push(`${pad}${k}:`);
                    v.forEach(item => {
                        if (typeof item === 'object') {
                            lines.push(`${pad}  -`);
                            pushObj(item, indent + 4);
                        } else {
                            lines.push(`${pad}  - ${item}`);
                        }
                    });
                } else {
                    lines.push(`${pad}${k}: ${String(v)}`);
                }
            }
        };

        pushObj(obj, 0);
        return lines.join('\n');
    };

    const handleApply = async () => {
        try {
            setSaveStatus('Applying...');

            // Parse the edited YAML and extract module updates
            const updatedModules = parseModulesFromYaml(yamlContent);

            // Persist module changes via API to the item
            if (currentItem && currentItem.path) {
                // Merge with existing modules, ensuring yaml_editor module is preserved
                const newModules = { 
                    ...(currentItem.modules || {}), 
                    ...updatedModules,
                    craftengine_yaml_editor: currentItem.modules?.craftengine_yaml_editor || 'enabled'
                };
                await api.nexomaker.item.update({ path: currentItem.path, changes: { ...currentItem, modules: newModules } });

                setSaveStatus('✓ Applied! Refreshing item...');
                setHasChanges(false);
                
                // Trigger item reload by briefly navigating away and back
                const currentRoute = window.location.hash;
                setTimeout(() => {
                    window.location.hash = '#/';
                    setTimeout(() => {
                        window.location.hash = currentRoute;
                    }, 50);
                }, 300);
            } else {
                setSaveStatus('✗ Error: No item context');
            }
        } catch (e) {
            setSaveStatus(`✗ Error: ${e.message}`);
            console.error('YAML apply error:', e);
        }
    };



    // Comprehensive parser that converts exported YAML back to module format
    const parseYamlToModules = (yamlText) => {
        const modules = {};
        const lines = yamlText.split('\n');
        
        // Parse line by line, building a hierarchical structure
        const parseSection = (startLine, indent) => {
            const section = {};
            let i = startLine;
            
            while (i < lines.length) {
                const line = lines[i];
                const trimmed = line.trim();
                
                if (!trimmed || trimmed.startsWith('#')) {
                    i++;
                    continue;
                }
                
                const lineIndent = line.search(/\S/);
                
                // If we've gone back to a lower indent level, stop parsing this section
                if (lineIndent < indent) {
                    break;
                }
                
                // Only process lines at our current indent level
                if (lineIndent === indent) {
                    if (trimmed.includes(':')) {
                        const colonIdx = trimmed.indexOf(':');
                        const key = trimmed.substring(0, colonIdx).trim();
                        const valueStr = trimmed.substring(colonIdx + 1).trim();
                        
                        if (valueStr) {
                            // Value on same line
                            section[key] = parseValue(valueStr);
                        } else {
                            // Check if next line is an array or nested object
                            if (i + 1 < lines.length) {
                                const nextLine = lines[i + 1];
                                const nextIndent = nextLine.search(/\S/);
                                
                                if (nextIndent > lineIndent) {
                                    if (nextLine.trim().startsWith('-')) {
                                        // Array
                                        const arr = [];
                                        let j = i + 1;
                                        while (j < lines.length) {
                                            const arrLine = lines[j];
                                            const arrIndent = arrLine.search(/\S/);
                                            if (arrIndent <= lineIndent) break;
                                            
                                            const arrTrimmed = arrLine.trim();
                                            if (arrTrimmed.startsWith('-')) {
                                                const itemValue = arrTrimmed.substring(1).trim();
                                                if (itemValue) {
                                                    arr.push(parseValue(itemValue));
                                                } else {
                                                    // Multi-line array item
                                                    const itemObj = parseSection(j + 1, arrIndent + 2);
                                                    arr.push(itemObj);
                                                    // Skip parsed lines
                                                    while (j < lines.length && lines[j].search(/\S/) > arrIndent) j++;
                                                    j--;
                                                }
                                            }
                                            j++;
                                        }
                                        section[key] = arr;
                                        i = j - 1;
                                    } else {
                                        // Nested object
                                        section[key] = parseSection(i + 1, nextIndent);
                                        // Skip parsed lines
                                        while (i < lines.length && lines[i].search(/\S/) >= nextIndent) i++;
                                        i--;
                                    }
                                }
                            }
                        }
                    }
                }
                i++;
            }
            
            return section;
        };
        
        const parseValue = (str) => {
            if (str === 'true') return true;
            if (str === 'false') return false;
            if (str === 'null') return null;
            const num = Number(str);
            if (!isNaN(num) && str !== '') return num;
            return str;
        };
        
        // Parse the entire YAML structure
        const parsed = parseSection(0, 0);
        
        // Check if this looks like direct modules format
        if (parsed.modules) {
            // Direct modules format - just return as-is
            return parsed.modules;
        }
        
        // Check for transformed export format - use untransformer
        if (parsed.material || parsed.data || parsed.settings) {
            try {
                // Get transformer from globalThis
                const transformer = globalThis?.craftengine?.transformer;
                if (!transformer || !transformer.untransform) {
                    console.warn('Untransform not available, using fallback parser');
                    // Fall through to fallback parser below
                } else {
                    // Determine category based on item type
                    let category = 'items'; // default
                    if (currentItem) {
                        if (currentItem.type === 'block' || currentItem.subtype === 'block') category = 'blocks';
                        else if (currentItem.type === 'furniture' || currentItem.subtype === 'furniture') category = 'furniture';
                        else if (currentItem.type === 'armor' || currentItem.subtype === 'armor') category = 'armor';
                    }
                    
                    return transformer.untransform(parsed, category);
                }
            } catch (e) {
                console.error('Untransform failed, using fallback parser:', e);
                // Fall through to fallback parser below
            }
        }
        
        // Fallback: manual mapping (kept for backwards compatibility)
        
        // Fallback: manual mapping (kept for backwards compatibility)
        if (parsed.data || parsed.settings || parsed.material) {
            // Map data section
            if (parsed.data) {
                if (parsed.data['item-name']) modules.craftengine_itemName = parsed.data['item-name'];
                if (parsed.data['custom-name']) modules.craftengine_customName = parsed.data['custom-name'];
                if (parsed.data.lore) {
                    modules.craftengine_lore = Array.isArray(parsed.data.lore) ? parsed.data.lore.join('|') : parsed.data.lore;
                }
                if (parsed.data['overwritable-lore'] !== undefined) modules.craftengine_overwritableLore = parsed.data['overwritable-lore'];
                if (parsed.data['overwritable-item-name'] !== undefined) modules.craftengine_overwritableItemName = parsed.data['overwritable-item-name'];
                if (parsed.data.unbreakable !== undefined) modules.unbreakable = parsed.data.unbreakable;
                if (parsed.data['dyed-color']) modules.craftengine_dyedColor = parsed.data['dyed-color'];
                if (parsed.data['custom-model-data']) modules.craftengine_customModelData = parsed.data['custom-model-data'];
                if (parsed.data['hide-tooltip'] !== undefined) modules.craftengine_hideTooltip = parsed.data['hide-tooltip'];
                if (parsed.data['max-damage']) modules.durability = parsed.data['max-damage'];
                if (parsed.data['jukebox-playable']) modules.craftengine_jukeboxPlayable = parsed.data['jukebox-playable'];
                if (parsed.data['item-model']) modules.craftengine_itemModel = parsed.data['item-model'];
                if (parsed.data['tooltip-style']) modules.craftengine_tooltipStyle = parsed.data['tooltip-style'];
                if (parsed.data.trim) modules.craftengine_trim = parsed.data.trim;
                if (parsed.data.equippable) modules.equippable = parsed.data.equippable;
                if (parsed.data.pdc) modules.craftengine_pdc = parsed.data.pdc;
                if (parsed.data.nbt) modules.craftengine_nbt = parsed.data.nbt;
                
                // Enchantments - convert array back to YAML string
                if (parsed.data.enchantment && Array.isArray(parsed.data.enchantment)) {
                    const enchLines = [];
                    parsed.data.enchantment.forEach(ench => {
                        enchLines.push(`- enchantment: ${ench.enchantment}`);
                        if (ench.level) enchLines.push(`  level: ${ench.level}`);
                    });
                    modules.craftengine_enchantment = enchLines.join('\n');
                }
                
                // Attribute modifiers - convert array back to YAML string
                if (parsed.data['attribute-modifiers'] && Array.isArray(parsed.data['attribute-modifiers'])) {
                    const attrLines = [];
                    parsed.data['attribute-modifiers'].forEach(attr => {
                        attrLines.push(`- type: ${attr.type}`);
                        if (attr.amount !== undefined) attrLines.push(`  amount: ${attr.amount}`);
                        if (attr.operation) attrLines.push(`  operation: ${attr.operation}`);
                        if (attr.slot) attrLines.push(`  slot: ${attr.slot}`);
                    });
                    modules.craftengine_attributeModifiers = attrLines.join('\n');
                }
                
                // Custom components - convert object back to YAML string
                if (parsed.data.components && typeof parsed.data.components === 'object') {
                    const compLines = [];
                    for (const [key, val] of Object.entries(parsed.data.components)) {
                        compLines.push(`${key}:`);
                        if (typeof val === 'object') {
                            for (const [k, v] of Object.entries(val)) {
                                compLines.push(`  ${k}: ${v}`);
                            }
                        } else {
                            compLines.push(`  ${val}`);
                        }
                    }
                    modules.craftengine_customComponents = compLines.join('\n');
                }
                
                // Remove components
                if (parsed.data['remove-components'] && Array.isArray(parsed.data['remove-components'])) {
                    modules.craftengine_removeComponents = parsed.data['remove-components'].join(', ');
                }
            }
            
            // Map settings section
            if (parsed.settings) {
                if (parsed.settings['fuel-time']) modules.craftengine_fuelTime = parsed.settings['fuel-time'];
                if (parsed.settings.repairable) modules.repairable = parsed.settings.repairable;
                if (parsed.settings['anvil-repair-item']) modules.craftengine_anvilRepairItem = parsed.settings['anvil-repair-item'];
                if (parsed.settings.renameable !== undefined) modules.craftengine_renameable = parsed.settings.renameable;
                if (parsed.settings.projectile) modules.craftengine_projectile = parsed.settings.projectile;
                if (parsed.settings.dyeable !== undefined) modules.craftengine_dyeable = parsed.settings.dyeable;
                if (parsed.settings['consume-replacement']) modules.craftengine_consumeReplacement = parsed.settings['consume-replacement'];
                if (parsed.settings['craft-remainder']) modules.craftengine_craftRemainder = parsed.settings['craft-remainder'];
                if (parsed.settings.invulnerable !== undefined) modules.craftengine_invulnerable = parsed.settings.invulnerable;
                if (parsed.settings.enchantable) modules.enchantable = parsed.settings.enchantable;
                if (parsed.settings['compost-probability']) modules.craftengine_compostProbability = parsed.settings['compost-probability'];
                if (parsed.settings['respect-repairable-component'] !== undefined) modules.craftengine_respectRepairableComponent = parsed.settings['respect-repairable-component'];
                if (parsed.settings['dye-color']) modules.craftengine_dyeColor = parsed.settings['dye-color'];
                if (parsed.settings['firework-color']) modules.craftengine_fireworkColor = parsed.settings['firework-color'];
                if (parsed.settings['ingredient-substitute']) modules.craftengine_ingredientSubstitute = parsed.settings['ingredient-substitute'];
                if (parsed.settings['hat-height']) modules.craftengine_hatHeight = parsed.settings['hat-height'];
                if (parsed.settings['keep-on-death-chance']) modules.craftengine_keepOnDeathChance = parsed.settings['keep-on-death-chance'];
                if (parsed.settings['destroy-on-death-chance']) modules.craftengine_destroyOnDeathChance = parsed.settings['destroy-on-death-chance'];
                if (parsed.settings['drop-display']) modules.craftengine_dropDisplay = parsed.settings['drop-display'];
                if (parsed.settings['glow-color']) modules.craftengine_glowColor = parsed.settings['glow-color'];
                
                // Recipe - store as-is (object format)
                if (parsed.settings.recipe) {
                    modules.recipe = parsed.settings.recipe;
                }
                
                // Equipment sub-section
                if (parsed.settings.equipment) {
                    const eq = parsed.settings.equipment;
                    if (eq['asset-id']) modules.craftengine_equipmentAssetId = eq['asset-id'];
                    if (eq['client-bound-model'] !== undefined) modules.craftengine_equipmentClientBoundModel = eq['client-bound-model'];
                    if (eq.slot) modules.craftengine_equipmentSlot = eq.slot;
                    if (eq['camera-overlay']) modules.craftengine_equipmentCameraOverlay = eq['camera-overlay'];
                    if (eq.dispensable !== undefined) modules.craftengine_equipmentDispensable = eq.dispensable;
                    if (eq['damage-on-hurt'] !== undefined) modules.craftengine_equipmentDamageOnHurt = eq['damage-on-hurt'];
                    if (eq.swappable !== undefined) modules.craftengine_equipmentSwappable = eq.swappable;
                    if (eq['equip-on-interact'] !== undefined) modules.craftengine_equipmentEquipOnInteract = eq['equip-on-interact'];
                }
                
                // Food sub-section
                if (parsed.settings.food) {
                    const food = parsed.settings.food;
                    if (food.nutrition) modules.nutrition = food.nutrition;
                    if (food.saturation) modules.saturation = food.saturation;
                    if (food['can-always-eat'] !== undefined) modules.craftengine_canAlwaysEat = food['can-always-eat'];
                }
                
                // Consumable sub-section
                if (parsed.settings.consumable) {
                    const cons = parsed.settings.consumable;
                    if (cons['consume-seconds']) modules.craftengine_consumeSeconds = cons['consume-seconds'];
                    if (cons.animation) modules.craftengine_consumeAnimation = cons.animation;
                    if (cons.sound) modules.craftengine_consumeSound = cons.sound;
                    if (cons['has-consume-particles'] !== undefined) modules.craftengine_hasConsumeParticles = cons['has-consume-particles'];
                    if (cons['on-consume-effects']) modules.craftengine_onConsumeEffects = cons['on-consume-effects'];
                }
            }
            
            // Map material
            if (parsed.material) {
                modules.baseMaterial = parsed.material;
            }
            
            // Map model/texture
            if (parsed.model) modules.craftengine_model = parsed.model;
            if (parsed.models) modules.craftengine_models = parsed.models;
            if (parsed.texture) modules.craftengine_texture = parsed.texture;
            if (parsed.textures) modules.craftengine_textures = parsed.textures;
        }
        
        return modules;
    };

    const handleYamlChange = (e) => {
        setYamlContent(e.target.value);
        setHasChanges(true);
    };

    const handleRefresh = async () => {
        try {
            setSaveStatus('Refreshing...');
            
            // Re-fetch the item from the API to get the latest data
            const route = window.location.hash || window.location.pathname;
            const projectIdMatch = route.match(/\/project\/([^\/]+)/);
            const itemIdMatch = route.match(/\/itemseditor\/([^\/]+)/);
            
            if (!projectIdMatch || !itemIdMatch) {
                setSaveStatus('✗ Could not refresh');
                return;
            }
            
            const projectId = projectIdMatch[1];
            const itemId = itemIdMatch[1];
            
            const response = await api.nexomaker.item.readAll(projectId);
            const items = response?.data?.contents || [];
            const itemWrapper = items.find(i => i.data?.id === itemId);
            
            if (itemWrapper) {
                const refreshedItem = {
                    ...itemWrapper.data,
                    path: itemWrapper.path
                };
                setCurrentItem(refreshedItem);
                const yaml = generateYamlFromModules(refreshedItem);
                setYamlContent(yaml);
                setHasChanges(false);
                setSaveStatus('✓ Refreshed');
                setTimeout(() => setSaveStatus(''), 2000);
            } else {
                setSaveStatus('✗ Item not found');
            }
        } catch (e) {
            setSaveStatus('✗ Refresh failed');
            console.error('Refresh error:', e);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '8px',
            backgroundColor: 'var(--col-bg-secondary)',
            borderRadius: '6px',
            border: '1px solid var(--col-border-primary)'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{
                    fontWeight: '600',
                    fontSize: '14px',
                    color: 'var(--col-text-primary)'
                }}>
                    📝 Raw YAML Editor
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{
                        padding: '4px 12px',
                        backgroundColor: 'var(--col-bg-tertiary)',
                        color: 'var(--col-text-primary)',
                        border: '1px solid var(--col-border-primary)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}
                >
                    {isExpanded ? '▼ Collapse' : '▶ Expand'}
                </button>
            </div>

            {isExpanded && (
                <>
                    <textarea
                        className="yaml-editor-scroll"
                        value={yamlContent}
                        onChange={handleYamlChange}
                        spellCheck={false}
                        style={{
                            width: 'calc(100% + 600px)',
                            minHeight: '400px',
                            padding: '12px',
                            backgroundColor: 'var(--col-bg-primary)',
                            color: 'var(--col-text-primary)',
                            border: '1px solid var(--col-border-primary)',
                            borderRadius: '4px',
                            fontSize: '13px',
                            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                            lineHeight: '1.5',
                            resize: 'vertical',
                            outline: 'none',
                            marginLeft: '-300px',
                            marginRight: '-300px'
                        }}
                    />

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={handleApply}
                            disabled={!hasChanges}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: hasChanges ? '#4CAF50' : 'var(--col-bg-tertiary)',
                                color: hasChanges ? 'white' : 'var(--col-text-secondary)',
                                border: '1px solid var(--col-border-primary)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '600'
                            }}
                        >
                            Apply Changes
                        </button>

                        <span style={{
                            fontSize: '11px',
                            color: 'var(--col-text-secondary)',
                            fontStyle: 'italic'
                        }}>
                            (Will Reload Project)
                        </span>

                        <button
                            onClick={handleRefresh}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: 'var(--col-bg-tertiary)',
                                color: 'var(--col-text-primary)',
                                border: '1px solid var(--col-border-primary)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '13px'
                            }}
                        >
                            🔄 Refresh
                        </button>

                        {saveStatus && (
                            <span style={{
                                fontSize: '13px',
                                color: saveStatus.startsWith('✓') ? '#4CAF50' : 
                                       saveStatus.startsWith('✗') ? '#ff6b6b' : 
                                       'var(--col-text-secondary)'
                            }}>
                                {saveStatus}
                            </span>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

