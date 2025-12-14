# Attribute Modifier Builder

The Attribute Modifier Builder is a visual tool for creating CraftEngine attribute modifier configurations without writing YAML manually.

## How to Access

1. Look for the **strength icon** (💪) at the bottom of the NexoMaker sidebar
2. Click the icon to open the Attribute Builder page
3. Alternatively, navigate to `/tools/attribute-builder`

## Features

### Visual Modifier Creation
- **Select Attribute Type**: Choose from 18+ attribute types including:
  - Combat: attack_damage, attack_speed, attack_knockback
  - Defense: armor, armor_toughness, knockback_resistance
  - Movement: movement_speed, flying_speed, step_height
  - And many more!

- **Set Amount**: Define the numeric value for the modifier
- **Choose Operation**:
  - `add_value`: Adds the exact amount
  - `add_multiplied_base`: Multiplies base value then adds
  - `add_multiplied_total`: Multiplies total value then adds

- **Select Slot**: Specify where the modifier applies:
  - any, hand, armor, mainhand, offhand
  - head, chest, legs, feet, body

- **Optional Custom ID**: Add namespace:id for custom identification
- **Display Override (1.21.5+)**: Override tooltip text with custom formatting

### Modifier Management
- **Add Multiple Modifiers**: Build a list of attribute modifiers
- **Edit Existing**: Click "Edit" on any modifier to update it
- **Remove Modifiers**: Delete modifiers you don't need
- **Visual Preview**: See all your modifiers listed with key details

### YAML Output
- **Live Preview**: See YAML output update in real-time
- **Copy to Clipboard**: One-click copy for pasting into editor modules
- **Formatted Output**: Properly indented, ready-to-use YAML

## Example Usage

### Creating a Powerful Sword

1. Open the Attribute Builder
2. Add first modifier:
   - Type: attack_damage
   - Amount: 8.0
   - Operation: add_value
   - Slot: mainhand
3. Add second modifier:
   - Type: attack_speed
   - Amount: -2.4
   - Operation: add_value
   - Slot: mainhand
4. Click "Copy to Clipboard"
5. Paste into the "Attribute Modifiers" field in your item editor

Result:
```yaml
- type: attack_damage
  amount: 8.0
  operation: add_value
  slot: mainhand
- type: attack_speed
  amount: -2.4
  operation: add_value
  slot: mainhand
```

### Creating Custom Armor

1. Add defense modifier:
   - Type: armor
   - Amount: 6.0
   - Operation: add_value
   - Slot: chest
2. Add toughness:
   - Type: armor_toughness
   - Amount: 2.0
   - Operation: add_value
   - Slot: chest
3. Add knockback resistance:
   - Type: knockback_resistance
   - Amount: 0.1
   - Operation: add_value
   - Slot: chest

## Tips

- **Use the Builder First**: Start with the visual builder, then paste into the text field
- **Test Operations**: Different operations have different effects - experiment!
- **Slot Specificity**: Use specific slots (mainhand, head, etc.) for targeted effects
- **Custom IDs**: Use namespaced IDs to avoid conflicts with other plugins
- **Display Override**: Add custom tooltip text for better player experience (1.21.5+ only)

## Integration with Editor Modules

The builder generates YAML that's compatible with the `craftengine_attributeModifiers` editor module. After building your modifiers:

1. Copy the YAML output
2. Go to your item editor
3. Find "Attribute Modifiers" field
4. Paste the YAML
5. Save your item

The transformer will automatically convert this to the correct CraftEngine format during export.

## Supported Attribute Types

| Attribute | Description |
|-----------|-------------|
| attack_damage | Increases damage dealt |
| attack_speed | Changes attack speed |
| attack_knockback | Modifies knockback dealt |
| armor | Adds armor points |
| armor_toughness | Adds armor toughness |
| knockback_resistance | Reduces knockback received |
| max_health | Changes maximum health |
| movement_speed | Modifies movement speed |
| flying_speed | Changes elytra flying speed |
| luck | Affects loot quality |
| step_height | Changes step-up height |
| scale | Modifies entity size (1.20.5+) |
| gravity | Changes gravity effect (1.20.5+) |
| jump_strength | Modifies jump height |
| burning_time | Changes burn duration |
| explosion_knockback_resistance | Reduces explosion knockback |
| movement_efficiency | Affects movement in certain conditions |
| oxygen_bonus | Increases underwater time |
| water_movement_efficiency | Improves underwater movement |

## Version Notes

- **Display Override** feature requires Minecraft 1.21.5+
- **Scale** and **Gravity** attributes require Minecraft 1.20.5+
- All other features work on Minecraft 1.20.5+

## Troubleshooting

**YAML not working?**
- Ensure proper indentation (the builder handles this automatically)
- Check that the module field is named `craftengine_attributeModifiers`
- Verify item compatibility (armor, weapon, tool, or item)

**Modifiers not appearing in-game?**
- Check CraftEngine version compatibility
- Verify the export was successful
- Ensure the item material supports the modifiers
