module.exports = async (nm, api) => {

  const strengthicon = await api.nexomaker.loadAsset(__dirname + "/assets/strength.png");

  // Data Components - Simple Value Components
  api.nexomaker.postEditorModule({
    name: "craftengine_attackRange",
    display: "Attack Range",
    plugins: ["craftengine"],
    compatibility: ["weapon", "tool", "item"],
    description: "Sets the attack range for this item (minecraft:attack_range component)",
    type: "number",
    default: null,
  });

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
    description: "Enchantment data for the item",
    type: "text",
    default: "",
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
    description: "Attribute modifiers for the item. Click the strength icon (⚡) in the sidebar to open the visual builder, or paste YAML directly here.",
    icon: strengthicon,
    type: "loot",
    default: "",
    placeholder: "Click the strength icon in sidebar for visual builder, or paste YAML here\n\nExample:\n- type: attack_damage\n  amount: 5.0\n  operation: add_value\n  slot: mainhand",
    rows: 8,
    resize: "vertical",
    maxLength: 10000
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_food",
    display: "Food Component",
    plugins: ["craftengine"],
    compatibility: ["food", "item"],
    description: "Food component data",
    type: "text",
    default: "",
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
    description: "Allow item dyeing",
    type: "checkbox",
    default: false,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_consumeReplacement",
    display: "Consume Replacement",
    plugins: ["craftengine"],
    compatibility: ["food", "item"],
    description: "Item given after consumption",
    type: "minecraftid",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_craftRemainder",
    display: "Craft Remainder",
    plugins: ["craftengine"],
    compatibility: ["item"],
    description: "Item left after crafting",
    type: "minecraftid",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_invulnerable",
    display: "Invulnerable",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor"],
    description: "Make item invulnerable to damage",
    type: "checkbox",
    default: false,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_compostProbability",
    display: "Compost Probability",
    plugins: ["craftengine"],
    compatibility: ["item", "food"],
    description: "Probability of composting success (0.0-1.0)",
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
    description: "Color when used as dye",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_fireworkColor",
    display: "Firework Color",
    plugins: ["craftengine"],
    compatibility: ["item"],
    description: "Firework color configuration",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_ingredientSubstitute",
    display: "Ingredient Substitute",
    plugins: ["craftengine"],
    compatibility: ["item"],
    description: "Substitute ingredient for recipes",
    type: "text",
    default: "",
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
    description: "Display configuration for dropped items",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_glowColor",
    display: "Glow Color",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor"],
    description: "Glow color for item",
    type: "text",
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
    type: "text",
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

  // Armor-specific modules
  api.nexomaker.postEditorModule({
    name: "craftengine_defense",
    display: "Defense",
    plugins: ["craftengine"],
    compatibility: ["armor"],
    description: "Armor defense value (minecraft:generic.armor)",
    type: "number",
    default: null,
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_toughness",
    display: "Toughness",
    plugins: ["craftengine"],
    compatibility: ["armor"],
    description: "Armor toughness value (minecraft:generic.armor_toughness)",
    type: "number",
    default: null,
  });

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
    name: "craftengine_removeComponents",
    display: "Remove Components (1.20.5+)",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor", "food"],
    description: "List of component IDs to remove (e.g., 'minecraft:equippable')",
    type: "text",
    default: "",
  });

  api.nexomaker.postEditorModule({
    name: "craftengine_customComponents",
    display: "Custom Components (1.20.5+)",
    plugins: ["craftengine"],
    compatibility: ["item", "tool", "weapon", "armor", "food", "block"],
    description: "Custom Minecraft components in YAML format (advanced users)",
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
    type: "text",
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
    'lore': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    
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
    'equippable': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'gravity': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'jumpStrength': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'knockbackResistance': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'luck': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'max-health': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'maxAbsorption': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'maxStackSize': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'movementEfficiency': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'unbreakable': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'nutrition': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'saturation': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
    'consumable': { plugins: ['nexo', 'itemsadder', 'craftengine'] },
  
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
