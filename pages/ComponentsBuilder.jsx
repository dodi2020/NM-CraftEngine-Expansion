/**
 * NEXOMAKER STYLE GUIDE FOR FUTURE REFERENCE
 * IMPORTANT: Always use CSS variables with var() to sync with installed themes!
 *
 * Colors:
 * var(--col-primary) - main background (#0f0f0f)
 * var(--col-secondary) - secondary background (#0d0d0d)
 * var(--col-module-background) - module background (#0f0f0f)
 * var(--col-input-default) - input backgrounds (#1c1c1d)
 * var(--col-dropdown-items) - dropdown menus (#141414)
 * var(--col-primary-form) - primary accent buttons (#ce75e0 pink/purple)
 * var(--col-secondary-form) - secondary accent (#ff2222 red)
 * var(--col-btn-primary-hover) - hover state (#b358bb5d)
 * var(--col-cancel-color) - cancel/delete buttons (#d36868)
 * var(--col-txt-primary) - primary text (#cacaca)
 * var(--col-txt-secondary) - secondary text (#9b9b9b)
 * var(--col-border-secondary) - borders (#242424)
 * var(--col-ouliner-default) - subtle borders (rgba(255, 255, 255, 0.1))
 * var(--accent-col) - accent elements (#2c2c2c)
 *
 * Radius:
 * var(--radius-sm) - default radius (12px)
 * var(--radius-xs) - extra small (4px)
 * var(--radius-md) - medium (23px)
 * var(--radius-lg) - large (16px)
 *
 * Special Elements:
 * var(--special-button-bg) - special button background (#2c2c2c9c)
 * var(--special-button-secondary-bg) - secondary variant (#1f1f1f9c)
 * var(--special-button-radius) - button radius (12px)
 *
 * Layout:
 * var(--max-width) - max container width (1900px)
 * var(--font-family-main) - main font (Roboto)
 * var(--home-page-margin) - page margins (30px)
 */

module.exports = ({ useState, useEffect }) => {
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

  // Load saved data from localStorage
  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem('componentsBuilder');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Failed to load saved data:', err);
    }
    return null;
  };

  const savedData = loadSavedData();

  // State for components list
  const [components, setComponents] = useState(savedData?.components || []);
  const [currentType, setCurrentType] = useState(savedData?.currentType || 'minecraft:max_damage');
  const [customType, setCustomType] = useState(savedData?.customType || '');
  const [currentValue, setCurrentValue] = useState(savedData?.currentValue || '100');
  const [showCustomInput, setShowCustomInput] = useState(savedData?.showCustomInput || false);
  const [copySuccess, setCopySuccess] = useState('');

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      const dataToSave = {
        components,
        currentType,
        customType,
        currentValue,
        showCustomInput
      };
      localStorage.setItem('componentsBuilder', JSON.stringify(dataToSave));
    } catch (err) {
      console.error('Failed to save data:', err);
    }
  }, [components, currentType, customType, currentValue, showCustomInput]);

  // Generate YAML output
  const generateOutput = () => {
    if (components.length === 0) return '# No components added yet';

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
    setCurrentValue(getDefaultValue(currentType));
    setCustomType('');
    setShowCustomInput(false);
    setCopySuccess('');
  };

  // Remove component
  const removeComponent = (id) => {
    setComponents(components.filter(c => c.id !== id));
    setCopySuccess('');
  };

  // Clear all components
  const clearAll = () => {
    setComponents([]);
    setCopySuccess('');
  };

  // Clear everything
  const clearEverything = () => {
    if (confirm('Are you sure you want to clear everything? This will reset all components and settings.')) {
      setComponents([]);
      setCurrentType('minecraft:max_damage');
      setCustomType('');
      setCurrentValue('100');
      setShowCustomInput(false);
      setCopySuccess('');
      localStorage.removeItem('componentsBuilder');
    }
  };

  // Handle type change
  const handleTypeChange = (value) => {
    if (value === 'custom') {
      setShowCustomInput(true);
      setCurrentType(value);
      setCurrentValue('{}');
    } else {
      setShowCustomInput(false);
      setCurrentType(value);
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

  // Copy to clipboard
  const copyToClipboard = () => {
    const output = generateOutput();

    const textarea = document.createElement('textarea');
    textarea.value = output;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);

    try {
      textarea.select();
      document.execCommand('copy');
      setCopySuccess('Copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 3000);
    } catch (err) {
      navigator.clipboard.writeText(output).then(() => {
        setCopySuccess('Copied to clipboard!');
        setTimeout(() => setCopySuccess(''), 3000);
      }).catch(clipErr => {
        setCopySuccess('Failed to copy');
        console.error('Copy failed:', clipErr);
      });
    } finally {
      document.body.removeChild(textarea);
    }
  };

  return React.createElement('div', {
    style: {
      width: '100%',
      height: '100vh',
      overflow: 'auto',
      backgroundColor: 'var(--col-primary)',
      color: 'var(--col-txt-primary)'
    }
  },
    React.createElement('div', {
      style: {
        padding: 'var(--home-page-margin, 30px)',
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        fontFamily: 'var(--font-family-main)',
        paddingBottom: '40px'
      }
    },
      // Header
      React.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '30px',
          borderBottom: '1px solid var(--col-border-secondary)',
          paddingBottom: '20px'
        }
      },
        React.createElement('div', null,
          React.createElement('h1', {
            style: {
              margin: 0,
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'var(--col-txt-primary)'
            }
          }, 'Minecraft Components Builder (1.20.5+)'),
          React.createElement('p', { style: { margin: '5px 0 0', color: 'var(--col-txt-secondary)', fontSize: '14px' } },
            'Build custom data components for advanced item customization'
          )
        ),
        React.createElement('button', {
          onClick: clearEverything,
          style: {
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: 'var(--col-cancel-color)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            transition: 'all 0.3s'
          },
          onMouseOver: (e) => {
            e.target.style.opacity = '0.8';
            e.target.style.transform = 'scale(1.02)';
          },
          onMouseOut: (e) => {
            e.target.style.opacity = '1';
            e.target.style.transform = 'scale(1)';
          }
        }, 'Clear Everything')
      ),

      // Main content grid
      React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          marginBottom: '20px'
        }
      },
        // Left Panel - Builder
        React.createElement('div', {
          style: {
            backgroundColor: 'var(--col-input-default)',
            padding: '25px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--col-ouliner-default)'
          }
        },
          React.createElement('h2', {
            style: {
              marginTop: 0,
              marginBottom: '20px',
              fontSize: '20px',
              color: 'var(--col-txt-primary)',
              borderBottom: '1px solid var(--col-border-secondary)',
              paddingBottom: '10px'
            }
          }, 'Add Component'),

          // Component type selector
          React.createElement('div', { style: { marginBottom: '15px' } },
            React.createElement('label', {
              style: {
                display: 'block',
                marginBottom: '5px',
                fontSize: '14px',
                color: 'var(--col-txt-secondary)',
                fontWeight: '500'
              }
            }, 'Component Type:'),
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
                cursor: 'pointer'
              }
            }, COMPONENT_TYPES.map(type =>
              React.createElement('option', { key: type.value, value: type.value },
                type.label + (type.difficulty ? ` ${'★'.repeat(type.difficulty)}` : '')
              )
            ))
          ),

          // Custom type input
          showCustomInput && React.createElement('div', { style: { marginBottom: '15px' } },
            React.createElement('label', {
              style: {
                display: 'block',
                marginBottom: '5px',
                fontSize: '14px',
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
                padding: '10px',
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
                fontSize: '14px',
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
                padding: '10px',
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
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: 'var(--col-primary-form)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all 0.3s'
            },
            onMouseOver: (e) => {
              e.target.style.backgroundColor = 'var(--col-btn-primary-hover)';
              e.target.style.transform = 'scale(1.02)';
            },
            onMouseOut: (e) => {
              e.target.style.backgroundColor = 'var(--col-primary-form)';
              e.target.style.transform = 'scale(1)';
            }
          }, 'Add Component')
        ),

        // Right Panel - List
        React.createElement('div', {
          style: {
            backgroundColor: 'var(--col-input-default)',
            padding: '25px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--col-ouliner-default)'
          }
        },
          React.createElement('div', {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '1px solid var(--col-border-secondary)',
              paddingBottom: '10px'
            }
          },
            React.createElement('h2', {
              style: {
                margin: 0,
                fontSize: '20px',
                color: 'var(--col-txt-primary)'
              }
            }, `Components (${components.length})`),
            components.length > 0 && React.createElement('button', {
              onClick: clearAll,
              style: {
                padding: '6px 12px',
                fontSize: '12px',
                backgroundColor: 'var(--col-cancel-color)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              },
              onMouseOver: (e) => e.target.style.opacity = '0.8',
              onMouseOut: (e) => e.target.style.opacity = '1'
            }, 'Clear All')
          ),

          React.createElement('div', {
            style: {
              maxHeight: '600px',
              overflowY: 'auto'
            }
          },
            components.length === 0 ?
              React.createElement('div', {
                style: {
                  textAlign: 'center',
                  padding: '40px',
                  color: 'var(--col-txt-secondary)',
                  fontSize: '14px'
                }
              }, 'No components added yet. Add one using the form on the left.')
            :
              components.map(comp =>
                React.createElement('div', {
                  key: comp.id,
                  style: {
                    backgroundColor: 'var(--special-button-bg)',
                    padding: '15px',
                    marginBottom: '10px',
                    borderRadius: 'var(--special-button-radius)',
                    border: '1px solid var(--col-ouliner-default)',
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
                      backgroundColor: 'var(--col-cancel-color)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    },
                    onMouseOver: (e) => e.target.style.opacity = '0.8',
                    onMouseOut: (e) => e.target.style.opacity = '1'
                  }, 'Remove'),
                  React.createElement('div', {
                    style: {
                      fontSize: '14px',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      color: 'var(--col-primary-form)'
                    }
                  }, comp.type),
                  React.createElement('pre', {
                    style: {
                      fontSize: '12px',
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

      // Output Panel
      components.length > 0 && React.createElement('div', {
        style: {
          backgroundColor: 'var(--col-input-default)',
          padding: '25px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--col-ouliner-default)',
          marginTop: '20px'
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
          React.createElement('h2', {
            style: {
              margin: 0,
              fontSize: '20px',
              color: 'var(--col-txt-primary)'
            }
          }, 'Output (YAML)'),
          React.createElement('button', {
            onClick: copyToClipboard,
            style: {
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: 'var(--col-primary-form)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all 0.3s'
            },
            onMouseOver: (e) => {
              e.target.style.backgroundColor = 'var(--col-btn-primary-hover)';
              e.target.style.transform = 'scale(1.02)';
            },
            onMouseOut: (e) => {
              e.target.style.backgroundColor = 'var(--col-primary-form)';
              e.target.style.transform = 'scale(1)';
            }
          }, 'Copy to Clipboard')
        ),

        copySuccess && React.createElement('div', {
          style: {
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: 'var(--special-button-bg)',
            color: 'var(--col-primary-form)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '14px',
            textAlign: 'center',
            border: '1px solid var(--col-ouliner-default)'
          }
        }, copySuccess),

        React.createElement('pre', {
          style: {
            backgroundColor: 'var(--col-dropdown-items)',
            padding: '20px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--col-ouliner-default)',
            fontSize: '13px',
            lineHeight: '1.6',
            overflowX: 'auto',
            color: 'var(--col-txt-primary)',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace'
          }
        }, generateOutput())
      ),

      // Info Panel
      React.createElement('div', {
        style: {
          backgroundColor: 'var(--col-input-default)',
          padding: '20px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--col-ouliner-default)',
          marginTop: '20px',
          fontSize: '13px',
          color: 'var(--col-txt-secondary)'
        }
      },
        React.createElement('h3', {
          style: {
            marginTop: 0,
            color: 'var(--col-txt-primary)',
            fontSize: '16px'
          }
        }, 'How to use:'),
        React.createElement('ol', {
          style: {
            margin: 0,
            paddingLeft: '20px'
          }
        },
          React.createElement('li', null, 'Select a component type from the dropdown (★ indicates difficulty level)'),
          React.createElement('li', null, 'Edit the YAML value or use the default'),
          React.createElement('li', null, 'Click "Add Component" to add it to your list'),
          React.createElement('li', null, 'Copy the generated YAML output'),
          React.createElement('li', null, 'Paste into your item\'s "Custom Components" field in CraftEngine')
        ),
        React.createElement('div', {
          style: {
            marginTop: '15px',
            padding: '10px',
            backgroundColor: 'var(--col-dropdown-items)',
            borderRadius: 'var(--radius-sm)'
          }
        },
          React.createElement('strong', { style: { color: 'var(--col-primary-form)' } }, 'Documentation:'),
          React.createElement('ul', {
            style: {
              margin: '8px 0 0 0',
              paddingLeft: '20px'
            }
          },
            React.createElement('li', null,
              React.createElement('a', {
                href: 'https://minecraft.wiki/w/Data_component_format',
                target: '_blank',
                style: { color: '#2196F3' }
              }, 'Minecraft Wiki - Data Components')
            ),
            React.createElement('li', null,
              React.createElement('a', {
                href: 'https://xiao-momi.github.io/craft-engine-wiki/configuration/item/data',
                target: '_blank',
                style: { color: '#2196F3' }
              }, 'CraftEngine Wiki - Item Data')
            )
          )
        )
      )
    )
  );
};
