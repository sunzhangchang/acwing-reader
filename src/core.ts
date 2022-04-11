import _ from "lodash"
import { logger } from './utils';

class Core {
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

    run(name?: string, mod?: Mod) {
        if (!_.isUndefined(name)) {
            let rMod: Mod | undefined
            if (_.isUndefined(mod)) {
                rMod = this.mods.get(name) ?? undefined // ? Why
            } else {
                rMod = mod
            }
            if (_.isUndefined(rMod)) {
                logger.error(`Running mod failed: ${name}`)
            }
            if (_.isEmpty(mod.style)) {
                GM_addStyle(mod.style)
            }

            logger.info(`Running mod: ${name}`)

            try {
                return mod.run({})
            } catch (err) {
                logger.warn(err)
            }
        }
    }
}

const core = new Core()

export default core
