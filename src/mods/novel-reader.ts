import { logger, regKey } from "../utils"
import { Book } from "../com/Book"
import { Combobox } from "@fluentui/web-components"
import _ from "lodash"
import { core } from '../core';

const run = (): boolean => {
    const taskBtn = $("#acwing_body > div.panel.panel-default.fs-gui-taskbar > div > div.fs-gui-taskbar-right > div.fs-gui-taskbar-task-list.ui-sortable")
    const novelBar = $(`<button id="novelBar" type="button" class="btn btn-default pull-right fs-gui-taskbar-task-list-item ui-draggable">${'' ?? '点击打开小说'}</button>`)
    novelBar.css({
        // 'background-color': '#8a8a8a',
        'border': 'none',
        'box-shadow': 'none',
        'width': 'auto',
        'min-width': '200px',
        "position": "relative",
    })
    novelBar.hide()

    const uploadBtn = $(`<input id="uploadNovel" type="file" accept="text/plain" />`)

    let book = new Book()

    function uploadBook(): void {
        const file = uploadBtn.first().prop('files')[0]
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = () => {
            setText('正在检查编码...')
            logger.info('正在检查编码...')
            const novelbuf = Buffer.from(reader.result as ArrayBuffer)
            const { encoding, confidence } = jschardet.detect(novelbuf)
            setText(`正在转换编码... ${encoding} 编码正确率: ${confidence}`)
            logger.info(`正在转换编码... ${encoding} 编码正确率: ${confidence}`)
            let novel = decode(novelbuf, encoding)
            // let novel = novelbuf.toString(encoding.encoding)
            novel = _(novel)
                .chain()
                .trim()
                .replace(/[\r]+/g, '')
                .replace(/[\t\u3000 ]+/g, ' ')
                .replace(/[\n]+/g, ' ')
                .value()

            book = new Book(file.name, novel, 15, 1, '本地')
            setText('上传成功, 按 Alt + / 开始阅读')
            $('#novelBar').show()

            GM_setValue(book.name, book)
        }
    }

    uploadBtn.on('change', () => uploadBook())
    uploadBtn.attr('title', '点击打开小说')

    taskBtn.append(novelBar)

    function setText(text: string): void {
        $('#novelBar').html(text)
    }

    function showNovel(page?: number): void {
        book.isBoss = false;
        $('#novelBar').show()
        setText(book.getPageText(page))
    }

    function showAndSetNovel(page?: number): void {
        showNovel(page)
        book.setPage(page)
    }

    function bossKey(): void {
        if (!book.isBoss) {
            $('#novelBar').hide()
            book.isBoss = true
        } else if (book.isBoss || $('#novelBar').is(':hidden')) {
            $('#novelBar').show()
            showAndSetNovel(undefined)
        }
    }

    regKey('alt + \\', () => uploadBtn.trigger('click'))

    const dialog = $(`<fluent-dialog id="dialog_" trap-focus modal></fluent-dialog>`)
    const showNovelList = $(`<div style="margin: 20px;"></div>`)
    showNovelList.append(`<h2>选择一本小说</h2>`)

    const combobox = $(`<fluent-combobox id="combo_" placeholder="选择一本小说"></fluent-combobox>`)
    showNovelList.append(combobox)

    const dialogCancel = $(`<fluent-button id="dialogCancel" appearance="accent" tabindex="0">取消</fluent-button>`)
    dialogCancel.css({
        'width': '80px',
        'height': '50px',
        'top': '350px',
        'float': 'right',
        'padding': '4px',
    })
    dialogCancel.on('click', () => {
        dialog.hide()
    })
    showNovelList.append(dialogCancel)

    const dialogAccept = $(`<fluent-button id="dialogAccept" appearance="accent" tabindex="0">确定</fluent-button>`)
    dialogAccept.css({
        'width': '80px',
        'height': '50px',
        'top': '350px',
        'float': 'right',
        'padding': '4px',
    })
    showNovelList.append(dialogAccept)

    dialog.append(showNovelList)
    dialog.hide()
    $(document.body).append(dialog)

    dialogAccept.on('click', () => {
        dialog.hide()

        const cs = ($('#combo_')[0] as Combobox).currentValue
        logger.info(`Choosing book: ${cs}`)
        const t: Book = GM_getValue(cs)
        // logger.info(t)

        book = new Book(t.name, t.text, t.pageSize, t.curPage, t.source)
        setText('选择成功, 按 Alt + / 开始阅读')
    })

    regKey('alt + ;', () => {
        const newCombobox = $(`<fluent-combobox id="combo_" placeholder="选择一本小说"></fluent-combobox>`)

        const bookList = GM_listValues()
        logger.info('Book list:', bookList)

        // logger.info(newCombobox.first())

        _(bookList).forEach((e, i) => {
            newCombobox.append($(`<fluent-option value=${i}>${e}</fluent-option>`))
        })

        $('#combo_').replaceWith(newCombobox)

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

    return true
}

core.modMan.regMod('novel-reader', {
    info: '任务栏小说阅读',
    path: ['www.acwing.com/*'],
    run,
    category: 'module',
})
