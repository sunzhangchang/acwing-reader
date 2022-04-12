import _ from "lodash"
import { logger } from './utils'
import { ModuleManager } from './module'
import { categoryMan } from './category';

const storage = {}

export function setStorage(name: string, data: unknown) {
    storage[name] = data
}

export function getStorage(name: string) {
    return storage[name]
}

class Core {
    modMan: ModuleManager

    constructor(mod?: ModuleManager) {
        this.modMan = mod ?? new ModuleManager()
    }

    runMod(name: string, isPreload: boolean, mod?: Mod): boolean {
        let rmod: Mod
        if (_.isUndefined(mod)) {
            const tmod = this.modMan.get(name)
            if (_.isUndefined(tmod)) {
                logger.error(`Running module failed: ${name}`)
            } else {
                rmod = tmod
            }
        } else {
            rmod = mod
        }

        if (rmod?.style) {
            GM_addStyle(rmod.style)
        }

        try {
            if (isPreload) {
                if (!_.isUndefined(rmod.preload)) {
                    logger.info(`Preloading mod: ${_.isEmpty(name) ? 'anonymous' : name}`, rmod)
                    return mod.preload(getStorage(categoryMan.getAlias(rmod.category, name)))
                } else {
                    logger.warn(`Preloading module ${name} but therre is nothing to preload!`)
                    return true
                }
            } else {
                if (!_.isUndefined(rmod.run)) {
                    logger.info(`Running mod: ${_.isEmpty(name) ? 'anonymous' : name}`, rmod)
                    return rmod.run(getStorage(categoryMan.getAlias(rmod.category, name)))
                } else {
                    return true
                }
            }
        } catch (err) {
            logger.warn(err)
        }
        return true
    }

    preload() {
        for (const [name, mod] of this.modMan.mods.entries()) {
            // mod.on = getStorage(categoryMan.getAlias(mod.category, name))?.on
            if (!_.isUndefined(mod.preload)) {
                const res = this.runMod(name, true, mod)
                if (!res) {
                    break
                }
            }
        }
    }

    runMods() {
        for (const [name, mod] of this.modMan.mods.entries()) {
            // mod.on = getStorage(categoryMan.getAlias(mod.category, name))?.on
            const res = this.runMod(name, false, mod)
            if (!res) {
                break
            }
        }
    }
}

export const core = new Core()
