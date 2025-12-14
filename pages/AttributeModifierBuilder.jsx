///**
// * Attribute Modifier Builder
// * A visual tool for building CraftEngine attribute modifier YAML
// */
//
module.exports = ({ useState, useEffect, useGlobalState, api }) => {
  // Visibility control
  const [isVisible, setIsVisible] = useGlobalState('attributeBuilderVisible', false);

  // State for attribute modifiers list
  const [modifiers, setModifiers] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // State for current modifier being edited
  const [currentModifier, setCurrentModifier] = useState({
    type: 'attack_damage',
    amount: 1.0,
    operation: 'add_value',
    slot: 'mainhand',
    id: '',
    displayType: 'default',
    displayValue: ''
  });

  // Available attribute types
  const attributeTypes = [
    'attack_damage', 'attack_knockback', 'attack_speed',
    'armor', 'armor_toughness', 'knockback_resistance',
    'max_health', 'movement_speed', 'flying_speed',
    'luck', 'step_height', 'scale', 'gravity',
    'jump_strength', 'burning_time', 'explosion_knockback_resistance',
    'movement_efficiency', 'oxygen_bonus', 'water_movement_efficiency'
  ];

  // Available operations
  const operations = [
    { value: 'add_value', label: 'Add Value' },
    { value: 'add_multiplied_base', label: 'Add Multiplied Base' },
    { value: 'add_multiplied_total', label: 'Add Multiplied Total' }
  ];

  // Available slots
  const slots = [
    'any', 'hand', 'armor', 'mainhand', 'offhand',
    'head', 'chest', 'legs', 'feet', 'body'
  ];

  // Add new modifier to list
  const addModifier = () => {
    const newModifier = { ...currentModifier };
    if (selectedIndex !== null) {
      const updated = [...modifiers];
      updated[selectedIndex] = newModifier;
      setModifiers(updated);
      setSelectedIndex(null);
    } else {
      setModifiers([...modifiers, newModifier]);
    }
    resetForm();
  };

  // Edit existing modifier
  const editModifier = (index) => {
    setCurrentModifier(modifiers[index]);
    setSelectedIndex(index);
  };

  // Remove modifier
  const removeModifier = (index) => {
    setModifiers(modifiers.filter((_, i) => i !== index));
    if (selectedIndex === index) {
      resetForm();
      setSelectedIndex(null);
    }
  };

  // Reset form
  const resetForm = () => {
    setCurrentModifier({
      type: 'attack_damage',
      amount: 1.0,
      operation: 'add_value',
      slot: 'mainhand',
      id: '',
      displayType: 'default',
      displayValue: ''
    });
  };

  // Generate YAML output
  const generateYAML = () => {
    if (modifiers.length === 0) return '';

    return modifiers.map(mod => {
      let yaml = `- type: ${mod.type}\n`;
      yaml += `  amount: ${mod.amount}\n`;
      yaml += `  operation: ${mod.operation}`;

      if (mod.id && mod.id.trim() !== '') {
        yaml += `\n  id: ${mod.id}`;
      }

      yaml += `\n  slot: ${mod.slot}`;

      if (mod.displayType !== 'default' && mod.displayValue && mod.displayValue.trim() !== '') {
        yaml += `\n  display:\n    type: ${mod.displayType}\n    value: ${mod.displayValue}`;
      }

      return yaml;
    }).join('\n');
  };

  // Copy YAML to clipboard
  const copyToClipboard = () => {
    const yaml = generateYAML();
    if (yaml) {
      navigator.clipboard.writeText(yaml).then(() => {
        api.notification.success('Copied to clipboard!');
      });
    }
  };

  const h = React.createElement;

  // Don't render if not visible
  if (!isVisible) return null;

  return h('div', {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: 2000,
      overflow: 'auto',
      padding: '40px 20px'
    }
  }, [
    h('div', {
      key: 'modal-content',
      style: {
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'var(--col-background-primary)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        position: 'relative'
      }
    }, [
      // Close button
      h('button', {
        key: 'close-btn',
        onClick: () => setIsVisible(false),
        style: {
          position: 'absolute',
          top: '16px',
          right: '16px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'var(--col-danger)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }
      }, '×'),

      // Main content
      h('div', {
        key: 'content-wrapper',
        style: {
          padding: '20px',
          color: 'var(--col-txt-primary)'
        }
      }, [
    // Header
    h('div', {
      key: 'header',
      style: {
        marginBottom: '24px',
        borderBottom: '2px solid var(--col-ouliner-default)',
        paddingBottom: '16px'
      }
    }, [
      h('h1', {
        key: 'title',
        style: { margin: '0 0 8px 0', fontSize: '24px', color: 'var(--col-txt-primary)' }
      }, 'Attribute Modifier Builder'),
      h('p', {
        key: 'desc',
        style: { margin: 0, color: 'var(--col-txt-secondary)', fontSize: '14px' }
      }, 'Build attribute modifiers visually for CraftEngine items')
    ]),

    // Main content grid
    h('div', {
      key: 'content',
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '20px'
      }
    }, [
      // Left panel - Form
      h('div', {
        key: 'form-panel',
        style: {
          padding: '20px',
          background: 'var(--col-input-default)',
          border: '1px solid var(--col-ouliner-default)',
          borderRadius: 'var(--radius-md)'
        }
      }, [
        h('h2', {
          key: 'form-title',
          style: { marginTop: 0, fontSize: '18px', marginBottom: '16px' }
        }, selectedIndex !== null ? 'Edit Modifier' : 'Add Modifier'),

        // Attribute Type
        h('div', { key: 'type-group', style: { marginBottom: '16px' } }, [
          h('label', {
            key: 'type-label',
            style: { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }
          }, 'Attribute Type'),
          h('select', {
            key: 'type-select',
            value: currentModifier.type,
            onChange: (e) => setCurrentModifier({ ...currentModifier, type: e.target.value }),
            style: {
              width: '100%',
              padding: '8px 12px',
              background: 'var(--col-input-default)',
              border: '1px solid var(--col-ouliner-default)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--col-txt-primary)',
              fontSize: '14px'
            }
          }, attributeTypes.map(type =>
            h('option', { key: type, value: type }, type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
          ))
        ]),

        // Amount
        h('div', { key: 'amount-group', style: { marginBottom: '16px' } }, [
          h('label', {
            key: 'amount-label',
            style: { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }
          }, 'Amount'),
          h('input', {
            key: 'amount-input',
            type: 'number',
            step: '0.1',
            value: currentModifier.amount,
            onChange: (e) => setCurrentModifier({ ...currentModifier, amount: parseFloat(e.target.value) || 0 }),
            style: {
              width: '100%',
              padding: '8px 12px',
              background: 'var(--col-input-default)',
              border: '1px solid var(--col-ouliner-default)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--col-txt-primary)',
              fontSize: '14px'
            }
          })
        ]),

        // Operation
        h('div', { key: 'operation-group', style: { marginBottom: '16px' } }, [
          h('label', {
            key: 'operation-label',
            style: { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }
          }, 'Operation'),
          h('select', {
            key: 'operation-select',
            value: currentModifier.operation,
            onChange: (e) => setCurrentModifier({ ...currentModifier, operation: e.target.value }),
            style: {
              width: '100%',
              padding: '8px 12px',
              background: 'var(--col-input-default)',
              border: '1px solid var(--col-ouliner-default)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--col-txt-primary)',
              fontSize: '14px'
            }
          }, operations.map(op =>
            h('option', { key: op.value, value: op.value }, op.label)
          ))
        ]),

        // Slot
        h('div', { key: 'slot-group', style: { marginBottom: '16px' } }, [
          h('label', {
            key: 'slot-label',
            style: { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }
          }, 'Slot'),
          h('select', {
            key: 'slot-select',
            value: currentModifier.slot,
            onChange: (e) => setCurrentModifier({ ...currentModifier, slot: e.target.value }),
            style: {
              width: '100%',
              padding: '8px 12px',
              background: 'var(--col-input-default)',
              border: '1px solid var(--col-ouliner-default)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--col-txt-primary)',
              fontSize: '14px'
            }
          }, slots.map(slot =>
            h('option', { key: slot, value: slot }, slot.charAt(0).toUpperCase() + slot.slice(1))
          ))
        ]),

        // Optional ID
        h('div', { key: 'id-group', style: { marginBottom: '16px' } }, [
          h('label', {
            key: 'id-label',
            style: { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }
          }, 'Custom ID (Optional)'),
          h('input', {
            key: 'id-input',
            type: 'text',
            placeholder: 'namespace:custom_attribute',
            value: currentModifier.id,
            onChange: (e) => setCurrentModifier({ ...currentModifier, id: e.target.value }),
            style: {
              width: '100%',
              padding: '8px 12px',
              background: 'var(--col-input-default)',
              border: '1px solid var(--col-ouliner-default)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--col-txt-primary)',
              fontSize: '14px'
            }
          })
        ]),

        // Display Override (1.21.5+)
        h('div', { key: 'display-group', style: { marginBottom: '16px' } }, [
          h('label', {
            key: 'display-label',
            style: { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }
          }, 'Display Override (1.21.5+)'),
          h('select', {
            key: 'display-type-select',
            value: currentModifier.displayType,
            onChange: (e) => setCurrentModifier({ ...currentModifier, displayType: e.target.value }),
            style: {
              width: '100%',
              padding: '8px 12px',
              marginBottom: '8px',
              background: 'var(--col-input-default)',
              border: '1px solid var(--col-ouliner-default)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--col-txt-primary)',
              fontSize: '14px'
            }
          }, [
            h('option', { key: 'default', value: 'default' }, 'None'),
            h('option', { key: 'override', value: 'override' }, 'Override')
          ]),
          currentModifier.displayType !== 'default' && h('input', {
            key: 'display-value-input',
            type: 'text',
            placeholder: '<yellow>Attack Speed +1',
            value: currentModifier.displayValue,
            onChange: (e) => setCurrentModifier({ ...currentModifier, displayValue: e.target.value }),
            style: {
              width: '100%',
              padding: '8px 12px',
              background: 'var(--col-input-default)',
              border: '1px solid var(--col-ouliner-default)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--col-txt-primary)',
              fontSize: '14px'
            }
          })
        ]),

        // Action buttons
        h('div', { key: 'actions', style: { display: 'flex', gap: '8px' } }, [
          h('button', {
            key: 'add-btn',
            onClick: addModifier,
            style: {
              flex: 1,
              padding: '10px',
              background: 'var(--col-primary-form)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }
          }, selectedIndex !== null ? 'Update Modifier' : 'Add Modifier'),
          selectedIndex !== null && h('button', {
            key: 'cancel-btn',
            onClick: () => {
              resetForm();
              setSelectedIndex(null);
            },
            style: {
              padding: '10px 16px',
              background: 'var(--col-input-default)',
              color: 'var(--col-txt-primary)',
              border: '1px solid var(--col-ouliner-default)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: '14px'
            }
          }, 'Cancel')
        ])
      ]),

      // Right panel - Preview & List
      h('div', { key: 'preview-panel' }, [
        // Modifiers list
        h('div', {
          key: 'list',
          style: {
            padding: '20px',
            background: 'var(--col-input-default)',
            border: '1px solid var(--col-ouliner-default)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px'
          }
        }, [
          h('h2', {
            key: 'list-title',
            style: { marginTop: 0, fontSize: '18px', marginBottom: '16px' }
          }, `Modifiers (${modifiers.length})`),
          h('div', { key: 'list-items' },
            modifiers.length === 0
              ? h('p', {
                  style: { color: 'var(--col-txt-secondary)', fontSize: '14px', textAlign: 'center', padding: '20px 0' }
                }, 'No modifiers added yet')
              : modifiers.map((mod, index) =>
                  h('div', {
                    key: index,
                    style: {
                      padding: '12px',
                      background: selectedIndex === index ? 'var(--col-accent-col)' : 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--col-ouliner-default)',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }
                  }, [
                    h('div', { key: 'info', style: { flex: 1 } }, [
                      h('div', {
                        key: 'type',
                        style: { fontWeight: '500', fontSize: '14px', marginBottom: '4px' }
                      }, mod.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())),
                      h('div', {
                        key: 'details',
                        style: { fontSize: '12px', color: 'var(--col-txt-secondary)' }
                      }, `${mod.operation} ${mod.amount} @ ${mod.slot}`)
                    ]),
                    h('div', { key: 'buttons', style: { display: 'flex', gap: '8px' } }, [
                      h('button', {
                        key: 'edit',
                        onClick: () => editModifier(index),
                        style: {
                          padding: '6px 12px',
                          background: 'var(--col-input-default)',
                          color: 'var(--col-txt-primary)',
                          border: '1px solid var(--col-ouliner-default)',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }
                      }, 'Edit'),
                      h('button', {
                        key: 'remove',
                        onClick: () => removeModifier(index),
                        style: {
                          padding: '6px 12px',
                          background: 'var(--col-danger)',
                          color: 'white',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }
                      }, 'Remove')
                    ])
                  ])
                )
          )
        ]),

        // YAML Preview
        h('div', {
          key: 'yaml-preview',
          style: {
            padding: '20px',
            background: 'var(--col-input-default)',
            border: '1px solid var(--col-ouliner-default)',
            borderRadius: 'var(--radius-md)'
          }
        }, [
          h('div', {
            key: 'yaml-header',
            style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }
          }, [
            h('h2', {
              key: 'yaml-title',
              style: { margin: 0, fontSize: '18px' }
            }, 'YAML Output'),
            h('button', {
              key: 'copy-btn',
              onClick: copyToClipboard,
              disabled: modifiers.length === 0,
              style: {
                padding: '6px 12px',
                background: modifiers.length === 0 ? 'var(--col-input-default)' : 'var(--col-primary-form)',
                color: modifiers.length === 0 ? 'var(--col-txt-secondary)' : 'white',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: modifiers.length === 0 ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }
            }, 'Copy to Clipboard')
          ]),
          h('pre', {
            key: 'yaml-content',
            style: {
              padding: '12px',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--col-ouliner-default)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontFamily: 'monospace',
              overflowX: 'auto',
              whiteSpace: 'pre',
              minHeight: '100px',
              color: 'var(--col-txt-primary)'
            }
          }, generateYAML() || '# Add modifiers to see YAML output')
        ])
      ])
    ])
      ])
    ])
  ]);
};




//module.exports = ({ useState }) => {
//  const [count, setCount] = useState(0);
//
//  return (
//    <div>
//      <h1>Hello</h1>
//      <p>Count: {count}</p>
//      <button onClick={() => setCount(count + 1)}>Increment</button>
//    </div>
//  );
//};




