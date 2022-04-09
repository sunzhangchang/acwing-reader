/**
 * @typedef { '本地' } Source
 */

export class Book {
    /** @type { string } */
    name = ''

    /** @type { string } */
    text = ''

    /** @type { number } */
    totPage = 0

    /** @type { number } */
    curPage = 0

    /** @type { number } */
    pageSize = 15

    /** @type { Source } */
    source = '本地'

    /**
     * @type { boolean }
    */
    isBoss = true

    /**
     *
     * @param { string } name
     * @param { string } text
     * @param { number } pageSize
     * @param { Source } source
     */
    constructor(name, text, pageSize, source) {
        this.name = name
        this.text = text
        this.pageSize = pageSize
        this.source = source
        this.isBoss = true
        this.curPage = 0
        this.totPage = Math.ceil(_.size(text) / this.pageSize)
    }

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
     * @param { number | undefined } page
     * @returns { [number, number] }
     */
    getStartEnd(page) {
        let p = page ?? this.curPage
        let ed = p * this.pageSize
        return [ed - this.pageSize, ed]
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