import { addCDNMod, logger } from "../utils"
import { core } from '../core';

const preload = (): boolean => {
    logger.info('Setting up CDN mods')

    addCDNMod(
        'https://esm.run/iconv-lite',
        'iconv',
        `window.decode=iconv.decode;`
    )

    addCDNMod(
        'https://esm.run/safe-buffer',
        'safeBuffer',
        `window.Buffer=safeBuffer.Buffer`
    )

    addCDNMod(
        'https://cdn.jsdelivr.net/npm/@fluentui/web-components@2.3.1/dist/web-components.min.js',
        '{ provideFluentDesignSystem, fluentButton, fluentDialog }',
        `provideFluentDesignSystem().register(fluentButton(), fluentDialog())`
    )

    return true
}

core.modMan.regMod('fromCDN', {
    info: '从 CDN 加载模块',
    path: ['www.acwing.com/*'],
    category: 'module',
    preload,
})
