type JQueryStyle = JQuery.PlainObject<string | number | ((this: HTMLElement, index: number, value: string) => string | number | void)>
type NormalStyle = string | Record<string, string | number>
type Style = string | Record<string, string | number | Record<string, string | number>>

type fun = (style?: Style, run?: (ele: JQuery<HTMLElement>) => void) => void

declare interface ThemeAPI {
    root: fun
    taskbar: {
        taskbar: fun
        item: fun
        // itemHover: fun
        itemFocus: fun
        itemImg: fun
        homeMenu: fun
        context: fun
        searchBar: fun
        clock: fun
    }
    done(): true
}

declare function theme(theme: ThemeAPI): boolean
