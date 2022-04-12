import { logger } from './utils'

export class CategoryManager {
    categories = new Map<string, Category>()

    constructor() {
        this.registerAll()
    }

    regCategory(name: string, category: Category) {
        this.categories.set(name, category)
        const cate = ((categories) => {
            return {
                get value() {
                    return categories.get(name)
                },
                set value(category: Category) {
                    categories.set(name, category)
                }
            }
        })(this.categories)
        return cate
    }

    getAlias(category: string, name: string) {
        const c = this.categories.get(category)
        return (c ? c.alia : '') + name
    }

    registerAll() {
        logger.info('Registering built-in categories')
        this.regCategory('core', { desc: '核心', alia: '~', icon: 'bug_report', unclosable: true })
        this.regCategory('module', { desc: '模块', alia: '*', icon: 'tunes', unclosable: false })
        this.regCategory('admin', { desc: '管理', alia: '!', icon: 'build', unclosable: false })
        this.regCategory('chore', { desc: '定时', alia: '@', icon: 'alarm', unclosable: true })
        this.regCategory('component', { desc: '组件', alia: '#', icon: 'widgets', unclosable: true })
    }
}

export const categoryMan = new CategoryManager()
