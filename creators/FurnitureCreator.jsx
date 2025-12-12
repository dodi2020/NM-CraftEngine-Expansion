module.exports = ({ useState, useEffect, onNext, projectId}) => {
  const [furnitureName, setFurnitureName] = useState('');
  const [moduleValues, setModuleValues] = useState({});

  const handleModuleValueChange = (moduleKey, value) => {
    setModuleValues(prev => ({ ...prev, [moduleKey]: value }));
  };

  const { MODULE_DEFINITIONS } = require('../../registers/RegisterEditorModules.js');


  useEffect(() => {
    if (furnitureName.trim()) {
      const furnitureData = {
        id: furnitureName.toLowerCase().replace(/\s+/g, '_'),
        type: 'furniture',
        display: furnitureName,
        ...moduleValues,

      };
      onNext(furnitureData);
    } else {
      onNext(null);
    }
  }, [furnitureName, onNext, moduleValues]);



  return (
    <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--col-text-primary)' }}>
        🛋️ Create Furniture
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--col-text-secondary)' }}>
          Furniture Name:
        </label>
        <input
          type="text"
          value={furnitureName}
          onChange={(e) => setFurnitureName(e.target.value)}
          placeholder="Enter Furniture name..."
          autoFocus
          style={{
            padding: '10px 12px',
            fontSize: '15px',
            border: '1px solid var(--col-outliner-default)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--col-input-background)',
            color: 'var(--col-text-primary)'
          }}
        />
      </div>

      {Object.entries(MODULE_DEFINITIONS)
        .filter(([, def]) => def.compatibility.includes('furniture'))
        .map(([key, def]) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--col-text-secondary)' }}>
              {def.display || key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:
            </label>
            {def.type === 'number' && (
              <input
                type="number"
                value={moduleValues[key] !== undefined ? moduleValues[key] : (def.default || 0)}
                onChange={(e) => handleModuleValueChange(key, Number(e.target.value))}
                placeholder={def.description}
                style={{
                  padding: '10px 12px',
                  fontSize: '15px',
                  border: '1px solid var(--col-outliner-default)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--col-input-background)',
                  color: 'var(--col-text-primary)'
                }}
              />
            )}
            {def.type === 'checkbox' && (
              <input
                type="checkbox"
                checked={moduleValues[key] !== undefined ? moduleValues[key] : (def.default || false)}
                onChange={(e) => handleModuleValueChange(key, e.target.checked)}
                style={{
                  padding: '10px 12px',
                  fontSize: '15px',
                  border: '1px solid var(--col-outliner-default)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--col-input-background)',
                  color: 'var(--col-text-primary)'
                }}
              />
            )}
            {def.type === 'text' && (
              <input
                type="text"
                value={moduleValues[key] !== undefined ? moduleValues[key] : (def.default || '')}
                onChange={(e) => handleModuleValueChange(key, e.target.value)}
                placeholder={def.description}
                style={{
                  padding: '10px 12px',
                  fontSize: '15px',
                  border: '1px solid var(--col-outliner-default)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--col-input-background)',
                  color: 'var(--col-text-primary)'
                }}
              />
            )}
          </div>
        ))}


    </div>
  );
};