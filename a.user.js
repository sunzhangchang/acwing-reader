// ==UserScript==
// @name         AcWingOS 任务栏小说阅读器
// @namespace    https://bbs.tampermonkey.net.cn/
// @icon         https://img.imgdb.cn/item/608a4ccdd1a9ae528f5221f2.png
// @icon64       https://img.imgdb.cn/item/608a4ccdd1a9ae528f5221f2.png
// @version      0.1.0
// @description  AcWingOS 任务栏小说阅读器, 使用方法: alt + \ 从本地上传书籍; alt + / 开始阅读或老板键; alt + , 上一页; alt + . 下一页; alt + ; 从 localStorage 中选择书籍
// @author       Cyanogenaq
// @match        *.acwing.com/*
// @require      https://lib.baomitu.com/lodash.js/4.17.21/lodash.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        unsafeWindow
// ==/UserScript==

// @require      https://cdn.acwing.com/static/jquery/js/jquery-3.3.1.min.js
// @ts-check
/** @typedef { '本地' } Source */

; (() => {
    'use strict'
    $(() => {
        let taskBtn = $("#acwing_body > div.panel.panel-default.fs-gui-taskbar > div > div.fs-gui-taskbar-right > div.fs-gui-taskbar-task-list.ui-sortable")
        let novelBar = $(`<a type="button" class="btn btn-default pull-right fs-gui-taskbar-task-list-item ui-draggable">${'' ?? '点击打开小说'}</a>`)
        novelBar.css({
            'background-color': '#8a8a8a',
            'border': 'none',
            'box-shadow': 'none',
            'width': 'auto',
            "position": "relative",
        })
        let uploadBtn = $(`<input id="novel" type="file" accept="text/plain" />`)
        uploadBtn.css({
            "position": "absolute",
            "overflow": "hidden",
            "right": "0px",
            "top": "0px",
            "opacity": "0",
        })

        const pageSize = 15

        class Book {
            /** @type { string } */
            name = ''

            /** @type { string } */
            text = ''

            /** @type { number } */
            totPage = 0

            /** @type { number } */
            curPage = 0

            /** @type { Source } */
            source = '本地'

            /**
             * @type { boolean }
            */
            isBoss = true

            /**
             * @param { number | undefined } jumpPage
             * @returns { number}
            */
            getPage(jumpPage) {
                let page = jumpPage ?? this.curPage
                if (page < 0) {
                    page = 0
                }
                if (page > this.totPage) {
                    page = this.totPage + 1
                }
                this.curPage = page
                return page
            }

            /**
             * @param { number | undefined } page
             * @returns { number }
            */
            setPage(page) {
                this.curPage = this.getPage(page)
                return this.curPage
            }

            /**
             * @returns { [number, number] }
             */
            getStartEnd() {
                let ed = this.curPage * pageSize
                return [ed - pageSize, ed]
            }

            /**
             * @param { number | undefined } page 
             * @returns { string }
             */
            getPageText(page) {
                let toPage = this.getPage(page)
                this.setPage(toPage)

                if (page <= 0) {
                    return '您阅读到第一页了!'
                }

                if (page > this.totPage) {
                    return '您阅读到最后一页了!'
                }

                let [st, ed] = this.getStartEnd()
                return `${this.text.substring(st, ed)}   ${toPage}/${this.totPage}`
            }
        }

        /** @type { Book } */
        let book = new Book()

        /**
         * @returns { void }
         */
        function uploadBook() {
            let file = uploadBtn.first().prop('files')[0]
            let reader = new FileReader()
            reader.readAsText(file)
            reader.onload = () => {
                let novelBuf = reader.result
                let novel = _.toString(novelBuf)
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

        novelBar.append(uploadBtn)
        taskBtn.append(novelBar)

        // uploadBtn = $('#novel')

        /**
         * @param { string } text
         * @returns { void }
         */
        function setText(text) {
            novelBar.html(text)
            uploadBtn.on('change', () => uploadBook())
            novelBar.append(uploadBtn)
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

        $(document).on('keydown', (e) => {
            if (e.altKey) {
                switch (e.key) {
                    case '\\': {
                        uploadBtn.trigger('click')
                        break
                    }

                    case ';': {
                        let name = prompt('请输入小说名称', '')
                        let t = GM_getValue(name)
                        if (t) {
                            book.curPage = t.curPage
                            book.isBoss = true
                            book.name = t.name
                            book.source = t.source
                            book.text = t.text
                            book.totPage = t.totPage
                            setText('选择成功, 按 Alt + / 开始阅读')
                        }
                        break
                    }

                    case ',': {
                        showAndSetNovel(book.curPage - 1)
                        GM_setValue(book.name, book)
                        break
                    }

                    case '.': {
                        showAndSetNovel(book.curPage + 1)
                        GM_setValue(book.name, book)
                        break
                    }

                    case '/': {
                        bossKey()
                        break
                    }

                    default: {
                        break
                    }
                }
            }
        })
    })
})()