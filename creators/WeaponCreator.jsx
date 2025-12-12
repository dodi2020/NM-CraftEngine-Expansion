module.exports = ({ useState, useEffect, onNext, projectId}) => {
  const [itemName, setItemName] = useState('');
  const [itemMaterial, setItemMaterial] = useState('DIAMOND');
  const [weaponType, setWeaponType] = useState('sword');
  const [moduleValues, setModuleValues] = useState({});

  const handleModuleValueChange = (moduleKey, value) => {
    setModuleValues(prev => ({ ...prev, [moduleKey]: value }));
  };

  const { MODULE_DEFINITIONS } = require('../../registers/RegisterEditorModules.js');

  useEffect(() => {
    if (itemName.trim()) {
      const weaponData = {
        id: itemName.toLowerCase().replace(/\s+/g, '_'),
        type: 'weapon',
        subtype: 'weapon',
        display: itemName,
        weapon_type: weaponType,
        material: itemMaterial,
        ...moduleValues,

      };
      onNext(weaponData);
    } else {
      onNext(null);
    }
  }, [itemName, itemMaterial, weaponType, onNext, moduleValues]);



  return (
    <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--col-text-primary)' }}>
        ⚔️ Create Weapon
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--col-text-secondary)' }}>
          Weapon Name:
        </label>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Enter Weapon name..."
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--col-text-secondary)' }}>
          Material:
        </label>
        <select
          value={itemMaterial}
          onChange={(e) => setItemMaterial(e.target.value)}
          style={{
            padding: '10px 12px',
            fontSize: '15px',
            border: '1px solid var(--col-outliner-default)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--col-input-background)',
            color: 'var(--col-text-primary)',
            cursor: 'pointer'
          }}
        >
          <option value="WOOD">Wood</option>
          <option value="STONE">Stone</option>
          <option value="IRON">Iron</option>
          <option value="DIAMOND">Diamond</option>
          <option value="NETHERITE">Netherite</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--col-text-secondary)' }}>
          Weapon Type:
        </label>
        <select
          value={weaponType}
          onChange={(e) => setWeaponType(e.target.value)}
          style={{
            padding: '10px 12px',
            fontSize: '15px',
            border: '1px solid var(--col-outliner-default)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--col-input-background)',
            color: 'var(--col-text-primary)',
            cursor: 'pointer'
          }}
        >
          <option value="sword">Sword</option>
          <option value="dagger">Dagger</option>
          <option value="mace">Mace</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      {Object.entries(MODULE_DEFINITIONS)
        .filter(([, def]) => def.compatibility.includes('weapon'))
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