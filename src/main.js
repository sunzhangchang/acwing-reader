import { logger, regKey, setKey } from "./utils"
import { decode } from 'iconv-lite'
import { Book } from "./Book"
// import alertify from 'alertifyjs'

$(() => {
    'use strict'

    logger.log('Launching')
    $(document.head).append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/alertify.min.css">')
    $(document.head).append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/themes/default.min.css">')
    alertify.defaults.glossary.title = 'AcWing 任务栏小说阅读器'
    alertify.defaults.glossary.ok = '确定'
    alertify.defaults.glossary.cancel = '取消'

    window.Buffer = window.Buffer || require("buffer").Buffer;
    
    let taskBtn = $("#acwing_body > div.panel.panel-default.fs-gui-taskbar > div > div.fs-gui-taskbar-right > div.fs-gui-taskbar-task-list.ui-sortable")
    let novelBar = $(`<a type="button" class="btn btn-default pull-right fs-gui-taskbar-task-list-item ui-draggable">${'' ?? '点击打开小说'}</a>`)
    novelBar.css({
        'background-color': '#8a8a8a',
        'border': 'none',
        'box-shadow': 'none',
        'width': 'auto',
        'min-width': '200px',
        "position": "relative",
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
            let novelbuf = Buffer.from(reader.result)
            let {encoding, confidence} = jschardet.detect(novelbuf)
            setText(`正在转换编码... ${encoding} 编码正确率: ${confidence}`)
            logger.log(`正在转换编码... ${encoding} 编码正确率: ${confidence}`)
            let novel = decode(novelbuf, encoding)
            // let novel = novelbuf.toString(encoding.encoding)
            novel = _(novel)
                .chain()
                .trim()
                .replace(/[\r]+/g, '')
                .replace(/[\t　 ]+/g, ' ')
                .replace(/[\n]+/g, ' ')
                .value()

            book.name = file.name
            book.text = novel
            book.totPage = Math.ceil(_.size(novel) / pageSize)
            book.curPage = 1
            book.source = '本地'
            book.isBoss = true
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
    regKey('alt + ;', () => {
        alertify.prompt(`请输入小说名称: ${GM_listValues()}`, '', (e, str) => {
            if (e) {
                logger.log('---', e, str)
                alertify.success("Success notification");
                let t = GM_getValue(str)
                if (t) {
                    book.curPage = t.curPage
                    book.isBoss = true
                    book.name = t.name
                    book.source = t.source
                    book.text = t.text
                    book.totPage = t.totPage
                    setText('选择成功, 按 Alt + / 开始阅读')
                }
            }
        })
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