import _ from "lodash"
import { logger } from './utils';

class CategoryProvider {
    category: []

    constructor(category) {
        ;
    }
}

class ModuleProvider {
    mods = new Map<string, Mod>()
    data = {}

    regMod(name: string, mod: Mod): void {
        _(mod.path).forEach((p, i) => {
            if (!_(p).endsWith('$')) {
                mod.path[i] += '$'
            }
        })

        this.data[name] = {
            type: 'Object',
            data: mod.data ?? {}
        }
        if (!('on' in this.data[name].data)) {
            this.data[name].data.on = {
                type: 'boolean',
                default_: true,
            }
        }

        this.mods.set(name, {
            info: mod.info.replaceAll(/ /g, '_'),
            ...mod
        })
    }

    get(name: string): Mod | undefined {
        return this.mods.get(name) ?? undefined // ? Why
    }
}

class Core {
    modProvider: ModuleProvider
    categoryProvider: CategoryProvider

    constructor(mod?: ModuleProvider, category?: CategoryProvider) {
        this.modProvider = mod ?? new ModuleProvider()
        this.categoryProvider = category ?? new CategoryProvider()
    }

    runMod(nameOrMod: string | Mod) {
        let mod: Mod
        let name = 'anonymous'
        if (_.isString(nameOrMod)) {
            name = nameOrMod
            const tmod = this.modProvider.get(name)
            if (_.isUndefined(tmod)) {
                logger.error(`Running mod failed: ${name}`)
            } else {
                mod = tmod
            }
        } else {
            name = 'anonymous'
            mod = nameOrMod
        }

        if (_.isEmpty(mod.style)) {
            GM_addStyle(mod.style)
        }

        logger.info(`Running mod: ${name}`)

        try {
            return mod.run(sto[this.categoryProvider.get()])
        } catch (err) {
            logger.warn(err)
        }
    }

    runMods() {
        return
    }
}

const core = new Core()

export default core
