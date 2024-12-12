import { PluginFlags } from '@/types/pool-plugin-flags';

export function parsePluginConfig(pluginConfig: number): PluginFlags {
    const flags = {
        BEFORE_SWAP_FLAG: pluginConfig & (1 << 0) ? 1 : 0,
        AFTER_SWAP_FLAG: pluginConfig & (1 << 1) ? 1 : 0,
        BEFORE_POSITION_MODIFY_FLAG: pluginConfig & (1 << 2) ? 1 : 0,
        AFTER_POSITION_MODIFY_FLAG: pluginConfig & (1 << 3) ? 1 : 0,
        BEFORE_FLASH_FLAG: pluginConfig & (1 << 4) ? 1 : 0,
        AFTER_FLASH_FLAG: pluginConfig & (1 << 5) ? 1 : 0,
        AFTER_INIT_FLAG: pluginConfig & (1 << 6) ? 1 : 0,
        DYNAMIC_FEE_FLAG: pluginConfig & (1 << 7) ? 1 : 0,
    };

    return flags;
}
