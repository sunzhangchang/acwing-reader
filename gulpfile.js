// @ts-check
import parser from 'minimist'
import log from 'fancy-log'
import PluginError from 'plugin-error'
import { existsSync, writeFileSync, readdirSync, mkdirSync, cpSync, rmSync, readFileSync } from 'fs'
import { join, parse } from 'path'
import _ from 'lodash'
import { buildSync } from 'esbuild'

/**
 * @param { any } cb
 */
export function build(cb) {
    log('args:', process.argv.slice(3))

    const tmpd = '_tmp', argv = parser(process.argv.slice(3)), minify = argv.m ?? (!argv.b)

    log('minify?', minify)

    ; (([path, val]) => {
        if (!existsSync(path)) {
            writeFileSync(path, val)
        }
    })(['./src/res/update.log', ''])

    writeFileSync(
        './src/allMods.js',
        readdirSync('./src/mods')
            .map(s => `import './mods/${s}'`)
            .join('\n')
    )

    /**
     * @type { Record<string, string> }
     */
    let tmpCss = {}, trks = []
    /**
     * @param { string } dir
     */
    function chk(dir) {
        return readdirSync(dir, {
            encoding: 'utf8', withFileTypes: true
        }).forEach(path => {
            let d = join(dir, path.name)
            if (path.isDirectory()) {
                mkdirSync(join(tmpd, d))
                return chk(d)
            }
            let ext = parse(path.name).ext
            if (_.isEqual(ext, '.css')) {
                tmpCss[d.replace('/\.[^\.]*$/', '')] = d
            } else {
                cpSync(d, join(tmpd, d))
            }
            if (_.includes(['.css', 'html'], ext)) {
                trks.push(join(tmpd, d))
            }
        })
    }
    if (existsSync(tmpd)) {
        rmSync(tmpd, {
            recursive: true,
            force: true
        })
    }
    mkdirSync(tmpd)
    chk('src')

    log('css outdir ', tmpd)

    for (const key in tmpCss) {
        if (Object.hasOwnProperty.call(tmpCss, key)) {
            const e = tmpCss[key]
            log(`Building ${key} ${e}`)
        }
    }

    buildSync({
        entryPoints: tmpCss,
        outdir: tmpd,
        minify,
    })

    trks.forEach(
        t => writeFileSync(
            t,
            readFileSync(t, {
                encoding: 'utf8'
            }).replace(/\n( {4})*/g, '')
        )
    )

    let t = join(tmpd, './src/main.js')
    let out = join(argv.d ?? 'build', argv.o ?? 'acwing-reader.user.js')

    log('outdir ', out)
    log(`Building `, t)

    buildSync({
        entryPoints: [t],
        outfile: out,
        banner: {
            js: readFileSync('./src/res/tm-headers.js', 'utf8')
                .replace('CUR_VER', process.env.npm_package_version) + '\n;',
        },
        loader: {
            '.css': 'text'
        },
        bundle: true,
        charset: 'utf8',
        minify
    })
    rmSync(tmpd, {
        recursive: true,
        force: true,
    })
    log(`Build ${parse(out).base} successfully.`)
    cb()
}
