/**
 * Enchantment Builder Button Component
 * Custom element for opening the Enchantment Builder overlay
 */
module.exports = ({ useState, useEffect, value, onChange, placeholder, rows }) => {
  const [showModal, setShowModal] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');

  // Sync local value with prop value when it changes externally (e.g., on load)
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  // Common Minecraft enchantments
  const ENCHANTMENTS = [
    'protection', 'fire_protection', 'feather_falling', 'blast_protection', 'projectile_protection',
    'respiration', 'aqua_affinity', 'thorns', 'depth_strider', 'frost_walker', 'soul_speed', 'swift_sneak',
    'sharpness', 'smite', 'bane_of_arthropods', 'knockback', 'fire_aspect', 'looting', 'sweeping_edge', 'density', 'breach',
    'efficiency', 'silk_touch', 'unbreaking', 'fortune', 'power', 'punch', 'flame', 'infinity',
    'luck_of_the_sea', 'lure', 'loyalty', 'impaling', 'riptide', 'channeling', 'multishot',
    'quick_charge', 'piercing', 'wind_burst', 'mending', 'vanishing_curse', 'binding_curse'
  ];

  // State for enchantments list
  const [enchantments, setEnchantments] = useState([]);
  const [currentEnchantment, setCurrentEnchantment] = useState('sharpness');
  const [currentLevel, setCurrentLevel] = useState('1');

  // Parse YAML string to enchantments array
  const parseYamlToEnchantments = (yamlString) => {
    if (!yamlString || yamlString.trim() === '') return [];

    const lines = yamlString.split('\n');
    const enchantments = [];
    let currentEnchantment = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      if (trimmed.startsWith('- enchantment:')) {
        if (currentEnchantment) enchantments.push(currentEnchantment);
        currentEnchantment = {
          id: Date.now() + Math.random(),
          enchantment: trimmed.split('enchantment:')[1].trim()
        };
      } else if (currentEnchantment && trimmed.startsWith('level:')) {
        currentEnchantment.level = parseInt(trimmed.split('level:')[1].trim());
      }
    }
    if (currentEnchantment) enchantments.push(currentEnchantment);
    return enchantments;
  };

  // Generate YAML output
  const generateOutput = () => {
    if (enchantments.length === 0) return '';

    let output = '';
    enchantments.forEach(ench => {
      output += `- enchantment: ${ench.enchantment}\n`;
      output += `  level: ${ench.level}\n`;
    });
    return output;
  };

  // Load existing data when modal opens
  useEffect(() => {
    if (showModal) {
      try {
        const parsed = parseYamlToEnchantments(localValue);
        setEnchantments(parsed);
      } catch (e) {
        console.error('Failed to parse existing YAML:', e);
        setEnchantments([]);
      }
    }
  }, [showModal, localValue]);

  // Add enchantment
  const addEnchantment = () => {
    const level = parseInt(currentLevel) || 1;

    if (level < 1) {
      alert('Level must be at least 1');
      return;
    }

    const newEnchantment = {
      id: Date.now() + Math.random(),
      enchantment: currentEnchantment,
      level: level
    };

    setEnchantments([...enchantments, newEnchantment]);
    setCurrentLevel('1');
  };

  // Remove enchantment
  const removeEnchantment = (id) => {
    setEnchantments(enchantments.filter(e => e.id !== id));
  };

  // Clear all
  const clearAll = () => {
    setEnchantments([]);
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
      React.createElement('span', null, '✨'),
      React.createElement('span', null, 'Open Enchantment Builder')
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
            }, 'Enchantment Builder'),
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
              }, 'Add Enchantment'),

              // Enchantment selector
              React.createElement('div', { style: { marginBottom: '12px' } },
                React.createElement('label', {
                  style: {
                    display: 'block',
                    marginBottom: '5px',
                    fontSize: '13px',
                    color: 'var(--col-txt-secondary)',
                    fontWeight: '500'
                  }
                }, 'Enchantment:'),
                React.createElement('select', {
                  value: currentEnchantment,
                  onChange: (e) => setCurrentEnchantment(e.target.value),
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
                }, ENCHANTMENTS.map(ench =>
                  React.createElement('option', { key: ench, value: ench }, ench)
                ))
              ),

              // Level input
              React.createElement('div', { style: { marginBottom: '15px' } },
                React.createElement('label', {
                  style: {
                    display: 'block',
                    marginBottom: '5px',
                    fontSize: '13px',
                    color: 'var(--col-txt-secondary)',
                    fontWeight: '500'
                  }
                }, 'Level:'),
                React.createElement('input', {
                  type: 'number',
                  min: '1',
                  value: currentLevel,
                  onChange: (e) => setCurrentLevel(e.target.value),
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
                onClick: addEnchantment,
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
              }, '+ Add Enchantment')
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
                }, `Enchantments (${enchantments.length})`),
                enchantments.length > 0 && React.createElement('button', {
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
                enchantments.length === 0 ?
                  React.createElement('div', {
                    style: {
                      textAlign: 'center',
                      padding: '30px',
                      color: 'var(--col-txt-secondary)',
                      fontSize: '13px'
                    }
                  }, 'No enchantments added yet')
                :
                  enchantments.map(ench =>
                    React.createElement('div', {
                      key: ench.id,
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
                        onClick: () => removeEnchantment(ench.id),
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
                          marginBottom: '4px',
                          color: 'var(--col-primary-form)'
                        }
                      }, ench.enchantment),
                      React.createElement('div', {
                        style: {
                          fontSize: '12px',
                          color: 'var(--col-txt-secondary)'
                        }
                      }, `Level: ${ench.level}`)
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
