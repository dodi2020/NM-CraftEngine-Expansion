/**
 * Block State Editor
 * Provides a YAML textarea and an auto-state dropdown for block state configuration.
 */

module.exports = ({ useState, useEffect, api }) => {
  const [currentItem, setCurrentItem] = useState(null);
  const [yamlText, setYamlText] = useState('');
  const [autoType, setAutoType] = useState('');
  const [stateId, setStateId] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  const AUTO_TYPES = [
    'note_block','mushroom_stem','solid','leaves','tripwire','sapling','cactus','sugar_cane','kelp','chorus','stem','fence','door','pressure_plate','button','sign','lantern','redstone','slab','stairs','pillar','bed','vine','sapling','fluid','plant','coral','shulker_box','fence_gate','wall','rail','anvil','glass','leaves_no_decay','beacon'
  ];

  useEffect(() => {
    // Find current item context from route and load it
    const fetchItem = async () => {
      try {
        const route = window.location.hash || window.location.pathname;
        const projectIdMatch = route.match(/\/project\/([^\/]+)/);
        const itemIdMatch = route.match(/\/itemseditor\/([^\/]+)/);
        if (!projectIdMatch || !itemIdMatch) return;
        const projectId = projectIdMatch[1];
        const itemId = itemIdMatch[1];
        const response = await api.nexomaker.item.readAll(projectId);
        const items = response?.data?.contents || [];
        const itemWrapper = items.find(i => i.data?.id === itemId);
        if (itemWrapper) {
          const item = { ...itemWrapper.data, path: itemWrapper.path };
          setCurrentItem(item);

          // Initialize values from modules if present
          const modules = item.modules || {};
          if (modules.craftengine_stateAuto) {
            setAutoType(String(modules.craftengine_stateAuto));
            setYamlText(`state:\n  auto-state: ${modules.craftengine_stateAuto}`);
          } else if (modules.craftengine_state) {
            const s = modules.craftengine_state;
            // Display as multi-line state block
            if (typeof s === 'string') {
              setYamlText(`state:\n  state: ${s}`);
            } else {
              setYamlText(`state:\n  state: ${JSON.stringify(s)}`);
            }
          } else {
            // Default based on baseMaterial if available
            const mat = (modules.baseMaterial || 'note_block').toLowerCase();
            setAutoType(mat);
            setYamlText(`state:\n  auto-state: ${mat}`);
          }

          if (modules.craftengine_stateId !== undefined) setStateId(String(modules.craftengine_stateId));
        }
      } catch (e) {
        console.error('BlockStateEditor: failed to fetch item', e);
      }
    };

    fetchItem();
  }, []);

  const updateYamlWithAuto = (type) => {
    // If yamlText contains a state: block, replace auto-state or append
    const lines = yamlText.split('\n');
    let out = [];
    let replaced = false;
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (line.trim().startsWith('state:')) {
        // collect following indented lines
        out.push('state:');
        i++;
        // skip existing sub-lines
        while (i < lines.length && (lines[i].startsWith('  ') || lines[i].trim() === '')) i++;
        // inject new auto-state
        out.push(`  auto-state: ${type}`);
        replaced = true;
        continue;
      } else {
        out.push(line);
      }
      i++;
    }
    if (!replaced) {
      if (out.length && out[out.length-1].trim() !== '') out.push('');
      out.push('state:');
      out.push(`  auto-state: ${type}`);
    }
    const newYaml = out.join('\n');
    setYamlText(newYaml);
  };

  const handleAutoChange = (e) => {
    const t = e.target.value;
    setAutoType(t);
    if (t) updateYamlWithAuto(t);
  };

  const parseYamlState = (text) => {
    // Improved parsing to handle:
    // - inline state: `state: minecraft:note_block[...]` or `state: { auto-state: note_block }`
    // - block state: multi-line under `state:` with `auto-state:` or `state:`
    // - multi-state blocks under `states:` with `properties:` and optional `id:`
    const lines = text.split('\n');

    const parseIndented = (startIdx) => {
      const obj = {};
      const baseIndent = lines[startIdx].search(/\S/);
      let i = startIdx + 1;
      while (i < lines.length) {
        const line = lines[i];
        if (line.trim() === '') { i++; continue; }
        const indent = line.search(/\S/);
        if (indent <= baseIndent) break;
        const trimmed = line.trim();
        if (trimmed.endsWith(':')) {
          const key = trimmed.slice(0, -1);
          const nested = parseIndented(i);
          obj[key] = nested.obj;
          i = nested.next;
          continue;
        }
        const colon = trimmed.indexOf(':');
        if (colon !== -1) {
          const key = trimmed.slice(0, colon).trim();
          let val = trimmed.slice(colon + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (val === 'true') val = true;
          else if (val === 'false') val = false;
          else if (!isNaN(Number(val)) && val !== '') val = Number(val);
          obj[key] = val;
        }
        i++;
      }
      return { obj, next: i };
    };

    // look for `states:` (multi-state) first
    for (let i = 0; i < lines.length; i++) {
      const t = lines[i].trim();
      if (t.startsWith('states:')) {
        const parsed = parseIndented(i);
        const res = {};
        if (parsed.obj.properties) res.properties = parsed.obj.properties;
        if (parsed.obj.id !== undefined) res.id = parsed.obj.id;
        return { states: res };
      }
    }

    // look for `state:`
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('state:')) {
        const rest = trimmed.slice('state:'.length).trim();
        if (rest.startsWith('{') && rest.endsWith('}')) {
          // inline object like { auto-state: note_block }
          const inner = rest.slice(1, -1).trim();
          const m = inner.match(/auto-state\s*:\s*([^,}]+)/);
          if (m) return { auto: m[1].trim() };
          const m2 = inner.match(/state\s*:\s*([^,}]+)/);
          if (m2) return { state: m2[1].trim() };
        }

        if (rest && rest.startsWith('minecraft:')) {
          return { state: rest };
        }

        // multiline `state:` block
        const parsed = parseIndented(i);
        if (parsed.obj['auto-state']) return { auto: parsed.obj['auto-state'] };
        if (parsed.obj['state']) return { state: parsed.obj['state'] };
        // if no recognized keys, but object exists, return as stateObj
        if (Object.keys(parsed.obj).length > 0) return { stateObj: parsed.obj };
      }
    }

    // fallback: raw string starting with minecraft:
    if (text.trim().startsWith('minecraft:')) return { state: text.trim() };
    return {};
  };

  const handleApply = async () => {
    if (!currentItem || !currentItem.path) {
      setSaveStatus('✗ No item context');
      return;
    }

    try {
      setSaveStatus('Applying...');
      const modules = { ...(currentItem.modules || {}) };

      const parsed = parseYamlState(yamlText);
      // Handle multi-state block
      if (parsed.states) {
        // store properties object and optional id
        modules.craftengine_statesProperties = parsed.states.properties || parsed.states.properties === '' ? parsed.states.properties : undefined;
        if (parsed.states.id !== undefined) modules.craftengine_statesId = parsed.states.id;
        // remove single-state fields
        delete modules.craftengine_state;
        delete modules.craftengine_stateAuto;
      } else if (parsed.auto) {
        modules.craftengine_stateAuto = parsed.auto;
        delete modules.craftengine_state;
        // remove states fields
        delete modules.craftengine_statesProperties;
        delete modules.craftengine_statesId;
      } else if (parsed.state) {
        modules.craftengine_state = parsed.state;
        delete modules.craftengine_stateAuto;
        delete modules.craftengine_statesProperties;
        delete modules.craftengine_statesId;
      } else if (parsed.stateObj) {
        // store object form directly for advanced use
        modules.craftengine_state = parsed.stateObj;
        delete modules.craftengine_stateAuto;
        delete modules.craftengine_statesProperties;
        delete modules.craftengine_statesId;
      }

      if (stateId !== '') {
        const n = Number(stateId);
        if (!isNaN(n)) modules.craftengine_stateId = n;
        else modules.craftengine_stateId = stateId;
      } else {
        delete modules.craftengine_stateId;
      }

      // Persist via API
      await api.nexomaker.item.update({ path: currentItem.path, changes: { ...currentItem, modules } });

      setSaveStatus('✓ Applied! Refreshing...');
      // Trigger item reload similar to InlineYamlEditor
      const currentRoute = window.location.hash;
      setTimeout(() => {
        window.location.hash = '#/';
        setTimeout(() => {
          window.location.hash = currentRoute;
        }, 50);
      }, 300);
    } catch (e) {
      console.error('BlockStateEditor apply failed', e);
      setSaveStatus(`✗ Error: ${e.message}`);
    }
  };

  return React.createElement('div', {
    style: {
      display: 'flex',
      gap: '8px',
      flexDirection: 'column',
      width: '100%'
    }
  },
    React.createElement('div', { style: { display: 'flex', gap: '8px', alignItems: 'flex-start' } },
      React.createElement('div', { style: { minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '8px' } },
        React.createElement('label', { style: { fontWeight: 600 } }, 'Auto-State Type'),
        React.createElement('select', {
          value: autoType || '',
          onChange: handleAutoChange,
          style: { padding: '8px', borderRadius: '6px', border: '1px solid var(--col-ouliner-default)', background: 'var(--col-input-default)' }
        },
          React.createElement('option', { value: '' }, '— Use material default —'),
          AUTO_TYPES.map(t => React.createElement('option', { key: t, value: t }, t))
        ),
        React.createElement('div', { style: { fontSize: '12px', color: 'var(--col-txt-secondary)' } }, 'Selecting an auto-state inserts `state:\n  auto-state: <type>`. Precise `state:` strings (minecraft:...) override auto-state.'),
        (autoType && AUTO_TYPES.indexOf(autoType) === -1) && React.createElement('div', { style: { color: 'var(--col-error)', fontSize: '12px' } }, 'Warning: selected type is not in the known list.'),
        React.createElement('label', { style: { fontWeight: 600 } }, 'State ID (optional)'),
        React.createElement('input', {
          type: 'text',
          value: stateId,
          onChange: (e) => setStateId(e.target.value),
          placeholder: 'numeric id (optional)',
          style: { padding: '8px', borderRadius: '6px', border: '1px solid var(--col-ouliner-default)', background: 'var(--col-input-default)' }
        })
      ),

      React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column' } },
        React.createElement('label', { style: { fontWeight: 600 } }, 'State YAML'),
        React.createElement('textarea', {
          value: yamlText,
          onChange: (e) => setYamlText(e.target.value),
          placeholder: 'state:\n  auto-state: note_block\n or\nstate: minecraft:note_block[instrument=hat,note=0,powered=false]',
          rows: 6,
          spellCheck: false,
          style: { width: '100%', padding: '8px', fontFamily: 'monospace', background: 'var(--col-input-default)', color: 'var(--col-txt-primary)', border: '1px solid var(--col-ouliner-default)', borderRadius: '6px' }
        })
      )
    ),

      React.createElement('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
      React.createElement('button', {
        onClick: handleApply,
        style: { padding: '8px 12px', background: 'var(--col-primary-form)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }
      }, 'Apply'),
      React.createElement('div', { style: { color: saveStatus.startsWith('✗') ? 'var(--col-error)' : 'var(--col-txt-primary)', fontWeight: 600 } }, saveStatus)
    )
  );
};

