module.exports = ({ useState, useEffect, useGlobalState, api }) => {
  // Global state for overlay visibility and data
  const [isVisible, setIsVisible] = useGlobalState('attrBuilderOverlayVisible', false);
  const [overlayData, setOverlayData] = useGlobalState('attrBuilderOverlayData', null);

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

  // Load data when overlay opens
  useEffect(() => {
    if (isVisible && overlayData) {
      // Parse existing YAML data if provided
      if (overlayData.existingYaml) {
        try {
          const parsed = parseYamlToModifiers(overlayData.existingYaml);
          setModifiers(parsed);
        } catch (e) {
          console.error('Failed to parse existing YAML:', e);
        }
      }
    }
  }, [isVisible, overlayData]);

  // Parse YAML string to modifiers array
  const parseYamlToModifiers = (yamlString) => {
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

  // Save and close
  const handleSave = () => {
    const output = generateOutput();

    // Send the data back through global state
    if (overlayData && overlayData.callback) {
      overlayData.callback(output);
    }

    // Close overlay
    setIsVisible(false);
    setModifiers([]);
  };

  // Cancel and close
  const handleCancel = () => {
    setIsVisible(false);
    setModifiers([]);
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
        maxWidth: '1200px',
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
        React.createElement('h2', { style: { margin: 0, fontSize: '24px', color: '#fff' } },
          'Attribute Modifier Builder'
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
          React.createElement('h3', { style: { marginTop: 0, color: '#fff' } }, 'Add Modifier'),

          // Attribute selector
          React.createElement('div', { style: { marginBottom: '15px' } },
            React.createElement('label', { style: { display: 'block', marginBottom: '5px', fontSize: '14px', color: '#b0b0b0' } }, 'Attribute:'),
            React.createElement('select', {
              value: currentAttribute,
              onChange: (e) => setCurrentAttribute(e.target.value),
              style: {
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                backgroundColor: '#1e1e1e',
                color: '#e0e0e0',
                border: '1px solid #4a4a4a',
                borderRadius: '4px'
              }
            }, ATTRIBUTES.map(attr =>
              React.createElement('option', { key: attr, value: attr }, attr)
            ))
          ),

          // Slots
          React.createElement('div', { style: { marginBottom: '15px' } },
            React.createElement('label', { style: { display: 'block', marginBottom: '8px', fontSize: '14px', color: '#b0b0b0' } }, 'Slots:'),
            React.createElement('div', {
              style: {
                backgroundColor: '#1e1e1e',
                border: '1px solid #4a4a4a',
                borderRadius: '4px',
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
                  backgroundColor: currentSlots.includes(slot) ? '#4CAF50' : '#2a2a2a',
                  borderRadius: '4px',
                  fontSize: '13px'
                }
              },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: currentSlots.includes(slot),
                  onChange: () => toggleSlot(slot),
                  style: { marginRight: '8px', cursor: 'pointer' }
                }),
                React.createElement('span', null, slot)
              )
            ))
          ),

          // Operation
          React.createElement('div', { style: { marginBottom: '15px' } },
            React.createElement('label', { style: { display: 'block', marginBottom: '5px', fontSize: '14px', color: '#b0b0b0' } }, 'Operation:'),
            React.createElement('select', {
              value: currentOperation,
              onChange: (e) => setCurrentOperation(e.target.value),
              style: {
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                backgroundColor: '#1e1e1e',
                color: '#e0e0e0',
                border: '1px solid #4a4a4a',
                borderRadius: '4px'
              }
            }, OPERATIONS.map(op =>
              React.createElement('option', { key: op.value, value: op.value }, `${op.label} (${op.symbol})`)
            ))
          ),

          // Amount
          React.createElement('div', { style: { marginBottom: '15px' } },
            React.createElement('label', { style: { display: 'block', marginBottom: '5px', fontSize: '14px', color: '#b0b0b0' } }, 'Amount:'),
            React.createElement('input', {
              type: 'number',
              step: '0.1',
              value: currentAmount,
              onChange: (e) => setCurrentAmount(e.target.value),
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

          React.createElement('button', {
            onClick: addModifier,
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
          }, 'Add Modifier')
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
          React.createElement('h3', { style: { marginTop: 0, color: '#fff' } }, `Modifiers (${modifiers.length})`),
          React.createElement('div', { style: { maxHeight: '400px', overflowY: 'auto' } },
            modifiers.length === 0 ?
              React.createElement('div', {
                style: {
                  textAlign: 'center',
                  padding: '40px',
                  color: '#666',
                  fontSize: '14px'
                }
              }, 'No modifiers added yet')
            :
              modifiers.map(mod =>
                React.createElement('div', {
                  key: mod.id,
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
                    onClick: () => removeModifier(mod.id),
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
                  React.createElement('div', { style: { fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#4CAF50' } }, mod.attribute),
                  React.createElement('div', { style: { fontSize: '13px', color: '#b0b0b0' } }, `Slot: ${mod.slot}`),
                  React.createElement('div', { style: { fontSize: '13px', color: '#b0b0b0' } }, `Operation: ${mod.operation}`),
                  React.createElement('div', { style: { fontSize: '13px', color: '#b0b0b0' } }, `Amount: ${mod.amount}`)
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
      )
    )
  );
};
