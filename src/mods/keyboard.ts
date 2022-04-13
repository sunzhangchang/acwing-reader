import _ from "lodash"
import { core } from "../core"
import { keys, logger } from "../utils"

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

const run = (): boolean => {
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
    return true
}

core.modMan.regMod('keyboard', {
    info: '键盘事件 (快捷方式)',
    path: ['www.acwing.com/*'],
    run,
    category: 'module',
})
