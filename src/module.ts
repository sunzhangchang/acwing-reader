import { categoryMan } from 'category'
import _ from 'lodash'

export class ModuleManager {
    mods = new Map<string, Mod>()
    /* eslint "@typescript-eslint/no-explicit-any": "off" */
    data: Record<string, any> = {}

    regMod(name: string, mod: Mod): void {
        _(mod.path).forEach((p, i) => {
            if (!_(p).endsWith('$')) {
                mod.path[i] += '$'
            }
        })

        const rawName = categoryMan.getAlias(mod.category, name)

        const tdata = {
            type: 'object',
            lvs: (mod.data ?? {}) as any,
        }

        if (!('on' in tdata.lvs)) {
            tdata.lvs.on = {
                type: 'boolean',
                default: true,
            }
        }

        this.data[rawName] = tdata

        this.mods.set(name, {
            info: mod.info.replaceAll(/ /g, '_'),
            ...mod
        })
    }

    get(name: string): Mod | undefined {
        return this.mods.get(name) ?? undefined // ? Why
    }
}
