// @ts-check
import parser from 'minimist'
import log, { error } from 'fancy-log'
import PluginError from 'plugin-error'
import { existsSync, writeFileSync, readdirSync, mkdirSync, cpSync, rmSync, readFileSync } from 'fs'
import { join, parse } from 'path'
import _ from 'lodash'
import { build } from 'esbuild'

/**
 * @param { any } cb
 */
export async function build_(cb) {
    log('args:', process.argv.slice(3))

    const tmpd = '_tmp'
    const argv = parser(process.argv.slice(3))
    const minify = argv.m ?? (!argv.b)
    const watch = !!argv.w

    log('minify?', minify);

    (([path, val]) => {
        if (!existsSync(path)) {
            writeFileSync(path, val)
        }
    })(['./src/res/update-log.txt', ''])

    writeFileSync(
        './src/allMods.ts',
        readdirSync('./src/mods')
            .filter(s => !s.endsWith('.d.ts'))
            .map(s => `import './mods/${s}'`)
            .join('\n')
    )

    if (existsSync('_tmp')) {
        rmSync('_tmp', {
            recursive: true,
            force: true,
        })
    }

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
            log('chk', d)
            let ext = parse(path.name).ext
            if (_.isEqual(ext, '.css')) {
                tmpCss[d.replace('/\.[^\.]*$/', '')] = d
            } else {
                let dest = join(tmpd, d)
                cpSync(d, dest)
                writeFileSync(dest,
                    readFileSync(d, 'utf8')
                        .replace(/import.+from ["']lodash["'](;?)/g, '')
                        .replace(/import.+from ["']@fluentui\/web-components["'](;?)/g, '')
                )
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

    const res = await build({
        entryPoints: tmpCss,
        outdir: tmpd,
        minify,
        watch,
    })

    if (res.errors.length > 0) {
        error(`Build unsuccessfully.`)
        throw new PluginError('esbuild', new Error())
    }

    trks.forEach(
        t => writeFileSync(
            t,
            readFileSync(t, {
                encoding: 'utf8'
            }).replace(/\n( {4})*/g, '')
        )
    )

    writeFileSync('_tmp/tsconfig.json', readFileSync('./tsconfig.json', 'utf-8').replace(/src/g, '_tmp/src'))
    let t = join(tmpd, './src/main.ts')
    let out = join(argv.d ?? 'build', argv.o ?? 'acwing-reader.user.js')

    log('out file ', out)
    log(`Building `, t)

    const ress = await build({
        entryPoints: [t],
        outfile: out,
        banner: {
            js: readFileSync('./src/res/tm-headers.ts', 'utf8')
                .replace('CUR_VER', process.env.npm_package_version) + '\n;',
        },
        tsconfig: '_tmp/tsconfig.json',
        loader: {
            '.css': 'text',
            '.png': 'dataurl',
        },
        target: 'es6',
        bundle: true,
        charset: 'utf8',
        minify,
        watch,
    })

    if (ress.errors.length > 0) {
        error(`Build ${parse(out).base} unsuccessfully.`)
        throw new PluginError('esbuild', new Error())
    }

    // rmSync(tmpd, {
    //     recursive: true,
    //     force: true,
    // })
    log(`Build ${parse(out).base} successfully.`)
    cb()
}
