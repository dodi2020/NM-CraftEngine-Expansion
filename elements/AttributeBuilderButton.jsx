/**
 * Attribute Builder Button Component
 * Custom element for opening the Attribute Builder overlay
 */
module.exports = ({ useState, useEffect, value, onChange, placeholder, rows }) => {
  const [showModal, setShowModal] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');

  // Sync local value with prop value when it changes externally (e.g., on load)
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  // Available Minecraft attributes
  const ATTRIBUTES = [
    'attack_damage', 'attack_knockback', 'attack_speed', 'armor', 'armor_toughness',
    'knockback_resistance', 'max_health', 'movement_speed', 'flying_speed', 'luck',
    'step_height', 'scale', 'gravity', 'jump_strength', 'burning_time',
    'explosion_knockback_resistance', 'movement_efficiency', 'oxygen_bonus', 'water_movement_efficiency'
  ];

  const SLOTS = ['mainhand', 'offhand', 'head', 'chest', 'legs', 'feet', 'body'];

  const OPERATIONS = [
    { value: 'add_value', label: 'Add Value', symbol: '+' },
    { value: 'add_multiplied_base', label: 'Add Multiplied Base', symbol: '+%' },
    { value: 'add_multiplied_total', label: 'Add Multiplied Total', symbol: 'x%' }
  ];

  // State for modifiers list
  const [modifiers, setModifiers] = useState([]);
  const [currentAttribute, setCurrentAttribute] = useState('attack_damage');
  const [currentSlots, setCurrentSlots] = useState(['mainhand']);
  const [currentOperation, setCurrentOperation] = useState('add_value');
  const [currentAmount, setCurrentAmount] = useState('1.0');

  // Parse YAML string to modifiers array
  const parseYamlToModifiers = (yamlString) => {
    if (!yamlString || yamlString.trim() === '') return [];

    const lines = yamlString.split('\n');
    const modifiers = [];
    let currentModifier = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      if (trimmed.startsWith('- type:')) {
        if (currentModifier) modifiers.push(currentModifier);
        currentModifier = {
          id: Date.now() + Math.random(),
          attribute: trimmed.split('type:')[1].trim()
        };
      } else if (currentModifier) {
        if (trimmed.startsWith('amount:')) {
          currentModifier.amount = parseFloat(trimmed.split('amount:')[1].trim());
        } else if (trimmed.startsWith('operation:')) {
          currentModifier.operation = trimmed.split('operation:')[1].trim();
        } else if (trimmed.startsWith('slot:')) {
          currentModifier.slot = trimmed.split('slot:')[1].trim();
        }
      }
    }
    if (currentModifier) modifiers.push(currentModifier);
    return modifiers;
  };

  // Generate YAML output
  const generateOutput = () => {
    if (modifiers.length === 0) return '';

    let output = '';
    modifiers.forEach(mod => {
      output += `- type: ${mod.attribute}\n`;
      output += `  amount: ${mod.amount}\n`;
      output += `  operation: ${mod.operation}\n`;
      output += `  slot: ${mod.slot}\n`;
    });
    return output;
  };

  // Load existing data when modal opens
  useEffect(() => {
    if (showModal) {
      try {
        const parsed = parseYamlToModifiers(localValue);
        setModifiers(parsed);
      } catch (e) {
        console.error('Failed to parse existing YAML:', e);
        setModifiers([]);
      }
    }
  }, [showModal, localValue]);

  // Toggle slot selection
  const toggleSlot = (slot) => {
    if (currentSlots.includes(slot)) {
      setCurrentSlots(currentSlots.filter(s => s !== slot));
    } else {
      setCurrentSlots([...currentSlots, slot]);
    }
  };

  // Add modifier
  const addModifier = () => {
    if (currentSlots.length === 0) {
      alert('Please select at least one slot');
      return;
    }

    const newModifiers = currentSlots.map(slot => ({
      id: Date.now() + Math.random(),
      attribute: currentAttribute,
      slot: slot,
      operation: currentOperation,
      amount: parseFloat(currentAmount) || 0
    }));

    setModifiers([...modifiers, ...newModifiers]);
    setCurrentAmount('1.0');
  };

  // Remove modifier
  const removeModifier = (id) => {
    setModifiers(modifiers.filter(m => m.id !== id));
  };

  // Clear all modifiers
  const clearAll = () => {
    setModifiers([]);
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

  // Get operation label
  const getOperationLabel = (operation) => {
    const op = OPERATIONS.find(o => o.value === operation);
    return op ? op.label : operation;
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
      React.createElement('span', null, '⚔️'),
      React.createElement('span', null, 'Open Attribute Builder')
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
            }, 'Attribute Modifier Builder'),
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
              }, 'Add Modifier'),

              // Attribute selector
              React.createElement('div', { style: { marginBottom: '12px' } },
                React.createElement('label', {
                  style: {
                    display: 'block',
                    marginBottom: '5px',
                    fontSize: '13px',
                    color: 'var(--col-txt-secondary)',
                    fontWeight: '500'
                  }
                }, 'Attribute:'),
                React.createElement('select', {
                  value: currentAttribute,
                  onChange: (e) => setCurrentAttribute(e.target.value),
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
                }, ATTRIBUTES.map(attr =>
                  React.createElement('option', { key: attr, value: attr }, attr)
                ))
              ),

              // Slots selector
              React.createElement('div', { style: { marginBottom: '12px' } },
                React.createElement('label', {
                  style: {
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '13px',
                    color: 'var(--col-txt-secondary)',
                    fontWeight: '500'
                  }
                }, 'Slots:'),
                React.createElement('div', {
                  style: {
                    backgroundColor: 'var(--col-dropdown-items)',
                    border: '1px solid var(--col-ouliner-default)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '6px'
                  }
                }, SLOTS.map(slot =>
                  React.createElement('label', {
                    key: slot,
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      padding: '5px 8px',
                      backgroundColor: currentSlots.includes(slot) ? 'var(--col-primary-form)' : 'transparent',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'background-color 0.2s',
                      fontSize: '12px'
                    }
                  },
                    React.createElement('input', {
                      type: 'checkbox',
                      checked: currentSlots.includes(slot),
                      onChange: () => toggleSlot(slot),
                      style: {
                        marginRight: '6px',
                        cursor: 'pointer',
                        accentColor: 'var(--col-primary-form)'
                      }
                    }),
                    React.createElement('span', null, slot)
                  )
                ))
              ),

              // Operation selector
              React.createElement('div', { style: { marginBottom: '12px' } },
                React.createElement('label', {
                  style: {
                    display: 'block',
                    marginBottom: '5px',
                    fontSize: '13px',
                    color: 'var(--col-txt-secondary)',
                    fontWeight: '500'
                  }
                }, 'Operation:'),
                React.createElement('select', {
                  value: currentOperation,
                  onChange: (e) => setCurrentOperation(e.target.value),
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
                    fontSize: '13px',
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
                    padding: '8px',
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
              }, '+ Add Modifier')
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
                }, `Modifiers (${modifiers.length})`),
                modifiers.length > 0 && React.createElement('button', {
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
                modifiers.length === 0 ?
                  React.createElement('div', {
                    style: {
                      textAlign: 'center',
                      padding: '30px',
                      color: 'var(--col-txt-secondary)',
                      fontSize: '13px'
                    }
                  }, 'No modifiers added yet')
                :
                  modifiers.map(mod =>
                    React.createElement('div', {
                      key: mod.id,
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
                        onClick: () => removeModifier(mod.id),
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
                      }, mod.attribute),
                      React.createElement('div', {
                        style: { fontSize: '12px', color: 'var(--col-txt-secondary)' }
                      }, `Slot: ${mod.slot} | ${getOperationLabel(mod.operation)} | Amount: ${mod.amount}`)
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
