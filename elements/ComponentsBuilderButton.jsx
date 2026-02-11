/**
 * Components Builder Button Component
 * Custom element for opening the Components Builder overlay
 */
module.exports = ({ useState, useEffect, value, onChange, placeholder, rows }) => {
  // Inject custom scrollbar styles
  useEffect(() => {
    const styleId = 'components-builder-scrollbar-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* Custom scrollbar for Components Builder */
        .components-builder-scroll::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        .components-builder-scroll::-webkit-scrollbar-track {
          background: var(--col-input-default);
          border-radius: 6px;
        }
        .components-builder-scroll::-webkit-scrollbar-thumb {
          background: #8b7bb8;
          border-radius: 6px;
          border: 2px solid var(--col-input-default);
        }
        .components-builder-scroll::-webkit-scrollbar-thumb:hover {
          background: #9d8dc9;
        }
        .components-builder-scroll::-webkit-scrollbar-corner {
          background: var(--col-input-default);
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');

  // Sync local value with prop value when it changes externally (e.g., on load)
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  // Available component types (comprehensive list from Minecraft Wiki)
  const COMPONENT_TYPES = [
    // Common & Important
    { value: 'food+consumable', label: 'Consumable Food (Food + Consumable)', category: 'common' },
    { value: 'minecraft:custom_model_data', label: 'Custom Model Data', category: 'common' },
    { value: 'minecraft:max_damage', label: 'Max Damage', category: 'common' },
    { value: 'minecraft:max_stack_size', label: 'Max Stack Size', category: 'common' },
    { value: 'minecraft:rarity', label: 'Rarity', category: 'common' },
    { value: 'minecraft:custom_name', label: 'Custom Name', category: 'common' },
    { value: 'minecraft:lore', label: 'Lore (Tooltip Lines)', category: 'common' },
    { value: 'minecraft:unbreakable', label: 'Unbreakable', category: 'common' },
    { value: 'minecraft:enchantment_glint_override', label: 'Enchantment Glint Override', category: 'common' },
    
    // Combat & Attributes
    { value: 'minecraft:attribute_modifiers', label: 'Attribute Modifiers', category: 'combat' },
    { value: 'minecraft:damage', label: 'Damage (Durability Used)', category: 'combat' },
    { value: 'minecraft:enchantments', label: 'Enchantments', category: 'combat' },
    { value: 'minecraft:stored_enchantments', label: 'Stored Enchantments (Books)', category: 'combat' },
    { value: 'minecraft:repair_cost', label: 'Repair Cost', category: 'combat' },
    { value: 'minecraft:repairable', label: 'Repairable', category: 'combat' },
    { value: 'minecraft:weapon', label: 'Weapon', category: 'combat' },
    { value: 'minecraft:attack_range', label: 'Attack Range', category: 'combat' },
    { value: 'minecraft:damage_type', label: 'Damage Type', category: 'combat' },
    { value: 'minecraft:minimum_attack_charge', label: 'Minimum Attack Charge', category: 'combat' },
    { value: 'minecraft:kinetic_weapon', label: 'Kinetic Weapon', category: 'combat' },
    { value: 'minecraft:piercing_weapon', label: 'Piercing Weapon', category: 'combat' },
    { value: 'minecraft:blocks_attacks', label: 'Blocks Attacks (Shield)', category: 'combat' },
    
    // Tools & Mining
    { value: 'minecraft:tool', label: 'Tool', category: 'tools' },
    { value: 'minecraft:can_break', label: 'Can Break (Adventure Mode)', category: 'tools' },
    { value: 'minecraft:can_place_on', label: 'Can Place On (Adventure Mode)', category: 'tools' },
    { value: 'minecraft:break_sound', label: 'Break Sound', category: 'tools' },
    
    // Consumables & Food
    { value: 'minecraft:consumable', label: 'Consumable', category: 'consumable' },
    { value: 'minecraft:food', label: 'Food', category: 'consumable' },
    { value: 'minecraft:potion_contents', label: 'Potion Contents', category: 'consumable' },
    { value: 'minecraft:suspicious_stew_effects', label: 'Suspicious Stew Effects', category: 'consumable' },
    { value: 'minecraft:ominous_bottle_amplifier', label: 'Ominous Bottle Amplifier', category: 'consumable' },
    { value: 'minecraft:use_remainder', label: 'Use Remainder', category: 'consumable' },
    { value: 'minecraft:use_cooldown', label: 'Use Cooldown', category: 'consumable' },
    { value: 'minecraft:death_protection', label: 'Death Protection (Totem)', category: 'consumable' },
    
    // Equipment & Wearables
    { value: 'minecraft:equippable', label: 'Equippable', category: 'equipment' },
    { value: 'minecraft:trim', label: 'Armor Trim', category: 'equipment' },
    { value: 'minecraft:dyed_color', label: 'Dyed Color (Leather Armor)', category: 'equipment' },
    { value: 'minecraft:glider', label: 'Glider (Elytra)', category: 'equipment' },
    
    // Containers & Storage
    { value: 'minecraft:container', label: 'Container (Items Inside)', category: 'containers' },
    { value: 'minecraft:bundle_contents', label: 'Bundle Contents', category: 'containers' },
    { value: 'minecraft:container_loot', label: 'Container Loot Table', category: 'containers' },
    { value: 'minecraft:lock', label: 'Lock (Requires Key)', category: 'containers' },
    
    // Blocks & Placement
    { value: 'minecraft:block_state', label: 'Block State', category: 'blocks' },
    { value: 'minecraft:block_entity_data', label: 'Block Entity Data', category: 'blocks' },
    
    // Fireworks & Effects
    { value: 'minecraft:fireworks', label: 'Fireworks (Rocket)', category: 'fireworks' },
    { value: 'minecraft:firework_explosion', label: 'Firework Explosion (Star)', category: 'fireworks' },
    
    // Maps & Navigation
    { value: 'minecraft:map_id', label: 'Map ID', category: 'maps' },
    { value: 'minecraft:map_color', label: 'Map Color', category: 'maps' },
    { value: 'minecraft:map_decorations', label: 'Map Decorations', category: 'maps' },
    { value: 'minecraft:lodestone_tracker', label: 'Lodestone Tracker (Compass)', category: 'maps' },
    
    // Music & Sounds
    { value: 'minecraft:instrument', label: 'Instrument (Goat Horn)', category: 'sounds' },
    { value: 'minecraft:jukebox_playable', label: 'Jukebox Playable', category: 'sounds' },
    { value: 'minecraft:note_block_sound', label: 'Note Block Sound', category: 'sounds' },
    
    // Books & Writing
    { value: 'minecraft:writable_book_content', label: 'Writable Book Content', category: 'books' },
    { value: 'minecraft:written_book_content', label: 'Written Book Content', category: 'books' },
    { value: 'minecraft:recipes', label: 'Recipes (Knowledge Book)', category: 'books' },
    
    // Projectiles & Shooting
    { value: 'minecraft:charged_projectiles', label: 'Charged Projectiles (Crossbow)', category: 'projectiles' },
    { value: 'minecraft:intangible_projectile', label: 'Intangible Projectile', category: 'projectiles' },
    
    // Entity-Related
    { value: 'minecraft:entity_data', label: 'Entity Data (Spawn Eggs)', category: 'entities' },
    { value: 'minecraft:bucket_entity_data', label: 'Bucket Entity Data', category: 'entities' },
    { value: 'minecraft:bees', label: 'Bees (Beehive/Nest)', category: 'entities' },
    { value: 'minecraft:profile', label: 'Profile (Player Head)', category: 'entities' },
    
    // Decorations & Display
    { value: 'minecraft:banner_patterns', label: 'Banner Patterns', category: 'decoration' },
    { value: 'minecraft:base_color', label: 'Base Color (Banner/Shield)', category: 'decoration' },
    { value: 'minecraft:pot_decorations', label: 'Pot Decorations (Sherds)', category: 'decoration' },
    { value: 'minecraft:item_model', label: 'Item Model Override', category: 'decoration' },
    { value: 'minecraft:item_name', label: 'Item Name (Default)', category: 'decoration' },
    
    // Advanced & Technical
    { value: 'minecraft:custom_data', label: 'Custom Data (NBT)', category: 'advanced' },
    { value: 'minecraft:damage_resistant', label: 'Damage Resistant', category: 'advanced' },
    { value: 'minecraft:enchantable', label: 'Enchantable', category: 'advanced' },
    { value: 'minecraft:tooltip_style', label: 'Tooltip Style', category: 'advanced' },
    { value: 'minecraft:use_effects', label: 'Use Effects', category: 'advanced' },
    { value: 'minecraft:swing_animation', label: 'Swing Animation', category: 'advanced' },
    { value: 'minecraft:potion_duration_scale', label: 'Potion Duration Scale', category: 'advanced' },
    { value: 'minecraft:debug_stick_state', label: 'Debug Stick State', category: 'advanced' },
    { value: 'minecraft:tooltip_display', label: 'Tooltip Display (Hide Components)', category: 'advanced' },
    { value: 'minecraft:provides_banner_patterns', label: 'Provides Banner Patterns', category: 'advanced' },
    { value: 'minecraft:provides_trim_material', label: 'Provides Trim Material', category: 'advanced' },
    
    // Custom fallback
    { value: 'custom', label: '🔧 Custom Component...', category: 'custom' }
  ];

  // State for components list
  const [components, setComponents] = useState([]);
  const [currentType, setCurrentType] = useState('food+consumable');
  const [customType, setCustomType] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [yamlEditMode, setYamlEditMode] = useState(false);
  const [editableYaml, setEditableYaml] = useState('');
  const [yamlDebounceTimer, setYamlDebounceTimer] = useState(null);

  // State for food+consumable configuration
  const [foodConfig, setFoodConfig] = useState({
    nutrition: 5,
    saturation: 5.0,
    canAlwaysEat: false
  });

  const [consumableConfig, setConsumableConfig] = useState({
    consumeSeconds: 1.6,
    animation: 'eat',
    sound: 'entity.generic.eat',
    hasConsumeParticles: true,
    onConsumeEffects: ''
  });

  // State for other component configs
  const [maxDamage, setMaxDamage] = useState(100);
  const [customModelData, setCustomModelData] = useState(1000);
  const [maxStackSize, setMaxStackSize] = useState(64);
  const [rarity, setRarity] = useState('common');
  const [repairCost, setRepairCost] = useState(0);
  const [enchantmentGlint, setEnchantmentGlint] = useState(true);
  const [instrument, setInstrument] = useState('ponder_goat_horn');
  const [blockState, setBlockState] = useState('note: "1"\npowered: "false"');
  const [customValue, setCustomValue] = useState('{}');

  // Fireworks config
  const [fireworksConfig, setFireworksConfig] = useState({
    flightDuration: 1,
    explosions: [{
      shape: 'small_ball',
      colors: ['#FF0000'],
      fadeColors: [],
      hasTrail: false,
      hasTwinkle: false
    }]
  });

  // Can break/place config
  const [canBreakBlocks, setCanBreakBlocks] = useState('minecraft:stone');
  const [canPlaceOnBlocks, setCanPlaceOnBlocks] = useState('minecraft:stone');

  // Parse YAML to components
  const parseYamlToComponents = (yamlString) => {
    if (!yamlString || yamlString.trim() === '') return [];

    const lines = yamlString.split('\n');
    const components = [];
    let currentType = null;
    let currentValue = [];
    let indent = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim() === '' || line.trim().startsWith('#')) continue;

      const lineIndent = line.search(/\S/);

      if (lineIndent === 0 && line.includes(':')) {
        if (currentType) {
          components.push({
            id: Date.now() + Math.random(),
            type: currentType,
            value: currentValue.join('\n').trim() || '{}'
          });
        }
        const parts = line.split(':');
        currentType = parts[0].trim();
        const restOfLine = parts.slice(1).join(':').trim();
        currentValue = restOfLine ? [restOfLine] : [];
        indent = lineIndent;
      } else if (currentType && lineIndent > indent) {
        currentValue.push(line.trim());
      }
    }

    if (currentType) {
      components.push({
        id: Date.now() + Math.random(),
        type: currentType,
        value: currentValue.join('\n').trim() || '{}'
      });
    }

    return components;
  };

  // Generate YAML output
  const generateOutput = () => {
    if (components.length === 0) return '';

    let output = '';
    components.forEach(comp => {
      const value = comp.value || '{}';
      const lines = value.split('\n');

      if (lines.length === 1) {
        output += `${comp.type}: ${value}\n`;
      } else {
        output += `${comp.type}:\n`;
        lines.forEach(line => {
          output += `  ${line}\n`;
        });
      }
    });
    return output;
  };

  // Load existing data when modal opens
  useEffect(() => {
    if (showModal) {
      try {
        const parsed = parseYamlToComponents(localValue);
        setComponents(parsed);
      } catch (e) {
        console.error('Failed to parse existing YAML:', e);
        setComponents([]);
      }
    }
  }, [showModal, localValue]);

  // Update editable YAML when components change
  useEffect(() => {
    if (!yamlEditMode) {
      setEditableYaml(generateOutput());
    }
  }, [components, yamlEditMode]);

  // Handle type change
  const handleTypeChange = (newValue) => {
    setCurrentType(newValue);
    setShowCustomInput(newValue === 'custom');
  };

  // Build value from current config (only include set values)
  const buildValueFromConfig = (type) => {
    if (type === 'food+consumable') {
      return 'COMBINED'; // Special marker
    } else if (type === 'minecraft:max_damage') {
      return maxDamage.toString();
    } else if (type === 'minecraft:custom_model_data') {
      return customModelData.toString();
    } else if (type === 'minecraft:max_stack_size') {
      return maxStackSize.toString();
    } else if (type === 'minecraft:rarity') {
      return rarity;
    } else if (type === 'minecraft:repair_cost') {
      return repairCost.toString();
    } else if (type === 'minecraft:enchantment_glint_override') {
      return enchantmentGlint.toString();
    } else if (type === 'minecraft:instrument') {
      return `minecraft:${instrument}`;
    } else if (type === 'minecraft:block_state') {
      return blockState;
    } else if (type === 'minecraft:fireworks') {
      let fireworksValue = `flight_duration: ${fireworksConfig.flightDuration}\nexplosions:`;
      fireworksConfig.explosions.forEach(exp => {
        fireworksValue += `\n  - shape: ${exp.shape}`;
        fireworksValue += `\n    colors: [${exp.colors.map(c => parseInt(c.replace('#', ''), 16)).join(',')}]`;
        if (exp.fadeColors && exp.fadeColors.length > 0) {
          fireworksValue += `\n    fade_colors: [${exp.fadeColors.map(c => parseInt(c.replace('#', ''), 16)).join(',')}]`;
        }
        if (exp.hasTrail) fireworksValue += `\n    has_trail: true`;
        if (exp.hasTwinkle) fireworksValue += `\n    has_twinkle: true`;
      });
      return fireworksValue;
    } else if (type === 'minecraft:can_break') {
      return `blocks:\n  - ${canBreakBlocks.split(',').map(b => b.trim()).join('\n  - ')}`;
    } else if (type === 'minecraft:can_place_on') {
      return `blocks:\n  - ${canPlaceOnBlocks.split(',').map(b => b.trim()).join('\n  - ')}`;
    }
    
    // Boolean components (no value needed, just {})
    else if (type === 'minecraft:unbreakable' ||
             type === 'minecraft:fire_resistant' ||
             type === 'minecraft:hide_additional_tooltip' ||
             type === 'minecraft:intangible_projectile' ||
             type === 'minecraft:glider') {
      return '{}';
    }
    
    // Components that need user input (return empty placeholder)
    else if (type === 'minecraft:custom_name' ||
             type === 'minecraft:lore' ||
             type === 'minecraft:item_name' ||
             type === 'minecraft:attribute_modifiers' ||
             type === 'minecraft:enchantments' ||
             type === 'minecraft:stored_enchantments' ||
             type === 'minecraft:custom_data' ||
             type === 'minecraft:tool' ||
             type === 'minecraft:weapon' ||
             type === 'minecraft:consumable' ||
             type === 'minecraft:food' ||
             type === 'minecraft:potion_contents' ||
             type === 'minecraft:equippable' ||
             type === 'minecraft:trim' ||
             type === 'minecraft:dyed_color' ||
             type === 'minecraft:container' ||
             type === 'minecraft:bundle_contents' ||
             type === 'minecraft:container_loot' ||
             type === 'minecraft:lock' ||
             type === 'minecraft:block_entity_data' ||
             type === 'minecraft:firework_explosion' ||
             type === 'minecraft:map_decorations' ||
             type === 'minecraft:lodestone_tracker' ||
             type === 'minecraft:jukebox_playable' ||
             type === 'minecraft:note_block_sound' ||
             type === 'minecraft:writable_book_content' ||
             type === 'minecraft:written_book_content' ||
             type === 'minecraft:recipes' ||
             type === 'minecraft:charged_projectiles' ||
             type === 'minecraft:entity_data' ||
             type === 'minecraft:bucket_entity_data' ||
             type === 'minecraft:bees' ||
             type === 'minecraft:profile' ||
             type === 'minecraft:banner_patterns' ||
             type === 'minecraft:base_color' ||
             type === 'minecraft:pot_decorations' ||
             type === 'minecraft:item_model' ||
             type === 'minecraft:damage_resistant' ||
             type === 'minecraft:enchantable' ||
             type === 'minecraft:tooltip_style' ||
             type === 'minecraft:use_effects' ||
             type === 'minecraft:swing_animation' ||
             type === 'minecraft:use_remainder' ||
             type === 'minecraft:use_cooldown' ||
             type === 'minecraft:death_protection' ||
             type === 'minecraft:attack_range' ||
             type === 'minecraft:damage_type' ||
             type === 'minecraft:minimum_attack_charge' ||
             type === 'minecraft:kinetic_weapon' ||
             type === 'minecraft:piercing_weapon' ||
             type === 'minecraft:blocks_attacks' ||
             type === 'minecraft:break_sound' ||
             type === 'minecraft:repairable' ||
             type === 'minecraft:suspicious_stew_effects' ||
             type === 'minecraft:ominous_bottle_amplifier' ||
             type === 'minecraft:potion_duration_scale' ||
             type === 'minecraft:debug_stick_state' ||
             type === 'minecraft:tooltip_display' ||
             type === 'minecraft:provides_banner_patterns' ||
             type === 'minecraft:provides_trim_material') {
      return '# Add component value here\n# See Minecraft Wiki for format';
    }
    
    // Simple numeric components with default 0
    else if (type === 'minecraft:damage' ||
             type === 'minecraft:map_id' ||
             type === 'minecraft:map_color') {
      return '0';
    }
    
    // Custom component
    else if (type === 'custom') {
      return customValue;
    }
    
    // Default fallback
    return '{}';
  };

  // Add component
  const addComponent = () => {
    const type = showCustomInput ? customType : currentType;

    if (!type || type.trim() === '') {
      alert('Please enter a component type');
      return;
    }

    // Special handling for combined food+consumable
    if (type === 'food+consumable') {
      const foodComponent = {
        id: Date.now() + Math.random(),
        type: 'minecraft:food',
        value: `nutrition: ${foodConfig.nutrition}\nsaturation: ${foodConfig.saturation}\ncan-always-eat: ${foodConfig.canAlwaysEat}`
      };

      let consumableValue = `consume-seconds: ${consumableConfig.consumeSeconds}\nanimation: ${consumableConfig.animation}\nsound: ${consumableConfig.sound}\nhas-consume-particles: ${consumableConfig.hasConsumeParticles}`;

      // Only add on-consume-effects if it's not empty
      if (consumableConfig.onConsumeEffects && consumableConfig.onConsumeEffects.trim()) {
        consumableValue += `\non-consume-effects:\n${consumableConfig.onConsumeEffects.split('\n').map(l => '  ' + l).join('\n')}`;
      }

      const consumableComponent = {
        id: Date.now() + Math.random() + 0.1,
        type: 'minecraft:consumable',
        value: consumableValue
      };

      setComponents([...components, foodComponent, consumableComponent]);
      return;
    }

    const newComponent = {
      id: Date.now() + Math.random(),
      type: type,
      value: showCustomInput ? customValue : buildValueFromConfig(type)
    };

    setComponents([...components, newComponent]);
  };

  // Remove component
  const removeComponent = (id) => {
    setComponents(components.filter(c => c.id !== id));
  };

  // Clear all
  const clearAll = () => {
    setComponents([]);
  };

  // Apply YAML changes back to components
  const applyYamlChanges = () => {
    try {
      const parsed = parseYamlToComponents(editableYaml);
      setComponents(parsed);
      setYamlEditMode(false);
    } catch (e) {
      alert('Failed to parse YAML. Please check your syntax.');
      console.error('YAML parse error:', e);
    }
  };

  // Handle YAML changes with debounce (auto-apply after 2 seconds of no typing)
  const handleYamlChange = (newYaml) => {
    setEditableYaml(newYaml);

    // Clear existing timer
    if (yamlDebounceTimer) {
      clearTimeout(yamlDebounceTimer);
    }

    // Set new timer to auto-apply after 2 seconds
    const timer = setTimeout(() => {
      try {
        const parsed = parseYamlToComponents(newYaml);
        setComponents(parsed);
      } catch (e) {
        // Silently fail during typing - user might be mid-edit
        console.log('YAML parse pending...', e.message);
      }
    }, 2000);

    setYamlDebounceTimer(timer);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (yamlDebounceTimer) {
        clearTimeout(yamlDebounceTimer);
      }
    };
  }, [yamlDebounceTimer]);

  // Save and close
  const handleSave = () => {
    const output = generateOutput();
    setLocalValue(output);
    setShowModal(false);
    onChange(output);
  };

  // Cancel and close
  const handleCancel = () => {
    setShowModal(false);
    setYamlEditMode(false);
  };

  // Render configuration panel based on selected type
  const renderConfigPanel = () => {
    if (showCustomInput) {
      return React.createElement('div', { style: { marginBottom: '15px' } },
        React.createElement('label', {
          style: {
            display: 'block',
            marginBottom: '5px',
            fontSize: '13px',
            color: 'var(--col-txt-secondary)',
            fontWeight: '500'
          }
        }, 'Custom Component:'),
        React.createElement('input', {
          type: 'text',
          value: customType,
          onChange: (e) => setCustomType(e.target.value),
          placeholder: 'minecraft:your_component',
          style: {
            width: '100%',
            padding: '8px',
            fontSize: '14px',
            backgroundColor: 'var(--col-dropdown-items)',
            color: 'var(--col-txt-primary)',
            border: '1px solid var(--col-ouliner-default)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '12px'
          }
        }),
        React.createElement('label', {
          style: {
            display: 'block',
            marginBottom: '5px',
            fontSize: '13px',
            color: 'var(--col-txt-secondary)',
            fontWeight: '500'
          }
        }, 'Component Value (YAML):'),
        React.createElement('textarea', {
          value: customValue,
          onChange: (e) => setCustomValue(e.target.value),
          placeholder: 'Enter YAML value or {} for boolean components',
          rows: 6,
          style: {
            width: '100%',
            padding: '8px',
            fontSize: '13px',
            fontFamily: 'Consolas, Monaco, monospace',
            backgroundColor: 'var(--col-dropdown-items)',
            color: 'var(--col-txt-primary)',
            border: '1px solid var(--col-ouliner-default)',
            borderRadius: 'var(--radius-sm)',
            resize: 'vertical'
          }
        })
      );
    }

    if (currentType === 'food+consumable') {
      return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '15px' } },
        // Food section
        React.createElement('div', {
          style: {
            padding: '15px',
            backgroundColor: 'var(--col-dropdown-items)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--col-ouliner-default)'
          }
        },
          React.createElement('h4', {
            style: {
              margin: '0 0 12px 0',
              fontSize: '14px',
              color: 'var(--col-primary-form)',
              fontWeight: '600'
            }
          }, '🍎 Food Component'),

          // Nutrition
          React.createElement('div', { style: { marginBottom: '10px' } },
            React.createElement('label', {
              style: {
                display: 'block',
                marginBottom: '4px',
                fontSize: '12px',
                color: 'var(--col-txt-secondary)'
              }
            }, 'Nutrition (food points):'),
            React.createElement('input', {
              type: 'number',
              value: foodConfig.nutrition,
              onChange: (e) => setFoodConfig({ ...foodConfig, nutrition: parseInt(e.target.value) || 0 }),
              min: 0,
              style: {
                width: '100%',
                padding: '6px 8px',
                fontSize: '13px',
                backgroundColor: 'var(--col-input-default)',
                color: 'var(--col-txt-primary)',
                border: '1px solid var(--col-ouliner-default)',
                borderRadius: 'var(--radius-xs)'
              }
            })
          ),

          // Saturation
          React.createElement('div', { style: { marginBottom: '10px' } },
            React.createElement('label', {
              style: {
                display: 'block',
                marginBottom: '4px',
                fontSize: '12px',
                color: 'var(--col-txt-secondary)'
              }
            }, 'Saturation:'),
            React.createElement('input', {
              type: 'number',
              value: foodConfig.saturation,
              onChange: (e) => setFoodConfig({ ...foodConfig, saturation: parseFloat(e.target.value) || 0 }),
              step: 0.1,
              style: {
                width: '100%',
                padding: '6px 8px',
                fontSize: '13px',
                backgroundColor: 'var(--col-input-default)',
                color: 'var(--col-txt-primary)',
                border: '1px solid var(--col-ouliner-default)',
                borderRadius: 'var(--radius-xs)'
              }
            })
          ),

          // Can Always Eat
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px',
              backgroundColor: 'var(--col-input-default)',
              borderRadius: 'var(--radius-xs)',
              cursor: 'pointer'
            },
            onClick: () => setFoodConfig({ ...foodConfig, canAlwaysEat: !foodConfig.canAlwaysEat })
          },
            React.createElement('input', {
              type: 'checkbox',
              checked: foodConfig.canAlwaysEat,
              onChange: (e) => setFoodConfig({ ...foodConfig, canAlwaysEat: e.target.checked }),
              style: { cursor: 'pointer' }
            }),
            React.createElement('label', {
              style: {
                fontSize: '12px',
                color: 'var(--col-txt-primary)',
                cursor: 'pointer',
                flex: 1
              }
            }, 'Can Always Eat'),
            React.createElement('span', {
              style: {
                fontSize: '11px',
                color: foodConfig.canAlwaysEat ? '#4CAF50' : '#f44336',
                fontWeight: '600',
                fontFamily: 'monospace'
              }
            }, foodConfig.canAlwaysEat ? 'true' : 'false')
          )
        ),

        // Consumable section
        React.createElement('div', {
          style: {
            padding: '15px',
            backgroundColor: 'var(--col-dropdown-items)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--col-ouliner-default)'
          }
        },
          React.createElement('h4', {
            style: {
              margin: '0 0 12px 0',
              fontSize: '14px',
              color: 'var(--col-primary-form)',
              fontWeight: '600'
            }
          }, '⏱️ Consumable Component'),

          // Consume Seconds
          React.createElement('div', { style: { marginBottom: '10px' } },
            React.createElement('label', {
              style: {
                display: 'block',
                marginBottom: '4px',
                fontSize: '12px',
                color: 'var(--col-txt-secondary)'
              }
            }, 'Consume Seconds:'),
            React.createElement('input', {
              type: 'number',
              value: consumableConfig.consumeSeconds,
              onChange: (e) => setConsumableConfig({ ...consumableConfig, consumeSeconds: parseFloat(e.target.value) || 1.6 }),
              step: 0.1,
              min: 0,
              style: {
                width: '100%',
                padding: '6px 8px',
                fontSize: '13px',
                backgroundColor: 'var(--col-input-default)',
                color: 'var(--col-txt-primary)',
                border: '1px solid var(--col-ouliner-default)',
                borderRadius: 'var(--radius-xs)'
              }
            })
          ),

          // Animation
          React.createElement('div', { style: { marginBottom: '10px' } },
            React.createElement('label', {
              style: {
                display: 'block',
                marginBottom: '4px',
                fontSize: '12px',
                color: 'var(--col-txt-secondary)'
              }
            }, 'Animation:'),
            React.createElement('select', {
              value: consumableConfig.animation,
              onChange: (e) => setConsumableConfig({ ...consumableConfig, animation: e.target.value }),
              style: {
                width: '100%',
                padding: '6px 8px',
                fontSize: '13px',
                backgroundColor: 'var(--col-input-default)',
                color: 'var(--col-txt-primary)',
                border: '1px solid var(--col-ouliner-default)',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer'
              }
            },
              ['none', 'eat', 'drink', 'block', 'bow', 'spear', 'crossbow', 'spyglass', 'toot_horn', 'brush', 'bundle'].map(anim =>
                React.createElement('option', { key: anim, value: anim }, anim)
              )
            )
          ),

          // Sound
          React.createElement('div', { style: { marginBottom: '10px' } },
            React.createElement('label', {
              style: {
                display: 'block',
                marginBottom: '4px',
                fontSize: '12px',
                color: 'var(--col-txt-secondary)'
              }
            }, 'Sound Event:'),
            React.createElement('input', {
              type: 'text',
              value: consumableConfig.sound,
              onChange: (e) => setConsumableConfig({ ...consumableConfig, sound: e.target.value }),
              placeholder: 'entity.generic.eat',
              style: {
                width: '100%',
                padding: '6px 8px',
                fontSize: '13px',
                backgroundColor: 'var(--col-input-default)',
                color: 'var(--col-txt-primary)',
                border: '1px solid var(--col-ouliner-default)',
                borderRadius: 'var(--radius-xs)',
                fontFamily: 'monospace'
              }
            })
          ),

          // Has Consume Particles
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px',
              backgroundColor: 'var(--col-input-default)',
              borderRadius: 'var(--radius-xs)',
              cursor: 'pointer',
              marginBottom: '10px'
            },
            onClick: () => setConsumableConfig({ ...consumableConfig, hasConsumeParticles: !consumableConfig.hasConsumeParticles })
          },
            React.createElement('input', {
              type: 'checkbox',
              checked: consumableConfig.hasConsumeParticles,
              onChange: (e) => setConsumableConfig({ ...consumableConfig, hasConsumeParticles: e.target.checked }),
              style: { cursor: 'pointer' }
            }),
            React.createElement('label', {
              style: {
                fontSize: '12px',
                color: 'var(--col-txt-primary)',
                cursor: 'pointer',
                flex: 1
              }
            }, 'Has Consume Particles'),
            React.createElement('span', {
              style: {
                fontSize: '11px',
                color: consumableConfig.hasConsumeParticles ? '#4CAF50' : '#f44336',
                fontWeight: '600',
                fontFamily: 'monospace'
              }
            }, consumableConfig.hasConsumeParticles ? 'true' : 'false')
          ),

          // On Consume Effects (optional)
          React.createElement('div', { style: { marginBottom: '0' } },
            React.createElement('label', {
              style: {
                display: 'block',
                marginBottom: '4px',
                fontSize: '12px',
                color: 'var(--col-txt-secondary)'
              }
            }, 'On Consume Effects (optional YAML):'),
            React.createElement('textarea', {
              value: consumableConfig.onConsumeEffects,
              onChange: (e) => setConsumableConfig({ ...consumableConfig, onConsumeEffects: e.target.value }),
              placeholder: '- type: minecraft:clear_all_effects\n- type: minecraft:apply_effects\n  effects:\n    - id: minecraft:regeneration\n      duration: 100\n      amplifier: 1',
              rows: 4,
              style: {
                width: '100%',
                padding: '6px 8px',
                fontSize: '12px',
                fontFamily: 'Consolas, Monaco, monospace',
                backgroundColor: 'var(--col-input-default)',
                color: 'var(--col-txt-primary)',
                border: '1px solid var(--col-ouliner-default)',
                borderRadius: 'var(--radius-xs)',
                resize: 'vertical'
              }
            }),
            React.createElement('div', {
              style: {
                fontSize: '11px',
                color: 'var(--col-txt-secondary)',
                marginTop: '4px',
                fontStyle: 'italic'
              }
            }, 'Leave empty to not include this parameter in the export.')
          )
        )
      );
    }

    // Simple inputs for other component types
    if (currentType === 'minecraft:max_damage') {
      return React.createElement('div', { style: { marginBottom: '15px' } },
        React.createElement('label', {
          style: {
            display: 'block',
            marginBottom: '5px',
            fontSize: '13px',
            color: 'var(--col-txt-secondary)',
            fontWeight: '500'
          }
        }, 'Max Damage:'),
        React.createElement('input', {
          type: 'number',
          value: maxDamage,
          onChange: (e) => setMaxDamage(parseInt(e.target.value) || 0),
          min: 1,
          style: {
            width: '100%',
            padding: '8px',
            fontSize: '14px',
            backgroundColor: 'var(--col-dropdown-items)',
            color: 'var(--col-txt-primary)',
            border: '1px solid var(--col-ouliner-default)',
            borderRadius: 'var(--radius-sm)'
          }
        })
      );
    }

    if (currentType === 'minecraft:custom_model_data') {
      return React.createElement('div', { style: { marginBottom: '15px' } },
        React.createElement('label', {
          style: {
            display: 'block',
            marginBottom: '5px',
            fontSize: '13px',
            color: 'var(--col-txt-secondary)',
            fontWeight: '500'
          }
        }, 'Custom Model Data:'),
        React.createElement('input', {
          type: 'number',
          value: customModelData,
          onChange: (e) => setCustomModelData(parseInt(e.target.value) || 0),
          min: 0,
          style: {
            width: '100%',
            padding: '8px',
            fontSize: '14px',
            backgroundColor: 'var(--col-dropdown-items)',
            color: 'var(--col-txt-primary)',
            border: '1px solid var(--col-ouliner-default)',
            borderRadius: 'var(--radius-sm)'
          }
        })
      );
    }

    if (currentType === 'minecraft:max_stack_size') {
      return React.createElement('div', { style: { marginBottom: '15px' } },
        React.createElement('label', {
          style: {
            display: 'block',
            marginBottom: '5px',
            fontSize: '13px',
            color: 'var(--col-txt-secondary)',
            fontWeight: '500'
          }
        }, 'Max Stack Size:'),
        React.createElement('input', {
          type: 'number',
          value: maxStackSize,
          onChange: (e) => setMaxStackSize(Math.min(99, Math.max(1, parseInt(e.target.value) || 1))),
          min: 1,
          max: 99,
          style: {
            width: '100%',
            padding: '8px',
            fontSize: '14px',
            backgroundColor: 'var(--col-dropdown-items)',
            color: 'var(--col-txt-primary)',
            border: '1px solid var(--col-ouliner-default)',
            borderRadius: 'var(--radius-sm)'
          }
        })
      );
    }

    if (currentType === 'minecraft:rarity') {
      return React.createElement('div', { style: { marginBottom: '15px' } },
        React.createElement('label', {
          style: {
            display: 'block',
            marginBottom: '5px',
            fontSize: '13px',
            color: 'var(--col-txt-secondary)',
            fontWeight: '500'
          }
        }, 'Rarity:'),
        React.createElement('input', {
          type: 'text',
          value: rarity,
          onChange: (e) => setRarity(e.target.value),
          placeholder: 'common, uncommon, rare, epic',
          style: {
            width: '100%',
            padding: '8px',
            fontSize: '14px',
            backgroundColor: 'var(--col-dropdown-items)',
            color: 'var(--col-txt-primary)',
            border: '1px solid var(--col-ouliner-default)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'monospace'
          }
        }),
        React.createElement('div', {
          style: {
            fontSize: '11px',
            color: 'var(--col-txt-secondary)',
            marginTop: '4px',
            fontStyle: 'italic'
          }
        }, 'Common values: common, uncommon, rare, epic')
      );
    }

    if (currentType === 'minecraft:repair_cost') {
      return React.createElement('div', { style: { marginBottom: '15px' } },
        React.createElement('label', {
          style: {
            display: 'block',
            marginBottom: '5px',
            fontSize: '13px',
            color: 'var(--col-txt-secondary)',
            fontWeight: '500'
          }
        }, 'Repair Cost:'),
        React.createElement('input', {
          type: 'number',
          value: repairCost,
          onChange: (e) => setRepairCost(parseInt(e.target.value) || 0),
          min: 0,
          style: {
            width: '100%',
            padding: '8px',
            fontSize: '14px',
            backgroundColor: 'var(--col-dropdown-items)',
            color: 'var(--col-txt-primary)',
            border: '1px solid var(--col-ouliner-default)',
            borderRadius: 'var(--radius-sm)'
          }
        })
      );
    }

    if (currentType === 'minecraft:enchantment_glint_override') {
      return React.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px',
          backgroundColor: 'var(--col-dropdown-items)',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          marginBottom: '15px'
        },
        onClick: () => setEnchantmentGlint(!enchantmentGlint)
      },
        React.createElement('input', {
          type: 'checkbox',
          checked: enchantmentGlint,
          onChange: (e) => setEnchantmentGlint(e.target.checked),
          style: { cursor: 'pointer' }
        }),
        React.createElement('label', {
          style: {
            fontSize: '13px',
            color: 'var(--col-txt-primary)',
            cursor: 'pointer',
            flex: 1
          }
        }, 'Enchantment Glint Override'),
        React.createElement('span', {
          style: {
            fontSize: '12px',
            color: enchantmentGlint ? '#4CAF50' : '#f44336',
            fontWeight: '600',
            fontFamily: 'monospace'
          }
        }, enchantmentGlint ? 'true' : 'false')
      );
    }

    if (currentType === 'minecraft:instrument') {
      const instruments = [
        'ponder_goat_horn',
        'sing_goat_horn',
        'seek_goat_horn',
        'feel_goat_horn',
        'admire_goat_horn',
        'call_goat_horn',
        'yearn_goat_horn',
        'dream_goat_horn'
      ];

      return React.createElement('div', { style: { marginBottom: '15px' } },
        React.createElement('label', {
          style: {
            display: 'block',
            marginBottom: '5px',
            fontSize: '13px',
            color: 'var(--col-txt-secondary)',
            fontWeight: '500'
          }
        }, 'Instrument (Goat Horn):'),
        React.createElement('select', {
          value: instrument,
          onChange: (e) => setInstrument(e.target.value),
          style: {
            width: '100%',
            padding: '8px',
            fontSize: '14px',
            backgroundColor: 'var(--col-dropdown-items)',
            color: 'var(--col-txt-primary)',
            border: '1px solid var(--col-ouliner-default)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer'
          }
        }, instruments.map(inst =>
          React.createElement('option', { key: inst, value: inst }, inst.replace('_goat_horn', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
        ))
      );
    }

    if (currentType === 'minecraft:block_state') {
      return React.createElement('div', { style: { marginBottom: '15px' } },
        React.createElement('label', {
          style: {
            display: 'block',
            marginBottom: '5px',
            fontSize: '13px',
            color: 'var(--col-txt-secondary)',
            fontWeight: '500'
          }
        }, 'Block State (YAML):'),
        React.createElement('textarea', {
          value: blockState,
          onChange: (e) => setBlockState(e.target.value),
          placeholder: 'note: "1"\npowered: "false"',
          rows: 4,
          style: {
            width: '100%',
            padding: '8px',
            fontSize: '13px',
            fontFamily: 'Consolas, Monaco, monospace',
            backgroundColor: 'var(--col-dropdown-items)',
            color: 'var(--col-txt-primary)',
            border: '1px solid var(--col-ouliner-default)',
            borderRadius: 'var(--radius-sm)',
            resize: 'vertical'
          }
        })
      );
    }

    if (currentType === 'minecraft:fireworks') {
      const firstExplosion = fireworksConfig.explosions[0] || {};

      return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
        React.createElement('div', {
          style: {
            padding: '15px',
            backgroundColor: 'var(--col-dropdown-items)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--col-ouliner-default)'
          }
        },
          React.createElement('h4', {
            style: {
              margin: '0 0 12px 0',
              fontSize: '14px',
              color: 'var(--col-primary-form)',
              fontWeight: '600'
            }
          }, '🎆 Firework Configuration'),

          // Flight Duration
          React.createElement('div', { style: { marginBottom: '10px' } },
            React.createElement('label', {
              style: {
                display: 'block',
                marginBottom: '4px',
                fontSize: '12px',
                color: 'var(--col-txt-secondary)'
              }
            }, 'Flight Duration:'),
            React.createElement('input', {
              type: 'number',
              value: fireworksConfig.flightDuration,
              onChange: (e) => setFireworksConfig({ ...fireworksConfig, flightDuration: parseInt(e.target.value) || 1 }),
              min: -128,
              max: 127,
              style: {
                width: '100%',
                padding: '6px 8px',
                fontSize: '13px',
                backgroundColor: 'var(--col-input-default)',
                color: 'var(--col-txt-primary)',
                border: '1px solid var(--col-ouliner-default)',
                borderRadius: 'var(--radius-xs)'
              }
            })
          ),

          // Explosion Shape
          React.createElement('div', { style: { marginBottom: '10px' } },
            React.createElement('label', {
              style: {
                display: 'block',
                marginBottom: '4px',
                fontSize: '12px',
                color: 'var(--col-txt-secondary)'
              }
            }, 'Explosion Shape:'),
            React.createElement('select', {
              value: firstExplosion.shape || 'small_ball',
              onChange: (e) => {
                const newExplosions = [...fireworksConfig.explosions];
                newExplosions[0] = { ...newExplosions[0], shape: e.target.value };
                setFireworksConfig({ ...fireworksConfig, explosions: newExplosions });
              },
              style: {
                width: '100%',
                padding: '6px 8px',
                fontSize: '13px',
                backgroundColor: 'var(--col-input-default)',
                color: 'var(--col-txt-primary)',
                border: '1px solid var(--col-ouliner-default)',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer'
              }
            },
              ['small_ball', 'large_ball', 'star', 'creeper', 'burst'].map(shape =>
                React.createElement('option', { key: shape, value: shape }, shape.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
              )
            )
          ),

          // Color
          React.createElement('div', { style: { marginBottom: '10px' } },
            React.createElement('label', {
              style: {
                display: 'block',
                marginBottom: '4px',
                fontSize: '12px',
                color: 'var(--col-txt-secondary)'
              }
            }, 'Color:'),
            React.createElement('input', {
              type: 'color',
              value: (firstExplosion.colors && firstExplosion.colors[0]) || '#FF0000',
              onChange: (e) => {
                const newExplosions = [...fireworksConfig.explosions];
                newExplosions[0] = { ...newExplosions[0], colors: [e.target.value] };
                setFireworksConfig({ ...fireworksConfig, explosions: newExplosions });
              },
              style: {
                width: '100%',
                height: '40px',
                padding: '2px',
                backgroundColor: 'var(--col-input-default)',
                border: '1px solid var(--col-ouliner-default)',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer'
              }
            })
          ),

          // Has Trail
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px',
              backgroundColor: 'var(--col-input-default)',
              borderRadius: 'var(--radius-xs)',
              cursor: 'pointer',
              marginBottom: '8px'
            },
            onClick: () => {
              const newExplosions = [...fireworksConfig.explosions];
              newExplosions[0] = { ...newExplosions[0], hasTrail: !newExplosions[0].hasTrail };
              setFireworksConfig({ ...fireworksConfig, explosions: newExplosions });
            }
          },
            React.createElement('input', {
              type: 'checkbox',
              checked: firstExplosion.hasTrail || false,
              onChange: (e) => {
                const newExplosions = [...fireworksConfig.explosions];
                newExplosions[0] = { ...newExplosions[0], hasTrail: e.target.checked };
                setFireworksConfig({ ...fireworksConfig, explosions: newExplosions });
              },
              style: { cursor: 'pointer' }
            }),
            React.createElement('label', {
              style: {
                fontSize: '12px',
                color: 'var(--col-txt-primary)',
                cursor: 'pointer',
                flex: 1
              }
            }, 'Has Trail'),
            React.createElement('span', {
              style: {
                fontSize: '11px',
                color: firstExplosion.hasTrail ? '#4CAF50' : '#f44336',
                fontWeight: '600',
                fontFamily: 'monospace'
              }
            }, firstExplosion.hasTrail ? 'true' : 'false')
          ),

          // Has Twinkle
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px',
              backgroundColor: 'var(--col-input-default)',
              borderRadius: 'var(--radius-xs)',
              cursor: 'pointer'
            },
            onClick: () => {
              const newExplosions = [...fireworksConfig.explosions];
              newExplosions[0] = { ...newExplosions[0], hasTwinkle: !newExplosions[0].hasTwinkle };
              setFireworksConfig({ ...fireworksConfig, explosions: newExplosions });
            }
          },
            React.createElement('input', {
              type: 'checkbox',
              checked: firstExplosion.hasTwinkle || false,
              onChange: (e) => {
                const newExplosions = [...fireworksConfig.explosions];
                newExplosions[0] = { ...newExplosions[0], hasTwinkle: e.target.checked };
                setFireworksConfig({ ...fireworksConfig, explosions: newExplosions });
              },
              style: { cursor: 'pointer' }
            }),
            React.createElement('label', {
              style: {
                fontSize: '12px',
                color: 'var(--col-txt-primary)',
                cursor: 'pointer',
                flex: 1
              }
            }, 'Has Twinkle'),
            React.createElement('span', {
              style: {
                fontSize: '11px',
                color: firstExplosion.hasTwinkle ? '#4CAF50' : '#f44336',
                fontWeight: '600',
                fontFamily: 'monospace'
              }
            }, firstExplosion.hasTwinkle ? 'true' : 'false')
          )
        )
      );
    }

    if (currentType === 'minecraft:can_break') {
      return React.createElement('div', { style: { marginBottom: '15px' } },
        React.createElement('label', {
          style: {
            display: 'block',
            marginBottom: '5px',
            fontSize: '13px',
            color: 'var(--col-txt-secondary)',
            fontWeight: '500'
          }
        }, 'Blocks (comma-separated):'),
        React.createElement('textarea', {
          value: canBreakBlocks,
          onChange: (e) => setCanBreakBlocks(e.target.value),
          placeholder: 'minecraft:stone, minecraft:dirt, minecraft:grass_block',
          rows: 3,
          style: {
            width: '100%',
            padding: '8px',
            fontSize: '13px',
            fontFamily: 'monospace',
            backgroundColor: 'var(--col-dropdown-items)',
            color: 'var(--col-txt-primary)',
            border: '1px solid var(--col-ouliner-default)',
            borderRadius: 'var(--radius-sm)',
            resize: 'vertical'
          }
        }),
        React.createElement('div', {
          style: {
            fontSize: '11px',
            color: 'var(--col-txt-secondary)',
            marginTop: '4px',
            fontStyle: 'italic'
          }
        }, 'Separate block IDs with commas. Use tags with # prefix (e.g., #minecraft:logs)')
      );
    }

    if (currentType === 'minecraft:can_place_on') {
      return React.createElement('div', { style: { marginBottom: '15px' } },
        React.createElement('label', {
          style: {
            display: 'block',
            marginBottom: '5px',
            fontSize: '13px',
            color: 'var(--col-txt-secondary)',
            fontWeight: '500'
          }
        }, 'Blocks (comma-separated):'),
        React.createElement('textarea', {
          value: canPlaceOnBlocks,
          onChange: (e) => setCanPlaceOnBlocks(e.target.value),
          placeholder: 'minecraft:stone, minecraft:dirt, minecraft:grass_block',
          rows: 3,
          style: {
            width: '100%',
            padding: '8px',
            fontSize: '13px',
            fontFamily: 'monospace',
            backgroundColor: 'var(--col-dropdown-items)',
            color: 'var(--col-txt-primary)',
            border: '1px solid var(--col-ouliner-default)',
            borderRadius: 'var(--radius-sm)',
            resize: 'vertical'
          }
        }),
        React.createElement('div', {
          style: {
            fontSize: '11px',
            color: 'var(--col-txt-secondary)',
            marginTop: '4px',
            fontStyle: 'italic'
          }
        }, 'Separate block IDs with commas. Use tags with # prefix (e.g., #minecraft:logs)')
      );
    }

    // Boolean components (no config needed, auto-value {})
    if (currentType === 'minecraft:unbreakable' ||
        currentType === 'minecraft:fire_resistant' ||
        currentType === 'minecraft:hide_additional_tooltip' ||
        currentType === 'minecraft:intangible_projectile' ||
        currentType === 'minecraft:glider') {
      return React.createElement('div', {
        style: {
          padding: '20px',
          backgroundColor: 'var(--col-dropdown-items)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--col-ouliner-default)',
          marginBottom: '15px'
        }
      },
        React.createElement('div', {
          style: {
            textAlign: 'center',
            marginBottom: '15px'
          }
        },
          React.createElement('div', {
            style: {
              fontSize: '40px',
              marginBottom: '10px'
            }
          }, '✓'),
          React.createElement('div', {
            style: {
              fontSize: '13px',
              color: 'var(--col-txt-primary)',
              fontWeight: '600',
              marginBottom: '5px'
            }
          }, 'Boolean Component'),
          React.createElement('div', {
            style: {
              fontSize: '12px',
              color: 'var(--col-txt-secondary)',
              lineHeight: '1.5'
            }
          }, 'This component has no configuration. It will be added as a boolean flag.')
        ),
        React.createElement('div', {
          style: {
            padding: '10px',
            backgroundColor: 'var(--col-input-default)',
            borderRadius: 'var(--radius-xs)',
            fontSize: '12px',
            fontFamily: 'monospace',
            color: 'var(--col-txt-secondary)',
            textAlign: 'center'
          }
        }, 'Value: {}')
      );
    }

    // Simple numeric/ID components
    if (currentType === 'minecraft:damage' ||
        currentType === 'minecraft:map_id' ||
        currentType === 'minecraft:map_color') {
      return React.createElement('div', {
        style: {
          padding: '15px',
          backgroundColor: 'var(--col-dropdown-items)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--col-ouliner-default)',
          marginBottom: '15px'
        }
      },
        React.createElement('div', {
          style: {
            fontSize: '13px',
            color: 'var(--col-txt-primary)',
            fontWeight: '600',
            marginBottom: '10px'
          }
        }, `${currentType.replace('minecraft:', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} (Numeric)`),
        React.createElement('div', {
          style: {
            fontSize: '12px',
            color: 'var(--col-txt-secondary)',
            marginBottom: '10px',
            lineHeight: '1.5'
          }
        }, 'This component requires a numeric value. Default is 0.'),
        React.createElement('div', {
          style: {
            padding: '10px',
            backgroundColor: 'var(--col-input-default)',
            borderRadius: 'var(--radius-xs)',
            fontSize: '12px',
            fontFamily: 'monospace',
            color: 'var(--col-txt-secondary)'
          }
        }, 'Value will be set to: 0')
      );
    }

    // Components requiring custom YAML input
    const requiresCustomInput = [
      'minecraft:custom_name', 'minecraft:lore', 'minecraft:item_name',
      'minecraft:attribute_modifiers', 'minecraft:enchantments', 'minecraft:stored_enchantments',
      'minecraft:custom_data', 'minecraft:tool', 'minecraft:weapon',
      'minecraft:consumable', 'minecraft:food', 'minecraft:potion_contents',
      'minecraft:equippable', 'minecraft:trim', 'minecraft:dyed_color',
      'minecraft:container', 'minecraft:bundle_contents', 'minecraft:container_loot',
      'minecraft:lock', 'minecraft:block_entity_data', 'minecraft:firework_explosion',
      'minecraft:map_decorations', 'minecraft:lodestone_tracker', 'minecraft:jukebox_playable',
      'minecraft:note_block_sound', 'minecraft:writable_book_content', 'minecraft:written_book_content',
      'minecraft:recipes', 'minecraft:charged_projectiles', 'minecraft:entity_data',
      'minecraft:bucket_entity_data', 'minecraft:bees', 'minecraft:profile',
      'minecraft:banner_patterns', 'minecraft:base_color', 'minecraft:pot_decorations',
      'minecraft:item_model', 'minecraft:damage_resistant', 'minecraft:enchantable',
      'minecraft:tooltip_style', 'minecraft:use_effects', 'minecraft:swing_animation',
      'minecraft:use_remainder', 'minecraft:use_cooldown', 'minecraft:death_protection',
      'minecraft:attack_range', 'minecraft:damage_type', 'minecraft:minimum_attack_charge',
      'minecraft:kinetic_weapon', 'minecraft:piercing_weapon', 'minecraft:blocks_attacks',
      'minecraft:break_sound', 'minecraft:repairable', 'minecraft:suspicious_stew_effects',
      'minecraft:ominous_bottle_amplifier', 'minecraft:potion_duration_scale',
      'minecraft:debug_stick_state', 'minecraft:tooltip_display',
      'minecraft:provides_banner_patterns', 'minecraft:provides_trim_material'
    ];

    if (requiresCustomInput.includes(currentType)) {
      const componentName = currentType.replace('minecraft:', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      return React.createElement('div', {
        style: {
          padding: '20px',
          backgroundColor: 'var(--col-dropdown-items)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--col-ouliner-default)',
          marginBottom: '15px'
        }
      },
        React.createElement('div', {
          style: {
            textAlign: 'center',
            marginBottom: '15px'
          }
        },
          React.createElement('div', {
            style: {
              fontSize: '40px',
              marginBottom: '10px'
            }
          }, '📝'),
          React.createElement('div', {
            style: {
              fontSize: '13px',
              color: 'var(--col-txt-primary)',
              fontWeight: '600',
              marginBottom: '5px'
            }
          }, componentName),
          React.createElement('div', {
            style: {
              fontSize: '12px',
              color: 'var(--col-txt-secondary)',
              lineHeight: '1.5',
              marginBottom: '10px'
            }
          }, 'This component requires custom YAML/JSON configuration.')
        ),
        React.createElement('div', {
          style: {
            padding: '12px',
            backgroundColor: 'var(--col-input-default)',
            borderRadius: 'var(--radius-xs)',
            fontSize: '11px',
            color: 'var(--col-txt-secondary)',
            lineHeight: '1.6',
            marginBottom: '12px'
          }
        },
          React.createElement('div', { style: { fontWeight: '600', marginBottom: '5px' } }, 'ℹ️ How to use:'),
          React.createElement('div', null, '1. Click "Add Component" to add it with a placeholder'),
          React.createElement('div', null, '2. The YAML Preview will show the placeholder'),
          React.createElement('div', null, '3. Click "Edit" in the YAML Preview panel'),
          React.createElement('div', null, '4. Replace the placeholder with your actual values'),
          React.createElement('div', { style: { marginTop: '8px', fontStyle: 'italic' } }, 'See Minecraft Wiki for component format details')
        ),
        React.createElement('a', {
          href: `https://minecraft.wiki/w/Data_component_format#${currentType.replace('minecraft:', '').replace(/_/g, '_')}`,
          target: '_blank',
          rel: 'noopener noreferrer',
          style: {
            display: 'block',
            textAlign: 'center',
            padding: '8px',
            backgroundColor: 'var(--col-primary-form)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 'var(--radius-xs)',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'opacity 0.2s'
          },
          onMouseOver: (e) => e.target.style.opacity = '0.9',
          onMouseOut: (e) => e.target.style.opacity = '1'
        }, '📖 View Format on Minecraft Wiki')
      );
    }

    // Default fallback
    return React.createElement('div', {
      style: {
        padding: '15px',
        backgroundColor: 'var(--col-dropdown-items)',
        borderRadius: 'var(--radius-sm)',
        textAlign: 'center',
        color: 'var(--col-txt-secondary)',
        fontSize: '13px',
        marginBottom: '15px'
      }
    }, 'This component type is not configured yet.');
  };

  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      width: '100%'
    }
  },
    // Textarea for manual YAML input
    React.createElement('textarea', {
      value: localValue,
      onChange: (e) => {
        setLocalValue(e.target.value);
        onChange(e.target.value);
      },
      placeholder: placeholder,
      rows: rows,
      style: {
        width: '100%',
        padding: '8px',
        fontSize: '13px',
        fontFamily: 'monospace',
        backgroundColor: 'var(--col-input-default)',
        color: 'var(--col-txt-primary)',
        border: '1px solid var(--col-ouliner-default)',
        borderRadius: 'var(--radius-sm)',
        resize: 'vertical'
      }
    }),

    // Button to open visual builder
    React.createElement('button', {
      type: 'button',
      onClick: () => setShowModal(true),
      style: {
        width: '100%',
        padding: '10px 16px',
        fontSize: '14px',
        fontWeight: '600',
        backgroundColor: 'var(--col-primary-form)',
        color: 'white',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      },
      onMouseEnter: (e) => {
        e.target.style.backgroundColor = 'var(--col-btn-primary-hover)';
        e.target.style.transform = 'translateY(-1px)';
      },
      onMouseLeave: (e) => {
        e.target.style.backgroundColor = 'var(--col-primary-form)';
        e.target.style.transform = 'translateY(0)';
      }
    },
      React.createElement('span', null, '🧩'),
      React.createElement('span', null, 'Open Components Builder')
    ),

    // Modal overlay
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
          overflow: 'hidden',
          border: '2px solid var(--col-primary-form)',
          boxShadow: '0 10px 50px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column'
        },
        onClick: (e) => e.stopPropagation()
      },
        // Header with close button
        React.createElement('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 30px',
            borderBottom: '2px solid var(--col-primary-form)',
            backgroundColor: 'var(--col-secondary)'
          }
        },
          React.createElement('h2', {
            style: {
              margin: 0,
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'var(--col-primary-form)'
            }
          }, 'Components Builder (1.20.5+)'),
          React.createElement('button', {
            onClick: handleCancel,
            style: {
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: 'var(--col-cancel-color)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            },
            onMouseOver: (e) => e.target.style.opacity = '0.8',
            onMouseOut: (e) => e.target.style.opacity = '1'
          }, '✕ Close')
        ),

        // Main content area with scroll
        React.createElement('div', {
          className: 'components-builder-scroll',
          style: {
            flex: 1,
            overflow: 'auto',
            padding: '30px'
          }
        },
          // Main content grid (3 columns)
          React.createElement('div', {
            style: {
              display: 'grid',
              gridTemplateColumns: '350px 1fr 350px',
              gap: '20px',
              minHeight: '500px'
            }
          },
            // Left Panel - Component Type Selector
            React.createElement('div', {
              style: {
                backgroundColor: 'var(--col-input-default)',
                padding: '20px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--col-ouliner-default)',
                display: 'flex',
                flexDirection: 'column'
              }
            },
              React.createElement('h3', {
                style: {
                  marginTop: 0,
                  marginBottom: '15px',
                  fontSize: '16px',
                  color: 'var(--col-txt-primary)'
                }
              }, 'Select Component Type'),

              React.createElement('select', {
                value: currentType,
                onChange: (e) => handleTypeChange(e.target.value),
                style: {
                  width: '100%',
                  padding: '10px',
                  fontSize: '14px',
                  backgroundColor: 'var(--col-dropdown-items)',
                  color: 'var(--col-txt-primary)',
                  border: '1px solid var(--col-ouliner-default)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  marginBottom: '20px'
                }
              }, COMPONENT_TYPES.map(type =>
                React.createElement('option', { key: type.value, value: type.value }, type.label)
              )),

              React.createElement('div', {
                className: 'components-builder-scroll',
                style: {
                  flex: 1,
                  overflowY: 'auto'
                }
              },
                renderConfigPanel()
              ),

              React.createElement('button', {
                onClick: addComponent,
                style: {
                  width: '100%',
                  padding: '12px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  backgroundColor: 'var(--col-primary-form)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  marginTop: '15px'
                },
                onMouseOver: (e) => e.target.style.opacity = '0.9',
                onMouseOut: (e) => e.target.style.opacity = '1'
              }, '+ Add Component')
            ),

            // Middle Panel - Components List
            React.createElement('div', {
              style: {
                backgroundColor: 'var(--col-input-default)',
                padding: '20px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--col-ouliner-default)',
                display: 'flex',
                flexDirection: 'column'
              }
            },
              React.createElement('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }
              },
                React.createElement('h3', {
                  style: {
                    margin: 0,
                    fontSize: '16px',
                    color: 'var(--col-txt-primary)'
                  }
                }, `Added Components (${components.length})`),
                components.length > 0 && React.createElement('button', {
                  onClick: clearAll,
                  style: {
                    padding: '5px 10px',
                    fontSize: '12px',
                    backgroundColor: 'var(--col-cancel-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s'
                  },
                  onMouseOver: (e) => e.target.style.opacity = '0.8',
                  onMouseOut: (e) => e.target.style.opacity = '1'
                }, 'Clear All')
              ),

              React.createElement('div', {
                className: 'components-builder-scroll',
                style: {
                  flex: 1,
                  overflowY: 'auto',
                  paddingRight: '5px'
                }
              },
                components.length === 0 ?
                  React.createElement('div', {
                    style: {
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: 'var(--col-txt-secondary)',
                      fontSize: '13px'
                    }
                  }, 'No components added yet. Configure and add components from the left panel.')
                :
                  components.map(comp =>
                    React.createElement('div', {
                      key: comp.id,
                      style: {
                        backgroundColor: 'var(--special-button-bg)',
                        padding: '12px',
                        marginBottom: '8px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--col-ouliner-default)',
                        position: 'relative'
                      }
                    },
                      React.createElement('button', {
                        onClick: () => removeComponent(comp.id),
                        style: {
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          padding: '3px 8px',
                          fontSize: '11px',
                          backgroundColor: 'var(--col-cancel-color)',
                          color: 'white',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          transition: 'opacity 0.2s'
                        },
                        onMouseOver: (e) => e.target.style.opacity = '0.8',
                        onMouseOut: (e) => e.target.style.opacity = '1'
                      }, '✕'),
                      React.createElement('div', {
                        style: {
                          fontSize: '13px',
                          fontWeight: 'bold',
                          marginBottom: '6px',
                          color: 'var(--col-primary-form)',
                          paddingRight: '30px'
                        }
                      }, comp.type),
                      React.createElement('pre', {
                        style: {
                          fontSize: '11px',
                          color: 'var(--col-txt-secondary)',
                          fontFamily: 'Consolas, Monaco, monospace',
                          margin: 0,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word'
                        }
                      }, comp.value)
                    )
                  )
              )
            ),

            // Right Panel - YAML Preview
            React.createElement('div', {
              style: {
                backgroundColor: 'var(--col-input-default)',
                padding: '20px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--col-ouliner-default)',
                display: 'flex',
                flexDirection: 'column'
              }
            },
              React.createElement('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }
              },
                React.createElement('h3', {
                  style: {
                    margin: 0,
                    fontSize: '16px',
                    color: 'var(--col-txt-primary)'
                  }
                }, 'YAML Preview'),
                React.createElement('button', {
                  onClick: () => {
                    if (yamlEditMode) {
                      applyYamlChanges();
                    } else {
                      setYamlEditMode(true);
                      setEditableYaml(generateOutput());
                    }
                  },
                  style: {
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: yamlEditMode ? '#4CAF50' : 'var(--col-primary-form)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s'
                  },
                  onMouseOver: (e) => e.target.style.opacity = '0.9',
                  onMouseOut: (e) => e.target.style.opacity = '1'
                }, yamlEditMode ? '✓ Apply' : '✏️ Edit')
              ),

              React.createElement('div', {
                style: {
                  flex: 1,
                  position: 'relative'
                }
              },
                yamlEditMode ?
                  React.createElement('textarea', {
                    value: editableYaml,
                    onChange: (e) => handleYamlChange(e.target.value),
                    style: {
                      width: '100%',
                      height: '100%',
                      padding: '15px',
                      fontSize: '12px',
                      lineHeight: '1.6',
                      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                      backgroundColor: 'var(--col-dropdown-items)',
                      color: 'var(--col-txt-primary)',
                      border: '1px solid var(--col-ouliner-default)',
                      borderRadius: 'var(--radius-sm)',
                      resize: 'none'
                    }
                  })
                :
                  React.createElement('div', {
                    className: 'components-builder-scroll',
                    style: {
                      height: '100%',
                      backgroundColor: 'var(--col-dropdown-items)',
                      padding: '15px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--col-ouliner-default)',
                      overflowY: 'auto'
                    }
                  },
                    React.createElement('pre', {
                      style: {
                        fontSize: '12px',
                        lineHeight: '1.6',
                        color: 'var(--col-txt-primary)',
                        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }
                    }, generateOutput() || '# No components added yet')
                  )
              )
            )
          )
        ),

        // Footer with action buttons
        React.createElement('div', {
          style: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            padding: '20px 30px',
            borderTop: '1px solid var(--col-border-secondary)',
            backgroundColor: 'var(--col-secondary)'
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
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            },
            onMouseOver: (e) => e.target.style.opacity = '0.8',
            onMouseOut: (e) => e.target.style.opacity = '1'
          }, 'Cancel'),
          React.createElement('button', {
            onClick: handleSave,
            style: {
              padding: '10px 30px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: 'var(--col-primary-form)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            },
            onMouseOver: (e) => e.target.style.opacity = '0.9',
            onMouseOut: (e) => e.target.style.opacity = '1'
          }, 'Save & Apply')
        )
      )
    )
  );
};
