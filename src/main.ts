import core from './core'
import { logger } from './utils'

$(() => {
    'use strict'
    logger.info('Launching')
    core.run()
})
