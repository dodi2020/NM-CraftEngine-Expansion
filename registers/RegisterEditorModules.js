module.exports = async (nm, api) => {

  const strengthicon = await api.nexomaker.loadAsset(__dirname + "/../assets/strength.png");
  const componenticon = await api.nexomaker.loadAsset(__dirname + "/../assets/component.png");
  const enchantmenticon = await api.nexomaker.loadAsset(__dirname + "/../assets/enchantment.png");

  // Data Components - Simple Value Components
  api.nexomaker.postEditorModule({
    name: "craftengine_itemName",
    display: "Item Name",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor", "food", "block", "furniture"],
    description: "Custom display name for the item",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_customName",
    display: "Custom Name",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor", "food", "block", "furniture"],
    description: "Alternative custom name for the item",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_lore",
    display: "Lore",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor", "food", "block", "furniture"],
    description: "Item lore (use | to separate lines)",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_overwritableLore",
    display: "Overwritable Lore",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor", "food", "block", "furniture"],
    description: "Allow lore to be overwritten",
    type: "checkbox",
    default: false,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_overwritableItemName",
    display: "Overwritable Item Name",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor", "food", "block", "furniture"],
    description: "Allow item name to be overwritten",
    type: "checkbox",
    default: false,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_enchantment",
    display: "Enchantment",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor"],
    description: "Enchantment data for the item. Click the button in the sidebar for a visual builder, then paste the generated YAML here.",
    icon: enchantmenticon,
    type: "loot",
    default: "",
    placeholder: "Click the button in the sidebar for a visual builder, or paste YAML here.\n\nExample:\n- enchantment: sharpness\n  level: 5\n- enchantment: unbreaking\n  level: 3",
    rows: 8,
    resize: "vertical",
    maxLength: 10000
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_dyedColor",
    display: "Dyed Color",
    plugins: ["craftengine"],
    compatibility: ["armor", "item"],
    description: "RGB color for dyed items",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_blockState",
    display: "Block State",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Block state properties",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_attributeModifiers",
    display: "Attribute Modifiers",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor"],
    description: "Attribute modifiers for the item. Click the button in the sidebar for a visual builder, then paste the generated YAML here.",
    icon: strengthicon,
    type: "loot",
    default: "",
    placeholder: "Click the button in the sidebar for a visual builder, then paste the generated YAML here.",
    rows: 8,
    resize: "vertical",
    maxLength: 10000
  });


  api.nexomaker.postEditorModule({
    name: "craftengine_jukeboxPlayable",
    display: "Jukebox Playable",
    plugins: ["craftengine"],
    compatibility: ["item"],
    description: "Configure item as jukebox playable",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_itemModel",
    display: "Item Model",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor", "food", "block"],
    description: "Custom item model configuration",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_tooltipStyle",
    display: "Tooltip Style",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor", "food"],
    description: "Custom tooltip styling",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_trim",
    display: "Armor Trim",
    plugins: ["craftengine"],
    compatibility: ["armor"],
    description: "Armor trim configuration",
    type: "text",
    default: "",
  });

  // Equipment Configuration
  api.nexomaker.postEditorModule({
    name: "craftengine_equipmentAssetId",
    display: "Equipment Asset ID",
    plugins: ["craftengine"],
    compatibility: ["item", "armor"],
    description: "Required: The resource location of the equipment model (e.g., default:topaz)",
    type: "text",
    default: "",
    placeholder: "namespace:id"
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_equipmentClientBoundModel",
    display: "Equipment Client Bound Model",
    plugins: ["craftengine"],
    compatibility: ["item", "armor"],
    description: "Optional: Defaults to the global client-bound-model option in config.yml",
    type: "checkbox",
    default: false,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_equipmentSlot",
    display: "Equipment Slot",
    plugins: ["craftengine"],
    compatibility: ["item", "armor"],
    description: "Optional (1.21.2+): Equipment slot - required for other equipment options to work",
    type: "dropdown",
    options: [
      { value: "", label: "None" },
      { value: "head", label: "Head" },
      { value: "chest", label: "Chest" },
      { value: "legs", label: "Legs" },
      { value: "feet", label: "Feet" },
      { value: "body", label: "Body (Animal Armor)" },
      { value: "saddle", label: "Saddle" }
    ],
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_equipmentCameraOverlay",
    display: "Equipment Camera Overlay",
    plugins: ["craftengine"],
    compatibility: ["item", "armor"],
    description: "Optional (1.21.2+): Resource location of overlay texture when equipped (assets/<namespace>/textures/<id>)",
    type: "text",
    default: "",
    placeholder: "namespace:id"
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_equipmentDispensable",
    display: "Equipment Dispensable",
    plugins: ["craftengine"],
    compatibility: ["item", "armor"],
    description: "Optional (1.21.2+): Whether the item can be dispensed using a dispenser",
    type: "checkbox",
    default: false,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_equipmentDamageOnHurt",
    display: "Equipment Damage On Hurt",
    plugins: ["craftengine"],
    compatibility: ["item", "armor"],
    description: "Optional (1.21.2+): Whether this item is damaged when the wearing entity is damaged",
    type: "checkbox",
    default: false,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_equipmentSwappable",
    display: "Equipment Swappable",
    plugins: ["craftengine"],
    compatibility: ["item", "armor"],
    description: "Optional (1.21.2+): Whether the item can be equipped by right-clicking",
    type: "checkbox",
    default: false,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_equipmentEquipOnInteract",
    display: "Equipment Equip On Interact",
    plugins: ["craftengine"],
    compatibility: ["item", "armor"],
    description: "Optional (1.21.5+): Whether this item can be equipped onto a target mob by pressing use on it",
    type: "checkbox",
    default: false,
  });

  // Settings - Item Settings
  api.nexomaker.postEditorModule({
    name: "craftengine_fuelTime",
    display: "Fuel Time",
    plugins: ["craftengine"],
    compatibility: ["item"],
    description: "Burn time as fuel in ticks",
    type: "number",
    default: null,
  });


  api.nexomaker.postEditorModule({
    name: "craftengine_repairable",
    display: "Repairable",
    plugins: ["craftengine"],
    compatibility: ["tool", "weapon", "armor", "item"],
    description: "Repair configuration",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_anvilRepairItem",
    display: "Anvil Repair Item",
    plugins: ["craftengine"],
    compatibility: ["tool", "weapon", "armor", "item"],
    description: "Item used for anvil repair",
    type: "minecraftid",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_renameable",
    display: "Renameable",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor"],
    description: "Allow item renaming",
    type: "checkbox",
    default: true,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_projectile",
    display: "Projectile",
    plugins: ["craftengine"],
    compatibility: ["weapon", "item"],
    description: "Projectile configuration",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_dyeable",
    display: "Dyeable",
    plugins: ["craftengine"],
    compatibility: ["armor", "item"],
    description: "Decides if the item can be dyed in crafting tables",
    type: "checkbox",
    default: false,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_consumeReplacement",
    display: "Consume Replacement",
    plugins: ["craftengine"],
    compatibility: ["food", "item"],
    description: "Set the return item after consuming (e.g., water bottle returns empty bottle)",
    type: "minecraftid",
    default: "",
    placeholder: "minecraft:glass_bottle"
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_craftRemainder",
    display: "Craft Remainder",
    plugins: ["craftengine"],
    compatibility: ["item"],
    description: "Item returned after crafting. Supports fixed item, hurt_and_break, or recipe_based. Simple: minecraft:bucket, Complex: use textarea format",
    type: "textarea",
    default: "",
    placeholder: "minecraft:bucket\n\nOR for complex:\ntype: hurt_and_break\ndamage: 1",
    rows: 3
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_invulnerable",
    display: "Invulnerable",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor"],
    description: "List of damage types item is immune to (lava, fire_tick, block_explosion, entity_explosion, lightning, contact)",
    type: "textarea",
    default: "",
    placeholder: "- lava\n- fire_tick\n- block_explosion\n- entity_explosion\n- lightning\n- contact",
    rows: 6
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_enchantable",
    display: "Enchantable",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor"],
    description: "Block certain items from being used on enchantment table. Setting to true won't make unenchantable items enchantable",
    type: "checkbox",
    default: true,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_compostProbability",
    display: "Compost Probability",
    plugins: ["craftengine"],
    compatibility: ["item", "food"],
    description: "Probability of composting success (0.0-1.0), default: 0.5",
    type: "number",
    default: null,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_respectRepairableComponent",
    display: "Respect Repairable Component",
    plugins: ["craftengine"],
    compatibility: ["tool", "weapon", "armor"],
    description: "Respect repairable component settings",
    type: "checkbox",
    default: true,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_dyeColor",
    display: "Dye Color",
    plugins: ["craftengine"],
    compatibility: ["item"],
    description: "RGB color this item provides in dyeing recipe (e.g., 255,140,0)",
    type: "text",
    default: "",
    placeholder: "255,140,0"
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_fireworkColor",
    display: "Firework Color",
    plugins: ["craftengine"],
    compatibility: ["item"],
    description: "RGB color this item provides in firework star fade recipe (e.g., 255,140,0)",
    type: "text",
    default: "",
    placeholder: "255,140,0"
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_ingredientSubstitute",
    display: "Ingredient Substitute",
    plugins: ["craftengine"],
    compatibility: ["item"],
    description: "Which vanilla items this item can substitute for in recipes (one per line)",
    type: "textarea",
    default: "",
    placeholder: "- minecraft:leather\n- minecraft:paper",
    rows: 3
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_hatHeight",
    display: "Hat Height",
    plugins: ["craftengine"],
    compatibility: ["armor", "item"],
    description: "Height offset when worn as hat",
    type: "number",
    default: null,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_keepOnDeathChance",
    display: "Keep On Death Chance",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor"],
    description: "Chance to keep item on death (0.0-1.0)",
    type: "number",
    default: null,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_destroyOnDeathChance",
    display: "Destroy On Death Chance",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor"],
    description: "Chance to destroy item on death (0.0-1.0)",
    type: "number",
    default: null,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_dropDisplay",
    display: "Drop Display",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor"],
    description: "Control dropped item name display. Use 'true' for default, 'false' to disable, or custom format like '<arg:count>x <name>'",
    type: "text",
    default: "",
    placeholder: "true / false / <arg:count>x <name>"
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_glowColor",
    display: "Glow Color",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor"],
    description: "Make items glow and display colors (black, dark_blue, dark_green, dark_aqua, dark_red, dark_purple, gold, gray, dark_gray, blue, green, aqua, red, light_purple, yellow, white)",
    type: "dropdown",
    options: [
      { value: "", label: "None" },
      { value: "white", label: "White" },
      { value: "black", label: "Black" },
      { value: "dark_blue", label: "Dark Blue" },
      { value: "dark_green", label: "Dark Green" },
      { value: "dark_aqua", label: "Dark Aqua" },
      { value: "dark_red", label: "Dark Red" },
      { value: "dark_purple", label: "Dark Purple" },
      { value: "gold", label: "Gold" },
      { value: "gray", label: "Gray" },
      { value: "dark_gray", label: "Dark Gray" },
      { value: "blue", label: "Blue" },
      { value: "green", label: "Green" },
      { value: "aqua", label: "Aqua" },
      { value: "red", label: "Red" },
      { value: "light_purple", label: "Light Purple" },
      { value: "yellow", label: "Yellow" }
    ],
    default: "",
  });

  // Settings - Block Settings
  api.nexomaker.postEditorModule({
    name: "craftengine_hardness",
    display: "Hardness",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Block hardness value",
    type: "number",
    default: null,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_resistance",
    display: "Resistance",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Explosion resistance value",
    type: "number",
    default: null,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_isRandomlyTicking",
    display: "Randomly Ticking",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Enable random tick updates",
    type: "checkbox",
    default: false,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_pushReaction",
    display: "Push Reaction",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Piston push reaction (normal, destroy, block, ignore, push_only)",
    type: "dropdown",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_mapColor",
    display: "Map Color",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Color displayed on maps",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_burnable",
    display: "Burnable",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Block can catch fire",
    type: "checkbox",
    default: false,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_fireSpreadChance",
    display: "Fire Spread Chance",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Fire spread rate (0-300)",
    type: "number",
    default: null,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_burnChance",
    display: "Burn Chance",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Fire burn rate (0-100)",
    type: "number",
    default: null,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_item",
    display: "Item",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Item configuration for block",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_replaceable",
    display: "Replaceable",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Block can be replaced",
    type: "checkbox",
    default: false,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_isRedstoneConductor",
    display: "Redstone Conductor",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Block conducts redstone",
    type: "checkbox",
    default: false,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_isSuffocating",
    display: "Suffocating",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Block causes suffocation damage",
    type: "checkbox",
    default: false,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_isViewBlocking",
    display: "View Blocking",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Block prevents view through",
    type: "checkbox",
    default: false,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_sounds",
    display: "Sounds",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Block sound configuration",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_requireCorrectTools",
    display: "Require Correct Tools",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Require correct tool to mine",
    type: "checkbox",
    default: false,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_respectToolComponent",
    display: "Respect Tool Component",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Respect tool component settings",
    type: "checkbox",
    default: true,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_correctTools",
    display: "Correct Tools",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "List of correct tools for mining",
    type: "minecraftidlist",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_incorrectToolDigSpeed",
    display: "Incorrect Tool Dig Speed",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Dig speed with incorrect tool",
    type: "number",
    default: null,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_tags",
    display: "Tags",
    plugins: ["craftengine"],
    compatibility: ["block", "item"],
    description: "Block/item tags",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_clientBoundTags",
    display: "Client Bound Tags",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Client-side tags",
    type: "loot",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_instrument",
    display: "Instrument",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Instrument configuration for note blocks",
    type: "minecraftid",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_fluidState",
    display: "Fluid State",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Fluid state configuration",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_supportShape",
    display: "Support Shape",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Shape used for support calculations",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_friction",
    display: "Friction",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Block friction value (slipperiness)",
    type: "number",
    default: null,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_jumpFactor",
    display: "Jump Factor",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Jump height multiplier",
    type: "number",
    default: null,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_speedFactor",
    display: "Speed Factor",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Movement speed multiplier",
    type: "number",
    default: null,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_luminance",
    display: "Luminance",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Light level emitted (0-15)",
    type: "number",
    default: null,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_canOcclude",
    display: "Can Occlude",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Block can occlude neighboring blocks",
    type: "checkbox",
    default: false,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_blockLight",
    display: "Block Light",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Block light level",
    type: "number",
    default: null,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_propagateSkylight",
    display: "Propagate Skylight",
    plugins: ["craftengine"],
    compatibility: ["block"],
    description: "Block propagates skylight",
    type: "checkbox",
    default: false,
  });

  // REMOVED: Armor-specific attribute modules - Use AttributeBuilder instead
  // craftengine_defense - Replaced by AttributeBuilder (attribute: armor, slot: head/chest/legs/feet)
  // craftengine_toughness - Replaced by AttributeBuilder (attribute: armor_toughness, slot: head/chest/legs/feet)

  api.nexomaker.postEditorModule({
    name: "craftengine_fireResistant",
    display: "Fire Resistant",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor"],
    description: "Item is resistant to fire and lava",
    type: "checkbox",
    default: false,
  });

  // ========================================
  // NEW MISSING MODULES FROM CRAFTENGINE WIKI
  // ========================================

  // Item Data - Advanced Components
  api.nexomaker.postEditorModule({
    name: "craftengine_pdc",
    display: "Persistent Data Container (PDC)",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor", "food", "block", "furniture"],
    description: "Custom plugin data using Persistent Data Container (YAML format)",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_externalPlugin",
    display: "External Plugin",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor", "food"],
    description: "External plugin name for item compatibility (e.g., 'neigeitems')",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_externalId",
    display: "External Item ID",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor", "food"],
    description: "External plugin item ID (e.g., 'namespace:path' or 'TYPE:ID' for MMOItems)",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_customComponents",
    display: "Custom Components (1.20.5+)",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor", "food", "block"],
    description: "Custom Minecraft components in YAML format. Click the button in the sidebar for a visual builder, then paste the generated YAML here.",
    icon: componenticon,
    type: "loot",
    default: "",
    placeholder: "Click the button in the sidebar for a visual builder, then paste the generated YAML here.",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_removeComponents",
    display: "Remove Components (1.20.5+)",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor", "food"],
    description: "List of component IDs to remove (e.g., 'minecraft:equippable')",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_nbt",
    display: "NBT Data (1.20-1.20.4 Legacy)",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor", "food"],
    description: "Legacy NBT data for Minecraft 1.20-1.20.4 (YAML format)",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_clientBoundMaterial",
    display: "Client Bound Material (Premium)",
    plugins: ["craftengine"],
    compatibility: ["item", "block"],
    description: "Client-side only material override (requires Premium edition)",
    type: "minecraftid",
    default: "",
  });

  // Item Settings - Client Bound
  api.nexomaker.postEditorModule({
    name: "craftengine_clientBoundDataComponents",
    display: "Client Bound Data Components (Premium)",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor", "food", "block"],
    description: "Client-side only data components in YAML format (requires Premium)",
    type: "loot",
    default: "",
  });

  // Furniture Settings - Item Reference
  api.nexomaker.postEditorModule({
    name: "craftengine_furnitureItem",
    display: "Furniture Item Reference",
    plugins: ["craftengine"],
    compatibility: ["furniture"],
    description: "Item ID for this furniture (for creative mode middle-click on 1.21.4+)",
    type: "minecraftid",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_furnitureSoundBreak",
    display: "Furniture Break Sound",
    plugins: ["craftengine"],
    compatibility: ["furniture"],
    description: "Sound when breaking furniture (e.g., 'minecraft:block.bamboo_wood.break')",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_furnitureSoundPlace",
    display: "Furniture Place Sound",
    plugins: ["craftengine"],
    compatibility: ["furniture"],
    description: "Sound when placing furniture (e.g., 'minecraft:block.bamboo_wood.place')",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_canAlwaysEat",
    display: "Can Always Eat",
    plugins: ["craftengine"],
    compatibility: ["item", "food"],
    description: "Toggle if the food can always be eaten regardless of hunger",
    type: "checkbox",
    default: "false",
  });

  // Enable basic built-in modules for CraftEngine format (for learning)
  // Uncomment more modules as needed
  api.console.log("?? [CraftEngine] Applying basic module overrides...");
  const overrideResult = nm.postEditorModuleOverrides({
    // Essential weapon/tool modules
    'damage': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'durability': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    
    // Essential item modules  
    'customModelData': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'baseMaterial': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    
    // Item modules
    'displayTransform': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'blockInteractionRange': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'blockBreakSpeed': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'useCooldown': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'enchantable': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'exclude-from-inventory': { plugins: ['nexo', 'itemsadder', 'craftengine'], description: 'Prevents the item from appearing in the plugin GUI.' },
    'repairable': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'hideTooltip': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'recipe': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'disableEnchanting': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'enchantmentGlintOverride': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    // REMOVED: Attribute modules - Use AttributeBuilder instead
    // 'gravity', 'jumpStrength', 'knockbackResistance', 'luck', 'max-health', 'maxAbsorption', 'movementEfficiency'
    'maxStackSize': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'unbreakable': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'nutrition': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'saturation': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'equipment': { plugins: ['craftengine'] },
  
    // Block modules
    'block-hardness': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'block-explosion-resistance': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'block-mining-tool': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'block-mining-level': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'block-drops': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'block-silk-touch-drops': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'block-flammable': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'block-gravity': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'block-light-emission': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'block-placement-rules': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'block-sounds': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'block-transparent': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'block-waterloggable': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    // Furniture modules
    'furniture-display-transform': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'furniture-block_light': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'furniture-block_sounds-break_sound': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'furniture-block_sounds-place_sound': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'furniture-block_sounds-fall_sound': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'furniture-block_sounds-hit_sound': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'furniture-block_sounds-step_sound': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'furniture-drop-silktouch': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'furniture-hitbox-barrier': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'furniture-hitbox-interactions': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'furniture-hitbox-shulkers': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'furniture-limited_placing-floor': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'furniture-limited_placing-roof': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'furniture-limited_placing-wall': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'furniture-limited_placing-type': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'furniture-loot': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'furniture-restricted-rotation': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'furniture-rotatable': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'furniture-sky_light': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'furniture-tracking-rotation': { plugins: ['nexo', 'itemsadder', 'craftengine'] },

  });
  api.console.log("? [CraftEngine] Module overrides applied:", overrideResult);
};
