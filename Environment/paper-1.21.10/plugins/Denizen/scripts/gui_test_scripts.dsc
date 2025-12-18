gui_test:
  type: inventory
  inventory: chest
  title: <&lt>shift:-8<&gt><&lt>glyph<&co>gui_test_glyph<&gt>
  gui: true
  slots:
  - [] [] [] [] [] [] [] [] []
  - [button_1765808020667] [button_1765808020667] [button_1765808020667] [] [button_1765800981623_0] [] [] [] []
  - [] [] [] [] [] [] [] [] []

shape_1765807844699:
  type: item
  material: stone

button_1765800981623_0:
  type: item
  material: paper
  display name: ▼▼▼
  mechanisms:
    custom_model_data: 777

text_1765807740423:
  type: item
  material: stone

button_1765808020667:
  type: item
  material: paper
  display name: RAHHHH
  lore:
  - <gold>meow
  mechanisms:
    custom_model_data: 777

image_1765808003720:
  type: item
  material: stone

gui_test_world:
  type: world
  events:
    after player clicks button_1765800981623_0 in gui_test:
      - execute as_server "minecraft:give <player.name> minecraft:paper[custom_model_data={floats: [1002.0f]},attribute_modifiers=[{amount: 1.0d, id: "minecraft:152e8e9f-60af-4663-aa77-baa2d8944d6e", operation: "add_value", type: "minecraft:gravity"}],custom_data={PublicBukkitValues: {"nexo:id": "fooder"}},consumable={},repairable={items: []},food={nutrition: 10, saturation: 10.0f},item_name="fooder"]"