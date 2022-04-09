const core = {
    mods: new Map(),
    data: {},

    /**
     * 
     * @param { string } name 
     * @param { * } info 
     * @param { Array<string> } path 
     * @param { * } dat 
     * @param { * } func 
     * @param { * } style 
     */
    reg(name, info, path, dat, func, style) {
        _(path).forEach((p, i) => {
            if (!_(p).endsWith('$')) {
                path[i] += '$'
            }
        })

        this.data[name] = {
            type: 'Object',
            data: dat ?? {}
        }
        if (!('on' in this.data[name].data)) {
            this.data[name].data.on = {
                type: 'boolean',
                default_: true,
            }
        }

        this.mods.set(name, {
            info: info.replaceAll(' ', '_'),
            path,
            func,
            style
        })
    }
}

export { core as default }
