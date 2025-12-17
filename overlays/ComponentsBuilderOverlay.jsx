module.exports = ({ useState, useEffect, useGlobalState, api }) => {
  // Global state for overlay visibility and data
  const [isVisible, setIsVisible] = useGlobalState('componentsBuilderOverlayVisible', false);
  const [overlayData, setOverlayData] = useGlobalState('componentsBuilderOverlayData', null);

  // Available component types (common ones for easy access)
  const COMPONENT_TYPES = [
    { value: 'minecraft:max_damage', label: 'Max Damage', difficulty: 1 },
    { value: 'minecraft:unbreakable', label: 'Unbreakable', difficulty: 1 },
    { value: 'minecraft:custom_model_data', label: 'Custom Model Data', difficulty: 1 },
    { value: 'minecraft:food', label: 'Food', difficulty: 2 },
    { value: 'minecraft:block_state', label: 'Block State', difficulty: 2 },
    { value: 'minecraft:instrument', label: 'Instrument', difficulty: 3 },
    { value: 'minecraft:fireworks', label: 'Fireworks', difficulty: 4 },
    { value: 'minecraft:can_break', label: 'Can Break', difficulty: 2 },
    { value: 'minecraft:can_place_on', label: 'Can Place On', difficulty: 2 },
    { value: 'minecraft:enchantment_glint_override', label: 'Enchantment Glint Override', difficulty: 1 },
    { value: 'minecraft:fire_resistant', label: 'Fire Resistant', difficulty: 1 },
    { value: 'minecraft:hide_additional_tooltip', label: 'Hide Additional Tooltip', difficulty: 1 },
    { value: 'minecraft:intangible_projectile', label: 'Intangible Projectile', difficulty: 1 },
    { value: 'minecraft:max_stack_size', label: 'Max Stack Size', difficulty: 1 },
    { value: 'minecraft:rarity', label: 'Rarity', difficulty: 1 },
    { value: 'minecraft:repair_cost', label: 'Repair Cost', difficulty: 1 },
    { value: 'custom', label: 'Custom Component...', difficulty: 0 }
  ];

  // State for components list
  const [components, setComponents] = useState([]);
  const [currentType, setCurrentType] = useState('minecraft:max_damage');
  const [customType, setCustomType] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Load data when overlay opens
  useEffect(() => {
    if (isVisible && overlayData) {
      if (overlayData.existingYaml) {
        try {
          const parsed = parseYamlToComponents(overlayData.existingYaml);
          setComponents(parsed);
        } catch (e) {
          console.error('Failed to parse existing YAML:', e);
        }
      }
    }
  }, [isVisible, overlayData]);

  // Parse YAML string to components array
  const parseYamlToComponents = (yamlString) => {
    const components = [];
    const lines = yamlString.split('\n');
    let currentComponent = null;
    let indentLevel = 0;
    let valueLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith('#')) continue;

      // Detect component key (namespace:component_name:)
      if (trimmed.match(/^[\w\d_]+:[\w\d_]+:/)) {
        if (currentComponent) {
          currentComponent.value = valueLines.join('\n');
          components.push(currentComponent);
        }

        const type = trimmed.replace(':', '');
        currentComponent = {
          id: Date.now() + Math.random(),
          type: type,
          value: ''
        };
        valueLines = [];
        indentLevel = line.indexOf(trimmed.charAt(0));
      } else if (currentComponent) {
        // Collect value lines
        valueLines.push(line.slice(indentLevel + 2)); // Remove base indent
      }
    }

    if (currentComponent) {
      currentComponent.value = valueLines.join('\n').trim();
      components.push(currentComponent);
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

      // If single line value, put it on same line as component key
      if (lines.length === 1) {
        output += `${comp.type}: ${value}\n`;
      } else {
        // Multi-line value, indent on separate lines
        output += `${comp.type}:\n`;
        lines.forEach(line => {
          output += `  ${line}\n`;
        });
      }
    });
    return output;
  };

  // Add component
  const addComponent = () => {
    const type = showCustomInput ? customType : currentType;

    if (!type || type === 'custom') {
      alert('Please enter a component type');
      return;
    }

    const newComponent = {
      id: Date.now() + Math.random(),
      type: type,
      value: currentValue || '{}'
    };

    setComponents([...components, newComponent]);
    setCurrentValue('');
    setCustomType('');
    setShowCustomInput(false);
    setCurrentType('minecraft:max_damage');
  };

  // Remove component
  const removeComponent = (id) => {
    setComponents(components.filter(c => c.id !== id));
  };

  // Handle type change
  const handleTypeChange = (value) => {
    if (value === 'custom') {
      setShowCustomInput(true);
      setCurrentType(value);
    } else {
      setShowCustomInput(false);
      setCurrentType(value);
      // Set default value based on type
      setCurrentValue(getDefaultValue(value));
    }
  };

  // Get default value for component type
  const getDefaultValue = (type) => {
    const defaults = {
      'minecraft:max_damage': '100',
      'minecraft:unbreakable': '{}',
      'minecraft:custom_model_data': '1000',
      'minecraft:food': 'nutrition: 5\nsaturation: 3.5\ncan-always-eat: false',
      'minecraft:block_state': 'note: "1"\npowered: "false"\ninstrument: "harp"',
      'minecraft:instrument': 'minecraft:ponder_goat_horn',
      'minecraft:fireworks': 'explosions:\n  - shape: small_ball\n    colors: [255,0,0]\nflight_duration: 1',
      'minecraft:can_break': 'blocks:\n  - minecraft:stone',
      'minecraft:can_place_on': 'blocks:\n  - minecraft:stone',
      'minecraft:enchantment_glint_override': 'true',
      'minecraft:fire_resistant': '{}',
      'minecraft:hide_additional_tooltip': '{}',
      'minecraft:intangible_projectile': '{}',
      'minecraft:max_stack_size': '64',
      'minecraft:rarity': 'epic',
      'minecraft:repair_cost': '0'
    };
    return defaults[type] || '{}';
  };

  // Save and close
  const handleSave = () => {
    const output = generateOutput();

    if (overlayData && overlayData.callback) {
      overlayData.callback(output);
    }

    setIsVisible(false);
    setComponents([]);
  };

  // Cancel and close
  const handleCancel = () => {
    setIsVisible(false);
    setComponents([]);
  };

  if (!isVisible) {
    return null;
  }

  return React.createElement('div', {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    onClick: (e) => {
      if (e.target === e.currentTarget) handleCancel();
    }
  },
    React.createElement('div', {
      style: {
        backgroundColor: '#1e1e1e',
        color: '#e0e0e0',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '1400px',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '30px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }
    },
      // Header
      React.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          borderBottom: '2px solid #3a3a3a',
          paddingBottom: '15px'
        }
      },
        React.createElement('div', null,
          React.createElement('h2', { style: { margin: 0, fontSize: '24px', color: '#fff' } },
            'Components Builder (1.20.5+)'
          ),
          React.createElement('p', { style: { margin: '5px 0 0', fontSize: '13px', color: '#888' } },
            'Create custom Minecraft components for advanced item customization'
          )
        ),
        React.createElement('button', {
          onClick: handleCancel,
          style: {
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: '#d32f2f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }
        }, '✕ Close')
      ),

      // Main content
      React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }
      },
        // Left panel - Builder
        React.createElement('div', {
          style: {
            backgroundColor: '#2a2a2a',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #3a3a3a'
          }
        },
          React.createElement('h3', { style: { marginTop: 0, color: '#fff' } }, 'Add Component'),

          // Component type selector
          React.createElement('div', { style: { marginBottom: '15px' } },
            React.createElement('label', { style: { display: 'block', marginBottom: '5px', fontSize: '14px', color: '#b0b0b0' } }, 'Component Type:'),
            React.createElement('select', {
              value: currentType,
              onChange: (e) => handleTypeChange(e.target.value),
              style: {
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                backgroundColor: '#1e1e1e',
                color: '#e0e0e0',
                border: '1px solid #4a4a4a',
                borderRadius: '4px'
              }
            }, COMPONENT_TYPES.map(type =>
              React.createElement('option', { key: type.value, value: type.value },
                type.label + (type.difficulty ? ` ${'★'.repeat(type.difficulty)}` : '')
              )
            ))
          ),

          // Custom type input
          showCustomInput && React.createElement('div', { style: { marginBottom: '15px' } },
            React.createElement('label', { style: { display: 'block', marginBottom: '5px', fontSize: '14px', color: '#b0b0b0' } }, 'Custom Component:'),
            React.createElement('input', {
              type: 'text',
              value: customType,
              onChange: (e) => setCustomType(e.target.value),
              placeholder: 'minecraft:your_component',
              style: {
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                backgroundColor: '#1e1e1e',
                color: '#e0e0e0',
                border: '1px solid #4a4a4a',
                borderRadius: '4px'
              }
            })
          ),

          // Value input
          React.createElement('div', { style: { marginBottom: '15px' } },
            React.createElement('label', { style: { display: 'block', marginBottom: '5px', fontSize: '14px', color: '#b0b0b0' } }, 'Component Value (YAML):'),
            React.createElement('textarea', {
              value: currentValue,
              onChange: (e) => setCurrentValue(e.target.value),
              placeholder: 'Enter YAML value or {} for boolean components',
              rows: 8,
              style: {
                width: '100%',
                padding: '10px',
                fontSize: '13px',
                fontFamily: 'Consolas, Monaco, monospace',
                backgroundColor: '#1e1e1e',
                color: '#e0e0e0',
                border: '1px solid #4a4a4a',
                borderRadius: '4px',
                resize: 'vertical'
              }
            })
          ),

          // Help text
          React.createElement('div', {
            style: {
              padding: '10px',
              backgroundColor: '#1e1e1e',
              borderRadius: '4px',
              marginBottom: '15px',
              fontSize: '12px',
              color: '#888'
            }
          },
            React.createElement('strong', { style: { color: '#4CAF50' } }, 'Tips:'),
            React.createElement('ul', { style: { margin: '5px 0 0 0', paddingLeft: '20px' } },
              React.createElement('li', null, 'Use {} for boolean components (fire_resistant, unbreakable)'),
              React.createElement('li', null, 'Format follows Minecraft Wiki component format'),
              React.createElement('li', null, 'Indentation is handled automatically')
            )
          ),

          React.createElement('button', {
            onClick: addComponent,
            style: {
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }
          }, 'Add Component')
        ),

        // Right panel - List
        React.createElement('div', {
          style: {
            backgroundColor: '#2a2a2a',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #3a3a3a'
          }
        },
          React.createElement('h3', { style: { marginTop: 0, color: '#fff' } }, `Components (${components.length})`),
          React.createElement('div', { style: { maxHeight: '500px', overflowY: 'auto' } },
            components.length === 0 ?
              React.createElement('div', {
                style: {
                  textAlign: 'center',
                  padding: '40px',
                  color: '#666',
                  fontSize: '14px'
                }
              }, 'No components added yet')
            :
              components.map(comp =>
                React.createElement('div', {
                  key: comp.id,
                  style: {
                    backgroundColor: '#1e1e1e',
                    padding: '15px',
                    marginBottom: '10px',
                    borderRadius: '4px',
                    border: '1px solid #3a3a3a',
                    position: 'relative'
                  }
                },
                  React.createElement('button', {
                    onClick: () => removeComponent(comp.id),
                    style: {
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      backgroundColor: '#d32f2f',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }
                  }, 'Remove'),
                  React.createElement('div', { style: { fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#4CAF50' } }, comp.type),
                  React.createElement('pre', {
                    style: {
                      fontSize: '12px',
                      color: '#b0b0b0',
                      fontFamily: 'Consolas, Monaco, monospace',
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }
                  }, comp.value)
                )
              )
          )
        )
      ),

      // Footer buttons
      React.createElement('div', {
        style: {
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '2px solid #3a3a3a'
        }
      },
        React.createElement('button', {
          onClick: handleCancel,
          style: {
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }
        }, 'Cancel'),
        React.createElement('button', {
          onClick: handleSave,
          style: {
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }
        }, 'Save & Close')
      ),

      // Reference section
      React.createElement('div', {
        style: {
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#2a2a2a',
          borderRadius: '8px',
          border: '1px solid #3a3a3a',
          fontSize: '12px',
          color: '#888'
        }
      },
        React.createElement('strong', { style: { color: '#fff', fontSize: '14px' } }, 'Quick Reference:'),
        React.createElement('div', { style: { marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } },
          React.createElement('div', null,
            React.createElement('strong', { style: { color: '#4CAF50' } }, 'Documentation:'),
            React.createElement('br', null),
            React.createElement('a', {
              href: 'https://minecraft.wiki/w/Data_component_format',
              target: '_blank',
              style: { color: '#2196F3' }
            }, 'Minecraft Wiki - Components'),
            React.createElement('br', null),
            React.createElement('a', {
              href: 'https://xiao-momi.github.io/craft-engine-wiki/configuration/item/data',
              target: '_blank',
              style: { color: '#2196F3' }
            }, 'CraftEngine Wiki - Item Data')
          ),
          React.createElement('div', null,
            React.createElement('strong', { style: { color: '#4CAF50' } }, 'Difficulty Levels:'),
            React.createElement('br', null),
            '★ Simple (boolean/number)',
            React.createElement('br', null),
            '★★ Moderate (structured data)',
            React.createElement('br', null),
            '★★★★ Advanced (complex nested)'
          )
        )
      )
    )
  );
};
