import { logger, regKey, setKey } from "./utils"
// import { decode } from 'iconv-lite'
import { Book } from "./Book"
import './allMods'
// import { provideFluentDesignSystem, fluentButton, fluentDialog } from "@fluentui/web-components"

$(() => {
    'use strict'
    logger.log('Launching')

    let taskBtn = $("#acwing_body > div.panel.panel-default.fs-gui-taskbar > div > div.fs-gui-taskbar-right > div.fs-gui-taskbar-task-list.ui-sortable")
    let novelBar = $(`<a type="button" class="btn btn-default pull-right fs-gui-taskbar-task-list-item ui-draggable">${'' ?? '点击打开小说'}</a>`)
    novelBar.css({
        'background-color': '#8a8a8a',
        'border':           'none',
        'box-shadow':       'none',
        'width':            'auto',
        'min-width':        '200px',
        "position":         "relative",
    })
    let uploadBtn = $(`<input id="novel" type="file" accept="text/plain" />`)

    /** @type { Book } */
    let book = new Book()

    /**
     * @returns { void }
     */
    function uploadBook() {
        let file = uploadBtn.first().prop('files')[0]
        let reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = () => {
            setText('正在检查编码...')
            logger.log('正在检查编码...')
            //@ts-ignore
            let novelbuf = unsafeWindow.Buffer.from(reader.result)
            let {encoding, confidence} = jschardet.detect(novelbuf)
            setText(`正在转换编码... ${encoding} 编码正确率: ${confidence}`)
            logger.log(`正在转换编码... ${encoding} 编码正确率: ${confidence}`)
            let novel = unsafeWindow.decode(novelbuf, encoding)
            // let novel = novelbuf.toString(encoding.encoding)
            novel = _(novel)
                .chain()
                .trim()
                .replace(/[\r]+/g, '')
                .replace(/[\t　 ]+/g, ' ')
                .replace(/[\n]+/g, ' ')
                .value()

            book = new Book(file.name, novel, 15, '本地')
            setText('上传成功, 按 Alt + / 开始阅读')

            GM_setValue(book.name, book)
        }
    }

    uploadBtn.on('change', () => uploadBook())
    uploadBtn.attr('title', '点击打开小说')

    taskBtn.append(novelBar)

    /**
     * @param { string } text
     * @returns { void }
     */
    function setText(text) {
        novelBar.html(text)
    }

    /**
     * @param { number | undefined } page
     * @returns { void }
     */
    function showNovel(page) {
        book.isBoss = false;
        novelBar.show()
        setText(book.getPageText(page))
    }

    /**
     * @param { number | undefined } page
     * @returns { void }
     */
    function showAndSetNovel(page) {
        showNovel(page)
        book.setPage(page)
    }

    /**
     * @returns { void }
     */
    function bossKey() {
        if (!book.isBoss) {
            novelBar.hide()
            book.isBoss = true
        } else if (book.isBoss || novelBar.is(':hidden')) {
            novelBar.show()
            showAndSetNovel(undefined)
        }
    }

    regKey('alt + \\', () => uploadBtn.trigger('click'))

    let dialog = $(`<fluent-dialog id="dialog_" trap-focus modal></fluent-dialog>`)
    let showNovelList = $(`<div style="margin: 20px;"></div>`)
    showNovelList.append(`<h2>选择一本小说</h2>`)
    let combobox = $(`<fluent-combobox id="combo_" placeholder="选择一本小说"></fluent-combobox>`)

    /** @type { { fluentOption }[] } */
    let bookList = GM_listValues()
    console.log(bookList)

    _(bookList).forEach((e, i) => {
        combobox.append($(`<fluent-option value=${i}>${e}</fluent-option>`))
    })

    showNovelList.append(combobox)

    let dialogCancel = $(`<fluent-button id="dialogCancel" appearance="accent" tabindex="0">取消</fluent-button>`)
    dialogCancel.css({
        'float': 'right'
    })
    dialogCancel.on('click', () => {
        dialog.hide()
    })
    showNovelList.append(dialogCancel)

    let dialogAccept = $(`<fluent-button id="dialogAccept" appearance="accent" tabindex="0">确定</fluent-button>`)
    dialogAccept.css({
        'float': 'right'
    })
    showNovelList.append(dialogAccept)


    dialog.append(showNovelList)
    dialog.hide()
    $(document.body).append(dialog)

    dialogAccept.on('click', () => {
        dialog.hide()

        let cs = combobox[0].currentValue
        logger.log(cs)
        /** @type { Book } */
        let t = GM_getValue(cs)
        logger.log(t)

        book = new Book(t.name, t.text, t.pageSize, t.source)
        setText('选择成功, 按 Alt + / 开始阅读')
    })

    regKey('alt + ;', () => {
        dialog.show()
    })
    regKey('alt + ,', () => {
        showAndSetNovel(book.curPage - 1)
        GM_setValue(book.name, book)
    })
    regKey('alt + .', () => {
        showAndSetNovel(book.curPage + 1)
        GM_setValue(book.name, book)
    })
    regKey('alt + /', () => {
        bossKey()
    })

    setKey()
})