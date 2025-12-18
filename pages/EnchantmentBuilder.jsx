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
  // Common Minecraft enchantments
  const ENCHANTMENTS = [
    'protection', 'fire_protection', 'feather_falling', 'blast_protection', 'projectile_protection',
    'respiration', 'aqua_affinity', 'thorns', 'depth_strider', 'frost_walker', 'soul_speed', 'swift_sneak',
    'sharpness', 'smite', 'bane_of_arthropods', 'knockback', 'fire_aspect', 'looting', 'sweeping_edge', 'density', 'breach',
    'efficiency', 'silk_touch', 'unbreaking', 'fortune', 'power', 'punch', 'flame', 'infinity',
    'luck_of_the_sea', 'lure', 'loyalty', 'impaling', 'riptide', 'channeling', 'multishot',
    'quick_charge', 'piercing', 'wind_burst', 'mending', 'vanishing_curse', 'binding_curse'
  ];

  // Load saved data from localStorage
  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem('enchantmentBuilder');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Failed to load saved data:', err);
    }
    return null;
  };

  const savedData = loadSavedData();

  // State for enchantments list
  const [enchantments, setEnchantments] = useState(savedData?.enchantments || []);
  const [currentEnchantment, setCurrentEnchantment] = useState(savedData?.currentEnchantment || 'sharpness');
  const [currentLevel, setCurrentLevel] = useState(savedData?.currentLevel || '1');
  const [copySuccess, setCopySuccess] = useState('');

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      const dataToSave = {
        enchantments,
        currentEnchantment,
        currentLevel
      };
      localStorage.setItem('enchantmentBuilder', JSON.stringify(dataToSave));
    } catch (err) {
      console.error('Failed to save data:', err);
    }
  }, [enchantments, currentEnchantment, currentLevel]);

  // Add enchantment to list
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
    setCopySuccess('');
  };

  // Remove enchantment from list
  const removeEnchantment = (id) => {
    setEnchantments(enchantments.filter(e => e.id !== id));
    setCopySuccess('');
  };

  // Clear all enchantments
  const clearAll = () => {
    setEnchantments([]);
    setCopySuccess('');
  };

  // Clear everything
  const clearEverything = () => {
    if (confirm('Are you sure you want to clear everything? This will reset all enchantments and settings.')) {
      setEnchantments([]);
      setCurrentEnchantment('sharpness');
      setCurrentLevel('1');
      setCopySuccess('');
      localStorage.removeItem('enchantmentBuilder');
    }
  };

  // Generate output YAML
  const generateOutput = () => {
    if (enchantments.length === 0) {
      return '# No enchantments added yet';
    }

    let output = '';
    enchantments.forEach(ench => {
      output += `- enchantment: ${ench.enchantment}\n`;
      output += `  level: ${ench.level}\n`;
    });
    return output;
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
          }, 'Minecraft Enchantment Builder'),
          React.createElement('p', {
            style: {
              margin: '5px 0 0',
              color: 'var(--col-txt-secondary)',
              fontSize: '14px'
            }
          }, 'Build custom enchantments for items')
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
          }, 'Add Enchantment'),

          // Enchantment selector
          React.createElement('div', { style: { marginBottom: '15px' } },
            React.createElement('label', {
              style: {
                display: 'block',
                marginBottom: '5px',
                fontSize: '14px',
                color: 'var(--col-txt-secondary)',
                fontWeight: '500'
              }
            }, 'Enchantment:'),
            React.createElement('select', {
              value: currentEnchantment,
              onChange: (e) => setCurrentEnchantment(e.target.value),
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
            }, ENCHANTMENTS.map(ench =>
              React.createElement('option', { key: ench, value: ench }, ench.replace(/_/g, ' '))
            ))
          ),

          // Level input
          React.createElement('div', { style: { marginBottom: '15px' } },
            React.createElement('label', {
              style: {
                display: 'block',
                marginBottom: '5px',
                fontSize: '14px',
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
            onClick: addEnchantment,
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
          }, 'Add Enchantment')
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
            }, `Enchantments (${enchantments.length})`),
            enchantments.length > 0 && React.createElement('button', {
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
            enchantments.length === 0 ?
              React.createElement('div', {
                style: {
                  textAlign: 'center',
                  padding: '40px',
                  color: 'var(--col-txt-secondary)',
                  fontSize: '14px'
                }
              }, 'No enchantments added yet. Add one using the form on the left.')
            :
              enchantments.map(ench =>
                React.createElement('div', {
                  key: ench.id,
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
                    onClick: () => removeEnchantment(ench.id),
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
                  }, ench.enchantment.replace(/_/g, ' ')),
                  React.createElement('div', {
                    style: {
                      fontSize: '13px',
                      color: 'var(--col-txt-secondary)',
                      marginBottom: '4px'
                    }
                  },
                    'Level: ',
                    React.createElement('span', {
                      style: { color: 'var(--col-txt-primary)' }
                    }, ench.level)
                  )
                )
              )
          )
        )
      ),

      // Output Panel
      enchantments.length > 0 && React.createElement('div', {
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
          React.createElement('li', null, 'Select an enchantment from the dropdown'),
          React.createElement('li', null, 'Enter the desired level (1 or higher)'),
          React.createElement('li', null, 'Click "Add Enchantment" to add it to your list'),
          React.createElement('li', null, 'Copy the generated YAML output'),
          React.createElement('li', null, 'Paste into your item\'s "Enchantment" field in CraftEngine')
        )
      )
    )
  );
};
