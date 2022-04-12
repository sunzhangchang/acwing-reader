type Source = |
    '本地'

type Category = {
    desc: string,
    alia: string,
    icon: string,
    unclosable: boolean,
}

type Mod = {
    info: string,
    path: string[],
    data?: Object,
    style?: string,
    category: string,
    on?: any,
    willrun?: boolean,
    run?: (sto: any) => boolean,
    preload?: (sto: any) => boolean,
}
