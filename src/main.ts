import { logger } from './utils'
import './allMods'
import { core } from './core'

core.preload()

$(() => {
    'use strict'
    logger.info('Launching')
    core.runMods()
})
