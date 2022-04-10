import { logger } from "../utils"

export class Book {
    name: string = ''
    text: string = ''
    totPage: number = 0
    curPage: number = 0
    pageSize: number = 15
    source: Source = '本地'
    isBoss: boolean = true

    constructor(name?: string, text?: string, pageSize?: number, curPage?: number, source?: Source) {
        this.name = name ?? ''
        this.text = text ?? ''
        this.pageSize = pageSize ?? 15
        this.source = source ?? '本地'
        this.isBoss = true
        this.curPage = curPage ?? 0
        this.totPage = Math.ceil(this.text.length / this.pageSize)
        // logger.log(this)
    }

    getPage(jumpPage?: number): number {
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

    setPage(page?: number): number {
        this.curPage = this.getPage(page)
        return this.curPage
    }

    getStartEnd(page?: number): [number, number] {
        let p = page ?? this.curPage
        let ed = p * this.pageSize
        return [ed - this.pageSize, ed]
    }

    getPageText(page?: number): string {
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
