export const logger = {
    log(f, ...s) {
        console.log(`%c[ac-reader]`, 'color: #0E90D2;', f, ...s)
    },
    warn(f, ...s) {
        console.warn(`%c[ac-reader]`, 'color: #EE6363;', f, ...s)
    },
    error(f, ...s) {
        console.error(`%c[ac-reader]`, 'color: #FF0000;', f, ...s)
        throw Error(s.join(' '))
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

/**
 * upperKey to lowerKey
 * @param { string } char 
 * @returns { string }
 */
function upper2lower(char) {
    let c = _(char).chain().trim().value()
    return u2l[c] ?? c
}

// let keys = new Map()
/**
 * @type { {ctrl: string, mid: string, char: string, handle: () => {} }[] }
 */
let keys = []

/**
 * @param { string } key 
 * @param { () => {} } handle 
 * @returns { boolean }
 */
export function regKey(key, handle) {
    // keys.set(key, handle)
    let keyt = key.split('+')
    if (keyt < 2) {
        logger.log('Please pass "Ctrl/Alt/Shift + charKey" or lower cases')
        return false
    }
    let ctrl = _(keyt).chain().first().trim().toLower().value()
    let char = upper2lower(_(keyt).chain().last().toLower().value())
    let mid = (keyt.length > 2) ? keyt[1] : ''
    keys.push({ctrl, mid, char, handle})
    let k = ctrl + (_.isEmpty(mid) ? '' : (' + ' + mid)) + ' + ' + char
    logger.log(`Regestered key "${k}", handle "${handle}"`)
    return true
}

/**
 * @param { string } c 
 * @returns { boolean }
 */
function isCtl(c, e) {
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

export function setKey() {
    logger.warn('here')
    $(document).on('keydown', (e) => {
        // logger.log(e.altKey, e.ctrlKey, e.shiftKey, e.key)
        for (const { ctrl, mid, char, handle } of keys) {
            let key = ctrl + (_.isEmpty(mid) ? '' : (' + ' + mid)) + ' + ' + char
            let isC = isCtl(ctrl, e)
            let isE = _.isEmpty(mid) ? true : isCtl(mid, e)
            // logger.log(isC, isE, _.isEqual(e.key, char))
            if (isC) {
                if (isE) {
                    if (_.isEqual(e.key, char)) {
                        logger.log(`Press key "${key}", handle "${handle}"`)
                        handle()
                    }
                }
            }
        }
    })
}

/**
 * add a remote module from CDN via <script type="module"></script>
 * @param { string } path 
 * @param { string } imports 
 * @param { string } things 
 */
export function addCDNMod(path, imports, things) {
    try {
        new URL(path)
        $(document.body).append(`<script type="module" src=${path}></script>`)
        $(document.body).append(`<script type="module">import ${imports} from "${path}";${things ?? ''}</script>`)
        logger.log('Added CDN module', path)
    } catch (msg) {
        logger.error('URL error', msg)
    }
}
