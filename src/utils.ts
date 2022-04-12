import _ from "lodash"

export const logger = {
    info(msg: unknown, ...optParams: unknown[]): void {
        console.log(`%c[ac-reader]`, 'color: #0E90D2;', msg, ...optParams)
    },
    warn(msg: unknown, ...optParams: unknown[]): void {
        console.warn(`%c[ac-reader]`, 'color: #EE6363;', msg, ...optParams)
    },
    error(msg: unknown, ...optParams: unknown[]): void {
        console.error(`%c[ac-reader]`, 'color: #FF0000;', msg, ...optParams)
        throw Error(optParams.join(' '))
    }
}

export function addCDNMod(path: string, imports: string, things: string) {
    try {
        new URL(path)
        $(document.body).append(`<script type="module" src=${path}></script>`)
        $(document.body).append(`<script type="module">import ${imports} from "${path}";${things ?? ''}</script>`)
        logger.info('Added CDN module', path)
    } catch (msg) {
        logger.error('URL error', msg)
    }
}

const u2l = {
    '~': '`',
    '!': '1',
    '@': '2',
    '#': '3',
    '$': '4',
    '%': '5',
    '^': '6',
    '&': '7',
    '*': '8',
    '(': '9',
    ')': '0',
    '{': '[',
    '}': ']',
    '|': '\\',
    ':': ';',
    '"': "'",
    '<': ',',
    '>': '.',
    '?': '/',
}

function upper2lower(char: string): string {
    const c = _(char).chain().trim().value()
    return u2l[c] ?? c
}

// let keys = new Map()
export const keys = new Set<{ ctrl: string, mid: string, char: string, handle: () => void }>()

export function regKey(key: string, handle: () => void): boolean {
    // keys.set(key, handle)
    const keyt = key.split('+')
    if (keyt.length < 2) {
        logger.info('Please pass "Ctrl/Alt/Shift + charKey" or lower cases')
        return false
    }
    const ctrl = _(keyt).chain().first().trim().toLower().value()
    const char = upper2lower(_(keyt).chain().last().toLower().value())
    const mid = (keyt.length > 2) ? keyt[1] : ''
    keys.add({ ctrl, mid, char, handle })
    const k = ctrl + (_.isEmpty(mid) ? '' : (' + ' + mid)) + ' + ' + char
    logger.info(`Regestered key "${k}", handle "${handle}"`)
    return true
}

