export const logger = {
    info(msg: unknown, ...optParams: unknown[]): void {
        console.log(`%c[ac-reader]`, 'color: #0E90D2;', msg, ...optParams)
    },
    warn(msg: unknown, ...optParams: unknown[]): void {
        console.warn(`%c[ac-reader]`, 'color: #EE6363;', msg, ...optParams)
    },
    error(msg: unknown, ...optParams: unknown[]): void {
        console.error(`%c[ac-reader]`, 'color: #FF0000;', msg, ...optParams)
        throw Error(optParams.join(' '))
    }
}

export function addCDNMod(path: string, imports: string, things: string) {
    try {
        new URL(path)
        $(document.body).append(`<script type="module" src=${path}></script>`)
        $(document.body).append(`<script type="module">import ${imports} from "${path}";${things ?? ''}</script>`)
        logger.info('Added CDN module', path)
    } catch (msg) {
        logger.error('URL error', msg)
    }
}
