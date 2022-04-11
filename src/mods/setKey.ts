import _ from "lodash"
import { logger } from "../utils"

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
const keys: { ctrl: string, mid: string, char: string, handle: () => void }[] = []

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
    keys.push({ ctrl, mid, char, handle })
    const k = ctrl + (_.isEmpty(mid) ? '' : (' + ' + mid)) + ' + ' + char
    logger.info(`Regestered key "${k}", handle "${handle}"`)
    return true
}

function isCtl(c: string, e: JQuery.KeyDownEvent): boolean {
    let is = true
    switch (c) {
    case 'ctrl': case 'control': {
        is = e.ctrlKey
        break
    }

    case 'alt': {
        is = e.altKey
        break
    }

    case 'shift': {
        is = e.shiftKey
        break
    }

    default: {
        is = true
        break
    }
    }
    return is
}

$(document).on('keydown', (e) => {
    // logger.info(e.altKey, e.ctrlKey, e.shiftKey, e.key)
    for (const { ctrl, mid, char, handle } of keys) {
        const key = ctrl + (_.isEmpty(mid) ? '' : (' + ' + mid)) + ' + ' + char
        const isC = isCtl(ctrl, e)
        const isE = _.isEmpty(mid) ? true : isCtl(mid, e)
        // logger.info(isC, isE, _.isEqual(e.key, char))
        if (isC) {
            if (isE) {
                if (_.isEqual(e.key, char)) {
                    logger.info(`Press key "${key}", handle "${handle}"`)
                    handle()
                }
            }
        }
    }
})
