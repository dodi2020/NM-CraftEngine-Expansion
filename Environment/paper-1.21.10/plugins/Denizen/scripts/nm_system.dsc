# NexoMaker System Script
# Centralized command system for NexoMaker features
# Auto-generated - do not edit manually

nm_command:
  type: command
  name: nm
  description: NexoMaker command system
  usage: /nm <&lt>subcommand<&gt> [args]
  permission: nm.command
  aliases:
  - nexomaker
  tab completions:
    1: gui
    2: open
    3: gui_test
    4: <server.online_players.parse[name].separated_by[|]>
  script:
  # Main command router
  - if <context.args.size> < 1:
    - narrate "<&[error]>Usage: /nm gui open <gui_id> [player]"
    - stop
  
  # GUI subcommand
  - if <context.args.get[1]> == gui:
    - if <context.args.size> < 2:
      - narrate "<&[error]>Usage: /nm gui open <gui_id> [player]"
      - stop
    
    # GUI open action
    - if <context.args.get[2]> == open:
      - if <context.args.size> < 3:
        - narrate "<&[error]>Usage: /nm gui open <gui_id> [player]"
        - stop
      
      - define gui_id:<context.args.get[3]>
      
      # Validate GUI ID
      - define valid_guis:<list[gui_test]>
      - if !<[valid_guis].contains[<[gui_id]>]>:
        - narrate "<&[error]>GUI '<[gui_id]>' not found!"
        - narrate "<&[error]>Available GUIs: <[valid_guis].separated_by[, ]>"
        - stop
      
      # Check if target player specified
      - if <context.args.size> > 3:
        - define target:<server.match_player[<context.args.get[4]>]||null>
        - if <[target]> == null:
          - narrate "<&[error]>Player '<context.args.get[4]>' not found!"
          - stop
        - inventory open d:<[gui_id]> player:<[target]>
        - narrate "<&[success]>Opened GUI '<[gui_id]>' for <[target].name>" targets:<[target]>
      - else:
        # No target specified - must be run by a player
        - if !<player.exists>:
          - narrate "<&[error]>You must specify a player when running from console!"
          - narrate "<&[error]>Usage: /nm gui open <gui_id> <player>"
          - stop
        - inventory open d:<[gui_id]>
        - narrate "<&[success]>Opened GUI '<[gui_id]>'"
    - else:
      - narrate "<&[error]>Unknown GUI action. Use: /nm gui open <gui_id> [player]"
  - else:
    - narrate "<&[error]>Unknown subcommand. Available: gui"
