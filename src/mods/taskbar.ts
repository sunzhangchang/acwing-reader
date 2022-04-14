import _ from "lodash"
import { core } from "../core"
import { addStyle, logger } from "../utils"

function runC(class_: string, style?: Style, run?: (ele: JQuery<HTMLElement>) => void): void {
    if (!_.isUndefined(style)) {
        addStyle(class_, style)
    }
    const ele = $(class_)
    if (!_.isUndefined(run)) {
        run(ele)
    }

}

const themeAPI: ThemeAPI = {
    root(style?, run?) {
        runC('#acwing_body', style, run)
    },

    taskbar: {
        taskbar(style?, run?): void {
            runC('.fs-gui-taskbar', style, run)
        },

        item(style?, run?) {
            runC('.fs-gui-taskbar-task-list-item', style, run)
        },

        // itemHover(style?, run?) {
        //     const class_ = '.fs-gui-taskbar-task-list-item:hover'
        //     if (!_.isUndefined(style)) {
        //         GM_addStyle(`${class_}{${convertStyle2String(style)}}`)
        //     }
        //     const ele = $(class_);
        //     if (!_.isUndefined(run)) {
        //         run(ele)
        //     }
        // },

        itemFocus(style?, run?) {
            runC('.fs-gui-taskbar-task-list-item-focus', style, run)
        },

        itemImg(style?, run?) {
            runC('.fs-gui-taskbar-task-list-item-icon-img', style, run)
        },

        context(style?, run?): void {
            runC('.fs-gui-taskbar-task-list', style, run)
        },

        homeMenu(style?, run?) {
            runC('.fs-gui-taskbar-begin', style, run)
        },

        searchBar(style?, run?) {
            runC('.fs-gui-taskbar-search', style, run)
        },

        clock(style?, run?) {
            runC('.fs-gui-taskbar-widgets-clock', style, run)
        }
    },

    done() {
        return true
    }
}

//TODO win11 风格 (参考 Win11 in React)
/*
eslint {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off"
}
*/
const win11 = (): boolean => {
    themeAPI.root({
        '--dark-txt': '#000',
        '--alt-txt': '#fff',
        '--med-dark': '#111',
        '--txt-col': '#222',
        '--med-txt': '#3c3c3c',
        '--comp-txt': '#ddd',
        '--comp-clr': '#e6e6e6',
        '--gray-txt': '#555',
        '--sat-txt': '#777',
        '--clrPrm': '#0067c0',
        '--wintheme': '#eee',
    })

    addStyle('.btn-default', {
        'border': 'none',
    })

    themeAPI.taskbar.taskbar({
        '--bg1': 'hsla(0,0%,95%,.85)',
        '--bg2': 'hsla(0,0%,100%,.67)',
        '-webkit-backdrop-filter': 'saturate(3) blur(20px)',
        'backdrop-filter': 'saturate(3) blur(20px)',
        'background': 'var(--bg1)',
        'color': 'var(--dark-txt)',
        'bottom': '0',
        'height': '48px',
        'width': '100vw',
        'z-index': '10000',
        'border': 'none',
        'border-radius': '0',
        'display': 'flex',
        // 'flex-direction': 'row',
        'align-items': 'center',
    })

    themeAPI.taskbar.context({
        'display': 'flex',
        'flex-direction': 'row',
        'height': '100%',
        "background": 'none',
        // 'width': '100%',
        // 'align-items': 'center',
    })

    themeAPI.taskbar.item({
        // 'float': 'none',
        '-webkit-animation': 'popintro .8s ease-in-out',
        'animation': 'popintro .8s ease-in-out',
        'background': 'hsla(0,0%,100%,0)',
        // 'borderRadius': '0',
        'border-radius': '4px',
        'box-sizing': 'border-box',
        'height': '38px',
        'margin': 'auto 3px',
        'position': 'relative',
        '-webkit-transform-origin': 'center',
        'transform-origin': 'center',
        'width': '38px',
        // "border": "none",
        "box-shadow": "none",
        'display': 'grid',
        'place-items': 'center',
        // 'position': 'relative',
        ':hover': {
            'background': 'var(--bg2)',
            'transition': 'all 0.2s ease-in-out',
            'border': '0',
        },
        ':after': {
            'content': '',
            'position': 'absolute',
            'display': 'block',
            'bottom': '0',
            'width': '0px',
            'height': '3px',
            'border-radius': '4px',
            'background': '#858585',
            'transition': 'all 0.2s ease-in-out',
        }
    }, (ele) => {
        ele.animate({
            '0%': '{transform: scale(0);}',
            '40%': '{transform: scale(1.125);}',
            '70%': '{transform: scale(0.725);}',
            '100%': '{transform: scale(1);}',
        }, '.8s ease-in-out')
    })

    // themeAPI.taskbar.itemHover({
    //     'background': 'var(--bg2)',
    //     'transition': 'all 0.2s ease-in-out',
    //     'border': '0',
    // })

    themeAPI.taskbar.itemFocus({
        'background': 'var(--bg2)',
        'transition': 'all 0.2s ease-in-out',
        'border': '0',
    })

    themeAPI.taskbar.itemImg({
        '-webkit-transform-origin': 'center',
        'transform-origin': 'center',
        'transition': '.4s ease-in-out',
        "margin": '0',
    }, (ele) => {
        logger.warn(ele.siblings())
        ele.siblings('span').remove()
    })

    themeAPI.taskbar.homeMenu({
        '-webkit-animation': 'popintro .8s ease-in-out',
        'animation': 'popintro .8s ease-in-out',
        'background': 'hsla(0,0%,100%,0)',
        // 'borderRadius': '0',
        // "border": "0",
        'border-radius': '4px',
        'box-sizing': 'border-box',
        'height': '38px',
        'margin': 'auto 3px',
        'position': 'relative',
        '-webkit-transform-origin': 'center',
        'transform-origin': 'center',
        'width': '38px',
        "box-shadow": "none",
        'display': 'grid',
        'place-items': 'center',
    }, (ele) => {
        ele.animate({
            '0%': '{transform: scale(0);}',
            '40%': '{transform: scale(1.125);}',
            '70%': '{transform: scale(0.725);}',
            '100%': '{transform: scale(1);}',
        }, '.8s ease-in-out')
    })

    themeAPI.taskbar.searchBar({
        'border-radius': '0',
    }, (ele) => {
        ele.children('input').css({
            'border': 'none',
        })
        addStyle('#fs-gui-taskbar-search-field:hover', {
            'border': 'none',
        })
    })

    return themeAPI.done()
}

// win11 风格 的阉割版
const dftTheme = (): boolean => {
    themeAPI.root({
        '--dark-txt': '#000',
        '--alt-txt': '#fff',
        '--med-dark': '#111',
        '--txt-col': '#222',
        '--med-txt': '#3c3c3c',
        '--comp-txt': '#ddd',
        '--comp-clr': '#e6e6e6',
        '--gray-txt': '#555',
        '--sat-txt': '#777',
        '--clrPrm': '#0067c0',
        '--wintheme': '#eee',
    })

    addStyle('.btn-default', {
        'border': 'none',
    })

    themeAPI.taskbar.taskbar({
        // '--bg1': 'hsla(0,0%,95%,.85)',
        // '--bg2': 'hsla(0,0%,100%,.67)',
        '--bg1': 'hsla(0,0%,85%,.98)',
        '--bg2': 'hsla(0,0%,100%,.67)',
        'border': 'none',
        'border-radius': '0',
        'background': 'var(--bg1)',
        'color': 'var(--dark-txt)',
        // '-webkit-backdrop-filter': 'saturate(3) blur(20px)',
        // 'backdrop-filter': 'saturate(3) blur(20px)',
    })

    themeAPI.taskbar.homeMenu({
        'border': 'none',
        'background': 'var(--bg1)',
        'color': 'var(--dark-txt)',
        // ? 无用
        // '-menu': {
        //     '-webkit-backdrop-filter': 'none',
        //     'backdrop-filter': 'none',
        // }
        // '-menu': {
        //     '-webkit-backdrop-filter': 'unset',
        //     'backdrop-filter': 'unset',
        // }
        '-menu': {
            'border-radius': '0',
        }
    }, (ele) => {
        // // ? 替代方案 将整个元素移到外面
        // const e = ele.siblings('.fs-gui-taskbar-begin-menu')
        // e.remove()
        // $('.fs-gui-taskbar').before(e)
        // e.css({
        //     'border-radius': '0',
        // })
    })

    themeAPI.taskbar.searchBar({
        'border-radius': '0',
        ' input': {
            'border': 'none',
            'outline': 'none',
        },
        '-field:hover': {
            'border': 'none',
        },
        '-field:focus': {
            'border': 'none',
        },
    }/*, (ele) => {
        ele.children('input').css({
            'border': 'none',
        })
        addStyle('#fs-gui-taskbar-search-field:hover', {
            'border': 'none',
        })
    }*/)

    themeAPI.taskbar.context({
        'height': '100%',
        "background": 'none',
    })

    //TODO $('.fs-gui-taskbar-task-list-item').attr('data-active', 'false')

    themeAPI.taskbar.item({
        // 'float': 'none',
        '-webkit-animation': 'popintro .8s ease-in-out',
        'animation': 'popintro .8s ease-in-out',
        'background': 'hsla(0,0%,100%,0)',
        'border-radius': '0px',
        // 'box-sizing': 'border-box',
        'height': '100%',
        // 'margin': 'auto 3px',
        'position': 'relative',
        '-webkit-transform-origin': 'center',
        'transform-origin': 'center',
        // 'width': '38px',
        // "border": "none",
        "box-shadow": "none",
        // 'display': 'grid',
        // 'place-items': 'center',
        // 'position': 'relative',
        ':hover': {
            'background': 'var(--bg2)',
            'transition': 'all 0.2s ease-in-out',
        },
        ':after[data-active=true]': {
            'content': '',
            'position': 'absolute',
            'display': 'block',
            'bottom': '0',
            'width': '0px',
            'height': '3px',
            'border-radius': '4px',
            'background': '#858585',
            'transition': 'all 0.2s ease-in-out',
        }
    }, (ele) => {
        ele.animate({
            '0%': '{transform: scale(0);}',
            '40%': '{transform: scale(1.125);}',
            '70%': '{transform: scale(0.725);}',
            '100%': '{transform: scale(1);}',
        }, '.8s ease-in-out')
    })

    themeAPI.taskbar.itemFocus({
        'background': 'var(--bg2)',
        'transition': 'all 0.2s ease-in-out',
    })

    themeAPI.taskbar.clock({
        'color': 'black',
        'display': 'flex',
        'flex-direction': 'column',
        'font-size': '11px',
        'justify-content': 'center',
        'padding': '0 8px',
    })

    addStyle('.file-explorer-main-field-item-title', {
        'text-shadow': 'none',
    })

    return themeAPI.done()
}

core.modMan.regMod('taskbar', {
    info: '自定义主题',
    path: ['www.acwing.com/*'],
    run: () => {
        return theme ? theme(themeAPI) : dftTheme()
    },
    category: 'module',
})
