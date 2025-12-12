module.exports = ({ useState, useEffect, onNext, projectId }) => {
  const [blockName, setBlockName] = useState('');

  useEffect(() => {
    if (blockName.trim()) {
      const blockData = {
        id: blockName.toLowerCase().replace(/\s+/g, '_'),
        type: 'block',
        display: blockName,

      };
      onNext(blockData);
    } else {
      onNext(null);
    }
  }, [blockName, onNext]);



  return (
    <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--col-text-primary)' }}>
        🧱 Create Block
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--col-text-secondary)' }}>
          Block Name:
        </label>
        <input
          type="text"
          value={blockName}
          onChange={(e) => setBlockName(e.target.value)}
          placeholder="Enter Block name..."
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