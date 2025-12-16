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

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      overflow: 'auto',
      backgroundColor: '#1e1e1e',
      color: '#e0e0e0'
    }}>
      <div style={{
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        paddingBottom: '40px'
      }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '30px',
        borderBottom: '2px solid #3a3a3a',
        paddingBottom: '20px'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#fff'
        }}>
          Minecraft Attribute Modifier Builder
        </h1>
        <button
          onClick={clearEverything}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: '#d32f2f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#b71c1c'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#d32f2f'}
        >
          Clear Everything
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        marginBottom: '20px'
      }}>
        {/* Left Panel - Builder */}
        <div style={{
          backgroundColor: '#2a2a2a',
          padding: '25px',
          borderRadius: '8px',
          border: '1px solid #3a3a3a'
        }}>
          <h2 style={{
            marginTop: 0,
            marginBottom: '20px',
            fontSize: '20px',
            color: '#fff',
            borderBottom: '1px solid #3a3a3a',
            paddingBottom: '10px'
          }}>
            Add Modifier
          </h2>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontSize: '14px',
              color: '#b0b0b0',
              fontWeight: '500'
            }}>
              Attribute:
            </label>
            <select
              value={currentAttribute}
              onChange={(e) => setCurrentAttribute(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                backgroundColor: '#1e1e1e',
                color: '#e0e0e0',
                border: '1px solid #4a4a4a',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {ATTRIBUTES.map(attr => (
                <option key={attr} value={attr}>{attr}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#b0b0b0',
              fontWeight: '500'
            }}>
              Slots (select one or more):
            </label>
            <div style={{
              backgroundColor: '#1e1e1e',
              border: '1px solid #4a4a4a',
              borderRadius: '4px',
              padding: '10px',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px'
            }}>
              {SLOTS.map(slot => (
                <label
                  key={slot}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '6px 8px',
                    backgroundColor: currentSlots.includes(slot) ? '#4CAF50' : '#2a2a2a',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s',
                    fontSize: '13px'
                  }}
                  onMouseOver={(e) => {
                    if (!currentSlots.includes(slot)) {
                      e.currentTarget.style.backgroundColor = '#3a3a3a';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!currentSlots.includes(slot)) {
                      e.currentTarget.style.backgroundColor = '#2a2a2a';
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={currentSlots.includes(slot)}
                    onChange={() => toggleSlot(slot)}
                    style={{
                      marginRight: '8px',
                      cursor: 'pointer',
                      accentColor: '#4CAF50'
                    }}
                  />
                  <span style={{ color: '#e0e0e0' }}>{slot}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontSize: '14px',
              color: '#b0b0b0',
              fontWeight: '500'
            }}>
              Operation:
            </label>
            <select
              value={currentOperation}
              onChange={(e) => setCurrentOperation(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                backgroundColor: '#1e1e1e',
                color: '#e0e0e0',
                border: '1px solid #4a4a4a',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {OPERATIONS.map(op => (
                <option key={op.value} value={op.value}>
                  {op.label} ({op.symbol})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontSize: '14px',
              color: '#b0b0b0',
              fontWeight: '500'
            }}>
              Amount:
            </label>
            <input
              type="number"
              step="0.1"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                backgroundColor: '#1e1e1e',
                color: '#e0e0e0',
                border: '1px solid #4a4a4a',
                borderRadius: '4px'
              }}
            />
          </div>

          <button
            onClick={addModifier}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
          >
            Add Modifier
          </button>
        </div>

        {/* Right Panel - List */}
        <div style={{
          backgroundColor: '#2a2a2a',
          padding: '25px',
          borderRadius: '8px',
          border: '1px solid #3a3a3a'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid #3a3a3a',
            paddingBottom: '10px'
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '20px',
              color: '#fff'
            }}>
              Modifiers ({modifiers.length})
            </h2>
            {modifiers.length > 0 && (
              <button
                onClick={clearAll}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Clear All
              </button>
            )}
          </div>

          <div style={{
            maxHeight: '600px',
            overflowY: 'auto'
          }}>
            {modifiers.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#666',
                fontSize: '14px'
              }}>
                No modifiers added yet. Add one using the form on the left.
              </div>
            ) : (
              modifiers.map(mod => (
                <div
                  key={mod.id}
                  style={{
                    backgroundColor: '#1e1e1e',
                    padding: '15px',
                    marginBottom: '10px',
                    borderRadius: '4px',
                    border: '1px solid #3a3a3a',
                    position: 'relative'
                  }}
                >
                  <button
                    onClick={() => removeModifier(mod.id)}
                    style={{
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
                    }}
                  >
                    Remove
                  </button>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#4CAF50' }}>
                    {mod.attribute}
                  </div>
                  <div style={{ fontSize: '13px', color: '#b0b0b0', marginBottom: '4px' }}>
                    Slot: <span style={{ color: '#e0e0e0' }}>{mod.slot}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#b0b0b0', marginBottom: '4px' }}>
                    Operation: <span style={{ color: '#e0e0e0' }}>{getOperationLabel(mod.operation)}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#b0b0b0', marginBottom: '4px' }}>
                    Amount: <span style={{ color: '#e0e0e0' }}>{mod.amount}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Output Panel */}
      {modifiers.length > 0 && (
        <div style={{
          backgroundColor: '#2a2a2a',
          padding: '25px',
          borderRadius: '8px',
          border: '1px solid #3a3a3a',
          marginTop: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '20px',
              color: '#fff'
            }}>
              Output
            </h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select
                value={outputFormat}
                onChange={(e) => {
                  setOutputFormat(e.target.value);
                  setCopySuccess('');
                }}
                style={{
                  padding: '8px 12px',
                  fontSize: '14px',
                  backgroundColor: '#1e1e1e',
                  color: '#e0e0e0',
                  border: '1px solid #4a4a4a',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                <option value="craftengine">CraftEngine YAML</option>
                <option value="json">JSON Format</option>
                <option value="compact">Compact (Single Line)</option>
              </select>
              <button
                onClick={copyToClipboard}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Copy to Clipboard
              </button>
            </div>
          </div>

          {copySuccess && (
            <div style={{
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              borderRadius: '4px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {copySuccess}
            </div>
          )}

          <pre style={{
            backgroundColor: '#1e1e1e',
            padding: '20px',
            borderRadius: '4px',
            border: '1px solid #3a3a3a',
            fontSize: '13px',
            lineHeight: '1.6',
            overflowX: 'auto',
            color: '#e0e0e0',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace'
          }}>
            {generateOutput()}
          </pre>
        </div>
      )}

      {/* Info Panel */}
      <div style={{
        backgroundColor: '#2a2a2a',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #3a3a3a',
        marginTop: '20px',
        fontSize: '13px',
        color: '#b0b0b0'
      }}>
        <h3 style={{ marginTop: 0, color: '#fff', fontSize: '16px' }}>How to use:</h3>
        <ol style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Select an attribute from the dropdown (e.g., attack_damage, armor)</li>
          <li>Select one or more slots using the checkboxes</li>
          <li>Choose an operation type (add_value, add_multiplied_base, or add_multiplied_total)</li>
          <li>Enter the amount value (can be negative for reductions)</li>
          <li>Click "Add Modifier" to create modifiers for all selected slots</li>
          <li>Use the output section to copy the generated CraftEngine YAML</li>
          <li>Paste into your Nexo Maker "Attribute Modifiers" Editor Module</li>
        </ol>
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#1e1e1e', borderRadius: '4px' }}>
          <strong style={{ color: '#4CAF50' }}>Operation Types:</strong>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li><strong>Add Value (+):</strong> Adds the value directly to the base attribute</li>
            <li><strong>Add Multiplied Base (+%):</strong> Adds (base × value) to the attribute</li>
            <li><strong>Add Multiplied Total (x%):</strong> Multiplies total by (1 + value)</li>
          </ul>
        </div>
      </div>
      </div>
    </div>
  );
};
