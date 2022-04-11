import { logger } from "../utils"
import { Book } from "../com/Book"
import { regKey } from "./setKey"
import { Combobox } from "@fluentui/web-components"
import _ from "lodash"

let taskBtn = $("#acwing_body > div.panel.panel-default.fs-gui-taskbar > div > div.fs-gui-taskbar-right > div.fs-gui-taskbar-task-list.ui-sortable")
let novelBar = $(`<a id="novelBar" type="button" class="btn btn-default pull-right fs-gui-taskbar-task-list-item ui-draggable">${'' ?? '点击打开小说'}</a>`)
novelBar.css({
    'background-color': '#8a8a8a',
    'border': 'none',
    'box-shadow': 'none',
    'width': 'auto',
    'min-width': '200px',
    "position": "relative",
})

let uploadBtn = $(`<input id="uploadNovel" type="file" accept="text/plain" />`)

let book = new Book()

function uploadBook(): void {
    let file = uploadBtn.first().prop('files')[0]
    let reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = () => {
        setText('正在检查编码...')
        logger.info('正在检查编码...')
        //@ts-ignore
        let novelbuf = Buffer.from(reader.result)
        //@ts-ignore
        let { encoding, confidence } = jschardet.detect(novelbuf)
        setText(`正在转换编码... ${encoding} 编码正确率: ${confidence}`)
        logger.info(`正在转换编码... ${encoding} 编码正确率: ${confidence}`)
        //@ts-ignore
        let novel = decode(novelbuf, encoding)
        // let novel = novelbuf.toString(encoding.encoding)
        novel = _(novel)
            .chain()
            .trim()
            .replace(/[\r]+/g, '')
            .replace(/[\t　 ]+/g, ' ')
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

let dialog = $(`<fluent-dialog id="dialog_" trap-focus modal></fluent-dialog>`)
let showNovelList = $(`<div style="margin: 20px;"></div>`)
showNovelList.append(`<h2>选择一本小说</h2>`)

let combobox = $(`<fluent-combobox id="combo_" placeholder="选择一本小说"></fluent-combobox>`)
showNovelList.append(combobox)

let dialogCancel = $(`<fluent-button id="dialogCancel" appearance="accent" tabindex="0">取消</fluent-button>`)
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

let dialogAccept = $(`<fluent-button id="dialogAccept" appearance="accent" tabindex="0">确定</fluent-button>`)
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

    let cs = ($('#combo_')[0] as Combobox).currentValue
    logger.info(cs)
    let t: Book = GM_getValue(cs)
    logger.info(t)

    book = new Book(t.name, t.text, t.pageSize, t.curPage, t.source)
    setText('选择成功, 按 Alt + / 开始阅读')
})

regKey('alt + ;', () => {
    let newCombobox = $(`<fluent-combobox id="combo_" placeholder="选择一本小说"></fluent-combobox>`)

    let bookList = GM_listValues()
    console.log(bookList)

    logger.info(newCombobox.first())
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
