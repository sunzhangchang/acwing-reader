type Source = |
    '本地'

type Mod = {
    info: string,
    path: string[],
    data: Object,
    style: string,
    run: (sto: any) => boolean | void,
}
