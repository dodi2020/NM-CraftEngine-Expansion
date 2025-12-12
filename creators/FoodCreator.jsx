module.exports = ({ useState, useEffect, onNext, projectId }) => {
  const [itemName, setItemName] = useState('');

  useEffect(() => {
    if (itemName.trim()) {
      const foodData = {
        id: itemName.toLowerCase().replace(/\s+/g, '_'),
        type: 'food',
        subtype: 'food',
        display: itemName,

      };
      onNext(foodData);
    } else {
      onNext(null);
    }
  }, [itemName, onNext]);



  return (
    <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--col-text-primary)' }}>
        🍎 Create Food
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--col-text-secondary)' }}>
          Food Name:
        </label>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Enter Food name..."
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


    </div>
  );
};