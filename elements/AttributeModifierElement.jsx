module.exports = ({ useState, useEffect, useGlobalState, api, value, onChange, placeholder, rows }) => {
  const [, setOverlayVisible] = useGlobalState('attrBuilderOverlayVisible', false);
  const [, setOverlayData] = useGlobalState('attrBuilderOverlayData', null);

  const openBuilder = () => {
    // Set overlay data with current value and callback
    setOverlayData({
      existingYaml: value || '',
      callback: (newYaml) => {
        // Update the field value when overlay saves
        onChange(newYaml);
      }
    });

    // Show overlay
    setOverlayVisible(true);
  };

  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }
  },
    // Textarea
    React.createElement('textarea', {
      value: value || '',
      onChange: (e) => onChange(e.target.value),
      placeholder: placeholder || '',
      rows: rows || 8,
      style: {
        width: '100%',
        padding: '10px',
        fontSize: '14px',
        fontFamily: 'Consolas, Monaco, monospace',
        backgroundColor: '#1e1e1e',
        color: '#e0e0e0',
        border: '1px solid #4a4a4a',
        borderRadius: '4px',
        resize: 'vertical'
      }
    }),

    // Button to open builder
    React.createElement('button', {
      onClick: openBuilder,
      style: {
        padding: '10px 16px',
        fontSize: '14px',
        fontWeight: 'bold',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'background-color 0.3s'
      },
      onMouseEnter: (e) => {
        e.target.style.backgroundColor = '#45a049';
      },
      onMouseLeave: (e) => {
        e.target.style.backgroundColor = '#4CAF50';
      }
    },
      React.createElement('span', { style: { fontSize: '16px' } }, '⚡'),
      'Open Visual Builder'
    )
  );
};
