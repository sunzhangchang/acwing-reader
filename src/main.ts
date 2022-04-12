import { core } from 'core'
import { logger } from './utils'
import 'allMods'

core.preload()

$(() => {
    'use strict'
    logger.info('Launching')
    core.runMods()
})
