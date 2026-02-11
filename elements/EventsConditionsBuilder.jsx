/**
 * Events & Conditions Builder Overlay for CraftEngine
 * Full visual configuration for events, functions, and conditions
 */

module.exports = ({ useState, useEffect, value, onChange, placeholder, rows }) => {
    const [showModal, setShowModal] = useState(false);
    const [localValue, setLocalValue] = useState(value || '');
    const [mode, setMode] = useState('visual');
    const [events, setEvents] = useState([]);
    const [expandedFunction, setExpandedFunction] = useState(null);

    useEffect(() => {
        setLocalValue(value || '');
    }, [value]);

    useEffect(() => {
        if (showModal && localValue) {
            parseYAMLToEvents(localValue);
        }
    }, [showModal]);

    // Complete function definitions with all fields
    const FUNCTION_DEFINITIONS = {
        cancel_event: { label: 'Cancel Event', fields: [] },
        command: {
            label: 'Execute Command',
            fields: [
                { name: 'command', type: 'text', label: 'Command', placeholder: 'say hello <arg:player.name>', required: true },
                { name: 'target', type: 'select', label: 'Target', options: ['self', 'all'], default: 'self' },
                { name: 'as-player', type: 'boolean', label: 'As Player', default: false },
                { name: 'as-op', type: 'boolean', label: 'As OP (Not Recommended)', default: false },
                { name: 'as-event', type: 'boolean', label: 'As Event', default: false }
            ]
        },
        message: {
            label: 'Send Message',
            fields: [
                { name: 'message', type: 'text', label: 'Message', placeholder: 'Hello <papi:player_name>', required: true },
                { name: 'target', type: 'select', label: 'Target', options: ['self', 'all'], default: 'self' },
                { name: 'overlay', type: 'boolean', label: 'Show as Actionbar', default: false }
            ]
        },
        actionbar: {
            label: 'Send Actionbar',
            fields: [
                { name: 'actionbar', type: 'text', label: 'Actionbar Text', required: true },
                { name: 'target', type: 'select', label: 'Target', options: ['self', 'all'], default: 'self' }
            ]
        },
        title: {
            label: 'Send Title',
            fields: [
                { name: 'title', type: 'text', label: 'Title', required: true },
                { name: 'subtitle', type: 'text', label: 'Subtitle', required: true },
                { name: 'fade-in', type: 'number', label: 'Fade In (ticks)', default: 10, min: 0 },
                { name: 'stay', type: 'number', label: 'Stay (ticks)', default: 20, min: 0 },
                { name: 'fade-out', type: 'number', label: 'Fade Out (ticks)', default: 5, min: 0 }
            ]
        },
        play_sound: {
            label: 'Play Sound',
            fields: [
                { name: 'sound', type: 'text', label: 'Sound', placeholder: 'minecraft:entity.player.levelup', required: true },
                { name: 'target', type: 'select', label: 'Target', options: ['self', 'all', 'position'], default: 'self' },
                { name: 'x', type: 'text', label: 'X Position', placeholder: '<arg:position.x>' },
                { name: 'y', type: 'text', label: 'Y Position', placeholder: '<arg:position.y>' },
                { name: 'z', type: 'text', label: 'Z Position', placeholder: '<arg:position.z>' },
                { name: 'pitch', type: 'number', label: 'Pitch', default: 1, min: 0, max: 2, step: 0.1 },
                { name: 'volume', type: 'number', label: 'Volume', default: 1, min: 0, max: 10, step: 0.1 },
                { name: 'source', type: 'select', label: 'Source', options: ['master', 'music', 'record', 'weather', 'block', 'hostile', 'neutral', 'player', 'ambient', 'voice', 'ui'], default: 'master' }
            ]
        },
        particle: {
            label: 'Spawn Particle',
            fields: [
                { name: 'particle', type: 'text', label: 'Particle Type', placeholder: 'minecraft:end_rod', required: true },
                { name: 'x', type: 'text', label: 'X Position', default: '<arg:position.x>' },
                { name: 'y', type: 'text', label: 'Y Position', default: '<arg:position.y>' },
                { name: 'z', type: 'text', label: 'Z Position', default: '<arg:position.z>' },
                { name: 'count', type: 'number', label: 'Count', default: 1, min: 1 },
                { name: 'offset-x', type: 'number', label: 'Offset X', default: 0, step: 0.1 },
                { name: 'offset-y', type: 'number', label: 'Offset Y', default: 0, step: 0.1 },
                { name: 'offset-z', type: 'number', label: 'Offset Z', default: 0, step: 0.1 },
                { name: 'speed', type: 'number', label: 'Speed', default: 0, min: 0, step: 0.1 }
            ]
        },
        teleport: {
            label: 'Teleport Player',
            fields: [
                { name: 'x', type: 'text', label: 'X Position', required: true, placeholder: '0 or <arg:player.x>' },
                { name: 'y', type: 'text', label: 'Y Position', required: true, placeholder: '64 or <arg:player.y>' },
                { name: 'z', type: 'text', label: 'Z Position', required: true, placeholder: '0 or <arg:player.z>' },
                { name: 'pitch', type: 'text', label: 'Pitch', default: '0', placeholder: '-90 to 90' },
                { name: 'yaw', type: 'text', label: 'Yaw', default: '0', placeholder: '-180 to 180' },
                { name: 'world', type: 'text', label: 'World', placeholder: 'world' }
            ]
        },
        potion_effect: {
            label: 'Add Potion Effect',
            fields: [
                { name: 'potion-effect', type: 'text', label: 'Effect Type', placeholder: 'minecraft:speed', required: true },
                { name: 'duration', type: 'number', label: 'Duration (ticks)', default: 20, min: 1 },
                { name: 'amplifier', type: 'number', label: 'Amplifier (Level - 1)', default: 0, min: 0 },
                { name: 'ambient', type: 'boolean', label: 'Ambient', default: false },
                { name: 'particles', type: 'boolean', label: 'Show Particles', default: true }
            ]
        },
        set_cooldown: {
            label: 'Set Cooldown',
            fields: [
                { name: 'id', type: 'text', label: 'Cooldown ID', required: true, placeholder: 'my_cooldown' },
                { name: 'time', type: 'text', label: 'Time', required: true, placeholder: '1m30s or 90s' },
                { name: 'add', type: 'boolean', label: 'Accumulate (Add Time)', default: false }
            ]
        },
        damage: {
            label: 'Damage Target',
            fields: [
                { name: 'target', type: 'select', label: 'Target', options: ['self', 'all'], default: 'self' },
                { name: 'amount', type: 'number', label: 'Amount', default: 1, min: 0, step: 0.5 },
                { name: 'damage-type', type: 'select', label: 'Damage Type', default: 'generic', options: [
                    'generic', 'arrow', 'cactus', 'cramming', 'dragon_breath', 'drown', 'explosion', 
                    'fall', 'falling_anvil', 'falling_block', 'falling_stalactite', 'fire', 'fireball', 
                    'fireworks', 'fly_into_wall', 'freeze', 'hot_floor', 'in_fire', 'in_wall', 
                    'indirect_magic', 'lava', 'lightning_bolt', 'magic', 'mob_attack', 
                    'mob_attack_no_aggro', 'mob_projectile', 'on_fire', 'out_of_world', 'player_attack', 
                    'player_explosion', 'sonic_boom', 'starve', 'sting', 'sweet_berry_bush', 'thorns', 
                    'trident', 'unattributed_fireball', 'wither', 'wither_skull'
                ]}
            ]
        },
        set_food: {
            label: 'Set Food Level',
            fields: [
                { name: 'food', type: 'number', label: 'Food Level', required: true, min: 0, max: 20, default: 20 },
                { name: 'add', type: 'boolean', label: 'Add Mode', default: false },
                { name: 'target', type: 'select', label: 'Target', options: ['self', 'all'], default: 'self' }
            ]
        },
        set_saturation: {
            label: 'Set Saturation',
            fields: [
                { name: 'saturation', type: 'number', label: 'Saturation', required: true, min: 0, max: 10, default: 5, step: 0.5 },
                { name: 'add', type: 'boolean', label: 'Add Mode', default: false },
                { name: 'target', type: 'select', label: 'Target', options: ['self', 'all'], default: 'self' }
            ]
        },
        set_variable: {
            label: 'Set Variable',
            fields: [
                { name: 'name', type: 'text', label: 'Variable Name', required: true, placeholder: 'my_variable' },
                { name: 'number', type: 'number', label: 'Number Value', step: 0.1 },
                { name: 'text', type: 'text', label: 'Text Value' },
                { name: 'as-int', type: 'boolean', label: 'Store as Integer', default: false }
            ]
        },
        drop_loot: {
            label: 'Drop Loot',
            fields: [
                { name: 'x', type: 'text', label: 'X Position', default: '<arg:block.block_x> + 0.5' },
                { name: 'y', type: 'text', label: 'Y Position', default: '<arg:block.block_y> + 0.5' },
                { name: 'z', type: 'text', label: 'Z Position', default: '<arg:block.block_z> + 0.5' },
                { name: 'to-inventory', type: 'boolean', label: 'Drop to Inventory', default: false }
            ]
        },
        break_block: {
            label: 'Break Block',
            fields: [
                { name: 'x', type: 'text', label: 'X Position', default: '<arg:position.x>' },
                { name: 'y', type: 'text', label: 'Y Position', default: '<arg:position.y>' },
                { name: 'z', type: 'text', label: 'Z Position', default: '<arg:position.z>' }
            ]
        },
        place_block: {
            label: 'Place Block',
            fields: [
                { name: 'block-state', type: 'text', label: 'Block State', required: true, placeholder: 'minecraft:stone' },
                { name: 'x', type: 'text', label: 'X Position', default: '<arg:block.block_x>' },
                { name: 'y', type: 'text', label: 'Y Position', default: '<arg:block.block_y>' },
                { name: 'z', type: 'text', label: 'Z Position', default: '<arg:block.block_z>' }
            ]
        },
        update_block_property: {
            label: 'Update Block Property',
            fields: [
                { name: 'property', type: 'text', label: 'Property Name', required: true, placeholder: 'facing' },
                { name: 'value', type: 'text', label: 'Value', required: true, placeholder: 'north' },
                { name: 'x', type: 'text', label: 'X Position', default: '<arg:block.block_x>' },
                { name: 'y', type: 'text', label: 'Y Position', default: '<arg:block.block_y>' },
                { name: 'z', type: 'text', label: 'Z Position', default: '<arg:block.block_z>' }
            ]
        },
        transform_block: {
            label: 'Transform Block',
            fields: [
                { name: 'block', type: 'text', label: 'Block Type', required: true, placeholder: 'minecraft:stone' },
                { name: 'x', type: 'text', label: 'X Position', default: '<arg:block.block_x>' },
                { name: 'y', type: 'text', label: 'Y Position', default: '<arg:block.block_y>' },
                { name: 'z', type: 'text', label: 'Z Position', default: '<arg:block.block_z>' }
            ]
        },
        open_window: {
            label: 'Open Window',
            fields: [
                { name: 'gui-type', type: 'select', label: 'GUI Type', required: true, options: ['anvil', 'enchantment', 'grindstone', 'loom', 'smithing', 'crafting', 'cartography'] },
                { name: 'title', type: 'text', label: 'Title', placeholder: 'Custom GUI' },
                { name: 'target', type: 'select', label: 'Target', options: ['self', 'all'], default: 'self' }
            ]
        },
        set_count: {
            label: 'Set Item Count',
            fields: [
                { name: 'count', type: 'number', label: 'Count', required: true, min: 1, max: 64, default: 1 },
                { name: 'add', type: 'boolean', label: 'Add Mode', default: false },
                { name: 'target', type: 'select', label: 'Target', options: ['self', 'all'], default: 'self' }
            ]
        }
    };

    // Complete condition definitions
    const CONDITION_DEFINITIONS = {
        permission: {
            label: 'Permission',
            fields: [
                { name: 'permission', type: 'text', label: 'Permission', required: true, placeholder: 'craftengine.admin' }
            ]
        },
        match_item: {
            label: 'Match Item',
            fields: [
                { name: 'id', type: 'text', label: 'Item ID', required: true, placeholder: 'minecraft:iron_pickaxe' },
                { name: 'regex', type: 'boolean', label: 'Use Regex', default: false }
            ]
        },
        has_item: {
            label: 'Has Item in Hand',
            fields: []
        },
        inventory_has_item: {
            label: 'Inventory Has Item',
            fields: [
                { name: 'id', type: 'text', label: 'Item ID', required: true, placeholder: 'minecraft:diamond' },
                { name: 'count', type: 'number', label: 'Count', default: 1, min: 1 }
            ]
        },
        expression: {
            label: 'Expression',
            fields: [
                { name: 'expression', type: 'text', label: 'Expression', required: true, placeholder: '<papi:farming_level> >= 10' }
            ]
        },
        random: {
            label: 'Random Chance',
            fields: [
                { name: 'value', type: 'number', label: 'Chance (0.0-1.0)', required: true, min: 0, max: 1, step: 0.01, default: 0.5 }
            ]
        },
        on_cooldown: {
            label: 'On Cooldown',
            fields: [
                { name: 'id', type: 'text', label: 'Cooldown ID', required: true, placeholder: 'my_cooldown' }
            ]
        },
        hand: {
            label: 'Specific Hand',
            fields: [
                { name: 'hand', type: 'select', label: 'Hand', options: ['main_hand', 'off_hand'], required: true }
            ]
        },
        string_equals: {
            label: 'String Equals',
            fields: [
                { name: 'value1', type: 'text', label: 'Value 1', required: true, placeholder: '<arg:player.name>' },
                { name: 'value2', type: 'text', label: 'Value 2', required: true, placeholder: 'Steve' }
            ]
        },
        distance: {
            label: 'Distance Check',
            fields: [
                { name: 'min', type: 'number', label: 'Min Distance', required: true, min: 0, default: 0 },
                { name: 'max', type: 'number', label: 'Max Distance', required: true, min: 0, default: 10 }
            ]
        },
        match_block: {
            label: 'Match Block',
            fields: [
                { name: 'id', type: 'text', label: 'Block ID', required: true, placeholder: 'minecraft:stone' },
                { name: 'regex', type: 'boolean', label: 'Use Regex', default: false }
            ]
        },
        time: {
            label: 'Time of Day',
            fields: [
                { name: 'min', type: 'number', label: 'Min Time', required: true, min: 0, max: 24000, default: 0 },
                { name: 'max', type: 'number', label: 'Max Time', required: true, min: 0, max: 24000, default: 24000 }
            ]
        },
        weather: {
            label: 'Weather',
            fields: [
                { name: 'weather', type: 'select', label: 'Weather', options: ['clear', 'rain', 'thunder'], required: true }
            ]
        },
        biome: {
            label: 'Biome',
            fields: [
                { name: 'biome', type: 'text', label: 'Biome', required: true, placeholder: 'minecraft:plains' }
            ]
        },
        gamemode: {
            label: 'Gamemode',
            fields: [
                { name: 'gamemode', type: 'select', label: 'Gamemode', options: ['survival', 'creative', 'adventure', 'spectator'], required: true }
            ]
        }
    };

    const EVENT_TRIGGERS = ['break', 'right_click', 'left_click', 'consume', 'pick_up', 'place', 'step'];

    const parseYAMLToEvents = (yaml) => {
        if (!yaml || yaml.trim() === '') {
            setEvents([]);
            return;
        }

        try {
            const lines = yaml.split('\n');
            const parsedEvents = [];
            let currentEvent = null;
            let currentFunction = null;
            let inConditions = false;
            let currentCondition = null;
            let indentLevel = 0;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const trimmed = line.trim();
                
                if (trimmed === '' || trimmed.startsWith('#')) continue;

                // Detect new event
                if (trimmed.startsWith('- on:')) {
                    if (currentCondition && currentFunction) {
                        currentFunction.conditions.push(currentCondition);
                        currentCondition = null;
                    }
                    if (currentFunction && currentEvent) {
                        currentEvent.functions.push(currentFunction);
                        currentFunction = null;
                    }
                    if (currentEvent) {
                        parsedEvents.push(currentEvent);
                    }
                    
                    const trigger = trimmed.split('on:')[1].trim();
                    currentEvent = { trigger, functions: [] };
                    inConditions = false;
                    continue;
                }

                // Detect new function
                if (trimmed.startsWith('- type:') && currentEvent) {
                    if (currentCondition && currentFunction) {
                        currentFunction.conditions.push(currentCondition);
                        currentCondition = null;
                    }
                    if (currentFunction) {
                        currentEvent.functions.push(currentFunction);
                    }
                    
                    const type = trimmed.split('type:')[1].trim();
                    currentFunction = { type, fields: {}, conditions: [] };
                    inConditions = false;
                    continue;
                }

                // Detect conditions section
                if (trimmed === 'conditions:' && currentFunction) {
                    inConditions = true;
                    continue;
                }

                // Parse condition
                if (inConditions && trimmed.startsWith('- type:') && currentFunction) {
                    if (currentCondition) {
                        currentFunction.conditions.push(currentCondition);
                    }
                    
                    const type = trimmed.split('type:')[1].trim();
                    currentCondition = { type, fields: {} };
                    continue;
                }

                // Parse field value
                if (trimmed.includes(':')) {
                    const colonIndex = trimmed.indexOf(':');
                    const key = trimmed.substring(0, colonIndex).trim();
                    let value = trimmed.substring(colonIndex + 1).trim();
                    
                    // Remove quotes
                    if ((value.startsWith('"') && value.endsWith('"')) || 
                        (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.substring(1, value.length - 1);
                    }
                    
                    // Parse value type
                    let parsedValue = value;
                    if (value === 'true') parsedValue = true;
                    else if (value === 'false') parsedValue = false;
                    else if (!isNaN(value) && value !== '') parsedValue = parseFloat(value);
                    
                    // Assign to appropriate object
                    if (inConditions && currentCondition && key !== 'type') {
                        currentCondition.fields[key] = parsedValue;
                    } else if (currentFunction && key !== 'type' && key !== 'functions' && key !== 'conditions') {
                        currentFunction.fields[key] = parsedValue;
                    }
                }
            }

            // Add remaining items
            if (currentCondition && currentFunction) {
                currentFunction.conditions.push(currentCondition);
            }
            if (currentFunction && currentEvent) {
                currentEvent.functions.push(currentFunction);
            }
            if (currentEvent) {
                parsedEvents.push(currentEvent);
            }

            if (parsedEvents.length > 0) {
                setEvents(parsedEvents);
            }
        } catch (e) {
            console.error('Failed to parse YAML:', e);
            setEvents([]);
        }
    };

    const handleCancel = () => {
        setLocalValue(value || '');
        setShowModal(false);
        setExpandedFunction(null);
    };

    const handleApply = () => {
        const yaml = mode === 'visual' ? generateYAML() : localValue;
        if (onChange) {
            onChange(yaml);
        }
        setShowModal(false);
    };

    const addEvent = (trigger) => {
        const newEvents = [...events, { trigger, functions: [] }];
        setEvents(newEvents);
    };

    const removeEvent = (index) => {
        const newEvents = events.filter((_, i) => i !== index);
        setEvents(newEvents);
    };

    const addFunction = (eventIndex, funcType) => {
        const newEvents = [...events];
        const funcDef = FUNCTION_DEFINITIONS[funcType];
        const newFunc = { type: funcType, fields: {}, conditions: [] };
        
        // Initialize with default values
        if (funcDef && funcDef.fields) {
            funcDef.fields.forEach(field => {
                if (field.default !== undefined) {
                    newFunc.fields[field.name] = field.default;
                }
            });
        }
        
        newEvents[eventIndex].functions.push(newFunc);
        setEvents(newEvents);
        setExpandedFunction({ eventIndex, funcIndex: newEvents[eventIndex].functions.length - 1 });
    };

    const removeFunction = (eventIndex, funcIndex) => {
        const newEvents = [...events];
        newEvents[eventIndex].functions.splice(funcIndex, 1);
        setEvents(newEvents);
        if (expandedFunction?.eventIndex === eventIndex && expandedFunction?.funcIndex === funcIndex) {
            setExpandedFunction(null);
        }
    };

    const updateFunctionField = (eventIndex, funcIndex, fieldName, value) => {
        const newEvents = [...events];
        newEvents[eventIndex].functions[funcIndex].fields[fieldName] = value;
        setEvents(newEvents);
    };

    const addCondition = (eventIndex, funcIndex, condType) => {
        const newEvents = [...events];
        const condDef = CONDITION_DEFINITIONS[condType];
        const newCond = { type: condType, fields: {} };
        
        // Initialize with default values
        if (condDef && condDef.fields) {
            condDef.fields.forEach(field => {
                if (field.default !== undefined) {
                    newCond.fields[field.name] = field.default;
                }
            });
        }
        
        newEvents[eventIndex].functions[funcIndex].conditions.push(newCond);
        setEvents(newEvents);
    };

    const removeCondition = (eventIndex, funcIndex, condIndex) => {
        const newEvents = [...events];
        newEvents[eventIndex].functions[funcIndex].conditions.splice(condIndex, 1);
        setEvents(newEvents);
    };

    const updateConditionField = (eventIndex, funcIndex, condIndex, fieldName, value) => {
        const newEvents = [...events];
        newEvents[eventIndex].functions[funcIndex].conditions[condIndex].fields[fieldName] = value;
        setEvents(newEvents);
    };

    const generateYAML = () => {
        if (events.length === 0) return localValue;

        let yaml = '';
        events.forEach((event, idx) => {
            yaml += `- on: ${event.trigger}\n`;
            yaml += `  functions:\n`;
            
            event.functions.forEach(func => {
                yaml += `    - type: ${func.type}\n`;
                
                // Add function fields
                Object.entries(func.fields || {}).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        if (typeof value === 'boolean') {
                            yaml += `      ${key}: ${value}\n`;
                        } else if (typeof value === 'number') {
                            yaml += `      ${key}: ${value}\n`;
                        } else {
                            yaml += `      ${key}: "${value}"\n`;
                        }
                    }
                });

                // Add conditions
                if (func.conditions && func.conditions.length > 0) {
                    yaml += `      conditions:\n`;
                    func.conditions.forEach(cond => {
                        yaml += `        - type: ${cond.type}\n`;
                        Object.entries(cond.fields || {}).forEach(([key, value]) => {
                            if (value !== undefined && value !== null && value !== '') {
                                if (typeof value === 'boolean') {
                                    yaml += `          ${key}: ${value}\n`;
                                } else if (typeof value === 'number') {
                                    yaml += `          ${key}: ${value}\n`;
                                } else {
                                    yaml += `          ${key}: "${value}"\n`;
                                }
                            }
                        });
                    });
                }
            });
            
            if (idx < events.length - 1) yaml += '\n';
        });
        
        return yaml;
    };

    const renderField = (field, value, onChangeHandler) => {
        const fieldStyle = {
            width: '100%',
            padding: '8px',
            fontSize: '13px',
            backgroundColor: 'var(--col-primary)',
            color: 'var(--col-txt-primary)',
            border: '1px solid var(--col-ouliner-default)',
            borderRadius: 'var(--radius-sm)'
        };

        if (field.type === 'boolean') {
            return React.createElement('div', {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 0'
                }
            },
                React.createElement('input', {
                    type: 'checkbox',
                    checked: value || false,
                    onChange: (e) => onChangeHandler(e.target.checked),
                    style: { cursor: 'pointer' }
                }),
                React.createElement('label', {
                    style: {
                        fontSize: '13px',
                        color: 'var(--col-txt-primary)',
                        cursor: 'pointer'
                    },
                    onClick: () => onChangeHandler(!value)
                }, field.label + (field.required ? ' *' : ''))
            );
        }

        if (field.type === 'select') {
            return React.createElement('div', {
                style: { marginBottom: '10px' }
            },
                React.createElement('label', {
                    style: {
                        display: 'block',
                        marginBottom: '4px',
                        fontSize: '12px',
                        color: 'var(--col-txt-secondary)'
                    }
                }, field.label + (field.required ? ' *' : '')),
                React.createElement('select', {
                    value: value || field.default || '',
                    onChange: (e) => onChangeHandler(e.target.value),
                    style: fieldStyle
                },
                    field.options.map(opt =>
                        React.createElement('option', { key: opt, value: opt }, opt)
                    )
                )
            );
        }

        if (field.type === 'number') {
            return React.createElement('div', {
                style: { marginBottom: '10px' }
            },
                React.createElement('label', {
                    style: {
                        display: 'block',
                        marginBottom: '4px',
                        fontSize: '12px',
                        color: 'var(--col-txt-secondary)'
                    }
                }, field.label + (field.required ? ' *' : '')),
                React.createElement('input', {
                    type: 'number',
                    value: value !== undefined ? value : (field.default !== undefined ? field.default : ''),
                    onChange: (e) => onChangeHandler(parseFloat(e.target.value) || 0),
                    min: field.min,
                    max: field.max,
                    step: field.step || 1,
                    placeholder: field.placeholder,
                    style: fieldStyle
                })
            );
        }

        // Default: text input
        return React.createElement('div', {
            style: { marginBottom: '10px' }
        },
            React.createElement('label', {
                style: {
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '12px',
                    color: 'var(--col-txt-secondary)'
                }
            }, field.label + (field.required ? ' *' : '')),
            React.createElement('input', {
                type: 'text',
                value: value || '',
                onChange: (e) => onChangeHandler(e.target.value),
                placeholder: field.placeholder,
                style: fieldStyle
            })
        );
    };

    return React.createElement('div', null,
        // Open Button
        React.createElement('button', {
            onClick: () => setShowModal(true),
            style: {
                padding: '10px 20px',
                fontSize: '14px',
                backgroundColor: 'var(--col-primary-form)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontWeight: '500'
            }
        }, '⚡ Open Events & Conditions Builder'),

        // Modal
        showModal && React.createElement('div', {
            style: {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                overflow: 'auto'
            },
            onClick: (e) => {
                if (e.target === e.currentTarget) handleCancel();
            }
        },
            React.createElement('div', {
                style: {
                    backgroundColor: 'var(--col-primary)',
                    borderRadius: 'var(--radius-sm)',
                    maxWidth: '1400px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    border: '2px solid var(--col-primary-form)',
                    boxShadow: '0 10px 50px rgba(0, 0, 0, 0.5)'
                },
                onClick: (e) => e.stopPropagation()
            },
                React.createElement('div', {
                    style: { padding: '30px', color: 'var(--col-txt-primary)' }
                },
                    // Header
                    React.createElement('div', {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '25px',
                            borderBottom: '2px solid var(--col-primary-form)',
                            paddingBottom: '15px'
                        }
                    },
                        React.createElement('h2', {
                            style: {
                                margin: 0,
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: 'var(--col-primary-form)'
                            }
                        }, 'Events & Conditions Builder'),
                        React.createElement('div', {
                            style: { display: 'flex', gap: '10px', alignItems: 'center' }
                        },
                            React.createElement('button', {
                                onClick: () => setMode('visual'),
                                style: {
                                    padding: '8px 16px',
                                    fontSize: '13px',
                                    backgroundColor: mode === 'visual' ? 'var(--col-primary-form)' : 'var(--col-input-default)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-sm)',
                                    cursor: 'pointer'
                                }
                            }, 'Visual Editor'),
                            React.createElement('button', {
                                onClick: () => setMode('yaml'),
                                style: {
                                    padding: '8px 16px',
                                    fontSize: '13px',
                                    backgroundColor: mode === 'yaml' ? 'var(--col-primary-form)' : 'var(--col-input-default)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-sm)',
                                    cursor: 'pointer'
                                }
                            }, 'YAML Editor'),
                            React.createElement('button', {
                                onClick: handleCancel,
                                style: {
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    backgroundColor: 'var(--col-cancel-color)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-sm)',
                                    cursor: 'pointer'
                                }
                            }, '✕ Close')
                        )
                    ),

                    // Content
                    mode === 'yaml' ? 
                        React.createElement('div', { style: { marginBottom: '20px' } },
                            React.createElement('textarea', {
                                value: localValue,
                                onChange: (e) => setLocalValue(e.target.value),
                                placeholder: `- on: right_click
  functions:
    - type: message
      message: "Hello World!"
      target: self`,
                                style: {
                                    width: '100%',
                                    minHeight: '500px',
                                    padding: '15px',
                                    fontSize: '13px',
                                    fontFamily: 'Monaco, Consolas, monospace',
                                    backgroundColor: 'var(--col-input-default)',
                                    color: 'var(--col-txt-primary)',
                                    border: '1px solid var(--col-ouliner-default)',
                                    borderRadius: 'var(--radius-sm)',
                                    resize: 'vertical',
                                    lineHeight: '1.5'
                                }
                            })
                        )
                    :
                        React.createElement('div', null,
                            // Add Event Buttons
                            React.createElement('div', { style: { marginBottom: '20px' } },
                                React.createElement('h3', {
                                    style: { fontSize: '16px', marginBottom: '10px' }
                                }, 'Add Event Trigger'),
                                React.createElement('div', {
                                    style: { display: 'flex', flexWrap: 'wrap', gap: '8px' }
                                },
                                    EVENT_TRIGGERS.map(trigger =>
                                        React.createElement('button', {
                                            key: trigger,
                                            onClick: () => addEvent(trigger),
                                            style: {
                                                padding: '8px 16px',
                                                fontSize: '13px',
                                                backgroundColor: 'var(--col-input-default)',
                                                color: 'var(--col-txt-primary)',
                                                border: '1px solid var(--col-ouliner-default)',
                                                borderRadius: 'var(--radius-sm)',
                                                cursor: 'pointer'
                                            }
                                        }, `+ ${trigger}`)
                                    )
                                )
                            ),

                            // Events List
                            events.length === 0 ?
                                React.createElement('div', {
                                    style: {
                                        padding: '40px',
                                        textAlign: 'center',
                                        backgroundColor: 'var(--col-input-default)',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '2px dashed var(--col-ouliner-default)'
                                    }
                                },
                                    React.createElement('div', { style: { fontSize: '48px', marginBottom: '10px' } }, '📋'),
                                    React.createElement('p', {
                                        style: { margin: '10px 0 0 0', fontSize: '14px', color: 'var(--col-txt-secondary)' }
                                    }, 'No events configured. Add an event trigger above to get started.')
                                )
                            :
                                React.createElement('div', {
                                    style: { display: 'flex', flexDirection: 'column', gap: '15px' }
                                },
                                    events.map((event, eventIndex) =>
                                        React.createElement('div', {
                                            key: eventIndex,
                                            style: {
                                                backgroundColor: 'var(--col-input-default)',
                                                border: '1px solid var(--col-ouliner-default)',
                                                borderRadius: 'var(--radius-sm)',
                                                padding: '15px'
                                            }
                                        },
                                            // Event Header
                                            React.createElement('div', {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    marginBottom: '15px',
                                                    paddingBottom: '10px',
                                                    borderBottom: '1px solid var(--col-ouliner-default)'
                                                }
                                            },
                                                React.createElement('h4', {
                                                    style: { margin: 0, fontSize: '15px', color: 'var(--col-primary-form)' }
                                                }, `⚡ Event: ${event.trigger}`),
                                                React.createElement('button', {
                                                    onClick: () => removeEvent(eventIndex),
                                                    style: {
                                                        padding: '4px 8px',
                                                        fontSize: '12px',
                                                        backgroundColor: 'var(--col-cancel-color)',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: 'var(--radius-sm)',
                                                        cursor: 'pointer'
                                                    }
                                                }, 'Remove')
                                            ),

                                            // Add Function
                                            React.createElement('div', { style: { marginBottom: '15px' } },
                                                React.createElement('label', {
                                                    style: { display: 'block', marginBottom: '6px', fontSize: '13px' }
                                                }, 'Add Function:'),
                                                React.createElement('select', {
                                                    onChange: (e) => {
                                                        if (e.target.value) {
                                                            addFunction(eventIndex, e.target.value);
                                                            e.target.value = '';
                                                        }
                                                    },
                                                    style: {
                                                        padding: '8px',
                                                        fontSize: '13px',
                                                        backgroundColor: 'var(--col-primary)',
                                                        color: 'var(--col-txt-primary)',
                                                        border: '1px solid var(--col-ouliner-default)',
                                                        borderRadius: 'var(--radius-sm)',
                                                        width: '300px'
                                                    }
                                                },
                                                    React.createElement('option', { value: '' }, '-- Select Function Type --'),
                                                    Object.entries(FUNCTION_DEFINITIONS).map(([key, def]) =>
                                                        React.createElement('option', { key: key, value: key }, def.label)
                                                    )
                                                )
                                            ),

                                            // Functions List
                                            event.functions.length > 0 && React.createElement('div', {
                                                style: { display: 'flex', flexDirection: 'column', gap: '10px' }
                                            },
                                                event.functions.map((func, funcIndex) => {
                                                    const funcDef = FUNCTION_DEFINITIONS[func.type];
                                                    const isExpanded = expandedFunction?.eventIndex === eventIndex && expandedFunction?.funcIndex === funcIndex;
                                                    
                                                    return React.createElement('div', {
                                                        key: funcIndex,
                                                        style: {
                                                            backgroundColor: 'var(--col-primary)',
                                                            border: isExpanded ? '2px solid var(--col-primary-form)' : '1px solid var(--col-ouliner-default)',
                                                            borderRadius: 'var(--radius-sm)',
                                                            padding: '12px'
                                                        }
                                                    },
                                                        React.createElement('div', {
                                                            style: {
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                marginBottom: isExpanded ? '15px' : '0'
                                                            }
                                                        },
                                                            React.createElement('span', {
                                                                style: {
                                                                    fontSize: '13px',
                                                                    fontWeight: '500',
                                                                    color: 'var(--col-primary-form)'
                                                                }
                                                            }, funcDef?.label || func.type),
                                                            React.createElement('div', { style: { display: 'flex', gap: '6px' } },
                                                                React.createElement('button', {
                                                                    onClick: () => setExpandedFunction(isExpanded ? null : { eventIndex, funcIndex }),
                                                                    style: {
                                                                        padding: '4px 8px',
                                                                        fontSize: '11px',
                                                                        backgroundColor: isExpanded ? 'var(--col-primary-form)' : 'var(--col-input-default)',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: 'var(--radius-sm)',
                                                                        cursor: 'pointer'
                                                                    }
                                                                }, isExpanded ? 'Collapse' : 'Configure'),
                                                                React.createElement('button', {
                                                                    onClick: () => removeFunction(eventIndex, funcIndex),
                                                                    style: {
                                                                        padding: '4px 8px',
                                                                        fontSize: '11px',
                                                                        backgroundColor: 'var(--col-cancel-color)',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: 'var(--radius-sm)',
                                                                        cursor: 'pointer'
                                                                    }
                                                                }, 'Remove')
                                                            )
                                                        ),

                                                        // Expanded Configuration
                                                        isExpanded && funcDef && React.createElement('div', {
                                                            style: {
                                                                paddingTop: '15px',
                                                                borderTop: '1px solid var(--col-ouliner-default)'
                                                            }
                                                        },
                                                            // Function Fields
                                                            funcDef.fields.length > 0 && React.createElement('div', {
                                                                style: { marginBottom: '15px' }
                                                            },
                                                                React.createElement('h5', {
                                                                    style: {
                                                                        margin: '0 0 10px 0',
                                                                        fontSize: '13px',
                                                                        color: 'var(--col-txt-secondary)'
                                                                    }
                                                                }, 'Function Parameters:'),
                                                                funcDef.fields.map(field =>
                                                                    React.createElement('div', { key: field.name },
                                                                        renderField(
                                                                            field,
                                                                            func.fields[field.name],
                                                                            (val) => updateFunctionField(eventIndex, funcIndex, field.name, val)
                                                                        )
                                                                    )
                                                                )
                                                            ),

                                                            // Conditions Section
                                                            React.createElement('div', {
                                                                style: {
                                                                    marginTop: '15px',
                                                                    paddingTop: '15px',
                                                                    borderTop: '1px solid var(--col-ouliner-default)'
                                                                }
                                                            },
                                                                React.createElement('h5', {
                                                                    style: {
                                                                        margin: '0 0 10px 0',
                                                                        fontSize: '13px',
                                                                        color: 'var(--col-txt-secondary)'
                                                                    }
                                                                }, 'Conditions (optional):'),
                                                                React.createElement('select', {
                                                                    onChange: (e) => {
                                                                        if (e.target.value) {
                                                                            addCondition(eventIndex, funcIndex, e.target.value);
                                                                            e.target.value = '';
                                                                        }
                                                                    },
                                                                    style: {
                                                                        padding: '6px',
                                                                        fontSize: '12px',
                                                                        backgroundColor: 'var(--col-input-default)',
                                                                        color: 'var(--col-txt-primary)',
                                                                        border: '1px solid var(--col-ouliner-default)',
                                                                        borderRadius: 'var(--radius-sm)',
                                                                        width: '100%',
                                                                        marginBottom: '10px'
                                                                    }
                                                                },
                                                                    React.createElement('option', { value: '' }, '-- Add Condition --'),
                                                                    Object.entries(CONDITION_DEFINITIONS).map(([key, def]) =>
                                                                        React.createElement('option', { key: key, value: key }, def.label)
                                                                    )
                                                                ),

                                                                // Conditions List
                                                                func.conditions && func.conditions.length > 0 && React.createElement('div', {
                                                                    style: { display: 'flex', flexDirection: 'column', gap: '8px' }
                                                                },
                                                                    func.conditions.map((cond, condIndex) => {
                                                                        const condDef = CONDITION_DEFINITIONS[cond.type];
                                                                        
                                                                        return React.createElement('div', {
                                                                            key: condIndex,
                                                                            style: {
                                                                                padding: '10px',
                                                                                backgroundColor: 'var(--col-input-default)',
                                                                                borderRadius: 'var(--radius-sm)',
                                                                                border: '1px solid var(--col-ouliner-default)'
                                                                            }
                                                                        },
                                                                            React.createElement('div', {
                                                                                style: {
                                                                                    display: 'flex',
                                                                                    justifyContent: 'space-between',
                                                                                    alignItems: 'center',
                                                                                    marginBottom: condDef?.fields.length > 0 ? '10px' : '0'
                                                                                }
                                                                            },
                                                                                React.createElement('span', {
                                                                                    style: {
                                                                                        fontSize: '12px',
                                                                                        fontWeight: '500',
                                                                                        color: 'var(--col-txt-primary)'
                                                                                    }
                                                                                }, condDef?.label || cond.type),
                                                                                React.createElement('button', {
                                                                                    onClick: () => removeCondition(eventIndex, funcIndex, condIndex),
                                                                                    style: {
                                                                                        padding: '2px 6px',
                                                                                        fontSize: '10px',
                                                                                        backgroundColor: 'var(--col-cancel-color)',
                                                                                        color: 'white',
                                                                                        border: 'none',
                                                                                        borderRadius: 'var(--radius-sm)',
                                                                                        cursor: 'pointer'
                                                                                    }
                                                                                }, '×')
                                                                            ),

                                                                            // Condition Fields
                                                                            condDef && condDef.fields.length > 0 && condDef.fields.map(field =>
                                                                                React.createElement('div', { key: field.name },
                                                                                    renderField(
                                                                                        field,
                                                                                        cond.fields[field.name],
                                                                                        (val) => updateConditionField(eventIndex, funcIndex, condIndex, field.name, val)
                                                                                    )
                                                                                )
                                                                            )
                                                                        );
                                                                    })
                                                                )
                                                            )
                                                        )
                                                    );
                                                })
                                            )
                                        )
                                    )
                                )
                        ),

                    // Footer
                    React.createElement('div', {
                        style: {
                            marginTop: '25px',
                            paddingTop: '20px',
                            borderTop: '2px solid var(--col-primary-form)',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '10px'
                        }
                    },
                        React.createElement('button', {
                            onClick: handleCancel,
                            style: {
                                padding: '10px 20px',
                                fontSize: '14px',
                                backgroundColor: 'var(--col-cancel-color)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-sm)',
                                cursor: 'pointer'
                            }
                        }, 'Cancel'),
                        React.createElement('button', {
                            onClick: handleApply,
                            style: {
                                padding: '10px 20px',
                                fontSize: '14px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-sm)',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }
                        }, 'Apply Changes')
                    )
                )
            )
        )
    );
};
