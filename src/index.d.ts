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
    data: Object,
    style: string,
    category: string,
    run: (sto: any) => boolean,
    on?: any,
    willrun?: any,
}
