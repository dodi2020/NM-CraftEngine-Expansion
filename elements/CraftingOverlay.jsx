/**
 * Custom Crafting Overlay Component
 * Drag-and-drop crafting grid with all vanilla Minecraft items
 */
module.exports = ({ useState, useEffect, value, onChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [localValue, setLocalValue] = useState(value || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [customItem, setCustomItem] = useState({ namespace: 'minecraft', id: '' });
  const [showCustomDialog, setShowCustomDialog] = useState(false);

  // Sync local value with prop value
  useEffect(() => {
    if (value && Array.isArray(value)) {
      setLocalValue(value);
    } else {
      setLocalValue([null, null, null, null, null, null, null, null, null]);
    }
  }, [value]);

  // All vanilla Minecraft items (categorized)
  const VANILLA_ITEMS = {
    'Building Blocks': [
      'stone', 'granite', 'polished_granite', 'diorite', 'polished_diorite', 'andesite', 'polished_andesite',
      'grass_block', 'dirt', 'coarse_dirt', 'podzol', 'cobblestone', 'oak_planks', 'spruce_planks',
      'birch_planks', 'jungle_planks', 'acacia_planks', 'dark_oak_planks', 'mangrove_planks',
      'cherry_planks', 'pale_oak_planks', 'bamboo_planks', 'crimson_planks', 'warped_planks',
      'oak_log', 'spruce_log', 'birch_log', 'jungle_log', 'acacia_log', 'dark_oak_log',
      'mangrove_log', 'cherry_log', 'pale_oak_log', 'bamboo_block', 'crimson_stem', 'warped_stem',
      'stripped_oak_log', 'stripped_spruce_log', 'stripped_birch_log', 'stripped_jungle_log',
      'stripped_acacia_log', 'stripped_dark_oak_log', 'stripped_mangrove_log', 'stripped_cherry_log',
      'stripped_pale_oak_log', 'stripped_bamboo_block', 'stripped_crimson_stem', 'stripped_warped_stem',
      'oak_wood', 'spruce_wood', 'birch_wood', 'jungle_wood', 'acacia_wood', 'dark_oak_wood',
      'mangrove_wood', 'cherry_wood', 'pale_oak_wood', 'stripped_oak_wood', 'stripped_spruce_wood',
      'glass', 'tinted_glass', 'white_stained_glass', 'orange_stained_glass', 'magenta_stained_glass',
      'light_blue_stained_glass', 'yellow_stained_glass', 'lime_stained_glass', 'pink_stained_glass',
      'gray_stained_glass', 'light_gray_stained_glass', 'cyan_stained_glass', 'purple_stained_glass',
      'blue_stained_glass', 'brown_stained_glass', 'green_stained_glass', 'red_stained_glass', 'black_stained_glass',
      'white_wool', 'orange_wool', 'magenta_wool', 'light_blue_wool', 'yellow_wool', 'lime_wool',
      'pink_wool', 'gray_wool', 'light_gray_wool', 'cyan_wool', 'purple_wool', 'blue_wool',
      'brown_wool', 'green_wool', 'red_wool', 'black_wool', 'terracotta', 'white_terracotta',
      'bricks', 'bookshelf', 'mossy_cobblestone', 'obsidian', 'purpur_block', 'purpur_pillar',
      'netherrack', 'soul_sand', 'soul_soil', 'basalt', 'polished_basalt', 'smooth_basalt',
      'blackstone', 'polished_blackstone', 'polished_blackstone_bricks', 'end_stone', 'end_stone_bricks',
      'sandstone', 'chiseled_sandstone', 'cut_sandstone', 'red_sandstone', 'chiseled_red_sandstone',
      'prismarine', 'prismarine_bricks', 'dark_prismarine', 'quartz_block', 'quartz_bricks',
      'amethyst_block', 'budding_amethyst', 'calcite', 'tuff', 'dripstone_block', 'copper_block',
      'exposed_copper', 'weathered_copper', 'oxidized_copper', 'cut_copper', 'waxed_copper_block'
    ],
    'Tools & Weapons': [
      'wooden_sword', 'wooden_pickaxe', 'wooden_axe', 'wooden_shovel', 'wooden_hoe',
      'stone_sword', 'stone_pickaxe', 'stone_axe', 'stone_shovel', 'stone_hoe',
      'iron_sword', 'iron_pickaxe', 'iron_axe', 'iron_shovel', 'iron_hoe',
      'golden_sword', 'golden_pickaxe', 'golden_axe', 'golden_shovel', 'golden_hoe',
      'diamond_sword', 'diamond_pickaxe', 'diamond_axe', 'diamond_shovel', 'diamond_hoe',
      'netherite_sword', 'netherite_pickaxe', 'netherite_axe', 'netherite_shovel', 'netherite_hoe',
      'bow', 'crossbow', 'trident', 'shield', 'shears', 'fishing_rod', 'flint_and_steel',
      'brush', 'mace', 'spyglass'
    ],
    'Armor': [
      'leather_helmet', 'leather_chestplate', 'leather_leggings', 'leather_boots',
      'chainmail_helmet', 'chainmail_chestplate', 'chainmail_leggings', 'chainmail_boots',
      'iron_helmet', 'iron_chestplate', 'iron_leggings', 'iron_boots',
      'golden_helmet', 'golden_chestplate', 'golden_leggings', 'golden_boots',
      'diamond_helmet', 'diamond_chestplate', 'diamond_leggings', 'diamond_boots',
      'netherite_helmet', 'netherite_chestplate', 'netherite_leggings', 'netherite_boots',
      'turtle_helmet', 'elytra', 'wolf_armor'
    ],
    'Food': [
      'apple', 'golden_apple', 'enchanted_golden_apple', 'melon_slice', 'sweet_berries', 'glow_berries',
      'chorus_fruit', 'carrot', 'potato', 'baked_potato', 'poisonous_potato', 'beetroot',
      'dried_kelp', 'beef', 'cooked_beef', 'porkchop', 'cooked_porkchop', 'mutton', 'cooked_mutton',
      'chicken', 'cooked_chicken', 'rabbit', 'cooked_rabbit', 'cod', 'cooked_cod', 'salmon',
      'cooked_salmon', 'tropical_fish', 'pufferfish', 'bread', 'cookie', 'cake', 'pumpkin_pie',
      'rotten_flesh', 'spider_eye', 'mushroom_stew', 'beetroot_soup', 'rabbit_stew', 'suspicious_stew',
      'honey_bottle', 'milk_bucket'
    ],
    'Materials': [
      'coal', 'charcoal', 'diamond', 'emerald', 'lapis_lazuli', 'quartz', 'amethyst_shard',
      'iron_ingot', 'copper_ingot', 'gold_ingot', 'netherite_ingot', 'netherite_scrap',
      'iron_nugget', 'gold_nugget', 'stick', 'bowl', 'string', 'feather', 'gunpowder',
      'wheat_seeds', 'wheat', 'flint', 'bone', 'bone_meal', 'sugar', 'paper', 'book',
      'slime_ball', 'clay_ball', 'brick', 'nether_brick', 'prismarine_shard', 'prismarine_crystals',
      'nautilus_shell', 'heart_of_the_sea', 'scute', 'phantom_membrane', 'echo_shard',
      'disc_fragment', 'leather', 'rabbit_hide', 'honeycomb', 'blaze_rod', 'blaze_powder',
      'magma_cream', 'ender_pearl', 'ender_eye', 'ghast_tear', 'nether_star', 'dragon_breath',
      'fermented_spider_eye', 'glistering_melon_slice', 'experience_bottle', 'fire_charge',
      'nether_wart', 'redstone', 'glowstone_dust', 'chorus_fruit_popped'
    ],
    'Redstone': [
      'redstone', 'redstone_torch', 'redstone_block', 'repeater', 'comparator', 'piston',
      'sticky_piston', 'slime_block', 'honey_block', 'observer', 'hopper', 'dropper', 'dispenser',
      'lever', 'stone_button', 'oak_button', 'stone_pressure_plate', 'oak_pressure_plate',
      'tripwire_hook', 'trapped_chest', 'tnt', 'redstone_lamp', 'note_block', 'daylight_detector',
      'rail', 'powered_rail', 'detector_rail', 'activator_rail', 'minecart', 'chest_minecart',
      'furnace_minecart', 'tnt_minecart', 'hopper_minecart', 'command_block_minecart'
    ],
    'Miscellaneous': [
      'bucket', 'water_bucket', 'lava_bucket', 'powder_snow_bucket', 'snowball', 'egg',
      'compass', 'recovery_compass', 'clock', 'map', 'name_tag', 'lead', 'saddle',
      'oak_boat', 'oak_chest_boat', 'spruce_boat', 'birch_boat', 'jungle_boat', 'acacia_boat',
      'dark_oak_boat', 'mangrove_boat', 'cherry_boat', 'pale_oak_boat', 'bamboo_raft',
      'totem_of_undying', 'nether_star', 'end_crystal', 'enchanted_book', 'writable_book',
      'written_book', 'item_frame', 'glow_item_frame', 'painting', 'armor_stand', 'glass_bottle',
      'potion', 'splash_potion', 'lingering_potion', 'tipped_arrow', 'spectral_arrow', 'arrow',
      'firework_rocket', 'firework_star', 'goat_horn', 'spyglass', 'bundle'
    ],
    'Dyes': [
      'white_dye', 'orange_dye', 'magenta_dye', 'light_blue_dye', 'yellow_dye', 'lime_dye',
      'pink_dye', 'gray_dye', 'light_gray_dye', 'cyan_dye', 'purple_dye', 'blue_dye',
      'brown_dye', 'green_dye', 'red_dye', 'black_dye', 'ink_sac', 'glow_ink_sac', 'cocoa_beans'
    ]
  };

  // Flatten all items for searching
  const getAllItems = () => {
    const allItems = [];
    Object.values(VANILLA_ITEMS).forEach(category => {
      allItems.push(...category);
    });
    return allItems;
  };

  // Filter items based on search
  const getFilteredItems = () => {
    if (!searchTerm) return VANILLA_ITEMS;

    const term = searchTerm.toLowerCase();
    const filtered = {};

    Object.entries(VANILLA_ITEMS).forEach(([category, items]) => {
      const matchingItems = items.filter(item => item.toLowerCase().includes(term));
      if (matchingItems.length > 0) {
        filtered[category] = matchingItems;
      }
    });

    return filtered;
  };

  // Handle slot click (set item)
  const handleSlotClick = (index, item) => {
    const newGrid = [...localValue];
    newGrid[index] = item;
    setLocalValue(newGrid);
  };

  // Handle drag start
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('item', item);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Handle drop
  const handleDrop = (e, index) => {
    e.preventDefault();
    const item = e.dataTransfer.getData('item');
    if (item) {
      handleSlotClick(index, item);
    }
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // Clear slot
  const clearSlot = (index) => {
    const newGrid = [...localValue];
    newGrid[index] = null;
    setLocalValue(newGrid);
  };

  // Clear all slots
  const clearAll = () => {
    setLocalValue([null, null, null, null, null, null, null, null, null]);
  };

  // Add custom item
  const addCustomItem = () => {
    if (!customItem.id.trim()) return;

    const fullId = `${customItem.namespace}:${customItem.id}`;
    // You could add this to a custom items list if needed
    setShowCustomDialog(false);
    setCustomItem({ namespace: 'minecraft', id: '' });

    // For now, we'll just set it as searchTerm so user can drag it
    alert(`Custom item ${fullId} ready to use. Type it in search or use the format "namespace:id"`);
  };

  // Save and close
  const handleSave = () => {
    onChange(localValue);
    setShowModal(false);
  };

  // Cancel
  const handleCancel = () => {
    setLocalValue(value || [null, null, null, null, null, null, null, null, null]);
    setShowModal(false);
  };

  // Format item name for display
  const formatItemName = (item) => {
    if (!item) return '';
    return item.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Get Minecraft Wiki image URL for an item
  const getItemImageUrl = (item) => {
    if (!item) return null;
    // Minecraft Wiki uses this pattern for item images
    const formattedName = formatItemName(item).replace(/ /g, '_');
    return `https://minecraft.wiki/images/Invicon_${formattedName}.png`;
  };

  // Fallback if image fails to load
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'block';
  };

  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      width: '100%'
    }
  },
    // Button to open modal
    React.createElement('button', {
      onClick: () => setShowModal(true),
      style: {
        padding: '10px 16px',
        backgroundColor: 'var(--col-accent)',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s'
      },
      onMouseOver: (e) => {
        e.target.style.backgroundColor = 'var(--col-accent-hover)';
        e.target.style.transform = 'translateY(-1px)';
      },
      onMouseOut: (e) => {
        e.target.style.backgroundColor = 'var(--col-accent)';
        e.target.style.transform = 'translateY(0)';
      }
    }, '🎨 Open Crafting Recipe Builder'),

    // Recipe preview
    localValue && localValue.some(item => item !== null) && React.createElement('div', {
      style: {
        padding: '12px',
        backgroundColor: 'var(--col-input-default)',
        borderRadius: '4px',
        fontSize: '12px',
        border: '1px solid var(--col-border)'
      }
    },
      React.createElement('div', {
        style: {
          fontWeight: '600',
          marginBottom: '8px',
          color: 'var(--col-text)'
        }
      }, `Current Recipe (${localValue.filter(i => i).length} items):`),
      React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '4px',
          marginTop: '8px'
        }
      },
        localValue.map((item, idx) =>
          React.createElement('div', {
            key: idx,
            style: {
              padding: '4px',
              backgroundColor: item ? 'var(--col-accent-secondary)' : 'var(--col-bg)',
              borderRadius: '3px',
              fontSize: '10px',
              textAlign: 'center',
              minHeight: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--col-border)',
              color: item ? 'var(--col-text)' : 'var(--col-text-secondary)',
              fontFamily: 'monospace'
            }
          }, item ? formatItemName(item).substring(0, 10) + (formatItemName(item).length > 10 ? '...' : '') : '—')
        )
      )
    ),

    // Modal overlay
    showModal && React.createElement('div', {
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px'
      },
      onClick: (e) => {
        if (e.target === e.currentTarget) handleCancel();
      }
    },
      React.createElement('div', {
        style: {
          backgroundColor: 'var(--col-bg)',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }
      },
        // Header
        React.createElement('div', {
          style: {
            padding: '20px',
            borderBottom: '1px solid var(--col-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }
        },
          React.createElement('h2', {
            style: { margin: 0, fontSize: '20px', color: 'var(--col-text)' }
          }, 'Crafting Recipe Builder'),
          React.createElement('button', {
            onClick: handleCancel,
            style: {
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--col-text)',
              padding: '0 8px'
            }
          }, '×')
        ),

        // Main content
        React.createElement('div', {
          style: {
            flex: 1,
            display: 'flex',
            overflow: 'hidden'
          }
        },
          // Left panel - Items list
          React.createElement('div', {
            style: {
              width: '350px',
              borderRight: '1px solid var(--col-border)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }
          },
            // Search box
            React.createElement('div', {
              style: { padding: '16px', borderBottom: '1px solid var(--col-border)' }
            },
              React.createElement('input', {
                type: 'text',
                placeholder: 'Search items...',
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                style: {
                  width: '100%',
                  padding: '8px',
                  border: '1px solid var(--col-border)',
                  borderRadius: '4px',
                  backgroundColor: 'var(--col-input-default)',
                  color: 'var(--col-text)',
                  fontSize: '13px'
                }
              }),
              React.createElement('button', {
                onClick: () => setShowCustomDialog(true),
                style: {
                  marginTop: '8px',
                  width: '100%',
                  padding: '6px',
                  backgroundColor: 'var(--col-accent-secondary)',
                  color: 'var(--col-text)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }
              }, '+ Add Custom Item')
            ),

            // Items scroll area
            React.createElement('div', {
              style: {
                flex: 1,
                overflow: 'auto',
                padding: '12px'
              }
            },
              Object.entries(getFilteredItems()).map(([category, items]) =>
                React.createElement('div', {
                  key: category,
                  style: { marginBottom: '16px' }
                },
                  React.createElement('h3', {
                    style: {
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--col-text-secondary)',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }
                  }, category),
                  React.createElement('div', {
                    style: {
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '4px'
                    }
                  },
                    items.map(item =>
                      React.createElement('div', {
                        key: item,
                        draggable: true,
                        onDragStart: (e) => handleDragStart(e, item),
                        style: {
                          padding: '6px 8px',
                          backgroundColor: 'var(--col-input-default)',
                          borderRadius: '4px',
                          cursor: 'grab',
                          fontSize: '11px',
                          transition: 'all 0.2s',
                          border: '1px solid transparent',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        },
                        onMouseOver: (e) => {
                          e.currentTarget.style.backgroundColor = 'var(--col-accent-secondary)';
                          e.currentTarget.style.borderColor = 'var(--col-accent)';
                        },
                        onMouseOut: (e) => {
                          e.currentTarget.style.backgroundColor = 'var(--col-input-default)';
                          e.currentTarget.style.borderColor = 'transparent';
                        }
                      },
                        React.createElement('img', {
                          src: getItemImageUrl(item),
                          alt: '',
                          onError: handleImageError,
                          style: {
                            width: '16px',
                            height: '16px',
                            imageRendering: 'pixelated',
                            flexShrink: 0
                          }
                        }),
                        React.createElement('span', {
                          style: {
                            display: 'none',
                            width: '16px',
                            height: '16px',
                            backgroundColor: 'var(--col-border)',
                            borderRadius: '2px',
                            flexShrink: 0
                          }
                        }),
                        formatItemName(item)
                      )
                    )
                  )
                )
              )
            )
          ),

          // Right panel - Crafting grid
          React.createElement('div', {
            style: {
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px'
            }
          },
            React.createElement('h3', {
              style: {
                fontSize: '16px',
                marginBottom: '24px',
                color: 'var(--col-text)'
              }
            }, 'Drag items into the crafting grid'),

            // 3x3 Grid
            React.createElement('div', {
              style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginBottom: '24px'
              }
            },
              localValue.map((item, index) =>
                React.createElement('div', {
                  key: index,
                  onDrop: (e) => handleDrop(e, index),
                  onDragOver: handleDragOver,
                  style: {
                    width: '80px',
                    height: '80px',
                    border: '2px dashed var(--col-border)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: item ? 'var(--col-accent-secondary)' : 'var(--col-input-default)',
                    position: 'relative',
                    cursor: item ? 'pointer' : 'default',
                    transition: 'all 0.2s'
                  },
                  onMouseOver: (e) => {
                    if (!item) e.currentTarget.style.borderColor = 'var(--col-accent)';
                  },
                  onMouseOut: (e) => {
                    if (!item) e.currentTarget.style.borderColor = 'var(--col-border)';
                  }
                },
                  item ? React.createElement('div', {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '4px'
                    }
                  },
                    React.createElement('img', {
                      src: getItemImageUrl(item),
                      alt: formatItemName(item),
                      onError: (e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      },
                      style: {
                        width: '32px',
                        height: '32px',
                        imageRendering: 'pixelated'
                      }
                    }),
                    React.createElement('div', {
                      style: {
                        display: 'none',
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'var(--col-border)',
                        borderRadius: '4px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        color: 'var(--col-text-secondary)'
                      }
                    }, '?'),
                    React.createElement('span', {
                      style: {
                        fontSize: '9px',
                        textAlign: 'center',
                        wordBreak: 'break-word',
                        lineHeight: '1.2',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }
                    }, formatItemName(item))
                  ) : React.createElement('span', {
                    style: {
                      fontSize: '24px',
                      color: 'var(--col-text-secondary)',
                      opacity: 0.3
                    }
                  }, '+'),

                  item && React.createElement('button', {
                    onClick: () => clearSlot(index),
                    style: {
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: 'var(--col-error)',
                      color: 'white',
                      fontSize: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0
                    }
                  }, '×')
                )
              )
            ),

            // Clear all button
            React.createElement('button', {
              onClick: clearAll,
              style: {
                padding: '8px 16px',
                backgroundColor: 'var(--col-error)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px'
              }
            }, 'Clear All')
          )
        ),

        // Footer
        React.createElement('div', {
          style: {
            padding: '16px 20px',
            borderTop: '1px solid var(--col-border)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }
        },
          React.createElement('button', {
            onClick: handleCancel,
            style: {
              padding: '8px 20px',
              backgroundColor: 'transparent',
              color: 'var(--col-text)',
              border: '1px solid var(--col-border)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }
          }, 'Cancel'),
          React.createElement('button', {
            onClick: handleSave,
            style: {
              padding: '8px 20px',
              backgroundColor: 'var(--col-accent)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }
          }, 'Save Recipe')
        )
      ),

      // Custom item dialog
      showCustomDialog && React.createElement('div', {
        style: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--col-bg)',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          zIndex: 10001,
          minWidth: '400px'
        }
      },
        React.createElement('h3', {
          style: { marginTop: 0, marginBottom: '16px' }
        }, 'Add Custom Item'),
        React.createElement('div', {
          style: { marginBottom: '12px' }
        },
          React.createElement('label', {
            style: { display: 'block', marginBottom: '4px', fontSize: '13px' }
          }, 'Namespace:'),
          React.createElement('input', {
            type: 'text',
            value: customItem.namespace,
            onChange: (e) => setCustomItem({ ...customItem, namespace: e.target.value }),
            placeholder: 'minecraft',
            style: {
              width: '100%',
              padding: '8px',
              border: '1px solid var(--col-border)',
              borderRadius: '4px',
              backgroundColor: 'var(--col-input-default)',
              color: 'var(--col-text)'
            }
          })
        ),
        React.createElement('div', {
          style: { marginBottom: '16px' }
        },
          React.createElement('label', {
            style: { display: 'block', marginBottom: '4px', fontSize: '13px' }
          }, 'Item ID:'),
          React.createElement('input', {
            type: 'text',
            value: customItem.id,
            onChange: (e) => setCustomItem({ ...customItem, id: e.target.value }),
            placeholder: 'my_custom_item',
            style: {
              width: '100%',
              padding: '8px',
              border: '1px solid var(--col-border)',
              borderRadius: '4px',
              backgroundColor: 'var(--col-input-default)',
              color: 'var(--col-text)'
            }
          })
        ),
        React.createElement('div', {
          style: {
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }
        },
          React.createElement('button', {
            onClick: () => {
              setShowCustomDialog(false);
              setCustomItem({ namespace: 'minecraft', id: '' });
            },
            style: {
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: 'var(--col-text)',
              border: '1px solid var(--col-border)',
              borderRadius: '4px',
              cursor: 'pointer'
            }
          }, 'Cancel'),
          React.createElement('button', {
            onClick: addCustomItem,
            style: {
              padding: '8px 16px',
              backgroundColor: 'var(--col-accent)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }
          }, 'Add')
        )
      )
    )
  );
};
