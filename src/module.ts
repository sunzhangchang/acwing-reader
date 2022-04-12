import _ from 'lodash'

export class ModuleManager {
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
