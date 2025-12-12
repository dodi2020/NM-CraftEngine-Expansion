module.exports = ({ useState, useEffect, onNext, projectId }) => {
  const [itemName, setItemName] = useState('');
  const [itemMaterial, setItemMaterial] = useState('DIAMOND');
  const [toolType, setToolType] = useState('pickaxe');

  useEffect(() => {
    if (itemName.trim()) {
      const toolData = {
        id: itemName.toLowerCase().replace(/\s+/g, '_'),
        type: 'tool',
        subtype: 'tool',
        display: itemName,
        tool_type: toolType,
        material: itemMaterial,

      };
      onNext(toolData);
    } else {
      onNext(null);
    }
  }, [itemName, itemMaterial, toolType, onNext]);



  return (
    <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--col-text-primary)' }}>
        ⛏️ Create Tool
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--col-text-secondary)' }}>
          Tool Name:
        </label>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Enter Tool name..."
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
          Tool Type:
        </label>
        <select
          value={toolType}
          onChange={(e) => setToolType(e.target.value)}
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
          <option value="axe">Axe</option>
          <option value="hoe">Hoe</option>
          <option value="shovel">Shovel</option>
          <option value="pickaxe">Pickaxe</option>
        </select>
      </div>


    </div>
  );
};