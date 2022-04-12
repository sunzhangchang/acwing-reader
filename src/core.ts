import _ from "lodash"
import { logger } from './utils';
import { CategoryManager } from './category';
import { ModuleManager } from './module';

let storage

export function setStorage(name: string, data: unknown) {
    storage[name] = data
}

export function getStorage(name: string) {
    return storage[name]
}

class Core {
    modProvider: ModuleManager
    categoryProvider: CategoryManager

    constructor(mod?: ModuleManager, category?: CategoryManager) {
        this.modProvider = mod ?? new ModuleManager()
        this.categoryProvider = category ?? new CategoryManager()
    }


    runMod(nameOrMod: string | Mod): boolean {
        let mod: Mod
        let name = ''
        if (_.isString(nameOrMod)) {
            name = nameOrMod
            const tmod = this.modProvider.get(name)
            if (_.isUndefined(tmod)) {
                logger.error(`Running mod failed: ${name}`)
            } else {
                mod = tmod
            }
        } else {
            name = ''
            mod = nameOrMod
        }

        if (_.isEmpty(mod.style)) {
            GM_addStyle(mod.style)
        }

        logger.info(`Running mod: ${_.isEmpty(name) ? 'anonymous' : name}`)

        try {
            return mod.run(getStorage(this.categoryProvider.alias(mod.category) + name))
        } catch (err) {
            logger.warn(err)
        }
    }

    runMods() {
        for (const [name, mod] of this.modProvider.mods.entries()) {
            mod.on = getStorage(this.categoryProvider.alias(mod.category) + name).on
            if (mod.willrun) {
                if (!this.runMod(mod)) {
                    break
                }
            }
        }
        return
    }
}

const core = new Core()

export default core
