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
  // Available Minecraft attributes
  const ATTRIBUTES = [
    'attack_damage',
    'attack_knockback',
    'attack_speed',
    'armor',
    'armor_toughness',
    'knockback_resistance',
    'max_health',
    'movement_speed',
    'flying_speed',
    'luck',
    'step_height',
    'scale',
    'gravity',
    'jump_strength',
    'burning_time',
    'explosion_knockback_resistance',
    'movement_efficiency',
    'oxygen_bonus',
    'water_movement_efficiency'
  ];

  // Equipment slots
  const SLOTS = [
    'mainhand',
    'offhand',
    'head',
    'chest',
    'legs',
    'feet',
    'body'
  ];

  // Operations
  const OPERATIONS = [
    { value: 'add_value', label: 'Add Value', symbol: '+' },
    { value: 'add_multiplied_base', label: 'Add Multiplied Base', symbol: '+%' },
    { value: 'add_multiplied_total', label: 'Add Multiplied Total', symbol: 'x%' }
  ];

  // Load saved data from localStorage
  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem('attributeModifierBuilder');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Failed to load saved data:', err);
    }
    return null;
  };

  const savedData = loadSavedData();

  // State for modifiers list
  const [modifiers, setModifiers] = useState(savedData?.modifiers || []);

  // State for current modifier being built
  const [currentAttribute, setCurrentAttribute] = useState(savedData?.currentAttribute || 'attack_damage');
  const [currentSlots, setCurrentSlots] = useState(savedData?.currentSlots || ['mainhand']);
  const [currentOperation, setCurrentOperation] = useState(savedData?.currentOperation || 'add_value');
  const [currentAmount, setCurrentAmount] = useState(savedData?.currentAmount || '1.0');

  // State for output format
  const [outputFormat, setOutputFormat] = useState(savedData?.outputFormat || 'craftengine');
  const [copySuccess, setCopySuccess] = useState('');

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      const dataToSave = {
        modifiers,
        currentAttribute,
        currentSlots,
        currentOperation,
        currentAmount,
        outputFormat
      };
      localStorage.setItem('attributeModifierBuilder', JSON.stringify(dataToSave));
    } catch (err) {
      console.error('Failed to save data:', err);
    }
  }, [modifiers, currentAttribute, currentSlots, currentOperation, currentAmount, outputFormat]);

  // Toggle slot selection
  const toggleSlot = (slot) => {
    if (currentSlots.includes(slot)) {
      setCurrentSlots(currentSlots.filter(s => s !== slot));
    } else {
      setCurrentSlots([...currentSlots, slot]);
    }
  };

  // Add modifier to list
  const addModifier = () => {
    if (currentSlots.length === 0) {
      alert('Please select at least one slot');
      return;
    }

    const newModifiers = currentSlots.map(slot => ({
      id: Date.now() + Math.random(), // Unique ID for each
      attribute: currentAttribute,
      slot: slot,
      operation: currentOperation,
      amount: parseFloat(currentAmount) || 0
    }));

    setModifiers([...modifiers, ...newModifiers]);

    // Reset form
    setCurrentAmount('1.0');
    setCopySuccess('');
  };

  // Remove modifier from list
  const removeModifier = (id) => {
    setModifiers(modifiers.filter(m => m.id !== id));
    setCopySuccess('');
  };

  // Clear all modifiers
  const clearAll = () => {
    setModifiers([]);
    setCopySuccess('');
  };

  // Clear everything (reset to defaults)
  const clearEverything = () => {
    if (confirm('Are you sure you want to clear everything? This will reset all modifiers and settings.')) {
      setModifiers([]);
      setCurrentAttribute('attack_damage');
      setCurrentSlots(['mainhand']);
      setCurrentOperation('add_value');
      setCurrentAmount('1.0');
      setOutputFormat('craftengine');
      setCopySuccess('');
      localStorage.removeItem('attributeModifierBuilder');
    }
  };

  // Generate output based on format
  const generateOutput = () => {
    if (modifiers.length === 0) {
      return '# No modifiers added yet';
    }

    if (outputFormat === 'craftengine') {
      let output = '';
      modifiers.forEach(mod => {
        output += `- type: ${mod.attribute}\n`;
        output += `  amount: ${mod.amount}\n`;
        output += `  operation: ${mod.operation}\n`;
        output += `  slot: ${mod.slot}\n`;
      });
      return output;
    } else if (outputFormat === 'json') {
      const jsonModifiers = modifiers.map(mod => ({
        type: mod.attribute,
        amount: mod.amount,
        operation: mod.operation,
        slot: mod.slot
      }));
      return JSON.stringify({ "attribute-modifiers": jsonModifiers }, null, 2);
    } else if (outputFormat === 'compact') {
      let output = '';
      modifiers.forEach(mod => {
        output += `- type: ${mod.attribute}, amount: ${mod.amount}, operation: ${mod.operation}, slot: ${mod.slot}\n`;
      });
      return output;
    }
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    const output = generateOutput();

    // Create a temporary textarea element
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
      // Fallback to modern clipboard API
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

  // Get operation label
  const getOperationLabel = (operation) => {
    const op = OPERATIONS.find(o => o.value === operation);
    return op ? op.label : operation;
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
          }, 'Minecraft Attribute Modifier Builder'),
          React.createElement('p', {
            style: {
              margin: '5px 0 0',
              color: 'var(--col-txt-secondary)',
              fontSize: '14px'
            }
          }, 'Build custom attribute modifiers for items and equipment')
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
          }, 'Add Modifier'),

          // Attribute selector
          React.createElement('div', { style: { marginBottom: '15px' } },
            React.createElement('label', {
              style: {
                display: 'block',
                marginBottom: '5px',
                fontSize: '14px',
                color: 'var(--col-txt-secondary)',
                fontWeight: '500'
              }
            }, 'Attribute:'),
            React.createElement('select', {
              value: currentAttribute,
              onChange: (e) => setCurrentAttribute(e.target.value),
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
            }, ATTRIBUTES.map(attr =>
              React.createElement('option', { key: attr, value: attr }, attr)
            ))
          ),

          // Slots selector
          React.createElement('div', { style: { marginBottom: '15px' } },
            React.createElement('label', {
              style: {
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                color: 'var(--col-txt-secondary)',
                fontWeight: '500'
              }
            }, 'Slots (select one or more):'),
            React.createElement('div', {
              style: {
                backgroundColor: 'var(--col-dropdown-items)',
                border: '1px solid var(--col-ouliner-default)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px'
              }
            }, SLOTS.map(slot =>
              React.createElement('label', {
                key: slot,
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '6px 8px',
                  backgroundColor: currentSlots.includes(slot) ? 'var(--col-primary-form)' : 'var(--special-button-bg)',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background-color 0.2s',
                  fontSize: '13px'
                },
                onMouseOver: (e) => {
                  if (!currentSlots.includes(slot)) {
                    e.currentTarget.style.opacity = '0.8';
                  }
                },
                onMouseOut: (e) => {
                  if (!currentSlots.includes(slot)) {
                    e.currentTarget.style.opacity = '1';
                  }
                }
              },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: currentSlots.includes(slot),
                  onChange: () => toggleSlot(slot),
                  style: {
                    marginRight: '8px',
                    cursor: 'pointer',
                    accentColor: 'var(--col-primary-form)'
                  }
                }),
                React.createElement('span', {
                  style: { color: 'var(--col-txt-primary)' }
                }, slot)
              )
            ))
          ),

          // Operation selector
          React.createElement('div', { style: { marginBottom: '15px' } },
            React.createElement('label', {
              style: {
                display: 'block',
                marginBottom: '5px',
                fontSize: '14px',
                color: 'var(--col-txt-secondary)',
                fontWeight: '500'
              }
            }, 'Operation:'),
            React.createElement('select', {
              value: currentOperation,
              onChange: (e) => setCurrentOperation(e.target.value),
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
            }, OPERATIONS.map(op =>
              React.createElement('option', { key: op.value, value: op.value },
                `${op.label} (${op.symbol})`
              )
            ))
          ),

          // Amount input
          React.createElement('div', { style: { marginBottom: '15px' } },
            React.createElement('label', {
              style: {
                display: 'block',
                marginBottom: '5px',
                fontSize: '14px',
                color: 'var(--col-txt-secondary)',
                fontWeight: '500'
              }
            }, 'Amount:'),
            React.createElement('input', {
              type: 'number',
              step: '0.1',
              value: currentAmount,
              onChange: (e) => setCurrentAmount(e.target.value),
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

          React.createElement('button', {
            onClick: addModifier,
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
          }, 'Add Modifier')
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
            }, `Modifiers (${modifiers.length})`),
            modifiers.length > 0 && React.createElement('button', {
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
            modifiers.length === 0 ?
              React.createElement('div', {
                style: {
                  textAlign: 'center',
                  padding: '40px',
                  color: 'var(--col-txt-secondary)',
                  fontSize: '14px'
                }
              }, 'No modifiers added yet. Add one using the form on the left.')
            :
              modifiers.map(mod =>
                React.createElement('div', {
                  key: mod.id,
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
                    onClick: () => removeModifier(mod.id),
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
                      fontSize: '16px',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      color: 'var(--col-primary-form)'
                    }
                  }, mod.attribute),
                  React.createElement('div', {
                    style: {
                      fontSize: '13px',
                      color: 'var(--col-txt-secondary)',
                      marginBottom: '4px'
                    }
                  },
                    'Slot: ',
                    React.createElement('span', {
                      style: { color: 'var(--col-txt-primary)' }
                    }, mod.slot)
                  ),
                  React.createElement('div', {
                    style: {
                      fontSize: '13px',
                      color: 'var(--col-txt-secondary)',
                      marginBottom: '4px'
                    }
                  },
                    'Operation: ',
                    React.createElement('span', {
                      style: { color: 'var(--col-txt-primary)' }
                    }, getOperationLabel(mod.operation))
                  ),
                  React.createElement('div', {
                    style: {
                      fontSize: '13px',
                      color: 'var(--col-txt-secondary)',
                      marginBottom: '4px'
                    }
                  },
                    'Amount: ',
                    React.createElement('span', {
                      style: { color: 'var(--col-txt-primary)' }
                    }, mod.amount)
                  )
                )
              )
          )
        )
      ),

      // Output Panel
      modifiers.length > 0 && React.createElement('div', {
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
          }, 'Output'),
          React.createElement('div', {
            style: { display: 'flex', gap: '10px', alignItems: 'center' }
          },
            React.createElement('select', {
              value: outputFormat,
              onChange: (e) => {
                setOutputFormat(e.target.value);
                setCopySuccess('');
              },
              style: {
                padding: '8px 12px',
                fontSize: '14px',
                backgroundColor: 'var(--col-dropdown-items)',
                color: 'var(--col-txt-primary)',
                border: '1px solid var(--col-ouliner-default)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer'
              }
            },
              React.createElement('option', { value: 'craftengine' }, 'CraftEngine YAML'),
              React.createElement('option', { value: 'json' }, 'JSON Format'),
              React.createElement('option', { value: 'compact' }, 'Compact (Single Line)')
            ),
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
          )
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
          React.createElement('li', null, 'Select an attribute from the dropdown (e.g., attack_damage, armor)'),
          React.createElement('li', null, 'Select one or more slots using the checkboxes'),
          React.createElement('li', null, 'Choose an operation type (add_value, add_multiplied_base, or add_multiplied_total)'),
          React.createElement('li', null, 'Enter the amount value (can be negative for reductions)'),
          React.createElement('li', null, 'Click "Add Modifier" to create modifiers for all selected slots'),
          React.createElement('li', null, 'Use the output section to copy the generated CraftEngine YAML'),
          React.createElement('li', null, 'Paste into your Nexo Maker "Attribute Modifiers" Editor Module')
        ),
        React.createElement('div', {
          style: {
            marginTop: '15px',
            padding: '10px',
            backgroundColor: 'var(--col-dropdown-items)',
            borderRadius: 'var(--radius-sm)'
          }
        },
          React.createElement('strong', {
            style: { color: 'var(--col-primary-form)' }
          }, 'Operation Types:'),
          React.createElement('ul', {
            style: {
              margin: '8px 0 0 0',
              paddingLeft: '20px'
            }
          },
            React.createElement('li', null,
              React.createElement('strong', null, 'Add Value (+):'),
              ' Adds the value directly to the base attribute'
            ),
            React.createElement('li', null,
              React.createElement('strong', null, 'Add Multiplied Base (+%):'),
              ' Adds (base × value) to the attribute'
            ),
            React.createElement('li', null,
              React.createElement('strong', null, 'Add Multiplied Total (x%):'),
              ' Multiplies total by (1 + value)'
            )
          )
        )
      )
    )
  );
};
