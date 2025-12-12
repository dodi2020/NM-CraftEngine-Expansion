module.exports = ({ useState, useEffect, onNext, projectId }) => {
  const [furnitureName, setFurnitureName] = useState('');

  useEffect(() => {
    if (furnitureName.trim()) {
      const furnitureData = {
        id: furnitureName.toLowerCase().replace(/\s+/g, '_'),
        type: 'furniture',
        display: furnitureName,

      };
      onNext(furnitureData);
    } else {
      onNext(null);
    }
  }, [furnitureName, onNext]);



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


    </div>
  );
};