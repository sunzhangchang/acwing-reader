import { logger } from './utils'

export class CategoryManager {
    categories = new Map<string, Category>()

    constructor() {
        this.register()
    }

    reg(name: string, category: Category) {
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

    alias(name: string) {
        const c = this.categories.get(name)
        return c ? c.alia : ''
    }

    register() {
        logger.info('Registering built-in categories')
        this.reg('core', { desc: '核心', alia: '~', icon: 'bug_report', unclosable: true })
        this.reg('module', { desc: '模块', alia: '*', icon: 'tunes', unclosable: false })
        this.reg('admin', { desc: '管理', alia: '!', icon: 'build', unclosable: false })
        this.reg('chore', { desc: '定时', alia: '@', icon: 'alarm', unclosable: true })
        this.reg('component', { desc: '组件', alia: '#', icon: 'widgets', unclosable: true })
    }
}
