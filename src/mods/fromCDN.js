import { addCDNMod, logger } from "../utils"

logger.log('Setting up CDN mods')
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
