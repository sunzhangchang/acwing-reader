import _ from "lodash"
import { logger } from './utils';

class CategoryProvider {

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
            info: mod.info.replaceAll(' ', '_'),
            ...mod
        })
    }

    get(name: string): Mod | null {
        return this.mods.get(name) ?? null
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
        let mod: Mod | undefined
        if (_.isString(nameOrMod)) {
            let name = nameOrMod
            mod = this.modProvider.get(name) ?? undefined // ? Why
        } else {
            mod = nameOrMod
        }

        if (_.isUndefined(mod)) {
            logger.error(`Running mod failed: ${mod.name}`)
        }
        if (_.isEmpty(mod.style)) {
            GM_addStyle(mod.style)
        }

        logger.info(`Running mod: ${name}`)

        try {
            return mod.run({ msto: sto[category] })
        } catch (err) {
            logger.warn(err)
        }
    }

    runMods() {
    }
}

const core = new Core()

export default core
