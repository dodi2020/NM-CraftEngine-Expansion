module.exports = (nm) => {
  nm.registerEditorType(
    'armor_editor',
    __dirname + '/../editors/ArmorEditor.jsx',
    {
      label: 'Armor Editor',
      description: 'Edit armor pieces with custom stats'
    }
  );
};