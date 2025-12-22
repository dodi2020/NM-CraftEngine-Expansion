/**
 * Components Builder Button Component
 * Custom element for opening the Components Builder overlay
 */
module.exports = ({ useState, useEffect, value, onChange, placeholder, rows }) => {
  const [showModal, setShowModal] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');

  // Sync local value with prop value when it changes externally (e.g., on load)
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  // Available component types
  const COMPONENT_TYPES = [
    { value: 'minecraft:max_damage', label: 'Max Damage' },
    { value: 'minecraft:unbreakable', label: 'Unbreakable' },
    { value: 'minecraft:custom_model_data', label: 'Custom Model Data' },
    { value: 'minecraft:food', label: 'Food' },
    { value: 'minecraft:block_state', label: 'Block State' },
    { value: 'minecraft:instrument', label: 'Instrument' },
    { value: 'minecraft:fireworks', label: 'Fireworks' },
    { value: 'minecraft:can_break', label: 'Can Break' },
    { value: 'minecraft:can_place_on', label: 'Can Place On' },
    { value: 'minecraft:enchantment_glint_override', label: 'Enchantment Glint Override' },
    { value: 'minecraft:fire_resistant', label: 'Fire Resistant' },
    { value: 'minecraft:hide_additional_tooltip', label: 'Hide Additional Tooltip' },
    { value: 'minecraft:intangible_projectile', label: 'Intangible Projectile' },
    { value: 'minecraft:max_stack_size', label: 'Max Stack Size' },
    { value: 'minecraft:rarity', label: 'Rarity' },
    { value: 'minecraft:repair_cost', label: 'Repair Cost' },
    { value: 'custom', label: 'Custom Component...' }
  ];

  // State for components list
  const [components, setComponents] = useState([]);
  const [currentType, setCurrentType] = useState('minecraft:max_damage');
  const [customType, setCustomType] = useState('');
  const [currentValue, setCurrentValue] = useState('100');
  const [showCustomInput, setShowCustomInput] = useState(false);

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

  // Get default value
  const getDefaultValue = (type) => {
    const defaults = {
      'minecraft:max_damage': '100',
      'minecraft:unbreakable': '{}',
      'minecraft:custom_model_data': '1000',
      'minecraft:food': 'nutrition: 5\nsaturation: 3.5\ncan-always-eat: false',
      'minecraft:block_state': 'note: "1"\npowered: "false"',
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

  // Handle type change
  const handleTypeChange = (newValue) => {
    if (newValue === 'custom') {
      setShowCustomInput(true);
      setCurrentType(newValue);
      setCurrentValue('{}');
    } else {
      setShowCustomInput(false);
      setCurrentType(newValue);
      setCurrentValue(getDefaultValue(newValue));
    }
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
    setCurrentValue(getDefaultValue(currentType));
    setCustomType('');
    setShowCustomInput(false);
  };

  // Remove component
  const removeComponent = (id) => {
    setComponents(components.filter(c => c.id !== id));
  };

  // Clear all
  const clearAll = () => {
    setComponents([]);
  };

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
          maxWidth: '1200px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          border: '2px solid var(--col-primary-form)',
          boxShadow: '0 10px 50px rgba(0, 0, 0, 0.5)'
        },
        onClick: (e) => e.stopPropagation()
      },
        React.createElement('div', {
          style: {
            padding: '30px',
            color: 'var(--col-txt-primary)'
          }
        },
          // Header with close button
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

          // Main content grid
          React.createElement('div', {
            style: {
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '20px'
            }
          },
            // Left Panel - Builder
            React.createElement('div', {
              style: {
                backgroundColor: 'var(--col-input-default)',
                padding: '20px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--col-ouliner-default)'
              }
            },
              React.createElement('h3', {
                style: {
                  marginTop: 0,
                  marginBottom: '15px',
                  fontSize: '18px',
                  color: 'var(--col-txt-primary)'
                }
              }, 'Add Component'),

              // Component type selector
              React.createElement('div', { style: { marginBottom: '12px' } },
                React.createElement('label', {
                  style: {
                    display: 'block',
                    marginBottom: '5px',
                    fontSize: '13px',
                    color: 'var(--col-txt-secondary)',
                    fontWeight: '500'
                  }
                }, 'Component Type:'),
                React.createElement('select', {
                  value: currentType,
                  onChange: (e) => handleTypeChange(e.target.value),
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
                }, COMPONENT_TYPES.map(type =>
                  React.createElement('option', { key: type.value, value: type.value }, type.label)
                ))
              ),

              // Custom type input
              showCustomInput && React.createElement('div', { style: { marginBottom: '12px' } },
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
                    borderRadius: 'var(--radius-sm)'
                  }
                })
              ),

              // Value textarea
              React.createElement('div', { style: { marginBottom: '15px' } },
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
                  value: currentValue,
                  onChange: (e) => setCurrentValue(e.target.value),
                  placeholder: 'Enter YAML value or {} for boolean components',
                  rows: 8,
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
              ),

              React.createElement('button', {
                onClick: addComponent,
                style: {
                  width: '100%',
                  padding: '10px',
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
              }, '+ Add Component')
            ),

            // Right Panel - List
            React.createElement('div', {
              style: {
                backgroundColor: 'var(--col-input-default)',
                padding: '20px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--col-ouliner-default)'
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
                    fontSize: '18px',
                    color: 'var(--col-txt-primary)'
                  }
                }, `Components (${components.length})`),
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
                style: {
                  maxHeight: '400px',
                  overflowY: 'auto'
                }
              },
                components.length === 0 ?
                  React.createElement('div', {
                    style: {
                      textAlign: 'center',
                      padding: '30px',
                      color: 'var(--col-txt-secondary)',
                      fontSize: '13px'
                    }
                  }, 'No components added yet')
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
                          padding: '3px 6px',
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
                          fontSize: '14px',
                          fontWeight: 'bold',
                          marginBottom: '6px',
                          color: 'var(--col-primary-form)'
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
            )
          ),

          // Action buttons
          React.createElement('div', {
            style: {
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid var(--col-border-secondary)'
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
    )
  );
};
