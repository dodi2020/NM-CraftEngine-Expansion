module.exports = async (nm) => {
  let MODULE_DEFINITIONS = {
    "attack_range": {
      compatibility: ["item", "weapon"],
      description: "Defines the attack range.",
      type: "number",
      default: 0
    },
    "attribute_modifiers": {
      compatibility: ["item", "weapon", "tool", "armor"],
      description: "Defines attribute modifiers.",
      type: "text",
      default: "",
      minecraftComponent: {
        id: "minecraft:attribute_modifiers",
        type: "json" // Assuming it takes JSON input for modifiers
      }
    },
    "banner_patterns": {
      compatibility: ["item", "block"],
      description: "Defines banner patterns.",
      type: "text",
      default: ""
    },
    "base_color": {
      compatibility: ["item", "block", "armor"],
      description: "Defines the base color.",
      type: "text",
      default: ""
    },
    "bees": {
      compatibility: ["item", "block"],
      description: "Defines bee-related properties for blocks.",
      type: "number",
      default: 0
    },
    "block_entity_data": {
      compatibility: ["item", "block", "furniture"],
      description: "Defines block entity data.",
      type: "text",
      default: ""
    },
    "block_state": {
      compatibility: ["item", "block", "furniture"],
      description: "Defines the block state.",
      type: "text",
      default: ""
    },
    "blocks_attacks": {
      compatibility: ["item", "weapon", "tool", "armor"],
      description: "Indicates if the item blocks attacks.",
      type: "checkbox",
      default: false
    },
    "break_sound": {
      compatibility: ["item", "block", "furniture", "weapon", "tool"],
      description: "Defines the sound when broken.",
      type: "text",
      default: ""
    },
    "bucket_entity_data": {
      compatibility: ["item"],
      description: "Defines bucket entity data.",
      type: "text",
      default: ""
    },
    "bundle_contents": {
      compatibility: ["item"],
      description: "Defines contents for bundles.",
      type: "text",
      default: ""
    },
    "can_break": {
      compatibility: ["item", "tool", "block", "furniture", "weapon"],
      description: "Defines what the item can break.",
      type: "text",
      default: ""
    },
    "can_place_on": {
      compatibility: ["item", "block", "furniture"],
      description: "Defines where the item can be placed.",
      type: "text",
      default: ""
    },
    "charged_projectiles": {
      compatibility: ["item", "weapon"],
      description: "Defines charged projectile properties.",
      type: "checkbox",
      default: false
    },
    "consumable": {
      compatibility: ["item", "food"],
      description: "Defines consumable properties.",
      type: "checkbox",
      default: false
    },
    "container": {
      compatibility: ["item", "block", "furniture"],
      description: "Defines container properties.",
      type: "checkbox",
      default: false
    },
    "container_loot": {
      compatibility: ["item", "block", "furniture"],
      description: "Defines container loot.",
      type: "text",
      default: ""
    },
    "custom_data": {
      compatibility: ["item", "weapon", "tool", "block", "furniture", "food", "armor"],
      description: "Custom data tag for the item.",
      type: "text",
      default: ""
    },
    "custom_model_data": {
      compatibility: ["item", "weapon", "tool", "block", "furniture", "food", "armor"],
      description: "The custom model data for the item's texture.",
      type: "number",
      default: 0,
      minecraftComponent: {
        id: "minecraft:custom_model_data",
        type: "number"
      }
    },
    "custom_name": {
      compatibility: ["item", "weapon", "tool", "block", "furniture", "food", "armor"],
      description: "Custom name for the item.",
      type: "text",
      default: ""
    },
    "damage": {
      compatibility: ["item", "weapon", "tool"],
      description: "Sets the attack damage of the weapon or tool.",
      type: "number",
      default: 0,
      minecraftComponent: {
        id: "minecraft:attack_damage",
        type: "number"
      }
    },
    "damage_resistant": {
      compatibility: ["item", "armor"],
      description: "Defines damage resistance.",
      type: "checkbox",
      default: false
    },
    "damage_type": {
      compatibility: ["item", "weapon", "tool"],
      description: "Defines damage type.",
      type: "text",
      default: ""
    },
    "death_protection": {
      compatibility: ["item", "armor"],
      description: "Defines death protection.",
      type: "checkbox",
      default: false
    },
    "debug_stick_state": {
      compatibility: ["item"],
      description: "Defines debug stick state.",
      type: "text",
      default: ""
    },
    "dyed_color": {
      compatibility: ["item", "armor"],
      description: "Defines dyed color.",
      type: "text",
      default: ""
    },
    "enchantable": {
      compatibility: ["item", "weapon", "tool", "armor"],
      description: "Whether the item can be enchanted.",
      type: "checkbox",
      default: false
    },
    "enchantment_glint_override": {
      compatibility: ["item", "weapon", "tool", "armor"],
      description: "Overrides enchantment glint.",
      type: "checkbox",
      default: false,
      minecraftComponent: {
        id: "minecraft:enchantment_glint_override",
        type: "boolean"
      }
    },
    "enchantments": {
      compatibility: ["item", "weapon", "tool", "armor"],
      description: "Defines enchantments.",
      type: "text",
      default: ""
    },
    "entity_data": {
      compatibility: ["item"],
      description: "Defines entity data.",
      type: "text",
      default: ""
    },
    "equippable": {
      compatibility: ["item", "weapon", "tool", "armor"],
      description: "Defines equippable properties.",
      type: "checkbox",
      default: false
    },
    "firework_explosion": {
      compatibility: ["item"],
      description: "Defines firework explosion properties.",
      type: "text",
      default: ""
    },
    "fireworks": {
      compatibility: ["item"],
      description: "Defines firework properties.",
      type: "text",
      default: ""
    },
    "food": {
      compatibility: ["item", "food"],
      description: "Defines food properties.",
      type: "text",
      default: ""
    },
    "glider": {
      compatibility: ["item"],
      description: "Defines glider properties.",
      type: "checkbox",
      default: false
    },
    "instrument": {
      compatibility: ["item"],
      description: "Defines instrument properties.",
      type: "text",
      default: ""
    },
    "intangible_projectile": {
      compatibility: ["item", "weapon"],
      description: "Defines intangible projectile properties.",
      type: "checkbox",
      default: false
    },
    "item_model": {
      compatibility: ["item", "weapon", "tool", "block", "furniture", "food", "armor"],
      description: "The item's model.",
      type: "text",
      default: ""
    },
    "item_name": {
      compatibility: ["item", "weapon", "tool", "block", "furniture", "food", "armor"],
      description: "The displayed name of the item.",
      type: "text",
      default: "",
      minecraftComponent: {
        id: "minecraft:item_name",
        type: "string"
      }
    },
    "jukebox_playable": {
      compatibility: ["item"],
      description: "Defines jukebox playable properties.",
      type: "checkbox",
      default: false
    },
    "kinetic_weapon": {
      compatibility: ["item", "weapon"],
      description: "Defines kinetic weapon properties.",
      type: "checkbox",
      default: false
    },
    "lock": {
      compatibility: ["item", "block", "container", "weapon", "tool", "armor", "furniture"],
      description: "Defines lock properties.",
      type: "text",
      default: ""
    },
    "lodestone_tracker": {
      compatibility: ["item"],
      description: "Defines lodestone tracker properties.",
      type: "checkbox",
      default: false
    },
    "lore": {
      compatibility: ["item", "weapon", "tool", "block", "furniture", "food", "armor"],
      description: "Lore text for the item.",
      type: "text",
      default: "",
      minecraftComponent: {
        id: "minecraft:lore",
        type: "array_of_strings_from_pipe_separated_text" // Custom type to indicate transformation
      }
    },
    "map_color": {
      compatibility: ["item", "block"],
      description: "Defines map color.",
      type: "text",
      default: ""
    },
    "map_decorations": {
      compatibility: ["item"],
      description: "Defines map decorations.",
      type: "text",
      default: ""
    },
    "map_id": {
      compatibility: ["item"],
      description: "Defines map ID.",
      type: "number",
      default: 0
    },
    "max_damage": {
      compatibility: ["item", "weapon", "tool", "armor"],
      description: "Defines maximum damage/durability.",
      type: "number",
      default: 0
    },
    "max_stack_size": {
      compatibility: ["item", "weapon", "tool", "block", "furniture", "food", "armor"],
      description: "The maximum stack size for this item.",
      type: "number",
      default: 0,
      minecraftComponent: {
        id: "minecraft:max_stack_size",
        type: "number"
      }
    },
    "minimum_attack_charge": {
      compatibility: ["item", "weapon"],
      description: "Defines minimum attack charge.",
      type: "number",
      default: 0
    },
    "note_block_sound": {
      compatibility: ["item", "block"],
      description: "Defines note block sound.",
      type: "text",
      default: ""
    },
    "ominous_bottle_amplifier": {
      compatibility: ["item"],
      description: "Defines ominous bottle amplifier.",
      type: "number",
      default: 0
    },
    "piercing_weapon": {
      compatibility: ["item", "weapon"],
      description: "Defines piercing weapon properties.",
      type: "checkbox",
      default: false
    },
    "pot_decorations": {
      compatibility: ["item", "block"],
      description: "Defines pot decorations.",
      type: "text",
      default: ""
    },
    "potion_contents": {
      compatibility: ["item"],
      description: "Defines potion contents.",
      type: "text",
      default: ""
    },
    "potion_duration_scale": {
      compatibility: ["item"],
      description: "Scales potion duration.",
      type: "number",
      default: 0
    },
    "profile": {
      compatibility: ["item"],
      description: "Defines profile properties.",
      type: "text",
      default: ""
    },
    "provides_banner_patterns": {
      compatibility: ["item", "block"],
      description: "Provides banner patterns.",
      type: "checkbox",
      default: false
    },
    "provides_trim_material": {
      compatibility: ["item", "block"],
      description: "Provides trim material.",
      type: "checkbox",
      default: false
    },
    "rarity": {
      compatibility: ["item", "weapon", "tool", "block", "furniture", "food", "armor"],
      description: "Rarity of the item.",
      type: "text",
      default: ""
    },
    "recipes": {
      compatibility: ["item", "block", "tool", "weapon", "food", "armor", "furniture"],
      description: "Defines recipes associated with the item.",
      type: "text",
      default: ""
    },
    "repair_cost": {
      compatibility: ["item", "weapon", "tool", "armor"],
      description: "Defines repair cost.",
      type: "number",
      default: 0
    },
    "repairable": {
      compatibility: ["item", "weapon", "tool", "armor"],
      description: "Defines repairable properties.",
      type: "checkbox",
      default: false
    },
    "stored_enchantments": {
      compatibility: ["item"],
      description: "Defines stored enchantments.",
      type: "text",
      default: ""
    },
    "suspicious_stew_effects": {
      compatibility: ["item", "food"],
      description: "Defines suspicious stew effects.",
      type: "text",
      default: ""
    },
    "swing_animation": {
      compatibility: ["item", "weapon", "tool"],
      description: "Defines swing animation properties.",
      type: "text",
      default: ""
    },
    "tool": {
      compatibility: ["item", "tool"],
      description: "Indicates the item is a tool.",
      type: "checkbox",
      default: false
    },
    "tooltip_display": {
      compatibility: ["item", "weapon", "tool", "block", "furniture", "food", "armor"],
      description: "Display options for the tooltip.",
      type: "text",
      default: ""
    },
    "tooltip_style": {
      compatibility: ["item", "weapon", "tool", "block", "furniture", "food", "armor"],
      description: "Styling options for the tooltip.",
      type: "text",
      default: ""
    },
    "trim": {
      compatibility: ["item", "armor"],
      description: "Defines trim properties for armor.",
      type: "text",
      default: ""
    },
    "unbreakable": {
      compatibility: ["item", "weapon", "tool", "block", "furniture", "food", "armor"],
      description: "Makes the item unbreakable.",
      type: "checkbox",
      default: false,
      minecraftComponent: {
        id: "minecraft:unbreakable",
        type: "boolean"
      }
    },
    "use_cooldown": {
      compatibility: ["item", "weapon", "tool", "food"],
      description: "Defines use cooldown.",
      type: "number",
      default: 0
    },
    "use_effects": {
      compatibility: ["item", "weapon", "tool", "food"],
      description: "Defines use effects.",
      type: "text",
      default: ""
    },
    "use_remainder": {
      compatibility: ["item", "food"],
      description: "Defines use remainder.",
      type: "text",
      default: ""
    },
    "weapon": {
      compatibility: ["item", "weapon"],
      description: "Indicates the item is a weapon.",
      type: "checkbox",
      default: false
    },
    "writable_book_content": {
      compatibility: ["item"],
      description: "Defines writable book content.",
      type: "text",
      default: ""
    },
    "written_book_content": {
      compatibility: ["item"],
      description: "Defines written book content.",
      type: "text",
      default: ""
    },
  };

  const staticYamlModules = require('./../config/attribute_modules_data.js');

  // Merge with existing definitions, static YAML definitions take precedence
  MODULE_DEFINITIONS = { ...MODULE_DEFINITIONS, ...staticYamlModules };
  nm.api.console.log("Statically loaded attribute modules from JavaScript file.");

  const sortedModuleKeys = Object.keys(MODULE_DEFINITIONS).sort();

  sortedModuleKeys.forEach(key => {
    const moduleDef = MODULE_DEFINITIONS[key];
    const displayName = moduleDef.display || key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    nm.postEditorModule({
      name: `craftengine_${key}`,
      display: displayName,
      plugins: ["craftengine"],
      compatibility: moduleDef.compatibility,
      description: moduleDef.description || `Properties for ${displayName}.`,
      type: moduleDef.type,
      default: moduleDef.default,
      component: "DefaultComponent", // Placeholder component name
    });
  });

  return MODULE_DEFINITIONS;
};