module.exports = ({ useState, useEffect, onNext, projectId }) => {
  const [itemName, setItemName] = useState('');
  const [itemMaterial, setItemMaterial] = useState('DIAMOND');
  const [weaponType, setWeaponType] = useState('sword');

  useEffect(() => {
    if (itemName.trim()) {
      const weaponData = {
        id: itemName.toLowerCase().replace(/\s+/g, '_'),
        type: 'weapon',
        subtype: 'weapon',
        display: itemName,
        weapon_type: weaponType,
        material: itemMaterial,

      };
      onNext(weaponData);
    } else {
      onNext(null);
    }
  }, [itemName, itemMaterial, weaponType, onNext]);



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


    </div>
  );
};