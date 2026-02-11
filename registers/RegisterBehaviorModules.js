/**
 * Register CraftEngine Behavior Modules
 * Adds editor modules for item/block/furniture behaviors
 */

module.exports = async (nm, api) => {
    // Load icon for behaviors
    const behaviorIcon = await nm.loadAsset(__dirname + '/../assets/behavior-icon.png');
    
    // Register craftengine_behavior module (single behavior for items)
    nm.postEditorModule({
        name: 'craftengine_behavior',
        display: 'CraftEngine Behavior',
        plugins: ['craftengine'],
        compatibility: ['item', 'block', 'furniture'],
        description: 'CraftEngine item behavior configuration (block_item, furniture_item, etc.)',
        icon: behaviorIcon,
        type: 'text',
        default: '',
        component: 'BehaviorBuilderButton'
    });
    
    // Register craftengine_behaviors module (multiple behaviors for blocks)
    nm.postEditorModule({
        name: 'craftengine_behaviors',
        display: 'CraftEngine Behaviors',
        plugins: ['craftengine'],
        compatibility: ['block'],
        description: 'CraftEngine block behaviors array (composite behaviors)',
        icon: behaviorIcon,
        type: 'text',
        default: '',
        component: 'BehaviorBuilderButton'
    });
    
    console.log('[CraftEngine] Registered behavior modules');
};
