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

const lower = 'abcdefghijklmnopqrstuvwxyz'
const upper = lower.toUpperCase()

export function isLowerCase(char: string) {
    if (char.length > 1) {
        return false
    } else {
        return lower.includes(char)
    }
}

export function isUpperCase(char: string) {
    if (char.length > 1) {
        return false
    } else {
        return upper.includes(char)
    }
}

export function toCssCase(str: string) {
    if (str.length === 0) {
        return str
    }
    if (str.startsWith('Webkit')) {
        logger.warn(str)
        str = str.replaceAll('Webkit', '-webkit')
    }
    let res = ''
    for (const iter of str) {
        if (isUpperCase(iter)) {
            res += `-`
        }
        res += iter.toLowerCase()
    }
    return res
}

export function convertNormalStyle2String(style: NormalStyle): string {
    let css = ''
    if (_.isString(style)) {
        css = style
    } else {
        for (const key in style) {
            if (Object.prototype.hasOwnProperty.call(style, key)) {
                const ele = style[key]
                css += `${toCssCase(key)}:${ele} !important;`
            }
        }
    }
    return css
}

export function convertStyle2NormalStyles(baseClass: string, style: Style): Record<string, NormalStyle> {
    const res: Record<string, NormalStyle> = {}
    if (_.isString(style)) {
        res[baseClass] = style
        return res
    } else {
        for (const key in style) {
            if (Object.prototype.hasOwnProperty.call(style, key)) {
                const ele = style[key]
                if (_.isNumber(ele) || _.isString(ele)) {
                    // const st = `${toCssCase(key)}:${ele} !important;`
                    const st = `${toCssCase(key)}:${ele};`
                    if (_.isUndefined(res[baseClass])) {
                        res[baseClass] = st
                    } else {
                        res[baseClass] += st
                    }
                } else {
                    res[`${baseClass}${key}`] = ele
                }
            }
        }
    }
    return res
}

export function convertStyle2String(baseClass: string, style: Style): string {
    let res = ''
    const tstyle = convertStyle2NormalStyles(baseClass, style)
    // logger.warn(tstyle)
    for (const key in tstyle) {
        if (Object.prototype.hasOwnProperty.call(tstyle, key)) {
            const ele = tstyle[key]
            res += `${key}{${convertNormalStyle2String(ele)}}`
        }
    }
    return res
}

export function addStyle(baseClass: string, style: Style) {
    const styleEle = $(`<style></style>`)
    const t = convertStyle2String(baseClass, style)
    // logger.warn(t)
    styleEle.text(t)
    $(document.body).append(styleEle)
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

