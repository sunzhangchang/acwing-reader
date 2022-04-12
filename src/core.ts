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

    runMod(nameOrMod: string | Mod): boolean {
        logger.warn(nameOrMod)
        let mod: Mod
        let name = ''
        if (_.isString(nameOrMod)) {
            name = nameOrMod
            const tmod = this.modMan.get(name)
            if (_.isUndefined(tmod)) {
                logger.error(`Running mod failed: ${name}`)
            } else {
                mod = tmod
            }
        } else {
            name = ''
            mod = nameOrMod
        }

        if (mod?.style) {
            GM_addStyle(mod.style)
        }

        logger.info(`Running mod: ${_.isEmpty(name) ? 'anonymous' : name}`)

        try {
            return mod.run(getStorage(categoryMan.getAlias(mod.category, name)))
        } catch (err) {
            logger.warn(err)
        }
    }

    runMods() {
        for (const [name, mod] of this.modMan.mods.entries()) {
            logger.warn(name, mod)
            mod.on = getStorage(categoryMan.getAlias(mod.category, name))?.on
            // if (mod?.willrun) {
            if (!this.runMod(mod)) {
                break
            }
            // }
        }
        return
    }
}

export const core = new Core()
