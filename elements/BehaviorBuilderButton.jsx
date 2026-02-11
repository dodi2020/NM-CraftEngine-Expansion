/**
 * Behavior Builder Button Component
 * Custom element for building CraftEngine item/block/furniture behaviors
 */
module.exports = ({ useState, useEffect, value, onChange, placeholder, rows }) => {
  const [showModal, setShowModal] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');
  const [behaviorType, setBehaviorType] = useState('');
  const [behaviorMode, setBehaviorMode] = useState('single'); // 'single' or 'multiple'
  
  // Single behavior config
  const [singleBehaviorConfig, setSingleBehaviorConfig] = useState({
    type: '',
    properties: {}
  });
  
  // Multiple behaviors config (for blocks)
  const [multipleBehaviors, setMultipleBehaviors] = useState([]);
  
  // Available behavior types
  const ITEM_BEHAVIORS = [
    { value: 'block_item', label: 'Block Item', category: 'item' },
    { value: 'liquid_collision_block_item', label: 'Liquid Collision Block Item', category: 'item' },
    { value: 'double_high_block_item', label: 'Double High Block Item', category: 'item' },
    { value: 'furniture_item', label: 'Furniture Item', category: 'item' },
    { value: 'liquid_collision_furniture_item', label: 'Liquid Collision Furniture Item', category: 'item' }
  ];
  
  const BLOCK_BEHAVIORS = [
    { value: 'concrete_powder_block', label: 'Concrete Powder Block', category: 'block' },
    { value: 'falling_block', label: 'Falling Block', category: 'block' },
    { value: 'note_block', label: 'Note Block', category: 'block' },
    { value: 'sapling_block', label: 'Sapling Block', category: 'block' },
    { value: 'bush_block', label: 'Bush Block', category: 'block' },
    { value: 'strippable_block', label: 'Strippable Block', category: 'block' },
    { value: 'oxidizable_block', label: 'Oxidizable Block', category: 'block' },
    { value: 'waxable_block', label: 'Waxable Block', category: 'block' },
    { value: 'crop_block', label: 'Crop Block', category: 'block' },
    { value: 'directional_block', label: 'Directional Block', category: 'block' },
    { value: 'interactive_block', label: 'Interactive Block', category: 'block' }
  ];
  
  const FURNITURE_BEHAVIORS = [
    { value: 'interactive', label: 'Interactive Furniture', category: 'furniture' },
    { value: 'directional', label: 'Directional Furniture', category: 'furniture' }
  ];
  
  const ALL_BEHAVIORS = [...ITEM_BEHAVIORS, ...BLOCK_BEHAVIORS, ...FURNITURE_BEHAVIORS];
  
  // Sync local value with prop value
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);
  
  // Parse YAML when modal opens
  useEffect(() => {
    if (showModal && localValue) {
      try {
        parseYamlToBehavior(localValue);
      } catch (e) {
        console.error('Failed to parse behavior YAML:', e);
      }
    }
  }, [showModal, localValue]);
  
  const parseYamlToBehavior = (yamlString) => {
    if (!yamlString || yamlString.trim() === '') return;
    
    const lines = yamlString.split('\n');
    
    // Check if multiple behaviors (starts with "- type:")
    if (lines[0].trim().startsWith('- type:')) {
      setBehaviorMode('multiple');
      const behaviors = [];
      let currentBehavior = null;
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('- type:')) {
          if (currentBehavior) behaviors.push(currentBehavior);
          currentBehavior = { id: Date.now() + Math.random(), type: trimmed.split(':')[1].trim(), properties: {} };
        } else if (currentBehavior && trimmed.includes(':')) {
          const [key, ...valueParts] = trimmed.split(':');
          currentBehavior.properties[key.trim()] = valueParts.join(':').trim();
        }
      }
      if (currentBehavior) behaviors.push(currentBehavior);
      setMultipleBehaviors(behaviors);
    } else {
      // Single behavior
      setBehaviorMode('single');
      let type = '';
      const properties = {};
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        
        if (trimmed.startsWith('type:')) {
          type = trimmed.split(':')[1].trim();
        } else if (trimmed.includes(':')) {
          const [key, ...valueParts] = trimmed.split(':');
          properties[key.trim()] = valueParts.join(':').trim();
        }
      }
      
      setSingleBehaviorConfig({ type, properties });
      setBehaviorType(type);
    }
  };
  
  const generateYamlOutput = () => {
    if (behaviorMode === 'multiple') {
      if (multipleBehaviors.length === 0) return '';
      
      let output = '';
      multipleBehaviors.forEach(behavior => {
        output += `- type: ${behavior.type}\n`;
        Object.entries(behavior.properties).forEach(([key, value]) => {
          output += `  ${key}: ${value}\n`;
        });
      });
      return output.trim();
    } else {
      // Single behavior
      if (!singleBehaviorConfig.type) return '';
      
      let output = `type: ${singleBehaviorConfig.type}\n`;
      Object.entries(singleBehaviorConfig.properties).forEach(([key, value]) => {
        output += `${key}: ${value}\n`;
      });
      return output.trim();
    }
  };
  
  const handleSave = () => {
    const output = generateYamlOutput();
    setLocalValue(output);
    if (onChange) onChange(output);
    setShowModal(false);
  };
  
  const addBehavior = () => {
    setMultipleBehaviors([...multipleBehaviors, {
      id: Date.now(),
      type: '',
      properties: {}
    }]);
  };
  
  const removeBehavior = (id) => {
    setMultipleBehaviors(multipleBehaviors.filter(b => b.id !== id));
  };
  
  const updateBehavior = (id, field, value) => {
    setMultipleBehaviors(multipleBehaviors.map(b => 
      b.id === id ? { ...b, [field]: value } : b
    ));
  };
  
  const updateBehaviorProperty = (id, key, value) => {
    setMultipleBehaviors(multipleBehaviors.map(b => 
      b.id === id ? { ...b, properties: { ...b.properties, [key]: value } } : b
    ));
  };
  
  const addPropertyToSingle = () => {
    const key = prompt('Property name:');
    if (key) {
      setSingleBehaviorConfig({
        ...singleBehaviorConfig,
        properties: { ...singleBehaviorConfig.properties, [key]: '' }
      });
    }
  };
  
  const updateSingleProperty = (key, value) => {
    setSingleBehaviorConfig({
      ...singleBehaviorConfig,
      properties: { ...singleBehaviorConfig.properties, [key]: value }
    });
  };
  
  const removeSingleProperty = (key) => {
    const newProps = { ...singleBehaviorConfig.properties };
    delete newProps[key];
    setSingleBehaviorConfig({ ...singleBehaviorConfig, properties: newProps });
  };
  
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
    // Button to open modal
    React.createElement('button', {
      onClick: () => setShowModal(true),
      style: {
        padding: '8px 16px',
        background: 'var(--col-primary-form)',
        color: 'white',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        fontWeight: 500,
        fontSize: 13
      }
    }, '⚙️ Build Behavior'),
    
    // Preview of current value
    localValue && React.createElement('div', {
      style: {
        padding: 10,
        background: 'rgba(0,0,0,0.2)',
        borderRadius: 4,
        fontSize: 12,
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        maxHeight: 150,
        overflow: 'auto'
      }
    }, localValue),
    
    // Modal
    showModal && React.createElement('div', {
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
      },
      onClick: () => setShowModal(false)
    },
      React.createElement('div', {
        style: {
          background: 'var(--col-input-default)',
          borderRadius: 8,
          padding: 24,
          maxWidth: 800,
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          border: '2px solid var(--col-ouliner-default)'
        },
        onClick: (e) => e.stopPropagation()
      },
        React.createElement('h3', { style: { marginTop: 0 } }, '⚙️ Behavior Builder'),
        
        // Mode selector
        React.createElement('div', { style: { marginBottom: 20 } },
          React.createElement('label', { style: { display: 'block', marginBottom: 8, fontWeight: 500 } }, 'Behavior Mode:'),
          React.createElement('select', {
            value: behaviorMode,
            onChange: (e) => setBehaviorMode(e.target.value),
            style: {
              padding: 8,
              borderRadius: 4,
              border: '1px solid var(--col-ouliner-default)',
              background: 'var(--col-input-default)',
              color: 'var(--col-txt-primary)',
              width: '100%'
            }
          },
            React.createElement('option', { value: 'single' }, 'Single Behavior (Items/Blocks)'),
            React.createElement('option', { value: 'multiple' }, 'Multiple Behaviors (Composite Blocks)')
          )
        ),
        
        // Single behavior mode
        behaviorMode === 'single' && React.createElement('div', null,
          React.createElement('div', { style: { marginBottom: 16 } },
            React.createElement('label', { style: { display: 'block', marginBottom: 8, fontWeight: 500 } }, 'Behavior Type:'),
            React.createElement('select', {
              value: singleBehaviorConfig.type,
              onChange: (e) => {
                setSingleBehaviorConfig({ ...singleBehaviorConfig, type: e.target.value });
                setBehaviorType(e.target.value);
              },
              style: {
                padding: 8,
                borderRadius: 4,
                border: '1px solid var(--col-ouliner-default)',
                background: 'var(--col-input-default)',
                color: 'var(--col-txt-primary)',
                width: '100%'
              }
            },
              React.createElement('option', { value: '' }, 'Select behavior type...'),
              React.createElement('optgroup', { label: 'Item Behaviors' },
                ...ITEM_BEHAVIORS.map(b => React.createElement('option', { key: b.value, value: b.value }, b.label))
              ),
              React.createElement('optgroup', { label: 'Block Behaviors' },
                ...BLOCK_BEHAVIORS.map(b => React.createElement('option', { key: b.value, value: b.value }, b.label))
              ),
              React.createElement('optgroup', { label: 'Furniture Behaviors' },
                ...FURNITURE_BEHAVIORS.map(b => React.createElement('option', { key: b.value, value: b.value }, b.label))
              )
            )
          ),
          
          // Properties
          React.createElement('div', { style: { marginBottom: 16 } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 } },
              React.createElement('label', { style: { fontWeight: 500 } }, 'Properties:'),
              React.createElement('button', {
                onClick: addPropertyToSingle,
                style: {
                  padding: '4px 12px',
                  background: 'var(--col-primary-form)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 12
                }
              }, '+ Add Property')
            ),
            Object.entries(singleBehaviorConfig.properties).length === 0 
              ? React.createElement('div', { style: { padding: 16, textAlign: 'center', color: 'var(--col-txt-secondary)', fontSize: 13 } }, 'No properties added')
              : React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
                  ...Object.entries(singleBehaviorConfig.properties).map(([key, value]) =>
                    React.createElement('div', { key: key, style: { display: 'flex', gap: 8, alignItems: 'center' } },
                      React.createElement('input', {
                        value: key,
                        readOnly: true,
                        style: {
                          padding: 8,
                          borderRadius: 4,
                          border: '1px solid var(--col-ouliner-default)',
                          background: 'rgba(0,0,0,0.2)',
                          color: 'var(--col-txt-secondary)',
                          flex: 1
                        }
                      }),
                      React.createElement('input', {
                        value: value,
                        onChange: (e) => updateSingleProperty(key, e.target.value),
                        placeholder: 'value',
                        style: {
                          padding: 8,
                          borderRadius: 4,
                          border: '1px solid var(--col-ouliner-default)',
                          background: 'var(--col-input-default)',
                          color: 'var(--col-txt-primary)',
                          flex: 2
                        }
                      }),
                      React.createElement('button', {
                        onClick: () => removeSingleProperty(key),
                        style: {
                          padding: '6px 10px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer'
                        }
                      }, '×')
                    )
                  )
                )
          )
        ),
        
        // Multiple behaviors mode
        behaviorMode === 'multiple' && React.createElement('div', null,
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 } },
            React.createElement('h4', { style: { margin: 0 } }, 'Behaviors:'),
            React.createElement('button', {
              onClick: addBehavior,
              style: {
                padding: '6px 12px',
                background: 'var(--col-primary-form)',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }
            }, '+ Add Behavior')
          ),
          
          multipleBehaviors.length === 0 
            ? React.createElement('div', { style: { padding: 16, textAlign: 'center', color: 'var(--col-txt-secondary)' } }, 'No behaviors added')
            : React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
                ...multipleBehaviors.map(behavior =>
                  React.createElement('div', {
                    key: behavior.id,
                    style: {
                      padding: 16,
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: 6,
                      border: '1px solid var(--col-ouliner-default)'
                    }
                  },
                    React.createElement('div', { style: { display: 'flex', gap: 8, marginBottom: 12 } },
                      React.createElement('select', {
                        value: behavior.type,
                        onChange: (e) => updateBehavior(behavior.id, 'type', e.target.value),
                        style: {
                          padding: 8,
                          borderRadius: 4,
                          border: '1px solid var(--col-ouliner-default)',
                          background: 'var(--col-input-default)',
                          color: 'var(--col-txt-primary)',
                          flex: 1
                        }
                      },
                        React.createElement('option', { value: '' }, 'Select type...'),
                        ...BLOCK_BEHAVIORS.map(b => React.createElement('option', { key: b.value, value: b.value }, b.label))
                      ),
                      React.createElement('button', {
                        onClick: () => removeBehavior(behavior.id),
                        style: {
                          padding: '6px 12px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer'
                        }
                      }, 'Remove')
                    ),
                    
                    React.createElement('div', { style: { fontSize: 12, color: 'var(--col-txt-secondary)', marginBottom: 8 } }, 'Properties (key: value format):'),
                    React.createElement('textarea', {
                      value: Object.entries(behavior.properties).map(([k, v]) => `${k}: ${v}`).join('\n'),
                      onChange: (e) => {
                        const props = {};
                        e.target.value.split('\n').forEach(line => {
                          const [k, ...v] = line.split(':');
                          if (k && v.length) props[k.trim()] = v.join(':').trim();
                        });
                        updateBehavior(behavior.id, 'properties', props);
                      },
                      placeholder: 'solid-block: namespace:block_id\nother-property: value',
                      rows: 3,
                      style: {
                        width: '100%',
                        padding: 8,
                        borderRadius: 4,
                        border: '1px solid var(--col-ouliner-default)',
                        background: 'var(--col-input-default)',
                        color: 'var(--col-txt-primary)',
                        fontFamily: 'monospace',
                        fontSize: 12,
                        resize: 'vertical'
                      }
                    })
                  )
                )
              )
        ),
        
        // Action buttons
        React.createElement('div', {
          style: {
            display: 'flex',
            gap: 12,
            marginTop: 24,
            justifyContent: 'flex-end'
          }
        },
          React.createElement('button', {
            onClick: () => setShowModal(false),
            style: {
              padding: '8px 16px',
              background: 'var(--col-input-default)',
              color: 'var(--col-txt-primary)',
              border: '1px solid var(--col-ouliner-default)',
              borderRadius: 6,
              cursor: 'pointer'
            }
          }, 'Cancel'),
          React.createElement('button', {
            onClick: handleSave,
            style: {
              padding: '8px 16px',
              background: 'var(--col-primary-form)',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 500
            }
          }, 'Save Behavior')
        )
      )
    )
  );
};
