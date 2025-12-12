module.exports = ({ useState, useEffect, onNext, projectId }) => {
  const [armorName, setArmorName] = useState('');
  const [armorType, setArmorType] = useState('chestplate');

  useEffect(() => {
    if (armorName.trim()) {
      const armorData = {
        id: armorName.toLowerCase().replace(/\s+/g, '_'),
        type: 'item',
        subtype: 'armor',
        display: armorName,
        armor_type: armorType,
        material: 'DIAMOND',

      };
      onNext(armorData);
    } else {
      onNext(null);
    }
  }, [armorName, armorType, onNext]);



  return (
    <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--col-text-primary)' }}>
        🛡️ Create Armor
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--col-text-secondary)' }}>
          Armor Name:
        </label>
        <input
          type="text"
          value={armorName}
          onChange={(e) => setArmorName(e.target.value)}
          placeholder="Enter Armor name..."
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
          Armor Type:
        </label>
        <select
          value={armorType}
          onChange={(e) => setArmorType(e.target.value)}
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
          <option value="helmet">Helmet</option>
          <option value="chestplate">Chestplate</option>
          <option value="leggings">Leggings</option>
          <option value="boots">Boots</option>
        </select>
      </div>


    </div>
  );
};